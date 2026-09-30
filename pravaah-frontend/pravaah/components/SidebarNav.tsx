"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "command-center", key: "navCommandCenter", label: "Command Center", icon: "grid_view" },
  { id: "risk-map", key: "navRiskMap", label: "Risk Map", icon: "map" },
  { id: "cyclone-scenario", key: "navCycloneScenario", label: "Cyclone Scenario", icon: "cyclone" },
  {
    id: "shelter-registry",
    key: "navShelters",
    label: "Shelter & Evacuee Logs",
    icon: "holiday_village",
    badge: "214 Live",
  },
  {
    id: "ai-prediction",
    key: "navPrediction",
    label: "Google AI & GEE Engine",
    icon: "model_training",
    badge: "Vertex/SAR",
  },
  { id: "infrastructure", key: "navInfrastructure", label: "Infrastructure", icon: "domain" },
  { id: "what-if", key: "navWhatIf", label: "What-if Simulator", icon: "tune" },
  {
    id: "anticipatory-actions",
    key: "navAnticipatory",
    label: "Anticipatory Actions",
    icon: "shield",
    badge: "3 Active",
  },
  { id: "ai-copilot", key: "navAiCopilot", label: "AI Copilot", icon: "smart_toy" },
  { id: "alerts", key: "navAlerts", label: "Alerts & Advisories", icon: "campaign" },
  { id: "insurance", key: "navInsurance", label: "Insurance Simulation", icon: "account_balance" },
  {
    id: "multimodal-vision",
    key: "navVision",
    label: "Multimodal Vision AI",
    icon: "document_scanner",
    badge: "Gemini 3.7",
  },
  { id: "validation", key: "navValidation", label: "Validation", icon: "verified" },
];

export default function SidebarNav({ activeTab, setActiveTab }: SidebarNavProps) {
  const { t } = useLanguage();

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-2xl border-r border-slate-200/80 flex flex-col justify-between shrink-0 shadow-xs hidden md:flex min-h-[calc(100vh-80px)] select-none">
      <div className="p-3.5">
        {/* Official Brand Identity Card */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 mb-2 bg-gradient-to-r from-blue-50/90 to-slate-50/90 rounded-xl border border-blue-100 shadow-2xs">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 border border-blue-200/70 shadow-xs shrink-0 flex items-center justify-center">
            <img
              src="/pravaah-logo.png"
              alt="PRAVAAH AI"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-extrabold text-[#0A2540] font-heading tracking-tight leading-none">
              PRAVAAH AI
            </div>
            <div className="text-[9px] font-code font-bold text-blue-600 mt-1 tracking-wider uppercase">
              C4ISR PLATFORM
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-code">
          {t("eocNavigation", "EOC NAVIGATION ARRAY")}
        </div>
        <nav className="space-y-1 mt-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const translatedLabel = t(item.key, item.label);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full apple-press flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? "bg-blue-600/10 text-blue-700 shadow-xs border border-blue-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[19px] transition-colors ${
                    isActive ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1 font-heading tracking-tight">{translatedLabel}</span>
                {item.badge && (
                  <span className="bg-red-50 text-red-600 border border-red-200/80 font-bold text-[10px] px-2 py-0.5 rounded-full font-code">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* SIDEBAR FOOTER TELEMETRY STATUS - APPLE GLASS CARD */}
      <div className="p-3.5 border-t border-slate-200/60">
        <div className="apple-card p-3 space-y-2 border border-slate-200/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-code text-slate-400 uppercase tracking-wider">
              EOC COMM CHANNEL
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 font-code bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              SECURE
            </span>
          </div>
          <div className="text-[11px] text-slate-600 leading-tight">
            Integrated NIC/ISRO SatCom Link active. High frequency radio units synced.
          </div>
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Helpline:</span>
            <span className="font-bold font-code text-blue-700">1070 / 112</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
