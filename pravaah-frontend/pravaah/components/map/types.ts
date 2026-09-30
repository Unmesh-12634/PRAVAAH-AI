export interface MapLayerState {
  galeWind: boolean;
  stormSurge: boolean;
  dopplerRadar: boolean;
  shelters: boolean;
  hospitals: boolean;
  powerGrid: boolean;
  evacuationRoutes: boolean;
  floodPathways: boolean;
}

export type MapViewMode = "2d-vector" | "3d-terrain";

export interface ViewportState {
  zoom: number;
  center: [number, number]; // [lat, lng]
  pitch: number;
  bearing: number;
}
