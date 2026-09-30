"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  TIMELINE_SNAPSHOTS,
  RiskMapAsset,
  TimeStep,
  DEFAULT_STEP,
  getDefaultLayerState,
  LayerState,
} from "@/data/riskMapData";
import RiskMapCanvas from "./RiskMapCanvas";
import MapToolbar from "./MapToolbar";
import LayerControl from "./LayerControl";
import MapLegend from "./MapLegend";
import MapTimeline from "./MapTimeline";
import MapIntelligencePanel from "./MapIntelligencePanel";
import SarXraySwipeOverlay from "../map/SarXraySwipeOverlay";
import SurgeTimeMachineOverlay from "../map/SurgeTimeMachineOverlay";

interface ToastMsg {
  id: number;
  text: string;
}

interface RiskMapProps {
  onBackToDashboard?: () => void;
}

export default function RiskMap({ onBackToDashboard }: RiskMapProps = {}) {
  const [engineMode, setEngineMode] = useState<"google-earth-3d" | "google-earth-2d">("google-earth-3d");
  const [showSarSwipe, setShowSarSwipe] = useState(false);
  const [showSurgeMachine, setShowSurgeMachine] = useState(false);
  const [currentStep, setCurrentStep] = useState<TimeStep>(DEFAULT_STEP);
  const [layers, setLayers] = useState<LayerState>(getDefaultLayerState);
  const [selectedAsset, setSelectedAsset] = useState<RiskMapAsset | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [isSatellite, setIsSatellite] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitCount, setFitCount] = useState(0);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const toastIdRef = useRef(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const snapshot = TIMELINE_SNAPSHOTS.find((s) => s.step === currentStep) || TIMELINE_SNAPSHOTS[0];

  const addToast = useCallback((text: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Listen for EXIT message from inside the 3D Google Earth HUD
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "PRAVAAH_EXIT_3D_MAP") {
        onBackToDashboard?.();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onBackToDashboard]);

  const handleToggleFullscreen = useCallback(() => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => addToast("Fullscreen not supported or blocked"));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, [addToast]);

  return (
    <div
      ref={mapContainerRef}
      className={[
        "flex flex-col bg-[#020617] overflow-hidden font-sans",
        isFullscreen ? "h-screen w-screen fixed inset-0 z-50" : "h-[calc(100vh-80px)] min-h-[640px] w-full",
      ].join(" ")}
    >
      {/* 1. Tactical Geospatial Subheader / Mode Control Strip */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 select-none z-30">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="apple-press flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl border border-blue-400/30 shadow-sm transition active:scale-95 shadow-blue-500/20"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Dashboard</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-blue-950/80 border border-blue-700/60 px-2.5 py-0.5 rounded-lg text-[11px] font-bold text-blue-300 font-code">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              GOOGLE EARTH 3D WORKSTATION
            </div>
            <span className="text-slate-200 text-xs font-semibold hidden md:inline">
              Cyclone Michaung — Photorealistic 3D Atmospheric Inundation Engine
            </span>
          </div>
        </div>

        {/* Engine Switcher & Fullscreen Mode */}
        <div className="flex items-center gap-2.5 text-xs font-code">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setEngineMode("google-earth-3d");
                addToast("Switched to Google Earth 3D Photorealistic Atmosphere Mode");
              }}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                engineMode === "google-earth-3d"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">public</span>
              <span>Google Earth 3D</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEngineMode("google-earth-2d" as any);
                addToast("Switched to Google Earth 2D Orthogonal Satellite Mode");
              }}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                (engineMode as any) === "google-earth-2d"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">map</span>
              <span>Google Earth 2D</span>
            </button>
          </div>

          {/* WOW FACTOR 1: SAR Cloud X-Ray Swipe */}
          <button
            type="button"
            onClick={() => setShowSarSwipe(true)}
            className="apple-press px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Open GEE Sentinel-1 SAR Cloud Penetration X-Ray Swipe Tool"
          >
            <span className="material-symbols-outlined text-[15px] text-cyan-400">satellite_alt</span>
            <span>SAR Cloud X-Ray</span>
          </button>

          {/* WOW FACTOR 2: 4D Surge Inundation Time Machine */}
          <button
            type="button"
            onClick={() => setShowSurgeMachine(true)}
            className="apple-press px-2.5 py-1 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/60 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Open 4D Surge Inundation Water-Level Simulator"
          >
            <span className="material-symbols-outlined text-[15px] text-cyan-400">tsunami</span>
            <span>4D Surge Slider</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="apple-press p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Toggle Fullscreen"
          >
            <span className="material-symbols-outlined text-[17px]">
              {isFullscreen ? "fullscreen_exit" : "fullscreen"}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Main Full-Face Workstation Canvas — GOOGLE EARTH ONLY (3D / 2D) */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#020617]">
        <iframe
          key={engineMode === "google-earth-3d" ? "ge-3d" : "ge-2d"}
          src={`http://localhost:5173/?mode=full&view=${engineMode === "google-earth-3d" ? "3d" : "2d"}`}
          className="w-full h-full border-0 absolute inset-0"
          title={`Google Earth ${engineMode === "google-earth-3d" ? "3D" : "2D"} Disaster Simulation`}
          allow="geolocation; camera; accelerometer"
        />

        {/* Interactive WOW Overlays */}
        {showSarSwipe && (
          <SarXraySwipeOverlay onClose={() => setShowSarSwipe(false)} />
        )}
        {showSurgeMachine && (
          <SurgeTimeMachineOverlay onClose={() => setShowSurgeMachine(false)} />
        )}
      </div>

      {/* Floating Notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900/95 border border-blue-500/40 text-blue-200 text-xs px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md font-code animate-in slide-in-from-bottom-2 duration-150"
            >
              {t.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
