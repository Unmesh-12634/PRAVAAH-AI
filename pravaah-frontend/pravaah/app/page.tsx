"use client";

import React, { useState } from "react";
import TopGovBanner from "@/components/TopGovBanner";
import ExecutiveHeader from "@/components/ExecutiveHeader";
import SidebarNav from "@/components/SidebarNav";
import TopMetrics from "@/components/TopMetrics";
import CompactTacticalMap from "@/components/map/CompactTacticalMap";
import TacticalIncidentFeed from "@/components/TacticalIncidentFeed";
import SituationIntelligence from "@/components/SituationIntelligence";
import DistrictReadinessMatrix from "@/components/DistrictReadinessMatrix";
import OpsTickerFooter from "@/components/OpsTickerFooter";
import ActionModals from "@/components/ActionModals";
import { MOCK_ASSETS } from "@/data/mockDisasterData";
import { KpiMetric, MapAsset } from "@/types/disaster";

import RiskMap from "@/components/risk-map/RiskMap";
import CycloneScenario from "@/components/cyclone-scenario/CycloneScenario";
import InfrastructureView from "@/components/infrastructure/InfrastructureView";
import AnticipatoryActionsView from "@/components/anticipatory/AnticipatoryActionsView";
import WhatIfSimulatorView from "@/components/simulator/WhatIfSimulatorView";
import AiCopilotView from "@/components/copilot/AiCopilotView";
import AlertsAdvisoriesView from "@/components/alerts/AlertsAdvisoriesView";
import InsuranceSimulationView from "@/components/insurance/InsuranceSimulationView";
import ModelValidationView from "@/components/validation/ModelValidationView";
import MultimodalVisionView from "@/components/vision/MultimodalVisionView";
import ShelterEvacuationView from "@/components/shelters/ShelterEvacuationView";
import PredictionEngineView from "@/components/prediction/PredictionEngineView";

