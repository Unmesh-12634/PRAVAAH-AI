"use client";

import React, { useState } from "react";

interface FieldInspectionCase {
  id: string;
  title: string;
  source: "CITIZEN_PHOTO" | "DRONE_UAV" | "VILLAGE_WARDEN" | "SENTINEL_SAR";
  location: string;
  district: string;
  timestamp: string;
  hazardType: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
  estimatedDepth: string;
  thumbnail: string;
  geminiReasoning: string;
  recommendedAction: string;
  bigQueryParcelsAffected: number;
}

const SAMPLE_CASES: FieldInspectionCase[] = [
  {
    id: "case-01",
    title: "Coastal Flood Levee Overtopping & Seepage",
    source: "DRONE_UAV",
    location: "Nizampatnam Estuary Bank (15.91°N, 80.67°E)",
    district: "Bapatla",
    timestamp: "13:15 IST (15m ago)",
    hazardType: "Embankment Structural Breaching",
    severity: "CRITICAL",
    estimatedDepth: "+0.85m above embankment crest",
    thumbnail: "🌊",
    geminiReasoning:
      "Gemini 3.7 Multimodal Vision detected severe turbulent saline water overtopping the earth-fill dyke over a 40m span. Soil saturation index indicates acute sloughing risk. Breaching will inundate 1,200 households in Nizampatnam lower ward within 45 minutes.",
    recommendedAction: "Pre-position 4 motorized NDRF Gemini boats and deploy 5,000 geo-textile sandbags immediately.",
    bigQueryParcelsAffected: 380,
  },
  {
    id: "case-02",
    title: "132kV Substation Transformer Yard Inundation",
    source: "VILLAGE_WARDEN",
    location: "Bapatla Coastal Feeder Yard (15.90°N, 80.47°E)",
    district: "Bapatla",
    timestamp: "12:50 IST (40m ago)",
    hazardType: "High-Voltage Flashover Threat",
    severity: "CRITICAL",
    estimatedDepth: "+0.62m (0.18m from busbar plinth limit)",
    thumbnail: "⚡",
    geminiReasoning:
      "Visual assessment confirms floodwater approaching 132kV bushing level. Sediment load in water increases electrical conductivity. Transformer catastrophic short-circuit imminent if water rises another 15cm.",
    recommendedAction: "Execute stage-1 controlled feeder islanding and divert power through Ongole 220kV secondary loop.",
    bigQueryParcelsAffected: 8400,
  },
  {
    id: "case-03",
    title: "Saline Water Logging in Kharif Paddy Crops",
    source: "CITIZEN_PHOTO",
    location: "Kavali Mandal Agricultural Belt (14.91°N, 79.98°E)",
    district: "SPSR Nellore",
    timestamp: "12:10 IST (1h 20m ago)",
    hazardType: "Saltwater Intrusion & Crop Suffocation",
    severity: "HIGH",
    estimatedDepth: "+0.45m standing saline water",
    thumbnail: "🌾",
    geminiReasoning:
      "Multimodal analysis identifies flowering-stage Paddy submerged under stagnant saline backwater. Chlorosis and leaf wilting visible. Correlating with Sentinel-1 SAR imagery confirms 4,200 continuous hectares inundated. Qualifies for PMFBY parametric insurance trigger.",
    recommendedAction: "Trigger automated ₹48.2 Cr PMFBY parametric advance disbursal via Aadhaar payment bridge.",
    bigQueryParcelsAffected: 4200,
  },
  {
    id: "case-04",
    title: "NH-16 River Causeway Scour & Debris Jam",
    source: "CITIZEN_PHOTO",
    location: "Pennar River Causeway (14.44°N, 79.99°E)",
    district: "SPSR Nellore",
    timestamp: "11:45 IST (1h 45m ago)",
    hazardType: "Arterial Road Severance",
    severity: "HIGH",
    estimatedDepth: "Water 0.3m above road deck with 2.8 m/s velocity",
    thumbnail: "🌉",
    geminiReasoning:
      "Debris accumulation around pier #4 detected from citizen smartphone upload. High hydrodynamic drag posing vehicle sweep-off hazard. Structural bridge integrity intact but vehicular transit is unsafe.",
    recommendedAction: "Barricade highway approaches and divert south-bound traffic to state bypass SH-57.",
    bigQueryParcelsAffected: 120,
  },
];

