import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  Upload,
  Download,
  Compass,
  ZoomIn,
  ZoomOut,
  Target,
  Maximize2,
  Minimize2,
  Crosshair,
} from 'lucide-react';

import { SimulationEngineState } from '../simulation/simulationEngine';
import { Cyclone3DVisualizer } from './layers/CycloneLayer';
import { ForecastTrackVisualizer } from './layers/ForecastTrackLayer';
import { UncertaintyConeVisualizer } from './layers/UncertaintyConeLayer';
import { WindRadiusVisualizer } from './layers/WindRadiusLayer';
import { RainfallVisualizer } from './layers/RainfallLayer';
import { SurgeVisualizer } from './layers/SurgeLayer';
import { FloodVisualizer } from './layers/FloodLayer';
import { InfrastructureVisualizer } from './layers/InfrastructureLayer';
import { EvacuationRoutesVisualizer } from './layers/EvacuationRoutesLayer';
import { WindStreamlinesVisualizer } from './layers/WindStreamlinesLayer';
import { AtmosphericLightningVisualizer } from './layers/AtmosphericLightning';
import { EvaluatedInfrastructure } from '../simulation/riskAnimation';
import { downloadKmlFile } from '../simulation/kmlExport';

// Configure Cesium default access token to empty or environment variable
Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || '';

interface DisasterMapProps {
  engine: SimulationEngineState & {
    setSelectedInfrastructure: (item: EvaluatedInfrastructure | null) => void;
    toggleCameraFollow: () => void;
    toggleSatelliteMode: () => void;
  };
  onRegisterFocusCyclone?: (fn: () => void) => void;
  onStatusChange?: (status: 'idle' | 'active' | 'satellite', kmlName: string | null) => void;
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  engine,
  onRegisterFocusCyclone,
  onStatusChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Visualizer instances
  const cycloneVisRef = useRef<Cyclone3DVisualizer | null>(null);
  const trackVisRef = useRef<ForecastTrackVisualizer | null>(null);
  const coneVisRef = useRef<UncertaintyConeVisualizer | null>(null);
  const windVisRef = useRef<WindRadiusVisualizer | null>(null);
  const rainVisRef = useRef<RainfallVisualizer | null>(null);
  const surgeVisRef = useRef<SurgeVisualizer | null>(null);
  const floodVisRef = useRef<FloodVisualizer | null>(null);
  const infraVisRef = useRef<InfrastructureVisualizer | null>(null);
  const evacVisRef = useRef<EvacuationRoutesVisualizer | null>(null);
  const streamlinesVisRef = useRef<WindStreamlinesVisualizer | null>(null);
  const lightningVisRef = useRef<AtmosphericLightningVisualizer | null>(null);

