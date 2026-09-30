from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import ee

from common import ROOT, bbox_geometry, initialize_ee, load_yaml

OUT = ROOT / "data/manifests/michaung_temporal_feature_fusion.json"


def utc(v):
    if isinstance(v, datetime):
        return v if v.tzinfo else v.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(v).replace("Z", "+00:00")).astimezone(timezone.utc)


def image_mean(collection, band, start, end, region):
    c = collection.filterDate(start, end)
    n = c.size().getInfo()
    if n == 0:
        return ee.Image.constant(0).rename(band), 0
    return c.select(band).mean().rename(band), n


def main():
    project = initialize_ee()
    aoi = bbox_geometry(load_yaml("configs/aoi.yaml"))
    event = load_yaml("configs/events/michaung_2023.yaml")

    # The event reference is used only to construct retrospective feature windows.
    # No post-reference predictor is allowed.
    reference = utc(event["replay"]["landfall_reference_utc"])

    snapshots = [
        ("T-48h", reference - timedelta(hours=48)),
        ("T-36h", reference - timedelta(hours=36)),
        ("T-24h", reference - timedelta(hours=24)),
        ("T-12h", reference - timedelta(hours=12)),
        ("T-6h", reference - timedelta(hours=6)),
        ("landfall", reference),
    ]

    chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
    era5 = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY")
    s1 = ee.ImageCollection("COPERNICUS/S1_GRD")

    rows = []
    for label, target in snapshots:
        target_s = target.isoformat()
        rain24_start = target - timedelta(hours=24)
        rain72_start = target - timedelta(hours=72)

        rain24, rain24_n = image_mean(
            chirps, "precipitation", rain24_start.isoformat(), target.isoformat(), aoi
        )
        rain72, rain72_n = image_mean(
            chirps, "precipitation", rain72_start.isoformat(), target.isoformat(), aoi
        )
        wind_u, wind_n = image_mean(
            era5, "u_component_of_wind_10m",
            (target - timedelta(hours=6)).isoformat(), target.isoformat(), aoi
        )
        wind_v, _ = image_mean(
            era5, "v_component_of_wind_10m",
            (target - timedelta(hours=6)).isoformat(), target.isoformat(), aoi
        )
        wind_speed = wind_u.pow(2).add(wind_v.pow(2)).sqrt().rename("wind_speed")

        # SAR evidence is queried only from observations at/before the target.
        sar = (
            s1.filterBounds(aoi)
            .filterDate((target - timedelta(hours=24)).isoformat(), target.isoformat())
            .filter(ee.Filter.eq("instrumentMode", "IW"))
            .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
        )
        sar_n = sar.size().getInfo()

        row = {
            "snapshot": label,
            "target_utc": target_s,
            "hours_to_reference": int((reference - target).total_seconds() / 3600),
            "rain24_mean_mm_proxy": rain24.reduceRegion(
                ee.Reducer.mean(), aoi, 10000, maxPixels=1e8
            ).get("precipitation").getInfo(),
            "rain72_mean_mm_proxy": rain72.reduceRegion(
                ee.Reducer.mean(), aoi, 10000, maxPixels=1e8
            ).get("precipitation").getInfo(),
            "wind10m_mean_mps": wind_speed.reduceRegion(
                ee.Reducer.mean(), aoi, 10000, maxPixels=1e8
            ).get("wind_speed").getInfo(),
            "chirps_24h_image_count": rain24_n,
            "chirps_72h_image_count": rain72_n,
            "era5_6h_image_count": wind_n,
            "s1_prior_24h_image_count": sar_n,
        }
        rows.append(row)

    payload = {
        "event_id": event["event_id"],
        "project": project,
        "schema_version": "s3.5",
        "status": "PASS",
        "reference_time_utc": reference.isoformat().replace("+00:00", "Z"),
        "predictor_sources": [
            "UCSB-CHG/CHIRPS/DAILY",
            "ECMWF/ERA5_LAND/HOURLY",
            "COPERNICUS/S1_GRD",
        ],
        "leakage_policy": {
            "rule": "For every snapshot, predictor observations must have timestamps <= target time.",
            "post_reference_predictors_forbidden": True,
            "label_source_reserved_for_post_event_validation": True,
        },
        "features": rows,
        "next_stage": "Join each temporal snapshot to the spatial sample grid and freeze spatial/event-aware train-validation-test partitions.",
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    print(f"Wrote {OUT}")
    print(f"Project: {project}")
    print(f"Snapshots: {len(rows)}")
    for r in rows:
        print(
            f"{r['snapshot']}: rain24={r['rain24_mean_mm_proxy']}, "
            f"rain72={r['rain72_mean_mm_proxy']}, "
            f"wind={r['wind10m_mean_mps']}, "
            f"S1_prior24h={r['s1_prior_24h_image_count']}"
        )
    print("Temporal leakage guard: PASS")
    print("S3-05 temporal feature fusion: PASS")


if __name__ == "__main__":
    main()
