import * as Cesium from 'cesium';
import { ForecastPoint, CycloneInfo } from '../../simulation/types';
import { InterpolatedCycloneState, interpolateCycloneAtHour } from '../../simulation/cycloneAnimation';

export class ForecastTrackVisualizer {
  private viewer: Cesium.Viewer;
  private pastTrackEntity: Cesium.Entity | null = null;
  private pastCoreEntity: Cesium.Entity | null = null;
  private futureTrackEntity: Cesium.Entity | null = null;
  private waypointEntities: Map<number, Cesium.Entity> = new Map();
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
    const allEntities = [
      this.pastTrackEntity,
      this.pastCoreEntity,
      this.futureTrackEntity,
      ...Array.from(this.waypointEntities.values()),
    ].filter(Boolean) as Cesium.Entity[];

    allEntities.forEach((e) => {
      e.show = visible;
    });

    if (!visible) return;

    const allPoints: ForecastPoint[] = [
      {
        hour: 0,
        lat: initialCyclone.lat,
        lon: initialCyclone.lon,
        wind_kmph: initialCyclone.wind_kmph,
        rainfall_mm: forecast[0]?.rainfall_mm || 100,
        surge_m: forecast[0]?.surge_m || 1.0,
      },
      ...forecast.filter((p) => p.hour > 0),
    ].sort((a, b) => a.hour - b.hour);

    const currentHour = cycloneState.hour;
    const stepSize = 0.25;

    // 1. Compute Past Historical Track Coordinates
    const pastCoords: Cesium.Cartesian3[] = [];
    for (let h = 0; h <= currentHour; h += stepSize) {
      const stateAtH = interpolateCycloneAtHour(initialCyclone, forecast, h);
      pastCoords.push(Cesium.Cartesian3.fromDegrees(stateAtH.lon, stateAtH.lat, 250));
    }
    pastCoords.push(Cesium.Cartesian3.fromDegrees(cycloneState.lon, cycloneState.lat, 250));

    if (pastCoords.length >= 2) {
      if (!this.pastTrackEntity) {
        this.pastTrackEntity = this.viewer.entities.add({
          polyline: {
            positions: pastCoords,
            width: 6,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.45,
              taperPower: 0.85,
              color: Cesium.Color.fromCssColorString('#ff6b00').withAlpha(0.95),
            }),
          },
        });

        this.pastCoreEntity = this.viewer.entities.add({
          polyline: {
            positions: pastCoords,
            width: 2.5,
            material: new Cesium.ColorMaterialProperty(
              Cesium.Color.fromCssColorString('#fff7ed')
            ),
          },
        });
      } else {
        if (this.pastTrackEntity.polyline) {
          (this.pastTrackEntity.polyline.positions as any) = pastCoords;
        }
        if (this.pastCoreEntity && this.pastCoreEntity.polyline) {
          (this.pastCoreEntity.polyline.positions as any) = pastCoords;
        }
      }
    }

    // 2. Compute Future Projected Forecast Track Coordinates
    const futureCoords: Cesium.Cartesian3[] = [
      Cesium.Cartesian3.fromDegrees(cycloneState.lon, cycloneState.lat, 250),
    ];
    const maxHour = allPoints[allPoints.length - 1].hour;
    for (let h = currentHour + stepSize; h <= maxHour; h += stepSize) {
      const stateAtH = interpolateCycloneAtHour(initialCyclone, forecast, h);
      futureCoords.push(Cesium.Cartesian3.fromDegrees(stateAtH.lon, stateAtH.lat, 250));
    }

    if (futureCoords.length >= 2) {
      if (!this.futureTrackEntity) {
        this.futureTrackEntity = this.viewer.entities.add({
          polyline: {
            positions: futureCoords,
            width: 4,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.fromCssColorString('#00f0ff').withAlpha(0.9),
              gapColor: Cesium.Color.fromCssColorString('#00f0ff').withAlpha(0.15),
              dashLength: 20.0,
            }),
          },
        });
      } else {
        if (this.futureTrackEntity.polyline) {
          (this.futureTrackEntity.polyline.positions as any) = futureCoords;
        }
      }
    }

    // 3. Update Waypoint Pins (Reusing entities and adjusting colors only)
    allPoints.forEach((point) => {
      const isPast = point.hour <= currentHour;
      const isCurrent = Math.abs(point.hour - currentHour) < 0.2;

      let pinColor = Cesium.Color.fromCssColorString('#00f0ff');
      let statusTag = 'FORECAST';
      if (isCurrent) {
        pinColor = Cesium.Color.fromCssColorString('#ff2d55');
        statusTag = 'ACTIVE EYE';
      } else if (isPast) {
        pinColor = Cesium.Color.fromCssColorString('#ffb300');
        statusTag = 'OBSERVED';
      }

      let marker = this.waypointEntities.get(point.hour);
      if (!marker) {
        marker = this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 300),
          point: {
            pixelSize: isCurrent ? 14 : isPast ? 9 : 10,
            color: pinColor,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
          label: {
            text: `T+${point.hour}h [${statusTag}]\n${point.wind_kmph} km/h`,
            font: 'bold 11px "JetBrains Mono", monospace',
            fillColor: isPast ? Cesium.Color.fromCssColorString('#ffedd5') : Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString('#060a11'),
            outlineWidth: 4,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, isPast ? 18 : -18),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 420000),
          },
        });
        this.waypointEntities.set(point.hour, marker);
      } else {
        if (marker.point) {
          (marker.point.pixelSize as any) = isCurrent ? 14 : isPast ? 9 : 10;
          (marker.point.color as any) = pinColor;
        }
        if (marker.label) {
          (marker.label.text as any) = `T+${point.hour}h [${statusTag}]\n${point.wind_kmph} km/h`;
          (marker.label.fillColor as any) = isPast ? Cesium.Color.fromCssColorString('#ffedd5') : Cesium.Color.WHITE;
          (marker.label.pixelOffset as any) = new Cesium.Cartesian2(0, isPast ? 18 : -18);
        }
      }
    });

    this.isInitialized = true;
  }

  public clear() {
    if (this.pastTrackEntity) this.viewer.entities.remove(this.pastTrackEntity);
    if (this.pastCoreEntity) this.viewer.entities.remove(this.pastCoreEntity);
    if (this.futureTrackEntity) this.viewer.entities.remove(this.futureTrackEntity);
    this.waypointEntities.forEach((marker) => this.viewer.entities.remove(marker));

    this.pastTrackEntity = null;
    this.pastCoreEntity = null;
    this.futureTrackEntity = null;
    this.waypointEntities.clear();
    this.isInitialized = false;
  }
}
