const translations = {
  en: {
    nav: { upload: "Upload Report", analyse: "Analyse Report" },
    home: {
      badge: "Powered by Gemini AI",
      headline1: "Your Medical Reports,",
      headline2: "Simply Explained",
      sub: "Upload any lab report and instantly get a clear, structured breakdown of every test result — no medical jargon, no confusion.",
      cta: "Upload a Report",
      free: "Free to use · No account required · Results in seconds",
      featuresTitle: "Everything you need to understand your results",
      featuresSub: "Built for patients, not doctors",
      howTitle: "How it works",
      howSub: "Three simple steps",
      getStarted: "Get started — it's free",
      footer: "MediLens extracts and simplifies report data only. Always consult a qualified healthcare professional for medical advice.",
      stats: { tests: "Test types", powered: "Powered", time: "Analysis time" },
      features: [
        { title: "Any Lab Report", desc: "CBC, Lipid Panel, LFT, KFT, Thyroid, Urinalysis — upload any type of medical report." },
        { title: "Instant Extraction", desc: "Gemini AI reads every page and extracts every test value, unit, and reference range." },
        { title: "Clear Status", desc: "Each result is marked Normal, Above Range, or Below Range based on your report's own reference values." },
        { title: "No Diagnosis", desc: "We only extract and present information. No medical conclusions, no treatment advice." },
      ],
      steps: [
        { title: "Upload your report", desc: "Drag & drop or browse a PDF, PNG, or JPG of your lab report." },
        { title: "AI analyses it", desc: "Gemini reads every page and identifies all test results automatically." },
        { title: "View clear results", desc: "See every test with its value, unit, reference range, and status." },
      ],
    },

    upload: {
      badge: "AI-Powered Analysis",
      headline1: "Understand Your",
      headline2: "Medical Report",
      sub: "Upload any lab report and our AI instantly extracts every test result, compares it against reference ranges, and presents it in a clear, easy-to-read format.",
      cardTitle: "Upload your report",
      cardSub: "Supports PDF, PNG, JPG · Max 10 MB",
      dragActive: "Release to upload",
      dragIdle: "Drag & drop your report here",
      browse: "browse files",
      browseFrom: "from your device",
      readyLabel: "Ready to analyse",
      pdfReady: "PDF loaded and ready for AI analysis",
      submitBtn: "Upload & Analyse with AI",
      analysisComplete: "Analysis complete",
      testExtracted: "test results extracted",
      newReport: "New report",
      analysisFailed: "Analysis failed",
      trust: ["Secure upload", "No diagnosis provided", "Powered by Gemini AI"],
      features: ["Extracts all test values", "Reference range comparison", "Gemini AI powered", "Secure & private"],
      unsupportedFile: "Unsupported file type. Please upload a PDF, PNG, or JPG.",
      fileTooLarge: "File too large. Maximum size is 10 MB.",
    },

    results: {
      reportSummary: "Report Summary",
      disclaimer: "Information summary only — not a medical diagnosis or advice. Consult a qualified healthcare professional.",
      searchPlaceholder: "Search tests...",
      testResults: "Test Results",
      noTests: "No lab test values found",
      noTestsSub: "This appears to be a narrative report rather than a lab results report. See the summary above.",
      noMatch: "No tests match your search or filter.",
      footer: "MediLens extracts and simplifies report data. Always consult a qualified healthcare professional for medical advice.",
      total: "Total",
      normal: "Normal",
      above: "Above",
      below: "Below",
      colTest: "Test Name",
      colValue: "Value",
      colUnit: "Unit",
      colRef: "Reference Range",
      colStatus: "Status",
      filterAll: "All",
      filterNormal: "Normal",
      filterAbove: "Above",
      filterBelow: "Below",
      filterUnknown: "Unknown",
      statusLabels: {
        normal: "Normal",
        above_range: "Above Range",
        below_range: "Below Range",
        unknown: "Unknown",
      },
    },

    settings: {
      title: "Settings",
      appearance: "Appearance",
      language: "Language",
      about: "About",
      searchLang: "Search language...",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      active: "Active",
    },

    chat: {
      supportTitle: "MediLens Support",
      online: "Online",
      placeholder: "Ask anything about MediLens...",
      quickReplies: [
        "How do I upload a report?",
        "What file formats are supported?",
        "Why did my analysis fail?",
        "Is my data private?",
        "What does MediLens do?",
      ],
      greeting:
        "Hi! 👋 I'm the MediLens Support Assistant. I can help you with how to use the app, troubleshoot issues, or answer any questions. How can I help you today?",
    },
  },

  hi: {
    nav: {
      upload: "रिपोर्ट अपलोड करें",
      analyse: "रिपोर्ट विश्लेषण करें",
    },

    home: {
      badge: "Gemini AI द्वारा संचालित",
      headline1: "आपकी मेडिकल रिपोर्ट,",
      headline2: "सरल भाषा में",
      sub: "कोई भी लैब रिपोर्ट अपलोड करें और तुरंत हर टेस्ट का स्पष्ट विवरण पाएं — कोई जटिल शब्द नहीं, कोई भ्रम नहीं।",
      cta: "रिपोर्ट अपलोड करें",
      free: "मुफ़्त · कोई अकाउंट नहीं · सेकंडों में परिणाम",
      featuresTitle: "अपने परिणाम समझने के लिए सब कुछ",
      featuresSub: "मरीज़ों के लिए बनाया गया, डॉक्टरों के लिए नहीं",
      howTitle: "यह कैसे काम करता है",
      howSub: "तीन सरल चरण",
      getStarted: "शुरू करें — यह मुफ़्त है",
      footer: "MediLens केवल रिपोर्ट डेटा निकालता और सरल बनाता है। हमेशा किसी योग्य स्वास्थ्य पेशेवर से परामर्श लें।",
      stats: {
        tests: "टेस्ट प्रकार",
        powered: "AI संचालित",
        time: "विश्लेषण समय",
      },

      features: [
        {
          title: "कोई भी लैब रिपोर्ट",
          desc: "CBC, लिपिड पैनल, LFT, KFT, थायरॉइड, यूरिनालिसिस — किसी भी प्रकार की मेडिकल रिपोर्ट अपलोड करें।",
        },
        {
          title: "तत्काल निष्कर्षण",
          desc: "Gemini AI हर पृष्ठ पढ़ता है और हर टेस्ट मान, इकाई और संदर्भ सीमा निकालता है।",
        },
        {
          title: "स्पष्ट स्थिति",
          desc: "प्रत्येक परिणाम को सामान्य, सीमा से ऊपर या सीमा से नीचे के रूप में चिह्नित किया जाता है।",
        },
        {
          title: "कोई निदान नहीं",
          desc: "हम केवल जानकारी निकालते और प्रस्तुत करते हैं। कोई चिकित्सा निष्कर्ष नहीं।",
        },
      ],

      steps: [
        {
          title: "अपनी रिपोर्ट अपलोड करें",
          desc: "अपनी लैब रिपोर्ट का PDF, PNG या JPG खींचें और छोड़ें।",
        },
        {
          title: "AI विश्लेषण करता है",
          desc: "Gemini हर पृष्ठ पढ़ता है और सभी टेस्ट परिणाम स्वचालित रूप से पहचानता है।",
        },
        {
          title: "स्पष्ट परिणाम देखें",
          desc: "हर टेस्ट का मान, इकाई, संदर्भ सीमा और स्थिति देखें।",
        },
      ],
    },

    upload: {
      badge: "AI-संचालित विश्लेषण",
      headline1: "अपनी",
      headline2: "मेडिकल रिपोर्ट समझें",
      sub: "कोई भी लैब रिपोर्ट अपलोड करें और हमारा AI तुरंत हर टेस्ट परिणाम निकालता है।",
      cardTitle: "अपनी रिपोर्ट अपलोड करें",
      cardSub: "PDF, PNG, JPG समर्थित · अधिकतम 10 MB",
      dragActive: "अपलोड करने के लिए छोड़ें",
      dragIdle: "अपनी रिपोर्ट यहाँ खींचें और छोड़ें",
      browse: "फ़ाइलें ब्राउज़ करें",
      browseFrom: "अपने डिवाइस से",
      readyLabel: "विश्लेषण के लिए तैयार",
      pdfReady: "PDF लोड हो गया और AI विश्लेषण के लिए तैयार है",
      submitBtn: "AI से अपलोड और विश्लेषण करें",
      analysisComplete: "विश्लेषण पूर्ण",
      testExtracted: "टेस्ट परिणाम निकाले गए",
      newReport: "नई रिपोर्ट",
      analysisFailed: "विश्लेषण विफल",
      trust: ["सुरक्षित अपलोड", "कोई निदान नहीं", "Gemini AI द्वारा संचालित"],
      features: [
        "सभी टेस्ट मान निकालता है",
        "संदर्भ सीमा तुलना",
        "Gemini AI संचालित",
        "सुरक्षित और निजी",
      ],
      unsupportedFile: "असमर्थित फ़ाइल प्रकार। कृपया PDF, PNG या JPG अपलोड करें।",
      fileTooLarge: "फ़ाइल बहुत बड़ी है। अधिकतम आकार 10 MB है।",
    },

    results: {
      reportSummary: "रिपोर्ट सारांश",
      disclaimer:
        "केवल सूचना सारांश — चिकित्सा निदान या सलाह नहीं। किसी योग्य स्वास्थ्य पेशेवर से परामर्श लें।",
      searchPlaceholder: "टेस्ट खोजें...",
      testResults: "टेस्ट परिणाम",
      noTests: "कोई लैब टेस्ट मान नहीं मिला",
      noTestsSub:
        "यह एक वर्णनात्मक रिपोर्ट प्रतीत होती है। ऊपर सारांश देखें।",
      noMatch: "आपकी खोज या फ़िल्टर से कोई टेस्ट मेल नहीं खाता।",
      footer:
        "MediLens रिपोर्ट डेटा निकालता और सरल बनाता है। हमेशा किसी योग्य स्वास्थ्य पेशेवर से परामर्श लें।",
      total: "कुल",
      normal: "सामान्य",
      above: "ऊपर",
      below: "नीचे",
      colTest: "टेस्ट नाम",
      colValue: "मान",
      colUnit: "इकाई",
      colRef: "संदर्भ सीमा",
      colStatus: "स्थिति",
      filterAll: "सभी",
      filterNormal: "सामान्य",
      filterAbove: "ऊपर",
      filterBelow: "नीचे",
      filterUnknown: "अज्ञात",
      statusLabels: {
        normal: "सामान्य",
        above_range: "सीमा से ऊपर",
        below_range: "सीमा से नीचे",
        unknown: "अज्ञात",
      },
    },

    settings: {
      title: "सेटिंग्स",
      appearance: "रूप",
      language: "भाषा",
      about: "के बारे में",
      searchLang: "भाषा खोजें...",
      lightMode: "लाइट मोड",
      darkMode: "डार्क मोड",
      active: "सक्रिय",
    },

    chat: {
      supportTitle: "MediLens सहायता",
      online: "ऑनलाइन",
      placeholder: "MediLens के बारे में कुछ भी पूछें...",
      quickReplies: [
        "रिपोर्ट कैसे अपलोड करें?",
        "कौन से फ़ाइल प्रारूप समर्थित हैं?",
        "मेरा विश्लेषण क्यों विफल हुआ?",
        "क्या मेरा डेटा निजी है?",
        "MediLens क्या करता है?",
      ],
      greeting:
        "नमस्ते! 👋 मैं MediLens सहायता सहायक हूँ। मैं ऐप का उपयोग करने में, समस्याओं को हल करने में या किसी भी प्रश्न का उत्तर देने में मदद कर सकता हूँ।",
    },
  },
};

