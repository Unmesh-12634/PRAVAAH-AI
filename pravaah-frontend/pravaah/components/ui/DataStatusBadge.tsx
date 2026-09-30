"use client";

import React from "react";
import { DataStatus, DataProvenance } from "@/types/disaster";

interface DataStatusBadgeProps {
  provenance: DataProvenance;
  showDetails?: boolean;
  className?: string;
}

export default function DataStatusBadge({
  provenance,
  showDetails = false,
  className = "",
}: DataStatusBadgeProps) {
  const { status, timestamp, source, confidence, uncertaintyMargin } = provenance;

  const getStatusStyles = (st: DataStatus) => {
    switch (st) {
      case "OBSERVED":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-600",
          icon: "sensors",
          label: "OBSERVED",
        };
      case "FORECAST":
        return {
          bg: "bg-sky-50 text-sky-800 border-sky-300",
          dot: "bg-sky-600",
          icon: "satellite_alt",
          label: "FORECAST",
        };
      case "MODELLED":
        return {
          bg: "bg-amber-50 text-amber-900 border-amber-300",
          dot: "bg-amber-600",
          icon: "functions",
          label: "MODELLED",
        };
      case "SIMULATED":
        return {
          bg: "bg-cyan-50 text-cyan-900 border-cyan-300",
          dot: "bg-cyan-600",
          icon: "tune",
          label: "SIMULATED",
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-300",
          dot: "bg-slate-500",
          icon: "info",
          label: st,
        };
    }
  };

  const style = getStatusStyles(status);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-code font-bold uppercase tracking-wider group relative select-none ${style.bg} ${className}`}
      title={`${style.label} data from ${source} (${timestamp})${confidence ? ` • Confidence: ${confidence}%` : ""}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{style.label}</span>
      {confidence && (
        <span className="text-[9px] opacity-75 font-normal pl-0.5 border-l border-current/20">
          {confidence}%
        </span>
      )}

      {/* Expanded Hover Popover */}
      {showDetails && (
        <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:flex flex-col bg-slate-900 text-white p-2.5 rounded-lg shadow-xl border border-slate-700 w-60 z-50 text-[11px] normal-case font-sans tracking-normal pointer-events-none">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 font-code text-[10px]">
            <span className="font-bold text-sky-300">{style.label} DATA</span>
            <span className="text-slate-400">{timestamp}</span>
          </div>
          <div className="mt-1 text-slate-300 leading-tight">
            <span className="text-slate-400 text-[10px] block">PROVENANCE / SOURCE:</span>
            {source}
          </div>
          {confidence && (
            <div className="mt-1.5 flex items-center justify-between text-[10px] font-code">
              <span className="text-slate-400">ENGINE CONFIDENCE:</span>
              <span className="text-emerald-400 font-bold">{confidence}%</span>
            </div>
          )}
          {uncertaintyMargin && (
            <div className="mt-0.5 flex items-center justify-between text-[10px] font-code">
              <span className="text-slate-400">UNCERTAINTY SPREAD:</span>
              <span className="text-amber-400 font-semibold">{uncertaintyMargin}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
