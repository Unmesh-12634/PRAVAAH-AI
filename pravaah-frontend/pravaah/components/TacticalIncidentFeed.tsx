"use client";

import React, { useState } from "react";

interface IncidentLog {
  id: string;
  timestamp: string;
  source: string;
  type: "evacuation" | "power" | "rescue" | "marine" | "health";
  message: string;
  status: "CONFIRMED" | "DISPATCHED" | "STANDBY";
}

const INCIDENT_LOGS: IncidentLog[] = [
  {
    id: "log-1",
    timestamp: "13:08 IST",
    source: "DEOC BAPATLA",
    type: "evacuation",
    message: "24,800 citizens evacuated from 14 coastal hamlets to 18 RCC multipurpose shelters. 100% headcount verified.",
    status: "CONFIRMED",
  },
  {
    id: "log-2",
    timestamp: "12:54 IST",
    source: "10TH BN NDRF",
    type: "rescue",
    message: "4 motorized inflatable Gemini boat teams pre-positioned at Nizampatnam and Repalle estuary banks.",
    status: "DISPATCHED",
  },
  {
    id: "log-3",
    timestamp: "12:35 IST",
    source: "APTRANSCO GRID",
    type: "power",
    message: "Controlled stage-1 feeder islanding executed for 132kV Bapatla-Chirala transmission line to prevent electrocution.",
    status: "CONFIRMED",
  },
  {
    id: "log-4",
    timestamp: "12:18 IST",
    source: "CWC HYDRAULIC",
    type: "marine",
    message: "Prakasam Barrage discharge regulated at 14,200 cusecs; Sluice gates #1-#12 elevated for gravity runoff.",
    status: "CONFIRMED",
  },
  {
    id: "log-5",
    timestamp: "11:45 IST",
    source: "COAST GUARD REGION EAST",
    type: "marine",
    message: "1,420 registered mechanized fishing trawlers safely moored inside Krishnapatnam and Nizampatnam harbors.",
    status: "CONFIRMED",
  },
  {
    id: "log-6",
    timestamp: "11:20 IST",
    source: "HEALTH & FAMILY WELFARE",
    type: "health",
    message: "Ongole RIMS & Bapatla Area Hospital LMO tanks filled to 100% capacity (96-hour autonomous reserve).",
    status: "CONFIRMED",
  },
];

export default function TacticalIncidentFeed() {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredLogs =
    filterType === "all" ? INCIDENT_LOGS : INCIDENT_LOGS.filter((l) => l.type === filterType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
      {/* 1. Live Incident Dispatch Stream (Span 7) */}
      <div className="md:col-span-7 apple-card p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">
              podcasts
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#0A2540] font-heading uppercase tracking-wider">
                Live EOC Dispatch &amp; Incident Telemetry Stream
              </h3>
              <p className="text-[10px] text-slate-400 font-code">
                AUTOMATED INCOMING SITREPS FROM FIELD SECTORS
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-code">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE LINK
          </span>
        </div>

        {/* Incident Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-code py-0.5 scrollbar-none">
          {["all", "evacuation", "rescue", "power", "health", "marine"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`apple-press px-2 py-0.5 rounded-md font-bold uppercase transition ${
                filterType === type
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Scrollable Incident Log */}
        <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition text-xs space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-code">
                <span className="font-bold text-blue-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {log.source}
                </span>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>{log.timestamp}</span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                    {log.status}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug font-sans">
                {log.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Critical Infrastructure Autonomy Matrix (Span 5) */}
      <div className="md:col-span-5 apple-card p-4 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">
              domain_verification
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#0A2540] font-heading uppercase tracking-wider">
                Critical Lifelines Status
              </h3>
              <p className="text-[10px] text-slate-400 font-code">
                SECTOR AUTONOMY &amp; RESERVE READINESS
              </p>
            </div>
          </div>
          <span className="text-[10px] font-code text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
            AUDITED 12:30 IST
          </span>
        </div>

        {/* Lifeline Indicators Grid */}
        <div className="space-y-2.5 text-xs">
          {/* Power Grid */}
          <div className="p-2.5 rounded-xl bg-blue-50/30 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
              </div>
              <div>
                <span className="font-bold text-[#0A2540] text-[11px] block">132kV Power Grid</span>
                <span className="text-[10px] text-slate-500 font-code">Inundated feeders islanded</span>
              </div>
            </div>
            <span className="text-[10px] font-code font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              SAFE
            </span>
          </div>

          {/* Hospitals */}
          <div className="p-2.5 rounded-xl bg-emerald-50/30 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">local_hospital</span>
              </div>
              <div>
                <span className="font-bold text-[#0A2540] text-[11px] block">Hospital ICU Oxygen</span>
                <span className="text-[10px] text-slate-500 font-code">96h LMO reserve + dual DGs</span>
              </div>
            </div>
            <span className="text-[10px] font-code font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              100% BUFFER
            </span>
          </div>

          {/* Shelters */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-600/10 text-slate-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">cottage</span>
              </div>
              <div>
                <span className="font-bold text-[#0A2540] text-[11px] block">214 Cyclone Shelters</span>
                <span className="text-[10px] text-slate-500 font-code">64,200 pax / 78.3% capacity</span>
              </div>
            </div>
            <span className="text-[10px] font-code font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              SUPPLIED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