// All other languages fall back to English UI with Gemini translating chat responses
const FALLBACK = "en";

export function getT(langCode) {
  return translations[langCode] || translations[FALLBACK];
}

translations.ta = {
  ...translations.en,
  nav: {
    upload: "அறிக்கையை பதிவேற்றவும்",
    analyse: "அறிக்கையை பகுப்பாய்வு செய்யவும்",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens ஆதரவு",
    online: "ஆன்லைன்",
    placeholder: "MediLens பற்றி எதையும் கேளுங்கள்...",
    greeting:
      "வணக்கம்! 👋 நான் MediLens ஆதரவு உதவியாளர். ஆப்பை பயன்படுத்துவதில் உதவ தயாராக இருக்கிறேன்.",
    quickReplies: [
      "அறிக்கையை எவ்வாறு பதிவேற்றுவது?",
      "எந்த கோப்பு வடிவங்கள் ஆதரிக்கப்படுகின்றன?",
      "என் பகுப்பாய்வு ஏன் தோல்வியடைந்தது?",
      "என் தரவு தனிப்பட்டதா?",
      "MediLens என்ன செய்கிறது?",
    ],
  },
};

translations.te = {
  ...translations.en,
  nav: {
    upload: "నివేదికను అప్లోడ్ చేయండి",
    analyse: "నివేదికను విశ్లేషించండి",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens మద్దతు",
    online: "ఆన్లైన్",
    placeholder: "MediLens గురించి ఏదైనా అడగండి...",
    greeting:
      "హలో! 👋 నేను MediLens మద్దతు సహాయకుడిని. సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.",
  },
};