export default function Home() {
  const [activeTab, setActiveTab] = useState("command-center");
  const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MapAsset | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [sitRepOpen, setSitRepOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [convoyOpen, setConvoyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Connected KPI card selection logic
  const handleSelectKpi = (kpi: KpiMetric) => {
    if (selectedKpiId === kpi.id) {
      setSelectedKpiId(null);
      setSelectedAsset(null);
      showToast("Cleared KPI filter");
      return;
    }

    setSelectedKpiId(kpi.id);

    // Map KPI to relevant map asset focus
    if (kpi.category === "healthcare") {
      const hospital = MOCK_ASSETS.find((a) => a.type === "hospital");
      if (hospital) setSelectedAsset(hospital);
      showToast("Filtered: Healthcare Facilities & Inundation Risk");
    } else if (kpi.category === "assets") {
      const substation = MOCK_ASSETS.find((a) => a.type === "substation");
      if (substation) setSelectedAsset(substation);
      showToast("Filtered: High-Risk Power Grid & Infrastructure");
    } else if (kpi.category === "evacuation") {
      const shelter = MOCK_ASSETS.find((a) => a.type === "shelter");
      if (shelter) setSelectedAsset(shelter);
      showToast("Filtered: Evacuation Corridors & Shelters");
    } else if (kpi.category === "threat") {
      const landfall = MOCK_ASSETS.find((a) => a.type === "landfall");
      if (landfall) setSelectedAsset(landfall);
      showToast("Filtered: Cyclone Eye Landfall Sector");
    } else {
      setSelectedAsset(null);
      showToast("Filtered: Population Inundation Swath");
    }
  };

  // Map asset selection
  const handleSelectAsset = (asset: MapAsset | null) => {
    setSelectedAsset(asset);
    if (asset) {
      showToast(`Selected: ${asset.name} (${asset.district})`);
    }
  };

  // District selection
  const handleSelectDistrict = (districtId: string) => {
    if (selectedDistrictId === districtId) {
      setSelectedDistrictId(null);
      showToast("Cleared district filter");
    } else {
      setSelectedDistrictId(districtId);
      showToast(`DEOC Focus: ${districtId.toUpperCase()} District`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB] text-slate-800 antialiased">
      {/* 1. TOP OFFICIAL GOV BANNER STRIP */}
      <TopGovBanner />

      {/* 2. SECONDARY EXECUTIVE BRAND & DISPATCH BAR */}
      <ExecutiveHeader
        onOpenSitRep={() => setSitRepOpen(true)}
        onOpenBroadcast={() => setBroadcastOpen(true)}
      />

      {/* Mobile Navigation Toggle Bar (< 768px) */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition"
        >
          <span className="material-symbols-outlined text-[16px]">menu</span>
          <span>EOC Menu ({activeTab.replace("-", " ")})</span>
        </button>
        <span className="text-[11px] font-code text-slate-500">
          Mobile Field Terminal
        </span>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs md:hidden flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-heading font-bold text-sm text-[#0A2540]">
                EOC Navigation Array
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <SidebarNav
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE WITH SIDEBAR & C4ISR DECK */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Navigation Sidebar (Desktop) */}
        <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className={`flex-1 overflow-hidden w-full ${
          activeTab === "risk-map" || activeTab === "cyclone-scenario"
            ? ""
            : "p-3 sm:p-5 overflow-y-auto max-w-[1720px] mx-auto space-y-4"
        }`}>

          {/* ── RISK MAP MODULE (FULL SCREEN) ── */}
          {activeTab === "risk-map" && (
            <div className="h-full flex flex-col">
              <RiskMap onBackToDashboard={() => setActiveTab("command-center")} />
            </div>
          )}

          {/* ── CYCLONE SCENARIO MODULE ── */}
          {activeTab === "cyclone-scenario" && (
            <div className="h-full flex flex-col">
              <CycloneScenario />
            </div>
          )}

          {/* ── INFRASTRUCTURE EXPOSURE MODULE ── */}
          {activeTab === "infrastructure" && (
            <InfrastructureView />
          )}

          {/* ── ANTICIPATORY ACTIONS MODULE ── */}
          {activeTab === "anticipatory-actions" && (
            <AnticipatoryActionsView />
          )}

          {/* ── WHAT-IF SIMULATOR MODULE ── */}
          {activeTab === "what-if" && (
            <WhatIfSimulatorView />
          )}

          {/* ── AI DECISION COPILOT MODULE ── */}
          {activeTab === "ai-copilot" && (
            <AiCopilotView />
          )}

          {/* ── ALERTS & PUBLIC ADVISORIES MODULE ── */}
          {activeTab === "alerts" && (
            <AlertsAdvisoriesView />
          )}

          {/* ── INSURANCE SIMULATION MODULE ── */}
          {activeTab === "insurance" && (
            <InsuranceSimulationView />
          )}

          {/* ── MODEL VALIDATION & SCIENTIFIC BENCHMARKING ── */}
          {activeTab === "validation" && (
            <ModelValidationView />
          )}

          {/* ── GEMINI 3.7 MULTIMODAL VISION & GOOGLE EARTH ENGINE ── */}
          {activeTab === "multimodal-vision" && (
            <MultimodalVisionView />
          )}

          {/* ── SHELTER & EVACUEE OPERATIONS CENTER ── */}
          {activeTab === "shelter-registry" && (
            <ShelterEvacuationView />
          )}

          {/* ── GOOGLE AI & GEE PREDICTION ENGINE ── */}
          {activeTab === "ai-prediction" && (
            <PredictionEngineView />
          )}

          {/* ── OTHER NON-IMPLEMENTED TABS ── */}
          {activeTab !== "command-center" &&
            activeTab !== "risk-map" &&
            activeTab !== "cyclone-scenario" &&
            activeTab !== "shelter-registry" &&
            activeTab !== "ai-prediction" &&
            activeTab !== "infrastructure" &&
            activeTab !== "anticipatory-actions" &&
            activeTab !== "what-if" &&
            activeTab !== "ai-copilot" &&
            activeTab !== "alerts" &&
            activeTab !== "insurance" &&
            activeTab !== "validation" &&
            activeTab !== "multimodal-vision" && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">info</span>
                <span>
                  Viewing Master Foundation context for <strong>{activeTab.toUpperCase().replace("-", " ")}</strong>.
                </span>
              </div>
              <button type="button" onClick={() => setActiveTab("command-center")}
                className="font-bold underline text-blue-700 hover:text-blue-900 ml-3">
                Return to Overview
              </button>
            </div>
          )}

          {/* ── COMMAND CENTER DASHBOARD ── */}
          {activeTab === "command-center" && (
            <>
              {/* Top Institutional Metrics (5 KPIs with interactive selection) */}
              <TopMetrics
                selectedKpiId={selectedKpiId}
                onSelectKpi={handleSelectKpi}
              />

              {/* C4ISR Deck: 2-Column Integrated Layout (Compact GIS Cartography + Situation Intelligence) */}
              <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                {/* Compact GIS Coastal Map Preview (Click to open full-screen map) with integrated Replay Scrubber + Live EOC Incident Stream (Span 8) */}
                <div className="xl:col-span-8 flex flex-col space-y-3.5">
                  <CompactTacticalMap
                    assets={MOCK_ASSETS}
                    selectedAsset={selectedAsset}
                    onSelectAsset={handleSelectAsset}
                    onOpenFullMap={() => {
                      setActiveTab("risk-map");
                      showToast("Opened Full-Screen Tactical Risk Map Screen");
                    }}
                  />
                  <TacticalIncidentFeed />
                </div>

                {/* Right Situation Intelligence & Context-Aware Directives (Span 4) */}
                <div className="xl:col-span-4">
                  <SituationIntelligence
                    selectedAsset={selectedAsset}
                    onClearAssetSelection={() => setSelectedAsset(null)}
                    onDeployNdrf={() =>
                      showToast("NDRF Sector 4 Battalions Dispatched to Coastal Hamlets")
                    }
                    onTrackConvoy={() => setConvoyOpen(true)}
                  />
                </div>
              </section>

              {/* District Readiness Matrix (4 District EOC Tiles) */}
              <DistrictReadinessMatrix
                selectedDistrictId={selectedDistrictId}
                onSelectDistrict={handleSelectDistrict}
              />
            </>
          )}
        </main>
      </div>

      {/* 4. BOTTOM OPS TICKER & AUDIT BAR */}
      <OpsTickerFooter />

      {/* 5. ACTION MODALS */}
      <ActionModals
        sitRepOpen={sitRepOpen}
        onCloseSitRep={() => setSitRepOpen(false)}
        broadcastOpen={broadcastOpen}
        onCloseBroadcast={() => setBroadcastOpen(false)}
        convoyOpen={convoyOpen}
        onCloseConvoy={() => setConvoyOpen(false)}
        toastMessage={toastMessage}
      />
    </div>
  );
}
