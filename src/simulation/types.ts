export interface CycloneInfo {
  name: string;
  lat: number;
  lon: number;
  wind_kmph: number;
  pressure_hpa: number;
  category?: string;
  movement_speed_kmph?: number;
  heading_deg?: number;
}

export interface ForecastPoint {
  hour: number;
  lat: number;
  lon: number;
  wind_kmph: number;
  rainfall_mm: number;
  surge_m: number;
  pressure_hpa?: number;
  uncertainty_radius_km?: number;
}

export interface SimulationPayload {
  cyclone: CycloneInfo;
  forecast: ForecastPoint[];
}

export type InfrastructureType = 
  | 'hospital' 
  | 'shelter' 
  | 'power_station' 
  | 'bridge' 
  | 'major_road';

export type RiskLevel = 'safe' | 'advisory' | 'warning' | 'danger';

export interface InfrastructureItem {
  id: string;
  name: string;
  type: InfrastructureType;
  lat: number;
  lon: number;
  elevation_m: number;
  capacity?: string;
  description: string;
  status: 'operational' | 'alert' | 'jeopardized' | 'flooded';
  currentRisk?: RiskLevel;
  distanceToEyeKm?: number;
  windExposureKmph?: number;
  rainfallExposureMm?: number;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  capacityVehiclesPerHour: number;
  status: 'clear' | 'congested' | 'cutoff';
  coordinates: [number, number][]; // [lon, lat] pairs
}

export interface LayerVisibility {
  cycloneTrack: boolean;
  uncertaintyCone: boolean;
  windRadius: boolean;
  rainfall: boolean;
  floodRisk: boolean;
  stormSurge: boolean;
  infrastructure: boolean;
  evacuationRoutes: boolean;
  photorealistic3D: boolean;
  windStreamlines: boolean;
  lightningEffects: boolean;
  satelliteMode: 'natural' | 'infrared';
}

export interface CameraState {
  lat: number;
  lon: number;
  height: number;
  heading: number;
  pitch: number;
  roll: number;
  followCyclone: boolean;
}
