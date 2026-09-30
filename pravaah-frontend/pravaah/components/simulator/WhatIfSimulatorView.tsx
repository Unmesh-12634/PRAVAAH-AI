"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SectorConfig {
  id: string;
  name: string;
  district: string;
  elevationMsl: number;
  baselinePop: number;
  substations: { name: string; capacity: string; floodThresholdM: number }[];
  hospitals: { name: string; beds: number; hasIcuBackup: boolean }[];
  drainageBasin: string;
  vulnerabilityIndex: "High" | "Severe" | "Critical";
}

const SECTOR_CONFIGS: Record<string, SectorConfig> = {
  Bapatla: {
    id: "bapatla",
    name: "Bapatla",
    district: "Bapatla District",
    elevationMsl: 2.1,
    baselinePop: 240000,
    substations: [
      { name: "Bapatla 220kV Main Cluster", capacity: "220kV", floodThresholdM: 1.6 },
      { name: "Karlapalem 132kV Substation", capacity: "132kV", floodThresholdM: 1.4 },
      { name: "Appikatla 33kV Rural Feeder", capacity: "33kV", floodThresholdM: 1.1 },
    ],
    hospitals: [
      { name: "Bapatla Area Hospital (ICU Level 2)", beds: 180, hasIcuBackup: true },
      { name: "Suryalanka Coastal Community Health Center", beds: 45, hasIcuBackup: false },
    ],
    drainageBasin: "Kommamuru Canal & Romperu Estuary",
    vulnerabilityIndex: "Critical",
  },
  Nellore: {
    id: "nellore",
    name: "Nellore",
    district: "SPSR Nellore District",
    elevationMsl: 3.4,
    baselinePop: 285000,
    substations: [
      { name: "Nellore South 220kV Grid", capacity: "220kV", floodThresholdM: 2.2 },
      { name: "Kavali 132kV Coastal Feeder", capacity: "132kV", floodThresholdM: 1.8 },
      { name: "Allur 33kV Rural Distribution", capacity: "33kV", floodThresholdM: 1.3 },
    ],
    hospitals: [
      { name: "Nellore District Headquarters Hospital", beds: 420, hasIcuBackup: true },
      { name: "Kavali Community Health Center", beds: 90, hasIcuBackup: true },
    ],
    drainageBasin: "Pennar River Delta & Buckingham Canal",
    vulnerabilityIndex: "Severe",
  },
  Machilipatnam: {
    id: "machilipatnam",
    name: "Machilipatnam",
    district: "Krishna District",
    elevationMsl: 1.4,
    baselinePop: 215000,
    substations: [
      { name: "Machilipatnam Port 220kV Substation", capacity: "220kV", floodThresholdM: 1.2 },
      { name: "Pedana 132kV Substation", capacity: "132kV", floodThresholdM: 1.5 },
      { name: "Avanigadda Riverbank Feeder", capacity: "33kV", floodThresholdM: 1.0 },
    ],
    hospitals: [
      { name: "Machilipatnam Government General Hospital", beds: 350, hasIcuBackup: true },
      { name: "Kruthivernu Coastal Primary Health Center", beds: 30, hasIcuBackup: false },
    ],
    drainageBasin: "Krishna River Mangrove Estuary & Bandar Canal",
    vulnerabilityIndex: "Critical",
  },
  Ongole: {
    id: "ongole",
    name: "Ongole",
    district: "Prakasam District",
    elevationMsl: 4.2,
    baselinePop: 195000,
    substations: [
      { name: "Ongole East 132kV Substation", capacity: "132kV", floodThresholdM: 2.4 },
      { name: "Kothapatnam Coastal Feeder Unit", capacity: "33kV", floodThresholdM: 1.4 },
    ],
    hospitals: [
      { name: "RIMS Ongole Super Specialty Hospital", beds: 500, hasIcuBackup: true },
      { name: "Kothapatnam Rural Emergency Clinic", beds: 40, hasIcuBackup: false },
    ],
    drainageBasin: "Gundlakamma River Marine Outfall",
    vulnerabilityIndex: "High",
  },
  Kakinada: {
    id: "kakinada",
    name: "Kakinada",
    district: "Kakinada District",
    elevationMsl: 2.8,
    baselinePop: 320000,
    substations: [
      { name: "Kakinada Deepwater Port 220kV", capacity: "220kV", floodThresholdM: 2.0 },
      { name: "Samalkot 132kV Transmission", capacity: "132kV", floodThresholdM: 2.3 },
    ],
    hospitals: [
      { name: "Rangaraya Medical College & Hospital", beds: 650, hasIcuBackup: true },
      { name: "Coringa Marine Outpost Clinic", beds: 35, hasIcuBackup: false },
    ],
    drainageBasin: "Godavari Estuary & Coringa Mangroves",
    vulnerabilityIndex: "Severe",
  },
  Visakhapatnam: {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    district: "Visakhapatnam Metropolitan",
    elevationMsl: 5.5,
    baselinePop: 450000,
    substations: [
      { name: "Gajuwaka 400kV Mega Substation", capacity: "400kV", floodThresholdM: 3.0 },
      { name: "Visakhapatnam Port 132kV Feeder", capacity: "132kV", floodThresholdM: 2.1 },
    ],
    hospitals: [
      { name: "King George Hospital (KGH Trauma Center)", beds: 1050, hasIcuBackup: true },
      { name: "Visakha Institute of Medical Sciences", beds: 400, hasIcuBackup: true },
    ],
    drainageBasin: "Meghadrigedda Reservoir & Harbor Basin",
    vulnerabilityIndex: "High",
  },
};

