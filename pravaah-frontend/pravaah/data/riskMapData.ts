// ─────────────────────────────────────────────────────────────────────────────
// PRAVAAH AI — Risk Map Mock Data Service
// Source: Cyclone Michaung Historical Replay (04 Dec 2023)
// Status: HISTORICAL REPLAY / MODELLED — NOT REAL-TIME DATA
// ─────────────────────────────────────────────────────────────────────────────

export type TimeStep = "T-36h" | "T-24h" | "T-12h" | "T-6h" | "LANDFALL";
export type RiskSeverity = "LOW" | "MODERATE" | "HIGH" | "SEVERE" | "CRITICAL";
export type MapDataStatus = "OBSERVED" | "FORECAST" | "MODELLED" | "SIMULATED";

export interface CyclonePosition {
  x: number; // SVG viewport percentage
  y: number;
  label: string;
  wind_kmh: number;
  pressure_hpa: number;
  category: string;
}

export interface TimelineSnapshot {
  step: TimeStep;
  label: string;
  istTime: string;
  cyclone: CyclonePosition;
  compositeRisk: RiskSeverity;
  windSpeed_kmh: number;
  rainfall_mm: number;
  surgeMSL_m: number;
  exposedPopulation: string;
  affectedAssets: number;
  confidence: number;
  dataStatus: MapDataStatus;
}

export interface RiskMapAsset {
  id: string;
  name: string;
  type: "hospital" | "substation" | "shelter" | "road" | "landfall" | "bridge";
  x: number; // SVG viewport %
  y: number;
  district: string;
  riskLevel: RiskSeverity;
  floodExposurePct: number;
  roadAccessStatus: "CLEAR" | "AT RISK" | "BLOCKED";
  criticality: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  populationDependence: number;
  confidence: number;
  dataStatus: MapDataStatus;
  details: Record<string, string>;
}

export const TIMELINE_SNAPSHOTS: TimelineSnapshot[] = [
  {
    step: "T-36h",
    label: "T−36 Hours",
    istTime: "03 Dec 00:00 IST",
    cyclone: { x: 60, y: 72, label: "Bay of Bengal", wind_kmh: 65, pressure_hpa: 1004, category: "Depression" },
    compositeRisk: "MODERATE",
    windSpeed_kmh: 65,
    rainfall_mm: 45,
    surgeMSL_m: 0.2,
    exposedPopulation: "380K",
    affectedAssets: 142,
    confidence: 78,
    dataStatus: "FORECAST",
  },
  {
    step: "T-24h",
    label: "T−24 Hours",
    istTime: "03 Dec 12:00 IST",
    cyclone: { x: 55, y: 62, label: "Deep Depression", wind_kmh: 85, pressure_hpa: 998, category: "Deep Depression" },
    compositeRisk: "HIGH",
    windSpeed_kmh: 85,
    rainfall_mm: 120,
    surgeMSL_m: 0.5,
    exposedPopulation: "980K",
    affectedAssets: 412,
    confidence: 84,
    dataStatus: "FORECAST",
  },
  {
    step: "T-12h",
    label: "T−12 Hours",
    istTime: "04 Dec 00:00 IST",
    cyclone: { x: 47, y: 50, label: "Bapatla Sector", wind_kmh: 110, pressure_hpa: 988, category: "Very Severe CS" },
    compositeRisk: "SEVERE",
    windSpeed_kmh: 110,
    rainfall_mm: 280,
    surgeMSL_m: 1.2,
    exposedPopulation: "2.48M",
    affectedAssets: 1842,
    confidence: 94,
    dataStatus: "MODELLED",
  },
  {
    step: "T-6h",
    label: "T−6 Hours",
    istTime: "04 Dec 06:00 IST",
    cyclone: { x: 42, y: 40, label: "Coastal Approach", wind_kmh: 120, pressure_hpa: 982, category: "Very Severe CS" },
    compositeRisk: "CRITICAL",
    windSpeed_kmh: 120,
    rainfall_mm: 380,
    surgeMSL_m: 1.5,
    exposedPopulation: "2.48M",
    affectedAssets: 1842,
    confidence: 96,
    dataStatus: "MODELLED",
  },
  {
    step: "LANDFALL",
    label: "Landfall",
    istTime: "04 Dec 14:00 IST",
    cyclone: { x: 37.5, y: 28, label: "Bapatla Landfall", wind_kmh: 105, pressure_hpa: 985, category: "Very Severe CS" },
    compositeRisk: "CRITICAL",
    windSpeed_kmh: 105,
    rainfall_mm: 420,
    surgeMSL_m: 1.4,
    exposedPopulation: "2.48M",
    affectedAssets: 1842,
    confidence: 98,
    dataStatus: "OBSERVED",
  },
];

export const DEFAULT_STEP: TimeStep = "T-12h";

export const HISTORICAL_TRACK: Array<{ x: number; y: number; step: string }> = [
  { x: 60, y: 72, step: "T-36h" },
  { x: 55, y: 62, step: "T-24h" },
  { x: 47, y: 50, step: "T-12h" },
  { x: 42, y: 40, step: "T-6h" },
  { x: 37.5, y: 28, step: "LANDFALL" },
];