translations.kn = {
  ...translations.en,
  nav: {
    upload: "ವರದಿ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    analyse: "ವರದಿ ವಿಶ್ಲೇಷಿಸಿ",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens ಬೆಂಬಲ",
    online: "ಆನ್ಲೈನ್",
    placeholder: "MediLens ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...",
    greeting:
      "ನಮಸ್ಕಾರ! 👋 ನಾನು MediLens ಬೆಂಬಲ ಸಹಾಯಕ. ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧ.",
  },
};

translations.ml = {
  ...translations.en,
  nav: {
    upload: "റിപ്പോർട്ട് അപ്ലോഡ് ചെയ്യുക",
    analyse: "റിപ്പോർട്ട് വിശകലനം ചെയ്യുക",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens പിന്തുണ",
    online: "ഓൺലൈൻ",
    placeholder: "MediLens നെ കുറിച്ച് എന്തും ചോദിക്കൂ...",
    greeting:
      "ഹലോ! 👋 ഞാൻ MediLens സപ്പോർട്ട് അസിസ്റ്റന്റ് ആണ്. സഹായിക്കാൻ തയ്യാർ.",
  },
};

translations.bn = {
  ...translations.en,
  nav: {
    upload: "রিপোর্ট আপলোড করুন",
    analyse: "রিপোর্ট বিশ্লেষণ করুন",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens সহায়তা",
    online: "অনলাইন",
    placeholder: "MediLens সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন...",
    greeting:
      "হ্যালো! 👋 আমি MediLens সাপোর্ট অ্যাসিস্ট্যান্ট। সাহায্য করতে প্রস্তুত।",
  },
};

