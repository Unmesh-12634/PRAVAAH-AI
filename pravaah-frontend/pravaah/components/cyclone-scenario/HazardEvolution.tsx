"use client";

import React from "react";
import {
  HAZARD_SPARKLINE_DATA,
  CYCLONE_SNAPSHOTS,
  ScenarioTimeStep,
} from "@/data/cycloneScenarioData";

interface HazardEvolutionProps {
  currentStep: ScenarioTimeStep;
}

interface SparklineProps {
  title: string;
  unit: string;
  points: { step: ScenarioTimeStep; value: number; label: string }[];
  currentStep: ScenarioTimeStep;
  strokeColor: string;
  fillGradId: string;
  gradFrom: string;
  gradTo: string;
  currentValue: string;
  delta: string;
}

function MiniSparkline({
  title,
  unit,
  points,
  currentStep,
  strokeColor,
  fillGradId,
  gradFrom,
  gradTo,
  currentValue,
  delta,
}: SparklineProps) {
  const currentIdx = points.findIndex((p) => p.step === currentStep);
  const minVal = Math.min(...points.map((p) => p.value));
  const maxVal = Math.max(...points.map((p) => p.value));
  const range = maxVal - minVal || 1;

  // SVG dimensions
  const width = 260;
  const height = 48;
  const paddingX = 12;
  const paddingY = 8;

  // Calculate coordinates
  const coords = points.map((p, i) => {
    const x = paddingX + (i / (points.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((p.value - minVal) / range) * (height - 2 * paddingY);
    return { x, y, ...p };
  });

  const pathD = coords.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${coords[coords.length - 1].x},${height} L ${coords[0].x},${height} Z`;

  const activeCoord = coords[currentIdx] || coords[0];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[11px] font-bold text-slate-300 font-sans flex items-center gap-1.5">
          <span>{title}</span>
          <span className="text-[10px] text-slate-400 font-code font-normal">({unit})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold font-code text-white">{currentValue}</span>
          <span className="text-[10px] font-code font-bold text-red-400 bg-red-950/60 border border-red-900/60 px-1 py-0.2 rounded">
            {delta}
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-12 overflow-visible select-none"
        >
          <defs>
            <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradFrom} stopOpacity="0.4" />
              <stop offset="100%" stopColor={gradTo} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaD} fill={`url(#${fillGradId})`} />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Milestone points */}
          {coords.map((c, i) => (
            <circle
              key={c.step}
              cx={c.x}
              cy={c.y}
              r={i === currentIdx ? 4.5 : 2.5}
              fill={i === currentIdx ? strokeColor : "#1E293B"}
              stroke={strokeColor}
              strokeWidth={i === currentIdx ? 2 : 1}
            />
          ))}

          {/* Synchronized vertical cursor line for active milestone */}
          <line
            x1={activeCoord.x}
            y1={2}
            x2={activeCoord.x}
            y2={height}
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />

          {/* Active pulse ring */}
          <circle
            cx={activeCoord.x}
            cy={activeCoord.y}
            r="7"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="1.5"
            opacity="0.8"
          />
        </svg>

        {/* Milestone labels row beneath */}
        <div className="flex justify-between px-1 text-[8px] text-slate-400 font-code mt-0.5">
          {points.map((p) => (
            <span
              key={p.step}
              className={p.step === currentStep ? "text-blue-400 font-bold" : ""}
            >
              {p.step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HazardEvolution({ currentStep }: HazardEvolutionProps) {
  const currentSnap =
    CYCLONE_SNAPSHOTS.find((s) => s.step === currentStep) || CYCLONE_SNAPSHOTS[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-red-400">warning</span>
          <span className="text-[11px] font-bold text-slate-200 font-code uppercase tracking-wider">
            HAZARD EVOLUTION
          </span>
        </div>
        <span className="text-[9px] text-slate-400 font-code">
          T-36h ➔ LANDFALL TRAJECTORY
        </span>
      </div>

      <div className="space-y-2">
        <MiniSparkline
          title="Wind Speed"
          unit="km/h"
          points={HAZARD_SPARKLINE_DATA.wind}
          currentStep={currentStep}
          strokeColor="#3B82F6"
          fillGradId="gradWind"
          gradFrom="#3B82F6"
          gradTo="#1E3A8A"
          currentValue={`${currentSnap.windSpeed_kmh} km/h`}
          delta={`+${currentSnap.windSpeed_kmh - 65} km/h`}
        />

        <MiniSparkline
          title="Precipitation"
          unit="mm"
          points={HAZARD_SPARKLINE_DATA.rainfall}
          currentStep={currentStep}
          strokeColor="#06B6D4"
          fillGradId="gradRain"
          gradFrom="#06B6D4"
          gradTo="#083344"
          currentValue={`${currentSnap.rainfall_mm} mm`}
          delta={`+${currentSnap.rainfall_mm - 75} mm`}
        />

        <MiniSparkline
          title="Peak Storm Surge"
          unit="m MSL"
          points={HAZARD_SPARKLINE_DATA.surge}
          currentStep={currentStep}
          strokeColor="#F59E0B"
          fillGradId="gradSurge"
          gradFrom="#F59E0B"
          gradTo="#78350F"
          currentValue={currentSnap.surge_m}
          delta={`+${(currentSnap.surgeValue_m - 0.4).toFixed(1)}m`}
        />

        <MiniSparkline
          title="Composite Risk Level"
          unit="Severity"
          points={HAZARD_SPARKLINE_DATA.risk}
          currentStep={currentStep}
          strokeColor="#EF4444"
          fillGradId="gradRisk"
          gradFrom="#EF4444"
          gradTo="#7F1D1D"
          currentValue={currentSnap.riskLevel}
          delta="CRITICAL EXP."
        />
      </div>
    </div>
  );
}
