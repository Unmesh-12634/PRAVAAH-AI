import * as Cesium from 'cesium';
import { InterpolatedCycloneState } from '../../simulation/cycloneAnimation';
import { generateCircleCoordinates } from '../../simulation/geographicUtils';

export class RainfallVisualizer {
  private viewer: Cesium.Viewer;
  private ringEntities: Cesium.Entity[] = [];
  private isInitialized = false;

  private bandConfigs = [
    {
      factor: 1.0,
      lineColor: Cesium.Color.fromCssColorString('#00d2ff').withAlpha(0.6),
    },
    {
      factor: 0.65,
      lineColor: Cesium.Color.fromCssColorString('#10b981').withAlpha(0.7),
    },
    {
      factor: 0.35,
      lineColor: Cesium.Color.fromCssColorString('#ef4444').withAlpha(0.85),
    },
  ];

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private initRings(lat: number, lon: number, rainfallRadiusKm: number) {
    this.bandConfigs.forEach((band) => {
      const radius = rainfallRadiusKm * band.factor;
      const coords = generateCircleCoordinates(lat, lon, radius, 48);
      const flat = coords.flatMap(([x, y]) => [x, y]);
      const positions = Cesium.Cartesian3.fromDegreesArray(flat);

      const outline = this.viewer.entities.add({
        polyline: {
          positions,
          width: 1.5,
          material: new Cesium.PolylineDashMaterialProperty({
            color: band.lineColor,
            dashLength: 14.0,
          }),
        },
      });
      this.ringEntities.push(outline);
    });

    this.isInitialized = true;
  }

  public update(cycloneState: InterpolatedCycloneState, visible: boolean) {
    const { lat, lon, rainfallRadiusKm } = cycloneState;

    if (!this.isInitialized) {
      if (!visible) return;
      this.initRings(lat, lon, rainfallRadiusKm);
      return;
    }

    this.ringEntities.forEach((e) => {
      e.show = visible;
    });

    if (!visible) return;

    this.bandConfigs.forEach((band, idx) => {
      const entity = this.ringEntities[idx];
      if (entity && entity.polyline) {
        const radius = rainfallRadiusKm * band.factor;
        const coords = generateCircleCoordinates(lat, lon, radius, 48);
        const flat = coords.flatMap(([x, y]) => [x, y]);
        (entity.polyline.positions as any) = Cesium.Cartesian3.fromDegreesArray(flat);
      }
    });
  }

  public clear() {
    this.ringEntities.forEach((e) => this.viewer.entities.remove(e));
    this.ringEntities = [];
    this.isInitialized = false;
  }
}
