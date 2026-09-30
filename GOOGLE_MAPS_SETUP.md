# Google Maps Platform 3D Photorealistic Tiles Setup Guide

This document details how to configure Google Maps Platform's **Photorealistic 3D Tiles** to serve as the high-resolution, elevation-accurate 3D geographical base for the VAYU-SHIELD Disaster Simulation.

---

## 1. Required Google Cloud API

To stream Google's Photorealistic 3D Earth, buildings, and terrain mesh, you must enable **ONE** primary API in the Google Cloud Console:

- **Map Tiles API** (`maptiles.googleapis.com`)
  - Provides access to the 2D Tiles API, Street View Tiles API, and **Photorealistic 3D Tiles** (standard OGC 3D Tiles format).

---

## 2. Step-by-Step Enablement Instructions

### Step 1: Create or Select a Google Cloud Project
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. In the top navigation bar, select an existing project or click **New Project** (e.g., `vayu-shield-geospatial`).

### Step 2: Enable the Map Tiles API
1. Navigate to **APIs & Services** > **Library** in the left menu.
2. Search for: `Map Tiles API`.
3. Click on **Map Tiles API** from Google Maps Platform.
4. Click **Enable**.

*(Note: Google Maps Platform provides a generous $200 monthly free tier credit, and 3D Tiles usage falls under this tier).*

### Step 3: Generate an API Key
1. Go to **APIs & Services** > **Credentials**.
2. Click **+ CREATE CREDENTIALS** at the top and select **API key**.
3. Copy your newly generated API key.
4. *(Recommended)* Click **Edit API Key**:
   - Under **API restrictions**, select **Restrict key**.
   - Check **Map Tiles API**.
   - Save the key restrictions.

### Step 4: Add the Key to Your Environment
In the root directory of `VAYU-SHIELD`, open `.env` (or copy from `.env.example`):

```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...your_actual_api_key_here
```

Restart your Vite development server:
```bash
npm run dev
```

---

## 3. How the 3D Engine Uses the Key

In `src/components/DisasterMap.tsx`, the application loads Google Photorealistic 3D Tiles using Cesium's native integration:

```typescript
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (googleApiKey && googleApiKey.trim() !== '') {
  const tileset = await Cesium.createGooglePhotorealistic3DTileset({
    key: googleApiKey,
  });
  viewer.scene.primitives.add(tileset);
}
```

### Automatic Fallback Behavior:
- **With API Key:** Renders the Google Photorealistic 3D Earth mesh with real geographic terrain, coastlines, and 3D structures.
- **Without API Key (or if offline/rate-limited):** The engine seamlessly falls back to high-resolution dark geospatial imagery with 3D elevation, allowing the full cyclone simulation, wind radii, rainfall, surge, and infrastructure proximity layers to operate without errors.
- The HUD displays the current active engine status in the top center pill badge:
  - `GOOGLE 3D TILES ACTIVE` (Green)
  - `CESIUM 3D GEOSPATIAL ENGINE • ELEVATION ACTIVE` (Cyan)

---

## 4. Connecting Custom Machine Learning / API Data

The simulation engine is completely decoupled from mock data. To feed live cyclone predictions from an ML model or meteorological endpoint (e.g., IMD / NOAA / ECMWF):

```typescript
import { useSimulationEngine } from './simulation/simulationEngine';

// Inside your component:
const engine = useSimulationEngine();

// To inject real API predictions:
engine.injectMLPayload({
  cyclone: {
    name: "Cyclone Mocha",
    lat: 16.85,
    lon: 82.24,
    wind_kmph: 165,
    pressure_hpa: 938,
  },
  forecast: [
    { hour: 0, lat: 16.85, lon: 82.24, wind_kmph: 165, rainfall_mm: 150, surge_m: 1.8 },
    { hour: 3, lat: 17.15, lon: 82.05, wind_kmph: 170, rainfall_mm: 220, surge_m: 2.4 },
    { hour: 6, lat: 17.50, lon: 81.75, wind_kmph: 155, rainfall_mm: 290, surge_m: 3.1 },
    // ...
  ]
});
```
The camera, forecast track, uncertainty cone, wind radius, rainfall plume, storm surge, and affected infrastructure risks will automatically re-compute and animate around the new coordinates.
