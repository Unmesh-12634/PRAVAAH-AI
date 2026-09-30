"use client";

import React from "react";
import { RiskSeverity } from "@/data/riskMapData";

interface MapLegendProps {
  activeRisk: RiskSeverity;
  showWind: boolean;
  showRainfall: boolean;
  showSurge: boolean;
}

const RISK_LEVELS: Array<{ level: RiskSeverity; label: string; color: string }> = [
  { level: "LOW",      label: "LOW",      color: "#10B981" },
  { level: "MODERATE", label: "MODERATE", color: "#F59E0B" },
  { level: "HIGH",     label: "HIGH",     color: "#F97316" },
  { level: "SEVERE",   label: "SEVERE",   color: "#DC2626" },
  { level: "CRITICAL", label: "CRITICAL", color: "#991B1B" },
];

export default function MapLegend({ activeRisk, showWind, showRainfall, showSurge }: MapLegendProps) {
  return (
    <div className="absolute bottom-14 left-2 z-30 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg p-2.5 w-[170px] select-none text-slate-800">
      {/* Risk gradient */}
      <div className="mb-2">
        <div className="text-[9px] font-bold text-slate-500 font-code uppercase tracking-wider mb-1.5">
          COMPOSITE RISK
        </div>
        <div className="space-y-0.5">
          {RISK_LEVELS.map(({ level, label, color }) => {
            const isActive = level === activeRisk;
            return (
              <div
                key={level}
                className={[
                  "flex items-center gap-2 px-1.5 py-0.5 rounded transition",
                  isActive ? "bg-slate-100 font-bold" : "hover:bg-slate-50",
                ].join(" ")}
              >
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: color, opacity: isActive ? 1 : 0.7 }}
                />
                <span
                  className={[
                    "text-[10px] font-code",
                    isActive ? "text-slate-900 font-bold" : "text-slate-600",
                  ].join(" ")}
                >
                  {label}
                </span>
                {isActive && (
                  <span className="ml-auto text-[9px] text-blue-600 font-bold">◀ NOW</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unit legends — only shown when those layers are active */}
      {(showWind || showRainfall || showSurge) && (
        <div className="border-t border-slate-100 pt-2 space-y-1">
          <div className="text-[9px] font-bold text-slate-500 font-code uppercase tracking-wider mb-1">
            UNITS
          </div>
          {showWind && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-70" />
              <span className="text-[10px] text-slate-600 font-code">Wind: km/h</span>
            </div>
          )}
          {showRainfall && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 opacity-70" />
              <span className="text-[10px] text-slate-600 font-code">Rain: mm/h</span>
            </div>
          )}
          {showSurge && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 opacity-70" />
              <span className="text-[10px] text-slate-600 font-code">Surge: m (MSL)</span>
            </div>
          )}
        </div>
      )}

      {/* Symbol key */}
      <div className="border-t border-slate-100 pt-2 space-y-1">
        <div className="text-[9px] font-bold text-slate-500 font-code uppercase tracking-wider mb-1">
          SYMBOLS
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-600 border border-white inline-block flex-shrink-0" />
          <span className="text-[10px] text-slate-600 font-code">Cyclone Center</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[12px] text-emerald-600 flex-shrink-0">
            local_hospital
          </span>
          <span className="text-[10px] text-slate-600 font-code">Hospital</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[12px] text-amber-600 flex-shrink-0">
            bolt
          </span>
          <span className="text-[10px] text-slate-600 font-code">Power Grid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[12px] text-blue-600 flex-shrink-0">
            anchor
          </span>
          <span className="text-[10px] text-slate-600 font-code">Port / Harbor</span>
        </div>
      </div>
    </div>
  );
}
