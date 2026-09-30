"use client";

import React, { useState } from "react";
import {
  CycloneSnapshot,
  ScenarioTimeStep,
} from "@/data/cycloneScenarioData";
import SarXraySwipeOverlay from "../map/SarXraySwipeOverlay";
import SurgeTimeMachineOverlay from "../map/SurgeTimeMachineOverlay";

interface StormMapProps {
  snapshot: CycloneSnapshot;
  currentStep: ScenarioTimeStep;
  is3D: boolean;
  showUpperBound: boolean;
}

export default function StormMap({
  snapshot,
  currentStep,
  is3D,
  showUpperBound,
}: StormMapProps) {
  // Map mode: "google-earth-3d" or "google-earth-2d" ONLY
  const [mapMode, setMapMode] = useState<"google-earth-3d" | "google-earth-2d">(
    is3D ? "google-earth-3d" : "google-earth-3d"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showSarSwipe, setShowSarSwipe] = useState(false);
  const [showSurgeMachine, setShowSurgeMachine] = useState(false);

  const handleToggleMode = (mode: "google-earth-3d" | "google-earth-2d") => {
    setMapMode(mode);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950 flex flex-col">
      {/* 1. TOP GIS WORKSTATION CONTROLS BAR */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Storm Status Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="bg-slate-900/90 border border-slate-700 text-slate-200 text-[11px] font-code px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold truncate max-w-[260px]">
              GOOGLE EARTH: {snapshot.classification.toUpperCase()} ({currentStep})
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400 font-bold">{snapshot.windSpeed_kmh} km/h</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400">{snapshot.pressure_hpa} hPa</span>
          </span>

          {showUpperBound && (
            <span className="bg-indigo-950/90 border border-indigo-700 text-indigo-200 text-[10px] font-code font-bold px-2.5 py-1.5 rounded-xl shadow-xl animate-pulse backdrop-blur-md">
              UPPER-BOUND ENVELOPE (95th %ile)
            </span>
          )}
        </div>

        {/* Right: Google Earth 3D / 2D Mode Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 flex items-center text-xs font-code shadow-xl">
            <button
              type="button"
              onClick={() => handleToggleMode("google-earth-2d")}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                mapMode === "google-earth-2d"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">map</span>
              <span>Google Earth 2D</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode("google-earth-3d")}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                mapMode === "google-earth-3d"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">public</span>
              <span>Google Earth 3D</span>
            </button>
          </div>

          {/* WOW FACTOR 1: SAR Cloud X-Ray Swipe */}
          <button
            type="button"
            onClick={() => setShowSarSwipe(true)}
            className="apple-press px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Open GEE Sentinel-1 SAR Cloud Penetration X-Ray Swipe Tool"
          >
            <span className="material-symbols-outlined text-[15px] text-cyan-400">satellite_alt</span>
            <span>SAR Cloud X-Ray</span>
          </button>

          {/* WOW FACTOR 2: 4D Surge Inundation Time Machine */}
          <button
            type="button"
            onClick={() => setShowSurgeMachine(true)}
            className="apple-press px-2.5 py-1 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/60 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Open 4D Surge Inundation Water-Level Simulator"
          >
            <span className="material-symbols-outlined text-[15px] text-cyan-400">tsunami</span>
            <span>4D Surge Slider</span>
          </button>
        </div>
      </div>

      {/* 2. REAL GOOGLE EARTH SIMULATION VIEWPORT (3D and 2D ONLY) */}
      <div className="w-full h-full relative overflow-hidden bg-[#020617]">
        {isLoading && (
          <div className="absolute inset-0 bg-[#071527] flex flex-col items-center justify-center text-white z-20 gap-2 font-code text-xs">
            <span className="material-symbols-outlined text-[28px] text-blue-400 animate-spin">
              progress_activity
            </span>
            <span>Switching Google Earth {mapMode === "google-earth-3d" ? "3D Perspective" : "2D Orthogonal"} Engine...</span>
          </div>
        )}
        <iframe
          key={`${mapMode}-${snapshot.latitude}-${snapshot.longitude}`}
          src={`http://localhost:5173/?mode=compact&view=${mapMode === "google-earth-3d" ? "3d" : "2d"}&step=${currentStep}&lat=${snapshot.latitude}&lng=${snapshot.longitude}`}
          className="w-full h-full border-0 pointer-events-auto absolute inset-0"
          title={`Google Earth ${mapMode === "google-earth-3d" ? "3D" : "2D"} Cyclone Simulation`}
        />

        {/* Interactive WOW Overlays */}
        {showSarSwipe && (
          <SarXraySwipeOverlay onClose={() => setShowSarSwipe(false)} />
        )}
        {showSurgeMachine && (
          <SurgeTimeMachineOverlay onClose={() => setShowSurgeMachine(false)} />
        )}
      </div>

      {/* 3. BOTTOM TELEMETRY FOOTER */}
      <div className="absolute bottom-3 right-3 z-30 pointer-events-none flex items-center gap-2 text-[10px] font-code text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md">
        <span className="text-cyan-400 font-bold">ENGINE: GOOGLE EARTH CESIUM</span>
        <span>•</span>
        <span>PROJ: WGS84 EPSG:4326</span>
        <span>•</span>
        <span className="text-amber-300 font-bold">VORTEX: {snapshot.latitude}°N, {snapshot.longitude}°E</span>
      </div>
    </div>
  );
}
