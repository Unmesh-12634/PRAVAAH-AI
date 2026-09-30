"use client";

import React from "react";
import { KpiMetric } from "@/types/disaster";
import DataStatusBadge from "./DataStatusBadge";

interface KpiCardProps {
  metric: KpiMetric;
  isSelected?: boolean;
  onSelect?: (metric: KpiMetric) => void;
}

export default function KpiCard({
  metric,
  isSelected = false,
  onSelect,
}: KpiCardProps) {
  const getBadgeStyle = (type: KpiMetric["badgeType"]) => {
    switch (type) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200/80";
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "success":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect?.(metric)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(metric);
        }
      }}
      aria-pressed={isSelected}
      className={`text-left w-full apple-card apple-press p-4 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
        isSelected
          ? "border-blue-600 ring-2 ring-blue-600/25 shadow-lg bg-blue-50/20"
          : "hover:border-slate-300"
      }`}
    >
      {/* Specular top highlight line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Top Meta Header: Title & Badges */}
      <div className="flex items-start justify-between gap-1 w-full">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-code line-clamp-1">
          {metric.title}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-code border shrink-0 transition-colors ${getBadgeStyle(
            metric.badgeType
          )}`}
        >
          {metric.badgeText}
        </span>
      </div>

      {/* Main Metric Value & Subtitle with Apple typography */}
      <div className="my-2.5 w-full">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-3xl font-extrabold font-heading tracking-[-0.03em] ${
              metric.category === "threat"
                ? "text-red-600"
                : metric.category === "healthcare"
                ? "text-slate-900"
                : "text-[#0A2540]"
            }`}
          >
            {metric.value}
          </span>
          {metric.unit && (
            <span className="text-xs font-semibold text-slate-400">
              {metric.unit}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
          {metric.subtitle}
        </p>
      </div>

      {/* Bottom Footer: Data Provenance Badge & Sector Tag */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] w-full">
        <span className="text-slate-400 font-code font-medium">
          {metric.sectorTag}
        </span>
        <DataStatusBadge provenance={metric.provenance} />
      </div>
    </button>
  );
}
