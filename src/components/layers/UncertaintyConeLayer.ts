import * as Cesium from 'cesium';
import { ForecastPoint, CycloneInfo } from '../../simulation/types';
import { InterpolatedCycloneState } from '../../simulation/cycloneAnimation';
import { generateUncertaintyConePolygon } from '../../simulation/geographicUtils';

export class UncertaintyConeVisualizer {
  private viewer: Cesium.Viewer;
  private conePolygon: Cesium.Entity | null = null;
  private coneOutline: Cesium.Entity | null = null;
  private isInitialized = false;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  public update(
    initialCyclone: CycloneInfo,
    forecast: ForecastPoint[],
    cycloneState: InterpolatedCycloneState,
    visible: boolean
  ) {
    if (this.conePolygon) this.conePolygon.show = visible;
    if (this.coneOutline) this.coneOutline.show = visible;

    if (!visible) return;

    // Remaining forecast sequence starting from current position
    const futurePoints: { lat: number; lon: number; hour: number; uncertainty_radius_km?: number }[] = [
      {
        lat: cycloneState.lat,
        lon: cycloneState.lon,
        hour: cycloneState.hour,
        uncertainty_radius_km: 15,
      },
      ...forecast
        .filter((p) => p.hour > cycloneState.hour)
        .map((p) => ({
          lat: p.lat,
          lon: p.lon,
          hour: p.hour,
          uncertainty_radius_km: p.uncertainty_radius_km,
        })),
    ];

    if (futurePoints.length < 2) {
      if (this.conePolygon) this.conePolygon.show = false;
      if (this.coneOutline) this.coneOutline.show = false;
      return;
    }

    const polygonCoords = generateUncertaintyConePolygon(futurePoints);
    if (polygonCoords.length < 3) return;

    const flatPositions = polygonCoords.flatMap(([lon, lat]) => [lon, lat]);
    const cartesianPositions = Cesium.Cartesian3.fromDegreesArray(flatPositions);

    if (!this.isInitialized) {
      // 1. Translucent Uncertainty Cone Surface
      this.conePolygon = this.viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(cartesianPositions),
          material: new Cesium.ColorMaterialProperty(
            new Cesium.Color(0.0, 0.94, 1.0, 0.12)
          ),
          classificationType: Cesium.ClassificationType.BOTH,
        },
      });

      // 2. Glowing Outline around Uncertainty Cone
      this.coneOutline = this.viewer.entities.add({
        polyline: {
          positions: cartesianPositions,
          width: 2.5,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.fromCssColorString('#00f0ff').withAlpha(0.85),
            dashLength: 16.0,
          }),
        },
      });

      this.isInitialized = true;
    } else {
      if (this.conePolygon?.polygon) {
        (this.conePolygon.polygon.hierarchy as any) = new Cesium.ConstantProperty(
          new Cesium.PolygonHierarchy(cartesianPositions)
        );
      }
      if (this.coneOutline?.polyline) {
        (this.coneOutline.polyline.positions as any) = cartesianPositions;
      }
    }
  }

  public clear() {
    if (this.conePolygon) this.viewer.entities.remove(this.conePolygon);
    if (this.coneOutline) this.viewer.entities.remove(this.coneOutline);
    this.conePolygon = null;
    this.coneOutline = null;
    this.isInitialized = false;
  }
}
