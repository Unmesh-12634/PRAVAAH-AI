/**
 * Procedural Photorealistic Satellite Cyclone Cloud Texture Generator
 * Generates dynamic 60fps swirling tropical cyclone cloud imagery matching NASA/NOAA satellite feeds
 */

export class CycloneTextureGenerator {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private size: number;
  private rotation: number = 0;

  constructor(size: number = 1024) {
    this.size = size;
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D canvas context');
    this.ctx = context;
    this.render(0, 'natural');
  }

  public render(
    rotationAngle: number,
    mode: 'natural' | 'infrared' = 'natural'
  ): HTMLCanvasElement {
    this.rotation = rotationAngle;
    const ctx = this.ctx;
    const w = this.size;
    const h = this.size;
    const cx = w / 2;
    const cy = h / 2;

    // Clear transparent
    ctx.clearRect(0, 0, w, h);

    const isInfrared = mode === 'infrared';

    // 1. Outer Cirrus Shield (diffuse atmospheric cloud canopy)
    const cirrusGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, w * 0.48);
    if (isInfrared) {
      cirrusGrad.addColorStop(0, 'rgba(236, 72, 153, 0.45)');
      cirrusGrad.addColorStop(0.3, 'rgba(239, 68, 68, 0.35)');
      cirrusGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.22)');
      cirrusGrad.addColorStop(0.85, 'rgba(6, 182, 212, 0.12)');
      cirrusGrad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    } else {
      cirrusGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      cirrusGrad.addColorStop(0.25, 'rgba(248, 250, 252, 0.55)');
      cirrusGrad.addColorStop(0.55, 'rgba(241, 245, 249, 0.35)');
      cirrusGrad.addColorStop(0.8, 'rgba(226, 232, 240, 0.15)');
      cirrusGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    }

    ctx.fillStyle = cirrusGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.48, 0, Math.PI * 2);
    ctx.fill();

    // 2. Swirling Logarithmic Spiral Cloud Arms (4 primary convective arms)
    const numArms = 5;
    for (let arm = 0; arm < numArms; arm++) {
      const armOffset = (arm * (2 * Math.PI)) / numArms + this.rotation;
      const numSteps = 70;

      for (let i = 0; i < numSteps; i++) {
        const t = i / (numSteps - 1);
        // Exponential spiral radius
        const r = 40 + Math.pow(t, 1.15) * (w * 0.42);
        // Counter-clockwise cyclonic curvature
        const theta = armOffset + t * 4.6;

        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);

        // Particle puff radius increases outwards
        const puffRadius = 14 + t * 42;
        const opacity = (1.0 - t * 0.75) * (isInfrared ? 0.75 : 0.85);

        const puffGrad = ctx.createRadialGradient(x, y, 0, x, y, puffRadius);
        if (isInfrared) {
          const color = t < 0.25 ? '244, 63, 94' : t < 0.5 ? '239, 68, 68' : '245, 158, 11';
          puffGrad.addColorStop(0, `rgba(${color}, ${opacity})`);
          puffGrad.addColorStop(0.5, `rgba(${color}, ${opacity * 0.6})`);
          puffGrad.addColorStop(1, `rgba(${color}, 0)`);
        } else {
          puffGrad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
          puffGrad.addColorStop(0.4, `rgba(240, 245, 255, ${opacity * 0.7})`);
          puffGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = puffGrad;
        ctx.beginPath();
        ctx.arc(x, y, puffRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Dense Central Overcast (CDO) Eyewall Ring
    const eyewallRadius = 55;
    const eyewallGrad = ctx.createRadialGradient(cx, cy, 22, cx, cy, eyewallRadius);
    if (isInfrared) {
      eyewallGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      eyewallGrad.addColorStop(0.35, 'rgba(255, 0, 100, 0.95)');
      eyewallGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.9)');
      eyewallGrad.addColorStop(1, 'rgba(239, 68, 68, 0.4)');
    } else {
      eyewallGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      eyewallGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.98)');
      eyewallGrad.addColorStop(0.7, 'rgba(245, 248, 255, 0.92)');
      eyewallGrad.addColorStop(1, 'rgba(220, 230, 245, 0.3)');
    }

    ctx.fillStyle = eyewallGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, eyewallRadius + 25, 0, Math.PI * 2);
    ctx.fill();

    // 4. Clear Calm Eye of the Cyclone (Cut out the center completely)
    ctx.globalCompositeOperation = 'destination-out';
    const eyePunchGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
    eyePunchGrad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
    eyePunchGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.95)');
    eyePunchGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = eyePunchGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();

    // Restore standard composite mode
    ctx.globalCompositeOperation = 'source-over';

    return this.canvas;
  }
}
