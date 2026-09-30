from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]

def test_project_config():
    data = yaml.safe_load((ROOT / "configs/project.yaml").read_text())
    assert data["project"]["name"] == "PRAVAAH-AI"
    assert data["event"]["name"] == "Cyclone Michaung"
    assert data["modules"]["visualization_3d"] is True

def test_data_contract():
    data = yaml.safe_load((ROOT / "configs/data_contract.yaml").read_text())
    assert data["spatial"]["crs_internal"] == "EPSG:4326"
    assert "surge_depth_m" in data["outputs"]["hazard"]
    assert "model_version" in data["provenance_required"]