export const FORECAST_TRACK: Array<{ x: number; y: number }> = [
  { x: 37.5, y: 28 },
  { x: 33, y: 20 },
  { x: 29, y: 14 },
];

export const RISK_MAP_ASSETS: RiskMapAsset[] = [
  {
    id: "rma-hospital-bapatla",
    name: "Bapatla District Hospital",
    type: "hospital",
    x: 40,
    y: 38,
    district: "Bapatla",
    riskLevel: "HIGH",
    floodExposurePct: 78,
    roadAccessStatus: "AT RISK",
    criticality: "HIGH",
    populationDependence: 42800,
    confidence: 87,
    dataStatus: "MODELLED",
    details: { Beds: "320", "ICU Beds": "24", "DG Backup": "48h", "Elevation": "+1.2m MSL", "Surge Exposure": "1.2–1.5m expected" },
  },
  {
    id: "rma-hospital-nellore",
    name: "Nellore District Hospital",
    type: "hospital",
    x: 16,
    y: 75,
    district: "SPSR Nellore",
    riskLevel: "MODERATE",
    floodExposurePct: 32,
    roadAccessStatus: "CLEAR",
    criticality: "HIGH",
    populationDependence: 78000,
    confidence: 91,
    dataStatus: "OBSERVED",
    details: { Beds: "480", "ICU Beds": "42", "DG Backup": "72h", "Elevation": "+3.8m MSL", "Surge Exposure": "0.4–0.6m expected" },
  },
  {
    id: "rma-hospital-ongole",
    name: "Ongole GGH",
    type: "hospital",
    x: 22,
    y: 58,
    district: "Prakasam",
    riskLevel: "MODERATE",
    floodExposurePct: 45,
    roadAccessStatus: "AT RISK",
    criticality: "HIGH",
    populationDependence: 64000,
    confidence: 88,
    dataStatus: "MODELLED",
    details: { Beds: "620", "ICU Beds": "56", "DG Backup": "60h", "Elevation": "+2.1m MSL", "Surge Exposure": "0.8–1.0m expected" },
  },
  {
    id: "rma-substation-bapatla",
    name: "220kV Bapatla Substation",
    type: "substation",
    x: 44,
    y: 42,
    district: "Bapatla",
    riskLevel: "CRITICAL",
    floodExposurePct: 95,
    roadAccessStatus: "AT RISK",
    criticality: "CRITICAL",
    populationDependence: 280000,
    confidence: 89,
    dataStatus: "SIMULATED",
    details: { Capacity: "220kV / 400MVA", "Bund Elevation": "+0.8m MSL", "Surge Forecast": "1.2–1.5m", "Trip Plan": "T-3h", "Feeder Zones": "42 industrial + 18 residential" },
  },
  {
    id: "rma-substation-chirala",
    name: "132kV Chirala Substation",
    type: "substation",
    x: 30,
    y: 48,
    district: "Prakasam",
    riskLevel: "HIGH",
    floodExposurePct: 68,
    roadAccessStatus: "AT RISK",
    criticality: "HIGH",
    populationDependence: 120000,
    confidence: 85,
    dataStatus: "SIMULATED",
    details: { Capacity: "132kV / 160MVA", "Bund Elevation": "+1.4m MSL", "Surge Forecast": "0.9–1.2m" },
  },
  {
    id: "rma-shelter-nizampatnam",
    name: "Nizampatnam Cyclone Shelter Hub",
    type: "shelter",
    x: 48,
    y: 46,
    district: "Bapatla",
    riskLevel: "LOW",
    floodExposurePct: 4,
    roadAccessStatus: "CLEAR",
    criticality: "CRITICAL",
    populationDependence: 18200,
    confidence: 99,
    dataStatus: "OBSERVED",
    details: { Capacity: "25,000", Occupied: "18,200", "Water Supply": "72h stocked", "Plinth Elevation": "+3.5m MSL", Comms: "Satellite + VHF" },
  },
  {
    id: "rma-shelter-repalle",
    name: "Repalle Cyclone Shelter",
    type: "shelter",
    x: 54,
    y: 33,
    district: "Bapatla",
    riskLevel: "LOW",
    floodExposurePct: 8,
    roadAccessStatus: "CLEAR",
    criticality: "HIGH",
    populationDependence: 9400,
    confidence: 97,
    dataStatus: "OBSERVED",
    details: { Capacity: "15,000", Occupied: "9,400", "Water Supply": "48h stocked", "Plinth Elevation": "+4.1m MSL", Comms: "VHF Ch.14" },
  },
  {
    id: "rma-landfall",
    name: "Bapatla Landfall Zone",
    type: "landfall",
    x: 37.5,
    y: 28,
    district: "Bapatla Littoral",
    riskLevel: "CRITICAL",
    floodExposurePct: 100,
    roadAccessStatus: "BLOCKED",
    criticality: "CRITICAL",
    populationDependence: 0,
    confidence: 94,
    dataStatus: "FORECAST",
    details: { "Eye Radius": "~28 km", "Landfall Window": "13:30–16:30 IST", "Max Surge": "1.4–1.5m", "Track Uncertainty": "±25 km", "Tide Coincidence": "High tide 14:20 IST" },
  },
  {
    id: "rma-road-nh16",
    name: "NH-16 Coastal Stretch (KM 342)",
    type: "road",
    x: 26,
    y: 55,
    district: "Prakasam / Bapatla",
    riskLevel: "HIGH",
    floodExposurePct: 62,
    roadAccessStatus: "AT RISK",
    criticality: "HIGH",
    populationDependence: 320000,
    confidence: 88,
    dataStatus: "SIMULATED",
    details: { "Length at Risk": "38 km", Chokepoints: "6 culverts", Clearance: "Partial — NHAI en route", "Alternate Route": "SH-40 (also at risk)" },
  },
];