const GEE_LAYERS = [
  {
    id: "gee-sar",
    name: "Sentinel-1 SAR Flood Inundation (10m)",
    agency: "Copernicus / GEE",
    band: "C-Band Synthetic Aperture Radar (VV+VH)",
    updateFreq: "Daily Orbit (Cloud Penetrating)",
    status: "ACTIVE SYNC",
  },
  {
    id: "gee-ndvi",
    name: "Sentinel-2 Multi-Spectral Moisture & NDWI",
    agency: "ESA / Google Earth Engine",
    band: "B8 NIR / B3 Green (Water Extent Index)",
    updateFreq: "Every 5 Days (0.84 Correlation)",
    status: "ACTIVE SYNC",
  },
  {
    id: "gee-dem",
    name: "NASA SRTM Topographic Elevation DEM",
    agency: "NASA / ISRO Bhuvan",
    band: "1 Arc-Second Global (30m Resolution)",
    updateFreq: "Static Baseline Topography",
    status: "CALIBRATED",
  },
  {
    id: "gee-sst",
    name: "NOAA/MODIS Bay of Bengal Sea Surface Temp",
    agency: "NOAA / IMD Ocean Desk",
    band: "Thermal Infrared (30.4°C SST Anomaly)",
    updateFreq: "Hourly Geosynchronous",
    status: "CYCLONE FUEL ACTIVE",
  },
];

const INDIAN_LANGUAGES = [
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "en", name: "English (National)" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "bn", name: "Bengali (বাংলা)" },
];

