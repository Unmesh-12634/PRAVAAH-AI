"use client";

import React from "react";
import {
  RiskMapAsset,
  TimelineSnapshot,
  RISK_SEVERITY_COLORS,
  DATA_STATUS_STYLES,
} from "@/data/riskMapData";

interface MapIntelligencePanelProps {
  selectedAsset: RiskMapAsset | null;
  snapshot: TimelineSnapshot;
  onClearAsset: () => void;
  onViewAsset?: () => void;
  onViewRoute?: () => void;
  onGenerateAction?: () => void;
}

function RiskBadge({ level }: { level: string }) {
  const c =
    RISK_SEVERITY_COLORS[level as keyof typeof RISK_SEVERITY_COLORS] ??
    RISK_SEVERITY_COLORS.MODERATE;
  return (
    <span
      className={[
        "inline-flex items-center gap-1 text-[10px] font-bold font-code px-2 py-0.5 rounded-full border",
        c.bg,
        c.text,
        c.border,
      ].join(" ")}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor:
            RISK_SEVERITY_COLORS[level as keyof typeof RISK_SEVERITY_COLORS]?.svgFill ??
            "#64748B",
        }}
      />
      {level}
    </span>
  );
}

function DataBadge({ status }: { status: string }) {
  const s =
    DATA_STATUS_STYLES[status as keyof typeof DATA_STATUS_STYLES] ??
    DATA_STATUS_STYLES.MODELLED;
  return (
    <span
      className={["text-[9px] font-bold font-code px-1.5 py-0.5 rounded", s.bg, s.text].join(" ")}
    >
      {status}
    </span>
  );
}

function AccessBadge({ status }: { status: "CLEAR" | "AT RISK" | "BLOCKED" }) {
  const styles: Record<string, string> = {
    CLEAR: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "AT RISK": "bg-amber-50 text-amber-700 border-amber-200",
    BLOCKED: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={["text-[10px] font-bold font-code px-1.5 py-0.5 rounded border", styles[status]].join(
        " "
      )}
    >
      {status}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] font-bold text-slate-400 font-code uppercase tracking-wider mb-1.5 mt-3 first:mt-0">
      {children}
    </div>
  );
}

function MetricRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between py-1 border-b border-slate-100 last:border-0">
      <span className="text-[11px] text-slate-500 font-medium leading-tight">{label}</span>
      <span className={["text-[11px] font-bold text-right leading-tight", valueClass].join(" ")}>
        {value}
      </span>
    </div>
  );
}

