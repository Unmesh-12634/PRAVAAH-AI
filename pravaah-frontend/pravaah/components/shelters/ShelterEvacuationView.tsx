"use client";

import React, { useState } from "react";

interface ShelterRecord {
  id: string;
  name: string;
  sector: string;
  district: string;
  capacity: number;
  occupied: number;
  demographics: {
    men: number;
    women: number;
    children: number;
    elderly: number;
  };
  lifelines: {
    generatorStatus: "ONLINE" | "STANDBY";
    waterPouchesCount: number;
    medicalOfficer: string;
    solarHighMast: boolean;
  };
  inundationRisk: "ELEVATED_SAFE" | "PERIPHERAL_RISK";
}

const INITIAL_SHELTERS: ShelterRecord[] = [
  {
    id: "mpcs-bap-01",
    name: "Bapatla Municipal Multipurpose Cyclone Shelter",
    sector: "Bapatla Town",
    district: "Bapatla",
    capacity: 2200,
    occupied: 1850,
    demographics: { men: 590, women: 710, children: 330, elderly: 220 },
    lifelines: {
      generatorStatus: "ONLINE",
      waterPouchesCount: 4500,
      medicalOfficer: "Dr. K. Srinivas (MBBS)",
      solarHighMast: true,
    },
    inundationRisk: "ELEVATED_SAFE",
  },
  {
    id: "mpcs-niz-04",
    name: "Nizampatnam Fishery Harbor Community Cyclone Hub",
    sector: "Nizampatnam Coast",
    district: "Bapatla",
    capacity: 3500,
    occupied: 3100,
    demographics: { men: 980, women: 1180, children: 560, elderly: 380 },
    lifelines: {
      generatorStatus: "ONLINE",
      waterPouchesCount: 8200,
      medicalOfficer: "Dr. P. Anitha (Medical Supt)",
      solarHighMast: true,
    },
    inundationRisk: "ELEVATED_SAFE",
  },
  {
    id: "mpcs-rep-02",
    name: "Repalle Government Junior College Cyclone Center",
    sector: "Repalle Mandal",
    district: "Bapatla",
    capacity: 1800,
    occupied: 1240,
    demographics: { men: 390, women: 470, children: 240, elderly: 140 },
    lifelines: {
      generatorStatus: "STANDBY",
      waterPouchesCount: 3200,
      medicalOfficer: "Dr. R. Madhav (Standby)",
      solarHighMast: true,
    },
    inundationRisk: "ELEVATED_SAFE",
  },
  {
    id: "mpcs-kav-01",
    name: "Kavali Coastal RCC Multi-Hazard Shelter #3",
    sector: "Kavali Sector",
    district: "SPSR Nellore",
    capacity: 2800,
    occupied: 2450,
    demographics: { men: 780, women: 930, children: 440, elderly: 300 },
    lifelines: {
      generatorStatus: "ONLINE",
      waterPouchesCount: 6500,
      medicalOfficer: "Dr. B. Ramanathan (CHC Kavali)",
      solarHighMast: true,
    },
    inundationRisk: "ELEVATED_SAFE",
  },
  {
    id: "mpcs-ong-05",
    name: "Ongole RIMS Auxiliary Emergency Shelter",
    sector: "Ongole Coastal",
    district: "Prakasam",
    capacity: 1500,
    occupied: 890,
    demographics: { men: 280, women: 340, children: 160, elderly: 110 },
    lifelines: {
      generatorStatus: "ONLINE",
      waterPouchesCount: 4000,
      medicalOfficer: "Dr. S. Deepa (ICU Specialist)",
      solarHighMast: true,
    },
    inundationRisk: "ELEVATED_SAFE",
  },
  {
    id: "mpcs-chi-03",
    name: "Chirala Handloom Cluster Cyclone Shelter",
    sector: "Chirala Mandal",
    district: "Bapatla",
    capacity: 2000,
    occupied: 1420,
    demographics: { men: 450, women: 540, children: 260, elderly: 170 },
    lifelines: {
      generatorStatus: "ONLINE",
      waterPouchesCount: 5100,
      medicalOfficer: "Dr. V. Prasad (Civil Assistant)",
      solarHighMast: true,
    },
    inundationRisk: "ELEVATED_SAFE",
  },
];

