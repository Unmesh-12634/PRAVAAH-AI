"use client";

import React from "react";
import {
  UPPER_BOUND_SCENARIO,
  CYCLONE_SNAPSHOTS,
  ScenarioTimeStep,
} from "@/data/cycloneScenarioData";

interface ScenarioComparisonProps {
  currentStep: ScenarioTimeStep;
  showUpperBound: boolean;
  onToggleUpperBound: () => void;
}

export default function ScenarioComparison({
  currentStep,
  showUpperBound,
  onToggleUpperBound,
}: ScenarioComparisonProps) {
  const currentSnap =
    CYCLONE_SNAPSHOTS.find((s) => s.step === currentStep) || CYCLONE_SNAPSHOTS[0];

  const metrics = [
    {
      label: "Wind Peak",
      baseline: `${currentSnap.windSpeed_kmh} km/h`,
      upperBound: `${UPPER_BOUND_SCENARIO.windSpeed_kmh} km/h`,
      delta: `+${UPPER_BOUND_SCENARIO.windSpeed_kmh - currentSnap.windSpeed_kmh} km/h`,
    },
    {
      label: "Precipitation",
      baseline: `${currentSnap.rainfall_mm} mm`,
      upperBound: `${UPPER_BOUND_SCENARIO.rainfall_mm} mm`,
      delta: `+${UPPER_BOUND_SCENARIO.rainfall_mm - currentSnap.rainfall_mm} mm`,
    },
    {
      label: "Peak Surge",
      baseline: currentSnap.surge_m,
      upperBound: UPPER_BOUND_SCENARIO.surge_m,
      delta: "+0.8m MSL",
    },
    {
      label: "Pop. Exposure",
      baseline: currentSnap.exposedPopulation,
      upperBound: UPPER_BOUND_SCENARIO.exposedPopulation,
      delta: "+0.80M",
    },
    {
      label: "Critical Assets",
      baseline: currentSnap.highRiskAssets.toLocaleString(),
      upperBound: UPPER_BOUND_SCENARIO.highRiskAssets.toLocaleString(),
      delta: `+${UPPER_BOUND_SCENARIO.highRiskAssets - currentSnap.highRiskAssets}`,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-purple-400">
              compare_arrows
            </span>
            <span className="text-[11px] font-bold text-slate-200 font-code uppercase tracking-wider">
              SCENARIO COMPARISON
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Baseline vs. Upper-Bound (+1σ Ensemble Envelope)
          </div>
        </div>

        <span className="bg-purple-950/80 border border-purple-700/60 text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded font-code">
          SIMULATED
        </span>
      </div>

      {/* Map Projection Toggle Button */}
      <button
        type="button"
        onClick={onToggleUpperBound}
        className={[
          "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition font-code border shadow-xs",
          showUpperBound
            ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-500 ring-2 ring-purple-400/40"
            : "bg-slate-800 hover:bg-slate-750 text-purple-300 border-slate-700 hover:border-purple-600/50",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-[15px]">
          {showUpperBound ? "visibility" : "layers"}
        </span>
        <span>
          {showUpperBound
            ? "UPPER-BOUND ENVELOPE: PROJECTED ON MAP"
            : "PROJECT UPPER-BOUND ENVELOPE ON MAP"}
        </span>
      </button>

      {/* Side-by-side Comparative Grid */}
      <div className="space-y-1.5 pt-1">
        <div className="grid grid-cols-12 text-[10px] font-code font-bold text-slate-400 pb-1 border-b border-slate-800">
          <span className="col-span-4">METRIC</span>
          <span className="col-span-3 text-right">BASELINE ({currentSnap.step})</span>
          <span className="col-span-3 text-right text-purple-400">UPPER-BOUND</span>
          <span className="col-span-2 text-right text-rose-400">STRESS</span>
        </div>

        {metrics.map((m) => (
          <div
            key={m.label}
            className="grid grid-cols-12 text-[11px] font-code py-1 px-1 rounded hover:bg-slate-800/40 transition items-center"
          >
            <span className="col-span-4 text-slate-300 font-sans text-[11px] truncate">
              {m.label}
            </span>
            <span className="col-span-3 text-right text-slate-200 font-bold">
              {m.baseline}
            </span>
            <span className="col-span-3 text-right text-purple-300 font-bold">
              {m.upperBound}
            </span>
            <span className="col-span-2 text-right text-rose-400 font-bold text-[10px]">
              {m.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Simulation note footer */}
      <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed font-sans">
        <strong className="text-purple-300 font-code">SIMULATION ADVISORY: </strong>
        {UPPER_BOUND_SCENARIO.description}
      </div>
    </div>
  );
}