export interface LayerGroup {
  id: string;
  label: string;
  layers: Layer[];
}
export interface Layer {
  id: string;
  label: string;
  defaultOn: boolean;
  color: string;
  description: string;
}

export const LAYER_GROUPS: LayerGroup[] = [
  {
    id: "hazards",
    label: "HAZARDS",
    layers: [
      { id: "compositeRisk", label: "Composite Risk", defaultOn: true, color: "#DC2626", description: "Multi-hazard composite risk surface" },
      { id: "wind", label: "Wind", defaultOn: false, color: "#3B82F6", description: "Peak gale wind field (km/h)" },
      { id: "rainfall", label: "Rainfall", defaultOn: false, color: "#0EA5E9", description: "Accumulated rainfall intensity (mm)" },
      { id: "surge", label: "Surge / Inundation", defaultOn: false, color: "#06B6D4", description: "Coastal storm surge depth (m MSL)" },
      { id: "floodPathway", label: "Flood Pathway", defaultOn: false, color: "#2563EB", description: "Inland flood propagation corridors" },
    ],
  },
  {
    id: "exposure",
    label: "EXPOSURE",
    layers: [
      { id: "population", label: "Population", defaultOn: false, color: "#F59E0B", description: "Population density in exposure zone" },
      { id: "builtUp", label: "Built-up Areas", defaultOn: false, color: "#78716C", description: "Urban & peri-urban built footprint" },
    ],
  },
  {
    id: "infrastructure",
    label: "INFRASTRUCTURE",
    layers: [
      { id: "hospitals", label: "Hospitals", defaultOn: true, color: "#10B981", description: "Healthcare facilities & criticality" },
      { id: "roads", label: "Roads", defaultOn: false, color: "#6B7280", description: "NH & SH evacuation corridors" },
      { id: "power", label: "Power", defaultOn: true, color: "#F59E0B", description: "Grid substations & transmission lines" },
      { id: "shelters", label: "Shelters", defaultOn: true, color: "#7C3AED", description: "Cyclone shelters & capacity status" },
    ],
  },
  {
    id: "cyclone",
    label: "CYCLONE",
    layers: [
      { id: "historicalTrack", label: "Historical Track", defaultOn: true, color: "#DC2626", description: "Observed cyclone centre positions" },
      { id: "forecastTrack", label: "Forecast Track", defaultOn: true, color: "#F97316", description: "IMD forecast track positions" },
      { id: "forecastCone", label: "Forecast Cone", defaultOn: true, color: "#FCA5A5", description: "Track uncertainty cone (±25 km)" },
    ],
  },
];

export type LayerState = Record<string, boolean>;

export function getDefaultLayerState(): LayerState {
  const state: LayerState = {};
  LAYER_GROUPS.forEach((g) => g.layers.forEach((l) => { state[l.id] = l.defaultOn; }));
  return state;
}

export const RISK_SEVERITY_COLORS: Record<RiskSeverity, { bg: string; text: string; border: string; svgFill: string; svgOpacity: number }> = {
  LOW:      { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", svgFill: "#10B981", svgOpacity: 0.12 },
  MODERATE: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   svgFill: "#F59E0B", svgOpacity: 0.18 },
  HIGH:     { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  svgFill: "#F97316", svgOpacity: 0.24 },
  SEVERE:   { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     svgFill: "#DC2626", svgOpacity: 0.30 },
  CRITICAL: { bg: "bg-red-100",    text: "text-red-800",     border: "border-red-300",     svgFill: "#991B1B", svgOpacity: 0.38 },
};

export const DATA_STATUS_STYLES: Record<MapDataStatus, { bg: string; text: string }> = {
  OBSERVED:  { bg: "bg-emerald-100", text: "text-emerald-800" },
  FORECAST:  { bg: "bg-blue-100",    text: "text-blue-800" },
  MODELLED:  { bg: "bg-amber-100",   text: "text-amber-800" },
  SIMULATED: { bg: "bg-slate-100",   text: "text-slate-700" },
};
