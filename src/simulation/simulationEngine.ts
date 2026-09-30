import { useState, useEffect, useRef, useCallback } from 'react';
import {
  SimulationPayload,
  LayerVisibility,
  InfrastructureItem,
  EvacuationRoute,
  CameraState,
} from './types';
import {
  PRIMARY_MOCK_PAYLOAD,
  SUPER_CYCLONE_PAYLOAD,
  MOCK_INFRASTRUCTURE,
  MOCK_EVACUATION_ROUTES,
} from './mockData';
import { interpolateCycloneAtHour, InterpolatedCycloneState } from './cycloneAnimation';
import { evaluateInfrastructureRisks, EvaluatedInfrastructure } from './riskAnimation';

export const DEFAULT_LAYERS: LayerVisibility = {
  cycloneTrack: true,
  uncertaintyCone: true,
  windRadius: true,
  rainfall: true,
  floodRisk: true,
  stormSurge: true,
  infrastructure: true,
  evacuationRoutes: true,
  photorealistic3D: true,
  windStreamlines: true,
  lightningEffects: true,
  satelliteMode: 'natural',
};

export interface SimulationEngineState {
  payload: SimulationPayload;
  currentHour: number;
  maxHour: number;
  isPlaying: boolean;
  speed: 1 | 2 | 4;
  layers: LayerVisibility;
  cameraState: CameraState;
  cycloneState: InterpolatedCycloneState;
  infrastructure: EvaluatedInfrastructure[];
  evacuationRoutes: EvacuationRoute[];
  selectedInfrastructure: EvaluatedInfrastructure | null;
  selectedScenarioKey: string;
}

export function useSimulationEngine() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('demo');
  const [payload, setPayload] = useState<SimulationPayload>(PRIMARY_MOCK_PAYLOAD);
  const [currentHour, setCurrentHour] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_LAYERS);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<EvaluatedInfrastructure | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>({
    lat: PRIMARY_MOCK_PAYLOAD.cyclone.lat,
    lon: PRIMARY_MOCK_PAYLOAD.cyclone.lon,
    height: 180000, // 180 km altitude command center tactical perspective
    heading: 335,
    pitch: -45, // Tilted oblique perspective showcasing 3D elevation
    roll: 0,
    followCyclone: true,
  });

  const maxHour = payload.forecast[payload.forecast.length - 1]?.hour || 15;

  // Real-time interpolated cyclone position & atmospheric parameters
  const cycloneState = interpolateCycloneAtHour(payload.cyclone, payload.forecast, currentHour);

  // Dynamic infrastructure proximity and risk evaluation
  const evaluatedInfrastructure = evaluateInfrastructureRisks(MOCK_INFRASTRUCTURE, cycloneState);

  // Update selected infrastructure reference if present
  useEffect(() => {
    if (selectedInfrastructure) {
      const refreshed = evaluatedInfrastructure.find((i) => i.id === selectedInfrastructure.id);
      if (refreshed) {
        setSelectedInfrastructure(refreshed);
      }
    }
  }, [cycloneState, evaluatedInfrastructure, selectedInfrastructure]);

  // Tick simulation loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = performance.now();
      return;
    }

    const animate = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Base: 1 real second = 0.5 simulation hours at 1x speed
      const hoursAdvance = dt * 0.5 * speed;

      setCurrentHour((prev) => {
        const next = prev + hoursAdvance;
        if (next >= maxHour) {
          setIsPlaying(false);
          return maxHour;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, speed, maxHour]);

  // Playback control handlers
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentHour(0);
  }, []);
  const seekTo = useCallback(
    (hour: number) => {
      setCurrentHour(Math.max(0, Math.min(hour, maxHour)));
    },
    [maxHour]
  );

  const toggleLayer = useCallback((layerKey: keyof LayerVisibility) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  const toggleCameraFollow = useCallback(() => {
    setCameraState((prev) => ({
      ...prev,
      followCyclone: !prev.followCyclone,
    }));
  }, []);

  // Scenario switch handler (also demonstrates external ML payload integration)
  const switchScenario = useCallback((scenarioKey: string) => {
    setIsPlaying(false);
    setCurrentHour(0);
    setSelectedScenarioKey(scenarioKey);
    setSelectedInfrastructure(null);

    if (scenarioKey === 'super') {
      setPayload(SUPER_CYCLONE_PAYLOAD);
      setCameraState((c) => ({
        ...c,
        lat: SUPER_CYCLONE_PAYLOAD.cyclone.lat,
        lon: SUPER_CYCLONE_PAYLOAD.cyclone.lon,
      }));
    } else {
      setPayload(PRIMARY_MOCK_PAYLOAD);
      setCameraState((c) => ({
        ...c,
        lat: PRIMARY_MOCK_PAYLOAD.cyclone.lat,
        lon: PRIMARY_MOCK_PAYLOAD.cyclone.lon,
      }));
    }
  }, []);

  /**
   * Public method to inject live ML / API predictions dynamically
   */
  const injectMLPayload = useCallback((customPayload: SimulationPayload) => {
    setIsPlaying(false);
    setCurrentHour(0);
    setSelectedScenarioKey('custom-ml');
    setPayload(customPayload);
    setCameraState((c) => ({
      ...c,
      lat: customPayload.cyclone.lat,
      lon: customPayload.cyclone.lon,
    }));
  }, []);

  const toggleSatelliteMode = useCallback(() => {
    setLayers((prev) => ({
      ...prev,
      satelliteMode: prev.satelliteMode === 'natural' ? 'infrared' : 'natural',
    }));
  }, []);

  return {
    payload,
    currentHour,
    maxHour,
    isPlaying,
    speed,
    layers,
    cameraState,
    cycloneState,
    infrastructure: evaluatedInfrastructure,
    evacuationRoutes: MOCK_EVACUATION_ROUTES,
    selectedInfrastructure,
    selectedScenarioKey,
    play,
    pause,
    togglePlay,
    reset,
    seekTo,
    setSpeed,
    toggleLayer,
    toggleSatelliteMode,
    setLayers,
    setCameraState,
    toggleCameraFollow,
    setSelectedInfrastructure,
    switchScenario,
    injectMLPayload,
  };
}
