"use client";

import React, { useState } from "react";

interface ActionItem {
  id: string;
  phase: "T-36h" | "T-24h" | "T-12h" | "T-0h";
  title: string;
  leadAgency: string;
  category: "maritime" | "shelter" | "evacuation" | "power" | "rations" | "curfew";
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  progressPct: number;
  description: string;
  triggerCondition: string;
  currentTelemetryValue: string;
  triggerThreshold: string;
  isTriggerMet: boolean;
}

const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: "act-1",
    phase: "T-36h",
    title: "Deep Sea Fishermen Recall & Coastal Harbor Lockdown",
    leadAgency: "Dept of Fisheries / Indian Coast Guard",
    category: "maritime",
    status: "COMPLETED",
    progressPct: 100,
    description: "1,420 of 1,420 registered mechanized fishing trawlers safely returned to Krishnapatnam and Nizampatnam harbors.",
    triggerCondition: "Cyclone Center < 450km & Gale Wind Forecast > 65 km/h",
    currentTelemetryValue: "98 km/h (Doppler)",
    triggerThreshold: "> 65 km/h",
    isTriggerMet: true,
  },
  {
    id: "act-2",
    phase: "T-36h",
    title: "Cyclone Relief Shelter Activation & Solar Genset Audit",
    leadAgency: "Revenue & Disaster Management Dept",
    category: "shelter",
    status: "COMPLETED",
    progressPct: 100,
    description: "214 cyclone multipurpose shelters inspected, gensets fueled with 72h diesel, and solar high-mast towers verified.",
    triggerCondition: "Red Warning Issuance by IMD Coastal Cyclone Desk",
    currentTelemetryValue: "Red Bulletin #14",
    triggerThreshold: "IMD Red Stage",
    isTriggerMet: true,
  },
  {
    id: "act-3",
    phase: "T-24h",
    title: "Vulnerable Coastal Population Mandatory Evacuation",
    leadAgency: "District Collectorates / Police Dept",
    category: "evacuation",
    status: "IN_PROGRESS",
    progressPct: 78,
    description: "64,200 of 82,000 citizens from within 5km storm surge zone evacuated to designated reinforced concrete shelters.",
    triggerCondition: "Predicted Storm Surge > 1.2m coinciding with High Tide",
    currentTelemetryValue: "+1.6m MSL Forecast",
    triggerThreshold: "> 1.2m MSL",
    isTriggerMet: true,
  },
  {
    id: "act-4",
    phase: "T-24h",
    title: "NDRF & SDRF Tactical Pre-positioning in Surge Sectors",
    leadAgency: "10th Bn NDRF / State Disaster Response Force",
    category: "evacuation",
    status: "COMPLETED",
    progressPct: 100,
    description: "18 NDRF teams equipped with inflatable motorized Gemini boats, chainsaw tree-cutters, and satcom units deployed.",
    triggerCondition: "T-24h Track Confidence > 90% (Vertex AI Ensemble)",
    currentTelemetryValue: "94.8% Track Certainty",
    triggerThreshold: "> 90.0%",
    isTriggerMet: true,
  },
  {
    id: "act-5",
    phase: "T-12h",
    title: "Controlled Power Grid Feeder Islanding & Substation Isolation",
    leadAgency: "APTRANSCO / CPDCL Power Grid",
    category: "power",
    status: "IN_PROGRESS",
    progressPct: 45,
    description: "Scheduled stage-wise shutdown of high-tension feeder lines in low-lying inundated mandals to eliminate electrocution risks.",
    triggerCondition: "Water Inundation > 0.5m near 132kV Substation Perimeters",
    currentTelemetryValue: "0.62m Water Accumulation",
    triggerThreshold: "> 0.50m",
    isTriggerMet: true,
  },
  {
    id: "act-6",
    phase: "T-12h",
    title: "Emergency Drinking Water Pouches & Dry Rations Staging",
    leadAgency: "Civil Supplies Dept & Red Cross",
    category: "rations",
    status: "IN_PROGRESS",
    progressPct: 88,
    description: "150,000 drinking water pouches and 45 metric tons of high-energy relief biscuits delivered to primary distribution hubs.",
    triggerCondition: "Shelter Intake > 50% Nominal Capacity",
    currentTelemetryValue: "70.7% Occupancy",
    triggerThreshold: "> 50.0%",
    isTriggerMet: true,
  },
  {
    id: "act-7",
    phase: "T-0h",
    title: "Zero-Hour Coastal Highway Curfew & SAR Standby",
    leadAgency: "District Magistrate EOC / State Highway Patrol",
    category: "curfew",
    status: "PENDING",
    progressPct: 15,
    description: "Total movement prohibition on NH-16 coastal stretches once sustained gale winds surpass 80 km/h.",
    triggerCondition: "Sustained Coastal Winds > 80 km/h Measured by Radar",
    currentTelemetryValue: "74 km/h Coastline Mean",
    triggerThreshold: "> 80 km/h",
    isTriggerMet: false,
  },
];

