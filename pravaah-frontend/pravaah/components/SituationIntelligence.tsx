"use client";

import React, { useState } from "react";
import { MapAsset } from "@/types/disaster";
import { MOCK_SITUATION_SUMMARY } from "@/data/mockDisasterData";
import DataStatusBadge from "@/components/ui/DataStatusBadge";

interface SituationIntelligenceProps {
  selectedAsset: MapAsset | null;
  onClearAssetSelection: () => void;
  onDeployNdrf: () => void;
  onTrackConvoy: () => void;
}

export default function SituationIntelligence({
  selectedAsset,
  onClearAssetSelection,
  onDeployNdrf,
  onTrackConvoy,
}: SituationIntelligenceProps) {
  const [relocatedPercent, setRelocatedPercent] = useState(74);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const toggleAction = (idx: number) => {
    const key = `${selectedAsset?.id || "general"}-${idx}`;
    setCheckedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEvacuateMore = () => {
    setRelocatedPercent((prev) => Math.min(100, prev + 2));
    onDeployNdrf();
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP SITUATION / ASSET CONTEXT CARD */}
      <div className="apple-card p-4 transition-all duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[20px] ${
                selectedAsset ? "text-blue-600 animate-pulse" : "text-red-600"
              }`}
            >
              {selectedAsset ? "gps_fixed" : "notification_important"}
            </span>
            <div>
              <h2 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider font-heading">
                {selectedAsset ? "Target Asset Intelligence" : "Priority Situation Summary"}
              </h2>
              <p className="text-[11px] text-slate-400 font-code truncate max-w-[200px]">
                {selectedAsset
                  ? `${selectedAsset.district} Sector`
                  : MOCK_SITUATION_SUMMARY.bulletinNo}
              </p>
            </div>
          </div>

          {selectedAsset ? (
            <button
              type="button"
              onClick={onClearAssetSelection}
              className="text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded font-code transition"
            >
              Sector View ×
            </button>
          ) : (
            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded font-code uppercase">
              LEVEL 4 SEVERE
            </span>
          )}
        </div>

        {/* Dynamic Body: Asset Context vs General Overview */}
        {selectedAsset ? (
          <div className="mt-3 space-y-3 animate-in fade-in duration-150">
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-code text-blue-800 uppercase tracking-wide">
                  {selectedAsset.type.toUpperCase()} • {selectedAsset.district}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-code ${
                    selectedAsset.riskLevel === "CRITICAL"
                      ? "bg-red-100 text-red-800"
                      : selectedAsset.riskLevel === "HIGH"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {selectedAsset.riskLevel} RISK
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {selectedAsset.name}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedAsset.statusDetails}
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-code block">
                Lifeline &amp; Autonomy Telemetry
              </span>
              <p className="text-xs font-semibold text-slate-800 font-code">
                {selectedAsset.lifelineAutonomy}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <DataStatusBadge provenance={selectedAsset.provenance} showDetails={true} />
                <span className="text-[10px] text-slate-400 font-code">
                  GPS: {selectedAsset.lat.toFixed(3)}°N, {selectedAsset.lng.toFixed(3)}°E
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {/* Critical Sector Focus */}
            <div className="p-3 bg-red-50/60 rounded-lg border border-red-100">
              <div className="text-[10px] font-bold font-code text-red-700 uppercase tracking-wide">
                Most Vulnerable Sector
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {MOCK_SITUATION_SUMMARY.sectorName}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {MOCK_SITUATION_SUMMARY.cooccurringHazards}
              </p>
            </div>

            {/* Metric Pair */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-code block">
                  Peak Storm Surge
                </span>
                <span className="text-base font-extrabold text-red-600 font-heading">
                  {MOCK_SITUATION_SUMMARY.peakSurge}
                </span>
                <span className="text-[10px] text-slate-500 block">High Tide Peak</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-code block">
                  Ensemble Conf.
                </span>
                <span className="text-base font-extrabold text-blue-700 font-heading">
                  {MOCK_SITUATION_SUMMARY.ensembleConfidence}% IMD/EC
                </span>
                <span className="text-[10px] text-slate-500 block">Tight Trajectory</span>
              </div>
            </div>

            {/* Vulnerability Concentration Breakdown */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Vulnerability Distribution</span>
                <span className="text-slate-500 font-code text-[11px]">
                  420k Kutcha Dwellings
                </span>
              </div>

              {/* Stacked Progress Bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-red-500 h-full w-[65%]"
                  title="Kutcha coastal houses (65%)"
                />
                <div
                  className="bg-amber-500 h-full w-[25%]"
                  title="Elderly/infants (25%)"
                />
                <div
                  className="bg-blue-500 h-full w-[10%]"
                  title="Livestock clusters (10%)"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> 65% Kutcha
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> 25% Elderly
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> 10% Feeders
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <DataStatusBadge
                provenance={MOCK_SITUATION_SUMMARY.provenance}
                showDetails={true}
              />
              <span className="text-[10px] text-slate-400 font-code">
                Mandal Zonal Grids
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. ANTICIPATORY ACTION DIRECTIVES / TARGET ASSET CHECKLIST */}
      <div className="apple-card p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">
              shield
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider font-heading">
                {selectedAsset
                  ? "Asset Action Directives"
                  : "Standing Anticipatory Orders"}
              </h3>
              <p className="text-[11px] text-slate-400 font-code">
                {selectedAsset
                  ? `TARGETED FOR ${selectedAsset.name.toUpperCase()}`
                  : "CHIEF SECRETARY STANDING ORDERS"}
              </p>
            </div>
          </div>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded font-code">
            {selectedAsset ? `${selectedAsset.actionItems.length} TASKS` : "3 ACTIVE"}
          </span>
        </div>

        {/* Dynamic Directives */}
        {selectedAsset ? (
          <div className="mt-3 space-y-2.5 animate-in fade-in duration-150">
            {selectedAsset.actionItems.map((action, idx) => {
              const isChecked = !!checkedActions[`${selectedAsset.id}-${idx}`];
              return (
                <div
                  key={idx}
                  onClick={() => toggleAction(idx)}
                  className={`p-2.5 rounded-lg border transition cursor-pointer flex items-start gap-2.5 select-none ${
                    isChecked
                      ? "bg-emerald-50/40 border-emerald-300 text-slate-500 line-through"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                      isChecked ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {isChecked ? "check_box" : "check_box_outline_blank"}
                  </span>
                  <div className="text-xs leading-snug">
                    <span className="font-bold text-[10px] font-code block text-slate-400">
                      STEP #{idx + 1}
                    </span>
                    {action}
                  </div>
                </div>
              );
            })}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onTrackConvoy}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2 rounded-lg transition active:scale-95 shadow-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">
                  local_shipping
                </span>
                Dispatch Dedicated Logistics / Track Convoys
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {/* DIRECTIVE 1: EVACUATION */}
            <div className="p-3 bg-white rounded-lg border border-red-200 shadow-xs space-y-2 border-l-4 border-l-red-600">
              <div className="flex items-center justify-between">
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded font-code">
                  PRIORITY 1 • IMMEDIATE
                </span>
                <span className="text-xs font-bold text-red-600 font-code flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />{" "}
                  {relocatedPercent}% RELOCATED
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Targeted Evacuation: 62,000 Low-Lying Residents
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Nizampatnam, Repalle &amp; Bapatla coastal hamlets. Complete before T-6h inundation onset.
              </p>

              {/* Evacuation Progress */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${relocatedPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-slate-500">28 Hamlets | 14 Shelters</span>
                <button
                  type="button"
                  onClick={handleEvacuateMore}
                  className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs flex items-center gap-1 transition active:scale-95"
                >
                  <span className="material-symbols-outlined text-[13px]">groups</span> Deploy +4 NDRF
                </button>
              </div>
            </div>

            {/* DIRECTIVE 2: HEALTHCARE POWER BACKUP */}
            <div className="p-3 bg-white rounded-lg border border-amber-200 shadow-xs space-y-2 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded font-code">
                  PRIORITY 2 • LIFELINES
                </span>
                <span className="text-xs font-bold text-amber-700 font-code">
                  DISPATCHED (ETA 45m)
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Pre-position 150 kVA Mobile DGs &amp; Liquid O₂ Buffers
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Ongole RIMS, Bapatla Area Hospital, and 8 vulnerable CHCs prone to transmission trips.
              </p>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span> APCPDCL Convoys Verified
                </span>
                <button
                  type="button"
                  onClick={onTrackConvoy}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-1 rounded border border-slate-200 transition active:scale-95"
                >
                  Track Convoy
                </button>
              </div>
            </div>

            {/* DIRECTIVE 3: CANAL PRE-DEPLETION */}
            <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-xs space-y-2 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded font-code">
                  PRIORITY 3 • UTILITY
                </span>
                <span className="text-xs font-bold text-emerald-600 font-code flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">done_all</span> COMPLETED
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                Canal Pre-Depletion &amp; Buckingham Sluice Gate Lift
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Gates #1-#12 fully opened. 14,200 cusecs gravity flushing to prevent inland backwater pooling.
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Irrigation Dept EE Logged</span>
                <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-code">
                  Telemetry Synced
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
