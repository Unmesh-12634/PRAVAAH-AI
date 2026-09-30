"use client";

import React from "react";
import { TIMELINE_SNAPSHOTS, TimeStep } from "@/data/riskMapData";

interface MapTimelineProps {
  currentStep: TimeStep;
  onChangeStep: (step: TimeStep) => void;
}

const RISK_COLORS: Record<string, string> = {
  LOW: "#10B981",
  MODERATE: "#F59E0B",
  HIGH: "#F97316",
  SEVERE: "#DC2626",
  CRITICAL: "#991B1B",
};

export default function MapTimeline({ currentStep, onChangeStep }: MapTimelineProps) {
  const currentSnap = TIMELINE_SNAPSHOTS.find((s) => s.step === currentStep) || TIMELINE_SNAPSHOTS[0];
  const currentIdx = TIMELINE_SNAPSHOTS.findIndex((s) => s.step === currentStep);
  const progressPercent = (Math.max(0, currentIdx) / (TIMELINE_SNAPSHOTS.length - 1)) * 100;

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-3 select-none">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[15px] text-blue-600">history</span>
          <span className="text-[10px] font-bold text-slate-700 font-code uppercase tracking-wider">
            Historical Replay Timeline — Cyclone Michaung
          </span>
          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold font-code px-1.5 py-0.5 rounded">
            ⚠ MODELLED / HISTORICAL
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-code">
          Snapshot: <span className="font-bold text-slate-800">{currentSnap.istTime}</span>
          {" · "}Wind: <span className="font-bold text-blue-700">{currentSnap.windSpeed_kmh} km/h</span>
          {" · "}Surge: <span className="font-bold text-cyan-700">{currentSnap.surgeMSL_m}m</span>
          {" · "}Pop: <span className="font-bold text-amber-700">{currentSnap.exposedPopulation}</span>
        </div>
      </div>

      {/* Progress line + steps */}
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-200 rounded-full" />
        {/* Active progress */}
        <div
          className="absolute top-3 left-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Step buttons */}
        <div className="flex items-start justify-between relative z-10">
          {TIMELINE_SNAPSHOTS.map((snap, idx) => {
            const isActive = snap.step === currentStep;
            const isPast = idx <= currentIdx;
            const riskColor = RISK_COLORS[snap.compositeRisk] || "#64748B";

            return (
              <button
                key={snap.step}
                type="button"
                onClick={() => onChangeStep(snap.step)}
                className="flex flex-col items-center group cursor-pointer focus:outline-hidden"
              >
                {/* Node dot */}
                <div
                  className={[
                    "w-6 h-6 rounded-full flex items-center justify-center border-2 transition shadow-xs",
                    isActive
                      ? "bg-blue-600 border-white ring-2 ring-blue-500 text-white scale-110"
                      : isPast
                      ? "bg-white border-blue-500 text-blue-600 hover:border-blue-700"
                      : "bg-white border-slate-300 text-slate-400 hover:border-slate-400",
                  ].join(" ")}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isActive ? "#FFFFFF" : riskColor }}
                  />
                </div>

                {/* Step label */}
                <div className="mt-1 text-center">
                  <div
                    className={[
                      "text-[10px] font-bold font-code leading-tight",
                      isActive
                        ? "text-blue-700 font-extrabold"
                        : "text-slate-600 group-hover:text-slate-900",
                    ].join(" ")}
                  >
                    {snap.label}
                  </div>
                  <div className="text-[9px] text-slate-400 font-code leading-none mt-0.5">
                    {snap.istTime.split(" ")[1]}
                  </div>
                </div>

                {/* Risk badge pill */}
                <div
                  className="mt-1 text-[8px] font-bold font-code px-1 py-0.2 rounded"
                  style={{
                    backgroundColor: isActive ? riskColor : `${riskColor}20`,
                    color: isActive ? "#FFFFFF" : riskColor,
                  }}
                >
                  {snap.compositeRisk}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
