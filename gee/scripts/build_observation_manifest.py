from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import ee

from common import bbox_geometry, initialize_ee, load_yaml

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "manifests" / "michaung_observations.json"


def iso(ts_ms: int) -> str:
    return datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc).isoformat().replace("+00:00", "Z")


def list_s1(collection: ee.ImageCollection, start: str, end: str) -> list[dict]:
    items = collection.filterDate(start, end).sort("system:time_start").getInfo()["features"]
    out = []
    for item in items:
        p = item["properties"]
        out.append({
            "asset_id": item["id"],
            "acquisition_timestamp": iso(p["system:time_start"]),
            "polarization": p.get("transmitterReceiverPolarisation"),
            "orbit_pass": p.get("orbitProperties_pass"),
            "instrument_mode": p.get("instrumentMode"),
            "relative_orbit": p.get("relativeOrbitNumber_start"),
            "product_type": p.get("productType"),
            "selection_role": "candidate",
        })
    return out


def list_s2(collection: ee.ImageCollection, start: str, end: str) -> list[dict]:
    items = collection.filterDate(start, end).sort("CLOUDY_PIXEL_PERCENTAGE").limit(50).getInfo()["features"]
    out = []
    for item in items:
        p = item["properties"]
        out.append({
            "asset_id": item["id"],
            "acquisition_timestamp": iso(p["system:time_start"]),
            "cloud_percentage": p.get("CLOUDY_PIXEL_PERCENTAGE"),
            "mgrs_tile": p.get("MGRS_TILE"),
            "processing_baseline": p.get("PROCESSING_BASELINE"),
            "selection_role": "candidate",
        })
    return out


def main() -> None:
    project = initialize_ee()
    aoi = load_yaml("configs/aoi.yaml")
    event = load_yaml("configs/events/michaung_2023.yaml")
    geometry = bbox_geometry(aoi)

    # A 12-hour search window around each replay snapshot keeps the manifest
    # compact while retaining nearby acquisitions.
    track_path = ROOT / "data" / "tracks" / "CYCLONE_MICHAUNG_2023.csv"
    track_rows = track_path.read_text(encoding="utf-8").splitlines()[1:]

    s1 = ee.ImageCollection("COPERNICUS/S1_GRD").filterBounds(geometry)
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED").filterBounds(geometry)

    snapshots = []
    for snap in event["replay"]["snapshots"]:
        # The snapshot timestamps will be anchored to the documented event
        # timeline in the next stage once landfall time is formalized from
        # the historical track. For now we emit the declared snapshot labels.
        snapshots.append({
            "label": snap["label"],
            "offset_hours": snap["offset_hours"],
        })

    manifest = {
        "event_id": event["event_id"],
        "project": project,
        "aoi": aoi["name"],
        "generated_at_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "snapshots": snapshots,
        "sentinel1_candidate_count": s1.filterDate(event["replay"]["start_utc"], event["replay"]["end_utc"]).size().getInfo(),
        "sentinel2_candidate_count": s2.filterDate(event["replay"]["start_utc"], event["replay"]["end_utc"]).size().getInfo(),
        "notes": [
            "This is an inventory stage, not final best-image selection.",
            "Snapshot timestamps will be synchronized to the verified historical track in the next stage.",
        ],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Project: {project}")
    print(f"Sentinel-1 candidates: {manifest['sentinel1_candidate_count']}")
    print(f"Sentinel-2 candidates: {manifest['sentinel2_candidate_count']}")


if __name__ == "__main__":
    main()
