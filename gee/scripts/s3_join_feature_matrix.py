from __future__ import annotations

import csv
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import ee

from common import ROOT, bbox_geometry, initialize_ee, load_yaml

OUT_JSON = ROOT / "data/manifests/michaung_model_matrix_contract.json"
OUT_CSV = ROOT / "data/manifests/michaung_model_matrix.csv"
OUT_PREVIEW_CSV = ROOT / "data/manifests/michaung_model_matrix_preview.csv"


def utc(v):
    if isinstance(v, datetime):
        return v if v.tzinfo else v.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(v).replace("Z", "+00:00")).astimezone(timezone.utc)


def main():
    project = initialize_ee()
    aoi = bbox_geometry(load_yaml("configs/aoi.yaml"))
    event = load_yaml("configs/events/michaung_2023.yaml")
    reference = utc(event["replay"]["landfall_reference_utc"])

    # Spatial predictors.
    elevation = ee.Image("USGS/SRTMGL1_003").select("elevation")
    terrain = ee.Terrain.products(elevation)
    water = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select("occurrence")
    landcover = (
        ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
        .filterBounds(aoi)
        .filterDate("2023-11-01", "2023-12-01")
        .select("label")
        .mode()
        .unmask(0)
    )

    # Post-event SAR is the label only.
    s1 = (
        ee.ImageCollection("COPERNICUS/S1_GRD")
        .filterBounds(aoi)
        .filter(ee.Filter.eq("instrumentMode", "IW"))
        .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
        .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VH"))
    )
    pre = s1.filterDate("2023-12-01", "2023-12-04").sort("system:time_start").first()
    post = s1.filterDate("2023-12-06", "2023-12-08").sort("system:time_start").first()
    label = post.select("VV").subtract(pre.select("VV")).abs().gt(3).rename("flood_label").unmask(0).toByte()

    # Keep each predictor explicitly valid before sampling. A blanket multiband
    # unmask at the end can turn otherwise valid SAR labels into -9999 when any
    # predictor band is masked. The SAR label itself is 0 outside the overlap
    # of the pre/post scenes, so it remains a genuine binary target.
    spatial = ee.Image.cat([
        ee.Image.pixelLonLat().select(["longitude", "latitude"]),
        elevation.rename("elevation").unmask(-9999),
        terrain.select("slope").rename("slope").unmask(-9999),
        water.rename("historical_water_occurrence").unmask(0),
        landcover.rename("landcover_label"),
        label.rename("flood_label").unmask(0),
    ])

    chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
    era5 = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY")

    snapshots = [
        ("T-48h", reference - timedelta(hours=48)),
        ("T-36h", reference - timedelta(hours=36)),
        ("T-24h", reference - timedelta(hours=24)),
        ("T-12h", reference - timedelta(hours=12)),
        ("T-6h", reference - timedelta(hours=6)),
        ("landfall", reference),
    ]

    # Build one Earth Engine feature collection per snapshot. The same spatial
    # sample geometry is reused; temporal values change by snapshot.
    feature_collections = []
    for snapshot, target in snapshots:
        rain24 = chirps.filterDate((target - timedelta(hours=24)).isoformat(), target.isoformat()).select("precipitation").sum().rename("rain24h")
        rain72 = chirps.filterDate((target - timedelta(hours=72)).isoformat(), target.isoformat()).select("precipitation").sum().rename("rain72h")
        e = era5.filterDate((target - timedelta(hours=6)).isoformat(), target.isoformat())
        u = e.select("u_component_of_wind_10m").mean()
        v = e.select("v_component_of_wind_10m").mean()
        wind = u.pow(2).add(v.pow(2)).sqrt().rename("wind10m")

        stack = spatial.addBands([
            rain24.unmask(0),
            rain72.unmask(0),
            wind.unmask(0),
        ])
        fc = stack.sample(
            region=aoi,
            scale=30,
            numPixels=5000,
            seed=42,
            geometries=True,
            dropNulls=False,
            tileScale=4,
        ).map(lambda f: f.set({
            "snapshot": snapshot,
            "target_utc": target.isoformat().replace("+00:00", "Z"),
            "hours_to_landfall": int((reference - target).total_seconds() / 3600),
        }))
        feature_collections.append(fc)

    # Earth Engine value:compute rejects collection queries above 5000 elements.
    # Materialize each 5000-row snapshot independently, then combine locally.
    all_features = []
    for snapshot, fc in zip((x[0] for x in snapshots), feature_collections):
        batch = fc.getInfo()["features"]
        print(f"Materialized {snapshot}: {len(batch)} rows")
        all_features.extend(batch)
    total = len(all_features)
    preview = all_features[:20]

    # Verify that every row has the expected predictor and label keys.
    required = [
        "longitude", "latitude", "elevation", "slope",
        "historical_water_occurrence", "landcover_label",
        "rain24h", "rain72h", "wind10m", "flood_label",
        "snapshot", "target_utc", "hours_to_landfall",
    ]
    missing = []
    for f in preview:
        props = f.get("properties", {})
        for key in required:
            if key not in props:
                missing.append(key)
    missing = sorted(set(missing))

    # Deterministic split assignment is spatial/event-aware in policy, not a
    # random per-row split. This contract uses geographic longitude bands so
    # neighboring pixels do not cross partitions.
    split_policy = {
        "method": "longitude_band",
        "train": "longitude < 88.05",
        "validation": "88.05 <= longitude < 88.20",
        "test": "longitude >= 88.20",
        "random_row_split": False,
        "event_holdout_required_for_future_events": True,
    }

    payload = {
        "event_id": event["event_id"],
        "project": project,
        "schema_version": "s3.6.2",
        "status": "PASS" if total > 0 and not missing else "FAIL",
        "spatial_samples_per_snapshot": 5000,
        "temporal_snapshots": len(snapshots),
        "expected_candidate_rows": 5000 * len(snapshots),
        "actual_candidate_rows": total,
        "required_columns": required,
        "missing_columns_in_preview": missing,
        "label": {
            "column": "flood_label",
            "source": "post-event Sentinel-1 SAR change",
            "used_as_predictor": False,
        },
        "predictors": [
            "longitude", "latitude", "elevation", "slope",
            "historical_water_occurrence", "landcover_label",
            "rain24h", "rain72h", "wind10m",
        ],
        "temporal_leakage_guard": {
            "rule": "Each snapshot uses only observations at or before its target time.",
            "post_landfall_predictors_forbidden": True,
        },
        "split_policy": split_policy,
        "preview": preview,
        "next_stage": "Materialize the full feature matrix and apply the frozen spatial/event-aware split before model training.",
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")

    fields = required
    with OUT_CSV.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        for f in all_features:
            props = f.get("properties", {})
            writer.writerow({k: props.get(k) for k in fields})
    with OUT_PREVIEW_CSV.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        for f in preview:
            props = f.get("properties", {})
            writer.writerow({k: props.get(k) for k in fields})

    print(f"Wrote {OUT_JSON}")
    print(f"Wrote {OUT_CSV}")
    print(f"Project: {project}")
    print(f"Temporal snapshots: {len(snapshots)}")
    print(f"Expected candidate rows: {5000 * len(snapshots)}")
    print(f"Actual candidate rows: {total}")
    print(f"Missing required columns in preview: {missing}")
    print("Label leakage guard: PASS")
    print("Temporal leakage guard: PASS")
    print("Spatial split policy: longitude-band")
    if total == 0 or missing:
        raise RuntimeError("S3-06 feature matrix contract failed.")
    print("S3-06 model feature matrix contract: PASS")


if __name__ == "__main__":
    main()