translations.mr = {
  ...translations.en,
  nav: {
    upload: "अहवाल अपलोड करा",
    analyse: "अहवाल विश्लेषण करा",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens समर्थन",
    online: "ऑनलाइन",
    placeholder: "MediLens बद्दल काहीही विचारा...",
    greeting:
      "नमस्कार! 👋 मी MediLens सपोर्ट असिस्टंट आहे. मदत करण्यास तयार आहे.",
  },
};

translations.gu = {
  ...translations.en,
  nav: {
    upload: "રિપોર્ટ અપલોડ કરો",
    analyse: "રિપોર્ટ વિશ્લેષણ કરો",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens સહાય",
    online: "ઓનલાઇન",
    placeholder: "MediLens વિશે કંઈ પણ પૂછો...",
    greeting:
      "નમસ્તે! 👋 હું MediLens સપોર્ટ આસિસ્ટન્ટ છું. મદદ કરવા તૈયાર છું.",
  },
};

translations.pa = {
  ...translations.en,
  nav: {
    upload: "ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰੋ",
    analyse: "ਰਿਪੋਰਟ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens ਸਹਾਇਤਾ",
    online: "ਔਨਲਾਈਨ",
    placeholder: "MediLens ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
    greeting:
      "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 👋 ਮੈਂ MediLens ਸਪੋਰਟ ਅਸਿਸਟੈਂਟ ਹਾਂ। ਮਦਦ ਕਰਨ ਲਈ ਤਿਆਰ ਹਾਂ.",
  },
};

translations.es = {
  ...translations.en,
  nav: {
    upload: "Subir informe",
    analyse: "Analizar informe",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "Soporte MediLens",
    online: "En línea",
    placeholder: "Pregunta cualquier cosa sobre MediLens...",
    greeting:
      "¡Hola! 👋 Soy el Asistente de Soporte de MediLens. Listo para ayudarte.",
  },
};

translations.fr = {
  ...translations.en,
  nav: {
    upload: "Télécharger le rapport",
    analyse: "Analyser le rapport",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "Support MediLens",
    online: "En ligne",
    placeholder: "Posez n'importe quelle question sur MediLens...",
    greeting:
      "Bonjour! 👋 Je suis l'Assistant Support MediLens. Prêt à vous aider.",
  },
};

translations.de = {
  ...translations.en,
  nav: {
    upload: "Bericht hochladen",
    analyse: "Bericht analysieren",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens Support",
    online: "Online",
    placeholder: "Fragen Sie alles über MediLens...",
    greeting:
      "Hallo! 👋 Ich bin der MediLens Support-Assistent. Bereit zu helfen.",
  },
};

translations.zh = {
  ...translations.en,
  nav: {
    upload: "上传报告",
    analyse: "分析报告",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens 支持",
    online: "在线",
    placeholder: "询问有关 MediLens 的任何问题...",
    greeting:
      "你好！👋 我是 MediLens 支持助手，随时准备帮助您。",
  },
};

translations.ar = {
  ...translations.en,
  nav: {
    upload: "رفع التقرير",
    analyse: "تحليل التقرير",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "دعم MediLens",
    online: "متصل",
    placeholder: "اسأل أي شيء عن MediLens...",
    greeting:
      "مرحباً! 👋 أنا مساعد دعم MediLens، جاهز للمساعدة.",
  },
};

translations.ja = {
  ...translations.en,
  nav: {
    upload: "レポートをアップロード",
    analyse: "レポートを分析",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "MediLens サポート",
    online: "オンライン",
    placeholder: "MediLens について何でも聞いてください...",
    greeting:
      "こんにちは！👋 MediLens サポートアシスタントです。お手伝いします。",
  },
};

translations.pt = {
  ...translations.en,
  nav: {
    upload: "Enviar relatório",
    analyse: "Analisar relatório",
  },
  chat: {
    ...translations.en.chat,
    supportTitle: "Suporte MediLens",
    online: "Online",
    placeholder: "Pergunte qualquer coisa sobre MediLens...",
    greeting:
      "Olá! 👋 Sou o Assistente de Suporte MediLens. Pronto para ajudar.",
  },
};