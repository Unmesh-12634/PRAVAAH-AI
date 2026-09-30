"use client";

import React from "react";
import { CycloneSnapshot, CycloneProfile } from "@/data/cycloneScenarioData";

interface StormMetricsProps {
  snapshot: CycloneSnapshot;
  activeCyclone: CycloneProfile;
  cycloneProfiles: CycloneProfile[];
  onSelectCyclone: (id: string) => void;
  is3D: boolean;
  onToggle3D: () => void;
}

export default function StormMetrics({
  snapshot,
  activeCyclone,
  cycloneProfiles,
  onSelectCyclone,
  is3D,
  onToggle3D,
}: StormMetricsProps) {
  const isLive = activeCyclone.status === "LIVE_ACTIVE_THREAT";

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-slate-200 select-none">
      {/* Left: Cyclone Selector & Intelligence Mode */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isLive ? "bg-red-500 animate-ping" : "bg-amber-400"
            }`}
          />
          <span className="text-xs font-extrabold tracking-wider text-white font-heading uppercase">
            {isLive ? "LIVE CYCLONE RADAR INTELLIGENCE" : "CYCLONE BENCHMARK REPLAY"}
          </span>
        </div>

        {/* Live / Historical Cyclone Selector Dropdown */}
        <div className="flex items-center gap-1.5">
          <select
            value={activeCyclone.id}
            onChange={(e) => onSelectCyclone(e.target.value)}
            className="bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-code font-bold text-white px-2.5 py-1 rounded-lg outline-none cursor-pointer transition shadow-xs"
            title="Select Live Active Cyclone or Historical Benchmark"
          >
            {cycloneProfiles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.status === "LIVE_ACTIVE_THREAT" ? "🔴 [LIVE] " : "📜 "}
                {c.name} ({c.seasonYear})
              </option>
            ))}
          </select>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded font-code uppercase tracking-wider ${
              isLive
                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
            }`}
          >
            {isLive ? "REAL DATA STREAM" : "HISTORICAL BENCHMARK"}
          </span>
        </div>
      </div>

      {/* Right: Snapshot High-Level Telemetry */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs font-code flex-wrap">
        <div className="hidden xl:flex items-center gap-1.5 text-slate-400">
          <span>Target Sector:</span>
          <strong className="text-white truncate max-w-[180px]">
            {activeCyclone.landfallSector}
          </strong>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Distance to Coast:</span>
          <strong className={snapshot.landfallDistance_km <= 100 ? "text-red-400 font-bold" : "text-amber-400 font-bold"}>
            {snapshot.landfallDistance_km === 0
              ? "0 km (LANDFALL)"
              : `${snapshot.landfallDistance_km} km`}
          </strong>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Wind:</span>
          <strong className="text-blue-400">{snapshot.windSpeed_kmh} km/h</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Pressure:</span>
          <strong className="text-slate-200">{snapshot.pressure_hpa} hPa</strong>
        </div>

        {/* 3D Storm View Toggle */}
        <button
          type="button"
          onClick={onToggle3D}
          className={[
            "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-code transition border shadow-xs",
            is3D
              ? "bg-blue-600 text-white border-blue-500 shadow-sm"
              : "bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-750",
          ].join(" ")}
          title="Toggle 3D Google Earth / Satellite Perspective"
        >
          <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
          <span>{is3D ? "3D ON" : "3D VIEW"}</span>
        </button>
      </div>
    </div>
  );
}
