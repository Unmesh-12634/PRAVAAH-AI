"use client";

import React, { useState } from "react";

interface SurgeTimeMachineOverlayProps {
  onClose: () => void;
  onWaterLevelChange?: (meters: number) => void;
}

export default function SurgeTimeMachineOverlay({
  onClose,
  onWaterLevelChange,
}: SurgeTimeMachineOverlayProps) {
  const [waterLevel, setWaterLevel] = useState<number>(2.1); // in meters

  const handleSliderChange = (meters: number) => {
    setWaterLevel(meters);
    onWaterLevelChange?.(meters);

    // Send postMessage to Cesium iframes
    if (typeof window !== "undefined") {
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((f) => {
        f.contentWindow?.postMessage(
          { type: "PRAVAAH_SET_SURGE_LEVEL", surge_m: meters },
          "*"
        );
      });
    }
  };

  // Dynamic calculations based on water level
  const submergedParcels = Math.round(Math.min(58000, 3200 + Math.pow(waterLevel / 3.5, 1.8) * 54800));
  const displacedPopulation = Math.round(Math.min(340000, 12000 + Math.pow(waterLevel / 3.5, 1.7) * 328000));
  const exposureCrores = Math.round(Math.min(12500, 450 + Math.pow(waterLevel / 3.5, 1.9) * 12050));

  const substationBreached = waterLevel >= 2.1;
  const hospitalIsolated = waterLevel >= 2.6;

  return (
    <div className="absolute inset-x-4 bottom-4 z-40 bg-slate-950/95 border border-blue-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white font-sans max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-200 select-none">
      {/* 1. Header with Close Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <span className="material-symbols-outlined text-[19px]">tsunami</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm font-heading">
                4D Dynamic Surge &amp; Inundation Time Machine
              </span>
              <span className="bg-red-950 text-red-300 border border-red-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full font-code">
                3D TERRAIN INUNDATION ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drag water level to simulate flood progression on Google Earth 3D terrain and calculate structural exposure in real time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* 2. Water Level Slider & Presets */}
      <div className="py-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold font-code text-slate-400 uppercase">
              SIMULATED SURGE HEIGHT:
            </span>
            <span className="text-2xl font-extrabold text-cyan-400 font-heading">
              +{waterLevel.toFixed(1)}m <span className="text-xs text-slate-400 font-normal">Above MSL</span>
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 text-[11px] font-code flex-wrap">
            {[
              { label: "Normal Tide (0.4m)", val: 0.4 },
              { label: "Warning (1.2m)", val: 1.2 },
              { label: "Modelled (2.1m)", val: 2.1 },
              { label: "Extreme (3.2m)", val: 3.2 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => handleSliderChange(p.val)}
                className={`px-2.5 py-1 rounded-lg border transition font-bold ${
                  Math.abs(waterLevel - p.val) < 0.1
                    ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                    : "bg-slate-900 text-slate-400 border-slate-700 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tactile Slider */}
        <div className="relative">
          <input
            type="range"
            min="0.0"
            max="3.5"
            step="0.1"
            value={waterLevel}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-code text-slate-500 mt-1">
            <span>0.0m (Astronomic Datum)</span>
            <span>+1.0m (Embankment Crest)</span>
            <span>+2.0m (Road Network Breached)</span>
            <span>+3.0m (Catastrophic Ingress)</span>
            <span>+3.5m Max</span>
          </div>
        </div>
      </div>

      {/* 3. Live Dynamic Consequence Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs font-code">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">SUBMERGED PARCELS</span>
          <span className="text-base font-bold text-amber-400 block mt-0.5">
            {submergedParcels.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-slate-500">BigQuery GIS Cadastral</span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">DISPLACED RESIDENTS</span>
          <span className="text-base font-bold text-red-400 block mt-0.5">
            {displacedPopulation.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-slate-500">Requires Immediate Shelter</span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">DAMAGE EXPOSURE</span>
          <span className="text-base font-bold text-cyan-400 block mt-0.5">
            ₹{exposureCrores.toLocaleString("en-IN")} Cr
          </span>
          <span className="text-[10px] text-slate-500">Physical Asset Valuation</span>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">LIFELINE SAFETY</span>
          <span
            className={`text-xs font-bold block mt-0.5 ${
              substationBreached ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {substationBreached
              ? "⚡ 132kV SUBSTATION YARD FLOODED"
              : "✓ Grid Breakers Operating Normally"}
          </span>
          <span className="text-[10px] text-slate-500">
            {hospitalIsolated ? "Area Hospital Access Cut" : "Hospital Access Intact"}
          </span>
        </div>
      </div>
    </div>
  );
}
