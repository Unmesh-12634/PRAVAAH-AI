from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import ee

from common import bbox_geometry, initialize_ee, load_yaml

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "data" / "manifests" / "michaung_event_timeline.json"
OUT = ROOT / "data" / "manifests" / "michaung_sar_flood_evidence.json"


def db_to_linear(img: ee.Image) -> ee.Image:
    return ee.Image(10).pow(img.divide(10))


def linear_to_db(img: ee.Image) -> ee.Image:
    return img.log10().multiply(10)


def homogeneous_s1(aoi: ee.Geometry, start: str, end: str) -> ee.ImageCollection:
    return (
        ee.ImageCollection("COPERNICUS/S1_GRD")
        .filterBounds(aoi)
        .filterDate(start, end)
        .filter(ee.Filter.eq("instrumentMode", "IW"))
        .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
        .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VH"))
        .filter(ee.Filter.eq("resolution_meters", 10))
    )


def scene_info(img: ee.Image) -> dict:
    p = img.toDictionary([
        "system:index",
        "system:time_start",
        "orbitProperties_pass",
        "relativeOrbitNumber_start",
        "instrumentMode",
        "transmitterReceiverPolarisation",
    ]).getInfo()
    ts = datetime.fromtimestamp(p["system:time_start"] / 1000, tz=timezone.utc)
    return {
        "asset_id": p.get("system:index"),
        "acquisition_timestamp": ts.isoformat().replace("+00:00", "Z"),
        "orbit_pass": p.get("orbitProperties_pass"),
        "relative_orbit": p.get("relativeOrbitNumber_start"),
        "instrument_mode": p.get("instrumentMode"),
        "polarization": p.get("transmitterReceiverPolarisation"),
    }


def choose_event_scenes(aoi):
    # Michaung has descending Sentinel-1 coverage on Dec 2 (pre-event),
    # Dec 5 (near-landfall), and Dec 7 (post-event). The relative orbits
    # differ, so this is an event-change experiment, NOT a same-orbit
    # interferometric comparison.
    collection = (
        homogeneous_s1(aoi, "2023-12-01T00:00:00", "2023-12-09T00:00:00")
        .filter(ee.Filter.eq("orbitProperties_pass", "DESCENDING"))
        .sort("system:time_start")
    )

    images = collection.toList(collection.size())
    infos = [
        scene_info(ee.Image(images.get(i)))
        for i in range(collection.size().getInfo())
    ]

    def parse(ts):
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))

    def choose(candidates, target):
        if not candidates:
            raise RuntimeError(f"No Sentinel-1 scene available for {target}.")
        return min(candidates, key=lambda x: abs((parse(x["acquisition_timestamp"]) - target).total_seconds()))

    pre = choose(
        [x for x in infos if parse(x["acquisition_timestamp"]) < datetime(2023, 12, 5, 7, tzinfo=timezone.utc)],
        datetime(2023, 12, 2, tzinfo=timezone.utc),
    )
    near = choose(
        [x for x in infos if datetime(2023, 12, 5, 7, tzinfo=timezone.utc)
         <= parse(x["acquisition_timestamp"])
         <= datetime(2023, 12, 5, 9, tzinfo=timezone.utc)],
        datetime(2023, 12, 5, 8, tzinfo=timezone.utc),
    )
    post = choose(
        [x for x in infos if parse(x["acquisition_timestamp"]) > datetime(2023, 12, 5, 9, tzinfo=timezone.utc)],
        datetime(2023, 12, 7, tzinfo=timezone.utc),
    )
    return pre, near, post


def get_image(asset_id: str) -> ee.Image:
    return ee.Image("COPERNICUS/S1_GRD/" + asset_id)


