from pathlib import Path
from typing import Any
import os
import ee
import yaml

ROOT = Path(__file__).resolve().parents[2]

def load_yaml(relative_path: str) -> dict[str, Any]:
    with (ROOT / relative_path).open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def initialize_ee() -> str:
    project = os.getenv("GEE_PROJECT_ID")
    if not project:
        raise RuntimeError("GEE_PROJECT_ID is not set.")
    ee.Initialize(project=project)
    return project

def bbox_geometry(aoi: dict[str, Any]) -> ee.Geometry:
    b = aoi["bbox"]
    return ee.Geometry.Rectangle(
        [b["min_lon"], b["min_lat"], b["max_lon"], b["max_lat"]],
        geodesic=False,
    )
