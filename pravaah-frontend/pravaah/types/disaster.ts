export type DataStatus = "OBSERVED" | "FORECAST" | "MODELLED" | "SIMULATED";

export type RiskLevel = "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "NOMINAL";

export interface DataProvenance {
  status: DataStatus;
  source: string;
  timestamp: string;
  confidence?: number; // e.g. 94 for 94%
  uncertaintyMargin?: string; // e.g. "±15 km" or "±0.2 m"
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  unit?: string;
  subtitle: string;
  badgeText: string;
  badgeType: "critical" | "warning" | "info" | "success";
  trendText: string;
  trendType: "danger" | "warning" | "neutral" | "positive";
  sectorTag: string;
  provenance: DataProvenance;
  category: "population" | "assets" | "healthcare" | "evacuation" | "threat";
}

export interface MapAsset {
  id: string;
  name: string;
  type: "hospital" | "substation" | "shelter" | "bridge" | "landfall";
  lat: number;
  lng: number;
  screenPos: { x: number; y: number }; // Percentage on SVG canvas (x%, y%)
  district: string;
  riskLevel: RiskLevel;
  primaryMetric: string;
  statusDetails: string;
  lifelineAutonomy: string;
  provenance: DataProvenance;
  actionItems: string[];
}

export interface LayerVisibility {
  galeWind: boolean;
  stormSurge: boolean;
  dopplerRadar: boolean;
  shelters: boolean;
  hospitals: boolean;
  powerGrid: boolean;
  evacuationRoutes: boolean;
}

export interface SituationSummary {
  sectorName: string;
  bulletinNo: string;
  threatLevel: string;
  landfallCoordinates: string;
  cooccurringHazards: string;
  peakSurge: string;
  ensembleConfidence: number;
  vulnerabilityBreakdown: {
    kutchaPct: number;
    elderlyPct: number;
    livestockPct: number;
  };
  provenance: DataProvenance;
}
