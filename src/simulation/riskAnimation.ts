import { InfrastructureItem, RiskLevel } from './types';
import { InterpolatedCycloneState } from './cycloneAnimation';
import { calculateDistanceKm } from './geographicUtils';

export interface EvaluatedInfrastructure extends InfrastructureItem {
  currentRisk: RiskLevel;
  distanceToEyeKm: number;
  windExposureKmph: number;
  rainfallExposureMm: number;
  isEyeApproaching: boolean;
  threatDescription: string;
}

/**
 * Dynamically computes proximity, hazard exposure, and threat level for all infrastructure
 */
export function evaluateInfrastructureRisks(
  infrastructureList: InfrastructureItem[],
  cycloneState: InterpolatedCycloneState
): EvaluatedInfrastructure[] {
  return infrastructureList.map((item) => {
    const distanceKm = calculateDistanceKm(
      cycloneState.lat,
      cycloneState.lon,
      item.lat,
      item.lon
    );

    // Compute localized wind decay based on modified Rankine vortex model
    // V(r) = Vmax * (Rmax / r)^0.5 for r > Rmax
    const rMax = cycloneState.windRadius64ktKm;
    let localWind = cycloneState.wind_kmph;
    if (distanceKm > rMax) {
      localWind = Math.round(cycloneState.wind_kmph * Math.sqrt(rMax / distanceKm));
    }
    localWind = Math.max(30, Math.min(cycloneState.wind_kmph, localWind));

    // Local rainfall decay
    const rainDecay = Math.max(0, 1 - distanceKm / cycloneState.rainfallRadiusKm);
    const localRain = Math.round(cycloneState.rainfall_mm * rainDecay);

    // Risk classification
    let currentRisk: RiskLevel = 'safe';
    let status: InfrastructureItem['status'] = 'operational';
    let threatDescription = 'Normal operating baseline. Monitoring atmospheric telemetry.';

    if (distanceKm <= cycloneState.windRadius64ktKm) {
      currentRisk = 'danger';
      status = item.type === 'bridge' || item.type === 'major_road' ? 'jeopardized' : 'alert';
      threatDescription = `CRITICAL: Direct eyewall impact! Sustained hurricane-force winds ${localWind} km/h. Structural integrity alert.`;
    } else if (distanceKm <= cycloneState.windRadius50ktKm) {
      currentRisk = 'warning';
      status = 'alert';
      threatDescription = `HIGH RISK: Destructive gale envelope (${localWind} km/h). Extreme squalls and potential power outage.`;
    } else if (distanceKm <= cycloneState.windRadius34ktKm) {
      currentRisk = 'advisory';
      status = 'alert';
      threatDescription = `ADVISORY: Outer storm bands approaching. Wind speeds up to ${localWind} km/h with heavy precip ${localRain} mm.`;
    }

    return {
      ...item,
      status,
      currentRisk,
      distanceToEyeKm: Math.round(distanceKm),
      windExposureKmph: localWind,
      rainfallExposureMm: localRain,
      isEyeApproaching: distanceKm <= cycloneState.windRadius50ktKm,
      threatDescription,
    };
  });
}
