"use client";

import React, { useState } from "react";

interface InfraAsset {
  id: string;
  name: string;
  type: "substation" | "hospital" | "port" | "bridge" | "telecom";
  district: string;
  elevation: string;
  inundationRisk: "CRITICAL" | "HIGH" | "MODERATE";
  surgeDepth: string;
  operationalStatus: "ONLINE" | "STANDBY_GEN" | "ISOLATED";
  actionRequired: string;
  telemetry: {
    voltageOrCapacity: string;
    fuelBuffer: string;
    scadaStatus: string;
  };
}

const INFRA_ASSETS: InfraAsset[] = [
  {
    id: "sub-01",
    name: "Nellore South 220kV Grid Substation",
    type: "substation",
    district: "SPSR Nellore",
    elevation: "2.1m MSL",
    inundationRisk: "CRITICAL",
    surgeDepth: "+1.6m surge water expected",
    operationalStatus: "ONLINE",
    actionRequired: "Deploy de-watering pumps & sandbag transformer perimeter",
    telemetry: {
      voltageOrCapacity: "220 kV / 180 MVA",
      fuelBuffer: "48h DG Standby",
      scadaStatus: "TELEMETRY LINK NORMAL",
    },
  },
  {
    id: "sub-02",
    name: "Bapatla 132kV Coastal Feeder",
    type: "substation",
    district: "Bapatla",
    elevation: "1.8m MSL",
    inundationRisk: "CRITICAL",
    surgeDepth: "+1.8m direct storm surge",
    operationalStatus: "STANDBY_GEN",
    actionRequired: "Controlled grid islanding to prevent cascading blowout",
    telemetry: {
      voltageOrCapacity: "132 kV / 65 MVA",
      fuelBuffer: "Elevated Plinth 1.2m",
      scadaStatus: "ISLANDING IN PROGRESS",
    },
  },
  {
    id: "hosp-01",
    name: "Ongole District Government Hospital (RIMS)",
    type: "hospital",
    district: "Prakasam",
    elevation: "4.5m MSL",
    inundationRisk: "MODERATE",
    surgeDepth: "+0.4m peripheral run-off",
    operationalStatus: "ONLINE",
    actionRequired: "Verify 96-hour ICU liquid medical oxygen & dual gensets",
    telemetry: {
      voltageOrCapacity: "450 Beds / 42 ICU",
      fuelBuffer: "96h LMO Buffer Full",
      scadaStatus: "ALL LIFELINES NORMAL",
    },
  },
  {
    id: "port-01",
    name: "Krishnapatnam Deepwater Cargo Port",
    type: "port",
    district: "SPSR Nellore",
    elevation: "1.2m MSL",
    inundationRisk: "CRITICAL",
    surgeDepth: "+2.2m wave breaking surge",
    operationalStatus: "ISOLATED",
    actionRequired: "Berth cranes locked down; all cargo vessels anchored offshore",
    telemetry: {
      voltageOrCapacity: "12 Deep Berths",
      fuelBuffer: "Hazmat Tanks Sealed",
      scadaStatus: "DANGER SIGNAL 10",
    },
  },
  {
    id: "brg-01",
    name: "Pennar River Estuary Highway Bridge (NH-16)",
    type: "bridge",
    district: "SPSR Nellore",
    elevation: "3.2m MSL",
    inundationRisk: "HIGH",
    surgeDepth: "High hydraulic scour risk",
    operationalStatus: "ONLINE",
    actionRequired: "Restricted heavy truck transit; acoustic scour sensors armed",
    telemetry: {
      voltageOrCapacity: "6-Lane Highway",
      fuelBuffer: "Scour Level: 1.1m (Safe < 2.5m)",
      scadaStatus: "STRUCTURAL SENSOR ONLINE",
    },
  },
  {
    id: "tel-01",
    name: "Coastal VHF/UHF Emergency Radio Mast",
    type: "telecom",
    district: "Bapatla",
    elevation: "3.8m MSL",
    inundationRisk: "HIGH",
    surgeDepth: "Gale force gusts > 115 km/h",
    operationalStatus: "ONLINE",
    actionRequired: "Switch to satellite Ku-band telemetry uplink",
    telemetry: {
      voltageOrCapacity: "156.8 MHz Marine",
      fuelBuffer: "Solar + 72h Battery",
      scadaStatus: "SATELLITE BACKUP ARMED",
    },
  },
];

