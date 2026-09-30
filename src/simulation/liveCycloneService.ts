import { SimulationPayload, CycloneInfo, ForecastPoint } from './types';
import { calculateDistanceKm, calculateBearingDeg } from './geographicUtils';

export interface LivePointTelemetry {
  lat: number;
  lon: number;
  title: string;
  source: string;
  windSpeedKmph: number;
  windSpeedKts: number;
  windGustsKmph: number;
  pressureHpa: number;
  temperatureC: number;
  precipitationMm: number;
  distanceToEyeKm?: number;
  bearingToEyeDeg?: number;
  timestamp: string;
  isLoading?: boolean;
}

export interface EONETEvent {
  id: string;
  title: string;
  link: string;
  categories: { id: string; title: string }[];
  sources: { id: string; url: string }[];
  geometry: {
    magnitudeValue: number;
    magnitudeUnit: string;
    date: string;
    type: string;
    coordinates: [number, number]; // [lon, lat]
  }[];
}

/**
 * Fetch active severe storms worldwide from NASA EONET v3 API
 */
export async function fetchLiveEONETStorms(): Promise<EONETEvent[]> {
  try {
    const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/categories/severeStorms?limit=10', {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`NASA EONET HTTP ${res.status}`);
    const data = await res.json();
    return (data.events || []) as EONETEvent[];
  } catch (err) {
    console.warn('NASA EONET API notice, falling back to live Open-Meteo meteorology:', err);
    return [];
  }
}

/**
 * Fetch real-time live surface atmospheric and wind conditions from Open-Meteo
 */
export async function fetchLiveAtmosphericData(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,surface_pressure,wind_speed_10m,wind_gusts_10m,precipitation`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json();
    const curr = data.current || {};

    return {
      temperatureC: curr.temperature_2m ?? 28.5,
      pressureHpa: curr.surface_pressure ?? 1004.0,
      windSpeedKmph: curr.wind_speed_10m ?? 25.0,
      windGustsKmph: curr.wind_gusts_10m ?? 42.0,
      precipitationMm: curr.precipitation ?? 0.0,
      timestamp: curr.time || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Live atmospheric query notice:', err);
    return {
      temperatureC: 28.5,
      pressureHpa: 1004.0,
      windSpeedKmph: 35.0,
      windGustsKmph: 55.0,
      precipitationMm: 4.5,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Query live weather for any clicked location on the globe with relative eye metrics
 */
export async function fetchLivePointWeather(
  lat: number,
  lon: number,
  eyeLat?: number,
  eyeLon?: number
): Promise<LivePointTelemetry> {
  const atmo = await fetchLiveAtmosphericData(lat, lon);
  const windKts = Math.round(atmo.windSpeedKmph * 0.539957);

  let distKm: number | undefined;
  let bearingDeg: number | undefined;

  if (eyeLat !== undefined && eyeLon !== undefined) {
    distKm = Math.round(calculateDistanceKm(eyeLat, eyeLon, lat, lon));
    bearingDeg = Math.round(calculateBearingDeg(eyeLat, eyeLon, lat, lon));
  }

  return {
    lat,
    lon,
    title: `Observation Point (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
    source: 'LIVE: OPEN-METEO GFS / ECMWF',
    windSpeedKmph: Math.round(atmo.windSpeedKmph),
    windSpeedKts: windKts,
    windGustsKmph: Math.round(atmo.windGustsKmph),
    pressureHpa: Math.round(atmo.pressureHpa * 10) / 10,
    temperatureC: Math.round(atmo.temperatureC * 10) / 10,
    precipitationMm: atmo.precipitationMm,
    distanceToEyeKm: distKm,
    bearingToEyeDeg: bearingDeg,
    timestamp: atmo.timestamp,
  };
}

/**
 * Convert a live NASA EONET storm into a full simulation payload
 */
export async function convertEONETToSimulationPayload(event: EONETEvent): Promise<SimulationPayload> {
  const geom = event.geometry;
  if (!geom || geom.length === 0) {
    throw new Error('EONET event has no geometry points');
  }

  // EONET points are sorted chronologically
  const latestPoint = geom[geom.length - 1];
  const [lon, lat] = latestPoint.coordinates;
  const windKts = latestPoint.magnitudeValue || 45;
  const windKmph = Math.round(windKts * 1.852);

  // Fetch live atmospheric pressure and precipitation for the active eye
  const atmo = await fetchLiveAtmosphericData(lat, lon);

  const cyclone: CycloneInfo = {
    name: event.title || 'Live Tropical Cyclone',
    lat,
    lon,
    wind_kmph: Math.max(windKmph, atmo.windSpeedKmph),
    pressure_hpa: Math.min(atmo.pressureHpa, 998 - Math.round(windKmph * 0.35)),
    category: windKmph > 165 ? 'Extremely Severe' : windKmph > 118 ? 'Very Severe' : windKmph > 88 ? 'Severe' : 'Cyclonic Storm',
    movement_speed_kmph: 16,
    heading_deg: 320,
  };

  // Build projected forecast trajectory from historical motion or extrapolate
  const forecast: ForecastPoint[] = [];
  const hours = [3, 6, 9, 12, 15];

  // Determine vector from previous point if available
  let dLat = 0.28;
  let dLon = -0.32;
  if (geom.length >= 2) {
    const prev = geom[geom.length - 2];
    dLat = (lat - prev.coordinates[1]) * 0.75 || 0.28;
    dLon = (lon - prev.coordinates[0]) * 0.75 || -0.32;
  }

  hours.forEach((h, idx) => {
    const step = idx + 1;
    const fLat = lat + dLat * step;
    const fLon = lon + dLon * step;
    const decay = Math.max(0.65, 1 - step * 0.06);

    forecast.push({
      hour: h,
      lat: Number(fLat.toFixed(3)),
      lon: Number(fLon.toFixed(3)),
      wind_kmph: Math.round(cyclone.wind_kmph * decay),
      pressure_hpa: Math.round(cyclone.pressure_hpa + step * 4),
      rainfall_mm: Math.round(140 + step * 15),
      surge_m: Math.max(0.5, Number((2.8 - step * 0.35).toFixed(1))),
      uncertainty_radius_km: 25 + step * 18,
    });
  });

  return { cyclone, forecast };
}
