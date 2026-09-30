import * as Cesium from 'cesium';
import { InterpolatedCycloneState } from '../../simulation/cycloneAnimation';
import { generateCircleCoordinates } from '../../simulation/geographicUtils';

export class Cyclone3DVisualizer {
  private viewer: Cesium.Viewer;
  private entities: Cesium.Entity[] = [];
  private rotationAngle = 0;
  private pulsePhase = 0;
  private currentCycloneState: InterpolatedCycloneState | null = null;
  private isVisible = true;
  private currentMode: 'natural' | 'infrared' = 'natural';
  private removePreRenderListener: (() => void) | null = null;

  // Real Satellite Cyclone Photographic Cloud Assets (Matching NASA Orbital & Dvorak IR references)
  private naturalTextureUrl = '/cyclone_satellite_alpha.png';
  private infraredTextureUrl = '/cyclone_dvorak_ir.png';

  private naturalMaterial: Cesium.ImageMaterialProperty;
  private infraredMaterial: Cesium.ImageMaterialProperty;

  private upperCloudEntity: Cesium.Entity | null = null;
  private midCloudEntity: Cesium.Entity | null = null;
  private groundDeckEntity: Cesium.Entity | null = null;
  private eyewallCylinder: Cesium.Entity | null = null;
  private eyeCenterPin: Cesium.Entity | null = null;
  private eyeReticleRing: Cesium.Entity | null = null;
  private isInitialized = false;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;

    // Pre-cache textures to guarantee instantaneous GPU readiness without fallback white flash
    const img1 = new Image();
    img1.src = this.naturalTextureUrl;
    const img2 = new Image();
    img2.src = this.infraredTextureUrl;

    this.naturalMaterial = new Cesium.ImageMaterialProperty({
      image: this.naturalTextureUrl,
      transparent: true,
      color: new Cesium.Color(1.0, 1.0, 1.0, 0.90),
    });

    this.infraredMaterial = new Cesium.ImageMaterialProperty({
      image: this.infraredTextureUrl,
      transparent: true,
      color: new Cesium.Color(1.0, 1.0, 1.0, 0.95),
    });

