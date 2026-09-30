import { SimulationPayload, InfrastructureItem, EvacuationRoute } from './types';

/**
 * Standard user scenario conforming to specified JSON format
 */
export const PRIMARY_MOCK_PAYLOAD: SimulationPayload = {
  cyclone: {
    name: "Demo Cyclone",
    lat: 16.85,
    lon: 82.24,
    wind_kmph: 145,
    pressure_hpa: 948,
    category: "Very Severe Cyclonic Storm",
    movement_speed_kmph: 18,
    heading_deg: 320,
  },
  forecast: [
    {
      hour: 0,
      lat: 16.85,
      lon: 82.24,
      wind_kmph: 145,
      rainfall_mm: 120,
      surge_m: 1.2,
      pressure_hpa: 948,
      uncertainty_radius_km: 15,
    },
    {
      hour: 3,
      lat: 17.10,
      lon: 82.00,
      wind_kmph: 150,
      rainfall_mm: 180,
      surge_m: 1.8,
      pressure_hpa: 942,
      uncertainty_radius_km: 26,
    },
    {
      hour: 6,
      lat: 17.40,
      lon: 81.70,
      wind_kmph: 140,
      rainfall_mm: 240,
      surge_m: 2.4,
      pressure_hpa: 952,
      uncertainty_radius_km: 42,
    },
    {
      hour: 9,
      lat: 17.80,
      lon: 81.40,
      wind_kmph: 130,
      rainfall_mm: 280,
      surge_m: 2.8,
      pressure_hpa: 960,
      uncertainty_radius_km: 58,
    },
    {
      hour: 12,
      lat: 18.15,
      lon: 81.05,
      wind_kmph: 110,
      rainfall_mm: 310,
      surge_m: 1.5,
      pressure_hpa: 975,
      uncertainty_radius_km: 74,
    },
    {
      hour: 15,
      lat: 18.55,
      lon: 80.70,
      wind_kmph: 85,
      rainfall_mm: 220,
      surge_m: 0.8,
      pressure_hpa: 988,
      uncertainty_radius_km: 92,
    }
  ],
};

/**
 * Super Cyclone Vajra (Landfall Stress Test Scenario)
 */
export const SUPER_CYCLONE_PAYLOAD: SimulationPayload = {
  cyclone: {
    name: "Super Cyclone VAJRA",
    lat: 16.50,
    lon: 82.80,
    wind_kmph: 240,
    pressure_hpa: 912,
    category: "Super Cyclonic Storm (Cat 5)",
    movement_speed_kmph: 22,
    heading_deg: 315,
  },
  forecast: [
    { hour: 0, lat: 16.50, lon: 82.80, wind_kmph: 240, rainfall_mm: 210, surge_m: 3.5, pressure_hpa: 912, uncertainty_radius_km: 18 },
    { hour: 3, lat: 16.90, lon: 82.35, wind_kmph: 250, rainfall_mm: 320, surge_m: 4.8, pressure_hpa: 906, uncertainty_radius_km: 30 },
    { hour: 6, lat: 17.25, lon: 81.95, wind_kmph: 230, rainfall_mm: 390, surge_m: 5.6, pressure_hpa: 918, uncertainty_radius_km: 48 },
    { hour: 9, lat: 17.65, lon: 81.55, wind_kmph: 195, rainfall_mm: 420, surge_m: 4.2, pressure_hpa: 935, uncertainty_radius_km: 66 },
    { hour: 12, lat: 18.05, lon: 81.20, wind_kmph: 160, rainfall_mm: 350, surge_m: 2.2, pressure_hpa: 955, uncertainty_radius_km: 84 },
    { hour: 15, lat: 18.45, lon: 80.85, wind_kmph: 120, rainfall_mm: 260, surge_m: 1.1, pressure_hpa: 978, uncertainty_radius_km: 104 },
  ],
};

/**
 * Key critical infrastructure points in the coastal Godavari / Kakinada / Rajahmundry region
 */
