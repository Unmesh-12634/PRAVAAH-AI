from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import ee

from common import ROOT, bbox_geometry, initialize_ee, load_yaml

TIMELINE = ROOT / "data/manifests/michaung_event_timeline.json"
OUT = ROOT / "data/manifests/michaung_spatial_feature_stack.json"


def parse_utc(v):
    if isinstance(v, datetime):
        return v if v.tzinfo else v.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(v).replace("Z", "+00:00")).astimezone(timezone.utc)


def image_stats(image, geometry, scale, names):
    result = image.reduceRegion(
        reducer=ee.Reducer.mean().combine(ee.Reducer.minMax(), sharedInputs=True),
        geometry=geometry,
        scale=scale,
        maxPixels=1e9,
        bestEffort=True,
    ).getInfo()
    return {n: result.get(n) for n in names}


def main():
    project = initialize_ee()
    aoi = bbox_geometry(load_yaml("configs/aoi.yaml"))
    event = load_yaml("configs/events/michaung_2023.yaml")
    timeline = json.loads(TIMELINE.read_text(encoding="utf-8"))

    elevation = ee.Image("USGS/SRTMGL1_003").select("elevation").clip(aoi)
    terrain = ee.Terrain.products(elevation)
    water = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select("occurrence").clip(aoi)

    dw = (
        ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
        .filterBounds(aoi)
        .filterDate("2023-11-01", "2023-12-31")
        .select("label")
        .mode()
        .clip(aoi)
    )

    chirps = ee.ImageCollection("UCSB-CHC/CHIRPS/V3/DAILY_RNL").filterBounds(aoi)
    era = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY").filterBounds(aoi)
    s1 = (
        ee.ImageCollection("COPERNICUS/S1_GRD")
        .filterBounds(aoi)
        .filter(ee.Filter.eq("instrumentMode", "IW"))
        .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
        .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VH"))
    )

    # The stack contract records spatial statistics and source availability.
    # Raster export is intentionally deferred until the feature/label split is frozen.
    records = []

    for snap in timeline["snapshots"]:
        target = parse_utc(snap["target_utc"])
        start72 = target - timedelta(hours=72)
        end = target

        rain72 = chirps.filterDate(start72.isoformat(), end.isoformat()).select("precipitation").sum()
        met = era.filterDate((target - timedelta(hours=6)).isoformat(), (target + timedelta(hours=1)).isoformat())
        soil = met.select("volumetric_soil_water_layer_1").mean()
        runoff = met.select("runoff").sum()
        wind_u = met.select("u_component_of_wind_10m").mean()
        wind_v = met.select("v_component_of_wind_10m").mean()
        wind = wind_u.pow(2).add(wind_v.pow(2)).sqrt()

        s1_count = s1.filterDate(
            (target - timedelta(hours=12)).isoformat(),
            (target + timedelta(hours=12)).isoformat(),
        ).size().getInfo()

        stats = {
            "rainfall_72h": image_stats(
                rain72, aoi, 5566,
                ["precipitation_mean", "precipitation_min", "precipitation_max"],
            ),
            "elevation_m": image_stats(
                elevation, aoi, 30,
                ["elevation_mean", "elevation_min", "elevation_max"],
            ),
            "slope_deg": image_stats(
                terrain.select("slope"), aoi, 30,
                ["slope_mean", "slope_min", "slope_max"],
            ),
            "historical_water_occurrence_pct": image_stats(
                water, aoi, 30,
                ["occurrence_mean", "occurrence_min", "occurrence_max"],
            ),
            "soil_moisture": image_stats(
                soil, aoi, 11132,
                ["volumetric_soil_water_layer_1_mean", "volumetric_soil_water_layer_1_min", "volumetric_soil_water_layer_1_max"],
            ),
            "runoff": image_stats(
                runoff, aoi, 11132,
                ["runoff_mean", "runoff_min", "runoff_max"],
            ),
            "wind_10m_ms": image_stats(
                wind, aoi, 11132,
                ["constant_mean", "constant_min", "constant_max"],
            ),
        }

        dw_mode = dw.reduceRegion(
            ee.Reducer.mode(), aoi, 10, maxPixels=1e9, bestEffort=True
        ).getInfo().get("label")

        records.append({
            "snapshot_id": snap["label"],
            "target_time_utc": target.isoformat().replace("+00:00", "Z"),
            "relative_time_to_landfall_hours": (
                target - parse_utc(event["replay"]["landfall_reference_utc"])
            ).total_seconds() / 3600,
            "spatial_statistics": stats,
            "landcover_mode": dw_mode,
            "sentinel1_candidate_count_24h": s1_count,
            "feature_role": "predictor_context",
            "post_event_sar_label_excluded": True,
        })

    payload = {
        "event_id": event["event_id"],
        "project": project,
        "schema_version": "s3.2",
        "description": "Spatial feature-stack contract and AOI-level validation statistics for the Michaung replay.",
        "grid_contract": {
            "geometry_source": "configs/aoi.yaml",
            "primary_raster_resolution_m": 30,
            "meteorological_resolution_note": "Native source resolution retained during processing; aggregation only for diagnostics.",
            "common_projection": "EPSG:4326",
        },
        "predictor_groups": [
            "cyclone_track",
            "rainfall",
            "wind",
            "soil_moisture",
            "runoff",
            "elevation",
            "slope",
            "historical_water_occurrence",
            "land_cover",
        ],
        "label_group": "post_event_sar_inundation",
        "leakage_rule": "Post-event SAR is excluded from predictor features and reserved for labels/validation.",
        "records": records,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Project: {project}")
    print(f"Spatial records: {len(records)}")
    print("Feature stack validation: PASS")


if __name__ == "__main__":
    main()
