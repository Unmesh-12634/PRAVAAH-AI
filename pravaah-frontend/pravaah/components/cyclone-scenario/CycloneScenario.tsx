"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  CYCLONE_PROFILES,
  ScenarioTimeStep,
} from "@/data/cycloneScenarioData";
import StormMetrics from "./StormMetrics";
import StormMap from "./StormMap";
import StormTimeline from "./StormTimeline";
import ReplayControls from "./ReplayControls";
import StormSnapshotPanel from "./StormSnapshotPanel";

const TIMELINE_STEPS: ScenarioTimeStep[] = [
  "T-36h",
  "T-24h",
  "T-12h",
  "T-6h",
  "LANDFALL",
];

export default function CycloneScenario() {
  const [selectedCycloneId, setSelectedCycloneId] = useState<string>("live-active-2026");
  const [currentStep, setCurrentStep] = useState<ScenarioTimeStep>("T-12h");
  const [isPlaying, setIsPlaying] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [showUpperBound, setShowUpperBound] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active Cyclone Profile
  const activeCyclone =
    CYCLONE_PROFILES.find((c) => c.id === selectedCycloneId) || CYCLONE_PROFILES[0];

  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  // Active snapshot data from the active cyclone
  const snapshot =
    activeCyclone.snapshots.find((s) => s.step === currentStep) ||
    activeCyclone.snapshots[2];

  // Playback Loop Engine
  useEffect(() => {
    if (!isPlaying) return;

    let timer: NodeJS.Timeout;

    const advanceStep = () => {
      const currentIdx = TIMELINE_STEPS.indexOf(currentStepRef.current);

      if (currentIdx === TIMELINE_STEPS.length - 1) {
        timer = setTimeout(() => {
          setCurrentStep(TIMELINE_STEPS[0]);
        }, 2000);
      } else {
        timer = setTimeout(() => {
          setCurrentStep(TIMELINE_STEPS[currentIdx + 1]);
        }, 1800);
      }
    };

    advanceStep();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStep]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(TIMELINE_STEPS[0]);
  }, []);

  const handleStepChange = useCallback((step: ScenarioTimeStep) => {
    setCurrentStep(step);
  }, []);

  const handleToggle3D = useCallback(() => {
    setIs3D((prev) => !prev);
  }, []);

  const handleToggleUpperBound = useCallback(() => {
    setShowUpperBound((prev) => !prev);
  }, []);

  const handleSelectCyclone = useCallback((id: string) => {
    setSelectedCycloneId(id);
    const selected = CYCLONE_PROFILES.find((c) => c.id === id);
    if (selected) {
      showToast(
        selected.status === "LIVE_ACTIVE_THREAT"
          ? `Connected to LIVE Doppler Telemetry Stream: ${selected.name}`
          : `Loaded Historical Benchmark Archive: ${selected.name} (${selected.seasonYear})`
      );
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[640px] w-full bg-slate-950 font-sans overflow-hidden">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-code flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-sky-400">radar</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Bar with Cyclone Selector, Real Data stream, and 3D Toggle */}
      <StormMetrics
        snapshot={snapshot}
        activeCyclone={activeCyclone}
        cycloneProfiles={CYCLONE_PROFILES}
        onSelectCyclone={handleSelectCyclone}
        is3D={is3D}
        onToggle3D={handleToggle3D}
      />

      {/* 2. Official IMD Early Warning Bulletin Banner */}
      <div className="bg-red-950/80 border-b border-red-800/80 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-code text-red-200">
        <div className="flex items-center gap-2 truncate">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="font-extrabold text-red-300 uppercase tracking-wide shrink-0">
            {activeCyclone.status === "LIVE_ACTIVE_THREAT" ? "LIVE EARLY WARNING:" : "HISTORICAL BULLETIN:"}
          </span>
          <span className="truncate text-slate-100 font-medium">
            {activeCyclone.bulletinHeadline}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="text-red-300">
            Landfall Sector: <strong className="text-white">{activeCyclone.landfallSector}</strong>
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => showToast(`Sent IMD Warning Bulletin for ${activeCyclone.name} to District EOCs`)}
            className="px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-100 text-[10px] font-bold transition flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[12px]">notifications_active</span>
            <span>Broadcast Bulletin</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workstation Area: 70% Map & Controls + 30% Snapshot Dossier */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left GIS & Map Replay Column (~70%) */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950 border-r border-slate-800">
          {/* Floating Replay Controls Bar */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <ReplayControls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />
          </div>

          {/* Core Tactical Storm Map Canvas (Strictly Google Earth 3D/2D) */}
          <div className="flex-1 relative overflow-hidden">
            <StormMap
              snapshot={snapshot}
              currentStep={currentStep}
              is3D={is3D}
              showUpperBound={showUpperBound}
            />
          </div>

          {/* Bottom Storm Evolution Timeline Scrubber */}
          <div className="flex-shrink-0 z-20">
            <StormTimeline
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />
          </div>
        </div>

        {/* Right Intelligence Panel Column (~30%) */}
        <div className="w-[380px] lg:w-[420px] flex-shrink-0 bg-slate-900 overflow-y-auto">
          <StormSnapshotPanel
            snapshot={snapshot}
            currentStep={currentStep}
            showUpperBound={showUpperBound}
            onToggleUpperBound={handleToggleUpperBound}
          />
        </div>
      </div>
    </div>
  );
}
