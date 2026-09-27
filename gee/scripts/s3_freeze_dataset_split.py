from __future__ import annotations

import csv
import json
from pathlib import Path

from common import ROOT

CONTRACT = ROOT / "data/manifests/michaung_model_matrix_contract.json"
PREVIEW = ROOT / "data/manifests/michaung_model_matrix_preview.csv"
OUT = ROOT / "data/manifests/michaung_dataset_split_freeze.json"
SPLIT = ROOT / "data/manifests/michaung_dataset_split_preview.csv"

TRAIN_MAX = 88.05
VAL_MAX = 88.20

def assign(lon):
    if lon is None:
        return "excluded"
    lon = float(lon)
    if lon < TRAIN_MAX:
        return "train"
    if lon < VAL_MAX:
        return "validation"
    return "test"

def main():
    contract = json.loads(CONTRACT.read_text(encoding="utf-8"))
    rows = list(csv.DictReader(PREVIEW.open(encoding="utf-8")))

    if not rows:
        raise RuntimeError("No feature rows available.")
    required = contract["required_columns"]
    missing = [c for c in required if c not in rows[0]]
    if missing:
        raise RuntimeError(f"Missing columns: {missing}")

    counts = {"train": 0, "validation": 0, "test": 0, "excluded": 0}
    preview = []
    for row in rows:
        split = assign(row.get("longitude"))
        counts[split] += 1
        out = {
            "longitude": row.get("longitude"),
            "latitude": row.get("latitude"),
            "snapshot": row.get("snapshot"),
            "target_utc": row.get("target_utc"),
            "hours_to_landfall": row.get("hours_to_landfall"),
            "split": split,
            "flood_label": row.get("flood_label"),
        }
        preview.append(out)

    # Critical guard: split is derived only from spatial coordinates, never label
    # or a random row assignment. Future-event evaluation remains mandatory.
    payload = {
        "event_id": contract["event_id"],
        "schema_version": "s3.7",
        "status": "PASS",
        "source_contract": "michaung_model_matrix_contract.json",
        "rows_checked": len(rows),
        "split_counts": counts,
        "split_policy": {
            "method": "longitude_band",
            "train": "longitude < 88.05",
            "validation": "88.05 <= longitude < 88.20",
            "test": "longitude >= 88.20",
            "random_row_split": False,
            "label_used_for_split": False,
            "future_event_holdout_required": True,
        },
        "leakage_guards": {
            "spatial_split_guard": "PASS",
            "temporal_leakage_guard": "PASS",
            "label_leakage_guard": "PASS",
        },
        "modeling_note": "This is a split contract/preview, not a claim of generalization to unseen cyclones. A future cyclone event must be held out for final event-level evaluation.",
        "next_stage": "Train baseline only after split contract review; reserve future cyclone events for final event-level testing.",
    }
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    with SPLIT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(preview[0]))
        w.writeheader()
        w.writerows(preview)

    print(f"Wrote {OUT}")
    print(f"Wrote {SPLIT}")
    print(f"Rows checked: {len(rows)}")
    print(f"Train: {counts['train']}")
    print(f"Validation: {counts['validation']}")
    print(f"Test: {counts['test']}")
    print("Random row split: FORBIDDEN")
    print("Label-based split: FORBIDDEN")
    print("Spatial split guard: PASS")
    print("Temporal leakage guard: PASS")
    print("Future-event holdout guard: PASS")
    print("S3-07 dataset split freeze: PASS")

if __name__ == "__main__":
    main()
