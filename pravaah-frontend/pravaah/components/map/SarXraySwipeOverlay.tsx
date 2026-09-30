"use client";

import React, { useState, useRef } from "react";

interface SarXraySwipeOverlayProps {
  onClose: () => void;
}

export default function SarXraySwipeOverlay({ onClose }: SarXraySwipeOverlayProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    const handleMove = (moveEvent: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, moveEvent.clientX - rect.left));
      setSliderPos(Math.round((x / rect.width) * 100));
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-200 select-none">
      {/* 1. TOP CONTROL BAR */}
      <div className="px-4 py-2.5 bg-[#0A192F] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-code">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-heading text-xs">
                GEE Sentinel-1 SAR Cloud-Penetration X-Ray Swipe
              </span>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full">
                5.405 GHz C-BAND
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Drag vertical divider to compare Optical Cloud Cover vs. GEE Synthetic Aperture Radar Flood Water
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Scan Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsAutoScanning(!isAutoScanning);
              if (!isAutoScanning) {
                let dir = 1;
                let pos = sliderPos;
                const interval = setInterval(() => {
                  pos += dir * 1.5;
                  if (pos >= 85) dir = -1;
                  if (pos <= 15) dir = 1;
                  setSliderPos(Math.round(pos));
                }, 40);
                (window as any)._sarScanInterval = interval;
              } else {
                clearInterval((window as any)._sarScanInterval);
              }
            }}
            className={`apple-press px-3 py-1.5 rounded-xl font-bold border transition flex items-center gap-1.5 ${
              isAutoScanning
                ? "bg-cyan-600 text-white border-cyan-500"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isAutoScanning ? "pause" : "play_arrow"}
            </span>
            <span>{isAutoScanning ? "Stop Auto Scan" : "Auto X-Ray Scan"}</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="apple-press px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold border border-slate-700 transition flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            <span>Close X-Ray</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE COMPARISON VIEWER */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full overflow-hidden cursor-ew-resize bg-[#030712]"
        onPointerDown={handlePointerDown}
      >
        {/* Layer B (Right - Background): GEE Sentinel-1 SAR C-Band Radar Ground Truth */}
        <div className="absolute inset-0 w-full h-full">
          {/* Real satellite basemap underneath */}
          <iframe
            src={`${process.env.NEXT_PUBLIC_MAP_APP_URL || "https://vayu-shield-ten.vercel.app"}/?mode=compact&view=2d`}
            className="w-full h-full border-0 pointer-events-none"
            title="SAR Ground Truth"
          />

          {/* Glowing SAR Neon Water Mask Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-85 mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at 62% 48%, rgba(6, 182, 212, 0.65) 0%, rgba(2, 132, 199, 0.45) 45%, transparent 75%)",
            }}
          />

          {/* SAR Telemetry Badge (Right Side) */}
          <div className="absolute top-4 right-4 bg-slate-900/90 border border-cyan-500/50 backdrop-blur-md px-3.5 py-2 rounded-xl text-right font-code text-xs shadow-2xl pointer-events-none">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block tracking-wider">
              GOOGLE EARTH ENGINE (SAR)
            </span>
            <span className="text-white font-extrabold text-sm block">100% Cloud Penetration</span>
            <div className="text-[10px] text-slate-300 mt-1 space-y-0.5">
              <div>Sensor: Copernicus Sentinel-1</div>
              <div>Backscatter: &lt; -14.2 dB (Water)</div>
              <div>Polarization: VV + VH Co-Pol</div>
            </div>
          </div>
        </div>

        {/* Layer A (Left - Clipped): Dense Monsoon Cyclone Cloud Cover (Optical Blindness) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl"
          style={{ width: `${sliderPos}%` }}
        >
          {/* Simulated Dense White Hurricane Cloud Swirls */}
          <div
            className="w-full h-full relative"
            style={{
              width: containerRef.current ? containerRef.current.clientWidth : "100%",
              background:
                "radial-gradient(ellipse 90% 70% at 55% 45%, rgba(255,255,255,0.92) 0%, rgba(226,232,240,0.85) 45%, rgba(148,163,184,0.7) 80%, rgba(15,23,42,0.9) 100%)",
            }}
          >
            {/* Swirling Cloud Bands */}
            <div
              className="absolute inset-0 opacity-40 animate-spin"
              style={{
                animationDuration: "120s",
                backgroundImage:
                  "conic-gradient(from 0deg, rgba(255,255,255,0.9) 0deg, rgba(203,213,225,0.4) 90deg, rgba(255,255,255,0.9) 180deg, rgba(203,213,225,0.3) 270deg, rgba(255,255,255,0.9) 360deg)",
              }}
            />

            {/* Optical Sensor Notice (Left Side) */}
            <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-3.5 py-2 rounded-xl text-left font-code text-xs shadow-2xl pointer-events-none">
              <span className="text-[10px] text-red-400 font-bold uppercase block tracking-wider">
                OPTICAL SATELLITE (SENTINEL-2 / MODIS)
              </span>
              <span className="text-white font-extrabold text-sm block">0% Ground Visibility (BLIND)</span>
              <div className="text-[10px] text-slate-300 mt-1 space-y-0.5">
                <div>Cloud Top Temp: -78°C</div>
                <div>Optical Obscuration: 100%</div>
                <div>Status: Ground Floods Hidden</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE SLIDER DIVIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 transform -translate-x-1/2 flex items-center justify-center pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-[#0A2540] border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold pointer-events-auto cursor-ew-resize">
            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          </div>
        </div>

        {/* Bottom Status Ticker */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-code text-slate-300 shadow-xl flex items-center gap-3 pointer-events-none">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            SWIPE DIVIDER: {sliderPos}%
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Left: Blind Cloud Cover</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">Right: GEE SAR Radar X-Ray</span>
        </div>
      </div>
    </div>
  );
}
