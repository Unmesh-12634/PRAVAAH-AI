"use client";

import React, { useState } from "react";

interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  timestamp: string;
  text: string;
  actionTag?: string;
  category?: "sitrep" | "broadcast" | "shelter" | "medical" | "general";
  teluguText?: string;
}

const INITIAL_MESSAGES: CopilotMessage[] = [
  {
    id: "msg-1",
    sender: "copilot",
    timestamp: "06:15 IST",
    text: "Jai Hind, Incident Commander. I am PRAVAAH AI Tactical Decision Copilot powered by Google Gemini 1.5 Flash. I am grounded in live IMD Doppler velocity, INCOIS wave hydrodynamics, and district EOC telemetry. What tactical analysis do you require?",
    teluguText: "జై హింద్, ఇన్సిడెంట్ కమాండర్. నేను ప్రవాహ్ AI వ్యూహాత్మక నిర్ణయ సహాయకుడిని. ప్రత్యక్ష రాడార్ సమాచారం, తుఫాను తీవ్రత మరియు సహాయక చర్యలపై ఏ సమాచారం కావాలన్నా అడగండి.",
  },
  {
    id: "msg-2",
    sender: "user",
    timestamp: "06:18 IST",
    text: "What is the critical landfall risk window and surge profile for Bapatla and SPSR Nellore?",
  },
  {
    id: "msg-3",
    sender: "copilot",
    timestamp: "06:19 IST",
    category: "sitrep",
    text: "Based on IMD Doppler Radar telemetry and INCOIS hydro-dynamic modeling:\n\n1. **Landfall Corridor**: Bapatla-Nellore coast between 14.8°N and 15.8°N.\n2. **Critical Timing**: Landfall peak between 14:00 and 17:30 IST today.\n3. **Storm Surge**: +1.6m to +1.8m above astronomical tide. High tide at 16:15 IST coincides with peak storm surge.\n4. **Inundation Exposure**: 38,000 citizens in 14 low-lying coastal mandals are within the primary surge swath.\n\n**Actionable Directive**: Ensure complete mandatory evacuation of coastal hamlets within 3km of the high-tide line before 12:00 IST.",
    teluguText: "ఐఎండీ రాడార్ మరియు ఇన్‌కాయిస్ హైడ్రోడైనమిక్ మోడల్ ప్రకారం:\n1. తీరం దాటే ప్రదేశం: బాపట్ల-నెల్లూరు తీరం.\n2. సమయం: ఈరోజు మధ్యాహ్నం 14:00 నుండి 17:30 మధ్య.\n3. తుఫాను ఆటుపోట్లు: సాధారణ స్థాయి కంటే +1.8 మీటర్లు ఎక్కువ.\n4. తక్షణ ఆదేశం: తీరానికి 3 కి.మీ పరిధిలోని ప్రజలను మధ్యాహ్నం 12:00 గంటలలోపు పునరావాస కేంద్రాలకు తరలించాలి.",
    actionTag: "DIRECTIVE: MANDATORY EVACUATION VERIFICATION",
  },
];

const PRESET_PROMPTS = [
  { icon: "description", label: "Executive SitRep for Chief Secretary", query: "Generate Executive SitRep for Chief Secretary" },
  { icon: "medical_services", label: "ICU Oxygen & Power Backup Audit", query: "Check ICU Oxygen and diesel generator backup for coastal hospitals" },
  { icon: "cell_tower", label: "Draft Bilingual Cell Broadcast", query: "Draft Bilingual (Telugu/English) Cell Broadcast Warning" },
  { icon: "holiday_village", label: "Calculate Shelter Capacity Deficit", query: "Calculate remaining shelter intake and deficit for Bapatla" },
  { icon: "account_balance", label: "Parametric PMFBY Crop Loss Assessment", query: "Simulate PMFBY parametric crop loss estimate for Nellore paddy fields" },
];

