/**
 * Geographic math and projection utilities for Cyclone 3D simulation
 */

const EARTH_RADIUS_KM = 6371.0;

/**
 * Calculates Great-Circle distance between two coordinates in kilometers (Haversine formula)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Calculates initial bearing between two coordinates in degrees
 */
export function calculateBearingDeg(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const y = Math.sin(degreesToRadians(lon2 - lon1)) * Math.cos(degreesToRadians(lat2));
  const x =
    Math.cos(degreesToRadians(lat1)) * Math.sin(degreesToRadians(lat2)) -
    Math.sin(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.cos(degreesToRadians(lon2 - lon1));
  const b = Math.atan2(y, x);
  return (radiansToDegrees(b) + 360) % 360;
}

/**
 * Calculates destination point given starting lat/lon, distance in km, and bearing in degrees
 */
export function computeDestination(
  lat: number,
  lon: number,
  distanceKm: number,
  bearingDeg: number
): { lat: number; lon: number } {
  const rLat = degreesToRadians(lat);
  const rLon = degreesToRadians(lon);
  const rBearing = degreesToRadians(bearingDeg);
  const angularDist = distanceKm / EARTH_RADIUS_KM;

  const destLat = Math.asin(
    Math.sin(rLat) * Math.cos(angularDist) +
      Math.cos(rLat) * Math.sin(angularDist) * Math.cos(rBearing)
  );

  const destLon =
    rLon +
    Math.atan2(
      Math.sin(rBearing) * Math.sin(angularDist) * Math.cos(rLat),
      Math.cos(angularDist) - Math.sin(rLat) * Math.sin(destLat)
    );

  return {
    lat: radiansToDegrees(destLat),
    lon: (radiansToDegrees(destLon) + 540) % 360 - 180,
  };
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Generates an array of [lon, lat] points forming a circle of radius radiusKm
 */
export function generateCircleCoordinates(
  centerLat: number,
  centerLon: number,
  radiusKm: number,
  steps = 48
): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (i * 360) / steps;
    const pt = computeDestination(centerLat, centerLon, radiusKm, bearing);
    coords.push([pt.lon, pt.lat]);
  }
  return coords;
}

/**
 * Generates an uncertainty cone polygon connecting forecast points
 * expanding proportionally with forecast lead time (IMD / NHC model).
 */
export function generateUncertaintyConePolygon(
  forecastPoints: { lat: number; lon: number; hour: number; uncertainty_radius_km?: number }[]
): [number, number][] {
  if (forecastPoints.length < 2) return [];

  const leftPoints: [number, number][] = [];
  const rightPoints: [number, number][] = [];

  for (let i = 0; i < forecastPoints.length; i++) {
    const curr = forecastPoints[i];
    // Baseline uncertainty expands ~12km + 16km per 3h forecast period if unspecified
    const radiusKm = curr.uncertainty_radius_km ?? (12 + curr.hour * 5.2);

    let bearing = 0;
    if (i < forecastPoints.length - 1) {
      const next = forecastPoints[i + 1];
      bearing = calculateBearingDeg(curr.lat, curr.lon, next.lat, next.lon);
    } else {
      const prev = forecastPoints[i - 1];
      bearing = calculateBearingDeg(prev.lat, prev.lon, curr.lat, curr.lon);
    }

    const leftBearing = (bearing - 90 + 360) % 360;
    const rightBearing = (bearing + 90 + 360) % 360;

    const leftDest = computeDestination(curr.lat, curr.lon, radiusKm, leftBearing);
    const rightDest = computeDestination(curr.lat, curr.lon, radiusKm, rightBearing);

    leftPoints.push([leftDest.lon, leftDest.lat]);
    rightPoints.push([rightDest.lon, rightDest.lat]);
  }

  // Create cap arc around the final forecast point
  const last = forecastPoints[forecastPoints.length - 1];
  const lastRadius = last.uncertainty_radius_km ?? (12 + last.hour * 5.2);
  const capPoints: [number, number][] = [];
  const prev = forecastPoints[forecastPoints.length - 2];
  const endBearing = calculateBearingDeg(prev.lat, prev.lon, last.lat, last.lon);

  for (let angle = -90; angle <= 90; angle += 15) {
    const b = (endBearing + angle + 360) % 360;
    const pt = computeDestination(last.lat, last.lon, lastRadius, b);
    capPoints.push([pt.lon, pt.lat]);
  }

  // Combine left side going forward, cap around end, and right side returning
  return [
    ...leftPoints,
    ...capPoints,
    ...rightPoints.reverse(),
    leftPoints[0], // close polygon
  ];
}

/**
 * Returns Saffir-Simpson or IMD Cyclone classification
 */
export function getCycloneClassification(windKmph: number): {
  category: string;
  badgeColor: string;
  glowColor: string;
} {
  if (windKmph >= 222) {
    return {
      category: 'Super Cyclonic Storm (Cat 5)',
      badgeColor: 'bg-rose-950/80 border-rose-500 text-rose-300',
      glowColor: '#ff0055',
    };
  } else if (windKmph >= 166) {
    return {
      category: 'Extremely Severe Cyclonic Storm (Cat 3-4)',
      badgeColor: 'bg-red-950/80 border-red-500 text-red-300',
      glowColor: '#ff2d55',
    };
  } else if (windKmph >= 118) {
    return {
      category: 'Very Severe Cyclonic Storm (Cat 1-2)',
      badgeColor: 'bg-amber-950/80 border-amber-500 text-amber-300',
      glowColor: '#ff6b00',
    };
  } else if (windKmph >= 88) {
    return {
      category: 'Severe Cyclonic Storm',
      badgeColor: 'bg-yellow-950/80 border-yellow-500 text-yellow-300',
      glowColor: '#ffb300',
    };
  } else if (windKmph >= 62) {
    return {
      category: 'Cyclonic Storm',
      badgeColor: 'bg-cyan-950/80 border-cyan-500 text-cyan-300',
      glowColor: '#00f0ff',
    };
  }
  return {
    category: 'Deep Depression',
    badgeColor: 'bg-slate-900/80 border-slate-600 text-slate-300',
    glowColor: '#64748b',
  };
}
