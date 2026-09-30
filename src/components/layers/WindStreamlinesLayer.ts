import * as Cesium from 'cesium';
import { InterpolatedCycloneState } from '../../simulation/cycloneAnimation';

interface Streamline {
  entity: Cesium.Entity;
  startAngle: number;
  maxRadiusKm: number;
  inwardSpeed: number;
}

export class WindStreamlinesVisualizer {
  private viewer: Cesium.Viewer;
  private entities: Cesium.Entity[] = [];
  private streamlines: Streamline[] = [];
  private animationOffset = 0;
  private currentCycloneState: InterpolatedCycloneState | null = null;
  private isVisible = true;
  private removePreRenderListener: (() => void) | null = null;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    this.setupAnimationLoop();
  }

  private setupAnimationLoop() {
    const onPreRender = () => {
      if (!this.isVisible || !this.currentCycloneState) return;

      // Advance particles inward
      this.animationOffset = (this.animationOffset + 0.008) % 1.0;

      const centerLat = this.currentCycloneState.lat;
      const centerLon = this.currentCycloneState.lon;
      const windKmph = this.currentCycloneState.wind_kmph;

      for (let s = 0; s < this.streamlines.length; s++) {
        const stream = this.streamlines[s];
        const numPoints = 28;
        const coords: Cesium.Cartesian3[] = [];

        for (let i = 0; i < numPoints; i++) {
          const t = i / (numPoints - 1);
          // Inward logarithmic spiral
          const progress = (t + this.animationOffset) % 1.0;
          const rKm = 14 + (1.0 - progress) * stream.maxRadiusKm;
          const theta = stream.startAngle + (1.0 - progress) * 4.2;

          const latOffset = (rKm * Math.cos(theta)) / 110.574;
          const lonOffset =
            (rKm * Math.sin(theta)) /
            (111.32 * Math.cos((centerLat * Math.PI) / 180));

          const height = 400 + Math.sin(progress * Math.PI) * 2500;
          coords.push(
            Cesium.Cartesian3.fromDegrees(centerLon + lonOffset, centerLat + latOffset, height)
          );
        }

        if (stream.entity.polyline) {
          (stream.entity.polyline.positions as any) = coords;
        }
      }
    };

    this.viewer.scene.preRender.addEventListener(onPreRender);
    this.removePreRenderListener = () => {
      this.viewer.scene.preRender.removeEventListener(onPreRender);
    };
  }

  public update(cycloneState: InterpolatedCycloneState, visible: boolean) {
    this.currentCycloneState = cycloneState;
    this.isVisible = visible;

    this.clear();
    if (!visible) return;

    const numStreamlines = 14;
    const maxRadius = cycloneState.windRadius34ktKm * 1.25;

    for (let i = 0; i < numStreamlines; i++) {
      const angle = (i * (2 * Math.PI)) / numStreamlines;

      // Color code by tier (outer cyan to inner amber/red)
      let streamColor = Cesium.Color.fromCssColorString('#00f0ff').withAlpha(0.65);
      if (i % 3 === 0) {
        streamColor = Cesium.Color.fromCssColorString('#ff6b00').withAlpha(0.75);
      } else if (i % 2 === 0) {
        streamColor = Cesium.Color.fromCssColorString('#0df2c9').withAlpha(0.7);
      }

      const entity = this.viewer.entities.add({
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(cycloneState.lon, cycloneState.lat, 400),
            Cesium.Cartesian3.fromDegrees(cycloneState.lon + 0.1, cycloneState.lat + 0.1, 800),
          ],
          width: 3.5,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.35,
            taperPower: 0.8,
            color: streamColor,
          }),
        },
      });

      this.entities.push(entity);
      this.streamlines.push({
        entity,
        startAngle: angle,
        maxRadiusKm: maxRadius,
        inwardSpeed: 1.0,
      });
    }
  }

  public clear() {
    this.entities.forEach((e) => this.viewer.entities.remove(e));
    this.entities = [];
    this.streamlines = [];
  }

  public destroy() {
    this.clear();
    if (this.removePreRenderListener) {
      this.removePreRenderListener();
      this.removePreRenderListener = null;
    }
  }
}
