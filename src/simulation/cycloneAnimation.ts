import { ForecastPoint, CycloneInfo } from './types';
import { calculateBearingDeg } from './geographicUtils';

export interface InterpolatedCycloneState {
  hour: number;
  lat: number;
  lon: number;
  wind_kmph: number;
  pressure_hpa: number;
  rainfall_mm: number;
  surge_m: number;
  heading_deg: number;
  windRadius34ktKm: number; // Gale force (~63 km/h)
  windRadius50ktKm: number; // Storm force (~90 km/h)
  windRadius64ktKm: number; // Hurricane/Destructive force (~118 km/h)
  rainfallRadiusKm: number;
  surgeImpactLengthKm: number;
}

/**
 * Linearly interpolates between two numbers
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Calculates smooth interpolated position and hazard parameters at time `t` (in hours)
 */
export function interpolateCycloneAtHour(
  initialCyclone: CycloneInfo,
  forecast: ForecastPoint[],
  currentHour: number
): InterpolatedCycloneState {
  // If forecast is empty, return initial
  if (!forecast || forecast.length === 0) {
    return {
      hour: 0,
      lat: initialCyclone.lat,
      lon: initialCyclone.lon,
      wind_kmph: initialCyclone.wind_kmph,
      pressure_hpa: initialCyclone.pressure_hpa,
      rainfall_mm: 100,
      surge_m: 1.0,
      heading_deg: initialCyclone.heading_deg || 0,
      windRadius34ktKm: 180,
      windRadius50ktKm: 110,
      windRadius64ktKm: 55,
      rainfallRadiusKm: 220,
      surgeImpactLengthKm: 90,
    };
  }

  // Ensure forecast starts at hour 0 or use initialCyclone as hour 0
  const points: ForecastPoint[] = [
    {
      hour: 0,
      lat: initialCyclone.lat,
      lon: initialCyclone.lon,
      wind_kmph: initialCyclone.wind_kmph,
      rainfall_mm: forecast[0]?.rainfall_mm || 100,
      surge_m: forecast[0]?.surge_m || 1.0,
      pressure_hpa: initialCyclone.pressure_hpa,
    },
    ...forecast.filter((p) => p.hour > 0),
  ].sort((a, b) => a.hour - b.hour);

  const clampedHour = Math.max(0, Math.min(currentHour, points[points.length - 1].hour));

  // Find surrounding segment
  let p0 = points[0];
  let p1 = points[points.length - 1];

  for (let i = 0; i < points.length - 1; i++) {
    if (clampedHour >= points[i].hour && clampedHour <= points[i + 1].hour) {
      p0 = points[i];
      p1 = points[i + 1];
      break;
    }
  }

  const duration = p1.hour - p0.hour;
  const progress = duration > 0 ? (clampedHour - p0.hour) / duration : 0;

  // Cosine smooth interpolation for realistic atmospheric drift
  const smoothFactor = (1 - Math.cos(progress * Math.PI)) / 2;

  const lat = lerp(p0.lat, p1.lat, smoothFactor);
  const lon = lerp(p0.lon, p1.lon, smoothFactor);
  const wind_kmph = lerp(p0.wind_kmph, p1.wind_kmph, smoothFactor);
  const rainfall_mm = lerp(p0.rainfall_mm, p1.rainfall_mm, smoothFactor);
  const surge_m = lerp(p0.surge_m, p1.surge_m, smoothFactor);

  const p0Pres = p0.pressure_hpa ?? (1010 - p0.wind_kmph * 0.42);
  const p1Pres = p1.pressure_hpa ?? (1010 - p1.wind_kmph * 0.42);
  const pressure_hpa = Math.round(lerp(p0Pres, p1Pres, smoothFactor));

  const heading_deg = calculateBearingDeg(p0.lat, p0.lon, p1.lat, p1.lon);

  // Dynamic physical radius scaling based on wind speed intensity (Saffir-Simpson / IMD physics)
  const intensityRatio = Math.max(0.5, wind_kmph / 140);
  const windRadius64ktKm = Math.round(Math.max(25, 45 * intensityRatio));
  const windRadius50ktKm = Math.round(windRadius64ktKm * 1.8);
  const windRadius34ktKm = Math.round(windRadius64ktKm * 3.2);

  const rainfallRadiusKm = Math.round(140 + rainfall_mm * 0.45);
  const surgeImpactLengthKm = Math.round(60 + surge_m * 22);

  return {
    hour: Number(clampedHour.toFixed(2)),
    lat,
    lon,
    wind_kmph: Math.round(wind_kmph),
    pressure_hpa,
    rainfall_mm: Math.round(rainfall_mm),
    surge_m: Number(surge_m.toFixed(1)),
    heading_deg: Math.round(heading_deg),
    windRadius34ktKm,
    windRadius50ktKm,
    windRadius64ktKm,
    rainfallRadiusKm,
    surgeImpactLengthKm,
  };
}