export default function MultimodalVisionView() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-01");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("te");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCase = SAMPLE_CASES.find((c) => c.id === selectedCaseId) || SAMPLE_CASES[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast("Gemini 3.7 Multimodal Vision analysis updated");
    }, 450);
  };

  const toggleVoiceBriefing = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      showToast(`Synthesizing Cloud Text-to-Speech in ${INDIAN_LANGUAGES.find(l => l.code === selectedLanguage)?.name}...`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-code flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Google AI & GEE Badges */}
      <div className="apple-card p-4.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">document_scanner</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#0A2540] font-heading tracking-tight">
                Gemini 3.7 Multimodal Vision &amp; Google Earth Engine (GEE)
              </h1>
              <span className="bg-blue-50 text-blue-800 border border-blue-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                GEMINI 3.7 FLASH MULTIMODAL
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                GEE SATELLITE RADAR SYNCHRONIZED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated citizen smartphone photo analysis, drone embankment damage detection, and Google Earth Engine Sentinel-1 SAR flood modeling.
            </p>
          </div>
        </div>

        {/* Voice and Multilingual Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Cloud Speech Synthesizer */}
          <button
            type="button"
            onClick={toggleVoiceBriefing}
            className={`apple-press px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              isPlayingAudio
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-[17px] text-blue-600">
              {isPlayingAudio ? "volume_up" : "record_voice_over"}
            </span>
            <span>{isPlayingAudio ? "Playing Voice Audio..." : "Voice Briefing"}</span>
            {isPlayingAudio && (
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-emerald-500 animate-bounce" />
                <span className="w-0.5 h-2 bg-emerald-500 animate-pulse" />
                <span className="w-0.5 h-3 bg-emerald-500 animate-bounce" />
              </span>
            )}
          </button>

          {/* Regional Indian Language Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-code">
            <span className="material-symbols-outlined text-[15px] text-slate-400">translate</span>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                showToast(`Switched language to ${INDIAN_LANGUAGES.find(l => l.code === e.target.value)?.name}`);
              }}
              className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-xs"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Inspection Grid: Left (Photo Feed) vs Right (Gemini 3.7 Multimodal Dossier) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Sample Field Observation Submissions (Span 5) */}
        <div className="lg:col-span-5 apple-card p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">add_a_photo</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-code">
                Field Photo &amp; Drone Feed Stream
              </h2>
            </div>
            <span className="text-[10px] font-code text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              CITIZEN + DRONE UPLINK
            </span>
          </div>

          {/* Photo Case Selector Cards */}
          <div className="space-y-2.5">
            {SAMPLE_CASES.map((item) => {
              const isSelected = selectedCaseId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectCase(item.id)}
                  className={`apple-press p-3 rounded-2xl border transition cursor-pointer select-none ${
                    isSelected
                      ? "bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                      {item.thumbnail}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold font-code px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                          {item.source}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-code ${
                            item.severity === "CRITICAL"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-[#0A2540] truncate font-heading">
                        {item.title}
                      </h3>

                      <div className="text-[10px] text-slate-400 font-code flex items-center justify-between">
                        <span>{item.location}</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upload Custom Drone / Citizen Image */}
          <div className="p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 text-center transition cursor-pointer space-y-1">
            <span className="material-symbols-outlined text-[24px] text-slate-400 block mx-auto">
              cloud_upload
            </span>
            <span className="text-xs font-bold text-slate-700 block font-heading">
              Upload Drone Survey or Citizen Mobile Photo
            </span>
            <span className="text-[10px] text-slate-400 font-code block">
              Supports JPG, PNG, GeoTIFF, and Sentinel-1 SAR granules
            </span>
          </div>
        </div>

        {/* Gemini 3.7 Flash Multimodal Reasoning Analysis (Span 7) */}
        <div className="lg:col-span-7 apple-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">psychology</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-code">
                Gemini 3.7 Multimodal Hazard Reasoning Dossier
              </h2>
            </div>
            <span className="text-[10px] font-code text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
              ZERO-SHOT VISION INFERENCE
            </span>
          </div>

          {/* Inspection Details */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <span className="text-[10px] font-bold font-code text-slate-400 uppercase tracking-wider block">
                  ACTIVE OBSERVATION TARGET
                </span>
                <h3 className="text-sm font-extrabold text-[#0A2540] font-heading mt-0.5">
                  {activeCase.title}
                </h3>
                <span className="text-xs text-slate-500 font-code">
                  Sector: {activeCase.district} · {activeCase.location}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-code text-slate-400 block">ESTIMATED INUNDATION</span>
                <span className="text-sm font-extrabold text-red-600 font-code">
                  {activeCase.estimatedDepth}
                </span>
              </div>
            </div>

            {/* AI Reasoning Narrative Box */}
            <div className="p-3.5 bg-blue-50/40 rounded-2xl border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-900 font-heading flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">auto_awesome</span>
                  Gemini 3.7 Multimodal Vision Diagnosis
                </span>
                <span className="text-[10px] font-code text-blue-700 font-semibold">
                  Confidence: 97.4%
                </span>
              </div>

              {isAnalyzing ? (
                <div className="py-4 text-center text-xs font-code text-blue-700 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Executing multimodal tensor reasoning...</span>
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {activeCase.geminiReasoning}
                </p>
              )}
            </div>

            {/* Actionable Directive & BigQuery Spatial Aggregation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-code text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  BIGQUERY CADASTRAL EXPOSURE
                </span>
                <div className="text-lg font-extrabold text-[#0A2540]">
                  {activeCase.bigQueryParcelsAffected.toLocaleString("en-IN")}{" "}
                  <span className="text-xs font-semibold text-slate-500">Parcels</span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Cross-referenced with Land Records (Meebhoomi)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  HAZARD CLASSIFICATION
                </span>
                <div className="text-sm font-extrabold text-red-600 mt-1">
                  {activeCase.hazardType}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Requires Priority 1 EOC Dispatch
                </span>
              </div>
            </div>

            {/* Action Dispatch Buttons */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-sans text-slate-600 flex-1 min-w-[200px]">
                <strong className="text-slate-800 block font-heading">Recommended Early Action:</strong>
                {activeCase.recommendedAction}
              </div>

              <button
                type="button"
                onClick={() => showToast("Dispatched Early Action Directive to District Collector EOC")}
                className="apple-press px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Dispatch EOC Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Google Earth Engine (GEE) Satellite Feeds Engine */}
      <div className="apple-card p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">public</span>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] font-heading">
                Google Earth Engine (GEE) Satellite Telemetry Pipeline
              </h2>
              <p className="text-[10px] text-slate-400 font-code">
                CONTINUOUS RADAR &amp; OPTICAL REMOTE SENSING CONVERGENCE
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-code text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            4 SATELLITE STREAMS ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GEE_LAYERS.map((layer) => (
            <div
              key={layer.id}
              className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5 text-xs font-code flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{layer.agency}</span>
                  <span className="text-emerald-700 font-bold">{layer.status}</span>
                </div>
                <h4 className="font-heading font-bold text-xs text-[#0A2540] mt-1">
                  {layer.name}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 font-sans">
                  {layer.band}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex justify-between">
                <span>Orbit: {layer.updateFreq}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
