"use client";

import React from "react";
import { CycloneSnapshot, ScenarioTimeStep } from "@/data/cycloneScenarioData";
import HazardEvolution from "./HazardEvolution";
import ExposureEvolution from "./ExposureEvolution";
import ScenarioComparison from "./ScenarioComparison";

interface StormSnapshotPanelProps {
  snapshot: CycloneSnapshot;
  currentStep: ScenarioTimeStep;
  showUpperBound: boolean;
  onToggleUpperBound: () => void;
}

export default function StormSnapshotPanel({
  snapshot,
  currentStep,
  showUpperBound,
  onToggleUpperBound,
}: StormSnapshotPanelProps) {
  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-200 overflow-y-auto divide-y divide-slate-800">
      {/* Current Snapshot Header Card */}
      <div className="p-4 space-y-3 bg-gradient-to-b from-slate-850 to-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold text-blue-400 font-code tracking-widest uppercase">
              METEOROLOGICAL DOSSIER
            </div>
            <div className="text-xl font-extrabold text-white font-heading mt-0.5 flex items-center gap-2">
              <span>CURRENT SNAPSHOT</span>
              <span className="text-blue-400 text-lg font-code">[{snapshot.step}]</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="bg-red-950/80 border border-red-700/60 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded font-code">
              {snapshot.riskLevel} RISK
            </span>
            <span className="text-[10px] text-slate-400 font-code">{snapshot.dateStr}</span>
          </div>
        </div>

        {/* Timestamp & Provenance Bar */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between font-code text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="material-symbols-outlined text-[16px] text-blue-400">
              schedule
            </span>
            <span className="font-bold">{snapshot.istTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded text-[9px] font-bold">
              {snapshot.dataStatus}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
              snapshot.dataStatus === "LIVE_STREAM"
                ? "bg-red-950 text-red-300 border border-red-800"
                : "bg-amber-950 text-amber-300 border border-amber-800"
            }`}>
              {snapshot.dataStatus === "LIVE_STREAM" ? "LIVE STREAM" : "HISTORICAL REPLAY"}
            </span>
          </div>
        </div>

        {/* Narrative description */}
        <div className="text-xs text-slate-300 bg-slate-800/40 border border-slate-800 rounded-lg p-2.5 leading-relaxed font-sans">
          <div className="text-[10px] font-bold text-slate-400 font-code uppercase tracking-wider mb-0.5">
            TACTICAL SITUATION
          </div>
          {snapshot.summary}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 font-code">
          {/* Wind Speed */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Wind Speed
            </div>
            <div className="text-lg font-bold text-blue-400 mt-0.5">
              {snapshot.windSpeed_kmh}{" "}
              <span className="text-xs text-slate-400 font-normal">km/h</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Gusts: {Math.round(snapshot.windSpeed_kmh * 1.25)} km/h
            </div>
          </div>

          {/* Central Pressure */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Central Pressure
            </div>
            <div className="text-lg font-bold text-slate-100 mt-0.5">
              {snapshot.pressure_hpa}{" "}
              <span className="text-xs text-slate-400 font-normal">hPa</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Drop: -{1008 - snapshot.pressure_hpa} hPa
            </div>
          </div>

          {/* Peak Surge */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Peak Surge
            </div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">
              {snapshot.surge_m}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Above Astronomical Tide</div>
          </div>

          {/* Rainfall */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Rainfall (24h)
            </div>
            <div className="text-lg font-bold text-sky-400 mt-0.5">
              {snapshot.rainfall_mm}{" "}
              <span className="text-xs text-slate-400 font-normal">mm</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Heavy to Extremely Heavy</div>
          </div>

          {/* Exposed Population */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Exposed Population
            </div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {snapshot.exposedPopulation}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {snapshot.exposedPop_raw.toLocaleString()} souls
            </div>
          </div>

          {/* High-Risk Assets */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              High-Risk Assets
            </div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">
              {snapshot.highRiskAssets.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {snapshot.hospitalsAtRisk} Hosp · {snapshot.roadsAtRisk} km Rd
            </div>
          </div>
        </div>

        {/* Confidence & Coordinates */}
        <div className="flex items-center justify-between text-[11px] font-code text-slate-400 pt-1">
          <div>
            Position:{" "}
            <span className="text-slate-200">
              {snapshot.latitude}°N, {snapshot.longitude}°E
            </span>
          </div>
          <div>
            AI Confidence:{" "}
            <span className="text-emerald-400 font-bold">{snapshot.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Hazard Evolution Sparklines */}
      <div className="p-4">
        <HazardEvolution currentStep={currentStep} />
      </div>

      {/* Exposure Evolution Sparklines */}
      <div className="p-4">
        <ExposureEvolution currentStep={currentStep} />
      </div>

      {/* Scenario Comparison (Baseline vs Upper Bound) */}
      <div className="p-4">
        <ScenarioComparison
          currentStep={currentStep}
          showUpperBound={showUpperBound}
          onToggleUpperBound={onToggleUpperBound}
        />
      </div>
    </div>
  );
}