def main():
    project = initialize_ee()
    aoi_cfg = load_yaml("configs/aoi.yaml")
    event = load_yaml("configs/events/michaung_2023.yaml")
    aoi = bbox_geometry(aoi_cfg)
    reference = event["replay"]["landfall_reference_utc"]

    if isinstance(reference, datetime):
        ref_dt = reference.replace(tzinfo=reference.tzinfo or timezone.utc).astimezone(timezone.utc)
    else:
        ref_dt = datetime.fromisoformat(str(reference).replace("Z", "+00:00")).astimezone(timezone.utc)

    pre_scene, near_scene, post_scene = choose_event_scenes(aoi)

    pre = get_image(pre_scene["asset_id"]).select(["VV", "VH"]).clip(aoi)
    near = get_image(near_scene["asset_id"]).select(["VV", "VH"]).clip(aoi)
    post = get_image(post_scene["asset_id"]).select(["VV", "VH"]).clip(aoi)

    pre_vv = pre.select("VV").focal_mean(radius=20, units="meters")
    near_vv = near.select("VV").focal_mean(radius=20, units="meters")
    post_vv = post.select("VV").focal_mean(radius=20, units="meters")
    pre_vh = pre.select("VH").focal_mean(radius=20, units="meters")
    near_vh = near.select("VH").focal_mean(radius=20, units="meters")
    post_vh = post.select("VH").focal_mean(radius=20, units="meters")

    near_change_db = near_vv.subtract(pre_vv).rename("near_landfall_vv_change_db")
    near_vh_change_db = near_vh.subtract(pre_vh).rename("near_landfall_vh_change_db")
    post_change_db = post_vv.subtract(pre_vv).rename("post_event_vv_change_db")
    post_vh_change_db = post_vh.subtract(pre_vh).rename("post_event_vh_change_db")

    near_candidate = (
        near_change_db.lt(-2.0)
        .And(near_vh_change_db.lt(-2.0))
        .rename("near_landfall_flood_candidate")
    )
    post_candidate = (
        post_change_db.lt(-2.0)
        .And(post_vh_change_db.lt(-2.0))
        .rename("post_event_flood_candidate")
    )

    gsw = ee.Image("JRC/GSW1_4/GlobalSurfaceWater")
    occurrence = gsw.select("occurrence")
    persistent_water = occurrence.gte(50)
    near_new = near_candidate.And(persistent_water.Not()).rename("near_landfall_new_inundation_candidate")
    post_new = post_candidate.And(persistent_water.Not()).rename("post_event_new_inundation_candidate")

    area_km2 = ee.Image.pixelArea().divide(1e6)
    near_area = area_km2.updateMask(near_new).reduceRegion(
        reducer=ee.Reducer.sum(), geometry=aoi, scale=10, maxPixels=1e9, bestEffort=True
    ).get("area").getInfo()
    post_area = area_km2.updateMask(post_new).reduceRegion(
        reducer=ee.Reducer.sum(), geometry=aoi, scale=10, maxPixels=1e9, bestEffort=True
    ).get("area").getInfo()


    pre = get_image(pre_scene["asset_id"]).select(["VV", "VH"]).clip(aoi)
    post = get_image(post_scene["asset_id"]).select(["VV", "VH"]).clip(aoi)

    # A light mean filter reduces isolated speckle while retaining the broad
    # inundation signal. Sentinel-1 GRD is already orbit-corrected,
    # radiometrically calibrated, noise-reduced and terrain-corrected by EE.
    pre_vv = pre.select("VV").focal_mean(radius=20, units="meters")
    post_vv = post.select("VV").focal_mean(radius=20, units="meters")
    pre_vh = pre.select("VH").focal_mean(radius=20, units="meters")
    post_vh = post.select("VH").focal_mean(radius=20, units="meters")

    vv_change_db = post_vv.subtract(pre_vv).rename("vv_change_db")
    vh_change_db = post_vh.subtract(pre_vh).rename("vh_change_db")

    # Flood candidate: a meaningful post-event reduction in VV/VH backscatter.
    # Thresholds are intentionally exposed as configuration-like constants;
    # they are not presented as universal physical thresholds.
    flood_candidate = (
        vv_change_db.lt(-2.0)
        .And(vh_change_db.lt(-2.0))
        .rename("flood_candidate")
    )

    # Historical water is a confounder, not flood truth. JRC occurrence
    # represents long-term water frequency through 2021, so pixels with high
    # occurrence are masked from the "new inundation" candidate layer.
    gsw = ee.Image("JRC/GSW1_4/GlobalSurfaceWater")
    occurrence = gsw.select("occurrence")
    persistent_water = occurrence.gte(50)
    new_inundation_candidate = flood_candidate.And(persistent_water.Not()).rename(
        "new_inundation_candidate"
    )

    # Dynamic World built/crops/roads-adjacent land classes are retained as
    # contextual layers for downstream exposure analysis.
    dw = (
        ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
        .filterBounds(aoi)
        .filterDate("2023-11-01", "2023-12-31")
        .select("label")
        .mode()
        .clip(aoi)
    )

    area_km2 = ee.Image.pixelArea().divide(1e6)
    candidate_area = area_km2.updateMask(new_inundation_candidate).reduceRegion(
        reducer=ee.Reducer.sum(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9,
        bestEffort=True,
    ).get("area").getInfo()

    result = {
        "event_id": event["event_id"],
        "project": project,
        "method": "Sentinel-1 descending VV/VH event-change experiment with JRC persistent-water masking",
        "reference_time_utc": ref_dt.isoformat().replace("+00:00", "Z"),
        "pre_scene": pre_scene,
        "near_landfall_scene": near_scene,
        "post_scene": post_scene,
        "orbit_comparison_note": "All selected scenes are descending IW dual-polarization observations, but relative orbits differ. Outputs are change evidence, not same-orbit interferometry.",
        "thresholds": {
            "vv_change_db_lt": -2.0,
            "vh_change_db_lt": -2.0,
            "persistent_water_occurrence_gte_percent": 50,
        },
        "candidate_new_inundation_area_km2": {
            "near_landfall": near_area,
            "post_event": post_area,
        },
        "interpretation": "Candidate evidence only. SAR change can arise from water, vegetation, soil moisture, roughness, acquisition geometry, or other surface changes.",
        "datasets": {
            "sentinel1": "COPERNICUS/S1_GRD",
            "jrc_surface_water": "JRC/GSW1_4/GlobalSurfaceWater",
        },
        "notes": [
            "Dec 2 is the pre-event baseline, Dec 5 is near-landfall, and Dec 7 is post-event.",
            "Relative orbits differ; the pipeline does not claim interferometric equivalence.",
            "No observation is fabricated when coverage is absent.",
            "Validation against rainfall, terrain, land cover, and independent observations is required.",
        ],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Project: {project}")
    print(f"Pre scene:  {pre_scene['asset_id']} @ {pre_scene['acquisition_timestamp']}")
    print(f"Post scene: {post_scene['asset_id']} @ {post_scene['acquisition_timestamp']}")
    print(f"Candidate new-inundation area: {candidate_area} km^2")


if __name__ == "__main__":
    main()
