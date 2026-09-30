"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function TopGovBanner() {
  const { t } = useLanguage();
  const [timeStr, setTimeStr] = useState("04 DEC 2023 · 06:39:48");

  useEffect(() => {
    let secondsOffset = 48;
    const interval = setInterval(() => {
      secondsOffset += 1;
      const baseDate = new Date(2023, 11, 4, 6, 39, secondsOffset);
      const day = String(baseDate.getDate()).padStart(2, "0");
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const month = monthNames[baseDate.getMonth()];
      const year = baseDate.getFullYear();
      const hours = String(baseDate.getHours()).padStart(2, "0");
      const minutes = String(baseDate.getMinutes()).padStart(2, "0");
      const seconds = String(baseDate.getSeconds()).padStart(2, "0");
      setTimeStr(`${day} ${month} ${year} · ${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#071727] text-white border-b border-[#0d2a45] shadow-xs select-none sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-1.5 flex items-center justify-between gap-3 text-xs">
        {/* Left: Official Institutional Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Government of India / AP State Crest Emblem */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs shadow-amber-400/50 animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300/90 font-code px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-400/20">
              OFFICIAL
            </span>
          </div>

          <div className="flex items-center gap-2 truncate text-[11px] leading-tight">
            <span className="font-extrabold tracking-wide text-white uppercase font-heading whitespace-nowrap">
              {t("govTitleShort", "GOVERNMENT OF ANDHRA PRADESH")}
            </span>
            <span className="text-slate-500 shrink-0">•</span>
            <span className="text-slate-300 font-medium truncate hidden md:inline">
              {t("apsdmaFull", "State Disaster Management Authority (APSDMA)")}
            </span>
            <span className="text-slate-500 shrink-0 hidden lg:inline">|</span>
            <span className="text-sky-300 font-code text-[10px] uppercase font-semibold shrink-0 hidden lg:inline">
              NEOC TACTICAL DESK
            </span>
          </div>
        </div>

        {/* Right: Live Telemetry, Atomic Clock & Emergency Hotline */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Situation Monitoring Status Badge */}
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-2 sm:px-2.5 py-0.5 rounded-full font-bold font-code uppercase text-[10px] tracking-wide flex items-center gap-1.5 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="hidden sm:inline">{t("statusLive", "LIVE SITUATION MONITORING")}</span>
            <span className="sm:hidden">LIVE OPS</span>
          </div>

          {/* Atomic IST Clock */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2 sm:px-2.5 py-0.5 rounded-lg font-code text-[11px] text-slate-200 shadow-2xs">
            <span className="material-symbols-outlined text-[13px] text-sky-400 shrink-0">
              schedule
            </span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">IST:</span>
            <strong className="text-white font-bold tracking-tight">{timeStr}</strong>
          </div>

          {/* 24x7 State Emergency Hotline */}
          <a
            href="tel:1070"
            className="hidden xl:flex items-center gap-1.5 text-[10px] font-code text-amber-200 bg-amber-500/10 border border-amber-400/30 px-2.5 py-0.5 rounded-lg hover:bg-amber-500/20 transition cursor-pointer"
            title="Toll-free 24x7 Emergency Help Desk"
          >
            <span className="material-symbols-outlined text-[13px] text-amber-400">
              call
            </span>
            <span className="text-slate-300">{t("hotlineShort", "Hotline:")}</span>
            <strong className="text-amber-300 font-bold">1070 / 112</strong>
          </a>
        </div>
      </div>
    </div>
  );
}
