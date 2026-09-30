import * as Cesium from 'cesium';
import { InterpolatedCycloneState } from '../../simulation/cycloneAnimation';

export class AtmosphericLightningVisualizer {
  private viewer: Cesium.Viewer;
  private lightningEntities: Cesium.Entity[] = [];
  private currentCycloneState: InterpolatedCycloneState | null = null;
  private isVisible = true;
  private intervalTimer: number | null = null;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    this.startLightningCycle();
  }

  private startLightningCycle() {
    const triggerFlash = () => {
      if (!this.isVisible || !this.currentCycloneState) {
        this.scheduleNextFlash();
        return;
      }

      this.createEyewallBolt();
      this.scheduleNextFlash();
    };

    this.scheduleNextFlash();
  }

  private scheduleNextFlash() {
    if (this.intervalTimer) window.clearTimeout(this.intervalTimer);
    // Random delay between 1.4s and 3.2s
    const delay = 1400 + Math.random() * 1800;
    this.intervalTimer = window.setTimeout(() => {
      if (this.isVisible && this.currentCycloneState) {
        this.createEyewallBolt();
      }
      this.scheduleNextFlash();
    }, delay);
  }

  private createEyewallBolt() {
    if (!this.currentCycloneState) return;

    // Pick random position in the high-convection eyewall ring (radius 18km - 35km from center)
    const angle = Math.random() * Math.PI * 2;
    const rKm = 18 + Math.random() * 17;
    const centerLat = this.currentCycloneState.lat;
    const centerLon = this.currentCycloneState.lon;

    const latOffset = (rKm * Math.cos(angle)) / 110.574;
    const lonOffset =
      (rKm * Math.sin(angle)) /
      (111.32 * Math.cos((centerLat * Math.PI) / 180));

    const strikeLon = centerLon + lonOffset;
    const strikeLat = centerLat + latOffset;

    // Generate jagged lightning path from 13,000m cloud top down to 50m
    const numSegments = 10;
    const positions: Cesium.Cartesian3[] = [];
    let currentLon = strikeLon;
    let currentLat = strikeLat;

    for (let i = 0; i <= numSegments; i++) {
      const height = 13000 * (1 - i / numSegments);
      // Add random horizontal jitter
      const jitterLon = (Math.random() - 0.5) * 0.008;
      const jitterLat = (Math.random() - 0.5) * 0.008;
      currentLon += jitterLon;
      currentLat += jitterLat;

      positions.push(Cesium.Cartesian3.fromDegrees(currentLon, currentLat, Math.max(20, height)));
    }

    // Add bright lightning bolt polyline
    const bolt = this.viewer.entities.add({
      polyline: {
        positions,
        width: 4,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.6,
          taperPower: 0.3,
          color: Cesium.Color.WHITE,
        }),
      },
    });

    // Cloud flash point at top of the strike
    const flashGlow = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(strikeLon, strikeLat, 9000),
      point: {
        pixelSize: 45,
        color: new Cesium.Color(0.85, 0.95, 1.0, 0.8),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 4,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });

    // Remove bolt after 140ms
    setTimeout(() => {
      this.viewer.entities.remove(bolt);
      this.viewer.entities.remove(flashGlow);
    }, 140);
  }

  public update(cycloneState: InterpolatedCycloneState, visible: boolean) {
    this.currentCycloneState = cycloneState;
    this.isVisible = visible;
  }

  public clear() {
    this.lightningEntities.forEach((e) => this.viewer.entities.remove(e));
    this.lightningEntities = [];
  }

  public destroy() {
    this.clear();
    if (this.intervalTimer) {
      window.clearTimeout(this.intervalTimer);
      this.intervalTimer = null;
    }
  }
}
