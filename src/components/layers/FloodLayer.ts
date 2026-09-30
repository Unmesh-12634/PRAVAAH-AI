import * as Cesium from 'cesium';
import { InterpolatedCycloneState } from '../../simulation/cycloneAnimation';

export class FloodVisualizer {
  private viewer: Cesium.Viewer;
  private entities: Cesium.Entity[] = [];
  private surfaceEntities: Cesium.Entity[] = [];
  private isInitialized = false;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private initZones() {
    const floodZones: { name: string; polygon: [number, number][] }[] = [
      {
        name: "Godavari Lower Basin Inundation Zone",
        polygon: [
          [81.82, 16.92],
          [81.96, 17.02],
          [82.10, 16.98],
          [82.02, 16.85],
          [81.88, 16.82],
        ],
      },
      {
        name: "Yeleru Reservoir Overflow Corridor",
        polygon: [
          [82.14, 17.15],
          [82.26, 17.18],
          [82.28, 17.08],
          [82.18, 17.04],
        ],
      },
    ];

    floodZones.forEach((zone) => {
      const flat = zone.polygon.flatMap(([lon, lat]) => [lon, lat]);
      const positions = Cesium.Cartesian3.fromDegreesArray(flat);

      const surface = this.viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(positions),
          material: new Cesium.ColorMaterialProperty(
            new Cesium.Color(0.05, 0.45, 0.9, 0.25)
          ),
          classificationType: Cesium.ClassificationType.BOTH,
        },
      });
      this.entities.push(surface);
      this.surfaceEntities.push(surface);

      const border = this.viewer.entities.add({
        polyline: {
          positions,
          width: 2,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            color: Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.8),
          }),
        },
      });
      this.entities.push(border);
    });

    this.isInitialized = true;
  }

  public update(cycloneState: InterpolatedCycloneState, visible: boolean) {
    if (!this.isInitialized) {
      if (!visible) return;
      this.initZones();
    }

    this.entities.forEach((e) => {
      e.show = visible;
    });

    if (!visible) return;

    const { rainfall_mm } = cycloneState;
    const severityFactor = Math.min(1.0, rainfall_mm / 300);

    this.surfaceEntities.forEach((surface) => {
      if (surface.polygon) {
        (surface.polygon.material as any) = new Cesium.ColorMaterialProperty(
          new Cesium.Color(0.05, 0.45, 0.9, 0.2 + severityFactor * 0.25)
        );
      }
    });
  }

  public clear() {
    this.entities.forEach((e) => this.viewer.entities.remove(e));
    this.entities = [];
    this.surfaceEntities = [];
    this.isInitialized = false;
  }
}
