"use client";

import React, { useState } from "react";

export default function TacticalGisMap() {
  const [layers, setLayers] = useState({
    wind: true,
    surge: true,
    doppler: true,
    shelters: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* GIS Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#0A2540] font-heading">
            <span className="material-symbols-outlined text-[18px] text-blue-600">
              explore
            </span>
            <span>Andhra Pradesh Coastline Tactical GIS</span>
          </span>
          <span className="text-slate-300">|</span>
          <div className="text-xs font-code text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-blue-600">
              my_location
            </span>
            <span>15.340°N, 80.420°E [Bapatla–Nellore Sector]</span>
          </div>
        </div>

        {/* GIS Layer Array Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => toggleLayer("wind")}
            className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition ${
              layers.wind
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-slate-50 text-slate-400 hover:text-slate-600"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">air</span> Gale Wind
          </button>
          <button
            onClick={() => toggleLayer("surge")}
            className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition ${
              layers.surge
                ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                : "bg-slate-50 text-slate-400 hover:text-slate-600"
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-cyan-600">
              tsunami
            </span>{" "}
            Surge (1.5m)
          </button>
          <button
            onClick={() => toggleLayer("doppler")}
            className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition ${
              layers.doppler
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-50 text-slate-400 hover:text-slate-600"
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-amber-600">
              radar
            </span>{" "}
            Doppler
          </button>
          <button
            onClick={() => toggleLayer("shelters")}
            className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition ${
              layers.shelters
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-50 text-slate-400 hover:text-slate-600"
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-emerald-600">
              night_shelter
            </span>{" "}
            Shelters (48)
          </button>
        </div>
      </div>

      {/* MAP CANVAS (Crisp, High-Clarity Marine / Coastal GIS Cartography) */}
      <div className="relative w-full h-[520px] bg-[#EEF5FA] overflow-hidden select-none">
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1000 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Coordinate Grid Pattern */}
            <pattern
              id="lightGrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#DCE7F0"
                strokeDasharray="2,2"
                strokeWidth="0.8"
              />
            </pattern>

            {/* Coastal Storm Surge Inundation Area */}
            <radialGradient id="surgeGradientLight" cx="42%" cy="48%" r="45%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.32" />
              <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.22" />
              <stop offset="85%" stopColor="#0284C7" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#EEF5FA" stopOpacity="0" />
            </radialGradient>

            {/* Rain Doppler Intensity Bands */}
            <radialGradient id="rainBandsLight" cx="62%" cy="56%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
              <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#EEF5FA" stopOpacity="0" />
            </radialGradient>

            {/* Forecast Track Cone */}
            <linearGradient id="coneGradLight" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Grid overlay */}
          <rect width="100%" height="100%" fill="url(#lightGrid)" />

          {/* Bay of Bengal Water Texture Note */}
          <text
            x="780"
            y="240"
            fill="#94A3B8"
            fontFamily="Manrope"
            fontSize="14"
            fontWeight="700"
            letterSpacing="3"
            opacity="0.6"
          >
            BAY OF BENGAL
          </text>
          <text
            x="800"
            y="260"
            fill="#94A3B8"
            fontFamily="JetBrains Mono"
            fontSize="10"
            opacity="0.6"
          >
            BATHYMETRY: 200m - 1200m
          </text>

          {/* Indian Landmass: Andhra Pradesh Coastal Corridor Silhouette */}
          <path
            d="M -50 -10 L 430 -10 Q 405 110 385 200 T 350 300 T 295 400 T 240 480 T 205 570 T 170 650 L -50 650 Z"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Buckingham Canal & River Estuary lines */}
          <path
            d="M 330 280 Q 360 300 395 330 T 440 360"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="6"
          />
          <path
            d="M 270 380 Q 295 410 320 440"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="5"
          />
          <path
            d="M 205 470 Q 230 495 245 540"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="4"
          />

          {/* Coastal Inundation Swath (Surge 1.0m to 1.5m) */}
          {layers.surge && (
            <path
              d="M 385 200 Q 360 250 350 300 Q 330 330 320 360 Q 285 420 250 470 Q 235 490 215 560 L 255 540 Q 285 475 320 420 Q 355 360 375 305 Q 395 250 415 190 Z"
              fill="url(#surgeGradientLight)"
            />
          )}

          {/* Rain Doppler Isobars Envelope */}
          {layers.doppler && (
            <ellipse
              cx="600"
              cy="420"
              rx="310"
              ry="230"
              fill="url(#rainBandsLight)"
            />
          )}

          {/* Wind Radii Rings centered on Cyclone Eye */}
          {layers.wind && (
            <>
              <circle
                cx="600"
                cy="420"
                r="140"
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                opacity="0.8"
              />
              <circle
                cx="600"
                cy="420"
                r="210"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.2"
                strokeDasharray="6,4"
                opacity="0.7"
              />
              <circle
                cx="600"
                cy="420"
                r="290"
                fill="none"
                stroke="#0284C7"
                strokeWidth="1"
                strokeDasharray="8,6"
                opacity="0.6"
              />
            </>
          )}

          {/* Cone of Uncertainty to Bapatla Coast */}
          <polygon
            points="600,420 350,280 405,260"
            fill="url(#coneGradLight)"
          />

          {/* Track Line: Past and Forecast */}
          <path
            d="M 760 590 L 680 500 L 600 420"
            fill="none"
            stroke="#DC2626"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 600 420 L 490 340 L 375 270"
            fill="none"
            stroke="#D97706"
            strokeWidth="3"
            strokeDasharray="7,5"
            strokeLinecap="round"
          />

          {/* Past Track Waypoints */}
          <circle
            cx="760"
            cy="590"
            r="4.5"
            fill="#FFFFFF"
            stroke="#DC2626"
            strokeWidth="2"
          />
          <text
            x="772"
            y="594"
            fill="#475569"
            fontFamily="JetBrains Mono"
            fontSize="10"
            fontWeight="600"
          >
            T-36h (12.2°N)
          </text>
          <circle
            cx="680"
            cy="500"
            r="4.5"
            fill="#FFFFFF"
            stroke="#DC2626"
            strokeWidth="2"
          />
          <text
            x="692"
            y="504"
            fill="#475569"
            fontFamily="JetBrains Mono"
            fontSize="10"
            fontWeight="600"
          >
            T-24h (13.5°N)
          </text>

          {/* CYCLONE EYE - Tactical Center Point */}
          <g transform="translate(600, 420)">
            <circle
              r="32"
              fill="none"
              stroke="#DC2626"
              strokeWidth="1"
              opacity="0.4"
              className="animate-ping"
            />
            <circle r="22" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
            <circle r="10" fill="#DC2626" />
            <circle r="3.5" fill="#FFFFFF" />
            <path
              d="M -16,-16 Q 0,-26 16,-16 Q 26,0 16,16 Q 0,26 -16,16 Q -26,0 -16,-16 Z"
              fill="none"
              stroke="#DC2626"
              strokeWidth="1.2"
              opacity="0.75"
            />
          </g>

          {/* Landfall Target Point (Bapatla Coast) */}
          <circle
            cx="375"
            cy="270"
            r="14"
            fill="#FEF2F2"
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="4,3"
          />
          <circle cx="375" cy="270" r="5" fill="#DC2626" />
          <rect
            x="395"
            y="252"
            width="185"
            height="34"
            rx="4"
            fill="#FFFFFF"
            stroke="#DC2626"
            strokeWidth="1"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
          />
          <text
            x="403"
            y="267"
            fill="#991B1B"
            fontFamily="Manrope"
            fontSize="11"
            fontWeight="700"
          >
            PREDICTED LANDFALL (T-12h)
          </text>
          <text
            x="403"
            y="280"
            fill="#64748B"
            fontFamily="JetBrains Mono"
            fontSize="9"
          >
            15.8°N, 80.3°E • Bapatla Sector
          </text>

          {/* Administrative Boundaries & District Labels */}
          <text
            x="140"
            y="140"
            fill="#475569"
            fontFamily="JetBrains Mono"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
          >
            GUNTUR DISTRICT
          </text>
          <text
            x="180"
            y="240"
            fill="#0B5CAD"
            fontFamily="JetBrains Mono"
            fontSize="12"
            fontWeight="800"
            letterSpacing="1"
          >
            BAPATLA [IMPACT ZONE]
          </text>
          <text
            x="120"
            y="350"
            fill="#475569"
            fontFamily="JetBrains Mono"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
          >
            PRAKASAM / ONGOLE
          </text>
          <text
            x="80"
            y="490"
            fill="#475569"
            fontFamily="JetBrains Mono"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
          >
            SPSR NELLORE
          </text>
          <text
            x="310"
            y="90"
            fill="#475569"
            fontFamily="JetBrains Mono"
            fontSize="11"
            fontWeight="700"
            letterSpacing="1"
          >
            KRISHNA / MACHILIPATNAM
          </text>

          {/* Highway NH-16 Evacuation Corridor */}
          <path
            d="M 330 30 L 310 150 L 260 270 L 200 390 L 150 510 L 120 620"
            fill="none"
            stroke="#D97706"
            strokeWidth="3"
            strokeDasharray="7,4"
          />
          <rect
            x="185"
            y="405"
            width="150"
            height="18"
            rx="3"
            fill="#FFFBEB"
            stroke="#FDE68A"
            strokeWidth="1"
          />
          <text
            x="190"
            y="418"
            fill="#B45309"
            fontFamily="JetBrains Mono"
            fontSize="9"
            fontWeight="700"
          >
            NH-16 EVACUATION CORRIDOR
          </text>
        </svg>

        {/* FLOATING GIS PINS */}
        {/* Pin 1: Nellore Dist Hospital */}
        <div className="absolute top-[75%] left-[16%] -translate-x-1/2 -translate-y-1/2 group z-20">
          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition border-2 border-white">
            <span className="material-symbols-outlined text-[15px]">
              local_hospital
            </span>
          </div>
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col bg-white p-2.5 rounded-lg border border-slate-300 w-56 shadow-lg z-30 transition">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-red-700">
                Nellore District Hospital
              </span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              312 Inpatients • Ground floor cleared
            </div>
            <div className="text-[10px] font-code text-blue-700 font-semibold mt-0.5">
              DG Sets Online • 1,200L Diesel Reserve
            </div>
          </div>
        </div>

        {/* Pin 2: 220kV Substation Bapatla */}
        <div className="absolute top-[38%] left-[28%] -translate-x-1/2 -translate-y-1/2 group z-20">
          <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition border-2 border-white">
            <span className="material-symbols-outlined text-[15px]">bolt</span>
          </div>
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col bg-white p-2.5 rounded-lg border border-slate-300 w-56 shadow-lg z-30 transition">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-800">
                220kV Bapatla Substation
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                ALERT
              </span>
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              Transformer Yard Bund: +0.8m MSL
            </div>
            <div className="text-[10px] text-red-600 font-semibold mt-0.5">
              Surge Breach Risk: High (T-6h)
            </div>
          </div>
        </div>

        {/* Pin 3: Multi-Purpose Cyclone Shelter */}
        {layers.shelters && (
          <div className="absolute top-[48%] left-[34%] -translate-x-1/2 -translate-y-1/2 group z-20">
            <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition border-2 border-white">
              <span className="material-symbols-outlined text-[15px]">
                night_shelter
              </span>
            </div>
            <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col bg-white p-2.5 rounded-lg border border-slate-300 w-60 shadow-lg z-30 transition">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-xs font-bold text-[#0A2540]">
                  Nizampatnam MPCS Hub
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                  100% READY
                </span>
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                14 Units Occupied • 18,200 Citizens
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                Water &amp; Dry Ration: 72 hrs stocked
              </div>
            </div>
          </div>
        )}

        {/* Floating Cyclone Spec Telemetry Widget */}
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
