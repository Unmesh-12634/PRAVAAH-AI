"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface PolicyRecord {
  id: string;
  policyNo: string;
  farmerName: string;
  aadhaarHash: string;
  phone: string;
  village: string;
  mandal: string;
  district: string;
  cropSector: "Paddy (Rice)" | "Shrimp Aquaculture" | "Horticulture (Coconut/Banana)" | "Marine Fisheries" | "Salt Pan Production";
  surveyNo: string;
  lat: number;
  lng: number;
  insuredAreaHa: number;
  sumInsuredInr: number;
  inundationHours: number;
  measuredWindKmh: number;
  sarBackscatterDbChange: number;
  lossRatioPct: number;
  claimStatus: "SETTLED_APBS" | "TRIGGER_QUALIFIED" | "AUDIT_VERIFIED" | "THRESHOLD_PENDING";
  payoutAmountInr: number;
  bankAccountMasked: string;
  bankIfsc: string;
  utrRef: string;
  approvalOfficer: string;
}

const INITIAL_POLICIES: PolicyRecord[] = [
  {
    id: "pol-bap-101",
    policyNo: "PMFBY/AP/2023/BAP/849201",
    farmerName: "Koteswara Rao Bandi",
    aadhaarHash: "XXXX-XXXX-9421",
    phone: "+91 98480 •••••",
    village: "Appikatla",
    mandal: "Bapatla",
    district: "Bapatla",
    cropSector: "Paddy (Rice)",
    surveyNo: "Sy. 142/3A",
    lat: 15.892,
    lng: 80.441,
    insuredAreaHa: 2.4,
    sumInsuredInr: 144000,
    inundationHours: 36,
    measuredWindKmh: 112,
    sarBackscatterDbChange: -5.4,
    lossRatioPct: 85,
    claimStatus: "SETTLED_APBS",
    payoutAmountInr: 122400,
    bankAccountMasked: "SBI-APGB ...4192",
    bankIfsc: "APGB0002104",
    utrRef: "APBS2023120489102",
    approvalOfficer: "Joint Collector (Agri), Bapatla",
  },
  {
    id: "pol-niz-204",
    policyNo: "PMFBY/AP/2023/NIZ/771029",
    farmerName: "Venkata Lakshmi Nallamothu",
    aadhaarHash: "XXXX-XXXX-5510",
    phone: "+91 94401 •••••",
    village: "Dindi Coast",
    mandal: "Nizampatnam",
    district: "Bapatla",
    cropSector: "Shrimp Aquaculture",
    surveyNo: "Sy. 89/1B",
    lat: 15.864,
    lng: 80.598,
    insuredAreaHa: 1.8,
    sumInsuredInr: 320000,
    inundationHours: 42,
    measuredWindKmh: 118,
    sarBackscatterDbChange: -6.8,
    lossRatioPct: 92,
    claimStatus: "SETTLED_APBS",
    payoutAmountInr: 294400,
    bankAccountMasked: "Andhra Bank ...8831",
    bankIfsc: "UBIN0808831",
    utrRef: "APBS2023120489103",
    approvalOfficer: "Deputy Director Fisheries, Guntur",
  },
  {
    id: "pol-rep-308",
    policyNo: "PMFBY/AP/2023/REP/664192",
    farmerName: "Sambasiva Rao Chinta",
    aadhaarHash: "XXXX-XXXX-2194",
    phone: "+91 99890 •••••",
    village: "Penumudi",
    mandal: "Repalle",
    district: "Bapatla",
    cropSector: "Paddy (Rice)",
    surveyNo: "Sy. 210/4C",
    lat: 15.981,
    lng: 80.822,
    insuredAreaHa: 3.1,
    sumInsuredInr: 186000,
    inundationHours: 28,
    measuredWindKmh: 104,
    sarBackscatterDbChange: -4.2,
    lossRatioPct: 78,
    claimStatus: "TRIGGER_QUALIFIED",
    payoutAmountInr: 145080,
    bankAccountMasked: "Union Bank ...1048",
    bankIfsc: "UBIN0531048",
    utrRef: "APBS2023120489104",
    approvalOfficer: "Assistant Director Agri, Repalle",
  },
  {
    id: "pol-kav-412",
    policyNo: "PMFBY/AP/2023/KAV/993182",
    farmerName: "Anjaneyulu Meka",
    aadhaarHash: "XXXX-XXXX-7731",
    phone: "+91 97012 •••••",
    village: "Allur Shore",
    mandal: "Kavali",
    district: "SPSR Nellore",
    cropSector: "Horticulture (Coconut/Banana)",
    surveyNo: "Sy. 44/2A",
    lat: 14.881,
    lng: 80.082,
    insuredAreaHa: 2.0,
    sumInsuredInr: 180000,
    inundationHours: 22,
    measuredWindKmh: 108,
    sarBackscatterDbChange: -3.8,
    lossRatioPct: 72,
    claimStatus: "TRIGGER_QUALIFIED",
    payoutAmountInr: 129600,
    bankAccountMasked: "Canara Bank ...9024",
    bankIfsc: "CNRB0009024",
    utrRef: "APBS2023120489105",
    approvalOfficer: "Horticulture Officer, Kavali",
  },
  {
    id: "pol-ong-519",
    policyNo: "PMFBY/AP/2023/ONG/552190",
    farmerName: "Subba Reddy Kethireddy",
    aadhaarHash: "XXXX-XXXX-8812",
    phone: "+91 94900 •••••",
    village: "Kothapatnam",
    mandal: "Ongole",
    district: "Prakasam",
    cropSector: "Marine Fisheries",
    surveyNo: "F-Craft 108",
    lat: 15.421,
    lng: 80.124,
    insuredAreaHa: 1.0,
    sumInsuredInr: 250000,
    inundationHours: 18,
    measuredWindKmh: 98,
    sarBackscatterDbChange: -2.9,
    lossRatioPct: 60,
    claimStatus: "AUDIT_VERIFIED",
    payoutAmountInr: 150000,
    bankAccountMasked: "SBI-APGB ...3319",
    bankIfsc: "APGB0003319",
    utrRef: "APBS2023120489106",
    approvalOfficer: "Fisheries Development Officer, Ongole",
  },
  {
    id: "pol-chi-625",
    policyNo: "PMFBY/AP/2023/CHI/441209",
    farmerName: "Padmavathi Guntupalli",
    aadhaarHash: "XXXX-XXXX-3349",
    phone: "+91 96180 •••••",
    village: "Vetapalem",
    mandal: "Chirala",
    district: "Bapatla",
    cropSector: "Paddy (Rice)",
    surveyNo: "Sy. 78/1A",
    lat: 15.782,
    lng: 80.321,
    insuredAreaHa: 1.5,
    sumInsuredInr: 90000,
    inundationHours: 14,
    measuredWindKmh: 94,
    sarBackscatterDbChange: -2.1,
    lossRatioPct: 48,
    claimStatus: "THRESHOLD_PENDING",
    payoutAmountInr: 43200,
    bankAccountMasked: "HDFC Bank ...6610",
    bankIfsc: "HDFC0006610",
    utrRef: "PENDING_SAR_VERIFY",
    approvalOfficer: "Tahsildar, Chirala",
  },
  {
    id: "pol-chn-702",
    policyNo: "PMFBY/AP/2023/CHN/338901",
    farmerName: "Ramanjaneyulu Yeruva",
    aadhaarHash: "XXXX-XXXX-6102",
    phone: "+91 99482 •••••",
    village: "Chinaganjam Coast",
    mandal: "Chinaganjam",
    district: "Bapatla",
    cropSector: "Salt Pan Production",
    surveyNo: "Sy. 312/1",
    lat: 15.698,
    lng: 80.239,
    insuredAreaHa: 4.2,
    sumInsuredInr: 210000,
    inundationHours: 40,
    measuredWindKmh: 110,
    sarBackscatterDbChange: -7.1,
    lossRatioPct: 95,
    claimStatus: "SETTLED_APBS",
    payoutAmountInr: 199500,
    bankAccountMasked: "SBI ...5521",
    bankIfsc: "SBIN0001024",
    utrRef: "APBS2023120489107",
    approvalOfficer: "Industries Promotion Officer, Bapatla",
  },
  {
    id: "pol-kar-814",
    policyNo: "PMFBY/AP/2023/KAR/882194",
    farmerName: "Tirupathamma Kollipara",
    aadhaarHash: "XXXX-XXXX-4491",
    phone: "+91 98499 •••••",
    village: "Karlapalem",
    mandal: "Karlapalem",
    district: "Bapatla",
    cropSector: "Paddy (Rice)",
    surveyNo: "Sy. 195/2B",
    lat: 15.932,
    lng: 80.551,
    insuredAreaHa: 2.8,
    sumInsuredInr: 168000,
    inundationHours: 32,
    measuredWindKmh: 106,
    sarBackscatterDbChange: -4.9,
    lossRatioPct: 80,
    claimStatus: "TRIGGER_QUALIFIED",
    payoutAmountInr: 134400,
    bankAccountMasked: "Canara Bank ...8890",
    bankIfsc: "CNRB0008890",
    utrRef: "APBS2023120489108",
    approvalOfficer: "Agriculture Officer, Karlapalem",
  },
];

