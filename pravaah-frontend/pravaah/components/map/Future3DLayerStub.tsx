"use client";

import React from "react";
import { MapViewMode } from "./types";

interface Future3DLayerStubProps {
  mode: MapViewMode;
  onExit3D: () => void;
}

/**
 * Modular stub for 3D Geospatial Visualization Layer (MapLibre GL JS / Deck.gl integration)
 * Prepared for:
 * - 3D SRTM/DEM Terrain mesh
 * - Cyclone volumetric eye and vortex visualization
 * - GPU particle wind-field streaming
 * - Hydrodynamic water elevation and surge 3D bathymetry
 * - Extruded 3D infrastructure landmarks
 */
export default function Future3DLayerStub({
  mode,
  onExit3D,
}: Future3DLayerStubProps) {
  if (mode !== "3d-terrain") return null;

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="max-w-md bg-[#0A2540] border border-blue-500/50 rounded-xl p-6 shadow-2xl space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-blue-900/60 border border-sky-400 flex items-center justify-center text-sky-400">
          <span className="material-symbols-outlined text-2xl animate-spin">
            view_in_ar
          </span>
        </div>

        <div>
          <div className="inline-block bg-blue-900/80 text-sky-300 border border-sky-500/40 text-[10px] font-bold px-2 py-0.5 rounded font-code uppercase">
            MapLibre / Deck.gl 3D Pipeline
          </div>
          <h3 className="text-base font-extrabold text-white font-heading mt-2">
            3D Geospatial Engine Layer
          </h3>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Architected for progressive WebGL loading: 3D SRTM terrain elevation, particle wind vectors, and Sentinel-1 SAR water inundation meshes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-code text-left bg-slate-900/70 p-3 rounded-lg border border-slate-800">
          <div className="text-slate-400">
            TERRAIN MESH: <strong className="text-sky-300 block">SRTM 30m DEM</strong>
          </div>
          <div className="text-slate-400">
            WIND VECTORS: <strong className="text-amber-300 block">ERA5 GPU Flow</strong>
          </div>
          <div className="text-slate-400">
            SURGE LAYER: <strong className="text-rose-400 block">Hydro-3D Bathy</strong>
          </div>
          <div className="text-slate-400">
            STATUS: <strong className="text-emerald-400 block">Stub Ready</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={onExit3D}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition active:scale-95 shadow-md"
        >
          Return to 2D High-Density Vector View
        </button>
      </div>
    </div>
  );
}
