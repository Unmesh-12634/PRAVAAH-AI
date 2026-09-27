import ee
from common import bbox_geometry, initialize_ee, load_yaml

def main():
    project = initialize_ee()
    aoi = load_yaml("configs/aoi.yaml")
    geometry = bbox_geometry(aoi)

    srtm = ee.Image("USGS/SRTMGL1_003").clip(geometry)
    dw = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1").filterBounds(geometry).sort("system:time_start", False).first()
    water = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select("occurrence").clip(geometry)

    print("Project:", project)
    print("SRTM bands:", srtm.bandNames().getInfo())
    print("Dynamic World bands:", dw.bandNames().getInfo())
    print("JRC water bands:", water.bandNames().getInfo())

if __name__ == "__main__":
    main()
