import * as Cesium from 'cesium';
import { InterpolatedCycloneState } from '../../simulation/cycloneAnimation';
import { generateCircleCoordinates } from '../../simulation/geographicUtils';

interface WindRingEntities {
  outline: Cesium.Entity;
  label: Cesium.Entity;
}

export class WindRadiusVisualizer {
  private viewer: Cesium.Viewer;
  private ring34: WindRingEntities | null = null;
  private ring50: WindRingEntities | null = null;
  private ring64: WindRingEntities | null = null;
  private isInitialized = false;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private createRing(
    radiusKm: number,
    lat: number,
    lon: number,
    strokeColor: Cesium.Color,
    strokeWidth: number,
    labelText: string
  ): WindRingEntities {
    const ringCoords = generateCircleCoordinates(lat, lon, radiusKm, 48);
    const flat = ringCoords.flatMap(([x, y]) => [x, y]);
    const positions = Cesium.Cartesian3.fromDegreesArray(flat);

    const outline = this.viewer.entities.add({
      polyline: {
        positions,
        width: strokeWidth,
        material: new Cesium.PolylineDashMaterialProperty({
          color: strokeColor,
          dashLength: 18.0,
        }),
      },
    });

    const northTip = ringCoords[0];
    const label = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(northTip[0], northTip[1], 150),
      label: {
        text: labelText,
        font: 'bold 10px "JetBrains Mono", monospace',
        fillColor: strokeColor,
        outlineColor: Cesium.Color.fromCssColorString('#060a11'),
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 450000),
      },
    });

    return { outline, label };
  }

  private updateRing(
    ring: WindRingEntities,
    radiusKm: number,
    lat: number,
    lon: number,
    labelText: string
  ) {
    const ringCoords = generateCircleCoordinates(lat, lon, radiusKm, 48);
    const flat = ringCoords.flatMap(([x, y]) => [x, y]);
    const positions = Cesium.Cartesian3.fromDegreesArray(flat);

    if (ring.outline.polyline) {
      (ring.outline.polyline.positions as any) = positions;
    }

    const northTip = ringCoords[0];
    (ring.label.position as any) = Cesium.Cartesian3.fromDegrees(northTip[0], northTip[1], 150);
    if (ring.label.label) {
      (ring.label.label.text as any) = labelText;
    }
  }

  public update(cycloneState: InterpolatedCycloneState, visible: boolean) {
    if (!this.isInitialized) {
      if (!visible) return;
      const { lat, lon, windRadius34ktKm, windRadius50ktKm, windRadius64ktKm } = cycloneState;

      this.ring34 = this.createRing(
        windRadius34ktKm,
        lat,
        lon,
        Cesium.Color.fromCssColorString('#00f0ff').withAlpha(0.85),
        2,
        `34kt GALE RING (${windRadius34ktKm} km)`
      );

      this.ring50 = this.createRing(
        windRadius50ktKm,
        lat,
        lon,
        Cesium.Color.fromCssColorString('#ff6b00').withAlpha(0.9),
        2.5,
        `50kt STORM ZONE (${windRadius50ktKm} km)`
      );

      this.ring64 = this.createRing(
        windRadius64ktKm,
        lat,
        lon,
        Cesium.Color.fromCssColorString('#ff2d55').withAlpha(0.95),
        3,
        `64kt DESTRUCTIVE CORE (${windRadius64ktKm} km)`
      );

      this.isInitialized = true;
      return;
    }

    // Toggle visibility without recreation
    const allEntities = [
      this.ring34?.outline,
      this.ring34?.label,
      this.ring50?.outline,
      this.ring50?.label,
      this.ring64?.outline,
      this.ring64?.label,
    ].filter(Boolean);

    allEntities.forEach((e) => {
      if (e) e.show = visible;
    });

    if (!visible) return;

    const { lat, lon, windRadius34ktKm, windRadius50ktKm, windRadius64ktKm } = cycloneState;

    if (this.ring34) {
      this.updateRing(this.ring34, windRadius34ktKm, lat, lon, `34kt GALE RING (${windRadius34ktKm} km)`);
    }
    if (this.ring50) {
      this.updateRing(this.ring50, windRadius50ktKm, lat, lon, `50kt STORM ZONE (${windRadius50ktKm} km)`);
    }
    if (this.ring64) {
      this.updateRing(this.ring64, windRadius64ktKm, lat, lon, `64kt DESTRUCTIVE CORE (${windRadius64ktKm} km)`);
    }
  }

  public clear() {
    [
      this.ring34?.outline,
      this.ring34?.label,
      this.ring50?.outline,
      this.ring50?.label,
      this.ring64?.outline,
      this.ring64?.label,
    ].forEach((e) => {
      if (e) this.viewer.entities.remove(e);
    });

    this.ring34 = null;
    this.ring50 = null;
    this.ring64 = null;
    this.isInitialized = false;
  }
}
