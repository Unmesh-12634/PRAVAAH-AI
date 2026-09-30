"use client";

import React, { useState } from "react";
import { MapAsset } from "@/types/disaster";
import { MapLayerState, MapViewMode } from "./types";
import SvgCartographyLayer from "./SvgCartographyLayer";
import MapAssetMarkers from "./MapAssetMarkers";
import Future3DLayerStub from "./Future3DLayerStub";
import DataStatusBadge from "@/components/ui/DataStatusBadge";

interface TacticalGisContainerProps {
  assets: MapAsset[];
  selectedAsset: MapAsset | null;
  onSelectAsset: (asset: MapAsset | null) => void;
}

export default function TacticalGisContainer({
  assets,
  selectedAsset,
  onSelectAsset,
}: TacticalGisContainerProps) {
  const [layers, setLayers] = useState<MapLayerState>({
    galeWind: true,
    stormSurge: true,
    dopplerRadar: true,
    shelters: true,
    hospitals: true,
    powerGrid: true,
    evacuationRoutes: true,
    floodPathways: true,
  });

  const [viewMode, setViewMode] = useState<MapViewMode>("2d-vector");

  const toggleLayer = (key: keyof MapLayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col relative">
      {/* 1. GIS TOOLBAR */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 select-none">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#0A2540] font-heading">
            <span className="material-symbols-outlined text-[18px] text-blue-600">
              explore
            </span>
            <span>Andhra Pradesh Coastline Tactical GIS</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="text-xs font-code text-slate-500 hidden sm:flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-blue-600">
              my_location
            </span>
            <span>15.340°N, 80.420°E [Bapatla–Nellore Sector]</span>
          </div>
        </div>

        {/* Tactical Controls & Mode Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Layer Quick Toggles */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => toggleLayer("galeWind")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                layers.galeWind
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">air</span> Wind
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("stormSurge")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                layers.stormSurge
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-cyan-600">
                tsunami
              </span>{" "}
              Surge
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("dopplerRadar")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                layers.dopplerRadar
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-amber-600">
                radar
              </span>{" "}
              Doppler
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("shelters")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                layers.shelters
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-emerald-600">
                night_shelter
              </span>{" "}
              Shelters
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("hospitals")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                layers.hospitals
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-red-600">
                local_hospital
              </span>{" "}
              Health
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("powerGrid")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                layers.powerGrid
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-amber-600">
                bolt
              </span>{" "}
              Grid
            </button>
          </div>

          {/* 2D / 3D Mode Toggle Button */}
          <button
            type="button"
            onClick={() =>
              setViewMode(viewMode === "2d-vector" ? "3d-terrain" : "2d-vector")
            }
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-code flex items-center gap-1.5 border transition active:scale-95 ${
              viewMode === "3d-terrain"
                ? "bg-blue-700 text-white border-blue-800 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
            title="Toggle 3D Terrain / WebGL visualization layer"
          >
            <span className="material-symbols-outlined text-[15px]">view_in_ar</span>
            <span>{viewMode === "3d-terrain" ? "3D Active" : "3D Mode"}</span>
          </button>

          {/* Reset Selection / Reset View */}
          {selectedAsset && (
            <button
              type="button"
              onClick={() => onSelectAsset(null)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Focus Alert Strip */}
      {selectedAsset && (
        <div className="bg-blue-600 text-white px-4 py-1.5 text-xs flex items-center justify-between z-30 font-code animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-amber-300 animate-pulse">
              gps_fixed
            </span>
            <span>
              FOCUSING ASSET: <strong>{selectedAsset.name}</strong> ({selectedAsset.district})
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectAsset(null)}
            className="text-[11px] underline hover:text-slate-200 font-semibold"
          >
            Clear Focus (Show Sector) ×
          </button>
        </div>
      )}

      {/* 2. MAP CANVAS (520px height) */}
      <div className="relative w-full h-[520px] bg-[#EEF5FA] overflow-hidden select-none">
        {/* Layer 1: Base SVG Cartography & Hazard Layers */}
        <SvgCartographyLayer layers={layers} />

        {/* Layer 2: Interactive Asset Markers */}
        <MapAssetMarkers
          assets={assets}
          selectedAssetId={selectedAsset ? selectedAsset.id : null}
          onSelectAsset={onSelectAsset}
          visibleLayers={{
            hospitals: layers.hospitals,
            powerGrid: layers.powerGrid,
            shelters: layers.shelters,
          }}
        />

        {/* Layer 3: Future 3D Layer Stub (Progressive WebGL) */}
        <Future3DLayerStub
          mode={viewMode}
          onExit3D={() => setViewMode("2d-vector")}
        />

        {/* Floating Cyclone Michaung Telemetry HUD */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md w-64 z-20">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-bold text-[#0A2540] font-heading">
                MICHAUNG TELEMETRY
              </span>
            </div>
            <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded font-code">
              CAT-1 / SCS
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-code">
            <div>
              <span className="text-slate-400 block text-[9px]">CENTER</span>
              <span className="font-bold text-slate-700">14.8°N, 80.6°E</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">PRESSURE</span>
              <span className="font-bold text-red-600">988 hPa</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">MAX SUSTAINED</span>
              <span className="font-bold text-slate-700">105 km/h</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">PEAK GUSTS</span>
              <span className="font-bold text-slate-700">120 km/h</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
            <DataStatusBadge
              provenance={{
                status: "FORECAST",
                source: "IMD Doppler Radar",
                timestamp: "04 DEC 06:00 IST",
                confidence: 94,
              }}
            />
          </div>
        </div>

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-2 rounded-lg border border-slate-200 shadow-xs text-[10px] space-y-1 z-20 font-medium text-slate-600">
          <div className="text-[9px] font-bold uppercase font-code text-slate-400">
            Map Hazard Layers
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-red-500" />
            <span>Heavy Rain Swath (&gt;200mm)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-amber-400" />
            <span>1.2m - 1.5m Storm Surge Inundation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-red-600 border-t border-dashed" />
            <span>Forecast Track Cone (IMD)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