const SECTORS = [
  "All Sectors",
  "Nizampatnam Coast",
  "Bapatla Town",
  "Repalle Mandal",
  "Kavali Sector",
  "Ongole Coastal",
  "Chirala Mandal",
];

export default function ShelterEvacuationView() {
  const [shelters, setShelters] = useState<ShelterRecord[]>(INITIAL_SHELTERS);
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sector Message Dispatch state
  const [targetSector, setTargetSector] = useState<string>("Nizampatnam Coast");
  const [msgType, setMsgType] = useState<"EVAC_FINAL" | "SURGE_ALERT" | "RATIONS_DELIVERED">("EVAC_FINAL");
  const [isSendingMsg, setIsSendingMsg] = useState<boolean>(false);
  const [sentCount, setSentCount] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredShelters =
    selectedSector === "All Sectors"
      ? shelters
      : shelters.filter((s) => s.sector === selectedSector);

  // Aggregate stats
  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.occupied, 0);
  const totalLeft = totalCapacity - totalOccupied;
  const overallOccupancyPct = Math.round((totalOccupied / totalCapacity) * 100);

  // Demographics aggregate
  const totalMen = shelters.reduce((acc, s) => acc + s.demographics.men, 0);
  const totalWomen = shelters.reduce((acc, s) => acc + s.demographics.women, 0);
  const totalChildren = shelters.reduce((acc, s) => acc + s.demographics.children, 0);
  const totalElderly = shelters.reduce((acc, s) => acc + s.demographics.elderly, 0);

  const handleSendSectorMessage = () => {
    setIsSendingMsg(true);
    let count = 0;
    const interval = setInterval(() => {
      count += 2400;
      if (count >= 18400) {
        clearInterval(interval);
        setSentCount(18400);
        setIsSendingMsg(false);
        showToast(`Targeted broadcast dispatched to 18,400 residents in ${targetSector}!`);
      } else {
        setSentCount(count);
      }
    }, 100);
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

      {/* 1. Header with Apple Glass Styling & Summary */}
      <div className="apple-card p-4.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">holiday_village</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#0A2540] font-heading tracking-tight">
                Shelter Management &amp; Evacuee Headcount Operations Center
              </h1>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                214 MULTIPURPOSE SHELTERS LIVE
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                NDMA CADASTRAL REGISTRY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live shelter occupancy tracking, vacant slot computation, demographic breakdown, and sector-wise targeted emergency messaging.
            </p>
          </div>
        </div>

        {/* Global Occupancy Pill */}
        <div className="apple-card px-4 py-2 flex items-center gap-3 bg-slate-50/90 border border-slate-200/80">
          <div className="w-36">
            <div className="flex justify-between text-[11px] font-code text-slate-500 mb-1">
              <span>OCCUPANCY</span>
              <span className="font-bold text-blue-700">{overallOccupancyPct}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallOccupancyPct}%` }}
              />
            </div>
          </div>
          <div className="text-right font-code">
            <span className="text-sm font-extrabold text-[#0A2540] block leading-none">
              {totalOccupied.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-400">of {totalCapacity.toLocaleString("en-IN")} slots</span>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (Capacity, Occupied, Left, Special Care) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            TOTAL SHELTER CAPACITY
          </span>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-[#0A2540] font-heading tracking-tight">
              {totalCapacity.toLocaleString("en-IN")} <span className="text-sm font-semibold text-slate-500">Slots</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Across 6 Coastal Mandals</p>
          </div>
          <span className="text-[10px] font-code text-blue-700 font-semibold bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md w-fit">
            RCC Elevated Cyclone Shelters
          </span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            CURRENTLY OCCUPIED
          </span>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-blue-700 font-heading tracking-tight">
              {totalOccupied.toLocaleString("en-IN")} <span className="text-sm font-semibold text-slate-500">Pax</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Verified via biometric intake</p>
          </div>
          <span className="text-[10px] font-code text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md w-fit">
            78.3% Target Evacuated
          </span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            REMAINING / VACANT SLOTS
          </span>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-emerald-700 font-heading tracking-tight">
              {totalLeft.toLocaleString("en-IN")} <span className="text-sm font-semibold text-slate-500">Available</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Ready for zero-hour surge intake</p>
          </div>
          <span className="text-[10px] font-code text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md w-fit">
            Buffer Reserve Intact
          </span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            PEOPLE DEMOGRAPHIC RECORDS
          </span>
          <div className="my-2">
            <div className="text-xs font-code space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Women &amp; Girls:</span>
                <strong className="text-slate-800">{totalWomen.toLocaleString("en-IN")}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Men &amp; Boys:</span>
                <strong className="text-slate-800">{totalMen.toLocaleString("en-IN")}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Infants &amp; Children:</span>
                <strong className="text-slate-800">{totalChildren.toLocaleString("en-IN")}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 font-bold">Elderly &amp; Infirm:</span>
                <strong className="text-red-700">{totalElderly.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-code text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md w-fit">
            Medical Officers Onsite
          </span>
        </div>
      </div>

      {/* 3. Main Operational Deck: Shelter Table (Left 7 Cols) + Sector Messaging (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Shelter Records Table (Span 7) */}
        <div className="lg:col-span-7 apple-card p-4 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">list_alt</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-code">
                Coastal Multipurpose Cyclone Shelter Registry
              </h2>
            </div>

            {/* Sector Filter */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-code outline-none text-slate-700"
            >
              {SECTORS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-code text-[11px]">
                  <th className="pb-2 font-bold">SHELTER NAME</th>
                  <th className="pb-2 font-bold">SECTOR</th>
                  <th className="pb-2 font-bold">CAPACITY</th>
                  <th className="pb-2 font-bold">OCCUPIED</th>
                  <th className="pb-2 font-bold">LEFT</th>
                  <th className="pb-2 font-bold text-right">LIFELINE STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-code">
                {filteredShelters.map((s) => {
                  const left = s.capacity - s.occupied;
                  const pct = Math.round((s.occupied / s.capacity) * 100);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 pr-2">
                        <span className="font-bold text-slate-800 block truncate max-w-[200px] font-heading">
                          {s.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {s.district} · MO: {s.lifelines.medicalOfficer}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600 font-medium">{s.sector}</td>
                      <td className="py-2.5 text-slate-600 font-bold">{s.capacity.toLocaleString()}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-700">{s.occupied.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400">({pct}%)</span>
                        </div>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${pct > 85 ? "bg-red-500" : "bg-blue-600"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {left.toLocaleString()} Left
                        </span>
                      </td>
                      <td className="py-2.5 text-right space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 block w-fit ml-auto">
                          DG: {s.lifelines.generatorStatus}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {s.lifelines.waterPouchesCount.toLocaleString()} Water Pouches
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector-Wise Targeted Emergency Messaging Deck (Span 5) */}
        <div className="lg:col-span-5 apple-card p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px]">cell_tower</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-code">
                Sector-Wise Emergency Messaging
              </h2>
            </div>
            <span className="text-[10px] font-code text-red-600 bg-red-50 px-2 py-0.5 rounded font-bold border border-red-200">
              TARGETED BROADCAST
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Target Sector Selection */}
            <div>
              <label className="text-[10px] font-bold font-code text-slate-500 uppercase block mb-1">
                Target Coastal Sector / Mandal
              </label>
              <select
                value={targetSector}
                onChange={(e) => setTargetSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-code outline-none text-slate-800 font-bold"
              >
                {SECTORS.filter((s) => s !== "All Sectors").map((s) => (
                  <option key={s} value={s}>
                    {s} (Coastal Swath)
                  </option>
                ))}
              </select>
            </div>

            {/* Message Template Type */}
            <div>
              <label className="text-[10px] font-bold font-code text-slate-500 uppercase block mb-1">
                Advisory Protocol Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-code">
                {[
                  { id: "EVAC_FINAL", label: "Final Evac" },
                  { id: "SURGE_ALERT", label: "Surge Alert" },
                  { id: "RATIONS_DELIVERED", label: "Rations Log" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setMsgType(t.id as any)}
                    className={`py-1.5 px-2 rounded-lg font-bold border transition text-center ${
                      msgType === t.id
                        ? "bg-blue-600 text-white border-blue-700 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Bilingual Message Preview */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-[11px] font-sans">
              <span className="text-[10px] font-bold font-code text-slate-400 uppercase block">
                BROADCAST TEXT PREVIEW (ENGLISH + TELUGU):
              </span>
              <p className="text-slate-800 leading-snug">
                {msgType === "EVAC_FINAL" && (
                  <>
                    <strong>[EMERGENCY DIRECTIVE - {targetSector}]:</strong> Cyclone Michaung storm surge will cross coast in T-6h. Mandatory evacuation of all kutcha houses within 3km of shore. Report immediately to designated RCC Multipurpose Shelter. Hot meals, clean water, and medical care available. Call 1070 for boat pickup.
                    <br />
                    <span className="text-blue-900 mt-1 block font-medium">
                      [తెలుగు]: ఆంధ్రప్రదేశ్ విపత్తు హెచ్చరిక: రాబోయే 6 గంటల్లో తుఫాను తీరం దాటనుంది. తీరప్రాంత ప్రజలు తక్షణమే పునరావాస కేంద్రాలకు చేరుకోవాలి. ఆహారం మరియు వైద్య సహాయం అందుబాటులో ఉన్నాయి.
                    </span>
                  </>
                )}
                {msgType === "SURGE_ALERT" && (
                  <>
                    <strong>[STORM SURGE PEAK WARNING - {targetSector}]:</strong> Inundation depth of +1.8m MSL expected coinciding with 16:15 high tide. Coastal roads and culverts barricaded. Stay indoors on elevated floors.
                    <br />
                    <span className="text-blue-900 mt-1 block font-medium">
                      [తెలుగు]: తీవ్ర సముద్ర ఆటుపోట్ల హెచ్చరిక: సముద్రం ముందుకు చొచ్చుకువచ్చే ప్రమాదం ఉంది. లోతట్టు రోడ్లపై ప్రయాణం నిషేధించబడింది.
                    </span>
                  </>
                )}
                {msgType === "RATIONS_DELIVERED" && (
                  <>
                    <strong>[RELIEF LOGISTICS NOTICE - {targetSector}]:</strong> 15,000 drinking water pouches and 72h dry food rations successfully stocked at all operational shelters in this sector.
                    <br />
                    <span className="text-blue-900 mt-1 block font-medium">
                      [తెలుగు]: సహాయక సామగ్రి నివేదిక: తాగునీరు మరియు రేషన్ అన్ని పునరావాస కేంద్రాలకు చేరింది.
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Dispatch Action */}
            <button
              type="button"
              onClick={handleSendSectorMessage}
              disabled={isSendingMsg}
              className={`apple-press w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ${
                isSendingMsg
                  ? "bg-amber-600 text-white animate-pulse"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {isSendingMsg ? "cell_tower" : "emergency_share"}
              </span>
              <span>
                {isSendingMsg
                  ? `Dispatching to ${sentCount.toLocaleString("en-IN")} Subscribers in ${targetSector}...`
                  : `Send Targeted Alert to ${targetSector}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
