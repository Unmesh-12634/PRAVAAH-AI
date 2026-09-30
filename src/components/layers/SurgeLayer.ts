import * as Cesium from 'cesium';
import { InterpolatedCycloneState } from '../../simulation/cycloneAnimation';

export class SurgeVisualizer {
  private viewer: Cesium.Viewer;
  private entities: Cesium.Entity[] = [];

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  public update(cycloneState: InterpolatedCycloneState, visible: boolean) {
    this.clear();
    if (!visible) return;

    const { surge_m } = cycloneState;

    // Coastal storm surge impact polylines & bathymetric shelf buffers
    // Real coordinates along the East Godavari / Kakinada / Uppada coastal vulnerability corridor
    const coastalSections: { name: string; coords: [number, number][] }[] = [
      {
        name: "Kakinada Bay & Anchorage Belt",
        coords: [
          [82.26, 16.85],
          [82.28, 16.92],
          [82.29, 16.98],
          [82.32, 17.05],
          [82.35, 17.12],
        ],
      },
      {
        name: "Coringa Mangrove Delta Lowland",
        coords: [
          [82.21, 16.78],
          [82.25, 16.83],
          [82.28, 16.90],
          [82.26, 16.94],
        ],
      },
    ];

    coastalSections.forEach((section) => {
      const positions = section.coords.map(([lon, lat]) =>
        Cesium.Cartesian3.fromDegrees(lon, lat, Math.max(2, surge_m * 2))
      );

      // Coastal surge overtopping ribbon
      const ribbon = this.viewer.entities.add({
        polyline: {
          positions,
          width: 8 + surge_m * 2,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.5,
            taperPower: 0.7,
            color: Cesium.Color.fromCssColorString('#0df2c9').withAlpha(0.85),
          }),
        },
      });
      this.entities.push(ribbon);

      // Midpoint tag with surge height - distance limited so it only appears when zoomed close
      const midIdx = Math.floor(section.coords.length / 2);
      const mid = section.coords[midIdx];
      const tag = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(mid[0], mid[1], 15),
        label: {
          text: `STORM SURGE: +${surge_m}m\n${section.name}`,
          font: 'bold 10px "JetBrains Mono", monospace',
          fillColor: Cesium.Color.fromCssColorString('#0df2c9'),
          outlineColor: Cesium.Color.fromCssColorString('#060a11'),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 35000), // Clean: only shows when zoomed close (<35km)
        },
      });
      this.entities.push(tag);
    });

    // 2. Dynamic Inland Inundation Polygon (Expanding inland based on surge height)
    const inlandSurgeExpansion = (surge_m / 3.0) * 0.04;
    const inundationCoords: [number, number][] = [
      [82.23 - inlandSurgeExpansion, 16.82],
      [82.26, 16.82],
      [82.30, 16.96],
      [82.25 - inlandSurgeExpansion, 16.96],
      [82.22 - inlandSurgeExpansion, 16.88],
    ];

    const flat = inundationCoords.flatMap(([x, y]) => [x, y]);
    const positions = Cesium.Cartesian3.fromDegreesArray(flat);

    const surgeInundationMesh = this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(positions),
        material: new Cesium.ColorMaterialProperty(
          new Cesium.Color(0.05, 0.75, 0.85, 0.28 + (surge_m / 6.0) * 0.3)
        ),
        classificationType: Cesium.ClassificationType.BOTH,
      },
    });
    this.entities.push(surgeInundationMesh);
  }

  public clear() {
    this.entities.forEach((e) => this.viewer.entities.remove(e));
    this.entities = [];
  }
}
