"use client";

import React from "react";

interface MapToolbarProps {
  onToggleLayers: () => void;
  onToggleSatellite: () => void;
  onToggle3D: () => void;
  onFitCyclone: () => void;
  onLocateRisk: () => void;
  onToggleFullscreen: () => void;
  isSatellite: boolean;
  is3D: boolean;
  layersOpen: boolean;
}

export default function MapToolbar({
  onToggleLayers,
  onToggleSatellite,
  onToggle3D,
  onFitCyclone,
  onLocateRisk,
  onToggleFullscreen,
  isSatellite,
  is3D,
  layersOpen,
}: MapToolbarProps) {
  const btnBase = "flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition shadow-xs";
  const btnActive = "bg-blue-600 text-white border-blue-700 shadow-sm";
  const btnInactive = "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900";

  return (
    <div className="absolute top-2 right-2 z-30 flex flex-col gap-1.5">
      {/* Primary toolbar row */}
      <div className="flex flex-wrap gap-1.5 justify-end">
        <button
          type="button"
          onClick={onToggleLayers}
          className={[btnBase, layersOpen ? btnActive : btnInactive].join(" ")}
          title="Toggle layer panel"
        >
          <span className="material-symbols-outlined text-[14px]">layers</span>
          <span>Layers</span>
        </button>

        <button
          type="button"
          onClick={onToggleSatellite}
          className={[btnBase, isSatellite ? btnActive : btnInactive].join(" ")}
          title="Toggle satellite basemap"
        >
          <span className="material-symbols-outlined text-[14px]">satellite</span>
          <span>Satellite</span>
        </button>

        <button
          type="button"
          onClick={onToggle3D}
          className={[btnBase, is3D ? btnActive : btnInactive].join(" ")}
          title="Toggle 3D terrain mode"
        >
          <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
          <span>3D Terrain</span>
          {is3D && (
            <span className="bg-white/20 text-white text-[9px] px-1 rounded font-code">
              ARCH
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onFitCyclone}
          className={[btnBase, btnInactive].join(" ")}
          title="Center on cyclone eye"
        >
          <span className="material-symbols-outlined text-[14px]">cyclone</span>
          <span>Fit Cyclone</span>
        </button>

        <button
          type="button"
          onClick={onLocateRisk}
          className={[btnBase, btnInactive].join(" ")}
          title="Focus high risk coastal belt"
        >
          <span className="material-symbols-outlined text-[14px]">crisis_alert</span>
          <span>Locate Risk</span>
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className={[btnBase, btnInactive].join(" ")}
          title="Toggle fullscreen map"
        >
          <span className="material-symbols-outlined text-[14px]">fullscreen</span>
        </button>
      </div>

      {/* 3D terrain notice banner when active */}
      {is3D && (
        <div className="bg-amber-500/90 text-white text-[10px] px-2 py-0.5 rounded shadow-sm text-right font-code flex items-center justify-end gap-1">
          <span className="material-symbols-outlined text-[12px]">info</span>
          3D Perspective Mock (Deck.gl ready)
        </div>
      )}
    </div>
  );
}