export default function InsuranceSimulationView() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "cadastral-map" | "loss-curves" | "policies" | "audit-trail">("overview");

  // Filter State
  const [policies] = useState<PolicyRecord[]>(INITIAL_POLICIES);
  const [windTrigger, setWindTrigger] = useState<number>(100);
  const [surgeTrigger, setSurgeTrigger] = useState<number>(1.5);
  const [floodDurationTrigger, setFloodDurationTrigger] = useState<number>(24);
  const [selectedCrop, setSelectedCrop] = useState<string>("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRecord | null>(null);

  // Map view inside insurance
  const [mapMode, setMapMode] = useState<"2d" | "3d">("2d");
  const [focusedParcel, setFocusedParcel] = useState<PolicyRecord | null>(INITIAL_POLICIES[0]);

  // Disbursal Simulation State
  const [dbtModalOpen, setDbtModalOpen] = useState<boolean>(false);
  const [dbtStep, setDbtStep] = useState<number>(0); // 0: Idle, 1: BigQuery GIS, 2: Vertex AI Audit, 3: NPCI APBS Transfer, 4: Finished
  const [disbursedCount, setDisbursedCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered policies based on criteria
  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      const matchCrop = selectedCrop === "ALL" || p.cropSector.includes(selectedCrop);
      const matchDistrict = selectedDistrict === "ALL" || p.district === selectedDistrict;
      const matchStatus = selectedStatus === "ALL" || p.claimStatus === selectedStatus;
      const matchSearch =
        searchQuery === "" ||
        p.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.policyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mandal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.surveyNo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCrop && matchDistrict && matchStatus && matchSearch;
    });
  }, [policies, selectedCrop, selectedDistrict, selectedStatus, searchQuery]);

  // Aggregate Metrics
  const totalSumInsured = 1480; // Crores
  const totalBeneficiaries = 119800; // registered farmers

  // Dynamic payout calculation based on parametric sliders
  const computedPayoutCrores = useMemo(() => {
    const base = 310;
    const windMultiplier = Math.max(0, (115 - windTrigger) * 4.2);
    const surgeMultiplier = Math.max(0, (2.4 - surgeTrigger) * 38);
    const durationMultiplier = Math.max(0, (36 - floodDurationTrigger) * 1.8);
    return Math.round(base + windMultiplier + surgeMultiplier + durationMultiplier);
  }, [windTrigger, surgeTrigger, floodDurationTrigger]);

  const lossRatioPct = Math.min(100, Math.round((computedPayoutCrores / totalSumInsured) * 100));

  // Multi-step APBS Disbursal Execution
  const runApbsDisbursal = () => {
    setDbtModalOpen(true);
    setDbtStep(1);
    setDisbursedCount(0);

    setTimeout(() => {
      setDbtStep(2); // Vertex AI Loss Audit
    }, 1200);

    setTimeout(() => {
      setDbtStep(3); // NPCI APBS Live Disbursal
      let count = 0;
      const interval = setInterval(() => {
        count += 19966;
        if (count >= totalBeneficiaries) {
          clearInterval(interval);
          setDisbursedCount(totalBeneficiaries);
          setDbtStep(4); // Finished
          showToast(`✓ All ₹${computedPayoutCrores} Cr successfully credited to 119,800 Aadhaar bank accounts!`);
        } else {
          setDisbursedCount(count);
        }
      }, 100);
    }, 2400);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-code flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Official Government Header Strip */}
      <div className="apple-card p-4 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-blue-600">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <span className="material-symbols-outlined text-[26px]">account_balance</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-code">
                PMFBY &amp; APSDMA DISASTER RISK FINANCING
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SMART PARAMETRIC CONTRACT ACTIVE
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                BIGQUERY GIS ST_INTERSECTS
              </span>
              <span className="bg-cyan-50 text-cyan-800 border border-cyan-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                SENTINEL-1 SAR PASS T+6H
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#0A2540] font-heading tracking-tight mt-0.5">
              Parametric Catastrophe Insurance &amp; Instant Aadhaar DBT Settlement Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated zero-touch claim triggers powered by Google Earth Engine Sentinel-1 SAR flood masks and IMD Doppler gale velocity thresholds.
            </p>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={runApbsDisbursal}
            className="apple-press px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-blue-500/20"
          >
            <span className="material-symbols-outlined text-[17px]">bolt</span>
            <span>Execute Aadhaar APBS Disbursal (₹{computedPayoutCrores} Cr)</span>
          </button>

          <button
            type="button"
            onClick={() => showToast("Exported PMFBY Beneficiary Settlement Audit CSV (119,800 records)")}
            className="apple-press px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export IRDAI Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            TOTAL SUM INSURED POOL
          </span>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-[#0A2540] font-heading tracking-tight">
              ₹{totalSumInsured} <span className="text-sm font-semibold text-slate-500">Crores</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">168,200 Registered Coastal Hectares</p>
          </div>
          <span className="text-[10px] font-code text-blue-700 font-semibold bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md w-fit">
            PMFBY &amp; AP State Disaster Fund
          </span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            PARAMETRIC TRIGGER PAYOUT
          </span>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-red-600 font-heading tracking-tight">
              ₹{computedPayoutCrores} <span className="text-sm font-semibold text-slate-500">Crores</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Automated Vertex AI Cat-Risk Model</p>
          </div>
          <div className="flex items-center justify-between text-[10px] font-code text-slate-500">
            <span>Portfolio Loss Ratio:</span>
            <strong className="text-red-700 font-bold">{lossRatioPct}%</strong>
          </div>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            VERIFIED BENEFICIARIES
          </span>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-emerald-700 font-heading tracking-tight">
              {totalBeneficiaries.toLocaleString("en-IN")} <span className="text-sm font-semibold text-slate-500">Farmers</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">100% Aadhaar APBS Seeding</p>
          </div>
          <span className="text-[10px] font-code text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md w-fit">
            Zero Physical Paperwork
          </span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            SETTLEMENT VELOCITY
          </span>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-[#0A2540] font-heading tracking-tight">
              48 Hours
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Vs Traditional 180 Days Manual Survey</p>
          </div>
          <span className="text-[10px] font-code text-blue-700 font-semibold bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md w-fit">
            Instant Smart Disbursal
          </span>
        </div>

        <div className="apple-card p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 font-code uppercase tracking-wider">
            ML CROP LOSS ACCURACY
          </span>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-blue-700 font-heading tracking-tight">
              99.4%
            </div>
            <p className="text-xs text-slate-500 mt-0.5">R² = 0.942 on CCE Ground Truth</p>
          </div>
          <span className="text-[10px] font-code text-cyan-800 font-semibold bg-cyan-50 border border-cyan-200/60 px-2 py-0.5 rounded-md w-fit">
            Sentinel-1 SAR Radar Verified
          </span>
        </div>
      </div>

      {/* 3. Sub-Deck Navigation Array */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-[#0A2540] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span>Parametric Trigger Sandboxing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cadastral-map")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "cadastral-map"
              ? "bg-[#0A2540] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">public</span>
          <span>Google Earth Cadastral Inundation Map (3D/2D)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("loss-curves")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "loss-curves"
              ? "bg-[#0A2540] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">insights</span>
          <span>Vertex AI Loss Curves &amp; Vulnerability</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("policies")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "policies"
              ? "bg-[#0A2540] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">table_chart</span>
          <span>Beneficiary Policy Ledger &amp; Audits ({filteredPolicies.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit-trail")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "audit-trail"
              ? "bg-[#0A2540] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>NPCI APBS &amp; PFMS Settlement Trail</span>
        </button>
      </div>

      {/* ── TAB 1: PARAMETRIC TRIGGER SANDBOXING & SECTOR MATRIX ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left: Parametric Index Trigger Modulator (Span 5) */}
          <div className="lg:col-span-5 apple-card p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">tune</span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-code">
                  Live Parametric Index Modulators
                </h2>
              </div>
              <span className="text-[10px] font-code text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                DYNAMIC SMART CONTRACT
              </span>
            </div>

            {/* Gale Wind Payout Slider */}
            <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
              <div className="flex justify-between items-center text-xs font-code">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-blue-600">air</span>
                  Gale Wind Velocity Threshold:
                </span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  &ge; {windTrigger} km/h
                </span>
              </div>
              <input
                type="range"
                min={80}
                max={130}
                step={5}
                value={windTrigger}
                onChange={(e) => setWindTrigger(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-code">
                <span>80 km/h (Tier 1 - 35%)</span>
                <span>100 km/h (Tier 2 - 70%)</span>
                <span>130 km/h (Full - 100%)</span>
              </div>
            </div>

            {/* Storm Surge Inundation Depth */}
            <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
              <div className="flex justify-between items-center text-xs font-code">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-cyan-600">tsunami</span>
                  Storm Surge Inundation Depth Trigger:
                </span>
                <span className="font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  &ge; {surgeTrigger.toFixed(1)}m MSL
                </span>
              </div>
              <input
                type="range"
                min={0.8}
                max={2.5}
                step={0.1}
                value={surgeTrigger}
                onChange={(e) => setSurgeTrigger(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-code">
                <span>+0.8m (Saline Seepage)</span>
                <span>+1.5m (Bund Breach)</span>
                <span>+2.5m (Catastrophic)</span>
              </div>
            </div>

            {/* Inundation Residency Duration */}
            <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
              <div className="flex justify-between items-center text-xs font-code">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-indigo-600">timer</span>
                  Submersion Residency Duration:
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  &ge; {floodDurationTrigger} Hours
                </span>
              </div>
              <input
                type="range"
                min={12}
                max={48}
                step={4}
                value={floodDurationTrigger}
                onChange={(e) => setFloodDurationTrigger(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-code">
                <span>12h (Leaf Choke)</span>
                <span>24h (Paddy Lodging)</span>
                <span>48h (Total Root Rot)</span>
              </div>
            </div>

            {/* Cryptographic 3-Tier Verification Pipeline Card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-2 text-slate-600 font-code">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">verified_user</span>
                  <span>Autonomous Verification Pipeline</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  APBS FAST-TRACK
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                  <strong className="block font-bold">1. RADAR SAR</strong>
                  <span className="text-[9px]">Sentinel-1 C-Band</span>
                </div>
                <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900">
                  <strong className="block font-bold">2. SPATIAL GIS</strong>
                  <span className="text-[9px]">BigQuery Cadastral</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <strong className="block font-bold">3. BANK APBS</strong>
                  <span className="text-[9px]">Direct Aadhaar DBT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Multi-Sector Exposure & District Breakdown (Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Sector Impact Table */}
            <div className="apple-card p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">pie_chart</span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-code">
                    Multi-Sector Exposure &amp; Triggered Loss Allocation
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-700 font-code">
                  Total Disbursal: <strong className="text-red-600 font-bold">₹{computedPayoutCrores} Cr</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Sector 1: Paddy Rice */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-code">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Paddy (Rice Crops)
                    </span>
                    <strong className="text-red-600">₹{Math.round(computedPayoutCrores * 0.44)} Cr</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "82%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-code">
                    <span>94,200 ha exposed</span>
                    <span>Loss Ratio: 82%</span>
                  </div>
                </div>

                {/* Sector 2: Shrimp Aquaculture */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-code">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      Shrimp Aquaculture
                    </span>
                    <strong className="text-red-600">₹{Math.round(computedPayoutCrores * 0.31)} Cr</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-600 h-1.5 rounded-full" style={{ width: "91%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-code">
                    <span>24,800 ha exposed</span>
                    <span>Loss Ratio: 91% (Salinity Shock)</span>
                  </div>
                </div>

                {/* Sector 3: Horticulture */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-code">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Horticulture (Banana/Coconut)
                    </span>
                    <strong className="text-red-600">₹{Math.round(computedPayoutCrores * 0.16)} Cr</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: "68%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-code">
                    <span>32,400 ha exposed</span>
                    <span>Loss Ratio: 68% (Gale Lodging)</span>
                  </div>
                </div>

                {/* Sector 4: Marine Fisheries & Salt */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-code">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Marine Craft &amp; Salt Pans
                    </span>
                    <strong className="text-red-600">₹{Math.round(computedPayoutCrores * 0.09)} Cr</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "74%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-code">
                    <span>16,800 units exposed</span>
                    <span>Loss Ratio: 74%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* District Loss Share Bar */}
            <div className="apple-card p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-code">
                  District Payout Distribution
                </span>
                <span className="text-[10px] font-code text-slate-400">
                  APSDMA EOC Live Model
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs font-code mb-1">
                    <span className="font-bold text-slate-700">Bapatla District (Direct Landfall Swath)</span>
                    <span className="font-bold text-red-600">₹{Math.round(computedPayoutCrores * 0.52)} Cr (52%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: "52%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-code mb-1">
                    <span className="font-bold text-slate-700">SPSR Nellore District</span>
                    <span className="font-bold text-blue-600">₹{Math.round(computedPayoutCrores * 0.26)} Cr (26%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "26%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-code mb-1">
                    <span className="font-bold text-slate-700">Prakasam District</span>
                    <span className="font-bold text-cyan-600">₹{Math.round(computedPayoutCrores * 0.14)} Cr (14%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-cyan-600 h-2 rounded-full" style={{ width: "14%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-code mb-1">
                    <span className="font-bold text-slate-700">Krishna District</span>
                    <span className="font-bold text-emerald-600">₹{Math.round(computedPayoutCrores * 0.08)} Cr (8%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "8%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: GOOGLE EARTH CADASTRAL INUNDATION MAP (3D / 2D) ── */}
      {activeTab === "cadastral-map" && (
        <div className="apple-card p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">travel_explore</span>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-code">
                  Google Earth Satellite Cadastral Inundation Map
                </h2>
                <p className="text-[11px] text-slate-400">
                  Real Google Earth Satellite imagery with AP Meebhoomi cadastral farm boundaries and GEE Sentinel-1 radar flood masks.
                </p>
              </div>
            </div>

            {/* 2D / 3D Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-code text-slate-500">Perspective:</span>
              <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMapMode("2d")}
                  className={`px-3 py-1 text-xs font-code font-bold rounded-lg transition ${
                    mapMode === "2d" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  2D Nadir Satellite
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode("3d")}
                  className={`px-3 py-1 text-xs font-code font-bold rounded-lg transition ${
                    mapMode === "3d" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  3D Coastal Elevation
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Embedded Google Earth Map Viewer (Span 8) */}
            <div className="lg:col-span-8 relative h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
              <iframe
                title="Google Earth Cadastral Inundation View"
                src={`${process.env.NEXT_PUBLIC_MAP_APP_URL || "https://vayu-shield.vercel.app"}/?view=${mapMode}&lat=${focusedParcel ? focusedParcel.lat : 15.82}&lng=${focusedParcel ? focusedParcel.lng : 80.35}&zoom=14`}
                className="w-full h-full border-0"
              />

              {/* Inundation Badge Overlay */}
              <div className="absolute top-3 left-3 bg-[#0A2540]/90 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-code space-y-1 shadow-lg pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold">SENTINEL-1 SAR FLOOD MASK</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  Target Landfall: Bapatla (15.8°N, 80.3°E) · Band: C-Band Radar (VV/VH)
                </div>
              </div>

              {/* Map Footer Layer Legend */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-code flex flex-wrap items-center justify-between gap-2 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/80 border border-cyan-600" />
                    Submerged Farm Parcels (&ge; 24h)
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 border border-emerald-600" />
                    AP Meebhoomi Cadastral Bounds
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500/80 border border-red-600" />
                    Storm Surge Penetration (&gt; 1.5m)
                  </span>
                </div>
                <span className="text-[10px] text-blue-700 font-bold">
                  GEE CLOUD ENGINE PIPELINE
                </span>
              </div>
            </div>

            {/* Right: Inundated Parcel Inspector (Span 4) */}
            <div className="lg:col-span-4 apple-card p-3.5 space-y-3 flex flex-col justify-between max-h-[520px]">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-code">
                    Inundated Cadastral Parcels
                  </span>
                  <span className="text-[10px] font-code text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                    {policies.length} SAMPLES
                  </span>
                </div>

                <div className="space-y-2 mt-2 max-h-[380px] overflow-y-auto pr-1">
                  {policies.map((p) => {
                    const isSelected = focusedParcel?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setFocusedParcel(p);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          isSelected
                            ? "bg-blue-50/80 border-blue-300 shadow-xs"
                            : "bg-slate-50/60 hover:bg-slate-100 border-slate-200/80"
                        }`}
                      >
                        <div className="flex items-center justify-between font-code">
                          <strong className="text-slate-800 font-bold font-heading truncate max-w-[140px]">
                            {p.farmerName}
                          </strong>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            p.lossRatioPct >= 80 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {p.lossRatioPct}% Loss
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-code mt-0.5 flex justify-between">
                          <span>{p.surveyNo} · {p.village}</span>
                          <span className="font-bold text-[#0A2540]">₹{p.payoutAmountInr.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {focusedParcel && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedPolicy(focusedParcel)}
                    className="w-full apple-press py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>Inspect {focusedParcel.farmerName}'s Dossier</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: VERTEX AI LOSS CURVES & VULNERABILITY FUNCTIONS ── */}
      {activeTab === "loss-curves" && (
        <div className="apple-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">ssid_chart</span>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-code">
                  Vertex AI Crop Vulnerability &amp; Damage Curves
                </h2>
                <p className="text-[11px] text-slate-400">
                  Mathematical loss transfer functions trained on 15 years of Andhra Pradesh Crop Cutting Experiments (CCE) and Sentinel-1 SAR observations.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-code text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              R² = 0.942 · CCE GROUND TRUTH VALIDATED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Curve 1: Paddy Inundation Duration */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center text-xs font-code">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Paddy (Rice): Flood Submersion Hours vs. Yield Loss
                </span>
                <span className="text-[10px] text-slate-500">Sigmoidal Decay Function</span>
              </div>

              {/* Visualized Stepper Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>12 Hours (Turbid Silt Layer)</span>
                  <span className="font-bold text-emerald-700">25% Depletion</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "25%" }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>24 Hours (Panicle Anoxia Initiation)</span>
                  <span className="font-bold text-amber-600">55% Depletion</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "55%" }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>36 Hours (Lodging &amp; Gaseous Suffocation)</span>
                  <span className="font-bold text-red-600">85% Depletion (Trigger Hit)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "85%" }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>48+ Hours (Saline Soil Toxicity)</span>
                  <span className="font-bold text-red-700">100% Total Crop Loss</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-700 h-2 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>

            {/* Curve 2: Shrimp Aquaculture Salinity Dilution */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center text-xs font-code">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  Shrimp Aqua: Storm Surge Ingress vs. Pond Breach
                </span>
                <span className="text-[10px] text-slate-500">Step-Threshold Binary</span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>+0.5m Surge (Salinity Drops to 12 ppt)</span>
                  <span className="font-bold text-cyan-700">20% Biomass Stress</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "20%" }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>+1.0m Surge (Aerator Submersion / Power Cut)</span>
                  <span className="font-bold text-amber-600">60% Mortality</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "60%" }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>+1.5m Surge (Bund Overwash &amp; Pond Escape)</span>
                  <span className="font-bold text-red-600">92% Total Extinction</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: "92%" }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>+2.0m Surge (Complete Coastal Pond Flattening)</span>
                  <span className="font-bold text-red-700">100% Catastrophic Loss</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-700 h-2 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>

            {/* Curve 3: Horticulture Wind Lodging */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center text-xs font-code">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  Horticulture: Gale Wind Velocity (km/h) vs Trunk Snapping
                </span>
                <span className="text-[10px] text-slate-500">Cubic Power Model</span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>80 km/h (Banana Canopy Shredding)</span>
                  <span className="font-bold text-amber-600">30% Payout</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: "30%" }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>100 km/h (Betel Vine Shed Collapse)</span>
                  <span className="font-bold text-amber-700">65% Payout</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: "65%" }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-code text-slate-600">
                  <span>120+ km/h (Coconut Trunk Snapped)</span>
                  <span className="font-bold text-red-700">95% Full Payout</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>
            </div>

            {/* ML Engineering Spec Box */}
            <div className="p-4 bg-[#0A2540] text-white rounded-2xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 font-code uppercase tracking-wider block">
                  GOOGLE VERTEX AI AUTOML PIPELINE
                </span>
                <h3 className="text-sm font-bold font-heading mt-1">
                  Synthetic Aperture Radar (SAR) Convolutional Transfer
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Dual-polarization Sentinel-1 (VV &amp; VH) backscatter coefficient anomalies (<strong className="text-cyan-400">&Delta;&sigma;&deg; &lt; -4.5 dB</strong>) are cross-referenced in real-time with digital elevation models (SRTM 30m) and historical cadastral tax parcels to compute yield losses with zero manual surveyor discretion.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-code text-slate-400">
                <span>Model Latency: <strong>4.2 sec / 100k ha</strong></span>
                <span className="text-emerald-400 font-bold">AUC-ROC: 0.981</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: FULL POLICY LEDGER & BENEFICIARY REGISTER ── */}
      {activeTab === "policies" && (
        <div className="apple-card p-4 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">badge</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-code">
                Beneficiary Crop Policy Ledger &amp; Payout Audit
              </h2>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* District Filter */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-code outline-none text-slate-700"
              >
                <option value="ALL">All Districts</option>
                <option value="Bapatla">Bapatla</option>
                <option value="SPSR Nellore">SPSR Nellore</option>
                <option value="Prakasam">Prakasam</option>
              </select>

              {/* Crop Filter */}
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-code outline-none text-slate-700 font-bold"
              >
                <option value="ALL">All Sectors</option>
                <option value="Paddy">Paddy (Rice)</option>
                <option value="Shrimp">Shrimp Aquaculture</option>
                <option value="Horticulture">Horticulture</option>
                <option value="Fisheries">Marine Fisheries</option>
                <option value="Salt">Salt Pan</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-code outline-none text-slate-700 font-bold"
              >
                <option value="ALL">All Statuses</option>
                <option value="SETTLED_APBS">Settled APBS</option>
                <option value="TRIGGER_QUALIFIED">Trigger Qualified</option>
                <option value="AUDIT_VERIFIED">Audit Verified</option>
                <option value="THRESHOLD_PENDING">Threshold Pending</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <span className="material-symbols-outlined text-[17px] text-slate-400 absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              placeholder="Search farmer name, village, mandal, survey number, or policy ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-800 placeholder-slate-400 font-sans"
            />
          </div>

          {/* Policy Table */}
          <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-white shadow-2xs">
                <tr className="border-b border-slate-200 text-slate-400 font-code text-[11px]">
                  <th className="pb-2.5 font-bold">FARMER / POLICY</th>
                  <th className="pb-2.5 font-bold">SECTOR</th>
                  <th className="pb-2.5 font-bold">HA / SURVEY</th>
                  <th className="pb-2.5 font-bold">FLOOD RESIDENCY</th>
                  <th className="pb-2.5 font-bold">LOSS RATIO</th>
                  <th className="pb-2.5 font-bold">SETTLEMENT STATUS</th>
                  <th className="pb-2.5 font-bold text-right">DISBURSAL AMOUNT</th>
                  <th className="pb-2.5 font-bold text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-code">
                {filteredPolicies.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPolicy(p)}
                    className="hover:bg-blue-50/50 cursor-pointer transition"
                  >
                    <td className="py-2.5 pr-2">
                      <span className="font-bold text-slate-800 block truncate max-w-[180px] font-heading">
                        {p.farmerName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {p.policyNo} · {p.village}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600">
                      <span className="text-[11px] font-medium block truncate max-w-[140px]">
                        {p.cropSector}
                      </span>
                      <span className="text-[10px] text-slate-400">{p.mandal}, {p.district}</span>
                    </td>
                    <td className="py-2.5 text-slate-600">
                      <span className="font-bold text-slate-800">{p.insuredAreaHa} ha</span>
                      <span className="text-[10px] text-slate-400 block">{p.surveyNo}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="font-bold text-blue-700">{p.inundationHours} hrs</span>
                      <span className="text-[10px] text-slate-400 block">{p.measuredWindKmh} km/h wind</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`font-bold ${p.lossRatioPct >= 75 ? "text-red-600" : "text-amber-600"}`}>
                        {p.lossRatioPct}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">SAR &Delta; {p.sarBackscatterDbChange} dB</span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.claimStatus === "SETTLED_APBS"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : p.claimStatus === "TRIGGER_QUALIFIED"
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : p.claimStatus === "AUDIT_VERIFIED"
                            ? "bg-cyan-50 text-cyan-800 border border-cyan-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {p.claimStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="font-extrabold text-[#0A2540] block">
                        ₹{p.payoutAmountInr.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-400">{p.bankAccountMasked}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPolicy(p);
                        }}
                        className="p-1 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                      >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 5: AUDIT TRAIL & NPCI APBS SETTLEMENT ── */}
      {activeTab === "audit-trail" && (
        <div className="apple-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">account_tree</span>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-code">
                  PFMS &amp; NPCI APBS Settlement Blockchain Audit Trail
                </h2>
                <p className="text-[11px] text-slate-400">
                  Cryptographic ledger records of automated Direct Benefit Transfer (DBT) dispatches verified against UIDAI Aadhaar Vault.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-code text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              NATIONAL PAYMENTS CORPORATION OF INDIA (NPCI) GATEWAY 200 OK
            </span>
          </div>

          <div className="space-y-2 font-code text-xs">
            {INITIAL_POLICIES.map((p, idx) => (
              <div key={p.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 font-heading">
                      {p.farmerName} · {p.cropSector}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Aadhaar Token: {p.aadhaarHash} · Bank: {p.bankAccountMasked} (IFSC: {p.bankIfsc})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-sm font-extrabold text-[#0A2540] block">
                      ₹{p.payoutAmountInr.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      UTR: {p.utrRef}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold">
                    CREDITED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── APBS DISBURSAL EXECUTION MODAL ── */}
      {dbtModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">bolt</span>
                <span className="font-heading font-bold text-base text-[#0A2540]">
                  NPCI Aadhaar APBS Disbursal Engine
                </span>
              </div>
              {dbtStep === 4 && (
                <button
                  type="button"
                  onClick={() => setDbtModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            {/* Stepper Progress */}
            <div className="space-y-3 font-code text-xs">
              {/* Step 1: BigQuery GIS */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                dbtStep >= 1 ? "bg-blue-50/80 border-blue-200 text-blue-900" : "bg-slate-50 border-slate-200 text-slate-400"
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">
                    {dbtStep > 1 ? "check_circle" : dbtStep === 1 ? "hourglass_top" : "radio_button_unchecked"}
                  </span>
                  <span>1. BigQuery GIS Spatial Cadastral Intersect</span>
                </div>
                {dbtStep > 1 && <span className="font-bold text-[10px] text-emerald-700">119,800 PLOTS VERIFIED</span>}
              </div>

              {/* Step 2: Vertex AI Audit */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                dbtStep >= 2 ? "bg-blue-50/80 border-blue-200 text-blue-900" : "bg-slate-50 border-slate-200 text-slate-400"
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">
                    {dbtStep > 2 ? "check_circle" : dbtStep === 2 ? "hourglass_top" : "radio_button_unchecked"}
                  </span>
                  <span>2. Vertex AI Parametric Loss Audit &amp; Deductible Calculation</span>
                </div>
                {dbtStep > 2 && <span className="font-bold text-[10px] text-emerald-700">99.4% CONFIDENCE</span>}
              </div>

              {/* Step 3: NPCI APBS Live Disbursal */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                dbtStep >= 3 ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">
                    {dbtStep === 4 ? "check_circle" : dbtStep === 3 ? "sync" : "radio_button_unchecked"}
                  </span>
                  <span>3. NPCI Aadhaar Payment Bridge Gateway Transfer</span>
                </div>
                {dbtStep >= 3 && (
                  <span className="font-bold text-[10px] text-emerald-700">
                    {disbursedCount.toLocaleString("en-IN")} ACCOUNTS
                  </span>
                )}
              </div>
            </div>

            {/* Counter Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <span className="text-[11px] font-code text-slate-500 uppercase block">Total Disbursal Volume</span>
              <div className="text-2xl font-extrabold text-[#0A2540] font-heading">
                ₹{computedPayoutCrores} Crores
              </div>
              <p className="text-xs text-slate-500">
                Direct to APGB, SBI, Andhra Bank, Union Bank accounts of cyclone-affected coastal farmers.
              </p>
            </div>

            {dbtStep === 4 && (
              <button
                type="button"
                onClick={() => setDbtModalOpen(false)}
                className="w-full apple-press py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Close &amp; View Settled Policy Register
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 5. OFFICIAL GOVERNMENT SANCTION ORDER & CLAIM DOSSIER MODAL ── */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header with Gov Seal */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center border border-blue-200 font-bold text-xs">
                  AP
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-code block">
                    GOVERNMENT OF ANDHRA PRADESH • PMFBY CELL
                  </span>
                  <h3 className="font-heading font-extrabold text-sm text-[#0A2540]">
                    Parametric Catastrophe Claim Sanction Order
                  </h3>
                  <span className="text-[10px] font-code text-slate-400">
                    Order Ref: AP/DM/2023/CAT-DISB/{selectedPolicy.policyNo.split("/").pop()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Dossier Grid Details */}
            <div className="grid grid-cols-2 gap-3 text-xs font-code">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">BENEFICIARY DETAILS</span>
                <strong className="text-slate-800 text-sm block mt-0.5">{selectedPolicy.farmerName}</strong>
                <span className="text-[10px] text-slate-500 block">Aadhaar: {selectedPolicy.aadhaarHash}</span>
                <span className="text-[10px] text-slate-500 block">Mobile: {selectedPolicy.phone}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">POLICY IDENTIFICATION</span>
                <strong className="text-blue-700 text-xs block mt-0.5">{selectedPolicy.policyNo}</strong>
                <span className="text-[10px] text-slate-600 block font-semibold">{selectedPolicy.cropSector}</span>
                <span className="text-[10px] text-slate-500 block">Sum Insured: ₹{selectedPolicy.sumInsuredInr.toLocaleString("en-IN")}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">GEOGRAPHIC CADASTRAL PLOT</span>
                <strong className="text-slate-800 text-xs block mt-0.5">{selectedPolicy.surveyNo} ({selectedPolicy.insuredAreaHa} ha)</strong>
                <span className="text-[10px] text-slate-500 block">{selectedPolicy.village} Village, {selectedPolicy.mandal} Mandal</span>
                <span className="text-[10px] text-slate-500 block">District: {selectedPolicy.district}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">SATELLITE SAR AUDIT PROOF</span>
                <strong className="text-emerald-700 text-xs block mt-0.5">{selectedPolicy.inundationHours}h Saline Submersion</strong>
                <span className="text-[10px] text-slate-500 block">Peak Wind: {selectedPolicy.measuredWindKmh} km/h (Doppler)</span>
                <span className="text-[10px] text-emerald-800 block font-bold">Backscatter &Delta;: {selectedPolicy.sarBackscatterDbChange} dB (Standing Water Confirmed)</span>
              </div>
            </div>

            {/* Financial Settlement Breakdown */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs font-code">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block uppercase">
                    SANCTIONED PARAMETRIC SETTLEMENT
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-950 block mt-0.5">
                    ₹{selectedPolicy.payoutAmountInr.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-emerald-800">
                    Loss Severity: <strong>{selectedPolicy.lossRatioPct}%</strong> of Sum Insured
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">NPCI APBS ROUTE</span>
                  <strong className="text-slate-800 text-xs block">{selectedPolicy.bankAccountMasked}</strong>
                  <span className="text-[10px] text-slate-500 block">IFSC: {selectedPolicy.bankIfsc}</span>
                  <span className="text-[10px] text-emerald-800 block font-bold">UTR: {selectedPolicy.utrRef}</span>
                </div>
              </div>
            </div>

            {/* Officer Sign-off Bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-code flex items-center justify-between text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Competent Approval Authority</span>
                <strong className="text-slate-800">{selectedPolicy.approvalOfficer}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Digital Token Stamp</span>
                <span className="text-blue-700 font-bold text-[10px]">AP-EOC-CRYPT-SIG-094</span>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Sanction Order PDF downloaded for Policy ${selectedPolicy.policyNo}`);
                  setSelectedPolicy(null);
                }}
                className="apple-press px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download Sanction Order PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
