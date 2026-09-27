from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import average_precision_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score

from common import ROOT

MATRIX = ROOT / "data/manifests/michaung_model_matrix.csv"
SPLIT = ROOT / "data/manifests/michaung_dataset_split_freeze.json"
MODEL_DIR = ROOT / "data/models"
MODEL_OUT = MODEL_DIR / "michaung_flood_baseline.joblib"
METRICS_OUT = ROOT / "data/manifests/michaung_model_training.json"

FEATURES = [
    "longitude", "latitude", "elevation", "slope",
    "historical_water_occurrence", "landcover_label",
    "rain24h", "rain72h", "wind10m", "hours_to_landfall",
]
LABEL = "flood_label"


def evaluate(model, x, y):
    pred = model.predict(x)
    prob = model.predict_proba(x)[:, 1]
    return {
        "rows": int(len(y)),
        "positive_labels": int(y.sum()),
        "positive_rate": float(y.mean()),
        "roc_auc": float(roc_auc_score(y, prob)) if y.nunique() == 2 else None,
        "pr_auc": float(average_precision_score(y, prob)) if y.nunique() == 2 else None,
        "precision": float(precision_score(y, pred, zero_division=0)),
        "recall": float(recall_score(y, pred, zero_division=0)),
        "f1": float(f1_score(y, pred, zero_division=0)),
        "confusion_matrix": confusion_matrix(y, pred).tolist(),
    }


def main():
    if not MATRIX.exists() or not SPLIT.exists():
        raise RuntimeError("S3-06 model matrix and S3-07 split freeze are required.")

    df = pd.read_csv(MATRIX)
    freeze = json.loads(SPLIT.read_text(encoding="utf-8"))
    cuts = freeze["spatial_cutpoints"]
    cut1, cut2 = float(cuts["cut1"]), float(cuts["cut2"])

    required = FEATURES + [LABEL, "snapshot", "target_utc"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise RuntimeError(f"Missing required columns: {missing}")
    if df[FEATURES + [LABEL]].isnull().any().any():
        raise RuntimeError("Null values found in model predictors/label.")
    if not set(df[LABEL].unique()).issubset({0, 1}):
        raise RuntimeError("flood_label must contain only 0/1.")

    # Reproduce the frozen spatial split exactly. No labels or random assignment.
    df["_split"] = np.select(
        [df["longitude"] < cut1, df["longitude"] < cut2],
        ["train", "validation"],
        default="test",
    )
    expected = freeze["split_counts"]
    actual = df["_split"].value_counts().to_dict()
    for name in ("train", "validation", "test"):
        if int(actual.get(name, 0)) != int(expected[name]):
            raise RuntimeError(f"Frozen split mismatch for {name}: expected {expected[name]}, got {actual.get(name, 0)}")

    x_train = df.loc[df["_split"] == "train", FEATURES]
    y_train = df.loc[df["_split"] == "train", LABEL]
    x_val = df.loc[df["_split"] == "validation", FEATURES]
    y_val = df.loc[df["_split"] == "validation", LABEL]
    x_test = df.loc[df["_split"] == "test", FEATURES]
    y_test = df.loc[df["_split"] == "test", LABEL]

    if y_train.nunique() < 2:
        raise RuntimeError("Training split contains only one label class.")

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(x_train, y_train)

    val_metrics = evaluate(model, x_val, y_val)
    test_metrics = evaluate(model, x_test, y_test)

    payload = {
        "event_id": freeze["event_id"],
        "schema_version": "s3.8",
        "status": "PASS",
        "source_matrix": MATRIX.name,
        "source_split_freeze": SPLIT.name,
        "model": {
            "type": "RandomForestClassifier",
            "n_estimators": 300,
            "max_depth": 12,
            "min_samples_leaf": 5,
            "class_weight": "balanced",
            "random_state": 42,
        },
        "features": FEATURES,
        "excluded_metadata_columns": ["snapshot", "target_utc"],
        "split_counts": {k: int(actual.get(k, 0)) for k in ("train", "validation", "test")},
        "validation_metrics": val_metrics,
        "test_metrics": test_metrics,
        "guards": {
            "random_row_split": "FORBIDDEN",
            "label_based_split": "FORBIDDEN",
            "spatial_split": "PASS",
            "test_rows_used_for_training": "PASS",
            "future_event_holdout": "REQUIRED_FOR_FINAL_GENERALIZATION",
        },
        "note": "Single-event baseline. Held-out test metrics are spatial-within-event metrics, not unseen-cyclone generalization.",
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "features": FEATURES, "event_id": freeze["event_id"]}, MODEL_OUT)
    METRICS_OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    print(f"Wrote {MODEL_OUT}")
    print(f"Wrote {METRICS_OUT}")
    print(f"Features: {len(FEATURES)}")
    print(f"Train: {len(y_train)} | Validation: {len(y_val)} | Test: {len(y_test)}")
    print(f"Validation: ROC-AUC={val_metrics['roc_auc']}, PR-AUC={val_metrics['pr_auc']}, F1={val_metrics['f1']}")
    print(f"Test: ROC-AUC={test_metrics['roc_auc']}, PR-AUC={test_metrics['pr_auc']}, F1={test_metrics['f1']}")
    print("Random row split: FORBIDDEN")
    print("Label-based split: FORBIDDEN")
    print("Test rows used for training: PASS")
    print("S3-08 baseline model training: PASS")


if __name__ == "__main__":
    main()
