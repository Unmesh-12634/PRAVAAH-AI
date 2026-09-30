"use client";

import React from "react";
import {
  EXPOSURE_SPARKLINE_DATA,
  CYCLONE_SNAPSHOTS,
  ScenarioTimeStep,
} from "@/data/cycloneScenarioData";

interface ExposureEvolutionProps {
  currentStep: ScenarioTimeStep;
}

interface ExposureSparklineProps {
  title: string;
  unit: string;
  points: { step: ScenarioTimeStep; value: number; label: string }[];
  currentStep: ScenarioTimeStep;
  strokeColor: string;
  fillGradId: string;
  currentValue: string;
  badgeText: string;
}

function ExposureMiniSparkline({
  title,
  unit,
  points,
  currentStep,
  strokeColor,
  fillGradId,
  currentValue,
  badgeText,
}: ExposureSparklineProps) {
  const currentIdx = points.findIndex((p) => p.step === currentStep);
  const minVal = Math.min(...points.map((p) => p.value));
  const maxVal = Math.max(...points.map((p) => p.value));
  const range = maxVal - minVal || 1;

  const width = 260;
  const height = 44;
  const paddingX = 12;
  const paddingY = 6;

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
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-bold text-slate-300 font-sans flex items-center gap-1.5">
          <span>{title}</span>
          <span className="text-[10px] text-slate-400 font-code font-normal">({unit})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold font-code text-white">{currentValue}</span>
          <span className="text-[9px] font-code font-bold text-amber-300 bg-amber-950/70 border border-amber-900/70 px-1 py-0.2 rounded">
            {badgeText}
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-11 overflow-visible select-none"
        >
          <defs>
            <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <path d={areaD} fill={`url(#${fillGradId})`} />
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {coords.map((c, i) => (
            <circle
              key={c.step}
              cx={c.x}
              cy={c.y}
              r={i === currentIdx ? 4 : 2}
              fill={i === currentIdx ? strokeColor : "#0F172A"}
              stroke={strokeColor}
              strokeWidth={i === currentIdx ? 2 : 1}
            />
          ))}

          {/* Vertical milestone line */}
          <line
            x1={activeCoord.x}
            y1={2}
            x2={activeCoord.x}
            y2={height}
            stroke="#93C5FD"
            strokeWidth="1.2"
            strokeDasharray="2,2"
          />

          <circle
            cx={activeCoord.x}
            cy={activeCoord.y}
            r="6"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="1.5"
            opacity="0.9"
          />
        </svg>

        <div className="flex justify-between px-1 text-[8px] text-slate-400 font-code">
          {points.map((p) => (
            <span
              key={p.step}
              className={p.step === currentStep ? "text-amber-400 font-bold" : ""}
            >
              {p.step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExposureEvolution({ currentStep }: ExposureEvolutionProps) {
  const currentSnap =
    CYCLONE_SNAPSHOTS.find((s) => s.step === currentStep) || CYCLONE_SNAPSHOTS[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-amber-400">group</span>
          <span className="text-[11px] font-bold text-slate-200 font-code uppercase tracking-wider">
            EXPOSURE EVOLUTION
          </span>
        </div>
        <span className="text-[9px] text-slate-400 font-code">CIVIL IMPACT CURVE</span>
      </div>

      <div className="space-y-2">
        <ExposureMiniSparkline
          title="Exposed Population"
          unit="Persons"
          points={EXPOSURE_SPARKLINE_DATA.population}
          currentStep={currentStep}
          strokeColor="#F59E0B"
          fillGradId="gradPopExp"
          currentValue={currentSnap.exposedPopulation}
          badgeText="At Risk"
        />

        <ExposureMiniSparkline
          title="High-Risk Assets"
          unit="Units"
          points={EXPOSURE_SPARKLINE_DATA.assets}
          currentStep={currentStep}
          strokeColor="#EC4899"
          fillGradId="gradAssetsExp"
          currentValue={currentSnap.highRiskAssets.toLocaleString()}
          badgeText="Critical"
        />

        <ExposureMiniSparkline
          title="Hospitals at Risk"
          unit="Facilities"
          points={EXPOSURE_SPARKLINE_DATA.hospitals}
          currentStep={currentStep}
          strokeColor="#10B981"
          fillGradId="gradHospExp"
          currentValue={`${currentSnap.hospitalsAtRisk}`}
          badgeText="Priority"
        />

        <ExposureMiniSparkline
          title="Roads Inundated"
          unit="km Corridor"
          points={EXPOSURE_SPARKLINE_DATA.roads}
          currentStep={currentStep}
          strokeColor="#8B5CF6"
          fillGradId="gradRoadsExp"
          currentValue={`${currentSnap.roadsAtRisk} km`}
          badgeText="Restricted"
        />
      </div>
    </div>
  );
}
