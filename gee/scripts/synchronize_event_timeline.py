from __future__ import annotations

import csv
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import ee

from common import bbox_geometry, initialize_ee, load_yaml

ROOT = Path(__file__).resolve().parents[2]
TRACK = ROOT / "data" / "tracks" / "CYCLONE_MICHAUNG_2023.csv"
OUT = ROOT / "data" / "manifests" / "michaung_event_timeline.json"

FMT = "%Y-%m-%d %H:%M:%S"


def parse_time(value: str) -> datetime:
    value = value.strip().replace("Z", "+00:00")
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def read_track():
    with TRACK.open("r", encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        raise RuntimeError("Michaung track is empty.")
    return rows


def nearest_track_row(rows, target):
    return min(rows, key=lambda r: abs(parse_time(r["ISO_TIME"]) - target))


def ee_candidates(collection, geometry, start, end, sensor):
    features = (
        collection.filterBounds(geometry)
        .filterDate(start.isoformat(), end.isoformat())
        .sort("system:time_start")
        .getInfo()["features"]
    )
    out = []
    for item in features:
        p = item.get("properties", {})
        ts = datetime.fromtimestamp(
            p["system:time_start"] / 1000, tz=timezone.utc
        )
        rec = {
            "asset_id": item["id"],
            "acquisition_timestamp": ts.isoformat().replace("+00:00", "Z"),
            "sensor": sensor,
        }
        if sensor == "sentinel-1":
            rec.update({
                "orbit_pass": p.get("orbitProperties_pass"),
                "instrument_mode": p.get("instrumentMode"),
                "polarization": p.get("transmitterReceiverPolarisation"),
                "relative_orbit": p.get("relativeOrbitNumber_start"),
            })
        elif sensor == "sentinel-2":
            rec.update({
                "cloud_percentage": p.get("CLOUDY_PIXEL_PERCENTAGE"),
                "mgrs_tile": p.get("MGRS_TILE"),
            })
        out.append(rec)
    return out


def main():
    project = initialize_ee()
    aoi = load_yaml("configs/aoi.yaml")
    event = load_yaml("configs/events/michaung_2023.yaml")
    geometry = bbox_geometry(aoi)
    rows = read_track()

    # Reference time is derived from the latest best-track record in the
    # configured replay window. This is a reproducible event anchor, not a
    # claim about the exact physical instant of landfall.
    start = min(parse_time(r["ISO_TIME"]) for r in rows)
    end = max(parse_time(r["ISO_TIME"]) for r in rows)
    reference = end

    labels = [-48, -36, -24, -12, -6, 0, 6, 12, 24]
    s1 = ee.ImageCollection("COPERNICUS/S1_GRD")
    s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")

    snapshots = []
    for offset in labels:
        target = reference + timedelta(hours=offset)
        track = nearest_track_row(rows, target)
        window_start = target - timedelta(hours=12)
        window_end = target + timedelta(hours=12)
        snapshots.append({
            "label": f"T{offset:+d}h",
            "target_utc": target.isoformat().replace("+00:00", "Z"),
            "search_window_utc": {
                "start": window_start.isoformat().replace("+00:00", "Z"),
                "end": window_end.isoformat().replace("+00:00", "Z"),
            },
            "nearest_track_observation": {
                "ISO_TIME": track["ISO_TIME"],
                "LAT": track["LAT"],
                "LON": track["LON"],
                "USA_WIND": track["USA_WIND"],
                "USA_PRES": track["USA_PRES"],
            },
            "sentinel1": ee_candidates(s1, geometry, window_start, window_end, "sentinel-1"),
            "sentinel2": ee_candidates(s2, geometry, window_start, window_end, "sentinel-2"),
        })

    manifest = {
        "event_id": event["event_id"],
        "project": project,
        "aoi": aoi["name"],
        "reference_time_utc": reference.isoformat().replace("+00:00", "Z"),
        "reference_definition": "latest timestamp in the verified Michaung IBTrACS subset; this is a replay anchor and not independently asserted landfall time",
        "track_source": "NOAA/NCEI IBTrACS v04r01",
        "snapshots": snapshots,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Project: {project}")
    print(f"Reference time: {manifest['reference_time_utc']}")
    print(f"Snapshots: {len(snapshots)}")
    for s in snapshots:
        print(f"{s['label']}: S1={len(s['sentinel1'])}, S2={len(s['sentinel2'])}, track={s['nearest_track_observation']['ISO_TIME']}")


if __name__ == "__main__":
    main()
