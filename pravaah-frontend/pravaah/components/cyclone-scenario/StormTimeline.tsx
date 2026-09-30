"use client";

import React from "react";
import {
  CYCLONE_SNAPSHOTS,
  ScenarioTimeStep,
} from "@/data/cycloneScenarioData";

interface StormTimelineProps {
  currentStep: ScenarioTimeStep;
  onStepChange: (step: ScenarioTimeStep) => void;
}

const RISK_BADGES: Record<string, { bg: string; text: string; dot: string }> = {
  MODERATE: { bg: "bg-amber-100", text: "text-amber-800", dot: "#F59E0B" },
  HIGH:     { bg: "bg-orange-100", text: "text-orange-800", dot: "#F97316" },
  SEVERE:   { bg: "bg-red-100", text: "text-red-800", dot: "#DC2626" },
  CRITICAL: { bg: "bg-rose-950", text: "text-rose-200", dot: "#991B1B" },
};

export default function StormTimeline({ currentStep, onStepChange }: StormTimelineProps) {
  const currentIdx = CYCLONE_SNAPSHOTS.findIndex((s) => s.step === currentStep);
  const activePercent = (Math.max(0, currentIdx) / (CYCLONE_SNAPSHOTS.length - 1)) * 100;

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-3 select-none">
      {/* Top timeline meta info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-blue-600">timeline</span>
          <span className="text-[11px] font-bold text-slate-800 font-code uppercase tracking-wider">
            STORM EVOLUTION TIMELINE
          </span>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded font-code">
            5 MILESTONES (T-36h ➔ LANDFALL)
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-code hidden md:block">
          Select any milestone to synchronize GIS canvas, hazard vectors, and exposure dossiers
        </div>
      </div>

      {/* Track & Nodes Container */}
      <div className="relative pt-1 pb-1">
        {/* Background track */}
        <div className="absolute top-[17px] left-4 right-4 h-1 bg-slate-200 rounded-full" />

        {/* Dynamic active progress bar */}
        <div
          className="absolute top-[17px] left-4 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `calc(${activePercent}% * 0.96)` }}
        />

        {/* Milestone Steps */}
        <div className="flex items-start justify-between relative z-10">
          {CYCLONE_SNAPSHOTS.map((snap, idx) => {
            const isActive = snap.step === currentStep;
            const isPast = idx <= currentIdx;
            const badge = RISK_BADGES[snap.riskLevel] || RISK_BADGES.MODERATE;

            return (
              <button
                key={snap.step}
                type="button"
                onClick={() => onStepChange(snap.step)}
                className="flex flex-col items-center group cursor-pointer focus:outline-hidden"
              >
                {/* Node circular badge */}
                <div
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xs",
                    isActive
                      ? "bg-blue-600 border-white ring-4 ring-blue-500/30 text-white scale-125"
                      : isPast
                      ? "bg-white border-blue-500 text-blue-600 hover:border-blue-700 hover:scale-105"
                      : "bg-white border-slate-300 text-slate-400 hover:border-slate-400",
                  ].join(" ")}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full transition-colors"
                    style={{ backgroundColor: isActive ? "#FFFFFF" : badge.dot }}
                  />
                </div>

                {/* Milestone labels */}
                <div className="mt-2 text-center">
                  <div
                    className={[
                      "text-[11px] font-bold font-code leading-tight transition-colors",
                      isActive
                        ? "text-blue-700 font-extrabold text-[12px]"
                        : "text-slate-700 group-hover:text-slate-900",
                    ].join(" ")}
                  >
                    {snap.label}
                  </div>
                  <div className="text-[10px] text-slate-500 font-code leading-none mt-0.5">
                    {snap.timeStr}
                  </div>
                  <div className="text-[9px] text-slate-400 font-code leading-none mt-0.5">
                    {snap.dateStr.split(" ")[0]} {snap.dateStr.split(" ")[1]}
                  </div>

                  {/* Classification tag */}
                  <div className="text-[9px] text-slate-500 font-sans truncate max-w-[90px] mt-1 hidden sm:block">
                    {snap.subLabel}
                  </div>

                  {/* Risk pill */}
                  <div
                    className={[
                      "mt-1 text-[8px] font-bold font-code px-1.5 py-0.5 rounded transition",
                      isActive
                        ? "bg-slate-900 text-white font-extrabold"
                        : `${badge.bg} ${badge.text}`,
                    ].join(" ")}
                  >
                    {snap.riskLevel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
