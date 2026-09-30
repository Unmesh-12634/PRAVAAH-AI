"use client";

import React from "react";
import { ScenarioTimeStep } from "@/data/cycloneScenarioData";

interface ReplayControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  currentStep: ScenarioTimeStep;
  onStepChange: (step: ScenarioTimeStep) => void;
}

export default function ReplayControls({
  isPlaying,
  onTogglePlay,
  onReset,
  currentStep,
}: ReplayControlsProps) {
  return (
    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-sm">
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={onTogglePlay}
        className={[
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition shadow-xs",
          isPlaying
            ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-code"
            : "bg-blue-600 hover:bg-blue-700 text-white font-code",
        ].join(" ")}
        title={isPlaying ? "Pause playback" : "Play replay through timeline"}
      >
        <span className="material-symbols-outlined text-[16px]">
          {isPlaying ? "pause" : "play_arrow"}
        </span>
        <span>{isPlaying ? "PAUSE" : "PLAY REPLAY"}</span>
      </button>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-xs font-bold font-code transition border border-slate-700 shadow-xs"
        title="Reset to T-36h"
      >
        <span className="material-symbols-outlined text-[15px]">restart_alt</span>
        <span>RESET</span>
      </button>

      {/* Loop status indicator */}
      <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-700/80 text-[11px] font-code text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Auto-Loop: 2s Landfall Pause</span>
      </div>

      {/* Current step mini badge */}
      <div className="ml-auto text-[11px] font-code text-slate-300">
        Active: <strong className="text-blue-400">{currentStep}</strong>
      </div>
    </div>
  );
}
