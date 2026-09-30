export type SupportedLanguage = "en" | "te" | "hi" | "ta" | "or" | "bn";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English (Official)" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు (ఆంధ్రప్రదేశ్)" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी (National)" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ் (Tamil Nadu)" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ (Odisha)" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা (West Bengal)" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Top Gov Banner
    govTitle: "GOVERNMENT OF ANDHRA PRADESH • STATE DISASTER MANAGEMENT AUTHORITY (APSDMA)",
    govTitleShort: "GOVERNMENT OF ANDHRA PRADESH",
    apsdmaFull: "State Disaster Management Authority (APSDMA)",
    nationalEmergency: "NATIONAL EMERGENCY OPERATIONS CENTER (NEOC)",
    hotline: "24x7 State Emergency Hotline: 1070 / 112",
    hotlineShort: "Hotline:",
    statusLive: "LIVE SITUATION MONITORING",
    
    // Header
    appTitle: "PRAVAAH AI",
    version: "C4ISR v4.2",
    appSubtitle: "Predictive Risk & Anticipatory Vulnerability Assessment for Hazard Action • Severe Cyclone Michaung",
    googleTranslate: "GOOGLE TRANSLATE:",
    predictedLandfall: "Predicted Landfall:",
    bapatlaCoast: "Bapatla Coast (15.8°N, 80.3°E)",
    sitRepPdf: "SitRep PDF",
    broadcastCellAlert: "Broadcast Cell Alert",
    commanderTitle: "EOC Incident Commander",
    commanderSubtitle: "Decision Support Console",
    
    // Navigation
    navCommandCenter: "Command Center",
    navRiskMap: "Risk Map",
    navCycloneScenario: "Cyclone Scenario",
    navShelters: "Shelter & Evacuee Logs",
    navPrediction: "Google AI & GEE Engine",
    navInfrastructure: "Infrastructure",
    navWhatIf: "What-if Simulator",
    navAnticipatory: "Anticipatory Actions",
    navAiCopilot: "AI Copilot",
    navAlerts: "Alerts & Advisories",
    navInsurance: "Insurance Simulation",
    navVision: "Multimodal Vision AI",
    navValidation: "Validation",
    eocNavigation: "EOC NAVIGATION ARRAY",
    
    // KPIs
    kpiPopAtRisk: "POPULATION AT RISK",
    kpiInundationSwath: "Inundation Swath Area",
    kpiPowerGrid: "POWER SUBSTATIONS",
    kpiHealthcare: "HEALTHCARE ASSETS",
    kpiShelters: "CYCLONE SHELTERS",
    kpiOccupied: "Occupied Slots",
    kpiVacant: "Vacant Remaining",
    kpiTotalCapacity: "Total Capacity",
    
    // Shelter View
    shelterManagementTitle: "Shelter Management & Evacuee Headcount Operations Center",
    shelterSubtitle: "Live shelter occupancy tracking, vacant slot computation, demographic breakdown, and sector-wise targeted emergency messaging.",
    sectorWiseMessaging: "Sector-Wise Emergency Messaging",
    allSectors: "All Sectors",
    sendTargetedAlert: "Send Targeted Alert",
    womenDemographic: "Women & Girls",
    menDemographic: "Men & Boys",
    childrenDemographic: "Infants & Children",
    elderlyDemographic: "Elderly & Special Care",
  },
  te: {
    // Top Gov Banner
    govTitle: "ఆంధ్రప్రదేశ్ ప్రభుత్వం • రాష్ట్ర విపత్తు నిర్వహణ సంస్థ (APSDMA)",
    govTitleShort: "ఆంధ్రప్రదేశ్ ప్రభుత్వం",
    apsdmaFull: "రాష్ట్ర విపత్తు నిర్వహణ సంస్థ (APSDMA)",
    nationalEmergency: "జాతీయ అత్యవసర నిర్వహణ కేంద్రం (NEOC)",
    hotline: "24x7 రాష్ట్ర విపత్తు సహాయ హెల్ప్‌లైన్: 1070 / 112",
    hotlineShort: "సహాయవాణి:",
    statusLive: "ప్రత్యక్ష పరిస్థితి పర్యవేక్షణ",
    
    // Header
    appTitle: "ప్రవాహ్ AI (PRAVAAH)",
    version: "C4ISR v4.2",
    appSubtitle: "తుఫాను విపత్తు ముందస్తు హెచ్చరిక & రక్షణ నిర్వహణ వ్యవస్థ • మిచౌంగ్ తీవ్ర తుఫాను",
    googleTranslate: "గూగుల్ అనువాదం:",
    predictedLandfall: "తీరం దాటే ప్రదేశం:",
    bapatlaCoast: "బాపట్ల తీరం (15.8°N, 80.3°E)",
    sitRepPdf: "విపత్తు నివేదిక PDF",
    broadcastCellAlert: "సెల్ హెచ్చరిక పంపండి",
    commanderTitle: "EOC ఇన్సిడెంట్ కమాండర్",
    commanderSubtitle: "నిర్ణయ మద్దతు వ్యవస్థ",
    
    // Navigation
    navCommandCenter: "కమాండ్ సెంటర్",
    navRiskMap: "రిస్క్ మ్యాప్",
    navCycloneScenario: "తుఫాను దృశ్యం",
    navShelters: "పునరావాస కేంద్రాల రికార్డులు",
    navPrediction: "గూగుల్ AI & GEE ప్రిడిక్షన్",
    navInfrastructure: "మౌలిక సదుపాయాలు",
    navWhatIf: "సిమ్యులేటర్ (What-If)",
    navAnticipatory: "ముందస్తు చర్యలు",
    navAiCopilot: "AI కో-పైలట్",
    navAlerts: "హెచ్చరికలు & సమాచారం",
    navInsurance: "భీమా సిమ్యులేషన్",
    navVision: "మల్టీమోడల్ విజన్ AI",
    navValidation: "మోడల్ ధృవీకరణ",
    eocNavigation: "EOC నావిగేషన్ మెను",
    
    // KPIs
    kpiPopAtRisk: "ప్రమాదంలో ఉన్న జనాభా",
    kpiInundationSwath: "ముంపు ప్రాంత విస్తీర్ణం",
    kpiPowerGrid: "విద్యుత్ సబ్‌స్టేషన్లు",
    kpiHealthcare: "వైద్యశాలలు & ఆసుపత్రులు",
    kpiShelters: "తుఫాను పునరావాస కేంద్రాలు",
    kpiOccupied: "భర్తీ అయిన స్థలాలు",
    kpiVacant: "మిగిలి ఉన్న ఖాళీలు",
    kpiTotalCapacity: "మొత్తం సామర్థ్యం",
    
    // Shelter View
    shelterManagementTitle: "పునరావాస కేంద్రాల నిర్వహణ & జనాభా గణాంక కార్యాలయం",
    shelterSubtitle: "పునరావాస కేంద్రాల సామర్థ్యం, ఖాళీ స్థలాలు, జనాభా వివరాలు మరియు సెక్టార్ల వారీగా అత్యవసర సందేశాల పంపకం.",
    sectorWiseMessaging: "సెక్టార్ వారీ అత్యవసర సందేశం",
    allSectors: "అన్ని సెక్టార్లు",
    sendTargetedAlert: "సందేశం పంపండి",
    womenDemographic: "మహిళలు & బాలికలు",
    menDemographic: "పురుషులు & బాలురు",
    childrenDemographic: "చిన్నపిల్లలు",
    elderlyDemographic: "వృద్ధులు & ప్రత్యేక శ్రద్ధ",
  },
  hi: {
    // Top Gov Banner
    govTitle: "आंध्र प्रदेश सरकार • राज्य आपदा प्रबंधन प्राधिकरण (APSDMA)",
    govTitleShort: "आंध्र प्रदेश सरकार",
    apsdmaFull: "राज्य आपदा प्रबंधन प्राधिकरण (APSDMA)",
    nationalEmergency: "राष्ट्रीय आपातकालीन संचालन केंद्र (NEOC)",
    hotline: "24x7 राज्य आपदा हेल्पलाइन: 1070 / 112",
    hotlineShort: "हेल्पलाइन:",
    statusLive: "लाइव स्थिति निगरानी",
    
    // Header
    appTitle: "प्रवाह AI (PRAVAAH)",
    version: "C4ISR v4.2",
    appSubtitle: "तूफान जोखिम पूर्वानुमान एवं आपदा पूर्व कार्रवाई प्रणाली • चक्रवात मिचौंग",
    googleTranslate: "गूगल अनुवाद:",
    predictedLandfall: "लैंडफॉल अनुमान:",
    bapatlaCoast: "बापटला तट (15.8°N, 80.3°E)",
    sitRepPdf: "स्थिति रिपोर्ट PDF",
    broadcastCellAlert: "आपातकालीन सेल अलर्ट",
    commanderTitle: "EOC इंसिडेंट कमांडर",
    commanderSubtitle: "निर्णय समर्थन कंसोल",
    
    // Navigation
    navCommandCenter: "कमांड सेंटर",
    navRiskMap: "जोखिम मानचित्र",
    navCycloneScenario: "चक्रवात परिदृश्य",
    navShelters: "राहत शिविर रिकॉर्ड",
    navPrediction: "गूगल AI एवं GEE इंजन",
    navInfrastructure: "बुनियादी ढांचा",
    navWhatIf: "सिम्युलेटर (What-If)",
    navAnticipatory: "पूर्वव्यापी कार्रवाइयां",
    navAiCopilot: "AI सह-पायलट",
    navAlerts: "चेतावनी एवं सलाह",
    navInsurance: "बीमा सिमुलेशन",
    navVision: "मल्टीमॉडल विज़न AI",
    navValidation: "मॉडल सत्यापन",
    eocNavigation: "EOC नेविगेशन सारणी",
    
    // KPIs
    kpiPopAtRisk: "जोखिम में आबादी",
    kpiInundationSwath: "जलभराव क्षेत्र",
    kpiPowerGrid: "विद्युत सब-स्टेशन",
    kpiHealthcare: "स्वास्थ्य केंद्र",
    kpiShelters: "चक्रवात आश्रय स्थल",
    kpiOccupied: "अधिकृत स्थान",
    kpiVacant: "उपलब्ध रिक्त स्थान",
    kpiTotalCapacity: "कुल क्षमता",
    
    // Shelter View
    shelterManagementTitle: "आश्रय प्रबंधन एवं निकासी जनसंख्या परिचालन केंद्र",
    shelterSubtitle: "आश्रय क्षमता, खाली स्लॉट, जनसांख्यिकी डेटा और सेक्टर-वार आपातकालीन संदेश प्रणाली।",
    sectorWiseMessaging: "सेक्टर-वार आपातकालीन संदेश",
    allSectors: "सभी सेक्टर",
    sendTargetedAlert: "लक्षित अलर्ट भेजें",
    womenDemographic: "महिलाएं एवं बालिकाएं",
    menDemographic: "पुरुष एवं बालक",
    childrenDemographic: "शिशु एवं बच्चे",
    elderlyDemographic: "वृद्ध एवं विशेष देखभाल",
  },
  ta: {
    // Top Gov Banner
    govTitle: "ஆந்திரப் பிரதேச அரசு • மாநில பேரிடர் மேலாண்மை ஆணையம் (APSDMA)",
    nationalEmergency: "தேசிய அவசரகால செயல்பாட்டு மையம் (NEOC)",
    hotline: "24x7 மாநில அவசர உதவி எண்: 1070 / 112",
    statusLive: "நேரடி நிலை கண்காணிப்பு",
    
    // Header
    appTitle: "பிரவாஹ் AI (PRAVAAH)",
    version: "C4ISR v4.2",
    appSubtitle: "புயல் முன்னெச்சரிக்கை மற்றும் பேரிடர் மேலாண்மை தளம் • மிக்ஜாம் புயல்",
    googleTranslate: "கூகிள் மொழிபெயர்ப்பு:",
    predictedLandfall: "கரை கடக்கும் இடம்:",
    bapatlaCoast: "பாபட்லா கடற்கரை (15.8°N, 80.3°E)",
    sitRepPdf: "அறிக்கை PDF",
    broadcastCellAlert: "அவசர எச்சரிக்கை அனுப்பு",
    commanderTitle: "EOC தளபதி",
    commanderSubtitle: "முடிவெடுக்கும் தளம்",
    
    // Navigation
    navCommandCenter: "கட்டளை மையம்",
    navRiskMap: "அபாய வரைபடம்",
    navCycloneScenario: "புயல் காட்சி",
    navShelters: "நிவாரண முகாம்கள்",
    navPrediction: "கூகிள் AI & GEE கணிப்பு",
    navInfrastructure: "உள்கட்டமைப்பு",
    navWhatIf: "சிமுலேட்டர் (What-If)",
    navAnticipatory: "முன்னெச்சரிக்கை நடவடிக்கைகள்",
    navAiCopilot: "AI துணை பைலட்",
    navAlerts: "எச்சரிக்கைகள்",
    navInsurance: "காப்பீட்டு உருவகப்படுத்துதல்",
    navVision: "மல்டிமாடல் விஷன் AI",
    navValidation: "மாதிரி சரிபார்ப்பு",
    eocNavigation: "EOC வழிசெலுத்தல்",
    
    // KPIs
    kpiPopAtRisk: "ஆபத்தில் உள்ள மக்கள்",
    kpiInundationSwath: "வெள்ளப் பெருக்கு பகுதி",
    kpiPowerGrid: "மின் நிலையங்கள்",
    kpiHealthcare: "மருத்துவமனைகள்",
    kpiShelters: "புயல் முகாம்கள்",
    kpiOccupied: "நிரப்பப்பட்ட இடங்கள்",
    kpiVacant: "மீதமுள்ள இடங்கள்",
    kpiTotalCapacity: "மொத்த கொள்ளளவு",
    
    // Shelter View
    shelterManagementTitle: "முகாம் மேலாண்மை மற்றும் மீட்பு மக்கள் மையம்",
    shelterSubtitle: "முகாம் கொள்ளளவு, காலி இடங்கள், மக்கள் புள்ளிவிவரங்கள் மற்றும் பகுதி வாரியான எச்சரிக்கை முறை.",
    sectorWiseMessaging: "பகுதி வாரியான எச்சரிக்கை",
    allSectors: "அனைத்து பகுதிகள்",
    sendTargetedAlert: "எச்சரிக்கை அனுப்பு",
    womenDemographic: "பெண்கள் & சிறுமிகள்",
    menDemographic: "ஆண்கள் & சிறுவர்கள்",
    childrenDemographic: "குழந்தைகள்",
    elderlyDemographic: "முதியவர்கள்",
  },
  or: {
    // Top Gov Banner
    govTitle: "ଆନ୍ଧ୍ରପ୍ରଦେଶ ସରକାର • ରାଜ୍ୟ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷ (APSDMA)",
    nationalEmergency: "ଜାତୀୟ ଜରୁରୀକାଳୀନ କେନ୍ଦ୍ର (NEOC)",
    hotline: "24x7 ରାଜ୍ୟ ହେଲ୍ପଲାଇନ୍: 1070 / 112",
    statusLive: "ପ୍ରତ୍ୟକ୍ଷ ସ୍ଥିତି ନିରୀକ୍ଷଣ",
    
    // Header
    appTitle: "ପ୍ରବାହ AI (PRAVAAH)",
    version: "C4ISR v4.2",
    appSubtitle: "ବାତ୍ୟା ପୂର୍ବାନୁମାନ ଏବଂ ସୁରକ୍ଷା ପରିଚାଳନା ବ୍ୟବସ୍ଥା • ବାତ୍ୟା ମିଚୌଙ୍ଗ",
    googleTranslate: "ଗୁଗୁଲ୍ ଅନୁବାଦ:",
    predictedLandfall: "ଲ୍ୟାଣ୍ଡଫଲ୍ ପୂର୍ବାନୁମାନ:",
    bapatlaCoast: "ବାପଟଲା ଉପକୂଳ (15.8°N, 80.3°E)",
    sitRepPdf: "ରିପୋର୍ଟ PDF",
    broadcastCellAlert: "ଜରୁରୀକାଳୀନ ଆଲର୍ଟ",
    commanderTitle: "EOC କମାଣ୍ଡର",
    commanderSubtitle: "ନିଷ୍ପତ୍ତି ସହାୟତା କନସୋଲ୍",
    
    // Navigation
    navCommandCenter: "କମାଣ୍ଡ ସେଣ୍ଟର",
    navRiskMap: "ବିପଦ ମାନଚିତ୍ର",
    navCycloneScenario: "ବାତ୍ୟା ଦୃଶ୍ୟ",
    navShelters: "ଆଶ୍ରୟସ୍ଥଳୀ ରେକର୍ଡ",
    navPrediction: "ଗୁଗୁଲ୍ AI ଏବଂ GEE ଇଞ୍ଜିନ୍",
    navInfrastructure: "ଭିତ୍ତିଭୂମି",
    navWhatIf: "ସିମୁଲେଟର",
    navAnticipatory: "ପୂର୍ବ ପଦକ୍ଷେପ",
    navAiCopilot: "AI ସହଯୋଗୀ",
    navAlerts: "ଚେତାବନୀ",
    navInsurance: "ବୀମା ସିମୁଲେସନ୍",
    navVision: "ଭିଜନ AI",
    navValidation: "ମଡେଲ୍ ଯାଞ୍ଚ",
    eocNavigation: "EOC ମେନୁ",
    
    // KPIs
    kpiPopAtRisk: "ବିପଦରେ ଥିବା ଜନସଂଖ୍ୟା",
    kpiInundationSwath: "ଜଳମଗ୍ନ ଅଞ୍ଚଳ",
    kpiPowerGrid: "ବିଦ୍ୟୁତ୍ ଗ୍ରିଡ୍",
    kpiHealthcare: "ଚିକିତ୍ସାଳୟ",
    kpiShelters: "ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀ",
    kpiOccupied: "ପୂର୍ଣ୍ଣ ସ୍ଥାନ",
    kpiVacant: "ଉପଲବ୍ଧ ଖାଲି ସ୍ଥାନ",
    kpiTotalCapacity: "ମୋଟ କ୍ଷମତା",
    
    // Shelter View
    shelterManagementTitle: "ଆଶ୍ରୟସ୍ଥଳୀ ପରିଚାଳନା କେନ୍ଦ୍ର",
    shelterSubtitle: "ଆଶ୍ରୟ କ୍ଷମତା, ଖାଲି ସ୍ଥାନ ଏବଂ ସେକ୍ଟର ଅନୁସାରେ ସତର୍କତା ବାର୍ତ୍ତା।",
    sectorWiseMessaging: "ସେକ୍ଟର ଅନୁସାରେ ବାର୍ତ୍ତା",
    allSectors: "ସମସ୍ତ ସେକ୍ଟର",
    sendTargetedAlert: "ସତର୍କତା ପଠାନ୍ତୁ",
    womenDemographic: "ମହିଳା ଏବଂ ଝିଅ",
    menDemographic: "ପୁରୁଷ ଏବଂ ପୁଅ",
    childrenDemographic: "ଶିଶୁ",
    elderlyDemographic: "ବୟସ୍କ",
  },
  bn: {
    // Top Gov Banner
    govTitle: "অন্ধ্রপ্রদেশ সরকার • রাজ্য দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষ (APSDMA)",
    nationalEmergency: "জাতীয় জরুরি প্রতিক্রিয়া কেন্দ্র (NEOC)",
    hotline: "24x7 রাজ্য জরুরি হেল্পলাইন: 1070 / 112",
    statusLive: "লাইভ পরিস্থিতি পর্যবেক্ষণ",
    
    // Header
    appTitle: "প্রবাহ AI (PRAVAAH)",
    version: "C4ISR v4.2",
    appSubtitle: "ঘূর্ণিঝড় ঝুঁকি পূর্বাভাস ও আগাম সতর্কতা প্ল্যাটফর্ম • ঘূর্ণিঝড় মিচাউং",
    googleTranslate: "গুগল অনুবাদ:",
    predictedLandfall: "ল্যান্ডফল পূর্বাভাস:",
    bapatlaCoast: "বাপটলা উপকূল (15.8°N, 80.3°E)",
    sitRepPdf: "পরিস্থিতি রিপোর্ট PDF",
    broadcastCellAlert: "জরুরি সেল সতর্কতা",
    commanderTitle: "EOC ইনসিডেন্ট কমান্ডার",
    commanderSubtitle: "সিদ্ধান্ত সহায়তা কনসোল",
    
    // Navigation
    navCommandCenter: "কমান্ড সেন্টার",
    navRiskMap: "ঝুঁকি মানচিত্র",
    navCycloneScenario: "ঘূর্ণিঝড় দৃশ্য",
    navShelters: "আশ্রয় কেন্দ্র রেকর্ড",
    navPrediction: "গুগল AI ও GEE ইঞ্জিন",
    navInfrastructure: "অবকাঠামো",
    navWhatIf: "হোয়াট-ইফ সিমুলেটর",
    navAnticipatory: "আগাম প্রস্তুতিমূলক পদক্ষেপ",
    navAiCopilot: "AI কো-পাইলট",
    navAlerts: "সতর্কতা ও নির্দেশিকা",
    navInsurance: "বীমা সিমুলেশন",
    navVision: "মাল্টিমোডাল ভিশন AI",
    navValidation: "মডেল যাচাইকরণ",
    eocNavigation: "EOC নেভিগেশন অ্যারে",
    
    // KPIs
    kpiPopAtRisk: "ঝুঁকিপূর্ণ জনসংখ্যা",
    kpiInundationSwath: "প্লাবিত এলাকা",
    kpiPowerGrid: "বিদ্যুৎ সাব-স্টেশন",
    kpiHealthcare: "স্বাস্থ্যসেবা সম্পদ",
    kpiShelters: "ঘূর্ণিঝড় আশ্রয়কেন্দ্র",
    kpiOccupied: "অধিভুক্ত স্থান",
    kpiVacant: "অবশিষ্ট খালি স্থান",
    kpiTotalCapacity: "মোট ধারণক্ষমতা",
    
    // Shelter View
    shelterManagementTitle: "আশ্রয় ব্যবস্থাপনা ও উচ্ছেদ জনসংখ্যা অপারেশন সেন্টার",
    shelterSubtitle: "আশ্রয় ধারণক্ষমতা, খালি স্লট, জনসংখ্যাতাত্ত্বিক তথ্য এবং সেক্টর-ভিত্তিক জরুরি বার্তা প্রেরণ।",
    sectorWiseMessaging: "সেক্টর-ভিত্তিক জরুরি বার্তা",
    allSectors: "সমস্ত সেক্টর",
    sendTargetedAlert: "লক্ষ্যভিত্তিক সতর্কতা পাঠান",
    womenDemographic: "মহিলা ও বালিকা",
    menDemographic: "পুরুষ ও বালক",
    childrenDemographic: "শিশু",
    elderlyDemographic: "বয়োবৃদ্ধ ও বিশেষ যত্ন",
  },
};
