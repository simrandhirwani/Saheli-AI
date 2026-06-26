import React, { useState, useEffect } from 'react';
import { Mic, ShieldAlert, FileText, Fingerprint, Users, Lock, Globe, Scale, Mail, ArrowRight, CheckCircle2, AlertTriangle, Phone, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { API_BASE_URL } from '../config'; 

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  const [currentStat, setCurrentStat] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    en: {
      trustBadge: "✓ Privacy-First | ✓ Multi-Language | ✓ Legally Compliant",
      heroTitle: "Your Voice.",
      heroHighlight: "Your Power.",
      heroSub: "Your Rights.",
      heroCTA: "Start Speaking Safely",
      heroSecondaryCTA: "Learn how SafeMode works →",
      whyTitle: "Why Your Voice Matters",
      whySub: "Breaking barriers that silence women.",
      pillarTitle: "The Architecture",
      pillarSub: "Five Pillars of Protection",
      pillarContext: "Saheli combines distress detection, welfare matching, legal narrative generation, and community into one system. Here's how we protect you at every step.",
      aiTitle: "AI That Listens. Systems That Act.",
      aiText: "The system is broken for those 70% of women who need help most. Saheli bridges the gap—using voice AI to detect distress, match legal entitlements, and generate court-ready complaints. Because every woman deserves justice, not just awareness.",
      builtByLabel: "Built by women technologists, for women's safety.",
      waitlistTitle: "Become a Voice for Change",
      waitlistSub: "Be part of the first community making safety actionable, not just aspirational.",
      formTitle: "Join the movement",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      dropdownLabel: "How did you hear about SAHELI?",
      checkboxBeta: "I want early access to SafeMode beta",
      checkboxCommunity: "I want to be part of the founding peer network",
      reserveBtn: "Get Early Access Now",
      subReassurance: "We respect your privacy. Unsubscribe anytime.",
      successTitle: "🎉 Welcome to the movement!",
      successSub: "Check your email for the SafeMode beta link. Share with women in your network—together, we're louder.",
      stats: [
        "In 2022, over 4,45,000 cases of crimes against women were officially registered in India.",
        "Over 70% of women facing domestic violence never seek help—because systems fail them. SAHELI doesn't.",
        "India ranks 129 out of 146 countries in the 2024 Global Gender Gap Report.",
        "Only 14% of Indian women have formal property rights, crippling financial independence.",
        "The NCW receives thousands of SOS complaints monthly, yet many go uninvestigated."
      ],
      cards: [
        { title: "Absolute Privacy", desc: "Everything you share is encrypted end-to-end. No logs. No surveillance. Just you and your safety." },
        { title: "Speaks Your Language", desc: "Whether you speak Hindi, Gujarati, Marathi, or English—SAHELI understands your story. Your language, your narrative." },
        { title: "Legally Actionable", desc: "Your words become a legal complaint ready for court. We handle the legal language; you handle the power." }
      ]
    },
    hi: {
      trustBadge: "✓ गोपनीयता-सर्वोपरि | ✓ बहुभाषी समर्थन | ✓ कानूनी रूप से मान्य",
      heroTitle: "आपकी आवाज़।",
      heroHighlight: "आपकी शक्ति।",
      heroSub: "आपका अधिकार।",
      heroCTA: "सुरक्षित बोलना शुरू करें",
      heroSecondaryCTA: "सहेली कैसे काम करती है देखें →",
      whyTitle: "आपकी आवाज़ क्यों मायने रखती है",
      whySub: "उन बाधाओं को तोड़ना जो महिलाओं को खामोश करती हैं।",
      pillarTitle: "सुरक्षा की संरचना",
      pillarSub: "सुरक्षा के पांच मजबूत स्तंभ",
      pillarContext: "सहेली संकट का पता लगाने, सरकारी योजना मिलान और कानूनी मसूदा तैयार करने की प्रक्रियाओं को एक वॉइस-फर्स्ट सिस्टम में जोड़ती है।",
      aiTitle: "एआई जो सुनता है। व्यवस्था जो कार्य करती है।",
      aiText: "प्रणाली उन 70% महिलाओं के लिए टूटी हुई है जिन्हें मदद की सबसे ज्यादा जरूरत है। सहेली उस अंतर को पाटती है—संकट को पहचानने और कोर्ट-तैयार शिकायतें उत्पन्न करने के लिए वॉइस एआई का उपयोग करती है।",
      builtByLabel: "महिला प्रौद्योगिकीविदों द्वारा निर्मित, महिला सुरक्षा के लिए समर्पित।",
      waitlistTitle: "परिवर्तन की आवाज़ बनें",
      waitlistSub: "सुरक्षा को केवल आकांक्षा नहीं, बल्कि धरातल पर साकार करने वाले पहले समुदाय का हिस्सा बनें।",
      formTitle: "आंदोलन से जुड़ें",
      nameLabel: "पूरा नाम",
      emailLabel: "ईमेल पता",
      dropdownLabel: "आपको सहेली के बारे में कैसे पता चला?",
      checkboxBeta: "मुझे सेफमोड बीटा का अर्ली एक्सेस चाहिए",
      checkboxCommunity: "मैं संस्थापक पीयर नेटवर्क का हिस्सा बनना चाहती हूँ",
      reserveBtn: "अभी अर्ली एक्सेस प्राप्त करें",
      subReassurance: "हम आपकी गोपनीयता का सम्मान करते हैं। कभी भी अनसब्सक्राइब करें।",
      successTitle: "🎉 आंदोलन में आपका स्वागत है!",
      successSub: "सेफमोड बीटा लिंक के लिए अपना ईमेल देखें। अपने नेटवर्क में अन्य महिलाओं के साथ साझा करें—साथ मिलकर हमारी आवाज़ मजबूत है।",
      stats: [
        "2022 में, भारत में महिलाओं के खिलाफ अपराध के 4,45,000 से अधिक मामले आधिकारिक तौर पर दर्ज किए गए थे।",
        "घरेलू हिंसा का सामना करने वाली 70% से अधिक महिलाएं कानूनी जटिलताओं के डर से कभी मदद नहीं मांग पातीं—क्योंकि व्यवस्थाएं उन्हें विफल कर देती हैं। सहेली नहीं।",
        "2024 की वैश्विक लैंगिक अंतराल रिपोर्ट में भारत 146 देशों में से 129वें स्थान पर है।",
        "केवल 14% भारतीय महिलाओं के पास स्वतंत्र संपत्ति अधिकार हैं, जो वित्तीय स्वावलंबन को प्रभावित करते हैं।",
        "राष्ट्रीय महिला आयोग को हर महीने हजारों आपातकालीन शिकायतें मिलती हैं, लेकिन कई पर तुरंत कार्रवाई नहीं हो पाती।"
      ],
      cards: [
        { title: "पूर्ण गोपनीयता", desc: "आप जो कुछ भी साझा करते हैं वह एंड-टू-एंड एन्क्रिप्टेड है। कोई लॉग नहीं। कोई निगरानी नहीं। बस आप और आपकी सुरक्षा।" },
        { title: "आपकी अपनी भाषा", desc: "चाहे आप हिंदी, गुजराती, मराठी या अंग्रेजी बोलते हों—सहेली आपकी कहानी समझती है। आपकी भाषा, आपका आख्यान।" },
        { title: "कानूनी रूप से मान्य", desc: "आपके शब्द अदालत के लिए तैयार कानूनी शिकायत बन जाते हैं। कानूनी भाषा हम संभालते हैं; शक्ति आप संभालती हैं।" }
      ]
    },
    gu: {
      trustBadge: "✓ ગોપનીયતા-પ્રથમ | ✓ બહુભાષી આધાર | ✓ કાનૂની રીતે માન્ય",
      heroTitle: "તમારો અવાજ.",
      heroHighlight: "તમારી શક્તિ.",
      heroSub: "તમારા અધિકાર.",
      heroCTA: "સુરક્ષિત રીતે બોલવાનું શરૂ કરો",
      heroSecondaryCTA: "જાણો સેફમોડ કેવી રીતે કામ કરે છે →",
      whyTitle: "તમારો અવાજ શા માટે મહત્વપૂર્ણ છે",
      whySub: "મહિલાઓને ચૂપ રાખતા અવરોધોને તોડી રહ્યા છીએ.",
      pillarTitle: "સુરક્ષાનું માળખું",
      pillarSub: "સુરક્ષાના પાંચ સ્તંભ",
      pillarContext: "સહેલી મુશ્કેલીની ઓળખ, કલ્યાણકારી યોજનાઓ અને કાનૂની ડ્રાફ્ટિંગને એક જ વૉઇસ-ફર્સ્ટ સિસ્ટમમાં જોડે છે. અમે દરેક પગલે તમારી સુરક્ષા કેવી રીતે કરીએ છીએ તે અહીં છે.",
      aiTitle: "એઆઈ જે સાંભળે છે. સિસ્ટમ જે કાર્ય કરે છે.",
      aiText: "જે 70% મહિલાઓને સૌથી વધુ મદદની જરૂર છે તેમના માટે આ સિસ્ટમ નિષ્ફળ છે. સહેલી આ ખામીને પૂરી કરે છે—વૉઇસ AIનો ઉપયોગ કરીને મુશ્કેલીને પારખી, કાનૂની અધિકારો સાથે જોડીને કોર્ટ માટે તૈયાર ફરિયાદો બનાવે છે.",
      builtByLabel: "મહિલા ટેક્નોલોજિસ્ટ્સ દ્વારા નિર્મિત, મહિલા સુરક્ષા માટે.",
      waitlistTitle: "પરિવર્તનનો અવાજ બનો",
      waitlistSub: "સુરક્ષાને માત્ર આશા નહીં, પણ વાસ્તવિકતા બનાવનારા પ્રથમ સમુદાયનો ભાગ બનો.",
      formTitle: "આંદોલનમાં જોડાઓ",
      nameLabel: "પૂરું નામ",
      emailLabel: "ઈમેલ સરનામું",
      dropdownLabel: "તમને સહેલી વિશે કેવી રીતે જાણવા મળ્યું?",
      checkboxBeta: "મારે સેફમોડ બીટાની વહેલી ઍક્સેસ જોઈએ છે",
      checkboxCommunity: "હું સ્થાપક પીઅર નેટવર્કનો ભાગ બનવા માંગુ છું",
      reserveBtn: "અત્યારે જ અર્લી એક્સેસ મેળવો",
      subReassurance: "અમે તમારી ગોપનીયતાનો આદર કરીએ છીએ. ગમે ત્યારે અનસબ્સ્ક્રાઇબ કરો.",
      successTitle: "🎉 આંદોલનમાં તમારું સ્વાગત છે!",
      successSub: "સેફમોડ બીટા લિંક માટે તમારો ઇમેઇલ તપાસો. તમારા નેટવર્કમાં અન્ય મહિલાઓ સાથે શેર કરો—સાથે મળીને આપણો અવાજ મજબૂત છે.",
      stats: [
        "2022માં, ભારતમાં મહિલાઓ વિરુદ્ધ અપરાધના 4,45,000 થી વધુ કેસ સત્તાવાર રીતે નોંધાયા હતા.",
        "ઘરેલુ હિંસાનો સામનો કરતી 70% થી વધુ મહિલાઓ ક્યારેય મદદ માંગતી નથી—કારણ કે સિસ્ટમ તેમને નિરાશ કરે છે. સહેલી નથી કરતી.",
        "2024 ના ગ્લોબલ જેન્ડર ગેપ રિપોર્ટમાં ભારત 146 દેશોમાં 129મા ક્રમે છે.",
        "માત્ર 14% ભારતીય મહિલાઓ પાસે ઔપચારિક સંપત્તિના અધિકારો છે, જે આર્થિક સ્વતંત્રતાને નબળી પાડે છે.",
        "NCW ને દર મહિને હજારો SOS ફરિયાદો મળે છે, છતાં ઘણી પર તપાસ થતી નથી."
      ],
      cards: [
        { title: "સંપૂર્ણ ગોપનીયતા", desc: "તમે જે પણ શેર કરો છો તે એન્ડ-ટુ-એન્ડ એન્ક્રિપ્ટેડ છે. કોઈ લૉગ્સ નહીં. કોઈ દેખરેખ નહીં. માત્ર તમે અને તમારી સુરક્ષા." },
        { title: "તમારી ભાષામાં", desc: "તમે હિન્દી, ગુજરાતી, મરાઠી કે અંગ્રેજી બોલતા હોવ—સહેલી તમારી વાત સમજે છે. તમારી ભાષા, તમારી વાર્તા." },
        { title: "કાનૂની રીતે માન્ય", desc: "તમારા શબ્દો કોર્ટ માટે તૈયાર કાનૂની ફરિયાદ બની જાય છે. અમે કાનૂની ભાષા સંભાળીએ છીએ; તમે તમારી શક્તિ સંભાળો છો." }
      ]
    },
    mr: {
      trustBadge: "✓ गोपनीयता-प्रथम | ✓ बहुभाषिक समर्थन | ✓ कायदेशीररित्या वैध",
      heroTitle: "तुमचा आवाज.",
      heroHighlight: "तुमची ताकद.",
      heroSub: "तुमचे अधिकार.",
      heroCTA: "सुरक्षितपणे बोलणे सुरू करा",
      heroSecondaryCTA: "सेफमोड कसे काम करते ते पहा →",
      whyTitle: "तुमचा आवाज का महत्त्वाचा आहे",
      whySub: "महिलांना गप्प करणाऱ्या भिंती तोडणे.",
      pillarTitle: "सुरक्षेची रचना",
      pillarSub: "सुरक्षेचे पाच भक्कम स्तंभ",
      pillarContext: "सहेली संकटाची ओळख, सरकारी योजना आणि कायदेशीर मसुदा या सर्व गोष्टी एकाच व्हॉइस-फर्स्ट सिस्टीममध्ये जोडते. आम्ही प्रत्येक पावलावर तुमचे संरक्षण कसे करतो ते पहा.",
      aiTitle: "ऐकणारे AI. काम करणारी सिस्टीम.",
      aiText: "ज्या 70% महिलांना सर्वात जास्त मदतीची गरज असते, त्यांच्यासाठी सिस्टीम कुचकामी ठरते. सहेली ही दरी भरून काढते—व्हॉईस एआय वापरून संकट ओळखते आणि कोर्टासाठी तयार तक्रारी तयार करते.",
      builtByLabel: "महिला तंत्रज्ञांनी बनवलेले, महिलांच्या सुरक्षेसाठी.",
      waitlistTitle: "बदलाचा आवाज व्हा",
      waitlistSub: "सुरक्षा ही केवळ एक अपेक्षा न ठेवता ती प्रत्यक्षात आणणाऱ्या पहिल्या समुदायाचा भाग व्हा.",
      formTitle: "चळवळीत सामील व्हा",
      nameLabel: "पूर्ण नाव",
      emailLabel: "ईमेल पत्ता",
      dropdownLabel: "तुम्हाला सहेली बद्दल कसे समजले?",
      checkboxBeta: "मला सेफमोड बीटाचा अर्ली ॲक्सेस हवा आहे",
      checkboxCommunity: "मला संस्थापक पीअर नेटवर्कचा भाग व्हायचे आहे",
      reserveBtn: "आत्ताच अर्ली ॲक्सेस मिळवा",
      subReassurance: "आम्ही तुमच्या गोपनीयतेचा आदर करतो. कधीही अनसबस्क्राईब करा.",
      successTitle: "🎉 चळवळीत आपले स्वागत आहे!",
      successSub: "सेफमोड बीटा लिंकसाठी तुमचा ईमेल तपासा. तुमच्या ओळखीच्या इतर महिलांसोबत शेअर करा—एकत्रितपणे आपला आवाज अधिक बुलंद आहे.",
      stats: [
        "2022 मध्ये, भारतात महिलांवरील गुन्ह्यांची 4,45,000 पेक्षा जास्त प्रकरणे अधिकृतपणे नोंदवली गेली.",
        "कौटुंबिक हिंसेचा सामना करणाऱ्या 70% पेक्षा जास्त महिला कधीही मदत मागत नाहीत—कारण सिस्टीम त्यांना निराश करते. सहेली नाही.",
        "2024 च्या ग्लोबल जेंडर गॅप रिपोर्टमध्ये भारत 146 देशांपैकी 129 व्या क्रमांकावर आहे.",
        "केवळ 14% भारतीय महिलांकडे मालमत्तेचे अधिकृत अधिकार आहेत, ज्यामुळे आर्थिक स्वावलंबन धोक्यात येते.",
        "NCW ला दर महिन्याला हजारो SOS तक्रारी मिळतात, तरीही बऱ्याच तक्रारींची चौकशी होत नाही."
      ],
      cards: [
        { title: "संपूर्ण गोपनीयता", desc: "तुम्ही जे काही शेअर करता ते एंड-टू-एंड एन्क्रिप्टेड असते. कोणतेही लॉग नाही. कोणतीही पाळत नाही. फक्त तुम्ही आणि तुमची सुरक्षा." },
        { title: "तुमच्या भाषेत", desc: "तुम्ही हिंदी, गुजराती, मराठी किंवा इंग्रजी बोलत असाल—सहेली तुमची गोष्ट समजते. तुमची भाषा, तुमची कथा." },
        { title: "कायदेशीररित्या वैध", desc: "तुमचे शब्द थेट कोर्टासाठी तयार कायदेशीर तक्रार बनतात. आम्ही कायदेशीर भाषा हाताळतो; तुम्ही तुमची ताकद." }
      ]
    }
  };

  const currentContent = content[lang] || content['en'];
  const activeStats = currentContent.stats;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % activeStats.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeStats.length]);

  // DB INTEGRATION FUNCTION
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      name: e.target.fullname.value,
      email: e.target.email.value,
      source: e.target.source.value,
      beta_optin: e.target.beta.checked,
      community_optin: e.target.community.checked
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        console.error("Failed to insert into Neon DB");
      }
    } catch (error) {
      console.error("Network error saving to DB:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-8 max-w-7xl mx-auto overflow-x-hidden bg-[#F9FAFB]">
      
      {/* 1️⃣ HERO SECTION */}
      <header className="px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200/60 px-3 py-1 rounded-full text-slate-500 font-mono text-[11px] font-bold tracking-wide shadow-sm mx-auto lg:mx-0">
            {currentContent.trustBadge}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 font-serif">
            {currentContent.heroTitle}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 font-sans">
              {currentContent.heroHighlight}
            </span><br />
            {currentContent.heroSub}
          </h1>

          <div className="h-32 sm:h-28 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden flex items-center mx-auto lg:mx-0 max-w-2xl text-left">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium transition-all duration-500">
               "{activeStats[currentStat]}"
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={() => navigate('/safemode')} 
              className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] transform flex items-center justify-center gap-3"
            >
              {currentContent.heroCTA} <Mic size={16} />
            </button>
            <a href="#explain" className="text-slate-500 hover:text-slate-800 text-xs font-bold tracking-wider uppercase transition-colors py-2 flex items-center gap-1">
              {currentContent.heroSecondaryCTA}
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center relative w-full max-w-sm sm:max-w-md lg:max-w-none">
           <div className="absolute inset-0 bg-rose-500/5 blur-[90px] sm:blur-[120px] rounded-full w-64 h-64 sm:w-[380px] sm:h-[380px] m-auto pointer-events-none"></div>
           <div onClick={() => navigate('/safemode')} className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-slate-200/80 flex items-center justify-center relative bg-white shadow-xl cursor-pointer group transition-all duration-300 hover:border-rose-500/40">
              <div className="absolute inset-0 rounded-full border border-rose-500/20 scale-125 animate-[ping_3.5s_linear_infinite] opacity-40 pointer-events-none"></div>
              <div className="absolute inset-0 rounded-full border border-rose-400/20 scale-110 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none"></div>
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-slate-50 flex flex-col items-center justify-center border border-slate-100 shadow-inner z-10 transition-transform duration-300 group-hover:scale-105 active:scale-95">
                 <Mic className="text-rose-500 drop-shadow-[0_2px_8px_rgba(225,29,72,0.25)] w-14 h-14 sm:w-20 sm:h-20 transition-colors group-hover:text-rose-600" />
                 <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Tap to monitor</span>
              </div>
           </div>
        </div>
      </header>

      {/* 2️⃣ "WHY YOUR VOICE MATTERS" SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-xs font-bold text-rose-500 tracking-widest uppercase mb-2">{currentContent.whyTitle}</h2>
          <h3 className="text-center text-3xl sm:text-4xl font-black text-slate-900 mb-12 md:mb-16 tracking-tight font-serif">{currentContent.whySub}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {currentContent.cards.map((card, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-6 sm:p-10 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-t-4 border-t-rose-500/20">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 text-rose-500">
                  {idx === 0 ? <Lock size={22} /> : idx === 1 ? <Globe size={22} /> : <Scale size={22} />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">{card.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm sm:text-base">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ "FIVE PILLARS OF PROTECTION" BENTO ARCHITECTURE */}
      <section id="explain" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-rose-500 tracking-widest uppercase">{currentContent.pillarTitle}</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">{currentContent.pillarSub}</h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{currentContent.pillarContext}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-6">
            <BentoCard num="#1" onClick={() => navigate('/safemode')} icon={<ShieldAlert size={22} />} title="SafeMode OS" benefit="Detects distress signals in real-time" desc="Continuous background audio parsing node. Auto-dispatches tracking location parameters instantly." />
            <BentoCard num="#2" onClick={() => navigate('/haqfinder')} icon={<FileText size={22} />} title="HaqFinder Engine" benefit="Matches your legal entitlements" desc="A voice-activated multi-jurisdictional query tool searching central welfare programs." />
            <BentoCard num="#3" onClick={() => navigate('/boldo')} icon={<Mic size={22} />} title="BolDo Scribe" benefit="Generates court-ready text scripts" desc="Transforms real-time verbal testimonies into structurally standardized police grievance templates." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <BentoCard num="#4" onClick={() => navigate('/pehchaan')} icon={<Users size={22} />} title="Pehchaan Network" benefit="Mutual aid & community support" desc="Connect with verified local helpers, read survival stories, and find strength in a secure peer network." />
            <BentoCard num="#5" onClick={() => navigate('/mystory')} icon={<Fingerprint size={22} />} title="MyStory Dashboard" benefit="Track your healing journey" desc="A secure, private ledger to log milestones, manage documents, and celebrate your path from victim to survivor." />
          </div>

          <div className="pt-6 max-w-3xl mx-auto text-center hidden sm:block">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">Ecosystem User Roadmap Flow</p>
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-inner">
              <span className="text-rose-600 font-bold">Detection</span>
              <span className="text-slate-300">→</span>
              <span>Resources</span>
              <span className="text-slate-300">→</span>
              <span>Legal Scribe</span>
              <span className="text-slate-300">→</span>
              <span>Community Hub</span>
              <span className="text-slate-300">→</span>
              <span>My Journey</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4️⃣ "AI THAT LISTENS" STATEMENT CONSOLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm">
        <div className="max-w-6xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-inner">
          <div className="hidden md:block md:w-5/12 bg-slate-100 border-r border-slate-200 relative overflow-hidden min-h-[300px]">
            <img 
              src="/dashboard.png" 
              alt="Saheli Dashboard" 
              className="absolute inset-0 w-full h-full object-cover object-center scale-[1.35] transform hover:scale-[1.45] transition-transform duration-700" 
            />
            <div className="absolute w-56 h-56 bg-rose-500/10 rounded-full blur-[60px] animate-pulse pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-left space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">{currentContent.aiTitle}</h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-prose">{currentContent.aiText}</p>
            <div className="pt-2 border-t border-slate-200 w-full">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-bold">{currentContent.builtByLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ DB-CONNECTED REGISTRATION HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 lg:p-16 shadow-md flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
          
          <div className="flex-1 space-y-4 md:space-y-6 w-full text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">{currentContent.waitlistTitle}</h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed">{currentContent.waitlistSub}</p>
            <div className="grid grid-cols-2 gap-2 pt-2 text-left text-[11px] font-mono font-bold text-slate-500">
              <div>✓ Early Access Beta</div>
              <div>✓ Founding Cluster Access</div>
              <div>✓ Multilingual Updates</div>
              <div>✓ Zero Spam Matrix</div>
            </div>
          </div>

          <div className="flex-1 w-full bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-inner min-h-[320px] flex items-center justify-center">
            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} className="w-full space-y-4 text-left">
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{currentContent.formTitle}</p>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{currentContent.nameLabel}</label>
                  <input name="fullname" type="text" required placeholder="Jane Doe" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-rose-500 font-medium text-sm transition-all focus:ring-1 focus:ring-rose-500/20" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{currentContent.emailLabel}</label>
                  <input name="email" type="email" required placeholder="jane@example.com" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-rose-500 font-medium text-sm transition-all focus:ring-1 focus:ring-rose-500/20" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{currentContent.dropdownLabel}</label>
                  <select name="source" required className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-600 focus:outline-none focus:border-rose-500 font-bold text-xs">
                    <option value="">Select Option</option>
                    <option value="search">Search Engine</option>
                    <option value="social">Social Channels</option>
                    <option value="referral">Word of Mouth</option>
                    <option value="hackathon">Hackathon Track Page</option>
                  </select>
                </div>

                <div className="space-y-2 pt-1 font-sans text-xs font-semibold text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="beta" type="checkbox" defaultChecked className="accent-rose-500 rounded" /> <span>{currentContent.checkboxBeta}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="community" type="checkbox" className="accent-rose-500 rounded" /> <span>{currentContent.checkboxCommunity}</span>
                  </label>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2">
                  {isLoading ? "Writing to Database..." : currentContent.reserveBtn}
                </button>
                <p className="text-center text-[10px] text-slate-400 font-medium">{currentContent.subReassurance}</p>
              </form>
            ) : (
              <div className="text-center space-y-4 max-w-sm p-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 font-serif">{currentContent.successTitle}</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{currentContent.successSub}</p>
                <div className="flex gap-2 justify-center pt-2">
                  <button type="button" className="bg-[#25D366] text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-sm">WhatsApp</button>
                  <button type="button" className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg">Copy Link</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6️⃣ COMPREHENSIVE REGIONAL ACCESS HELPLINE FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 text-sm font-sans mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-10 md:gap-8 items-start border-b border-slate-200 pb-12">
            
            <div className="md:col-span-2 space-y-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white"><Mic size={14} /></div>
                <span className="text-lg font-black font-serif tracking-widest text-slate-900">SAHELI</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed text-xs sm:text-sm">Employing speech intelligence frameworks to lower barriers obstructing constitutional rights and local safety access pipelines.</p>
              <div className="text-xs font-mono font-bold text-slate-400">Contact: <a href="mailto:hello@saheli.app" className="hover:text-rose-500 transition-colors">hello@saheli.app</a></div>
            </div>

            <div className="space-y-3 text-left">
              <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400">Product Matrix</h4>
              <ul className="space-y-2 text-xs font-bold text-slate-500">
                <li><Link to="/safemode" className="hover:text-rose-500 transition-colors">SafeMode OS</Link></li>
                <li><Link to="/haqfinder" className="hover:text-rose-500 transition-colors">HaqFinder Engine</Link></li>
                <li><Link to="/boldo" className="hover:text-rose-500 transition-colors">BolDo Scribe</Link></li>
              </ul>
            </div>

            <div className="space-y-3 text-left">
              <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400">Governance</h4>
              <ul className="space-y-2 text-xs font-bold text-slate-500">
                <li><Link to="/pehchaan" className="hover:text-rose-500 transition-colors">Pehchaan Network</Link></li>
                <li><Link to="/mystory" className="hover:text-rose-500 transition-colors">MyStory Dashboard</Link></li>
              </ul>
            </div>

            <div className="space-y-3 text-left">
              <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400">Legal Directives</h4>
              <ul className="space-y-2 text-xs font-bold text-slate-500">
                <li><a href="#" className="hover:text-rose-500 transition-colors flex items-center gap-1">Privacy Engine <ExternalLink size={10}/></a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Data Rights Ledger</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Accessibility Sheet</a></li>
              </ul>
            </div>

            <div className="space-y-3 text-left">
              <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400">Architecture</h4>
              <p className="text-[11px] leading-relaxed font-medium font-mono text-slate-400">Vite // React // Tailwind<br />FastAPI Backend Core<br />Groq Whisper Systems</p>
            </div>
          </div>

          <div className="my-8 bg-red-50 border border-red-200 rounded-2xl p-5 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <p className="text-xs font-black tracking-wider uppercase text-red-700 flex items-center gap-1.5"><AlertTriangle size={14} /> Emergency Crisis Resolution Assets</p>
              <p className="text-slate-600 text-xs font-medium">If you are facing immediate physiological danger, bypass telemetry testing channels and use standard communication routing immediately.</p>
            </div>
            <div className="flex flex-wrap gap-4 font-mono text-xs font-bold text-red-600 shrink-0">
              <span className="flex items-center gap-1 bg-white border border-red-100 rounded-xl px-3 py-1.5 shadow-sm"><Phone size={12}/> National Helpline: 181</span>
              <span className="flex items-center gap-1 bg-white border border-red-100 rounded-xl px-3 py-1.5 shadow-sm"><Phone size={12}/> Police: 112</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono font-bold text-slate-400 pt-4 gap-2">
            <p>&copy; {new Date().getFullYear()} SAHELI Infrastructure Core. SamaSocial AWAAZ Submission.</p>
            <p>Made with 💗 by women technologists for institutional safety.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const BentoCard = ({ num, icon, title, benefit, desc, onClick }) => (
  <div onClick={onClick} className="flex flex-col group h-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-rose-500/40 cursor-pointer shadow-sm transition-all hover:shadow-md text-left relative overflow-hidden">
    <span className="absolute top-4 right-6 font-mono text-[10px] font-black text-slate-300 group-hover:text-rose-500/40 transition-colors">{num}</span>
    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 text-rose-500 group-hover:scale-105 transition-transform">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 mb-0.5 font-serif">{title}</h3>
    <p className="text-rose-500 text-[10px] font-mono font-bold uppercase tracking-wider mb-3">{benefit}</p>
    <p className="text-slate-500 font-medium leading-relaxed text-xs sm:text-sm flex-grow">{desc}</p>
  </div>
);