    this.setupContinuousAnimation();
  }

  /**
   * Continuous 60 FPS rotational cloud swirl and physics animation
   */
  private setupContinuousAnimation() {
    let lastRenderTime = performance.now();

    const onPreRender = () => {
      if (!this.isVisible || !this.currentCycloneState) return;

      const now = performance.now();
      const dt = (now - lastRenderTime) / 1000;
      lastRenderTime = now;

      // Realistic meteorological spin rate proportional to wind speed
      const speedMultiplier = Math.max(0.7, this.currentCycloneState.wind_kmph / 120);
      this.rotationAngle += dt * 0.35 * speedMultiplier;
      this.pulsePhase = (this.pulsePhase + dt * 2.2) % (Math.PI * 2);

      // Update animated pulse reticle around the eye
      if (this.eyeReticleRing && this.eyeReticleRing.polyline) {
        const pulseR = 14 + Math.sin(this.pulsePhase) * 3;
        const ringCoords = generateCircleCoordinates(
          this.currentCycloneState.lat,
          this.currentCycloneState.lon,
          pulseR,
          32
        );
        const positions = ringCoords.map(([x, y]) =>
          Cesium.Cartesian3.fromDegrees(x, y, 600)
        );
        (this.eyeReticleRing.polyline.positions as any) = positions;
      }
    };

    this.viewer.scene.preRender.addEventListener(onPreRender);
    this.removePreRenderListener = () => {
      this.viewer.scene.preRender.removeEventListener(onPreRender);
    };
  }

  private initEntities(cycloneState: InterpolatedCycloneState, satelliteMode: 'natural' | 'infrared') {
    const { lat, lon, wind_kmph, pressure_hpa, windRadius34ktKm } = cycloneState;
    const cloudRadiusMeters = Math.max(140000, windRadius34ktKm * 1.45 * 1000);
    const isInfrared = satelliteMode === 'infrared';
    const activeMaterial = isInfrared ? this.infraredMaterial : this.naturalMaterial;

    // 1. Lower Convective Cloud Deck (Altitude: 2,000m)
    this.groundDeckEntity = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 2000),
      ellipse: {
        semiMajorAxis: cloudRadiusMeters,
        semiMinorAxis: cloudRadiusMeters,
        height: 2000,
        material: activeMaterial,
        stRotation: new Cesium.CallbackProperty(() => this.rotationAngle, false),
      },
    });
    this.entities.push(this.groundDeckEntity);

    // 2. Mid-Troposphere Convective Cloud Deck (Altitude: 7,000m)
    this.midCloudEntity = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 7000),
      ellipse: {
        semiMajorAxis: cloudRadiusMeters * 0.92,
        semiMinorAxis: cloudRadiusMeters * 0.92,
        height: 7000,
        material: activeMaterial,
        stRotation: new Cesium.CallbackProperty(() => this.rotationAngle * 0.95, false),
      },
    });
    this.entities.push(this.midCloudEntity);

    // 3. Upper Tropospheric Outflow Cloud Canopy (Altitude: 14,000m)
    this.upperCloudEntity = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 14000),
      ellipse: {
        semiMajorAxis: cloudRadiusMeters * 1.05,
        semiMinorAxis: cloudRadiusMeters * 1.05,
        height: 14000,
        material: activeMaterial,
        stRotation: new Cesium.CallbackProperty(() => this.rotationAngle, false),
      },
    });
    this.entities.push(this.upperCloudEntity);

    // 4. Central 3D Convective Stadium Eyewall Funnel (14,000m vertical chimney)
    const cylinderColor = isInfrared
      ? new Cesium.Color(1.0, 0.0, 0.45, 0.35)
      : new Cesium.Color(0.96, 0.98, 1.0, 0.35);
    const cylinderOutline = isInfrared
      ? new Cesium.Color(1.0, 0.1, 0.5, 0.6)
      : new Cesium.Color(0.85, 0.94, 1.0, 0.5);

    this.eyewallCylinder = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 7000),
      cylinder: {
        length: 14000,
        topRadius: 26000,
        bottomRadius: 13000,
        material: new Cesium.ColorMaterialProperty(cylinderColor),
        outline: true,
        outlineColor: cylinderOutline,
        outlineWidth: 1.5,
      },
    });
    this.entities.push(this.eyewallCylinder);

    // 5. Pulsing Eyewall Radar Reticle
    const eyeRingCoords = generateCircleCoordinates(lat, lon, 14, 32);
    const eyePositions = eyeRingCoords.map(([x, y]) =>
      Cesium.Cartesian3.fromDegrees(x, y, 600)
    );

    this.eyeReticleRing = this.viewer.entities.add({
      polyline: {
        positions: eyePositions,
        width: 2,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.5,
          color: Cesium.Color.fromCssColorString(isInfrared ? '#f43f5e' : '#00f0ff'),
        }),
      },
    });
    this.entities.push(this.eyeReticleRing);

    // 6. Eye Center Marker & Clean Distance-Limited Telemetry Tag
    this.eyeCenterPin = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat, 450),
      point: {
        pixelSize: 8,
        color: Cesium.Color.fromCssColorString('#ff2d55'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
      },
      label: {
        text: `CYCLONE EYE\n${wind_kmph} km/h • ${pressure_hpa} hPa`,
        font: 'bold 10px "JetBrains Mono", monospace',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.fromCssColorString('#060a11'),
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -28),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 60000),
      },
    });
    this.entities.push(this.eyeCenterPin);

    this.isInitialized = true;
  }

  public update(
    cycloneState: InterpolatedCycloneState,
    visible: boolean,
    satelliteMode: 'natural' | 'infrared' = 'natural'
  ) {
    this.currentCycloneState = cycloneState;
    this.isVisible = visible;

    if (!this.isInitialized) {
      if (!visible) return;
      this.initEntities(cycloneState, satelliteMode);
      this.currentMode = satelliteMode;
      return;
    }

    // Toggle entity visibility without deleting or recreating
    this.entities.forEach((entity) => {
      entity.show = visible;
    });

    if (!visible) return;

    const { lat, lon, wind_kmph, pressure_hpa, windRadius34ktKm } = cycloneState;
    const cloudRadiusMeters = Math.max(140000, windRadius34ktKm * 1.45 * 1000);

    // Smoothly update position coordinates directly in WebGL GPU memory - ZERO FLICKER
    const pos2k = Cesium.Cartesian3.fromDegrees(lon, lat, 2000);
    const pos7k = Cesium.Cartesian3.fromDegrees(lon, lat, 7000);
    const pos14k = Cesium.Cartesian3.fromDegrees(lon, lat, 14000);
    const posEye = Cesium.Cartesian3.fromDegrees(lon, lat, 450);

    if (this.groundDeckEntity && this.groundDeckEntity.ellipse) {
      (this.groundDeckEntity.position as any) = pos2k;
      (this.groundDeckEntity.ellipse.semiMajorAxis as any) = cloudRadiusMeters;
      (this.groundDeckEntity.ellipse.semiMinorAxis as any) = cloudRadiusMeters;
    }

    if (this.midCloudEntity && this.midCloudEntity.ellipse) {
      (this.midCloudEntity.position as any) = pos7k;
      (this.midCloudEntity.ellipse.semiMajorAxis as any) = cloudRadiusMeters * 0.92;
      (this.midCloudEntity.ellipse.semiMinorAxis as any) = cloudRadiusMeters * 0.92;
    }

    if (this.upperCloudEntity && this.upperCloudEntity.ellipse) {
      (this.upperCloudEntity.position as any) = pos14k;
      (this.upperCloudEntity.ellipse.semiMajorAxis as any) = cloudRadiusMeters * 1.05;
      (this.upperCloudEntity.ellipse.semiMinorAxis as any) = cloudRadiusMeters * 1.05;
    }

    if (this.eyewallCylinder) {
      (this.eyewallCylinder.position as any) = pos7k;
    }

    if (this.eyeCenterPin && this.eyeCenterPin.label) {
      (this.eyeCenterPin.position as any) = posEye;
      (this.eyeCenterPin.label.text as any) = `CYCLONE EYE\n${wind_kmph} km/h • ${pressure_hpa} hPa`;
    }

    // Switch material when mode toggle occurs
    if (this.currentMode !== satelliteMode) {
      this.currentMode = satelliteMode;
      const activeMaterial = satelliteMode === 'infrared' ? this.infraredMaterial : this.naturalMaterial;
      if (this.groundDeckEntity?.ellipse) this.groundDeckEntity.ellipse.material = activeMaterial;
      if (this.midCloudEntity?.ellipse) this.midCloudEntity.ellipse.material = activeMaterial;
      if (this.upperCloudEntity?.ellipse) this.upperCloudEntity.ellipse.material = activeMaterial;
    }
  }

  public clear() {
    this.entities.forEach((e) => this.viewer.entities.remove(e));
    this.entities = [];
    this.groundDeckEntity = null;
    this.upperCloudEntity = null;
    this.midCloudEntity = null;
    this.eyewallCylinder = null;
    this.eyeCenterPin = null;
    this.eyeReticleRing = null;
    this.isInitialized = false;
  }

  public destroy() {
    this.clear();
    if (this.removePreRenderListener) {
      this.removePreRenderListener();
      this.removePreRenderListener = null;
    }
  }
}
