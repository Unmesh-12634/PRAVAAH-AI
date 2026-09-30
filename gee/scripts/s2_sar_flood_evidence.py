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


def choose_event_scenes(aoi, reference):
    # Select the actual available event sequence. The Dec 5 acquisition is
    # before the IMD landfall window, so it is explicitly an approach scene.
    collection = (
        homogeneous_s1(aoi, "2023-12-01T00:00:00", "2023-12-09T00:00:00")
        .filter(ee.Filter.eq("orbitProperties_pass", "DESCENDING"))
        .sort("system:time_start")
    )
    images = collection.toList(collection.size())
    infos = [scene_info(ee.Image(images.get(i))) for i in range(collection.size().getInfo())]

    def parse(ts):
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))

    pre_candidates = [x for x in infos if parse(x["acquisition_timestamp"]) < reference]
    post_candidates = [x for x in infos if parse(x["acquisition_timestamp"]) > reference]
    if not pre_candidates:
        raise RuntimeError("No pre-reference Sentinel-1 scene available.")
    if not post_candidates:
        raise RuntimeError("No post-reference Sentinel-1 scene available.")

    # Closest available scene before T0 = approach observation.
    near = min(pre_candidates, key=lambda x: abs((parse(x["acquisition_timestamp"]) - reference).total_seconds()))

    # Earlier scene is the pre-event baseline.
    earlier = [x for x in pre_candidates if parse(x["acquisition_timestamp"]) < datetime(2023, 12, 4, tzinfo=timezone.utc)]
    if not earlier:
        raise RuntimeError("No sufficiently earlier pre-event Sentinel-1 baseline available.")
    pre = min(earlier, key=lambda x: abs((parse(x["acquisition_timestamp"]) - datetime(2023, 12, 2, tzinfo=timezone.utc)).total_seconds()))

    # Closest available scene after T0 = post-event observation.
    post = min(post_candidates, key=lambda x: abs((parse(x["acquisition_timestamp"]) - datetime(2023, 12, 7, tzinfo=timezone.utc)).total_seconds()))
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

    pre_scene, near_scene, post_scene = choose_event_scenes(aoi, ref_dt)

    pre = get_image(pre_scene["asset_id"]).select(["VV", "VH"]).clip(aoi)
    near = get_image(near_scene["asset_id"]).select(["VV", "VH"]).clip(aoi)
    post = get_image(post_scene["asset_id"]).select(["VV", "VH"]).clip(aoi)

    # Light spatial smoothing reduces isolated speckle while retaining the
    # broad event-scale inundation signal.
    pre_vv = pre.select("VV").focal_mean(radius=20, units="meters")
    near_vv = near.select("VV").focal_mean(radius=20, units="meters")
    post_vv = post.select("VV").focal_mean(radius=20, units="meters")
    pre_vh = pre.select("VH").focal_mean(radius=20, units="meters")
    near_vh = near.select("VH").focal_mean(radius=20, units="meters")
    post_vh = post.select("VH").focal_mean(radius=20, units="meters")

    near_vv_change = near_vv.subtract(pre_vv).rename("near_landfall_vv_change_db")
    near_vh_change = near_vh.subtract(pre_vh).rename("near_landfall_vh_change_db")
    post_vv_change = post_vv.subtract(pre_vv).rename("post_event_vv_change_db")
    post_vh_change = post_vh.subtract(pre_vh).rename("post_event_vh_change_db")

    # Both polarizations must show a >2 dB reduction. This is an empirical
    # candidate threshold for this replay, not a universal flood threshold.
    near_candidate = near_vv_change.lt(-2.0).And(near_vh_change.lt(-2.0))
    post_candidate = post_vv_change.lt(-2.0).And(post_vh_change.lt(-2.0))

    # JRC historical water is used only to suppress persistent water from the
    # "new inundation" candidate. It is not treated as ground-truth flooding.
    occurrence = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select("occurrence")
    persistent_water = occurrence.gte(50)
    near_new = near_candidate.And(persistent_water.Not()).rename("near_landfall_new_inundation_candidate")
    post_new = post_candidate.And(persistent_water.Not()).rename("post_event_new_inundation_candidate")

    area_km2 = ee.Image.pixelArea().divide(1e6)

    def masked_area(mask):
        value = area_km2.updateMask(mask).reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=aoi,
            scale=10,
            maxPixels=1e9,
            bestEffort=True,
        ).get("area").getInfo()
        return float(value or 0.0)

    near_area = masked_area(near_new)
    post_area = masked_area(post_new)

    pre_dt = datetime.fromisoformat(pre_scene["acquisition_timestamp"].replace("Z", "+00:00"))
    near_dt = datetime.fromisoformat(near_scene["acquisition_timestamp"].replace("Z", "+00:00"))
    post_dt = datetime.fromisoformat(post_scene["acquisition_timestamp"].replace("Z", "+00:00"))

    result = {
        "event_id": event["event_id"],
        "project": project,
        "method": "Sentinel-1 descending VV/VH event-change experiment with JRC persistent-water masking",
        "reference_time_utc": ref_dt.isoformat().replace("+00:00", "Z"),
        "pre_scene": pre_scene,
        "near_landfall_scene": near_scene,
        "post_scene": post_scene,
        "temporal_note": "The near-landfall scene is the closest available Sentinel-1 acquisition before T0; it is not inside the IMD landfall window.",
        "orbit_comparison_note": "All selected scenes are descending IW dual-polarization observations, but relative orbits differ. Outputs are change evidence, not same-orbit interferometry.",
        "thresholds": {
            "vv_change_db_lt": -2.0,
            "vh_change_db_lt": -2.0,
            "persistent_water_occurrence_gte_percent": 50,
        },
        "scene_offsets_from_reference_hours": {
            "pre_event": (pre_dt - ref_dt).total_seconds() / 3600,
            "near_landfall_approach": (near_dt - ref_dt).total_seconds() / 3600,
            "post_event": (post_dt - ref_dt).total_seconds() / 3600,
        },
        "candidate_new_inundation_area_km2": {
            "near_landfall_approach": near_area,
            "post_event": post_area,
        },
        "interpretation": "Candidate evidence only. SAR change can arise from water, vegetation, soil moisture, roughness, acquisition geometry, or other surface changes.",
        "datasets": {
            "sentinel1": "COPERNICUS/S1_GRD",
            "jrc_surface_water": "JRC/GSW1_4/GlobalSurfaceWater",
        },
        "notes": [
            "Dec 2 is the pre-event baseline, Dec 5 is the closest available pre-landfall approach observation, and Dec 7 is post-event.",
            "Relative orbits differ; the pipeline does not claim interferometric equivalence.",
            "No observation is fabricated when coverage is absent.",
            "Validation against rainfall, terrain, land cover, and independent observations is required.",
        ],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Project: {project}")
    print(f"Pre scene:              {pre_scene['asset_id']} @ {pre_scene['acquisition_timestamp']}")
    print(f"Near-landfall approach: {near_scene['asset_id']} @ {near_scene['acquisition_timestamp']}")
    print(f"Post scene:             {post_scene['asset_id']} @ {post_scene['acquisition_timestamp']}")
    print(f"Offsets from T0: pre={pre_dt - ref_dt}, approach={near_dt - ref_dt}, post={post_dt - ref_dt}")
    print(f"Candidate new-inundation area: approach={near_area:.6f} km^2, post={post_area:.6f} km^2")


if __name__ == "__main__":
    main()
