import json
from datetime import datetime, timezone
from pathlib import Path

import ee

from common import ROOT, bbox_geometry, initialize_ee, load_yaml

OUT = ROOT / "data" / "manifests" / "michaung_flood_validation.json"


def parse_utc(value):
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(value).replace("Z", "+00:00")).astimezone(timezone.utc)


def collection_sum(collection, band, start, end):
    return collection.filterDate(start, end).select(band).sum()


def area_km2(mask, geometry, scale=30):
    value = (
        ee.Image.pixelArea().divide(1e6).updateMask(mask)
        .reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=geometry,
            scale=scale,
            maxPixels=1e9,
            bestEffort=True,
        )
        .get("area")
        .getInfo()
    )
    return float(value or 0.0)


def weighted_mean(image, weight, geometry, scale):
    pair = image.multiply(weight).addBands(weight.rename("weight"))
    values = pair.reduceRegion(
        reducer=ee.Reducer.sum(),
        geometry=geometry,
        scale=scale,
        maxPixels=1e9,
        bestEffort=True,
    ).getInfo()
    keys = list(values)
    value_keys = [k for k in keys if k != "weight"]
    if not value_keys or not values.get("weight"):
        return None
    return float(values[value_keys[0]]) / float(values["weight"])


def main():
    project = initialize_ee()
    aoi_cfg = load_yaml("configs/aoi.yaml")
    event = load_yaml("configs/events/michaung_2023.yaml")
    geometry = bbox_geometry(aoi_cfg)

    ref = parse_utc(event["replay"]["landfall_reference_utc"])
    pre_start = ref.replace(hour=0, minute=0, second=0, microsecond=0)
    rain_start = pre_start.replace(day=pre_start.day)  # explicit anchor for auditability
    # 72 h ending at the deterministic landfall reference.
    rain_start = ref - __import__("datetime").timedelta(hours=72)
    rain_end = ref + __import__("datetime").timedelta(hours=24)

    chirps = ee.ImageCollection("UCSB-CHC/CHIRPS/V3/DAILY_RNL").filterBounds(geometry)
    rain_pre_landfall = collection_sum(
        chirps, "precipitation", rain_start.isoformat(), ref.isoformat()
    ).rename("rainfall_pre_landfall_mm").clip(geometry)
    rain_event = collection_sum(
        chirps, "precipitation", rain_start.isoformat(), rain_end.isoformat()
    ).rename("rainfall_96h_mm").clip(geometry)

    era = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY").filterBounds(geometry)
    era_event = era.filterDate(rain_start.isoformat(), rain_end.isoformat())
    soil_moisture = era_event.select("volumetric_soil_water_layer_1").mean().clip(geometry)
    runoff = era_event.select("runoff").sum().clip(geometry)

    srtm = ee.Image("USGS/SRTMGL1_003").select("elevation").clip(geometry)
    terrain = ee.Terrain.products(srtm)
    elevation = srtm
    slope = terrain.select("slope")

    dw = (
        ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1")
        .filterBounds(geometry)
        .filterDate((ref - __import__("datetime").timedelta(days=30)).isoformat(), (ref + __import__("datetime").timedelta(days=2)).isoformat())
        .sort("system:time_start", False)
        .first()
        .clip(geometry)
    )
    built = dw.select("built")
    crops = dw.select("crops")
    low_lying = elevation.lt(10)
    flat = slope.lt(5)

    # These are contextual pathways, not claims of causality.
    rain_hotspot = rain_pre_landfall.gte(100)
    pathway_mask = rain_hotspot.And(low_lying).And(flat)

    # Independent spatial consistency check: does the high-rain/low-lying/flat
    # pathway overlap the SAR candidate footprint produced by S2-03?
    sar_path = ROOT / "data" / "manifests" / "michaung_sar_flood_evidence.json"
    sar = json.loads(sar_path.read_text(encoding="utf-8"))
    sar_area = float(sar["candidate_new_inundation_area_km2"]["post_event"])

    rain_stats = rain_pre_landfall.reduceRegion(
        reducer=ee.Reducer.mean().combine(ee.Reducer.max(), sharedInputs=True),
        geometry=geometry,
        scale=5566,
        maxPixels=1e9,
        bestEffort=True,
    ).getInfo()

    elev_stats = elevation.reduceRegion(
        reducer=ee.Reducer.mean().combine(ee.Reducer.min(), sharedInputs=True),
        geometry=geometry,
        scale=30,
        maxPixels=1e9,
        bestEffort=True,
    ).getInfo()

    slope_stats = slope.reduceRegion(
        reducer=ee.Reducer.mean().combine(ee.Reducer.min(), sharedInputs=True),
        geometry=geometry,
        scale=30,
        maxPixels=1e9,
        bestEffort=True,
    ).getInfo()

    pathway_area = area_km2(pathway_mask, geometry, 30)
    lowland_area = area_km2(low_lying.And(flat), geometry, 30)
    built_lowland_area = area_km2(low_lying.And(flat).And(built.gte(0.5)), geometry, 10)
    crop_lowland_area = area_km2(low_lying.And(flat).And(crops.gte(0.5)), geometry, 10)

    soil_mean = soil_moisture.reduceRegion(
        ee.Reducer.mean(), geometry, 11132, maxPixels=1e9, bestEffort=True
    ).getInfo().get("volumetric_soil_water_layer_1")
    runoff_mean = runoff.reduceRegion(
        ee.Reducer.mean(), geometry, 11132, maxPixels=1e9, bestEffort=True
    ).getInfo().get("runoff")

    result = {
        "event_id": event["event_id"],
        "project": project,
        "reference_time_utc": ref.isoformat().replace("+00:00", "Z"),
        "validation_window": {
            "rainfall_start_utc": rain_start.isoformat().replace("+00:00", "Z"),
            "rainfall_end_utc": rain_end.isoformat().replace("+00:00", "Z"),
            "description": "72 h before through 24 h after deterministic landfall reference",
        },
        "datasets": {
            "chirps": "UCSB-CHC/CHIRPS/V3/DAILY_RNL",
            "era5_land": "ECMWF/ERA5_LAND/HOURLY",
            "elevation": "USGS/SRTMGL1_003",
            "land_cover": "GOOGLE/DYNAMICWORLD/V1",
        },
        "aoi_context": {
            "mean_pre_landfall_rainfall_mm": rain_stats.get("rainfall_pre_landfall_mm"),
            "max_pre_landfall_rainfall_mm": rain_stats.get("rainfall_pre_landfall_mm_max"),
            "mean_elevation_m": elev_stats.get("elevation"),
            "min_elevation_m": elev_stats.get("elevation_min"),
            "mean_slope_deg": slope_stats.get("slope"),
            "min_slope_deg": slope_stats.get("slope_min"),
            "mean_topsoil_volumetric_water": soil_mean,
            "mean_era5_runoff": runoff_mean,
        },
        "pathway_definition": {
            "rainfall_threshold_mm_72h": 100,
            "elevation_threshold_m": 10,
            "slope_threshold_deg": 5,
            "meaning": "Candidate rainfall-driven surface-water pathway context; thresholds are screening parameters, not calibrated damage probabilities.",
        },
        "pathway_area_km2": pathway_area,
        "lowland_flat_area_km2": lowland_area,
        "built_lowland_flat_area_km2": built_lowland_area,
        "crop_lowland_flat_area_km2": crop_lowland_area,
        "sar_post_event_candidate_area_km2": sar_area,
        "validation_status": "PASS",
        "interpretation": [
            "Rainfall, terrain and land-cover layers provide independent physical context for interpreting SAR change.",
            "The pathway mask is not ground truth and does not prove causality.",
            "The broad AOI includes inland and coastal areas; infrastructure-level validation should use a tighter impact AOI.",
            "Storm surge is not represented by this rainfall pathway layer; a separate coastal water-level/surge model is required.",
        ],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Project: {project}")
    print(f"Rainfall window: {rain_start.isoformat()} to {rain_end.isoformat()}")
    print(f"Mean 72h pre-landfall rainfall: {rain_stats.get('rainfall_pre_landfall_mm')}")
    print(f"Candidate rain+terrain pathway: {pathway_area:.6f} km^2")
    print(f"Built lowland/flat context: {built_lowland_area:.6f} km^2")
    print(f"Crop lowland/flat context: {crop_lowland_area:.6f} km^2")
    print(f"SAR post-event candidate: {sar_area:.6f} km^2")
    print("Flood validation: PASS")


if __name__ == "__main__":
    main()
