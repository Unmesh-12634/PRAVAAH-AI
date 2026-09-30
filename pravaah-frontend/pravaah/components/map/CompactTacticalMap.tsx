"use client";

import React, { useState, useEffect } from "react";
import { MapAsset } from "@/types/disaster";
import { MapLayerState } from "./types";
import SvgCartographyLayer from "./SvgCartographyLayer";
import MapAssetMarkers from "./MapAssetMarkers";
import SarXraySwipeOverlay from "./SarXraySwipeOverlay";
import SurgeTimeMachineOverlay from "./SurgeTimeMachineOverlay";

interface CompactTacticalMapProps {
  assets: MapAsset[];
  selectedAsset: MapAsset | null;
  onSelectAsset: (asset: MapAsset | null) => void;
  onOpenFullMap: () => void;
}

const TIMELINE_STEPS = [
  { id: "t36", label: "T-36h Warning", percent: 0, time: "-36:00:00" },
  { id: "t24", label: "T-24h Evacuation", percent: 30, time: "-24:00:00" },
  { id: "t12", label: "T-12h Rainbands (Current)", percent: 60, time: "-12:00:00", current: true },
  { id: "t6", label: "T-6h Surge Peak", percent: 85, time: "-06:00:00" },
  { id: "landfall", label: "Landfall (Bapatla)", percent: 100, time: "00:00:00" },
];