  const [google3DStatus, setGoogle3DStatus] = useState<'loading' | 'active' | 'satellite'>('loading');
  const [googleTileset, setGoogleTileset] = useState<Cesium.Cesium3DTileset | null>(null);
  const [is3DMode, setIs3DMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') !== '2d' && params.get('dim') !== '2d';
    }
    return true;
  });
  const [importedKmlName, setImportedKmlName] = useState<string | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'eye' | 'regional' | 'wide'>('eye');

  // 1. Initialize Cesium Viewport with Google Earth photorealistic satellite imagery & 3D terrain
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    const viewer = new Cesium.Viewer(containerRef.current, {
      baseLayer: false,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      vrButton: false,
      creditContainer: document.createElement('div'), // Suppress default bottom clutter
      scene3DOnly: false,
      shadows: false,
      orderIndependentTranslucency: true,
    });

    viewerRef.current = viewer;

    // Atmospheric realism matching Google Earth
    viewer.scene.globe.enableLighting = false;
    viewer.scene.globe.showGroundAtmosphere = true;
    viewer.scene.globe.depthTestAgainstTerrain = false;
    if (viewer.scene.skyAtmosphere) {
      viewer.scene.skyAtmosphere.show = true;
    }
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#020617');

    // Remove default imagery provider
    viewer.imageryLayers.removeAll();

    // 1. Primary True-Color High-Resolution Satellite Base (Matching Google Earth Web)
    Cesium.ArcGisMapServerImageryProvider.fromUrl(
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      { enablePickFeatures: false }
    )
      .then((satelliteProvider) => {
        if (!viewer.isDestroyed()) {
          viewer.imageryLayers.addImageryProvider(satelliteProvider);
          console.info('Photorealistic Satellite Basemap loaded.');
        }
      })
      .catch((err) => {
        console.warn('Satellite imagery fallback notice:', err);
      });

    // 2. Geographic Boundaries, Coastlines & City Placemarks (Kolkata, Bhubaneswar, Puri, etc.)
    Cesium.ArcGisMapServerImageryProvider.fromUrl(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer',
      { enablePickFeatures: false }
    )
      .then((referenceProvider) => {
        if (!viewer.isDestroyed()) {
          const refLayer = viewer.imageryLayers.addImageryProvider(referenceProvider);
          refLayer.alpha = 0.85;
        }
      })
      .catch((err) => {
        console.warn('Reference boundaries fallback notice:', err);
      });

    // 3. Enable 3D Elevation Terrain if valid Cesium Ion token is configured
    const ionToken = (import.meta as any).env?.VITE_CESIUM_ION_TOKEN;
    if (ionToken && ionToken.trim() !== '') {
      Cesium.Ion.defaultAccessToken = ionToken.trim();
      Cesium.createWorldTerrainAsync({
        requestWaterMask: true,
        requestVertexNormals: true,
      })
        .then((terrainProvider) => {
          if (!viewer.isDestroyed()) {
            viewer.terrainProvider = terrainProvider;
            console.info('3D World Elevation Terrain active.');
          }
        })
        .catch((err) => {
          console.warn('Terrain provider notice:', err);
        });
    }

    // Instantiate layer visualizers
    cycloneVisRef.current = new Cyclone3DVisualizer(viewer);
    trackVisRef.current = new ForecastTrackVisualizer(viewer);
    coneVisRef.current = new UncertaintyConeVisualizer(viewer);
    windVisRef.current = new WindRadiusVisualizer(viewer);
    rainVisRef.current = new RainfallVisualizer(viewer);
    surgeVisRef.current = new SurgeVisualizer(viewer);
    floodVisRef.current = new FloodVisualizer(viewer);
    infraVisRef.current = new InfrastructureVisualizer(viewer, (item) => {
      engine.setSelectedInfrastructure(item);
    });
    evacVisRef.current = new EvacuationRoutesVisualizer(viewer);
    streamlinesVisRef.current = new WindStreamlinesVisualizer(viewer);
    lightningVisRef.current = new AtmosphericLightningVisualizer(viewer);

    // Initial camera placement: Regional overview showcasing entire storm & coast
    const targetLat = engine.payload.cyclone.lat;
    const targetLon = engine.payload.cyclone.lon;

    const initialIs2D = typeof window !== 'undefined' && (new URLSearchParams(window.location.search).get('view') === '2d' || new URLSearchParams(window.location.search).get('dim') === '2d');

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        targetLon,
        targetLat - (initialIs2D ? 0 : 0.85),
        initialIs2D ? 280000 : 240000 // Clean regional overview altitude
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(initialIs2D ? -90 : -45),
        roll: 0.0,
      },
      duration: 0,
    });

    // Attempt loading Google Photorealistic 3D Tiles if key is provided
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    async function loadGoogle3DTiles() {
      if (googleApiKey && googleApiKey.trim() !== '' && googleApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
        try {
          const tileset = await Cesium.createGooglePhotorealistic3DTileset({
            key: googleApiKey,
          });
          viewer.scene.primitives.add(tileset);
          setGoogleTileset(tileset);
          setGoogle3DStatus('active');
          console.info('Google Photorealistic 3D Tiles loaded successfully.');
        } catch (err) {
          console.warn('Google 3D Tiles notice, using Photorealistic Satellite & Terrain:', err);
          setGoogle3DStatus('satellite');
        }
      } else {
        setGoogle3DStatus('satellite');
      }
    }

    loadGoogle3DTiles();

    return () => {
      cycloneVisRef.current?.destroy();
      streamlinesVisRef.current?.destroy();
      lightningVisRef.current?.destroy();
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  // 2. Toggle Google 3D Tiles visibility with layer switch
  useEffect(() => {
    if (googleTileset) {
      googleTileset.show = engine.layers.photorealistic3D;
    }
  }, [googleTileset, engine.layers.photorealistic3D]);

  // 3. Smooth Camera Follow Mode (Locks and travels with the cyclone eye)
  const lastCameraLatRef = useRef<number>(engine.cycloneState.lat);
  const lastCameraLonRef = useRef<number>(engine.cycloneState.lon);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !engine.cameraState.followCyclone) return;

    const dist = Math.hypot(
      engine.cycloneState.lat - lastCameraLatRef.current,
      engine.cycloneState.lon - lastCameraLonRef.current
    );

    if (dist > 0.02) {
      lastCameraLatRef.current = engine.cycloneState.lat;
      lastCameraLonRef.current = engine.cycloneState.lon;

      // Maintain current altitude offset
      const currentCartographic = Cesium.Cartographic.fromCartesian(viewer.camera.position);
      const currentHeight = Math.max(45000, currentCartographic.height);
      const latOffset = currentHeight > 200000 ? 1.0 : 0.45;

      const targetPos = Cesium.Cartesian3.fromDegrees(
        engine.cycloneState.lon,
        engine.cycloneState.lat - (is3DMode ? latOffset : 0),
        currentHeight
      );

      viewer.camera.flyTo({
        destination: targetPos,
        orientation: {
          heading: viewer.camera.heading,
          pitch: viewer.camera.pitch,
          roll: 0.0,
        },
        duration: 0.6,
      });
    }
  }, [engine.cycloneState.lat, engine.cycloneState.lon, engine.cameraState.followCyclone, is3DMode]);

  // 4a. Update dynamic atmospheric visualizer layers whenever cyclone state or layers change
  useEffect(() => {
    if (!viewerRef.current) return;

    cycloneVisRef.current?.update(
      engine.cycloneState,
      true,
      engine.layers.satelliteMode
    );
    trackVisRef.current?.update(
      engine.payload.cyclone,
      engine.payload.forecast,
      engine.cycloneState,
      engine.layers.cycloneTrack
    );
    coneVisRef.current?.update(
      engine.payload.cyclone,
      engine.payload.forecast,
      engine.cycloneState,
      engine.layers.uncertaintyCone
    );
    windVisRef.current?.update(engine.cycloneState, engine.layers.windRadius);
    rainVisRef.current?.update(engine.cycloneState, engine.layers.rainfall);
    surgeVisRef.current?.update(engine.cycloneState, engine.layers.stormSurge);
    floodVisRef.current?.update(engine.cycloneState, engine.layers.floodRisk);
    streamlinesVisRef.current?.update(engine.cycloneState, engine.layers.windStreamlines);
    lightningVisRef.current?.update(engine.cycloneState, engine.layers.lightningEffects);
  }, [
    engine.cycloneState,
    engine.payload,
    engine.layers,
  ]);

  // 4b. Update static geographic facilities (infrastructure & evacuation corridors) only when their specific state changes
  useEffect(() => {
    if (!viewerRef.current) return;
    infraVisRef.current?.update(engine.infrastructure, engine.layers.infrastructure);
    evacVisRef.current?.update(engine.evacuationRoutes, engine.layers.evacuationRoutes);
  }, [
    engine.infrastructure,
    engine.layers.infrastructure,
    engine.evacuationRoutes,
    engine.layers.evacuationRoutes,
  ]);

  // 5. Explicit "FOCUS ON CYCLONE" Action (Cinematic Close-Up)
  const focusOnCyclone = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    setCameraPreset('eye');
    // Ensure follow mode is active
    if (!engine.cameraState.followCyclone) {
      engine.toggleCameraFollow();
    }

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        engine.cycloneState.lon,
        engine.cycloneState.lat - 0.42,
        72000 // 72 km close-up altitude to inspect eyewall and rotating bands
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-38),
        roll: 0.0,
      },
      duration: 1.2,
    });
  }, [engine.cycloneState, engine.cameraState.followCyclone, engine.toggleCameraFollow]);

  // 6. Camera Perspective Presets (Eye Close-Up, Coastal Regional, Wide Overview)
  const setPerspective = useCallback(
    (preset: 'eye' | 'regional' | 'wide') => {
      const viewer = viewerRef.current;
      if (!viewer) return;

      setCameraPreset(preset);

      const targetLat = engine.cycloneState.lat;
      const targetLon = engine.cycloneState.lon;

      let height = 75000;
      let latOffset = 0.45;
      let pitch = -38;

      if (preset === 'regional') {
        height = 220000;
        latOffset = 1.0;
        pitch = -42;
      } else if (preset === 'wide') {
        height = 650000;
        latOffset = 2.2;
        pitch = -52;
      }

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          targetLon,
          targetLat - (is3DMode ? latOffset : 0),
          height
        ),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(is3DMode ? pitch : -90),
          roll: 0.0,
        },
        duration: 1.2,
      });
    },
    [engine.cycloneState, is3DMode]
  );

  // 7. Smooth Zoom In & Zoom Out
  const zoomIn = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const cartographic = Cesium.Cartographic.fromCartesian(viewer.camera.position);
    const newHeight = Math.max(18000, cartographic.height * 0.55); // 45% zoom in

    // Calculate current ground focus point
    const ray = viewer.camera.getPickRay(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
    const target = ray ? viewer.scene.globe.pick(ray, viewer.scene) : null;

    if (target) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          Cesium.Math.toDegrees(cartographic.longitude),
          Cesium.Math.toDegrees(cartographic.latitude),
          newHeight
        ),
        orientation: {
          heading: viewer.camera.heading,
          pitch: viewer.camera.pitch,
          roll: viewer.camera.roll,
        },
        duration: 0.5,
      });
    } else {
      viewer.camera.zoomIn(cartographic.height * 0.4);
    }
  }, []);

  const zoomOut = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const cartographic = Cesium.Cartographic.fromCartesian(viewer.camera.position);
    const newHeight = Math.min(2200000, cartographic.height * 1.6); // 60% zoom out

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude),
        newHeight
      ),
      orientation: {
        heading: viewer.camera.heading,
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll,
      },
      duration: 0.5,
    });
  }, []);

  // 8. 2D / 3D Mode Toggle
  const toggle2D3D = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const nextMode = !is3DMode;
    setIs3DMode(nextMode);

    const cartographic = Cesium.Cartographic.fromCartesian(viewer.camera.position);

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude) - (nextMode ? 0.6 : 0),
        cartographic.height
      ),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(nextMode ? -40 : -90),
        roll: 0.0,
      },
      duration: 1.0,
    });
  }, [is3DMode]);

  // 9. Reset Orientation to True North
  const resetNorth = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.camera.flyTo({
      destination: viewer.camera.position,
      orientation: {
        heading: 0,
        pitch: viewer.camera.pitch,
        roll: 0,
      },
      duration: 0.6,
    });
  }, []);

  // 10. Handle Google Earth KML / KMZ File Upload
  const handleKmlFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const viewer = viewerRef.current;
      if (!file || !viewer) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const blob = new Blob([event.target?.result as ArrayBuffer], {
            type: 'application/vnd.google-earth.kml+xml',
          });
          const dataSource = await Cesium.KmlDataSource.load(blob, {
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas,
            clampToGround: true,
          });
          viewer.dataSources.add(dataSource);
          setImportedKmlName(file.name);
          viewer.flyTo(dataSource);
          console.info(`Google Earth KML file loaded: ${file.name}`);
        } catch (err) {
          console.error('Failed to parse Google Earth KML file:', err);
          alert('Could not parse KML file. Please ensure it is a valid Google Earth .kml or .kmz file.');
        }
      };
      reader.readAsArrayBuffer(file);
    },
    []
  );

  // Register Focus Cyclone callback with parent page
  useEffect(() => {
    onRegisterFocusCyclone?.(focusOnCyclone);
  }, [focusOnCyclone, onRegisterFocusCyclone]);

  // Inform parent of status changes (Google 3D Tiles vs Satellite / KML)
  useEffect(() => {
    const status = google3DStatus === 'loading' ? 'satellite' : google3DStatus;
    onStatusChange?.(status, importedKmlName);
  }, [google3DStatus, importedKmlName, onStatusChange]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#020617]">
      {/* Primary 3D Geospatial Cesium Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Hidden File Input for Google Earth KML Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".kml,.kmz"
        onChange={handleKmlFileUpload}
        className="hidden"
      />

      {/* Google Earth Style Bottom-Right Tactical Navigation Dock */}
      <div className="absolute bottom-28 right-5 z-20 flex flex-col items-center gap-2">
        {/* Tactical Altitude Presets (Stacked Vertically) */}
        <div className="flex flex-col w-28 rounded-xl overflow-hidden border border-[#1f2e4d] bg-[#0c1322]/90 shadow-hud p-1 gap-0.5 text-[10px] font-mono">
          <span className="text-[9px] text-slate-500 font-bold uppercase px-1 text-center py-0.5 border-b border-[#1f2e4d]/60 mb-0.5">
            Altitude
          </span>
          <button
            onClick={() => setPerspective('eye')}
            className={`w-full py-1 px-1.5 rounded transition font-semibold text-center ${
              cameraPreset === 'eye'
                ? 'bg-tactical-cyan text-slate-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-[#141e34]'
            }`}
          >
            EYE (72km)
          </button>
          <button
            onClick={() => setPerspective('regional')}
            className={`w-full py-1 px-1.5 rounded transition font-semibold text-center ${
              cameraPreset === 'regional'
                ? 'bg-tactical-cyan text-slate-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-[#141e34]'
            }`}
          >
            COASTAL
          </button>
          <button
            onClick={() => setPerspective('wide')}
            className={`w-full py-1 px-1.5 rounded transition font-semibold text-center ${
              cameraPreset === 'wide'
                ? 'bg-tactical-cyan text-slate-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-[#141e34]'
            }`}
          >
            ORBITAL
          </button>
        </div>

        {/* KML Import / Export Buttons */}
        <div className="flex flex-col gap-1 w-28">
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import KML/KMZ downloaded from Google Earth Web"
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl bg-[#0c1322]/90 hover:bg-[#141e34] border border-[#1f2e4d] text-tactical-cyan hover:text-white transition-all shadow-hud text-[11px] font-mono active:scale-95 group"
          >
            <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>IMPORT KML</span>
          </button>
          <button
            onClick={() => downloadKmlFile(engine.payload, engine.infrastructure)}
            title="Export current simulation to Google Earth KML"
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl bg-[#0c1322]/90 hover:bg-[#141e34] border border-[#1f2e4d] text-slate-300 hover:text-white transition-all shadow-hud text-[11px] font-mono active:scale-95 group"
          >
            <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            <span>EXPORT KML</span>
          </button>
        </div>

        {/* 2D / 3D Tilt Toggle */}
        <button
          onClick={toggle2D3D}
          title="Toggle 2D Top-Down / 3D Oblique Elevation"
          className="w-10 h-10 rounded-xl bg-[#0c1322]/90 hover:bg-[#141e34] border border-[#1f2e4d] text-tactical-cyan hover:text-white flex items-center justify-center font-mono font-bold text-xs shadow-hud transition active:scale-95"
        >
          {is3DMode ? '2D' : '3D'}
        </button>

        {/* Reset North Compass */}
        <button
          onClick={resetNorth}
          title="Reset Camera Orientation to North"
          className="w-10 h-10 rounded-xl bg-[#0c1322]/90 hover:bg-[#141e34] border border-[#1f2e4d] text-slate-300 hover:text-white flex items-center justify-center shadow-hud transition active:scale-95"
        >
          <Compass className="w-4 h-4 text-tactical-red" />
        </button>

        {/* Dedicated Smooth Zoom In & Zoom Out Buttons */}
        <div className="flex flex-col rounded-xl overflow-hidden border border-[#1f2e4d] bg-[#0c1322]/90 shadow-hud">
          <button
            onClick={zoomIn}
            title="Zoom In (Closer to Terrain/Eye)"
            className="w-10 h-10 flex items-center justify-center text-tactical-cyan hover:text-white hover:bg-[#141e34] transition border-b border-[#1f2e4d]/70 active:scale-90"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            title="Zoom Out (Wider View)"
            className="w-10 h-10 flex items-center justify-center text-tactical-cyan hover:text-white hover:bg-[#141e34] transition active:scale-90"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
