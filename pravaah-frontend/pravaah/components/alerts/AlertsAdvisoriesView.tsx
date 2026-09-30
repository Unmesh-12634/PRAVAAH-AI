"use client";

import React, { useState } from "react";

interface AlertBulletin {
  id: string;
  severity: "RED" | "ORANGE" | "YELLOW";
  headline: string;
  source: string;
  districts: string[];
  issuedAt: string;
  validUntil: string;
  body: string;
  bodyTelugu: string;
  actionRequired: string;
  deliveryStats: {
    handsetsReached: string;
    deliveryRate: string;
    sirenTowersActive: number;
  };
}

const INITIAL_BULLETINS: AlertBulletin[] = [
  {
    id: "cap-001",
    severity: "RED",
    headline: "FLASH FLOOD & STORM SURGE RED ALERT — MANDATORY EVACUATION",
    source: "IMD / NDMA Multi-Hazard Early Warning Network",
    districts: ["Bapatla", "SPSR Nellore", "Prakasam"],
    issuedAt: "04 DEC 05:30 IST",
    validUntil: "05 DEC 18:00 IST",
    body: "Extremely heavy rainfall (>200 mm) accompanied by storm surge inundation up to +1.8m MSL expected in coastal lowlands. Gale wind speed 100-110 km/h gusting to 125 km/h. Sea conditions phenomenally rough.",
    bodyTelugu: "తీవ్ర తుఫాను ప్రభావంతో భారీ వర్షాలు మరియు తీరప్రాంతాల్లో 1.8 మీటర్ల వరకు సముద్ర ఆటుపోట్లు ముంచెత్తే అవకాశం ఉంది. పెనుగాలుల వేగం గంటకు 110-125 కి.మీ. తీరప్రాంత ప్రజలు తక్షణమే సురక్షిత ప్రాంతాలకు వెళ్లాలి.",
    actionRequired: "Total suspension of all maritime fishing; evacuation of all kutcha houses within 5km of shoreline mandatory.",
    deliveryStats: {
      handsetsReached: "1,248,300",
      deliveryRate: "99.4%",
      sirenTowersActive: 124,
    },
  },
  {
    id: "cap-002",
    severity: "ORANGE",
    headline: "HIGH HYDRAULIC DISCHARGE & RIVERINE WATERLOGGING ALERT",
    source: "Central Water Commission (CWC)",
    districts: ["Krishna", "Guntur", "Tirupati"],
    issuedAt: "04 DEC 04:00 IST",
    validUntil: "05 DEC 20:00 IST",
    body: "Pennar and Krishna basin tributaries rising rapidly. Controlled outflow from Somasila and Prakasam Barrage initiated. Riverbanks under inundation threat.",
    bodyTelugu: "కృష్ణా మరియు పెన్నా నదీ పరివాహక ప్రాంతాల్లో నీటిమట్టం వేగంగా పెరుగుతోంది. ప్రకాశం బ్యారేజ్ నుండి నీరు విడుదల. లోతట్టు ప్రాంతాల ప్రజలు అప్రమత్తంగా ఉండాలి.",
    actionRequired: "Pre-position NDRF deep-diving units at key barrages; barricade low causeways and culverts against civilian traffic.",
    deliveryStats: {
      handsetsReached: "840,200",
      deliveryRate: "98.7%",
      sirenTowersActive: 78,
    },
  },
  {
    id: "cap-003",
    severity: "YELLOW",
    headline: "PORT DANGER SIGNAL 10 HOISTED AT KRISHNAPATNAM & MACHILIPATNAM",
    source: "Mercantile Marine Dept / Port Authority",
    districts: ["SPSR Nellore", "Krishna"],
    issuedAt: "04 DEC 02:00 IST",
    validUntil: "05 DEC 23:59 IST",
    body: "Severe cyclonic vortex will cross coast near or over the port. Ships ordered to open sea for safe anchoring; harbor gantries and cranes locked down.",
    bodyTelugu: "కృష్ణపట్నం మరియు మచిలీపట్నం పోర్టులలో 10వ నంబర్ ప్రమాద హెచ్చరిక జారీ. ఓడలను సురక్షిత ప్రాంతాలకు తరలించడం జరిగింది.",
    actionRequired: "All dock workers evacuated to permanent RCC shelters; hazmat fuel storage tanks sealed and grounded.",
    deliveryStats: {
      handsetsReached: "312,000",
      deliveryRate: "99.1%",
      sirenTowersActive: 42,
    },
  },
];