export default function InfrastructureView() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [actionDone, setActionDone] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredAssets = INFRA_ASSETS.filter((asset) => {
    if (filterType !== "all" && asset.type !== filterType) return false;
    if (filterRisk !== "all" && asset.inundationRisk !== filterRisk) return false;
    return true;
  });

  const handleExecuteAction = (id: string, name: string) => {
    setActionDone((prev) => ({ ...prev, [id]: true }));
    showToast(`Hardening directive deployed: ${name}`);
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

      {/* 1. Header Bar with Apple Glass Styling */}
      <div className="apple-card p-4.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">domain</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#0A2540] font-heading tracking-tight">
                Critical Infrastructure Exposure &amp; Hardening Array
              </h1>
              <span className="bg-red-50 text-red-700 border border-red-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                3 CRITICAL ASSETS AT RISK
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                SCADA TELEMETRY SYNCHRONIZED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Geospatial vulnerability audit for power grids, healthcare hospitals, deepwater ports, and national highway bridges.
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2.5">
          <div className="apple-card px-3.5 py-2 bg-red-50/50 border-red-200 text-xs font-code">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">CRITICAL EXPOSURE</span>
            <span className="font-extrabold text-red-700 text-sm">3 Substations / Ports</span>
          </div>
          <div className="apple-card px-3.5 py-2 bg-emerald-50/50 border-emerald-200 text-xs font-code">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">DEFENSE DEPLOYED</span>
            <span className="font-extrabold text-emerald-700 text-sm">82% Hardened</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="apple-card p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-400 font-code mr-1">ASSET TYPE:</span>
          {[
            { id: "all", label: "All Assets" },
            { id: "substation", label: "Substations" },
            { id: "hospital", label: "Hospitals" },
            { id: "port", label: "Ports" },
            { id: "bridge", label: "Bridges" },
            { id: "telecom", label: "Telecom" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterType(item.id)}
              className={`apple-press px-3 py-1.5 rounded-xl font-bold font-code transition-all ${
                filterType === item.id
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400 font-code text-[11px]">RISK:</span>
          {["all", "CRITICAL", "HIGH", "MODERATE"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilterRisk(r)}
              className={`apple-press px-2.5 py-1 rounded-lg text-[11px] font-bold font-code transition ${
                filterRisk === r
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Infrastructure Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredAssets.map((asset) => {
          const isDone = !!actionDone[asset.id];
          return (
            <div
              key={asset.id}
              className={`apple-card p-4 transition-all duration-200 flex flex-col justify-between space-y-3 border-l-4 ${
                asset.inundationRisk === "CRITICAL"
                  ? "border-l-red-600"
                  : asset.inundationRisk === "HIGH"
                  ? "border-l-amber-500"
                  : "border-l-blue-600"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold font-code text-slate-400 uppercase tracking-wider">
                    {asset.type} • {asset.district}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-code border ${
                      asset.inundationRisk === "CRITICAL"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : asset.inundationRisk === "HIGH"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    {asset.inundationRisk} RISK
                  </span>
                </div>

                <h2 className="font-heading font-bold text-sm text-[#0A2540] tracking-tight">
                  {asset.name}
                </h2>

                {/* Telemetry Strip */}
                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1 text-[11px] font-code text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Elevation:</span>
                    <span className="font-bold text-slate-800">{asset.elevation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Surge Inundation:</span>
                    <span className="font-bold text-red-600">{asset.surgeDepth}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400">Autonomy Buffer:</span>
                    <span className="font-bold text-emerald-700">{asset.telemetry.fuelBuffer}</span>
                  </div>
                </div>
              </div>

              {/* Action Directive & Trigger Button */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-[11px] text-slate-600 leading-snug">
                  <strong className="text-slate-700 block font-heading">Protocol Directive:</strong>
                  {asset.actionRequired}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-[10px] font-bold font-code px-2 py-0.5 rounded ${
                      asset.operationalStatus === "ONLINE"
                        ? "bg-emerald-50 text-emerald-800"
                        : asset.operationalStatus === "STANDBY_GEN"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {asset.operationalStatus}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleExecuteAction(asset.id, asset.name)}
                    className={`apple-press px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      isDone
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isDone ? "check_circle" : "shield"}
                    </span>
                    <span>{isDone ? "Verified Hardened" : "Deploy Hardening"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
