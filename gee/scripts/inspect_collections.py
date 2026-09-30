"""Minimal GEE collection smoke test for PRAVAAH."""
import os
import ee

project = os.getenv("GEE_PROJECT_ID")
if not project:
    raise SystemExit("Set GEE_PROJECT_ID before running this script.")
ee.Initialize(project=project)

collections = {
    "sentinel1": "COPERNICUS/S1_GRD",
    "srtm": "USGS/SRTMGL1_003",
    "dynamic_world": "GOOGLE/DYNAMICWORLD/V1",
    "chirps": "UCSB-CHG/CHIRPS/DAILY",
    "era5_land": "ECMWF/ERA5_LAND/HOURLY",
}
for name, asset in collections.items():
    try:
        if asset == "USGS/SRTMGL1_003":
            value = ee.Image(asset).bandNames().getInfo()
        else:
            value = ee.ImageCollection(asset).limit(1).size().getInfo()
        print(f"{name}: OK ({asset}) -> {value}")
    except Exception as exc:
        print(f"{name}: ERROR ({asset}) -> {exc}")
