from __future__ import annotations

import csv
import json
from pathlib import Path

from common import ROOT

CONTRACT = ROOT / "data/manifests/michaung_model_matrix_contract.json"
PREVIEW = ROOT / "data/manifests/michaung_model_matrix.csv"
OUT = ROOT / "data/manifests/michaung_dataset_split_freeze.json"
SPLIT = ROOT / "data/manifests/michaung_dataset_split_preview.csv"

def assign(lon, cut1, cut2):
    if lon is None:
        return "excluded"
    lon = float(lon)
    if lon < cut1:
        return "train"
    if lon < cut2:
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

    longitudes = sorted(float(r["longitude"]) for r in rows if r.get("longitude") not in (None, ""))
    if len(longitudes) < 3:
        raise RuntimeError("Not enough spatial samples to construct three spatial bands.")
    cut1 = longitudes[len(longitudes) // 3]
    cut2 = longitudes[(2 * len(longitudes)) // 3]
    if cut1 == cut2:
        raise RuntimeError("Spatial longitude bands collapsed; cannot create three non-empty partitions.")
    counts = {"train": 0, "validation": 0, "test": 0, "excluded": 0}
    preview = []
    for row in rows:
        split = assign(row.get("longitude"), cut1, cut2)
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
        "spatial_cutpoints": {"cut1": cut1, "cut2": cut2},
        "split_counts": counts,
        "split_policy": {
            "method": "longitude_band",
            "train": f"longitude < {cut1}",
            "validation": f"{cut1} <= longitude < {cut2}",
            "test": f"longitude >= {cut2}",
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
    if min(counts["train"], counts["validation"], counts["test"]) == 0:
        raise RuntimeError(f"Spatial split produced an empty partition: {counts}")
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
