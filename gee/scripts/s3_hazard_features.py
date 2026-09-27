from __future__ import annotations

import csv
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import ee

from common import ROOT, bbox_geometry, initialize_ee, load_yaml

TIMELINE = ROOT / "data" / "manifests" / "michaung_event_timeline.json"
OUT = ROOT / "data" / "manifests" / "michaung_hazard_features.json"


def parse_utc(value):
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(value).replace("Z", "+00:00")).astimezone(timezone.utc)


def track_rows():
    path = ROOT / "data" / "tracks" / "CYCLONE_MICHAUNG_2023.csv"
    with path.open("r", encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        raise RuntimeError("Michaung track is empty.")
    return rows


def nearest_track(rows, target):
    return min(rows, key=lambda r: abs(parse_utc(r["ISO_TIME"]) - target))


def regional_mean(image, geometry, scale):
    result = image.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=geometry,
        scale=scale,
        maxPixels=1e9,
        bestEffort=True,
    ).getInfo()
    return next(iter(result.values()), None)


def regional_max(image, geometry, scale):
    result = image.reduceRegion(
        reducer=ee.Reducer.max(),
        geometry=geometry,
        scale=scale,
        maxPixels=1e9,
        bestEffort=True,
    ).getInfo()
    return next(iter(result.values()), None)


def main():
    project = initialize_ee()
    aoi_cfg = load_yaml("configs/aoi.yaml")
    event = load_yaml("configs/events/michaung_2023.yaml")
    geometry = bbox_geometry(aoi_cfg)
    timeline = json.loads(TIMELINE.read_text(encoding="utf-8"))
    rows = track_rows()

    s1 = ee.ImageCollection("COPERNICUS/S1_GRD").filterBounds(geometry)
    chirps = ee.ImageCollection("UCSB-CHC/CHIRPS/V3/DAILY_RNL").filterBounds(geometry)
    era = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY").filterBounds(geometry)

    srtm = ee.Image("USGS/SRTMGL1_003").select("elevation").clip(geometry)
    terrain = ee.Terrain.products(srtm)
    dynamic_world = (
        ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
        .filterBounds(geometry)
        .filterDate("2023-11-01", "2023-12-31")
        .select("label")
        .mode()
        .clip(geometry)
    )
    water_occurrence = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select("occurrence").clip(geometry)

    records = []
    for snap in timeline["snapshots"]:
        target = parse_utc(snap["target_utc"])
        track = nearest_track(rows, target)
        rel_h = (target - parse_utc(event["replay"]["landfall_reference_utc"])).total_seconds() / 3600.0

        rainfall_24 = (
            chirps.filterDate((target - timedelta(hours=24)).isoformat(), target.isoformat())
            .select("precipitation").sum()
        )
        rainfall_72 = (
            chirps.filterDate((target - timedelta(hours=72)).isoformat(), target.isoformat())
            .select("precipitation").sum()
        )
        met = era.filterDate((target - timedelta(hours=6)).isoformat(), (target + timedelta(hours=1)).isoformat())

        wind_u = met.select("u_component_of_wind_10m").mean()
        wind_v = met.select("v_component_of_wind_10m").mean()
        wind_speed = wind_u.pow(2).add(wind_v.pow(2)).sqrt()
        soil = met.select("volumetric_soil_water_layer_1").mean()
        runoff = met.select("runoff").sum()

        record = {
            "event_id": event["event_id"],
            "snapshot_id": snap["label"],
            "target_time_utc": target.isoformat().replace("+00:00", "Z"),
            "relative_time_to_landfall_hours": rel_h,
            "track": {
                "lat": float(track["LAT"]),
                "lon": float(track["LON"]),
                "usa_wind_kt": float(track["USA_WIND"]) if track["USA_WIND"] not in ("", "NaN", "NA") else None,
                "usa_pressure_hpa": float(track["USA_PRES"]) if track["USA_PRES"] not in ("", "NaN", "NA") else None,
            },
            "meteorology": {
                "rainfall_24h_mm": regional_mean(rainfall_24, geometry, 5566),
                "rainfall_72h_mm": regional_mean(rainfall_72, geometry, 5566),
                "max_rainfall_24h_mm": regional_max(rainfall_24, geometry, 5566),
                "wind_10m_ms": regional_mean(wind_speed, geometry, 11132),
                "soil_moisture_layer1": regional_mean(soil, geometry, 11132),
                "runoff": regional_mean(runoff, geometry, 11132),
            },
            "terrain": {
                "mean_elevation_m": regional_mean(srtm, geometry, 30),
                "mean_slope_deg": regional_mean(terrain.select("slope"), geometry, 30),
            },
            "context": {
                "mean_historical_water_occurrence_pct": regional_mean(water_occurrence, geometry, 30),
                "dynamic_world_mode_label": dynamic_world.reduceRegion(
                    ee.Reducer.mode(), geometry, 10, maxPixels=1e9, bestEffort=True
                ).getInfo().get("label"),
            },
            "satellite_availability": {
                "sentinel1_count_24h": s1.filterDate(
                    (target - timedelta(hours=12)).isoformat(), (target + timedelta(hours=12)).isoformat()
                ).size().getInfo()
            },
            "provenance": {
                "track_source": "NOAA/NCEI IBTrACS v04r01",
                "rainfall_source": "UCSB-CHC/CHIRPS/V3/DAILY_RNL",
                "meteorology_source": "ECMWF/ERA5_LAND/HOURLY",
                "terrain_source": "USGS/SRTMGL1_003",
                "landcover_source": "GOOGLE/DYNAMICWORLD/V1",
                "water_source": "JRC/GSW1_4/GlobalSurfaceWater",
            },
        }
        records.append(record)

    result = {
        "event_id": event["event_id"],
        "project": project,
        "schema_version": "s3.1",
        "spatial_scope": aoi_cfg["name"],
        "temporal_leakage_guard": "Only observations at or before each snapshot target are used for predictive feature values.",
        "records": records,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Project: {project}")
    print(f"Feature records: {len(records)}")
    for r in records:
        print(
            f"{r['snapshot_id']}: "
            f"rain24={r['meteorology']['rainfall_24h_mm']}, "
            f"rain72={r['meteorology']['rainfall_72h_mm']}, "
            f"wind={r['meteorology']['wind_10m_ms']}, "
            f"S1_24h={r['satellite_availability']['sentinel1_count_24h']}"
        )


if __name__ == "__main__":
    main()
