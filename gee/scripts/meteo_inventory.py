from common import bbox_geometry, initialize_ee, load_yaml
import ee

def main():
    project = initialize_ee()
    aoi = load_yaml("configs/aoi.yaml")
    event = load_yaml("configs/events/michaung_2023.yaml")
    geometry = bbox_geometry(aoi)
    start = event["replay"]["start_utc"]
    end = event["replay"]["end_utc"]

    datasets = [
        ("CHIRPS-v3 Daily Reanalysis", "UCSB-CHC/CHIRPS/V3/DAILY_RNL", ["precipitation"]),
        ("ERA5-Land Hourly", "ECMWF/ERA5_LAND/HOURLY", [
            "temperature_2m",
            "dewpoint_temperature_2m",
            "total_precipitation_hourly",
            "u_component_of_wind_10m",
            "v_component_of_wind_10m",
        ]),
    ]

    for name, asset, required_bands in datasets:
        col = ee.ImageCollection(asset).filterBounds(geometry).filterDate(start, end)
        count = col.size().getInfo()
        print(f"{name}: {count} images | {start} to {end}")
        if count == 0:
            raise RuntimeError(f"{name} returned zero images for the configured AOI/event window.")

        available = col.first().bandNames().getInfo()
        missing = [band for band in required_bands if band not in available]
        print(f"{name} bands: {available}")
        if missing:
            raise RuntimeError(f"{name} is missing required bands: {missing}")

    print("Project:", project)
    print("AOI:", aoi["name"])
    print("Meteorological validation: PASS")

if __name__ == "__main__":
    main()