export default function CompactTacticalMap({
  assets,
  selectedAsset,
  onSelectAsset,
  onOpenFullMap,
}: CompactTacticalMapProps) {
  const [layers, setLayers] = useState<MapLayerState>({
    galeWind: true,
    stormSurge: true,
    dopplerRadar: true,
    shelters: true,
    hospitals: true,
    powerGrid: true,
    evacuationRoutes: false,
    floodPathways: false,
  });

  const [use3DRealGlobe, setUse3DRealGlobe] = useState<boolean>(false);
  const [is3DLoading, setIs3DLoading] = useState<boolean>(false);
  const [showSarSwipe, setShowSarSwipe] = useState<boolean>(false);
  const [showSurgeMachine, setShowSurgeMachine] = useState<boolean>(false);

  // Timeline Scrubber state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [progress, setProgress] = useState(60);
  const [currentStepIndex, setCurrentStepIndex] = useState(2);

  // Timeline auto-advance
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return Math.min(100, prev + 0.4 * speed);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setProgress(TIMELINE_STEPS[index].percent);
  };

  const handlePrevious = () => {
    const nextIdx = Math.max(0, currentStepIndex - 1);
    handleStepClick(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(TIMELINE_STEPS.length - 1, currentStepIndex + 1);
    handleStepClick(nextIdx);
  };

  const calculateDisplayTime = () => {
    const totalMinutes = 36 * 60;
    const elapsedMinutes = (progress / 100) * totalMinutes;
    const remainingMinutes = Math.round(totalMinutes - elapsedMinutes);
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    if (remainingMinutes <= 0) return "00:00:00 (LANDFALL)";
    return `-${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
  };

  const toggleLayer = (layerKey: keyof MapLayerState) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleToggle3D = (enable3D: boolean) => {
    setUse3DRealGlobe(enable3D);
    if (enable3D) {
      setIs3DLoading(true);
      setTimeout(() => setIs3DLoading(false), 1200);
    }
  };

  return (
    <div className="apple-card overflow-hidden flex flex-col relative group transition-all duration-300 border border-slate-200/90 shadow-sm bg-white">
      {/* Specular top highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-30 pointer-events-none" />

      {/* 1. TOP TACTICAL CONTROL BAR */}
      <div className="px-4 py-3 bg-[#0A192F] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-xs">
            <span className="material-symbols-outlined text-[19px]">satellite_alt</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white font-heading tracking-tight">
                C4ISR Coastal GIS Tactical Radar
              </span>
              <span className="bg-red-950/90 text-red-300 border border-red-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full font-code flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                RADAR SWEEP ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-code mt-0.5">
              Sector: Bapatla &amp; SPSR Nellore Coastal Inundation Swath (T-12h Landfall)
            </p>
          </div>
        </div>

        {/* View Mode & Open Full 3D Map CTA */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 2D / 3D Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs font-code">
            <button
              type="button"
              onClick={() => handleToggle3D(false)}
              className={`apple-press px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                !use3DRealGlobe
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">map</span>
              <span>Google Earth 2D</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggle3D(true)}
              className={`apple-press px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                use3DRealGlobe
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">public</span>
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

          {/* Full Screen 3D Workspace Button */}
          <button
            type="button"
            onClick={onOpenFullMap}
            className="apple-press px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shadow-blue-500/20"
            title="Open dedicated full-screen Google Earth simulation screen"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>Open Dedicated Google Earth Screen</span>
          </button>
        </div>
      </div>

      {/* 2. LAYER FILTER TOGGLE STRIP */}
      <div className="px-4 py-2 bg-[#0d1f38] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] font-code scrollbar-none select-none z-20">
        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 shrink-0">
          GOOGLE EARTH SENSORS:
        </span>
        <button
          type="button"
          onClick={() => toggleLayer("dopplerRadar")}
          className={`apple-press px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 shrink-0 ${
            layers.dopplerRadar
              ? "bg-blue-600/30 text-blue-300 border-blue-500/50"
              : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">radar</span>
          <span>Doppler Sweep</span>
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("stormSurge")}
          className={`apple-press px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 shrink-0 ${
            layers.stormSurge
              ? "bg-cyan-600/30 text-cyan-300 border-cyan-500/50"
              : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">tsunami</span>
          <span>Surge Inundation (+1.8m)</span>
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("hospitals")}
          className={`apple-press px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 shrink-0 ${
            layers.hospitals
              ? "bg-emerald-600/30 text-emerald-300 border-emerald-500/50"
              : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">local_hospital</span>
          <span>Hospitals (8)</span>
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("powerGrid")}
          className={`apple-press px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 shrink-0 ${
            layers.powerGrid
              ? "bg-amber-600/30 text-amber-300 border-amber-500/50"
              : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          <span>132kV Substations</span>
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("shelters")}
          className={`apple-press px-2.5 py-1 rounded-lg font-bold border transition flex items-center gap-1 shrink-0 ${
            layers.shelters
              ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
              : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">cottage</span>
          <span>MPCS Shelters (214)</span>
        </button>
      </div>

      {/* 3. TACTICAL MAP VIEWPORT (440px height) — GOOGLE EARTH ONLY (3D / 2D) */}
      <div className="relative w-full h-[440px] bg-[#071527] overflow-hidden select-none">
        <div className="w-full h-full relative">
          {is3DLoading && (
            <div className="absolute inset-0 bg-[#071527] flex flex-col items-center justify-center text-white z-10 gap-2 font-code text-xs">
              <span className="material-symbols-outlined text-[28px] text-blue-400 animate-spin">
                progress_activity
              </span>
              <span>Connecting to Google Earth {use3DRealGlobe ? "3D Atmosphere" : "2D Orthogonal"} Engine...</span>
            </div>
          )}
          <iframe
            key={use3DRealGlobe ? "earth-3d" : "earth-2d"}
            src={`http://localhost:5173/?mode=compact&view=${use3DRealGlobe ? "3d" : "2d"}`}
            className="w-full h-full border-0 pointer-events-auto"
            title={`Google Earth ${use3DRealGlobe ? "3D" : "2D"} Disaster Simulation Short View`}
          />

          {/* Interactive WOW Overlays */}
          {showSarSwipe && (
            <SarXraySwipeOverlay onClose={() => setShowSarSwipe(false)} />
          )}
          {showSurgeMachine && (
            <SurgeTimeMachineOverlay onClose={() => setShowSurgeMachine(false)} />
          )}
        </div>

        {/* Dynamic Island Style Telemetry Pill */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-xl text-[11px] font-code flex items-center gap-2.5 text-white pointer-events-none z-20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold tracking-wide">MICHAUNG</span>
          <span className="text-slate-500">|</span>
          <span className="text-red-400 font-bold">105 km/h GUSTS</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 font-bold">+1.8m SURGE</span>
          <span className="text-slate-400 text-[10px]">988 hPa</span>
        </div>

        {/* Selected Asset Information Floating Card (if any selected) */}
        {selectedAsset && (
          <div className="absolute top-3 left-3 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-blue-400/30 text-white shadow-2xl max-w-[280px] z-20 animate-in fade-in">
            <div className="flex items-center justify-between text-[10px] font-code text-blue-300 pb-1 border-b border-slate-800">
              <span className="uppercase font-bold">{selectedAsset.type}</span>
              <button
                type="button"
                onClick={() => onSelectAsset(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs font-bold mt-1 text-slate-100 font-heading">
              {selectedAsset.name}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              {selectedAsset.statusDetails}
            </p>
            <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] font-code text-emerald-400 font-bold">
              <span>{selectedAsset.riskLevel} RISK</span>
              <span>{selectedAsset.district}</span>
            </div>
          </div>
        )}

        {/* Quick Launch Full 3D Map Banner Overlay */}
        <div className="absolute inset-x-3 bottom-3 bg-slate-950/85 backdrop-blur-md p-2.5 px-4 rounded-xl border border-white/15 flex items-center justify-between text-white shadow-xl opacity-90 group-hover:opacity-100 transition-opacity z-20 pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="material-symbols-outlined text-[17px] text-cyan-300">
              public
            </span>
            <span className="text-slate-200">
              3D Cesium Atmosphere &amp; Storm Vortex Simulation Engine
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenFullMap}
            className="apple-press text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm transition"
          >
            <span>Launch Full Face 3D Map</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 4. INTEGRATED TIMELINE REPLAY SCRUBBER DOCK */}
      <div className="px-5 py-3.5 bg-white border-t border-slate-200/90 flex flex-col gap-2 z-20">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-code">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              title="Previous step"
              className="apple-press w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition"
            >
              <span className="material-symbols-outlined text-[18px]">skip_previous</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause simulation" : "Play simulation"}
              className="apple-press w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition shadow-blue-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Next step"
              className="apple-press w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition"
            >
              <span className="material-symbols-outlined text-[18px]">skip_next</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold text-slate-600 ml-1 border border-slate-200/60">
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s as any)}
                  className={`px-2 py-0.5 rounded-md transition ${
                    speed === s ? "bg-white shadow-2xs text-blue-700 font-bold" : "text-slate-500"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Replay Step Markers & Scrubber Bar */}
          <div className="flex-1 min-w-[280px] mx-2 sm:mx-6 flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              {TIMELINE_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className={`transition hover:text-slate-900 ${
                    step.current ? "font-bold text-red-600 flex items-center gap-1" : ""
                  }`}
                >
                  {step.current && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
                  {step.label}
                </button>
              ))}
            </div>

            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                setProgress(newPercent);
              }}
              className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative cursor-pointer border border-slate-200/80"
            >
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-[#0A2540] shadow-sm transform -translate-x-1/2"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          {/* Scrubber Readout */}
          <div className="text-slate-600 font-semibold shrink-0">
            Scrubber: <span className="text-[#0A2540] font-bold font-code">{calculateDisplayTime()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
