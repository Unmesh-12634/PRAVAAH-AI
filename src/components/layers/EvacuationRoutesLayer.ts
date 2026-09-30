import * as Cesium from 'cesium';
import { EvacuationRoute } from '../../simulation/types';

export class EvacuationRoutesVisualizer {
  private viewer: Cesium.Viewer;
  private entities: Cesium.Entity[] = [];

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  public update(routes: EvacuationRoute[], visible: boolean) {
    this.clear();
    if (!visible) return;

    routes.forEach((route) => {
      const positions = route.coordinates.map(([lon, lat]) =>
        Cesium.Cartesian3.fromDegrees(lon, lat, 40)
      );

      // Glowing evacuation corridor polyline
      const line = this.viewer.entities.add({
        polyline: {
          positions,
          width: 4,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.35,
            taperPower: 0.7,
            color: Cesium.Color.fromCssColorString('#10b981').withAlpha(0.85),
          }),
        },
      });
      this.entities.push(line);

      // Route entry milestone label (distance-limited to prevent clutter)
      const startCoord = route.coordinates[0];
      const label = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(startCoord[0], startCoord[1], 80),
        label: {
          text: `➔ EVACUATION CORRIDOR\n${route.name}`,
          font: 'bold 10px "Inter", sans-serif',
          fillColor: Cesium.Color.fromCssColorString('#10b981'),
          outlineColor: Cesium.Color.fromCssColorString('#060a11'),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -14),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 35000), // Clean: only visible when zoomed in close
        },
      });
      this.entities.push(label);
    });
  }

  public clear() {
    this.entities.forEach((e) => this.viewer.entities.remove(e));
    this.entities = [];
  }
}
