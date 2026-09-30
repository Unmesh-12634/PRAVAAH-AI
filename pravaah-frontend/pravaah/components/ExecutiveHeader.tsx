"use client";

import React from "react";
import BackendStatusIndicator from "./BackendStatusIndicator";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguage } from "@/data/translations";

interface ExecutiveHeaderProps {
  onOpenSitRep: () => void;
  onOpenBroadcast: () => void;
}

// Short display names so the dropdown is compact
const LANG_SHORT: Record<string, string> = {
  en: "EN",
  te: "తె",
  hi: "हि",
  ta: "த",
  or: "ଓ",
  bn: "ব",
};

export default function ExecutiveHeader({
  onOpenSitRep,
  onOpenBroadcast,
}: ExecutiveHeaderProps) {
  const { currentLanguage, setLanguage, t, languages, isTranslating } = useLanguage();

  const [liveThreat, setLiveThreat] = React.useState<{
    sector: string;
    eta: string;
  }>({
    sector: "Bapatla–Machilipatnam Coastal",
    eta: "T-10h",
  });

  React.useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    fetch(`${backendUrl}/api/cyclones/active`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.estimated_landfall_sector) {
          setLiveThreat({
            sector: data.estimated_landfall_sector,
            eta: data.estimated_landfall_time
              ? data.estimated_landfall_time.split("(")[0].trim()
              : "T-10h",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-200/90 shadow-xs z-40 select-none">

      {/* ── MAIN TOOLBAR ROW ── */}
      <div className="px-3 sm:px-4 lg:px-5 h-14 flex items-center justify-between gap-2">

        {/* ── LEFT: Brand block ── */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          {/* Logo */}
          <div
            className="w-10 h-10 rounded-xl overflow-hidden border border-blue-200/80 bg-white shadow-xs ring-2 ring-blue-500/10 shrink-0 flex items-center justify-center hover:scale-105 transition-transform duration-200"
            title="PRAVAAH AI"
          >
            <img
              src="/pravaah-logo.png"
              alt="PRAVAAH AI"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Name + badges */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-nowrap">
              <h1 className="text-base font-extrabold text-[#0A2540] font-heading tracking-tight leading-none whitespace-nowrap">
                PRAVAAH AI
              </h1>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full font-code whitespace-nowrap shrink-0">
                C4ISR v4.2
              </span>
              <span className="shrink-0">
                <BackendStatusIndicator />
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-tight whitespace-nowrap hidden lg:block mt-0.5 truncate max-w-[380px]">
              {t("appSubtitle", "Predictive Risk & Anticipatory Vulnerability Assessment for Hazard Action • Severe Cyclone Michaung")}
            </p>
          </div>
        </div>

        {/* ── RIGHT: Controls strip ── */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* ── Language Selector (compact icon + short label) ── */}
          <div
            className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-[11px] font-code shadow-2xs shrink-0"
            title="Multilingual Translation Engine"
          >
            <span
              className={`material-symbols-outlined text-[15px] text-blue-600 shrink-0 leading-none ${
                isTranslating ? "animate-spin" : ""
              }`}
            >
              translate
            </span>
            {/* Compact select — shows only short code */}
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent font-bold text-slate-800 text-[11px] outline-none cursor-pointer hover:text-blue-700 transition w-[34px]"
              title="Switch interface language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {LANG_SHORT[l.code] ?? l.code.toUpperCase()}
                </option>
              ))}
            </select>
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"
              title="Real-time translation active"
            />
          </div>

          {/* Thin divider */}
          <div className="h-6 w-px bg-slate-200 shrink-0 mx-0.5" />

          {/* ── Early Detection Pill ── */}
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200/80 px-2 py-1 rounded-lg text-[11px] font-code shadow-2xs shrink-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
            <span className="text-red-700 font-extrabold uppercase text-[9px] tracking-wider whitespace-nowrap hidden sm:inline">
              EARLY DETECTION:
            </span>
            <span
              className="font-bold text-[#0A2540] text-[11px] whitespace-nowrap max-w-[140px] truncate hidden md:inline"
              title={liveThreat.sector}
            >
              {liveThreat.sector}
            </span>
            <span className="text-[9px] text-red-700 bg-red-100 font-extrabold px-1.5 py-0.5 rounded border border-red-200 whitespace-nowrap shrink-0">
              {liveThreat.eta}
            </span>
          </div>

          {/* Thin divider */}
          <div className="h-6 w-px bg-slate-200 shrink-0 mx-0.5" />

          {/* ── SitRep PDF ── */}
          <button
            type="button"
            onClick={onOpenSitRep}
            title="Generate Situation Report PDF"
            className="apple-press bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs transition shrink-0"
          >
            <span className="material-symbols-outlined text-[14px] text-red-600 shrink-0 leading-none">
              picture_as_pdf
            </span>
            <span className="whitespace-nowrap hidden sm:inline">
              {t("sitRepPdf", "SitRep PDF")}
            </span>
          </button>

          {/* ── Broadcast Cell Alert ── */}
          <button
            type="button"
            onClick={onOpenBroadcast}
            title="Broadcast Emergency Cell Alert"
            className="apple-press bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition shadow-red-500/20 shrink-0"
          >
            <span className="material-symbols-outlined text-[14px] animate-pulse shrink-0 leading-none">
              campaign
            </span>
            <span className="whitespace-nowrap">
              {t("broadcastCellAlert", "Broadcast Cell Alert")}
            </span>
          </button>

          {/* Thin divider */}
          <div className="h-6 w-px bg-slate-200 shrink-0 mx-0.5 hidden lg:block" />

          {/* ── EOC Commander Avatar ── */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0A2540] to-blue-600 text-white font-extrabold flex items-center justify-center text-[10px] shadow-xs font-heading shrink-0">
              EOC
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-[11px] font-bold text-[#0A2540] leading-tight whitespace-nowrap">
                {t("commanderTitle", "EOC Incident Commander")}
              </div>
              <div className="text-[10px] text-slate-400 font-code whitespace-nowrap">
                {t("commanderSubtitle", "Decision Support Console")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Active Cyclone Advisory Ticker ── */}
      <div className="w-full bg-[#0A2540] px-4 lg:px-5 py-1 flex items-center gap-3 overflow-hidden">
        <span className="flex items-center gap-1.5 text-red-400 font-extrabold uppercase text-[10px] tracking-widest font-code whitespace-nowrap shrink-0">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
          ACTIVE ADVISORY:
        </span>
        <span className="text-[11px] text-slate-300 font-medium truncate leading-tight">
          Severe Cyclone Michaung · Landfall: Bapatla–Nellore Coast · Winds: 105–120 km/h · Surge: +1.8m MSL · Red Alert · 6 Coastal Districts · APSDMA EOC Active
        </span>
        <span className="text-[10px] font-code text-sky-400 font-bold whitespace-nowrap shrink-0 hidden md:inline">
          IMD · 04 DEC 2023
        </span>
      </div>

    </header>
  );
}