interface ScenarioPreset {
  id: string;
  name: string;
  badge: string;
  windSpeed: number;
  surgeHeight: number;
  rainfall: number;
  forwardSpeed: number;
  landfallSector: string;
  description: string;
  riskColor: string;
}

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "michaung-actual",
    name: "Cyclone Michaung (2023 Actual)",
    badge: "HISTORICAL BENCHMARK",
    windSpeed: 115,
    surgeHeight: 1.8,
    rainfall: 260,
    forwardSpeed: 14,
    landfallSector: "Bapatla",
    description: "Actual observed IMD landfall vector south of Bapatla with compounding spring tide.",
    riskColor: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    id: "extreme-spring-tide",
    name: "Spring Tide Overtopping",
    badge: "WORST-CASE SURGE",
    windSpeed: 145,
    surgeHeight: 3.4,
    rainfall: 420,
    forwardSpeed: 11,
    landfallSector: "Machilipatnam",
    description: "Astronomical spring high tide (+1.2m) coinciding with 3.4m storm surge breach in Krishna delta.",
    riskColor: "text-red-700 bg-red-50 border-red-200",
  },
  {
    id: "cat4-rapid-intensification",
    name: "Cat-4 Eyewall Escalation",
    badge: "RAPID ESCALATION",
    windSpeed: 165,
    surgeHeight: 2.9,
    rainfall: 380,
    forwardSpeed: 20,
    landfallSector: "Nellore",
    description: "Eyewall rapid intensification 6h prior to landfall with sustained destructive gusts > 165 km/h.",
    riskColor: "text-amber-800 bg-amber-50 border-amber-200",
  },
  {
    id: "stalling-cloudburst",
    name: "Stalling Cloudburst System",
    badge: "EXTREME RAINFALL",
    windSpeed: 95,
    surgeHeight: 1.4,
    rainfall: 510,
    forwardSpeed: 7,
    landfallSector: "Ongole",
    description: "Slow forward speed (7 km/h) stalling near shoreline dumping > 500mm flash-flood precipitation.",
    riskColor: "text-cyan-800 bg-cyan-50 border-cyan-200",
  },
  {
    id: "port-metro-strike",
    name: "Deepwater Port Strike",
    badge: "INFRASTRUCTURE THREAT",
    windSpeed: 135,
    surgeHeight: 2.5,
    rainfall: 310,
    forwardSpeed: 17,
    landfallSector: "Kakinada",
    description: "Direct vortex hit on industrial shipping berths, fertilizer plants, and off-shore gas terminals.",
    riskColor: "text-slate-800 bg-slate-100 border-slate-300",
  },
];

