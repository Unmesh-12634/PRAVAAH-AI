"use client";

import React from "react";
import DataStatusBadge from "@/components/ui/DataStatusBadge";
import { DataProvenance } from "@/types/disaster";

interface DistrictItem {
  id: string;
  name: string;
  statusBadge: string;
  statusColor: string;
  bgCard: string;
  ndrf: string;
  shelters: string;
  relocated: string;
  extraLabel: string;
  extraVal: string;
  relocatedColor: string;
  collector: string;
  provenance: DataProvenance;
}

const DISTRICTS: DistrictItem[] = [
  {
    id: "bapatla",
    name: "BAPATLA DISTRICT",
    statusBadge: "LANDFALL ZONE",
    statusColor: "bg-red-100 text-red-800 border-red-200",
    bgCard: "bg-red-50/20 border-red-200 hover:border-red-400",
    ndrf: "4 Teams",
    shelters: "18/18 Active",
    relocated: "24,800 pax",
    extraLabel: "Boats",
    extraVal: "32 Ready",
    relocatedColor: "text-red-600",
    collector: "J. Venkat Rao, IAS",
    provenance: {
      status: "OBSERVED",
      source: "DEOC Bapatla VHF + Collectorate Daily Dispatch",
      timestamp: "04 DEC 06:20 IST",
      confidence: 99,
    },
  },
  {
    id: "prakasam",
    name: "PRAKASAM (ONGOLE)",
    statusBadge: "GALE FORCE 95km/h",
    statusColor: "bg-amber-100 text-amber-800 border-amber-200",
    bgCard: "bg-amber-50/20 border-amber-200 hover:border-amber-400",
    ndrf: "3 Teams",
    shelters: "14/16 Active",
    relocated: "16,200 pax",
    extraLabel: "SDRF",
    extraVal: "2 Coys",
    relocatedColor: "text-amber-700",
    collector: "A. Dinesh Kumar, IAS",
    provenance: {
      status: "OBSERVED",
      source: "DEOC Ongole Radio Net",
      timestamp: "04 DEC 06:15 IST",
      confidence: 97,
    },
  },
  {
    id: "nellore",
    name: "SPSR NELLORE",
    statusBadge: "INUNDATION SWATH",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
    bgCard: "bg-blue-50/20 border-blue-200 hover:border-blue-400",
    ndrf: "3 Teams",
    shelters: "12/12 Active",
    relocated: "18,400 pax",
    extraLabel: "Pumps",
    extraVal: "84 Heavy",
    relocatedColor: "text-blue-700",
    collector: "M. Hari Narayanan, IAS",
    provenance: {
      status: "OBSERVED",
      source: "DEOC Nellore Flood Desk",
      timestamp: "04 DEC 06:10 IST",
      confidence: 98,
    },
  },
  {
    id: "krishna",
    name: "KRISHNA / MACHILIPATNAM",
    statusBadge: "SURGE WATCH",
    statusColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    bgCard: "bg-slate-50/50 border-slate-200 hover:border-slate-400",
    ndrf: "2 Teams",
    shelters: "8/8 Active",
    relocated: "9,000 pax",
    extraLabel: "Harbor",
    extraVal: "100% Evac",
    relocatedColor: "text-slate-800",
    collector: "P. Raja Babu, IAS",
    provenance: {
      status: "OBSERVED",
      source: "Machilipatnam Port Marine Police",
      timestamp: "04 DEC 06:05 IST",
      confidence: 99,
    },
  },
];

interface DistrictReadinessMatrixProps {
  selectedDistrictId?: string | null;
  onSelectDistrict?: (districtId: string) => void;
}

export default function DistrictReadinessMatrix({
  selectedDistrictId = null,
  onSelectDistrict,
}: DistrictReadinessMatrixProps) {
  return (
    <section className="apple-card p-4 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-slate-200/80 gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-[20px]">
            corporate_fare
          </span>
          <div>
            <h4 className="text-xs font-bold text-[#0A2540] uppercase tracking-wider font-heading">
              District Emergency Operations Centers (DEOC) Readiness
            </h4>
            <p className="text-[11px] text-slate-400 font-code">
              LIVE SYNCHRONIZATION WITH DISTRICT COLLECTORATES • PROTOTYPE REPLAY
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium font-code text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All 4 Districts Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {DISTRICTS.map((dist) => {
          const isSelected = selectedDistrictId === dist.id;
          return (
            <div
              key={dist.id}
              onClick={() => onSelectDistrict?.(dist.id)}
              className={`apple-press p-3.5 rounded-xl border ${
                dist.bgCard
              } flex flex-col justify-between space-y-2.5 transition-all duration-150 cursor-pointer select-none ${
                isSelected
                  ? "ring-2 ring-blue-600 shadow-md border-blue-600 scale-[1.01]"
                  : "shadow-xs hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-xs text-[#0A2540] font-heading truncate">
                  {dist.name}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-code shrink-0 border ${dist.statusColor}`}
                >
                  {dist.statusBadge}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] font-code pt-1">
                <div className="text-slate-500">
                  NDRF: <strong className="text-slate-800">{dist.ndrf}</strong>
                </div>
                <div className="text-slate-500">
                  Shelters: <strong className="text-slate-800">{dist.shelters}</strong>
                </div>
                <div className="text-slate-500">
                  Relocated: <strong className={dist.relocatedColor}>{dist.relocated}</strong>
                </div>
                <div className="text-slate-500">
                  {dist.extraLabel}:{" "}
                  <strong
                    className={
                      dist.extraVal.includes("100%")
                        ? "text-emerald-700"
                        : "text-slate-800"
                    }
                  >
                    {dist.extraVal}
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate text-[10px]">Collector: {dist.collector}</span>
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="text-emerald-700 font-bold font-code text-[10px]">VHF LIVE</span>
                  <DataStatusBadge provenance={dist.provenance} showDetails={true} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
