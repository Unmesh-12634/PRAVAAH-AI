import * as Cesium from 'cesium';
import { EvaluatedInfrastructure } from '../../simulation/riskAnimation';

export class InfrastructureVisualizer {
  private viewer: Cesium.Viewer;
  private entities: Cesium.Entity[] = [];
  private onSelectCallback?: (item: EvaluatedInfrastructure) => void;
  private currentItems: EvaluatedInfrastructure[] = [];

  constructor(viewer: Cesium.Viewer, onSelect?: (item: EvaluatedInfrastructure) => void) {
    this.viewer = viewer;
    this.onSelectCallback = onSelect;
    this.setupClickHandler();
  }

  private setupClickHandler() {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const pickedObject = this.viewer.scene.pick(movement.position);
      if (Cesium.defined(pickedObject) && pickedObject.id && (pickedObject.id as any)._infraId) {
        const found = this.currentItems.find((i) => i.id === (pickedObject.id as any)._infraId);
        if (found && this.onSelectCallback) {
          this.onSelectCallback(found);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  public update(items: EvaluatedInfrastructure[], visible: boolean) {
    this.clear();
    this.currentItems = items;
    if (!visible) return;

    // Zoom-dependent visibility thresholds:
    // Labels only visible when zoomed in close (< 35 km) so regional map remains clean
    const labelDisplayCondition = new Cesium.DistanceDisplayCondition(0, 35000);
    // Pin points only visible when within 160 km (critical within 280 km)
    const normalPinCondition = new Cesium.DistanceDisplayCondition(0, 160000);
    const alertPinCondition = new Cesium.DistanceDisplayCondition(0, 280000);

    items.forEach((item) => {
      const isCritical = item.currentRisk === 'danger';
      const isWarning = item.currentRisk === 'warning';
      const isAdvisory = item.currentRisk === 'advisory';

      let pinColor = Cesium.Color.fromCssColorString('#0df2c9'); // Safe
      let pinSize = 8;
      let labelPrefix = '';

      if (isCritical) {
        pinColor = Cesium.Color.fromCssColorString('#ff2d55'); // Crimson
        pinSize = 12;
        labelPrefix = '⚠️ [CRITICAL] ';
      } else if (isWarning) {
        pinColor = Cesium.Color.fromCssColorString('#ff6b00'); // Orange
        pinSize = 10;
        labelPrefix = '⚡ [WARNING] ';
      } else if (isAdvisory) {
        pinColor = Cesium.Color.fromCssColorString('#ffb300'); // Amber
        pinSize = 9;
        labelPrefix = '🔔 [ALERT] ';
      }

      // 1. Facility Marker Point (clean, uncluttered, distance-limited)
      const entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, item.elevation_m + 30),
        point: {
          pixelSize: pinSize,
          color: pinColor,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1.5,
          distanceDisplayCondition: isCritical || isWarning ? alertPinCondition : normalPinCondition,
        },
        label: {
          text: `${labelPrefix}${item.name}\n${item.type.toUpperCase()} • ${item.distanceToEyeKm}km from eye`,
          font: 'bold 11px "Inter", sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.fromCssColorString('#060a11'),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -22),
          scale: 0.9,
          // CRITICAL FIX: Labels only appear when zoomed in close (< 85km) to eliminate overlapping text
          distanceDisplayCondition: labelDisplayCondition,
        },
      });

      (entity as any)._infraId = item.id;
      this.entities.push(entity);

      // 2. Vertical tether to ground (only visible when zoomed in)
      const groundLine = this.viewer.entities.add({
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0),
            Cesium.Cartesian3.fromDegrees(item.lon, item.lat, item.elevation_m + 30),
          ],
          width: 1.5,
          material: new Cesium.ColorMaterialProperty(pinColor.withAlpha(0.6)),
          distanceDisplayCondition: labelDisplayCondition,
        },
      });
      this.entities.push(groundLine);
    });
  }

  public clear() {
    this.entities.forEach((e) => this.viewer.entities.remove(e));
    this.entities = [];
  }
}
