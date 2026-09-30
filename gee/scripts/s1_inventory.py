from common import bbox_geometry, initialize_ee, load_yaml
import ee

def main():
    project = initialize_ee()
    aoi = load_yaml("configs/aoi.yaml")
    event = load_yaml("configs/events/michaung_2023.yaml")
    geometry = bbox_geometry(aoi)
    start = event["replay"]["start_utc"]
    end = event["replay"]["end_utc"]

    for label, asset in [
        ("Sentinel-1", "COPERNICUS/S1_GRD"),
        ("Sentinel-2", "COPERNICUS/S2_SR_HARMONIZED"),
    ]:
        col = ee.ImageCollection(asset).filterBounds(geometry).filterDate(start, end)
        print(f"{label}: {col.size().getInfo()} images | {start} to {end}")

    print("Project:", project)
    print("AOI:", aoi["name"])

if __name__ == "__main__":
    main()