export default function MapIntelligencePanel({
  selectedAsset,
  snapshot,
  onClearAsset,
  onViewAsset,
  onViewRoute,
  onGenerateAction,
}: MapIntelligencePanelProps) {
  const isDefault = !selectedAsset;

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-none shadow-xs overflow-hidden h-full">
      {/* Panel header */}
      <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[15px] text-blue-600">info</span>
          <span className="text-[10px] font-bold text-[#0A2540] font-heading uppercase tracking-wide">
            Spatial Intelligence
          </span>
        </div>
        {!isDefault && (
          <button
            type="button"
            onClick={onClearAsset}
            className="text-slate-400 hover:text-slate-700 transition"
            title="Clear selection"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {isDefault ? (
          <>
            <SectionLabel>CURRENT AREA</SectionLabel>
            <div className="text-sm font-bold text-[#0A2540] font-heading leading-tight mb-1">
              {snapshot.cyclone.label}
            </div>
            <div className="text-[10px] text-slate-500 mb-3">
              Bapatla &amp; Ongole Littoral Belt
            </div>

            <SectionLabel>RISK ASSESSMENT</SectionLabel>
            <div className="mb-2">
              <RiskBadge level={snapshot.compositeRisk} />
            </div>

            <MetricRow
              label="Population Exposure"
              value={snapshot.exposedPopulation}
              valueClass="text-orange-700"
            />
            <MetricRow
              label="Peak Surge"
              value={`${snapshot.surgeMSL_m}m MSL`}
              valueClass="text-cyan-700"
            />
            <MetricRow
              label="Wind Speed"
              value={`${snapshot.windSpeed_kmh} km/h`}
              valueClass="text-blue-700"
            />
            <MetricRow
              label="Rainfall"
              value={`${snapshot.rainfall_mm} mm`}
              valueClass="text-sky-700"
            />
            <MetricRow
              label="Pressure"
              value={`${snapshot.cyclone.pressure_hpa} hPa`}
            />
            <MetricRow
              label="Affected Assets"
              value={snapshot.affectedAssets.toLocaleString()}
              valueClass="text-red-700"
            />
            <MetricRow
              label="Confidence"
              value={`${snapshot.confidence}%`}
              valueClass="text-emerald-700"
            />

            <div className="mt-3 pt-2 border-t border-slate-100">
              <SectionLabel>DATA STATUS</SectionLabel>
              <div className="flex flex-wrap gap-1.5 mb-1">
                <DataBadge status={snapshot.dataStatus} />
                <span className="text-[9px] font-bold bg-slate-100 text-slate-600 font-code px-1.5 py-0.5 rounded">
                  HISTORICAL REPLAY
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-code mt-1 leading-relaxed">
                IMD + ECMWF + PRAVAAH Surge Engine v4.2
              </div>
              <div className="text-[10px] text-slate-400 font-code">{snapshot.istTime}</div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic">
              Click any map asset or area for contextual intelligence.
            </div>
          </>
        ) : (
          <>
            <SectionLabel>
              {selectedAsset.type === "hospital"
                ? "HEALTHCARE FACILITY"
                : selectedAsset.type === "substation"
                ? "POWER INFRASTRUCTURE"
                : selectedAsset.type === "shelter"
                ? "CYCLONE SHELTER"
                : selectedAsset.type === "landfall"
                ? "LANDFALL ZONE"
                : selectedAsset.type === "road"
                ? "ROAD / CORRIDOR"
                : "INFRASTRUCTURE ASSET"}
            </SectionLabel>

            <div className="text-sm font-bold text-[#0A2540] font-heading leading-tight mb-0.5">
              {selectedAsset.name}
            </div>
            <div className="text-[10px] text-slate-500 mb-3">{selectedAsset.district} District</div>

            <SectionLabel>RISK PROFILE</SectionLabel>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <RiskBadge level={selectedAsset.riskLevel} />
              <DataBadge status={selectedAsset.dataStatus} />
            </div>

            <MetricRow
              label="Flood Exposure"
              value={`${selectedAsset.floodExposurePct}%`}
              valueClass={
                selectedAsset.floodExposurePct > 70
                  ? "text-red-700"
                  : selectedAsset.floodExposurePct > 40
                  ? "text-amber-700"
                  : "text-emerald-700"
              }
            />
            <MetricRow
              label="Road Access"
              value={<AccessBadge status={selectedAsset.roadAccessStatus} />}
            />
            <MetricRow
              label="Criticality"
              value={selectedAsset.criticality}
              valueClass={
                selectedAsset.criticality === "CRITICAL" ? "text-red-700" : "text-amber-700"
              }
            />
            {selectedAsset.populationDependence > 0 && (
              <MetricRow
                label="Pop. Dependence"
                value={selectedAsset.populationDependence.toLocaleString()}
                valueClass="text-orange-700"
              />
            )}
            <MetricRow
              label="Confidence"
              value={`${selectedAsset.confidence}%`}
              valueClass="text-emerald-700"
            />

            {Object.keys(selectedAsset.details).length > 0 && (
              <>
                <SectionLabel>ASSET DETAILS</SectionLabel>
                {Object.entries(selectedAsset.details).map(([k, v]) => (
                  <MetricRow key={k} label={k} value={v} />
                ))}
              </>
            )}

            <div className="mt-4 space-y-1.5 pt-2 border-t border-slate-100">
              <SectionLabel>ACTIONS</SectionLabel>
              <button
                type="button"
                onClick={onViewAsset}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition"
              >
                <span className="material-symbols-outlined text-[14px]">info</span>
                VIEW ASSET
              </button>
              <button
                type="button"
                onClick={onViewRoute}
                className="w-full flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition"
              >
                <span className="material-symbols-outlined text-[14px]">route</span>
                VIEW ACCESS ROUTE
              </button>
              <button
                type="button"
                onClick={onGenerateAction}
                className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-lg transition"
              >
                <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                GENERATE ACTION
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