export default function AiCopilotView() {
  const [messages, setMessages] = useState<CopilotMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTelugu, setShowTelugu] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleAudioBriefing = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      showToast("Synthesizing voice briefing via Google Cloud Text-to-Speech...");
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Acknowledged. Processing satellite telemetry and district preparedness logs...";
      let tag: string | undefined = undefined;
      let teluguReply = "పరిశీలిస్తున్నాము. ఉపగ్రహ సమాచారం మరియు జిల్లా నివేదికలను విశ్లేషిస్తున్నాము...";
      let cat: CopilotMessage["category"] = "general";

      if (query.toLowerCase().includes("sitrep") || query.toLowerCase().includes("chief secretary")) {
        cat = "sitrep";
        reply = `**PRAVAAH T-12h EXECUTIVE SITUATION REPORT (CHIEF SECRETARY'S DESK)**\n\n- **Hazard**: Severe Cyclonic Storm 'MICHAUNG'\n- **Eye Location**: 14.8°N, 80.6°E (Approx 110km SE of Bapatla)\n- **Evacuation Status**: 64,200 of 82,000 citizens relocated (78.3% target achieved)\n- **Shelter Operations**: 214 MPCS fully operational with 72h rations and solar backup.\n- **NDRF/SDRF**: 18 tactical battalions deployed with 42 inflatable motorized boats.\n- **Critical Action Required**: Mandatory lockdown of NH-16 coastal sections and precautionary islanding of inundated 132kV power transformers.`;
        teluguReply = `**ముఖ్య కార్యదర్శి నివేదిక (సిట్‌రెప్)**:\n- తుఫాను: తీవ్ర తుఫాను మిచాంగ్\n- కంటి స్థానం: బాపట్లకు 110 కి.మీ ఆగ్నేయంగా\n- తరలింపు: 64,200 మంది పునరావాస కేంద్రాలకు చేరిక (78.3% పూర్తి)\n- సహాయక బృందాలు: 18 NDRF/SDRF బృందాలు సిద్ధం.\n- తక్షణ ఆదేశం: జాతీయ రహదారి 16 పై వాహనాల రాకపోకల నిలిపివేత.`;
        tag = "OFFICIAL SITREP READY FOR DISPATCH";
      } else if (query.toLowerCase().includes("broadcast") || query.toLowerCase().includes("warning")) {
        cat = "broadcast";
        reply = `**COMMON ALERTING PROTOCOL (CAP) CELL BROADCAST DRAFT**:\n\n[ENGLISH]: Severe Cyclone Michaung landfall imminent in Bapatla-Nellore coastal belt within 12 hours. Extremely heavy rainfall and gale winds up to 110 km/h predicted. Evacuate low-lying areas immediately to designated cyclone shelters. Avoid coastal roads. For emergency assistance call 1070 or 112. — AP State Disaster Management Authority\n\n[TELUGU]: ఆంధ్రప్రదేశ్ విపత్తు నిర్వహణ హెచ్చరిక: రాబోయే 12 గంటల్లో తీవ్ర తుఫాను తీరం దాటనుంది. గంటకు 110 కి.మీ వేగంతో పెనుగాలులు మరియు భారీ వర్షాలు కురిసే అవకాశం ఉంది. తీరప్రాంత ప్రజలు తక్షణమే సమీపంలోని పునరావాస కేంద్రాలకు చేరుకోవాలి. అత్యవసర సహాయం కొరకు 1070 లేదా 112 కు కాల్ చేయండి.`;
        teluguReply = `సెల్ బ్రాడ్‌కాస్ట్ సందేశం సిద్ధంగా ఉంది. తెలుగు మరియు ఆంగ్ల భాషలలో జారీ చేయడానికి సిద్ధం.`;
        tag = "CAP BROADCAST PROTOCOL VERIFIED";
      } else if (query.toLowerCase().includes("shelter")) {
        cat = "shelter";
        reply = `**SHELTER INTAKE & DEFICIT AUDIT (BAPATLA SECTOR)**:\n\n- Designated Shelters: 48 Multipurpose Cyclone Shelters (MPCS)\n- Current Occupancy: 18,400 / 26,000 capacity (70.7% filled)\n- Deficit Reserve: 7,600 slots available in Tier-2 schools and community halls.\n- Safe Potable Water: 35,000 pouches pre-positioned.\n- Medical Units: 14 auxiliary mobile medical teams deployed.`;
        teluguReply = `బాపట్ల పునరావాస కేంద్రాల నివేదిక: 48 కేంద్రాలలో 18,400 మంది ఆశ్రయం పొందారు. ఇంకా 7,600 మందికి సరిపడా వసతి అందుబాటులో ఉంది.`;
        tag = "SHELTER DEFICIT NORMAL";
      } else if (query.toLowerCase().includes("oxygen") || query.toLowerCase().includes("medical") || query.toLowerCase().includes("hospital")) {
        cat = "medical";
        reply = `**COASTAL HEALTHCARE INFRASTRUCTURE STATUS**:\n\n- District Hospitals Inspected: 8 facilities (Nellore, Kavali, Bapatla, Chirala, Ongole)\n- ICU Oxygen Reserves: 96 hours of liquid medical oxygen (LMO) topped up at 100% capacity.\n- Auxiliary Backup Power: Dual 125kVA diesel generator sets installed on elevated plinths.\n- Emergency Blood Bank Reserves: 420 units of O-ve and universal donor blood positioned.`;
        teluguReply = `తీరప్రాంత ఆసుపత్రుల నివేదిక: 8 ప్రధాన ఆసుపత్రులలో 96 గంటలకు సరిపడా ఆక్సిజన్ మరియు డీజిల్ జనరేటర్లు సిద్ధంగా ఉన్నాయి.`;
        tag = "HEALTHCARE PERIMETER SECURED";
      } else if (query.toLowerCase().includes("crop") || query.toLowerCase().includes("insurance") || query.toLowerCase().includes("pmfby")) {
        reply = `**VERTEX AI CAT-RISK LOSS ESTIMATE**:\n\n- Projected Inundated Cropland: 48,500 hectares of Kharif paddy in Nellore & Bapatla.\n- Estimated Parametric Payout: ₹148.2 Crores.\n- Automated Beneficiaries: 42,600 registered farmers via PMFBY portal.\n- Satellite Verification: Sentinel-1 SAR synthetic aperture radar queued for post-landfall damage mapping.`;
        teluguReply = `పంట నష్టపరిహార అంచనా: 48,500 హెక్టార్ల వరి పంట నీటమునిగే ప్రమాదం ఉంది. సుమారు ₹148.2 కోట్ల పరిహారం ఆధార్ ద్వారా నేరుగా జమ చేయడానికి సిద్ధం.`;
        tag = "PARAMETRIC LOSS ESTIMATE READY";
      } else {
        reply = `Analysis completed for: "${query}". Satellite uplink nominal. Real-time telemetry indicates all coastal barrier infrastructure operating under high readiness.`;
        teluguReply = `విశ్లేషణ పూర్తయింది. అన్ని వ్యవస్థలు అప్రమత్తంగా ఉన్నాయి.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
          text: reply,
          teluguText: teluguReply,
          actionTag: tag,
          category: cat,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
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

      {/* 1. Header Bar with Apple Glass Styling & Model Engine Metadata */}
      <div className="apple-card p-4.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#0A2540] font-heading tracking-tight">
                PRAVAAH AI Tactical Decision Copilot
              </h1>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-code font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                GEMINI 1.5 FLASH · 240MS
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-200/80 font-code font-bold text-[10px] px-2 py-0.5 rounded-full">
                GROUNDED IN IMD + INCOIS + EOC
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Autonomous conversational reasoning agent for incident commanders, trained on NDMA SOPs, disaster bylaws, and GIS swaths.
            </p>
          </div>
        </div>

        {/* Tactical Controls: Voice Briefing & Language Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Audio Briefing Button */}
          <button
            type="button"
            onClick={toggleAudioBriefing}
            className={`apple-press px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              isPlayingAudio
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-[17px] text-blue-600">
              {isPlayingAudio ? "volume_up" : "record_voice_over"}
            </span>
            <span>{isPlayingAudio ? "Playing Briefing..." : "Voice Briefing"}</span>
            {isPlayingAudio && (
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-emerald-500 animate-bounce" />
                <span className="w-0.5 h-2 bg-emerald-500 animate-pulse" />
                <span className="w-0.5 h-3 bg-emerald-500 animate-bounce" />
              </span>
            )}
          </button>

          {/* Telugu / English Multilingual Toggle */}
          <button
            type="button"
            onClick={() => setShowTelugu(!showTelugu)}
            className={`apple-press px-3 py-1.5 rounded-xl text-xs font-bold font-code transition border ${
              showTelugu
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {showTelugu ? "తెలుగు (Telugu Active)" : "Language: English"}
          </button>
        </div>
      </div>

      {/* 2. Main Chat Console Card */}
      <div className="apple-card overflow-hidden flex flex-col h-[calc(100vh-210px)] min-h-[580px]">
        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 font-code shrink-0 uppercase tracking-wider">
            QUICK ACTIONS:
          </span>
          {PRESET_PROMPTS.map((p) => (
            <button
              key={p.query}
              type="button"
              onClick={() => handleSendMessage(p.query)}
              className="apple-press shrink-0 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 rounded-xl px-2.5 py-1 text-xs transition flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[15px] text-blue-600">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F9FBFC]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-code text-slate-400">
                <span className="font-semibold text-slate-600">
                  {m.sender === "user" ? "Incident Commander" : "PRAVAAH AI Assistant"}
                </span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white shadow-sm rounded-tr-none font-medium"
                    : "apple-card bg-white text-slate-800 border-slate-200/90 shadow-xs rounded-tl-none space-y-2.5"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {showTelugu && m.teluguText ? m.teluguText : m.text}
                </div>

                {/* Copilot Action Directives & Quick Buttons */}
                {m.actionTag && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-code font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      {m.actionTag}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(m.text)}
                        className="apple-press text-[11px] font-code text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <span className="material-symbols-outlined text-[13px]">content_copy</span>
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast("Dispatched directive to District Collectorates")}
                        className="apple-press text-[11px] font-code text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 transition font-bold"
                      >
                        <span className="material-symbols-outlined text-[13px]">send</span>
                        <span>Dispatch to EOC</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-code text-slate-400 p-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-200" />
              <span>Gemini 1.5 Flash analyzing live coastal telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask tactical questions (e.g., 'Draft shelter evacuation message for Bapatla', 'Simulate surge depth')..."
            className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="apple-press bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <span>Ask AI</span>
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