export default function AlertsAdvisoriesView() {
  const [bulletins, setBulletins] = useState<AlertBulletin[]>(INITIAL_BULLETINS);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [showTelugu, setShowTelugu] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchCount, setDispatchCount] = useState<number>(1248300);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Alert Composer state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSeverity, setNewSeverity] = useState<"RED" | "ORANGE" | "YELLOW">("RED");
  const [newDistrict, setNewDistrict] = useState("Bapatla");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendCellBroadcast = () => {
    setIsDispatching(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 150000;
      if (current >= 1248300) {
        clearInterval(interval);
        setDispatchCount(1248300);
        setIsDispatching(false);
        showToast("Cell Broadcast successfully acknowledged by 1,248,300 devices (99.4% receipt rate)");
      } else {
        setDispatchCount(current);
      }
    }, 120);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBulletin: AlertBulletin = {
      id: `cap-${Date.now()}`,
      severity: newSeverity,
      headline: newTitle.toUpperCase(),
      source: "State Emergency Operations Center (SEOC)",
      districts: [newDistrict],
      issuedAt: "JUST NOW",
      validUntil: "NEXT 24 HOURS",
      body: `Urgent weather advisory issued for ${newDistrict} district due to cyclone intensification. Follow official instructions and heed local shelter wardens.`,
      bodyTelugu: `${newDistrict} జిల్లా కోసం అత్యవసర వాతావరణ హెచ్చరిక జారీ చేయబడింది. ప్రజలు అప్రమత్తంగా ఉండాలి.`,
      actionRequired: "Evacuation of low-lying settlements and activation of local village disaster task force.",
      deliveryStats: {
        handsetsReached: "350,000",
        deliveryRate: "99.2%",
        sirenTowersActive: 28,
      },
    };

    setBulletins([newBulletin, ...bulletins]);
    setIsComposerOpen(false);
    setNewTitle("");
    showToast(`New ${newSeverity} Alert broadcasted to ${newDistrict}!`);
  };

  const filtered =
    filterSeverity === "all" ? bulletins : bulletins.filter((b) => b.severity === filterSeverity);

  return (
    <div className="space-y-4">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-code flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Bar with Apple Glass Styling & Quick Dispatch */}
      <div className="apple-card p-4.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center border border-red-200/60 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">campaign</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#0A2540] font-heading tracking-tight">
                Common Alerting Protocol (CAP) & Emergency Multi-Channel Broadcast
              </h1>
              <span className="bg-red-50 text-red-700 border border-red-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                NDMA SACHET PLATFORM SYNCED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-hazard geospatial broadcast engine linked with telecom carriers (C-DoT), electronic coastal sirens, and WhatsApp.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowTelugu(!showTelugu)}
            className="apple-press px-3 py-2 rounded-xl text-xs font-bold font-code bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            {showTelugu ? "Language: తెలుగు" : "Language: English"}
          </button>

          <button
            type="button"
            onClick={() => setIsComposerOpen(true)}
            className="apple-press px-3.5 py-2 rounded-xl text-xs font-bold font-heading bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>Compose Alert</span>
          </button>

          {/* Emergency Cell Broadcast Button */}
          <button
            type="button"
            onClick={handleSendCellBroadcast}
            disabled={isDispatching}
            className={`apple-press px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
              isDispatching
                ? "bg-amber-600 text-white animate-pulse"
                : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              {isDispatching ? "cell_tower" : "emergency_share"}
            </span>
            <span>
              {isDispatching
                ? `Disseminating: ${dispatchCount.toLocaleString("en-IN")} Handsets...`
                : "Push Emergency Cell Broadcast"}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Multi-Channel Dissemination Network Status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="apple-card p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold font-code uppercase">CELL BROADCAST</span>
            <span className="material-symbols-outlined text-[16px] text-blue-600">smartphone</span>
          </div>
          <div className="my-1.5">
            <div className="text-base font-extrabold text-[#0A2540] font-heading">1.24M</div>
            <span className="text-[10px] text-emerald-600 font-code font-bold">99.4% Delivered</span>
          </div>
          <span className="text-[9px] font-code text-slate-400">C-DoT Geo-Fenced 4G/5G</span>
        </div>

        <div className="apple-card p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold font-code uppercase">COASTAL SIRENS</span>
            <span className="material-symbols-outlined text-[16px] text-red-600">volume_up</span>
          </div>
          <div className="my-1.5">
            <div className="text-base font-extrabold text-[#0A2540] font-heading">124 / 124</div>
            <span className="text-[10px] text-emerald-600 font-code font-bold">100% Armed</span>
          </div>
          <span className="text-[9px] font-code text-slate-400">135dB Electronic Array</span>
        </div>

        <div className="apple-card p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold font-code uppercase">FM RADIO & EAS</span>
            <span className="material-symbols-outlined text-[16px] text-amber-600">radio</span>
          </div>
          <div className="my-1.5">
            <div className="text-base font-extrabold text-[#0A2540] font-heading">18 Stations</div>
            <span className="text-[10px] text-emerald-600 font-code font-bold">Interrupt Active</span>
          </div>
          <span className="text-[9px] font-code text-slate-400">All India Radio & FM</span>
        </div>

        <div className="apple-card p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold font-code uppercase">VILLAGE VOLUNTEERS</span>
            <span className="material-symbols-outlined text-[16px] text-emerald-600">groups</span>
          </div>
          <div className="my-1.5">
            <div className="text-base font-extrabold text-[#0A2540] font-heading">320,000</div>
            <span className="text-[10px] text-emerald-600 font-code font-bold">WhatsApp Push</span>
          </div>
          <span className="text-[9px] font-code text-slate-400">Grama Sachivalayam</span>
        </div>

        <div className="apple-card p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold font-code uppercase">MARINE VHF CH 16</span>
            <span className="material-symbols-outlined text-[16px] text-cyan-600">sailing</span>
          </div>
          <div className="my-1.5">
            <div className="text-base font-extrabold text-[#0A2540] font-heading">156.8 MHz</div>
            <span className="text-[10px] text-cyan-800 font-code font-bold">Continuous Loop</span>
          </div>
          <span className="text-[9px] font-code text-slate-400">Coast Guard Net</span>
        </div>
      </div>

      {/* 3. Composer Modal (if open) */}
      {isComposerOpen && (
        <div className="apple-card p-4.5 bg-blue-50/50 border-blue-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
            <span className="font-heading font-bold text-xs text-[#0A2540] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-blue-600">notification_add</span>
              Compose New CAP Emergency Alert
            </span>
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <form onSubmit={handleCreateAlert} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold font-code text-slate-500 uppercase block mb-1">
                  Severity Level
                </label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-code outline-none"
                >
                  <option value="RED">RED (Extreme Threat to Life)</option>
                  <option value="ORANGE">ORANGE (Severe Preparedness)</option>
                  <option value="YELLOW">YELLOW (Marine & Wind Advisory)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold font-code text-slate-500 uppercase block mb-1">
                  Target Coastal District
                </label>
                <select
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-code outline-none"
                >
                  <option value="Bapatla">Bapatla Coastal Mandal Swath</option>
                  <option value="SPSR Nellore">SPSR Nellore Harbor & Coast</option>
                  <option value="Prakasam">Prakasam / Ongole Coastal Belt</option>
                  <option value="Krishna">Krishna Estuary & Machilipatnam</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold font-code text-slate-500 uppercase block mb-1">
                  Alert Title Headline
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. FLASH INUNDATION SURGE EVACUATION"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="apple-press px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Broadcast Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Filter Severity Tabs */}
      <div className="flex flex-wrap items-center gap-2 apple-card p-3 text-xs">
        <span className="font-bold text-slate-400 font-code mr-1">FILTER SEVERITY:</span>
        {["all", "RED", "ORANGE", "YELLOW"].map((sev) => (
          <button
            key={sev}
            type="button"
            onClick={() => setFilterSeverity(sev)}
            className={`apple-press px-3.5 py-1.5 rounded-xl font-bold font-code transition-all ${
              filterSeverity === sev
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            {sev === "all" ? "All Warnings" : `${sev} ALERT`}
          </button>
        ))}

        <div className="ml-auto text-xs font-code text-slate-400 hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CAP 1.2 PROTOCOL: ACTIVE DISSEMINATION GATEWAY</span>
        </div>
      </div>

      {/* 5. Bulletins Feed */}
      <div className="space-y-3">
        {filtered.map((b) => (
          <div
            key={b.id}
            className={`apple-card p-4 transition-all space-y-3 border-l-4 ${
              b.severity === "RED"
                ? "border-l-red-600 bg-red-50/15"
                : b.severity === "ORANGE"
                ? "border-l-amber-600 bg-amber-50/15"
                : "border-l-yellow-500 bg-yellow-50/15"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-code ${
                    b.severity === "RED"
                      ? "bg-red-600 text-white"
                      : b.severity === "ORANGE"
                      ? "bg-amber-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {b.severity} ALERT
                </span>
                <h2 className="font-heading font-bold text-xs text-[#0A2540] tracking-tight">
                  {b.headline}
                </h2>
              </div>

              <div className="text-[11px] font-code text-slate-500">
                Issued: <strong className="text-slate-700">{b.issuedAt}</strong> · Valid Until: {b.validUntil}
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {showTelugu ? b.bodyTelugu : b.body}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-200/60 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-code text-slate-400">Target Districts:</span>
                <div className="flex gap-1 flex-wrap">
                  {b.districts.map((d) => (
                    <span
                      key={d}
                      className="bg-slate-100 border border-slate-200 text-slate-700 font-code font-bold text-[10px] px-2 py-0.5 rounded-md"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery Receipt telemetry pill */}
              <div className="flex items-center gap-3 font-code text-[11px] text-slate-500">
                <span>Receipt: <strong className="text-emerald-700">{b.deliveryStats.handsetsReached}</strong></span>
                <span>•</span>
                <span>Rate: <strong className="text-emerald-700">{b.deliveryStats.deliveryRate}</strong></span>
              </div>
            </div>

            <div className="text-[11px] font-code text-red-700 font-semibold bg-red-50 border border-red-200/80 px-3 py-1 rounded-xl w-fit">
              MANDATORY DIRECTIVE: {b.actionRequired}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