export default function AnticipatoryActionsView() {
  const [actions, setActions] = useState<ActionItem[]>(INITIAL_ACTIONS);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedAgency, setSelectedAgency] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleActionStatus = (id: string) => {
    setActions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === "COMPLETED"
              ? "PENDING"
              : item.status === "PENDING"
              ? "IN_PROGRESS"
              : "COMPLETED";
          const nextPct = nextStatus === "COMPLETED" ? 100 : nextStatus === "IN_PROGRESS" ? 65 : 0;
          showToast(`Updated: ${item.title.substring(0, 32)}... → ${nextStatus}`);
          return { ...item, status: nextStatus, progressPct: nextPct };
        }
        return item;
      })
    );
  };

  // Trigger all eligible automated actions
  const triggerAutomatedBatch = () => {
    setActions((prev) =>
      prev.map((item) => {
        if (item.isTriggerMet && item.status !== "COMPLETED") {
          return { ...item, status: "IN_PROGRESS", progressPct: Math.max(item.progressPct, 85) };
        }
        return item;
      })
    );
    showToast("Vertex AI Early Trigger Engine: Synchronized 5 active action protocols with District EOCs");
  };

  const filtered = actions.filter((a) => {
    const matchPhase = selectedPhase === "all" || a.phase === selectedPhase;
    const matchAgency = selectedAgency === "all" || a.leadAgency.toLowerCase().includes(selectedAgency.toLowerCase());
    return matchPhase && matchAgency;
  });

  const completedCount = actions.filter((a) => a.status === "COMPLETED").length;
  const inProgressCount = actions.filter((a) => a.status === "IN_PROGRESS").length;
  const pendingCount = actions.filter((a) => a.status === "PENDING").length;
  const overallPct = Math.round((completedCount / actions.length) * 100);

  return (
    <div className="space-y-4">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-code flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Bar with Apple Glass Styling & ML Model Engine Badge */}
      <div className="apple-card p-4.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">shield</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#0A2540] font-heading tracking-tight">
                Anticipatory Action Standard Operating Protocols (SOP)
              </h1>
              <span className="bg-red-50 text-red-700 border border-red-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                T-MINUS 12h 15m TO LANDFALL
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                VERTEX AI TRIGGER MODEL V3.1
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated trigger-based early action matrix adhering to NDMA, IMD, and WMO Early Warnings for All guidelines.
            </p>
          </div>
        </div>

        {/* Action Controls & Dispatch */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={triggerAutomatedBatch}
            className="apple-press bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sync ML Triggers</span>
          </button>

          {/* SOP Overall Progress Pill */}
          <div className="apple-card px-3.5 py-2 flex items-center gap-3 bg-slate-50/80">
            <div className="w-32">
              <div className="flex justify-between text-[11px] font-code text-slate-500 mb-1">
                <span>COMPLETION</span>
                <span className="font-bold text-blue-700">{overallPct}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>
            <div className="text-xs font-code font-bold text-slate-700">
              {completedCount}/{actions.length} Done
            </div>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Telemetry Trigger Indicators Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="apple-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-code uppercase tracking-wider block">
              GALE WIND TRIGGER
            </span>
            <div className="text-lg font-bold text-[#0A2540] font-heading mt-0.5">
              98 <span className="text-xs font-medium text-slate-500">km/h</span>
            </div>
            <span className="text-[10px] text-red-600 font-code font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
              Threshold (&gt;65 km/h) Exceeded
            </span>
          </div>
          <span className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs border border-red-200">
            !
          </span>
        </div>

        <div className="apple-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-code uppercase tracking-wider block">
              STORM SURGE DEPTH
            </span>
            <div className="text-lg font-bold text-[#0A2540] font-heading mt-0.5">
              +1.6 <span className="text-xs font-medium text-slate-500">meters MSL</span>
            </div>
            <span className="text-[10px] text-red-600 font-code font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
              Threshold (&gt;1.2m) Exceeded
            </span>
          </div>
          <span className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs border border-red-200">
            !
          </span>
        </div>

        <div className="apple-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-code uppercase tracking-wider block">
              ML TRACK CERTAINTY
            </span>
            <div className="text-lg font-bold text-emerald-700 font-heading mt-0.5">
              94.8% <span className="text-xs font-medium text-slate-500">Confidence</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-code font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[12px]">verified</span>
              Vertex AI Ensemble Model
            </span>
          </div>
          <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
            ✓
          </span>
        </div>

        <div className="apple-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 font-code uppercase tracking-wider block">
              LEAD TIME GAIN
            </span>
            <div className="text-lg font-bold text-blue-700 font-heading mt-0.5">
              +14.5 <span className="text-xs font-medium text-slate-500">hours</span>
            </div>
            <span className="text-[10px] text-blue-700 font-code font-semibold flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              Vs Reactive Emergency Action
            </span>
          </div>
          <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
            ⏳
          </span>
        </div>
      </div>

      {/* 3. Filter Navigation Strip */}
      <div className="apple-card p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-400 font-code mr-1">ACTION WINDOW:</span>
          {["all", "T-36h", "T-24h", "T-12h", "T-0h"].map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setSelectedPhase(phase)}
              className={`apple-press px-3 py-1.5 rounded-xl font-bold font-code transition-all ${
                selectedPhase === phase
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {phase === "all" ? "All Windows" : phase}
            </button>
          ))}
        </div>

        {/* Agency Quick Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400 font-code text-[11px]">AGENCY:</span>
          <select
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="bg-slate-100 text-slate-700 text-xs font-code rounded-lg px-2.5 py-1 border border-slate-200 outline-none"
          >
            <option value="all">All Lead Agencies</option>
            <option value="fisheries">Fisheries & Coast Guard</option>
            <option value="revenue">Revenue & Disaster Dept</option>
            <option value="collectorate">District Collectorates / Police</option>
            <option value="ndrf">NDRF / SDRF</option>
            <option value="aptransco">APTRANSCO Power Grid</option>
            <option value="supplies">Civil Supplies & Health</option>
          </select>
        </div>
      </div>

      {/* 4. SOP Action Items Grid */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="apple-card p-4 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-slate-100 text-slate-700 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {item.phase}
                </span>
                <h2 className="font-heading font-bold text-xs text-[#0A2540] tracking-tight">
                  {item.title}
                </h2>
                <span
                  className={`text-[10px] font-bold font-code px-2 py-0.5 rounded-full border ${
                    item.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : item.status === "IN_PROGRESS"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {item.status.replace("_", " ")}
                </span>
                {item.isTriggerMet && (
                  <span className="text-[10px] font-bold font-code px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    TRIGGER ACTIVE
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

              {/* Real-time Telemetry & Trigger Verification */}
              <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-code pt-1">
                <span className="text-slate-400">
                  Lead Agency: <strong className="text-slate-700">{item.leadAgency}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/50">
                  Telemetry: <strong>{item.currentTelemetryValue}</strong> (Trigger: {item.triggerThreshold})
                </span>
              </div>
            </div>

            {/* Progress and status toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-28 text-right hidden sm:block">
                <span className="text-[11px] font-code text-slate-500 font-bold block mb-1">
                  {item.progressPct}% Executed
                </span>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      item.status === "COMPLETED" ? "bg-emerald-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${item.progressPct}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleActionStatus(item.id)}
                className={`apple-press px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  item.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {item.status === "COMPLETED" ? "check_circle" : "update"}
                </span>
                <span>{item.status === "COMPLETED" ? "Verified" : "Update Status"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