export const MOCK_INFRASTRUCTURE: InfrastructureItem[] = [
  {
    id: "hosp-01",
    name: "District Government General Hospital",
    type: "hospital",
    lat: 16.958,
    lon: 82.238,
    elevation_m: 6.5,
    capacity: "650 Beds | ICU 45",
    description: "Primary trauma and acute medical response hub for coastal Godavari.",
    status: "operational",
  },
  {
    id: "hosp-02",
    name: "Apollo Emergency Center Kakinada",
    type: "hospital",
    lat: 16.989,
    lon: 82.251,
    elevation_m: 5.2,
    capacity: "250 Beds | 4 Ambulances",
    description: "Secondary critical care center equipped with backup diesel generators.",
    status: "operational",
  },
  {
    id: "shlt-01",
    name: "Coringa Multipurpose Cyclone Shelter",
    type: "shelter",
    lat: 16.892,
    lon: 82.235,
    elevation_m: 3.8,
    capacity: "2,400 Persons",
    description: "Reinforced concrete 3-tier storm shelter situated 1.2km from coastline.",
    status: "operational",
  },
  {
    id: "shlt-02",
    name: "Uppada High-Elevation Storm Sanctuary",
    type: "shelter",
    lat: 17.085,
    lon: 82.325,
    elevation_m: 12.0,
    capacity: "3,800 Persons",
    description: "Engineered storm redoubt built on elevated ridge above 6m storm surge plane.",
    status: "operational",
  },
  {
    id: "pwr-01",
    name: "Kakinada Deepwater Port Power Substation",
    type: "power_station",
    lat: 16.974,
    lon: 82.278,
    elevation_m: 4.1,
    capacity: "220 kV Grid",
    description: "Major maritime power terminal feeding coastal pumps and harbor cranes.",
    status: "operational",
  },
  {
    id: "pwr-02",
    name: "Godavari Basin Thermal Power Node",
    type: "power_station",
    lat: 17.015,
    lon: 81.865,
    elevation_m: 18.4,
    capacity: "450 MW Transmission",
    description: "Regional baseload supplier connected to the Southern National Grid.",
    status: "operational",
  },
  {
    id: "brg-01",
    name: "Godavari River Road-Rail Bridge",
    type: "bridge",
    lat: 17.008,
    lon: 81.762,
    elevation_m: 14.5,
    capacity: "Dual Rail & 4-Lane Road",
    description: "4.1km strategic evacuation span connecting East and West Godavari districts.",
    status: "operational",
  },
  {
    id: "brg-02",
    name: "Coringa Estuary Marine Causeway",
    type: "bridge",
    lat: 16.835,
    lon: 82.268,
    elevation_m: 2.9,
    capacity: "2-Lane Coastal Link",
    description: "Vulnerable low-lying tidal causeway exposed to high storm surge overtopping.",
    status: "operational",
  },
  {
    id: "rd-01",
    name: "National Highway NH-16 North Corridor",
    type: "major_road",
    lat: 17.150,
    lon: 81.980,
    elevation_m: 15.0,
    capacity: "5,000 Vehicles/Hour",
    description: "Primary high-capacity inland evacuation spine towards Visakhapatnam and Vijayawada.",
    status: "operational",
  },
  {
    id: "rd-02",
    name: "State Coastal Highway SH-42",
    type: "major_road",
    lat: 16.920,
    lon: 82.215,
    elevation_m: 4.0,
    capacity: "1,800 Vehicles/Hour",
    description: "Coastal relief transport route vulnerable to sea surge inundation.",
    status: "operational",
  }
];

/**
 * Pre-designated arterial evacuation routes
 */
export const MOCK_EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: "route-nh16",
    name: "Arterial Corridor NH-16 (Inland Escape)",
    capacityVehiclesPerHour: 4500,
    status: "clear",
    coordinates: [
      [82.240, 16.960],
      [82.120, 17.050],
      [81.920, 17.180],
      [81.760, 17.350],
      [81.520, 17.580],
    ],
  },
  {
    id: "route-coringa",
    name: "Coringa to Inland Highland Bypass",
    capacityVehiclesPerHour: 1800,
    status: "clear",
    coordinates: [
      [82.260, 16.850],
      [82.210, 16.920],
      [82.110, 17.020],
      [81.990, 17.140],
    ],
  },
  {
    id: "route-godavari",
    name: "Godavari Westward Relief Route",
    capacityVehiclesPerHour: 3200,
    status: "clear",
    coordinates: [
      [81.800, 16.980],
      [81.650, 17.050],
      [81.450, 17.150],
      [81.250, 17.300],
    ],
  }
];