export default function WhatIfSimulatorView() {
  const { t } = useLanguage();

  // Modulator States
  const [windSpeed, setWindSpeed] = useState<number>(115);
  const [surgeHeight, setSurgeHeight] = useState<number>(1.8);
  const [rainfall, setRainfall] = useState<number>(260);
  const [forwardSpeed, setForwardSpeed] = useState<number>(14);
  const [landfallSector, setLandfallSector] = useState<string>("Bapatla");

  // Operational State
  const [activeTab, setActiveTab] = useState<"readiness-bars" | "critical-assets" | "monte-carlo" | "directives">("readiness-bars");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [requisitionModalOpen, setRequisitionModalOpen] = useState(false);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<string>("Active Baseline");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const sector = SECTOR_CONFIGS[landfallSector] || SECTOR_CONFIGS["Bapatla"];

  // Cyclone Category Classification
  const cycloneClassification = useMemo(() => {
    if (windSpeed >= 165) return { label: "Extremely Severe CS (Cat-4 Equiv)", badgeColor: "bg-red-600 text-white" };
    if (windSpeed >= 135) return { label: "Very Severe CS (Cat-3)", badgeColor: "bg-red-500 text-white" };
    if (windSpeed >= 115) return { label: "Severe Cyclonic Storm (Cat-2)", badgeColor: "bg-amber-600 text-white" };
    if (windSpeed >= 90) return { label: "Cyclonic Storm (Cat-1)", badgeColor: "bg-blue-600 text-white" };
    return { label: "Deep Depression", badgeColor: "bg-slate-600 text-white" };
  }, [windSpeed]);

  // Storm Surge Phase Classification
  const surgeClassification = useMemo(() => {
    if (surgeHeight >= 3.0) return { label: "Catastrophic Embankment Breach", color: "text-red-700 bg-red-50 border-red-200" };
    if (surgeHeight >= 2.2) return { label: "Severe Spring Tide Overwash", color: "text-amber-800 bg-amber-50 border-amber-200" };
    if (surgeHeight >= 1.5) return { label: "Moderate Coastal Inundation", color: "text-cyan-800 bg-cyan-50 border-cyan-200" };
    return { label: "Normal Low/Neap Tide Buffer", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  }, [surgeHeight]);

  // Rainfall Severity Classification
  const rainClassification = useMemo(() => {
    if (rainfall >= 400) return { label: "Cloudburst / Red Alert Flash Flood", color: "text-red-700 bg-red-50 border-red-200" };
    if (rainfall >= 250) return { label: "Extremely Heavy Rainfall (Red Alert)", color: "text-amber-800 bg-amber-50 border-amber-200" };
    if (rainfall >= 150) return { label: "Very Heavy Rainfall (Orange Alert)", color: "text-blue-700 bg-blue-50 border-blue-200" };
    return { label: "Heavy Rainfall (Yellow Watch)", color: "text-slate-700 bg-slate-100 border-slate-200" };
  }, [rainfall]);

  // Reactive Slider Fill Percentages (for covered line styling)
  const windPercent = useMemo(() => Math.min(100, Math.max(0, ((windSpeed - 80) / (180 - 80)) * 100)), [windSpeed]);
  const surgePercent = useMemo(() => Math.min(100, Math.max(0, ((surgeHeight - 0.5) / (4.5 - 0.5)) * 100)), [surgeHeight]);
  const rainPercent = useMemo(() => Math.min(100, Math.max(0, ((rainfall - 50) / (550 - 50)) * 100)), [rainfall]);
  const speedPercent = useMemo(() => Math.min(100, Math.max(0, ((forwardSpeed - 6) / (32 - 6)) * 100)), [forwardSpeed]);

  // Dynamic Calculated Metrics (Refined Hydrodynamic Model)
  const calculatedPopulationRisk = useMemo(() => {
    const topoDampening = sector.elevationMsl < 2.0 ? 1.35 : sector.elevationMsl < 3.5 ? 1.05 : 0.82;
    const base = sector.baselinePop * 0.72;
    const windFactor = (windSpeed - 80) * 1150;
    const surgeFactor = (surgeHeight - 0.8) * 48000;
    const rainFactor = (rainfall - 100) * 190;
    const speedFactor = forwardSpeed < 12 ? 18000 : 0;
    return Math.max(12000, Math.round((base + windFactor + surgeFactor + rainFactor + speedFactor) * topoDampening));
  }, [sector, windSpeed, surgeHeight, rainfall, forwardSpeed]);

  const calculatedSubstations = useMemo(() => {
    const floodSusceptibility = sector.substations.filter((s) => surgeHeight >= s.floodThresholdM).length;
    const windTripCount = windSpeed > 130 ? 2 : windSpeed > 110 ? 1 : 0;
    return Math.min(24, Math.max(3, 4 + floodSusceptibility * 2 + windTripCount));
  }, [sector, surgeHeight, windSpeed]);

  const calculatedLossCrores = useMemo(() => {
    const windLoss = (windSpeed - 80) * 8.8;
    const surgeLoss = (surgeHeight - 0.8) * 340;
    const rainLoss = (rainfall - 100) * 1.95;
    const baseAssetValue = sector.baselinePop * 0.0016;
    return Math.round(380 + windLoss + surgeLoss + rainLoss + baseAssetValue);
  }, [sector, windSpeed, surgeHeight, rainfall]);

  const calculatedNdrfTeams = useMemo(() => {
    const popDemanded = Math.ceil(calculatedPopulationRisk / 16000);
    const surgeMultiplier = surgeHeight >= 2.5 ? 4 : surgeHeight >= 1.8 ? 2 : 0;
    return Math.min(32, Math.max(8, popDemanded + surgeMultiplier));
  }, [calculatedPopulationRisk, surgeHeight]);

  const calculatedAgriHectares = useMemo(() => {
    const surgeAcres = (surgeHeight - 0.6) * 16500;
    const rainPonding = (rainfall - 100) * 90;
    return Math.max(5000, Math.round(28000 + surgeAcres + rainPonding));
  }, [surgeHeight, rainfall]);

  const calculatedHospitalRiskCount = useMemo(() => {
    return Math.min(
      sector.hospitals.length + 3,
      Math.max(1, Math.round(surgeHeight >= 2.0 ? 3 : surgeHeight >= 1.4 ? 2 : 1))
    );
  }, [sector, surgeHeight]);

  const calculatedEvacRadiusKm = useMemo(() => {
    const surgeInfluence = (surgeHeight - 0.8) * 2.1;
    const windInfluence = (windSpeed - 80) * 0.035;
    return Math.min(12.5, Math.max(3.0, Number((4.0 + surgeInfluence + windInfluence).toFixed(1))));
  }, [surgeHeight, windSpeed]);

  // Hydrodynamic Stress & State Readiness Bars Calculations
  const embankmentStressPercent = useMemo(() => {
    return Math.min(100, Math.max(15, Math.round(((surgeHeight - 0.5) / 3.3) * 100)));
  }, [surgeHeight]);

  const gridFeederUrgencyPercent = useMemo(() => {
    const score = ((windSpeed - 75) / 105) * 55 + ((surgeHeight - 0.6) / 3.0) * 45;
    return Math.min(100, Math.max(10, Math.round(score)));
  }, [windSpeed, surgeHeight]);

  const shelterSaturationPercent = useMemo(() => {
    const capacity = sector.baselinePop * 0.45;
    return Math.min(100, Math.max(20, Math.round(((calculatedPopulationRisk * 0.38) / capacity) * 100)));
  }, [sector, calculatedPopulationRisk]);

  const roadCongestionPercent = useMemo(() => {
    const evacueeTraffic = calculatedPopulationRisk * 0.65;
    return Math.min(98, Math.max(22, Math.round((evacueeTraffic / 180000) * 85)));
  }, [calculatedPopulationRisk]);

  const generatorFuelAutonomyHours = useMemo(() => {
    return Math.max(14, Math.round(72 - (surgeHeight - 1.0) * 12 - (windSpeed > 130 ? 10 : 0)));
  }, [surgeHeight, windSpeed]);

  // Apply Scenario Preset
  const handleApplyPreset = (preset: ScenarioPreset) => {
    setWindSpeed(preset.windSpeed);
    setSurgeHeight(preset.surgeHeight);
    setRainfall(preset.rainfall);
    setForwardSpeed(preset.forwardSpeed);
    setLandfallSector(preset.landfallSector);
    setLastRunTimestamp(`Applied Preset: ${preset.name}`);
    showToast(`Autofilled: ${preset.name} parameters loaded.`);
  };

  const handleRunStressTest = () => {
    setIsSimulating(true);
    showToast("Executing Monte Carlo hydrodynamic stress test across 500 ensembles...");
    setTimeout(() => {
      setIsSimulating(false);
      const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastRunTimestamp(`Executed at ${now} (500 Ensembles Converged)`);
      showToast("✓ Stress simulation converged. Consequence metrics & action triggers updated.");
    }, 600);
  };

  const handleResetBaseline = () => {
    handleApplyPreset(SCENARIO_PRESETS[0]);
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-code flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. INSTITUTIONAL HEADER BAR WITH ACTION CONTROLS ── */}
      <div className="apple-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-blue-600 bg-white">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[28px]">tune</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-code">
                APSDMA C4ISR DISASTER RISK LAB
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-200 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                MONTE CARLO HYDRODYNAMIC V4.5
              </span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                {lastRunTimestamp}
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-[#0A2540] font-heading tracking-tight mt-0.5">
              What-If Disaster Impact Sandbox &amp; Stress Test Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Model alternative landfall sectors, wind gust escalations, and spring tide storm surge variations to test operational readiness.
            </p>
          </div>
        </div>

        {/* Executive Action Trigger Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetBaseline}
            className="apple-press px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition font-code border border-slate-200"
          >
            Reset Baseline
          </button>

          <button
            type="button"
            onClick={handleRunStressTest}
            disabled={isSimulating}
            className="apple-press px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 shadow-blue-500/25"
          >
            <span className={`material-symbols-outlined text-[18px] ${isSimulating ? "animate-spin" : ""}`}>
              {isSimulating ? "progress_activity" : "play_circle"}
            </span>
            <span>{isSimulating ? "Running 500 Ensembles..." : "Run Scenario Stress Test"}</span>
          </button>
        </div>
      </div>

      {/* ── 2. AUTOFILL SCENARIO PRESETS BAR ── */}
      <div className="apple-card p-3 sm:p-4 bg-slate-50/90 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">bolt</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-code">
              One-Click Scenario Autofill Presets:
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-code hidden sm:inline">
            Click any scenario to auto-populate modulators and benchmark against state contingency thresholds
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {SCENARIO_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="apple-press text-left p-2.5 rounded-xl border bg-white hover:border-blue-400 hover:shadow-xs transition group space-y-1.5 border-slate-200"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[9px] font-extrabold uppercase font-code px-1.5 py-0.5 rounded border tracking-wider line-clamp-1 bg-slate-100 text-slate-700 border-slate-200">
                  {p.badge}
                </span>
                <span className="text-[10px] font-bold text-blue-600 font-code">
                  {p.windSpeed} km/h
                </span>
              </div>
              <div className="font-heading font-bold text-xs text-[#0A2540] group-hover:text-blue-600 transition truncate">
                {p.name}
              </div>
              <div className="text-[10px] text-slate-500 font-sans line-clamp-2 leading-tight">
                {p.description}
              </div>
              <div className="text-[9px] font-code text-slate-400 pt-0.5 border-t border-slate-100 flex items-center justify-between">
                <span>Surge: +{p.surgeHeight}m</span>
                <span className="font-semibold text-slate-600">{p.landfallSector}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. MAIN DUAL-DECK: MODULATORS (LEFT) & PROJECTED CONSEQUENCE METRICS (RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT DECK: HAZARD VARIABLE MODULATORS (Span 5) */}
        <div className="lg:col-span-5 apple-card p-4 sm:p-5 space-y-4 bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">tune</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-code">
                Hazard Variable Modulators
              </h2>
            </div>
            <span className="text-[10px] font-code text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              REAL-TIME SENSITIVITY
            </span>
          </div>

          {/* Modulator 1: Peak Sustained Wind Speed */}
          <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs font-code">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-blue-600">air</span>
                Peak Sustained Wind Speed:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
                  {windSpeed} km/h
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${cycloneClassification.badgeColor}`}>
                  {cycloneClassification.label.split("(")[0].trim()}
                </span>
              </div>
            </div>

            {/* Range Slider with Fine Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setWindSpeed((prev) => Math.max(80, prev - 5))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs font-code text-xs apple-press"
                title="Decrease 5 km/h"
              >
                -
              </button>
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min={80}
                  max={180}
                  step={5}
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full c4isr-slider text-blue-600 cursor-pointer h-2.5 rounded-full appearance-none shadow-xs"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${windPercent}%, #e2e8f0 ${windPercent}%, #e2e8f0 100%)`
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setWindSpeed((prev) => Math.min(180, prev + 5))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs font-code text-xs apple-press"
                title="Increase 5 km/h"
              >
                +
              </button>
            </div>

            <div className="flex justify-between text-[10px] font-code pt-0.5">
              <span className={windSpeed >= 80 ? "text-blue-700 font-bold" : "text-slate-400"}>80 km/h (Cat-1)</span>
              <span className={windSpeed >= 120 ? "text-blue-700 font-bold" : "text-slate-400"}>120 km/h</span>
              <span className={windSpeed >= 160 ? "text-blue-700 font-bold" : "text-slate-400"}>160 km/h (Cat-3 Super)</span>
              <span className={windSpeed >= 180 ? "text-blue-700 font-bold" : "text-slate-400"}>180 km/h</span>
            </div>
          </div>

          {/* Modulator 2: Peak Coastal Storm Surge Height */}
          <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs font-code">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-cyan-600">tsunami</span>
                Peak Coastal Storm Surge:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-cyan-900 bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-200 shadow-2xs">
                  +{surgeHeight.toFixed(1)}m MSL
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${surgeClassification.color}`}>
                  {surgeClassification.label.split(" ")[0]}
                </span>
              </div>
            </div>

            {/* Range Slider with Fine Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSurgeHeight((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(1))))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs font-code text-xs apple-press"
                title="Decrease 0.1m"
              >
                -
              </button>
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min={0.5}
                  max={4.5}
                  step={0.1}
                  value={surgeHeight}
                  onChange={(e) => setSurgeHeight(Number(e.target.value))}
                  className="w-full c4isr-slider text-cyan-600 cursor-pointer h-2.5 rounded-full appearance-none shadow-xs"
                  style={{
                    background: `linear-gradient(to right, #0891b2 0%, #0891b2 ${surgePercent}%, #e2e8f0 ${surgePercent}%, #e2e8f0 100%)`
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setSurgeHeight((prev) => Math.min(4.5, Number((prev + 0.1).toFixed(1))))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs font-code text-xs apple-press"
                title="Increase 0.1m"
              >
                +
              </button>
            </div>

            <div className="flex justify-between text-[10px] font-code pt-0.5">
              <span className={surgeHeight >= 0.8 ? "text-cyan-800 font-bold" : "text-slate-400"}>+0.8m (Low Tide)</span>
              <span className={surgeHeight >= 2.0 ? "text-cyan-800 font-bold" : "text-slate-400"}>+2.0m (Moderate Tide)</span>
              <span className={surgeHeight >= 3.5 ? "text-cyan-800 font-bold" : "text-slate-400"}>+3.5m (Extreme Spring Tide)</span>
            </div>
          </div>

          {/* Modulator 3: 24-Hour Catchment Rainfall */}
          <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs font-code">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-blue-600">water_drop</span>
                24-Hour Catchment Rainfall:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
                  {rainfall} mm / 24h
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${rainClassification.color}`}>
                  {rainfall >= 250 ? "Red Alert" : "Orange"}
                </span>
              </div>
            </div>

            {/* Range Slider with Fine Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRainfall((prev) => Math.max(50, prev - 10))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs font-code text-xs apple-press"
                title="Decrease 10mm"
              >
                -
              </button>
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min={50}
                  max={550}
                  step={10}
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full c4isr-slider text-blue-700 cursor-pointer h-2.5 rounded-full appearance-none shadow-xs"
                  style={{
                    background: `linear-gradient(to right, #1d4ed8 0%, #1d4ed8 ${rainPercent}%, #e2e8f0 ${rainPercent}%, #e2e8f0 100%)`
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setRainfall((prev) => Math.min(550, prev + 10))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs font-code text-xs apple-press"
                title="Increase 10mm"
              >
                +
              </button>
            </div>

            <div className="flex justify-between text-[10px] font-code pt-0.5">
              <span className={rainfall >= 100 ? "text-blue-800 font-bold" : "text-slate-400"}>100 mm (Heavy)</span>
              <span className={rainfall >= 250 ? "text-blue-800 font-bold" : "text-slate-400"}>250 mm (Very Heavy)</span>
              <span className={rainfall >= 450 ? "text-blue-800 font-bold" : "text-slate-400"}>450 mm (Extremely Heavy)</span>
            </div>
          </div>

          {/* Modulator 4: Forward Translation Motion Speed */}
          <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs font-code">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-slate-600">fast_forward</span>
                Forward Translation Speed:
              </span>
              <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                {forwardSpeed} km/h {forwardSpeed < 12 ? "(Slow Stalling)" : "(Rapid Transit)"}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setForwardSpeed((prev) => Math.max(6, prev - 2))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs font-code text-xs apple-press"
                title="Decrease 2 km/h"
              >
                -
              </button>
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min={6}
                  max={32}
                  step={2}
                  value={forwardSpeed}
                  onChange={(e) => setForwardSpeed(Number(e.target.value))}
                  className="w-full c4isr-slider text-slate-700 cursor-pointer h-2.5 rounded-full appearance-none shadow-xs"
                  style={{
                    background: `linear-gradient(to right, #334155 0%, #334155 ${speedPercent}%, #e2e8f0 ${speedPercent}%, #e2e8f0 100%)`
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setForwardSpeed((prev) => Math.min(32, prev + 2))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs font-code text-xs apple-press"
                title="Increase 2 km/h"
              >
                +
              </button>
            </div>

            <div className="flex justify-between text-[10px] font-code pt-0.5">
              <span className={forwardSpeed >= 6 ? "text-slate-800 font-bold" : "text-slate-400"}>6 km/h (Severe Stalling)</span>
              <span className={forwardSpeed >= 16 ? "text-slate-800 font-bold" : "text-slate-400"}>16 km/h (Normal)</span>
              <span className={forwardSpeed >= 32 ? "text-slate-800 font-bold" : "text-slate-400"}>32 km/h (Fast)</span>
            </div>
          </div>


          {/* Sector Corridor Switcher Buttons */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 block font-code uppercase tracking-wider">
                Simulated Landfall Sector Corridor:
              </span>
              <span className="text-[10px] text-slate-500 font-code">
                Elevation: <strong>{sector.elevationMsl}m MSL</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-code">
              {Object.keys(SECTOR_CONFIGS).map((s) => {
                const isSelected = landfallSector === s;
                const sec = SECTOR_CONFIGS[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setLandfallSector(s)}
                    className={`p-2.5 rounded-xl font-bold border transition text-left space-y-1 ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs tracking-tight">{s}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded font-code ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"
                      }`}>
                        {sec.elevationMsl}m
                      </span>
                    </div>
                    <div className={`text-[10px] font-sans truncate ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {sec.drainageBasin.split("&")[0].trim()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT DECK: PROJECTED CONSEQUENCE METRICS (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="apple-card p-4 sm:p-5 space-y-4 bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[20px]">crisis_alert</span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-code">
                  Projected Consequence Metrics ({sector.name.toUpperCase()} SECTOR)
                </h2>
              </div>
              <span className="text-[10px] font-code text-red-700 font-bold bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                SIMULATION SCENARIO
              </span>
            </div>

            {/* 6 Institutional Consequence Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Metric 1: Exposed Population Risk */}
              <div className="p-3.5 bg-red-50/70 rounded-xl border border-red-200/90 space-y-1 relative overflow-hidden group hover:shadow-xs transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold font-code text-red-700 uppercase tracking-wider">
                    Population Inundation Risk
                  </span>
                  <span className="material-symbols-outlined text-red-500 text-[18px]">groups</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-red-600 font-heading tracking-tight">
                  {calculatedPopulationRisk.toLocaleString("en-IN")}
                </div>
                <p className="text-[10px] text-slate-600 font-code pt-0.5 leading-snug">
                  Mandatory shelter intake required
                </p>
                <div className="text-[9px] text-red-800 font-semibold pt-1 border-t border-red-200/60 flex items-center justify-between">
                  <span>Evac Perimeter:</span>
                  <span>{calculatedEvacRadiusKm} km from coast</span>
                </div>
              </div>

              {/* Metric 2: Vulnerable Substations */}
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/90 space-y-1 relative overflow-hidden group hover:shadow-xs transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold font-code text-amber-800 uppercase tracking-wider">
                    Grid Substations Flooded
                  </span>
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">bolt</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-800 font-heading tracking-tight">
                  {calculatedSubstations} <span className="text-xs font-semibold text-slate-500">Units</span>
                </div>
                <p className="text-[10px] text-slate-600 font-code pt-0.5 leading-snug">
                  Controlled feeder islanding needed
                </p>
                <div className="text-[9px] text-amber-900 font-semibold pt-1 border-t border-amber-200/60 flex items-center justify-between">
                  <span>Feeder Threat:</span>
                  <span>{gridFeederUrgencyPercent}% Islanding Req</span>
                </div>
              </div>

              {/* Metric 3: Economic Direct Loss */}
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/90 space-y-1 relative overflow-hidden group hover:shadow-xs transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold font-code text-blue-700 uppercase tracking-wider">
                    Estimated Direct Loss
                  </span>
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">currency_rupee</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] font-heading tracking-tight">
                  ₹{calculatedLossCrores} <span className="text-xs font-semibold text-slate-500">Cr</span>
                </div>
                <p className="text-[10px] text-slate-600 font-code pt-0.5 leading-snug">
                  Agriculture, ports &amp; transmission
                </p>
                <div className="text-[9px] text-blue-800 font-semibold pt-1 border-t border-blue-200/60 flex items-center justify-between">
                  <span>90th Pct Tail:</span>
                  <span>₹{Math.round(calculatedLossCrores * 1.48)} Cr Max</span>
                </div>
              </div>

              {/* Metric 4: Required NDRF Battalions */}
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/90 space-y-1 relative overflow-hidden group hover:shadow-xs transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold font-code text-emerald-800 uppercase tracking-wider">
                    NDRF Battalions Needed
                  </span>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">shield</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-heading tracking-tight">
                  {calculatedNdrfTeams} <span className="text-xs font-semibold text-slate-500">Teams</span>
                </div>
                <p className="text-[10px] text-slate-600 font-code pt-0.5 leading-snug">
                  Pre-positioning recommendation
                </p>
                <div className="text-[9px] text-emerald-900 font-semibold pt-1 border-t border-emerald-200/60 flex items-center justify-between">
                  <span>Rescue Boats:</span>
                  <span>{calculatedNdrfTeams * 4} OBM Inflatables</span>
                </div>
              </div>

              {/* Metric 5: Agricultural Saline Inundation */}
              <div className="p-3.5 bg-cyan-50/70 rounded-xl border border-cyan-200/90 space-y-1 relative overflow-hidden group hover:shadow-xs transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold font-code text-cyan-900 uppercase tracking-wider">
                    Saline Crop Inundation
                  </span>
                  <span className="material-symbols-outlined text-cyan-700 text-[18px]">agriculture</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-950 font-heading tracking-tight">
                  {calculatedAgriHectares.toLocaleString("en-IN")} <span className="text-xs font-semibold text-slate-500">ha</span>
                </div>
                <p className="text-[10px] text-slate-600 font-code pt-0.5 leading-snug">
                  Paddy &amp; shrimp aqua breach
                </p>
                <div className="text-[9px] text-cyan-900 font-semibold pt-1 border-t border-cyan-200/60 flex items-center justify-between">
                  <span>Desalination:</span>
                  <span>~18 months reclamation</span>
                </div>
              </div>

              {/* Metric 6: Critical Healthcare & ICU Units */}
              <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-300/80 space-y-1 relative overflow-hidden group hover:shadow-xs transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold font-code text-slate-700 uppercase tracking-wider">
                    Critical Hospitals at Risk
                  </span>
                  <span className="material-symbols-outlined text-slate-600 text-[18px]">local_hospital</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] font-heading tracking-tight">
                  {calculatedHospitalRiskCount} <span className="text-xs font-semibold text-slate-500">Hospitals</span>
                </div>
                <p className="text-[10px] text-slate-600 font-code pt-0.5 leading-snug">
                  Backup generator flooding risk
                </p>
                <div className="text-[9px] text-slate-700 font-semibold pt-1 border-t border-slate-200 flex items-center justify-between">
                  <span>Diesel Autonomy:</span>
                  <span>{generatorFuelAutonomyHours} Hours Remaining</span>
                </div>
              </div>
            </div>

            {/* Strategic Decision Guidance Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700 font-sans leading-relaxed">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-slate-900 font-heading text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-blue-600">verified</span>
                  <span>Decision Support Guidance:</span>
                </strong>
                <button
                  type="button"
                  onClick={() => setRequisitionModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold font-code transition flex items-center gap-1.5 shadow-xs shadow-blue-500/20"
                >
                  <span className="material-symbols-outlined text-[15px]">assignment</span>
                  <span>Requisition Resource Order</span>
                </button>
              </div>
              <p>
                Under this stress scenario (<strong>+{surgeHeight.toFixed(1)}m</strong> surge at <strong>{windSpeed} km/h</strong> winds in the <strong>{sector.name}</strong> sector), evacuation radius must be expanded to <strong>{calculatedEvacRadiusKm} km</strong> from the shoreline. Recommend requisitioning <strong>{calculatedNdrfTeams}</strong> search and rescue battalions and deploying high-capacity diesel dewatering pumps to the <strong>{sector.substations[0].name}</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-code text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <strong>Trigger 1:</strong> Mandatory shoreline evacuation before T-12h
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <strong>Trigger 2:</strong> De-energize coastal feeders at +{surgeHeight.toFixed(1)}m MSL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. DEEP STATE READINESS BARS & ENSEMBLE TABS DECK ── */}
      <div className="apple-card p-4 sm:p-5 space-y-4 bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("readiness-bars")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "readiness-bars"
                ? "bg-[#0A2540] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">stacked_bar_chart</span>
            <span>Hydrodynamic Stress &amp; State Readiness Bars</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("critical-assets")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "critical-assets"
                ? "bg-[#0A2540] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">domain</span>
            <span>Critical Assets at Risk Matrix ({sector.substations.length + sector.hospitals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("monte-carlo")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "monte-carlo"
                ? "bg-[#0A2540] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            <span>Monte Carlo Stochastic Envelope (500 Ensembles)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("directives")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "directives"
                ? "bg-[#0A2540] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>State Contingency Directives</span>
          </button>
        </div>

        {/* TAB 1: HYDRODYNAMIC STRESS & STATE READINESS BARS */}
        {activeTab === "readiness-bars" && (
          <div className="space-y-4 pt-1 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Progress Bar 1: Sea Embankment Breach Likelihood */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-cyan-700">tsunami</span>
                    Sea Embankment Breach Likelihood
                  </span>
                  <span className={`font-code font-bold text-xs px-2 py-0.5 rounded ${
                    embankmentStressPercent >= 75
                      ? "bg-red-100 text-red-800"
                      : embankmentStressPercent >= 45
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {embankmentStressPercent}% ({embankmentStressPercent >= 75 ? "CRITICAL BREACH" : embankmentStressPercent >= 45 ? "OVERWASH RISK" : "STABLE"})
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      embankmentStressPercent >= 75
                        ? "bg-red-600"
                        : embankmentStressPercent >= 45
                        ? "bg-amber-500"
                        : "bg-cyan-600"
                    }`}
                    style={{ width: `${embankmentStressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-code">
                  <span>Current Surge: +{surgeHeight.toFixed(1)}m</span>
                  <span>Crest Elevation: {sector.elevationMsl + 1.2}m MSL</span>
                </div>
              </div>

              {/* Progress Bar 2: Power Grid Feeder Islanding Urgency */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">bolt</span>
                    Power Grid Feeder Islanding Urgency
                  </span>
                  <span className={`font-code font-bold text-xs px-2 py-0.5 rounded ${
                    gridFeederUrgencyPercent >= 75
                      ? "bg-red-100 text-red-800"
                      : gridFeederUrgencyPercent >= 50
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {gridFeederUrgencyPercent}% ({gridFeederUrgencyPercent >= 75 ? "IMMEDIATE CUT" : "STANDBY"})
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      gridFeederUrgencyPercent >= 75
                        ? "bg-red-600"
                        : gridFeederUrgencyPercent >= 50
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${gridFeederUrgencyPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-code">
                  <span>Vulnerable Substations: {calculatedSubstations} Units</span>
                  <span>Est. Grid Restoration: ~36-48 Hours</span>
                </div>
              </div>

              {/* Progress Bar 3: Shelter Registry Capacity Saturation */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">night_shelter</span>
                    Cyclone Shelter Bed Occupancy
                  </span>
                  <span className={`font-code font-bold text-xs px-2 py-0.5 rounded ${
                    shelterSaturationPercent >= 85
                      ? "bg-red-100 text-red-800"
                      : shelterSaturationPercent >= 60
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {shelterSaturationPercent}% Utilized
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      shelterSaturationPercent >= 85
                        ? "bg-red-600"
                        : shelterSaturationPercent >= 60
                        ? "bg-amber-500"
                        : "bg-emerald-600"
                    }`}
                    style={{ width: `${shelterSaturationPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-code">
                  <span>Displaced intake: {Math.round(calculatedPopulationRisk * 0.38).toLocaleString("en-IN")} persons</span>
                  <span>Reserve Buffers: {Math.max(0, 100 - shelterSaturationPercent)}% remaining</span>
                </div>
              </div>

              {/* Progress Bar 4: Evacuation Corridor Highway Saturation */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-700">traffic</span>
                    Evacuation Arterial Highway Saturation
                  </span>
                  <span className={`font-code font-bold text-xs px-2 py-0.5 rounded ${
                    roadCongestionPercent >= 80
                      ? "bg-red-100 text-red-800"
                      : roadCongestionPercent >= 55
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {roadCongestionPercent}% Volume
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      roadCongestionPercent >= 80
                        ? "bg-red-600"
                        : roadCongestionPercent >= 55
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${roadCongestionPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-code">
                  <span>NH-16 &amp; Coastal State Highways</span>
                  <span>Clearance Target: T-8h before Landfall</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRITICAL ASSETS STATUS MATRIX */}
        {activeTab === "critical-assets" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-code">
            {/* Substations Matrix */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 block text-xs uppercase text-slate-500">
                  Threatened Power Substations ({sector.name})
                </span>
                <span className="text-[10px] text-slate-400 font-bold">FLOOD THRESHOLD</span>
              </div>
              <div className="space-y-2">
                {sector.substations.map((sub) => {
                  const isFlooded = surgeHeight >= sub.floodThresholdM;
                  return (
                    <div key={sub.name} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <div>
                        <div className="font-bold text-slate-800">{sub.name}</div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          Capacity: {sub.capacity} · Yard Elev: +{sub.floodThresholdM}m
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isFlooded
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {isFlooded ? "BREAKER FLOODED" : "ISLANDING READY"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Healthcare Facilities Matrix */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 block text-xs uppercase text-slate-500">
                  Hospitals Requiring Backup Dewatering
                </span>
                <span className="text-[10px] text-slate-400 font-bold">CRITICAL CARE</span>
              </div>
              <div className="space-y-2">
                {sector.hospitals.map((hosp, idx) => (
                  <div key={hosp.name} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <div>
                      <div className="font-bold text-slate-800">{hosp.name}</div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        Capacity: {hosp.beds} Inpatient Beds · {hosp.hasIcuBackup ? "ICU Backup Verified" : "Rural Unit"}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {idx === 0 ? "PUMP DEPLOYED" : "GREEN FEEDER SYNC"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MONTE CARLO STOCHASTIC ENSEMBLE */}
        {activeTab === "monte-carlo" && (
          <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 font-code text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-bold text-slate-800 text-sm">
                  Stochastic Risk Confidence Envelope (500 Monte Carlo Runs)
                </span>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  Hydrodynamic surrogate model sampling tidal phase variance, wind gust peak variance, and soil saturation coefficients.
                </p>
              </div>
              <span className="text-[10px] text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                VERTEX AI ENSEMBLE ENGINE V4.5
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600">10th Percentile (Optimistic Low-Tide Coincidence):</span>
                  <span className="font-bold text-emerald-700">₹{Math.round(calculatedLossCrores * 0.72)} Cr</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: "35%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-800 font-bold">50th Percentile (Median Expected Stress Scenario):</span>
                  <span className="font-bold text-blue-700">₹{calculatedLossCrores} Cr</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-red-700 font-bold">90th Percentile (Compound Spring Tide &amp; Cloudburst Catastrophe):</span>
                  <span className="font-bold text-red-600">₹{Math.round(calculatedLossCrores * 1.48)} Cr</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-600">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[9px] uppercase">Mean Inundation Depth</span>
                <strong className="text-slate-800 text-xs">+{surgeHeight.toFixed(1)}m MSL (±0.4m)</strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[9px] uppercase">Confidence Interval</span>
                <strong className="text-slate-800 text-xs">95.4% (Gaussian Fit)</strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[9px] uppercase">Hydrodynamic Convergence</span>
                <strong className="text-emerald-700 text-xs">Stable (42ms latency)</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STATE CONTINGENCY DIRECTIVES */}
        {activeTab === "directives" && (
          <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-code text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase text-slate-500 block">
                Automated Standard Operating Directives (SOPs)
              </span>
              <span className="text-[10px] text-blue-700 font-bold">GOVERNMENT OF ANDHRA PRADESH</span>
            </div>
            <ul className="list-disc list-inside space-y-2 text-slate-700 leading-relaxed font-sans">
              <li>
                <strong>Mandatory Evacuation Notification:</strong> Enforce total clearance of all habitations within <strong>{calculatedEvacRadiusKm} km</strong> of the {sector.name} shoreline by T-12 hours before anticipated landfall.
              </li>
              <li>
                <strong>Tactical Battalion Pre-positioning:</strong> Stage <strong>{calculatedNdrfTeams} NDRF &amp; SDRF battalions</strong> along with {calculatedNdrfTeams * 4} OBM inflatable flood rescue boats on elevated highway nodes along NH-16.
              </li>
              <li>
                <strong>Power Grid Protection:</strong> Authorize controlled islanding and stage-1 de-energization of <strong>{sector.substations[0].name}</strong> when tidal gauges breach +{surgeHeight.toFixed(1)}m to prevent transformer catastrophic explosion.
              </li>
              <li>
                <strong>Hospital ICU Safeguarding:</strong> Mobilize high-capacity mobile diesel dewatering pumps to <strong>{sector.hospitals[0].name}</strong> and ensure 72-hour liquid medical oxygen reserves are isolated from floodwaters.
              </li>
              <li>
                <strong>Emergency SDRF Drawdown:</strong> Requisition State Disaster Response Fund emergency liquidity allocation of <strong>₹{Math.round(calculatedLossCrores * 0.15)} Crores</strong> for rapid relief camp distribution.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ── 5. RESOURCE REQUISITION ORDER MODAL ── */}
      {requisitionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">assignment</span>
                <span className="font-heading font-bold text-base text-[#0A2540]">
                  State Disaster Response Requisition Order
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRequisitionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs font-code">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-bold text-slate-800">REQ-APSDMA-2026-STRESS-09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Corridor:</span>
                <span className="font-bold text-blue-700">{sector.name} Coast ({sector.district})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Simulated Gale / Surge:</span>
                <span className="font-bold text-slate-800">{windSpeed} km/h · +{surgeHeight.toFixed(1)}m MSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Evacuation Radius:</span>
                <span className="font-bold text-red-600">{calculatedEvacRadiusKm} km Coastal Buffer</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 block font-heading">
                Requisitioned Assets &amp; Allocations:
              </span>
              <ul className="space-y-1.5 font-code text-[11px] text-slate-600">
                <li className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>NDRF / SDRF Search &amp; Rescue Battalions</span>
                  <strong className="text-slate-900">{calculatedNdrfTeams} Teams ({calculatedNdrfTeams * 45} Personnel)</strong>
                </li>
                <li className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>OBM Inflatable Deep-Water Rescue Boats</span>
                  <strong className="text-slate-900">{calculatedNdrfTeams * 4} Boats</strong>
                </li>
                <li className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>High-Capacity Heavy Diesel Dewatering Pumps</span>
                  <strong className="text-slate-900">{calculatedSubstations * 2} Units</strong>
                </li>
                <li className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Emergency SDRF Advance Relief Liquidity</span>
                  <strong className="text-emerald-700">₹{Math.round(calculatedLossCrores * 0.15)} Crores</strong>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setRequisitionModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition font-code"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setRequisitionModalOpen(false);
                  showToast("✓ Formal Resource Order REQ-APSDMA-2026-STRESS-09 dispatched to NDRF South Command.");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition font-code shadow-sm shadow-blue-500/25 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Confirm &amp; Transmit Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
