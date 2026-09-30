"use client";

import React from "react";
import { MapAsset } from "@/types/disaster";
import DataStatusBadge from "@/components/ui/DataStatusBadge";

interface MapAssetMarkersProps {
  assets: MapAsset[];
  selectedAssetId: string | null;
  onSelectAsset: (asset: MapAsset) => void;
  visibleLayers: {
    hospitals: boolean;
    powerGrid: boolean;
    shelters: boolean;
  };
}

export default function MapAssetMarkers({
  assets,
  selectedAssetId,
  onSelectAsset,
  visibleLayers,
}: MapAssetMarkersProps) {
  const getMarkerConfig = (type: MapAsset["type"]) => {
    switch (type) {
      case "hospital":
        return {
          icon: "local_hospital",
          bg: "bg-red-600",
          border: "border-white",
          ring: "ring-red-600/50",
          label: "HEALTHCARE",
        };
      case "substation":
        return {
          icon: "bolt",
          bg: "bg-amber-500",
          border: "border-white",
          ring: "ring-amber-500/50",
          label: "POWER GRID",
        };
      case "shelter":
        return {
          icon: "night_shelter",
          bg: "bg-blue-700",
          border: "border-white",
          ring: "ring-blue-700/50",
          label: "CYCLONE SHELTER",
        };
      case "landfall":
        return {
          icon: "flag",
          bg: "bg-rose-700",
          border: "border-white",
          ring: "ring-rose-700/50",
          label: "LANDFALL SECTOR",
        };
      default:
        return {
          icon: "location_on",
          bg: "bg-slate-700",
          border: "border-white",
          ring: "ring-slate-700/50",
          label: "ASSET",
        };
    }
  };

  const isLayerVisible = (type: MapAsset["type"]) => {
    if (type === "hospital") return visibleLayers.hospitals;
    if (type === "substation") return visibleLayers.powerGrid;
    if (type === "shelter") return visibleLayers.shelters;
    return true; // Landfall always visible
  };

  return (
    <>
      {assets.map((asset) => {
        if (!isLayerVisible(asset.type)) return null;

        const isSelected = selectedAssetId === asset.id;
        const config = getMarkerConfig(asset.type);

        return (
          <div
            key={asset.id}
            style={{
              top: `${asset.screenPos.y}%`,
              left: `${asset.screenPos.x}%`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 ${
              isSelected ? "z-40 scale-110" : "z-20"
            }`}
          >
            {/* Pulsing Selection Halo */}
            {isSelected && (
              <span
                className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${config.bg}`}
              />
            )}

            {/* Clickable Pin Button */}
            <button
              type="button"
              onClick={() => onSelectAsset(asset)}
              aria-label={`Inspect ${asset.name}`}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center shadow-lg transition-transform hover:scale-115 active:scale-95 border-2 ${
                config.bg
              } ${config.border} ${
                isSelected
                  ? "ring-4 ring-offset-2 ring-blue-600 shadow-xl"
                  : "hover:shadow-md"
              }`}
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[17px]">
                {config.icon}
              </span>
            </button>

            {/* Tactical Hover Inspection Card */}
            <div
              className={`absolute left-9 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col bg-white p-3 rounded-lg border border-slate-300 w-64 shadow-xl z-50 text-left pointer-events-auto transition-all ${
                isSelected ? "border-blue-600 ring-1 ring-blue-600" : ""
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-[10px] font-bold font-code text-slate-500 uppercase">
                  {config.label}
                </span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded font-code ${
                    asset.riskLevel === "CRITICAL"
                      ? "bg-red-100 text-red-800"
                      : asset.riskLevel === "HIGH"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {asset.riskLevel} RISK
                </span>
              </div>

              <div className="mt-1.5">
                <h4 className="text-xs font-bold text-[#0A2540] font-heading leading-tight">
                  {asset.name}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  {asset.primaryMetric}
                </p>
                <p className="text-[10px] font-code text-blue-800 font-semibold mt-1">
                  {asset.lifelineAutonomy}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                <DataStatusBadge provenance={asset.provenance} />
                <span className="text-[10px] text-blue-700 font-bold hover:underline">
                  Click to Focus →
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
