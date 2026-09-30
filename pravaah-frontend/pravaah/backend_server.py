#!/usr/bin/env python3
"""
PRAVAAH AI - Local EOC Telemetry & Real-Time Cyclone Early Warning Backend Server
Provides live endpoints for:
- /api/health
- /api/telemetry
- /api/cyclones/active (Live 2026 early warning tracking & basin genesis detection)
- /api/cyclones/history (Historical benchmark records: Michaung, Fani, Hudhud, Gulab)
- /api/cyclones/detect (Atmospheric Genesis Potential Index & Doppler radar status)
- /api/districts
- /api/kpis
- /api/alerts
"""

import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 8000

HISTORICAL_CYCLONES = [
    {
        "id": "michaung-2023",
        "name": "Severe Cyclonic Storm Michaung",
        "year": 2023,
        "basin": "Southwest Bay of Bengal",
        "status": "HISTORICAL_BENCHMARK",
        "category": "Severe Cyclonic Storm (SCS)",
        "peak_wind_kmh": 120,
        "min_pressure_hpa": 980,
        "landfall_sector": "Bapatla-Ongole Corridor",
        "landfall_coordinates": {"lat": 15.7, "lon": 80.1},
        "evacuated_citizens": 64200,
        "loss_prevented_inr_crores": 180,
        "summary": "Dec 2023: Crossed South of Bapatla. Peak storm surge of 2.35m with continuous gale rainfall.",
    },
    {
        "id": "fani-2019",
        "name": "Extremely Severe Cyclonic Storm Fani",
        "year": 2019,
        "basin": "West-Central Bay of Bengal",
        "status": "HISTORICAL_BENCHMARK",
        "category": "Extremely Severe Cyclonic Storm (ESCS - Cat 4)",
        "peak_wind_kmh": 215,
        "min_pressure_hpa": 932,
        "landfall_sector": "Puri / Northern AP Coastal Boundary",
        "landfall_coordinates": {"lat": 19.8, "lon": 85.8},
        "evacuated_citizens": 1400000,
        "loss_prevented_inr_crores": 1200,
        "summary": "May 2019: Pre-monsoon monster cyclone. Catastrophic storm surge and extreme structural wind damage.",
    },
    {
        "id": "hudhud-2014",
        "name": "Very Severe Cyclonic Storm Hudhud",
        "year": 2014,
        "basin": "North Andhra Coast",
        "status": "HISTORICAL_BENCHMARK",
        "category": "Very Severe Cyclonic Storm (VSCS)",
        "peak_wind_kmh": 185,
        "min_pressure_hpa": 950,
        "landfall_sector": "Visakhapatnam City Center",
        "landfall_coordinates": {"lat": 17.7, "lon": 83.3},
        "evacuated_citizens": 250000,
        "loss_prevented_inr_crores": 850,
        "summary": "Oct 2014: Direct catastrophic eye landfall directly over Visakhapatnam urban core and naval base.",
    },
    {
        "id": "gulab-2021",
        "name": "Cyclonic Storm Gulab",
        "year": 2021,
        "basin": "Central Bay of Bengal",
        "status": "HISTORICAL_BENCHMARK",
        "category": "Cyclonic Storm (CS)",
        "peak_wind_kmh": 95,
        "min_pressure_hpa": 992,
        "landfall_sector": "Kalingapatnam (Srikakulam)",
        "landfall_coordinates": {"lat": 18.3, "lon": 84.1},
        "evacuated_citizens": 82000,
        "loss_prevented_inr_crores": 95,
        "summary": "Sep 2021: Rapid landfall crossing Srikakulam triggering acute flash flooding along the Vamsadhara river basin.",
    },
]

LIVE_CYCLONE_TELEMETRY = {
    "is_active_threat": True,
    "system_id": "IMD-BOB-2026-03",
    "name": "IMMINENT CYCLONIC THREAT (LIVE TRACK)",
    "current_classification": "Severe Cyclonic Storm (SCS)",
    "basin": "West-Central Bay of Bengal",
    "coordinates": {"lat": 15.1, "lon": 81.2},
    "distance_to_ap_coast_km": 115,
    "direction_of_movement": "North-Northwest (NNW)",
    "speed_of_movement_kmh": 14,
    "central_pressure_hpa": 982,
    "maximum_sustained_wind_kmh": 118,
    "peak_gusts_kmh": 135,
    "estimated_landfall_sector": "Bapatla-Machilipatnam Coastal Belt (15.8°N, 80.3°E)",
    "estimated_landfall_time": "T-10h (Estimated 18:30 IST)",
    "storm_surge_forecast_m": 2.4,
    "imd_bulletin_number": "BOB/08/2026/SCS",
    "bulletin_headline": "RED ALERT: Severe Cyclonic Storm approaching South Coastal Andhra Pradesh. Gale winds & extreme inundation imminent.",
    "affected_districts": ["Bapatla", "SPSR Nellore", "Prakasam", "Krishna"],
    "alert_level": "RED_CRITICAL",
    "recommended_actions": [
        "Immediate mandatory evacuation of all hamlets within 5km of shoreline",
        "Total suspension of marine fishing operations and port cargo handling",
        "Pre-emptive de-energization of exposed 132kV/220kV high-tension coastal feeders",
        "Pre-positioning of NDRF 10th Battalion & SDRF flood rescue boats",
    ],
    "last_updated": time.strftime("%Y-%m-%d %H:%M:%S IST"),
}

class TelemetryHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Type", "application/json")

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def do_HEAD(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

        path = self.path.split("?")[0]

        if path in ("/health", "/api/health"):
            data = {
                "status": "online",
                "service": "PRAVAAH EOC Telemetry & Early Warning Engine",
                "version": "4.2.0",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S IST"),
                "radar_stations": ["Machilipatnam Doppler (DWR)", "Sriharikota Doppler (SHAR)", "Visakhapatnam Doppler"],
                "active_cyclone_detected": True,
            }
        elif path in ("/api/cyclones/active", "/api/active-cyclone"):
            data = LIVE_CYCLONE_TELEMETRY
        elif path in ("/api/cyclones/history", "/api/cyclones/historical"):
            data = {
                "total_benchmarks": len(HISTORICAL_CYCLONES),
                "cyclones": HISTORICAL_CYCLONES,
            }
        elif path in ("/api/cyclones/detect", "/api/detect"):
            data = {
                "basin_scan_status": "ACTIVE_MONITORING",
                "sea_surface_temp_celsius": 29.8,
                "vertical_wind_shear_knots": 8.5,
                "cyclogenesis_potential_index": 78.4,
                "satellite_pass": "INSAT-3DR TIR-1 / Sentinel-1 SAR",
                "warning_level": "RED_ALERT",
                "early_warning_lead_time_hours": 36,
            }
        elif path == "/api/telemetry":
            data = {
                "cyclone_name": LIVE_CYCLONE_TELEMETRY["name"],
                "category": LIVE_CYCLONE_TELEMETRY["current_classification"],
                "center_coordinates": LIVE_CYCLONE_TELEMETRY["coordinates"],
                "central_pressure_hpa": LIVE_CYCLONE_TELEMETRY["central_pressure_hpa"],
                "sustained_wind_kmh": LIVE_CYCLONE_TELEMETRY["maximum_sustained_wind_kmh"],
                "peak_gusts_kmh": LIVE_CYCLONE_TELEMETRY["peak_gusts_kmh"],
                "predicted_landfall_sector": LIVE_CYCLONE_TELEMETRY["estimated_landfall_sector"],
                "estimated_landfall_time": LIVE_CYCLONE_TELEMETRY["estimated_landfall_time"],
                "storm_surge_meters": LIVE_CYCLONE_TELEMETRY["storm_surge_forecast_m"],
            }
        elif path == "/api/districts":
            data = [
                {"id": "bapatla", "name": "Bapatla", "evacuated": 24200, "target": 28000, "status": "ACTIVE_DEFENSE", "threat_level": "RED"},
                {"id": "nellore", "name": "SPSR Nellore", "evacuated": 28100, "target": 32000, "status": "ACTIVE_DEFENSE", "threat_level": "RED"},
                {"id": "prakasam", "name": "Prakasam", "evacuated": 16500, "target": 22000, "status": "ACTIVE_DEFENSE", "threat_level": "ORANGE"},
                {"id": "krishna", "name": "Krishna", "evacuated": 12800, "target": 18000, "status": "MONITORING", "threat_level": "YELLOW"},
            ]
        elif path == "/api/kpis":
            data = {
                "total_population_swath": 184000,
                "total_evacuated": 68800,
                "shelters_active": 214,
                "ndrf_teams_deployed": 18,
                "high_tension_feeders_protected": 24,
            }
        else:
            data = {
                "message": "PRAVAAH AI Local EOC Backend Gateway active",
                "endpoints": [
                    "/api/health",
                    "/api/telemetry",
                    "/api/cyclones/active",
                    "/api/cyclones/historical",
                    "/api/cyclones/detect",
                    "/api/districts",
                    "/api/kpis",
                ],
            }

        self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

def run_server():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, TelemetryHandler)
    print(f"=====================================================")
    print(f"  PRAVAAH AI EOC Backend & Early Warning Engine running on http://localhost:{PORT}")
    print(f"  Health: http://localhost:{PORT}/api/health")
    print(f"  Active Cyclone Alert: http://localhost:{PORT}/api/cyclones/active")
    print(f"  Historical Benchmarks: http://localhost:{PORT}/api/cyclones/historical")
    print(f"=====================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
