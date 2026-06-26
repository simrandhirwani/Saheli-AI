import React, { useState } from 'react';
import { Route, CheckCircle2, ChevronDown, ChevronUp, Info, Globe, Sparkles, FileText, Target, ShieldAlert, Check } from 'lucide-react';
import { useLanguage } from '../App';

export default function MyStory() {
  const { lang } = useLanguage();
  const [selectedProfile, setSelectedProfile] = useState('Priya');
  const [expandedPhase, setExpandedPhase] = useState(2); // Keeps Phase 2 open for immediate demo impact

  // 1. Fully Localized Interface Headers
  const labels = {
    en: {
      title: "My Story Dashboard",
      subtitle: "Your integrated path from crisis to freedom. Track end-to-end progress, map connected Saheli system arrays, and display verification metrics.",
      profileSelect: "Active Case File",
      overallProgress: "Overall Journey Progress",
      metricsHeader: "System Impact Metrics For Judges",
      timelineCap: "Timeline completion",
      impactCap: "Overall impact",
      communityCap: "Saheli Platform Impact",
      outcomeCap: "Outcome Metrics",
      scaleNotice: "Note: This is an interactive demo dashboard. As we scale, every user will have a fully personalized, automated journey tracker synced directly with their active account status and case logs.",
      expansionBanner: "We are expanding to your cities soon! If you can't find your city, use the 'Other Cities' hub to connect with our global support matrix."
    },
    hi: {
      title: "मेरी कहानी डैशबोर्ड",
      subtitle: "संकट से स्वतंत्रता तक का आपका एकीकृत मार्ग। एंड-टू-एंड प्रगति को ट्रैक करें, जुड़े हुए सहेली सिस्टम को मैप करें, और सत्यापन मेट्रिक्स प्रदर्शित करें।",
      profileSelect: "सक्रिय केस फ़ाइल",
      overallProgress: "समग्र यात्रा प्रगति",
      metricsHeader: "जजों के लिए सिस्टम प्रभाव मेट्रिक्स",
      timelineCap: "समयसीमा पूर्णता",
      impactCap: "समग्र प्रभाव",
      communityCap: "सहेली प्लेटफॉर्म प्रभाव",
      outcomeCap: "परिणाम मेट्रिक्स",
      scaleNotice: "नोट: यह एक इंटरैक्टिव डेमो डैशबोर्ड है। जैसे-जैसे हम स्केल करेंगे, प्रत्येक उपयोगकर्ता के पास उनके सक्रिय खाता स्थिति और केस लॉग के साथ सीधे समन्वयित एक पूरी तरह से व्यक्तिगत यात्रा ट्रैकर होगा।",
      expansionBanner: "हम जल्द ही आपके शहरों में विस्तार कर रहे हैं! यदि आपको अपना शहर नहीं मिलता है, तो हमारे वैश्विक सहायता नेटवर्क से जुड़ने के लिए 'अन्य शहर' हब का उपयोग करें।"
    },
    gu: {
      title: "મારી વાર્તા ડેશબોર્ડ",
      subtitle: "સંકટથી સ્વતંત્રતા સુધીનો તમારો સંકલિત માર્ગ. એન્ડ-ટુ-એન્ડ પ્રગતિને ટ્રૅક કરો, જોડાયેલા સહેલી સિસ્ટમ એરેને મેપ કરો અને વેરિફિકેશન મેટ્રિક્સ દર્શાવો.",
      profileSelect: "સક્રિય કેસ ફાઇલ",
      overallProgress: "એકંદર સફર પ્રગતિ",
      metricsHeader: "જજો માટે સિસ્ટમ પ્રભાવ મેટ્રિક્સ",
      timelineCap: "સમયરેખા પૂર્ણતા",
      impactCap: "એકંદર અસર",
      communityCap: "સહેલી પ્લેટફોર્મ પ્રભાવ",
      outcomeCap: "પરિણામ મેટ્રિક્સ",
      scaleNotice: "નોંધ: આ એક ઇન્ટરેક્ટિવ ડેમો ડેશબોર્ડ છે. જેમ જેમ આપણે સ્કેલ કરીશું તેમ તેમ દરેક વપરાશકર્તા પાસે તેમના સક્રિય એકાઉન્ટ સ્ટેટસ અને કેસ લોગ સાથે સીધા સિંક થયેલ સંપૂર્ણ વ્યક્તિગત જર્ની ટ્રેકર હશે.",
      expansionBanner: "અમે ટૂંક સમયમાં તમારા શહેરોમાં વિસ્તરણ કરી રહ્યા છીએ! જો તમને તમારું કસ્ટમ શહેર ન મળે, તો અમારા વૈશ્વિક સપોર્ટ મેટ્રિક્સ સાથે જોડાવા માટે 'અન્ય શહેરો' હબનો ઉપયોગ કરો."
    },
    mr: {
      title: "माझी गोष्ट डॅशबोर्ड",
      subtitle: "संकटातून स्वातंत्र्याकडे जाण्याचा तुमचा एकात्मिक मार्ग. एंड-टू-एंड प्रगतीचा मागोवा घ्या, जोडलेल्या सहेली सिस्टम मॅप करा आणि मेट्रिक्स प्रदर्शित करा.",
      profileSelect: "सक्रिय केस फाईल",
      overallProgress: "एकूण प्रवास प्रगती",
      metricsHeader: "जजांसाठी सिस्टम प्रभाव मेट्रिक्स",
      timelineCap: "वेळापत्रक पूर्णता",
      impactCap: "एकूण प्रभाव",
      communityCap: "सहेली प्लॅटफॉर्म प्रभाव",
      outcomeCap: "परिणाम मेट्रिक्स",
      scaleNotice: "टीप: हा एक परस्परसंवादी डेमो डॅशबोर्ड आहे. आम्ही जसजसे स्केल करू, तसतसे प्रत्येक वापरकर्त्याकडे त्यांच्या सक्रिय खाते स्थिती आणि केस लॉगसह थेट जोडलेला संपूर्ण वैयक्तिकृत प्रवास ट्रॅकर असेल.",
      expansionBanner: "आम्ही लवकरच तुमच्या शहरांमध्ये विस्तार करत आहोत! तुम्हाला तुमचे शहर आढळले नसल्यास, आमच्या जागतिक मदत नेटवर्कशी जोडण्यासाठी 'इतर शहरे' हब वापरा."
    }
  };

  // 2. High-Density, Completely Translated Structural Journey Dataset
  const profilesDataset = {
    en: {
      Priya: {
        name: "Priya S.", age: 32, city: "Ahmedabad", statusText: "THRIVING (1 Year Free)", progress: 100,
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        impact: "From victim → survivor → helper", timeline: "12 months (on track)",
        platformMetrics: [
          "BolDo: Converted 4:32 voice → court-ready doc (0 legal knowledge needed)",
          "Pehchaan: Connected to 3 helpers + 1 mentor",
          "HaqFinder: Found 8 resources (legal, shelter, training)",
          "SafeMode: 247 safety check-ins over 12 months",
          "Community: 47 women in Phase 2, 23 in healing circle"
        ],
        outcomeMetrics: [
          "Days to file FIR: 20 days (vs. average 180 days without help)",
          "Cost: ₹0 out-of-pocket (via legal aid + NGO support)",
          "Community impact: Now mentoring 6 women",
          "Economic impact: ₹25,000/month new income (from ₹0)",
          "Psychological impact: From 'can't survive' to 'building life'"
        ],
        phases: [
          { id: 1, name: "Phase 1: Decision & Clarity", duration: "2 days (Dec 23-25, 2024)", status: "completed", metrics: "Time Saved: Discovered help in 48 hours", steps: [
            { text: "Recognized the problem", meta: "Dec 23, 2024, 2:15 PM | Quote: 'I couldn't take it anymore'" },
            { text: "Discovered Saheli Platform", meta: "Dec 24, 2024, 9:30 AM | Via: Neighbor Priya WhatsApp share" },
            { text: "Read Survival Stories (Pehchaan)", meta: "Dec 24, 2024, 2:00 PM | Story read: Anjali's 18-month journey | Time spent: 23 minutes" }
          ]},
          { id: 2, name: "Phase 2: Legal Action", duration: "3 weeks (Jan 15 - Feb 5, 2025)", status: "completed", metrics: "Success Rate: 100% (FIR filed)", steps: [
            { text: "Used BolDo to draft legal complaint", meta: "Jan 15, 2025 | Rec: 4:32 mins | Language: Gujarati | Clarity score: 98%" },
            { text: "Generated court-ready document", meta: "Jan 16, 2025 | File size: 2.3 MB | Legal sections mapped: 498A, 406, PWDVA" },
            { text: "Found vetted local lawyer (Pehchaan)", meta: "Jan 18, 2025 | Lawyer: Anjali Desai (Verified ⭐⭐⭐⭐⭐) | Consultation: Free" },
            { text: "Filed FIR at police station", meta: "Jan 20, 2025 | Ahmedabad East Police Station | FIR ID: 2025-AHM-08847" },
            { text: "Got protection order", meta: "Feb 5, 2025 | Interim protection order | Issued by: District Court, Ahmedabad" }
          ]},
          { id: 3, name: "Phase 3: Safety & Healing", duration: "4 months (Feb 6 - Jun 15, 2025)", status: "completed", metrics: "Success Metrics: Shelter secured, counseling active", steps: [
            { text: "Found safe shelter (HaqFinder + Pehchaan)", meta: "Feb 7, 2025 | Shelter: Aravind Women's Home | Cost: Subsidized by NGO" },
            { text: "Enrolled in trauma counseling", meta: "Feb 15, 2025 | Counselor: Divya Patel (Verified therapist) | Progress: 85% healed" },
            { text: "Connected with support circle (Pehchaan)", meta: "Feb 20, 2025 | Group: 'Healing from Domestic Violence' | Members: 23 women" },
            { text: "Got legal aid approved", meta: "Mar 10, 2025 | Approved: NALSA legal aid scheme | Cost: Zero out-of-pocket" },
            { text: "Completed job skill training", meta: "Jun 1, 2025 | Program: Digital literacy + tailoring | Cost: Free (NGO sponsored)" }
          ]},
          { id: 4, name: "Phase 4: Rebuilding & Independence", duration: "6 months (Jun 15 - Dec 15, 2025)", status: "completed", metrics: "Success Metrics: Job secured, moved to own place", steps: [
            { text: "Got first job", meta: "Jul 15, 2025 | Role: Digital literacy instructor | Salary: ₹15,000/month | Quote: 'I cried. I'm earning.'" },
            { text: "Moved to own place", meta: "Sep 15, 2025 | Location: 1BHK, Ahmedabad | Rent: ₹5,000 | Quote: 'This is mine.'" },
            { text: "Daughter re-enrolled in school", meta: "Aug 2025 | Class: 9th standard | Progress: First rank in class" }
          ]},
          { id: 5, name: "Phase 5: Thriving & Mentorship", duration: "6 months (Dec 2025 - Jun 2026)", status: "completed", metrics: "Success Metrics: Business start, mentoring others", steps: [
            { text: "Started small tailoring business", meta: "Jan 2026 | Model: Home-based | Income: ₹25,000/month | Employees: 2 women" },
            { text: "Became Pehchaan community mentor", meta: "Mar 2026 | Role: Verified helper ⭐⭐⭐⭐⭐ | Women mentored: 6" },
            { text: "1 YEAR OF FREEDOM", meta: "Dec 23, 2025 | Status: Thriving, not just surviving | Quote: 'I'm finally alive.'" }
          ]}
        ]
      },
      Anjali: {
        name: "Anjali R.", age: 28, city: "Surat", statusText: "IN PROGRESS (Phase 3)", progress: 62,
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        impact: "Transitioning to safety and employment modules", timeline: "6 months in safar",
        platformMetrics: [
          "BolDo: Converted 12:33 voice → court-ready doc (Hindi narration)",
          "Pehchaan: Assigned local vetted advocate in 3 hours",
          "Community: 34 women in Surat, 12 in specific healing circle",
          "SafeMode: Active location telemetry tracking verified"
        ],
        outcomeMetrics: [
          "Days to generate brief file: 1 day",
          "FIR Status: Registered successfully under local desk keys",
          "Protection Status: Restraining order granted and enforced",
          "Current status: 2 dynamic job interviews pending"
        ],
        phases: [
          { id: 1, name: "Phase 1: Decision & Clarity", duration: "2 days (Nov 5-7, 2024)", status: "completed", metrics: "Time Saved: Discovered help in 48 hours", steps: [
            { text: "Recognized problem", meta: "Nov 5, 2024 | Context: Workplace harassment + blackmail" },
            { text: "Discovered Saheli", meta: "Nov 6, 2024 | Found via digital legal safety directories" },
            { text: "Read stories", meta: "Nov 7, 2024 | Spent 45 min verifying local success rates" }
          ]},
          { id: 2, name: "Phase 2: Legal Action", duration: "4 weeks (Nov 15 - Dec 20, 2024)", status: "completed", metrics: "Success Rate: 100% (FIR filed)", steps: [
            { text: "Used BolDo", meta: "Nov 15, 2024 | 12:33 min recording in Hindi" },
            { text: "Generated doc", meta: "Nov 16, 2024 | Formatted matching penal code references" },
            { text: "Found lawyer", meta: "Nov 18, 2024 | Local advocate assigned (Verified ⭐⭐⭐⭐)" },
            { text: "Filed complaint", meta: "Nov 25, 2024 | Surat Desk | FIR ID: 2025-SUR-0345" },
            { text: "Got restraining order", meta: "Dec 20, 2024 | Issued by local jurisdictional magistrate" }
          ]},
          { id: 3, name: "Phase 3: Safety & Healing", duration: "Ongoing (Current)", status: "active", metrics: "Status: Therapy active, job track processing", steps: [
            { text: "Therapy sessions", meta: "8/12 completed (67% progress)" },
            { text: "Support group", meta: "'Workplace Harassment Survivors' (12 women)" },
            { text: "Job transition", meta: "In progress (2 interview offers pending)" }
          ]},
          { id: 4, name: "Phase 4: Rebuilding & Independence", duration: "Expected Aug 2026", status: "locked", metrics: "Locked until Phase 3 parameter validation", steps: [
            { text: "Initialize independent employment tracking", meta: "Awaiting final interview confirmation tokens" },
            { text: "Deploy full SafeMode geofence alert shields", meta: "Will configure upon independent residential move" }
          ]}
        ]
      }
    },
    hi: {
      Priya: {
        name: "प्रिया एस.", age: 32, city: "अहमदाबाद", statusText: "सफल (1 वर्ष मुक्त)", progress: 100,
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        impact: "पीड़ित से उत्तरजीवी से मेंटर तक", timeline: "12 महीने",
        platformMetrics: [
          "बोल-दो: 4:32 मिनट की आवाज को अदालती दस्तावेज़ में बदला (कोई कानूनी ज्ञान आवश्यक नहीं)",
          "पहचान: 3 स्थानीय सहायकों और 1 पेशेवर मेंटर से सुरक्षित रूप से जुड़ी",
          "हक-फाइंडर: कानूनी सहायता और आश्रय में 8 संसाधन मिले",
          "सेफमोड: 12 महीनों में 247 सुरक्षित चेक-इन लॉग किए गए",
          "समुदाय: चरण 2 में 47 महिलाएं, हीलिंग सर्कल में 23"
        ],
        outcomeMetrics: [
          "एफआईआर दर्ज करने में दिन: 20 दिन (बिना मदद के औसत 180 दिन)",
          "लागत: ₹0 आउट-ऑफ़-पॉकेट (कानूनी सहायता + एनजीओ के माध्यम से)",
          "सामुदायिक प्रभाव: अब 6 महिलाओं को मेंटर कर रही हैं",
          "आर्थिक प्रभाव: ₹25,000/माह नई आय (₹0 से)",
          "मनोवैज्ञानिक प्रभाव: 'जीवित नहीं रह सकती' से 'जीवन का निर्माण' तक"
        ],
        phases: [
          { id: 1, name: "चरण 1: निर्णय और स्पष्टता", duration: "2 दिन", status: "completed", metrics: "समय की बचत: 48 घंटों में मदद मिली", steps: [
            { text: "समस्या को पहचाना", meta: "23 दिसंबर 2024, 2:15 PM | उद्धरण: 'मैं अब और नहीं सह सकती थी'" },
            { text: "सहेली प्लेटफॉर्म खोजा", meta: "24 दिसंबर 2024, 9:30 AM | माध्यम: पड़ोसी का व्हाट्सएप शेयर" },
            { text: "पहचान पर कहानियाँ पढ़ीं", meta: "24 दिसंबर 2024, 2:00 PM | कहानी: अंजलि की 18 महीने की यात्रा" }
          ]},
          { id: 2, name: "चरण 2: कानूनी कार्रवाई", duration: "3 सप्ताह", status: "completed", metrics: "सफलता दर: 100% (एफआईआर दर्ज)", steps: [
            { text: "कानूनी शिकायत के लिए बोल-दो का उपयोग किया", meta: "15 जनवरी 2025 | अवधि: 4:32 मिनट | भाषा: गुजराती" },
            { text: "अदालत के लिए तैयार दस्तावेज़", meta: "16 जनवरी 2025 | धाराएँ: 498A, 406, PWDVA" },
            { text: "सत्यापित वकील मिला", meta: "18 जनवरी 2025 | वकील: अंजलि देसाई (सत्यापित ⭐⭐⭐⭐⭐)" },
            { text: "पुलिस स्टेशन में एफआईआर", meta: "20 जनवरी 2025 | अहमदाबाद पूर्व पुलिस स्टेशन | एफआईआर आईडी: 2025-AHM-08847" },
            { text: "सुरक्षा आदेश मिला", meta: "5 फरवरी 2025 | जारीकर्ता: जिला न्यायालय, अहमदाबाद" }
          ]},
          { id: 3, name: "चरण 3: सुरक्षा और हीलिंग", duration: "4 महीने", status: "completed", metrics: "सफलता: आश्रय सुरक्षित, परामर्श सक्रिय", steps: [
            { text: "सुरक्षित आश्रय मिला", meta: "7 फरवरी 2025 | आश्रय: अरविंद महिला गृह | लागत: एनजीओ द्वारा अनुदानित" },
            { text: "ट्रॉमा काउंसलिंग", meta: "15 फरवरी 2025 | काउंसलर: दिव्या पटेल | प्रगति: 85% सुधार" },
            { text: "सपोर्ट सर्कल से जुड़ी", meta: "20 फरवरी 2025 | समूह: 'घरेलू हिंसा से उबरना' | सदस्य: 23 महिलाएं" },
            { text: "कानूनी सहायता स्वीकृत", meta: "10 मार्च 2025 | स्वीकृत: NALSA योजना | लागत: शून्य" },
            { text: "कौशल प्रशिक्षण पूरा किया", meta: "1 जून 2025 | कार्यक्रम: डिजिटल साक्षरता + सिलाई" }
          ]},
          { id: 4, name: "चरण 4: पुनर्निर्माण और स्वतंत्रता", duration: "6 महीने", status: "completed", metrics: "सफलता: नौकरी मिली, अपने घर में शिफ्ट", steps: [
            { text: "पहली नौकरी मिली", meta: "15 जुलाई 2025 | भूमिका: डिजिटल साक्षरता प्रशिक्षक | वेतन: ₹15,000/माह" },
            { text: "अपने घर में शिफ्ट", meta: "15 सितंबर 2025 | 1BHK, अहमदाबाद | किराया: ₹5,000" },
            { text: "बेटी का स्कूल में दाखिला", meta: "अगस्त 2025 | प्रगति: कक्षा में प्रथम स्थान" }
          ]},
          { id: 5, name: "चरण 5: सफलता और मेंटरशिप", duration: "6 महीने", status: "completed", metrics: "सफलता: व्यवसाय शुरू, अन्य की मदद", steps: [
            { text: "छोटा सिलाई व्यवसाय शुरू", meta: "जनवरी 2026 | आय: ₹25,000/माह | कर्मचारी: 2 महिलाएं" },
            { text: "पहचान मेंटर बनीं", meta: "मार्च 2026 | भूमिका: सत्यापित सहायक ⭐⭐⭐⭐⭐ | मेंटर की गई महिलाएं: 6" },
            { text: "आजादी का 1 साल", meta: "23 दिसंबर 2025 | उद्धरण: 'मैं आखिरकार जीवित महसूस कर रही हूँ।'" }
          ]}
        ]
      },
      Anjali: {
        name: "अंजलि आर.", age: 28, city: "सूरत", statusText: "प्रगति पर (चरण 3)", progress: 62,
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        impact: "सुरक्षा और रोजगार की ओर", timeline: "6 महीने",
        platformMetrics: [
          "बोल-दो: 12:33 मिनट की रिकॉर्डिंग को कानूनी दस्तावेज़ में बदला (हिंदी)",
          "पहचान: 3 घंटे में स्थानीय वकील आवंटित",
          "समुदाय: सूरत में 34 महिलाएं, हीलिंग सर्कल में 12",
          "सेफमोड: सक्रिय स्थान ट्रैकिंग सत्यापित"
        ],
        outcomeMetrics: [
          "दस्तावेज़ बनाने में समय: 1 दिन",
          "एफआईआर स्थिति: सूरत पुलिस डेस्क पर सफलतापूर्वक दर्ज",
          "सुरक्षा आदेश: स्थानीय अधिकारियों द्वारा लागू",
          "वर्तमान स्थिति: 2 नौकरी साक्षात्कार लंबित"
        ],
        phases: [
          { id: 1, name: "चरण 1: निर्णय और स्पष्टता", duration: "2 दिन", status: "completed", metrics: "समय की बचत: 48 घंटों में मदद", steps: [
            { text: "समस्या को पहचाना", meta: "5 नवंबर 2024 | संदर्भ: कार्यस्थल पर उत्पीड़न + ब्लैकमेल" },
            { text: "सहेली की खोज", meta: "6 नवंबर 2024 | डिजिटल निर्देशिकाओं के माध्यम से" },
            { text: "कहानियाँ पढ़ीं", meta: "7 नवंबर 2024 | 45 मिनट बिताए" }
          ]},
          { id: 2, name: "चरण 2: कानूनी कार्रवाई", duration: "4 सप्ताह", status: "completed", metrics: "सफलता दर: 100% (एफआईआर दर्ज)", steps: [
            { text: "बोल-दो का उपयोग", meta: "15 नवंबर 2024 | 12:33 मिनट की रिकॉर्डिंग" },
            { text: "दस्तावेज़ तैयार", meta: "16 नवंबर 2024 | कानूनी धाराओं के साथ" },
            { text: "वकील मिला", meta: "18 नवंबर 2024 | स्थानीय वकील (सत्यापित ⭐⭐⭐⭐)" },
            { text: "शिकायत दर्ज", meta: "25 नवंबर 2024 | सूरत डेस्क | एफआईआर आईडी: 2025-SUR-0345" },
            { text: "प्रतिबंधक आदेश मिला", meta: "20 दिसंबर 2024 | मजिस्ट्रेट द्वारा जारी" }
          ]},
          { id: 3, name: "चरण 3: सुरक्षा और हीलिंग", duration: "जारी", status: "active", metrics: "स्थिति: थेरेपी सक्रिय", steps: [
            { text: "थेरेपी सत्र", meta: "8/12 पूर्ण (67% प्रगति)" },
            { text: "सपोर्ट ग्रुप", meta: "कार्यस्थल उत्पीड़न सर्वाइवर्स (12 महिलाएं)" },
            { text: "जॉब ट्रांजिशन", meta: "प्रगति पर (2 इंटरव्यू ऑफर लंबित)" }
          ]},
          { id: 4, name: "चरण 4: पुनर्निर्माण", duration: "अपेक्षित अगस्त 2026", status: "locked", metrics: "चरण 3 के बाद अनलॉक होगा", steps: [
            { text: "रोजगार ट्रैकिंग", meta: "अंतिम पुष्टि की प्रतीक्षा" },
            { text: "सेफमोड अलर्ट", meta: "नए घर में जाने पर कॉन्फ़िगर किया जाएगा" }
          ]}
        ]
      }
    },
    gu: {
      Priya: {
        name: "પ્રિયા એસ.", age: 32, city: "અમદાવાદ", statusText: "સફળ (1 વર્ષ મુક્ત)", progress: 100,
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        impact: "પીડિતાથી સર્વાઈવર અને મેન્ટર સુધી", timeline: "12 મહિના",
        platformMetrics: [
          "બોલ-દો: 4:32 મિનિટના વોઈસને કોર્ટ-રેડી દસ્તાવેજમાં ફેરવ્યો (કોઈ કાનૂની જ્ઞાન વિના)",
          "ઓળખ: 3 સ્થાનિક મદદગારો અને 1 પ્રોફેશનલ મેન્ટર સાથે જોડાઈ",
          "હક-ફાઈન્ડર: કાનૂની સહાય અને આશ્રય માટે 8 સંસાધનો મળ્યા",
          "સેફમોડ: 12 મહિનામાં 247 સુરક્ષિત ચેક-ઈન લોગ થયા",
          "સમુદાય: 47 મહિલાઓ તબક્કા 2 માં, 23 હીલિંગ સર્કલમાં"
        ],
        outcomeMetrics: [
          "એફઆઈઆર માટેના દિવસો: 20 દિવસ (મદદ વિના સરેરાશ 180 દિવસ)",
          "ખર્ચ: ₹0 આઉટ-ઓફ-પોકેટ (કાનૂની સહાય + NGO દ્વારા)",
          "સામુદાયિક પ્રભાવ: હવે 6 મહિલાઓને મેન્ટર કરી રહી છે",
          "આર્થિક પ્રભાવ: ₹25,000/મહિને નવી આવક (₹0 થી શરૂ)",
          "માનસિક પ્રભાવ: 'જીવી નહી શકું' થી 'નવું જીવન બનાવ્યું'"
        ],
        phases: [
          { id: 1, name: "તબક્કો 1: નિર્ણય અને સ્પષ્ટતા", duration: "2 દિવસ", status: "completed", metrics: "સમયની બચત: 48 કલાકમાં મદદ", steps: [
            { text: "સમસ્યાને ઓળખી", meta: "23 ડિસેમ્બર 2024, 2:15 PM | અવતરણ: 'હું હવે સહન કરી શકતી નથી'" },
            { text: "સહેલી પ્લેટફોર્મ શોધ્યું", meta: "24 ડિસેમ્બર 2024, 9:30 AM | માધ્યમ: પાડોશી દ્વારા WhatsApp શેર" },
            { text: "સફળતાની વાર્તાઓ વાંચી", meta: "24 ડિસેમ્બર 2024, 2:00 PM | વાર્તા: અંજલિની 18 મહિનાની સફર" }
          ]},
          { id: 2, name: "તબક્કો 2: કાનૂની કાર્યવાહી", duration: "3 અઠવાડિયા", status: "completed", metrics: "સફળતા દર: 100% (FIR દાખલ)", steps: [
            { text: "બોલ-દો નો ઉપયોગ કર્યો", meta: "15 જાન્યુઆરી 2025 | સમય: 4:32 મિનિટ | ભાષા: ગુજરાતી" },
            { text: "કોર્ટ-રેડી દસ્તાવેજ", meta: "16 જાન્યુઆરી 2025 | કલમો: 498A, 406, PWDVA" },
            { text: "વેરિફાઇડ વકીલ મળ્યા", meta: "18 જાન્યુઆરી 2025 | વકીલ: અંજલિ દેસાઈ (વેરિફાઇડ ⭐⭐⭐⭐⭐)" },
            { text: "પોલીસ સ્ટેશનમાં એફઆઈઆર", meta: "20 જાન્યુઆરી 2025 | અમદાવાદ પૂર્વ પોલીસ સ્ટેશન | FIR ID: 2025-AHM-08847" },
            { text: "પ્રોટેક્શન ઓર્ડર મળ્યો", meta: "5 ફેબ્રુઆરી 2025 | ઇશ્યૂ કરનાર: જિલ્લા કોર્ટ, અમદાવાદ" }
          ]},
          { id: 3, name: "તબક્કો 3: સુરક્ષા અને હીલિંગ", duration: "4 મહિના", status: "completed", metrics: "સફળતા: આશ્રય સુરક્ષિત, કાઉન્સેલિંગ સક્રિય", steps: [
            { text: "સુરક્ષિત આશ્રય મળ્યો", meta: "7 ફેબ્રુઆરી 2025 | આશ્રય: અરવિંદ મહિલા ગૃહ | ખર્ચ: NGO દ્વારા સબસિડી" },
            { text: "ટ્રોમા કાઉન્સેલિંગ", meta: "15 ફેબ્રુઆરી 2025 | કાઉન્સેલર: દિવ્યા પટેલ | પ્રગતિ: 85% રિકવરી" },
            { text: "સપોર્ટ સર્કલ સાથે જોડાઈ", meta: "20 ફેબ્રુઆરી 2025 | ગ્રુપ: 'ઘરેલુ હિંસામાંથી મુક્તિ' | સભ્યો: 23 મહિલાઓ" },
            { text: "કાનૂની સહાય મંજૂર", meta: "10 માર્ચ 2025 | મંજૂર: NALSA યોજના | ખર્ચ: શૂન્ય" },
            { text: "સ્કિલ ટ્રેનિંગ પૂર્ણ", meta: "1 જૂન 2025 | પ્રોગ્રામ: ડિજિટલ સાક્ષરતા + ટેલરિંગ" }
          ]},
          { id: 4, name: "તબક્કો 4: પુનર્નિર્માણ અને સ્વતંત્રતા", duration: "6 મહિના", status: "completed", metrics: "સફળતા: નોકરી મળી, પોતાના ઘરે ગઈ", steps: [
            { text: "પહેલી નોકરી મળી", meta: "15 જુલાઈ 2025 | રોલ: ડિજિટલ લિટરસી ઇન્સ્ટ્રક્ટર | પગાર: ₹15,000/મહિને" },
            { text: "પોતાના ઘરે ગઈ", meta: "15 સપ્ટેમ્બર 2025 | 1BHK, અમદાવાદ | ભાડું: ₹5,000" },
            { text: "પુત્રીનું સ્કૂલમાં એડમિશન", meta: "ઓગસ્ટ 2025 | પ્રગતિ: ક્લાસમાં પ્રથમ ક્રમ" }
          ]},
          { id: 5, name: "તબક્કો 5: સફળતા અને મેન્ટરશિપ", duration: "6 મહિના", status: "completed", metrics: "સફળતા: બિઝનેસ શરૂ, અન્યોને મદદ", steps: [
            { text: "ટેલરિંગનો વ્યવસાય શરૂ કર્યો", meta: "જાન્યુઆરી 2026 | આવક: ₹25,000/મહિને | કર્મચારીઓ: 2 મહિલાઓ" },
            { text: "ઓળખ મેન્ટર બની", meta: "માર્ચ 2026 | ભૂમિકા: વેરિફાઇડ હેલ્પર ⭐⭐⭐⭐⭐ | મેન્ટર કરેલ મહિલાઓ: 6" },
            { text: "આઝાદીનું 1 વર્ષ", meta: "23 ડિસેમ્બર 2025 | અવતરણ: 'હું આખરે જીવંત અનુભવું છું.'" }
          ]}
        ]
      },
      Anjali: {
        name: "અંજલિ આર.", age: 28, city: "સુરત", statusText: "પ્રગતિમાં (તબક્કો 3)", progress: 62,
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        impact: "સુરક્ષા અને રોજગાર તરફ આગળ", timeline: "6 મહિના",
        platformMetrics: [
          "બોલ-દો: 12:33 મિનિટના અવાજને કાનૂની દસ્તાવેજમાં ફેરવ્યો (હિન્દી)",
          "ઓળખ: 3 કલાકમાં સ્થાનિક વકીલ ફાળવવામાં આવ્યા",
          "સમુદાય: 34 મહિલાઓ સુરતમાં, 12 હીલિંગ સર્કલમાં",
          "સેફમોડ: સક્રિય લોકેશન ટ્રેકિંગ પ્રમાણિત"
        ],
        outcomeMetrics: [
          "દસ્તાવેજ બનાવવાનો સમય: 1 દિવસ",
          "FIR સ્ટેટસ: સુરત પોલીસ ડેસ્ક પર સફળતાપૂર્વક નોંધાયેલ",
          "પ્રોટેક્શન ઓર્ડર: સ્થાનિક અધિકારીઓ દ્વારા લાગુ",
          "વર્તમાન સ્થિતિ: 2 જોબ ઇન્ટરવ્યુ બાકી છે"
        ],
        phases: [
          { id: 1, name: "તબક્કો 1: નિર્ણય અને સ્પષ્ટતા", duration: "2 દિવસ", status: "completed", metrics: "સમયની બચત: 48 કલાકમાં મદદ", steps: [
            { text: "સમસ્યાને ઓળખી", meta: "5 નવેમ્બર 2024 | સંદર્ભ: કાર્યસ્થળ પર ઉત્પીડન + બ્લેકમેલ" },
            { text: "સહેલી પ્લેટફોર્મ શોધ્યું", meta: "6 નવેમ્બર 2024 | ડિજિટલ ડિરેક્ટરીઓ મારફતે" },
            { text: "વાર્તાઓ વાંચી", meta: "7 નવેમ્બર 2024 | 45 મિનિટ ગાળ્યા" }
          ]},
          { id: 2, name: "તબક્કો 2: કાનૂની કાર્યવાહી", duration: "4 અઠવાડિયા", status: "completed", metrics: "સફળતા દર: 100% (FIR દાખલ)", steps: [
            { text: "બોલ-દો નો ઉપયોગ", meta: "15 નવેમ્બર 2024 | 12:33 મિનિટ રેકોર્ડિંગ" },
            { text: "દસ્તાવેજ જનરેટ", meta: "16 નવેમ્બર 2024 | કાનૂની કલમો સાથે" },
            { text: "વકીલ મળ્યા", meta: "18 નવેમ્બર 2024 | સ્થાનિક વકીલ (વેરિફાઇડ ⭐⭐⭐⭐)" },
            { text: "ફરિયાદ દાખલ", meta: "25 નવેમ્બર 2024 | સુરત ડેસ્ક | FIR ID: 2025-SUR-0345" },
            { text: "રિસ્ટ્રેનિંગ ઓર્ડર", meta: "20 ડિસેમ્બર 2024 | મેજિસ્ટ્રેટ દ્વારા જારી" }
          ]},
          { id: 3, name: "તબક્કો 3: સુરક્ષા અને હીલિંગ", duration: "ચાલુ", status: "active", metrics: "સ્થિતિ: થેરાપી સક્રિય", steps: [
            { text: "થેરાપી સત્રો", meta: "8/12 પૂર્ણ (67% પ્રગતિ)" },
            { text: "સપોર્ટ ગ્રુપ", meta: "વર્કપ્લેસ હેરેસમેન્ટ સર્વાઇવર્સ (12 મહિલાઓ)" },
            { text: "જોબ ટ્રાન્ઝિશન", meta: "પ્રગતિમાં (2 ઇન્ટરવ્યુ ઓફર પેન્ડિંગ)" }
          ]},
          { id: 4, name: "તબક્કો 4: પુનર્નિર્માણ", duration: "અપેક્ષિત ઓગસ્ટ 2026", status: "locked", metrics: "તબક્કા 3 પછી અનલૉક થશે", steps: [
            { text: "રોજગાર ટ્રેકિંગ", meta: "અંતિમ પુષ્ટિની રાહ" },
            { text: "સેફમોડ એલર્ટ્સ", meta: "નવા ઘરમાં શિફ્ટ થવા પર કન્ફિગર થશે" }
          ]}
        ]
      }
    },
    mr: {
      Priya: {
        name: "प्रिया एस.", age: 32, city: "अहमदाबाद", statusText: "यशस्वी (1 वर्ष मुक्त)", progress: 100,
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        impact: "पिडित ते उत्तरजीवी ते मेंटर", timeline: "12 महिने",
        platformMetrics: [
          "बोल-दो: 4:32 मिनिटांचा आवाज कायदेशीर कागदपत्रात बदलला (कोणत्याही कायदेशीर ज्ञानाची गरज नाही)",
          "ओळख: 3 स्थानिक मदतनीस आणि 1 व्यावसायिक मेंटरशी सुरक्षितपणे जोडले",
          "हक-फाइंडर: कायदेशीर मदत आणि आश्रयस्थानात 8 संसाधने सापडली",
          "सेफमोड: 12 महिन्यांत 247 सुरक्षित चेक-इन लॉग केले",
          "समुदाय: टप्पा 2 मध्ये 47 महिला, हीलिंग सर्कलमध्ये 23"
        ],
        outcomeMetrics: [
          "FIR दाखल करण्यासाठी लागलेले दिवस: 20 दिवस (मदतीशिवाय सरासरी 180 दिवस)",
          "खर्च: ₹0 (कायदेशीर मदत + स्वयंसेवी संस्थेद्वारे)",
          "सामुदायिक प्रभाव: आता 6 महिलांना मार्गदर्शन करत आहे",
          "आर्थिक प्रभाव: ₹25,000/महिना नवीन उत्पन्न (₹0 पासून)",
          "मानसिक प्रभाव: 'जगू शकत नाही' पासून 'आयुष्य घडवत आहे'"
        ],
        phases: [
          { id: 1, name: "टप्पा 1: निर्णय आणि स्पष्टता", duration: "2 दिवस", status: "completed", metrics: "वेळेची बचत: 48 तासांत मदत मिळाली", steps: [
            { text: "समस्या ओळखली", meta: "23 डिसेंबर 2024, 2:15 PM | अवतरण: 'मला आता सहन होत नव्हते'" },
            { text: "सहेली प्लॅटफॉर्म सापडले", meta: "24 डिसेंबर 2024, 9:30 AM | माध्यम: शेजाऱ्याची WhatsApp लिंक" },
            { text: "गोष्टी वाचल्या", meta: "24 डिसेंबर 2024, 2:00 PM | गोष्ट: अंजलीचा 18 महिन्यांचा प्रवास" }
          ]},
          { id: 2, name: "टप्पा 2: कायदेशीर कारवाई", duration: "3 आठवडे", status: "completed", metrics: "यश दर: 100% (FIR दाखल)", steps: [
            { text: "कायदेशीर तक्रारीसाठी बोल-दो चा वापर", meta: "15 जानेवारी 2025 | वेळ: 4:32 मिनिटे | भाषा: गुजराती" },
            { text: "कोर्टासाठी तयार कागदपत्र", meta: "16 जानेवारी 2025 | कलमे: 498A, 406, PWDVA" },
            { text: "सत्यापित वकील मिळाला", meta: "18 जानेवारी 2025 | वकील: अंजली देसाई (सत्यापित ⭐⭐⭐⭐⭐)" },
            { text: "पोलीस स्टेशनमध्ये FIR", meta: "20 जानेवारी 2025 | अहमदाबाद पूर्व पोलीस स्टेशन | FIR ID: 2025-AHM-08847" },
            { text: "संरक्षण आदेश मिळाला", meta: "5 फेब्रुवारी 2025 | जारीकर्ता: जिल्हा न्यायालय, अहमदाबाद" }
          ]},
          { id: 3, name: "टप्पा 3: सुरक्षा आणि हीलिंग", duration: "4 महिने", status: "completed", metrics: "यश: आश्रय सुरक्षित, समुपदेशन सक्रिय", steps: [
            { text: "सुरक्षित निवारा मिळाला", meta: "7 फेब्रुवारी 2025 | निवारा: अरविंद महिला गृह | खर्च: NGO द्वारे अनुदानित" },
            { text: "ट्रॉमा समुपदेशन", meta: "15 फेब्रुवारी 2025 | समुपदेशक: दिव्या पटेल | प्रगती: 85% सुधारणा" },
            { text: "सपोर्ट ग्रुपशी जोडले", meta: "20 फेब्रुवारी 2025 | गट: 'कौटुंबिक हिंसेतून सावरताना' | सदस्य: 23 महिला" },
            { text: "कायदेशीर मदत मंजूर", meta: "10 मार्च 2025 | मंजूर: NALSA योजना | खर्च: शून्य" },
            { text: "कौशल्य प्रशिक्षण पूर्ण", meta: "1 जून 2025 | कार्यक्रम: डिजिटल साक्षरता + शिलाई" }
          ]},
          { id: 4, name: "टप्पा 4: पुनर्निर्माण आणि स्वातंत्र्य", duration: "6 महिने", status: "completed", metrics: "यश: नोकरी मिळाली, स्वतःच्या घरात", steps: [
            { text: "पहिली नोकरी मिळाली", meta: "15 जुलै 2025 | भूमिका: डिजिटल लिटरसी इन्स्ट्रक्टर | पगार: ₹15,000/महिना" },
            { text: "स्वतःच्या घरात स्थलांतर", meta: "15 सप्टेंबर 2025 | 1BHK, अहमदाबाद | भाडे: ₹5,000" },
            { text: "मुलीचा शाळेत प्रवेश", meta: "ऑगस्ट 2025 | प्रगती: वर्गात प्रथम क्रमांक" }
          ]},
          { id: 5, name: "टप्पा 5: यश आणि मेंटरशिप", duration: "6 महिने", status: "completed", metrics: "यश: व्यवसाय सुरू, इतरांना मदत", steps: [
            { text: "शिलाई व्यवसाय सुरू", meta: "जानेवारी 2026 | उत्पन्न: ₹25,000/महिना | कर्मचारी: 2 महिला" },
            { text: "ओळख मेंटर बनली", meta: "मार्च 2026 | भूमिका: सत्यापित मदतनीस ⭐⭐⭐⭐⭐ | मार्गदर्शन केलेल्या महिला: 6" },
            { text: "स्वातंत्र्याचे 1 वर्ष", meta: "23 डिसेंबर 2025 | अवतरण: 'मी खरोखरच जिवंत आहे असे वाटते.'" }
          ]}
        ]
      },
      Anjali: {
        name: "अंजली आर.", age: 28, city: "सूरत", statusText: "प्रगतीपथावर (टप्पा 3)", progress: 62,
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        impact: "सुरक्षा आणि रोजगाराकडे", timeline: "6 महिने",
        platformMetrics: [
          "बोल-दो: 12:33 मिनिटांचे रेकॉर्डिंग कायदेशीर कागदपत्रात बदलले (हिंदी)",
          "ओळख: 3 तासांत स्थानिक वकील नियुक्त",
          "समुदाय: सुरतमध्ये 34 महिला, हीलिंग सर्कलमध्ये 12",
          "सेफमोड: सक्रिय स्थान ट्रॅकिंग सत्यापित"
        ],
        outcomeMetrics: [
          "कागदपत्र बनवण्याचा वेळ: 1 दिवस",
          "FIR स्थिती: सुरत पोलीस डेस्कवर यशस्वीरित्या नोंदणीकृत",
          "सुरक्षा आदेश: स्थानिक अधिकाऱ्यांद्वारे लागू",
          "सध्याची स्थिती: 2 नोकरीच्या मुलाखती प्रलंबित"
        ],
        phases: [
          { id: 1, name: "टप्पा 1: निर्णय आणि स्पष्टता", duration: "2 दिवस", status: "completed", metrics: "वेळेची बचत: 48 तासांत मदत", steps: [
            { text: "समस्या ओळखली", meta: "5 नोव्हेंबर 2024 | संदर्भ: कामाच्या ठिकाणी छळ + ब्लॅकमेल" },
            { text: "सहेलीचा शोध", meta: "6 नोव्हेंबर 2024 | डिजिटल डिरेक्टरीद्वारे" },
            { text: "गोष्टी वाचल्या", meta: "7 नोव्हेंबर 2024 | 45 मिनिटे वेळ दिला" }
          ]},
          { id: 2, name: "टप्पा 2: कायदेशीर कारवाई", duration: "4 आठवडे", status: "completed", metrics: "यश दर: 100% (FIR दाखल)", steps: [
            { text: "बोल-दो चा वापर", meta: "15 नोव्हेंबर 2024 | 12:33 मिनिटे रेकॉर्डिंग" },
            { text: "कागदपत्र तयार", meta: "16 नोव्हेंबर 2024 | कायदेशीर कलमांसह" },
            { text: "वकील मिळाला", meta: "18 नोव्हेंबर 2024 | स्थानिक वकील (सत्यापित ⭐⭐⭐⭐)" },
            { text: "तक्रार दाखल", meta: "25 नोव्हेंबर 2024 | सुरत डेस्क | FIR ID: 2025-SUR-0345" },
            { text: "प्रतिबंधात्मक आदेश", meta: "20 डिसेंबर 2024 | दंडाधिकाऱ्यांनी जारी केला" }
          ]},
          { id: 3, name: "टप्पा 3: सुरक्षा आणि हीलिंग", duration: "सुरू आहे", status: "active", metrics: "स्थिती: थेरपी सक्रिय", steps: [
            { text: "थेरपी सत्रे", meta: "8/12 पूर्ण (67% प्रगती)" },
            { text: "सपोर्ट ग्रुप", meta: "वर्कप्लेस हॅरेसमेंट सर्व्हायव्हर्स (12 महिला)" },
            { text: "जॉब ट्रान्झिशन", meta: "प्रगतीपथावर (2 मुलाखती प्रलंबित)" }
          ]},
          { id: 4, name: "टप्पा 4: पुनर्निर्माण", duration: "अपेक्षित ऑगस्ट 2026", status: "locked", metrics: "टप्पा 3 नंतर अनलॉक होईल", steps: [
            { text: "रोजगार ट्रॅकिंग", meta: "अंतिम पुष्टीकरणाची प्रतीक्षा" },
            { text: "सेफमोड अलर्ट", meta: "नवीन घरात गेल्यावर कॉन्फिगर केले जाईल" }
          ]}
        ]
      }
    }
  };

  const currentContent = labels[lang] || labels['en'];
  const activeProfile = profilesDataset[lang]?.[selectedProfile] || profilesDataset['en'][selectedProfile];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans antialiased space-y-10">
      
      {/* 1. CENTERED DASHBOARD HEADER BRAND ENGINE */}
      <div className="text-center pb-2 max-w-3xl mx-auto space-y-3 animate-[slideUp_0.2s_ease-out]">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2 font-serif">
          <Route className="text-rose-500" size={32} /> {currentContent.title}
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl mx-auto">{currentContent.subtitle}</p>
      </div>

      {/* 2. PREMIUM HIGH-FIDELITY AVATAR TAB CONTROL SELECTOR */}
      <div className="bg-white border border-slate-200 p-2 rounded-2xl flex items-center justify-between max-w-md mx-auto shadow-sm animate-[slideUp_0.25s_ease-out]">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-4">{currentContent.profileSelect}</span>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
          <button 
            onClick={() => { setSelectedProfile('Priya'); setExpandedPhase(2); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${selectedProfile === 'Priya' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <img src={profilesDataset.en.Priya.avatarUrl} alt="Priya" className="w-6 h-6 rounded-full object-cover border border-rose-200" />
            Priya S.
          </button>
          <button 
            onClick={() => { setSelectedProfile('Anjali'); setExpandedPhase(2); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${selectedProfile === 'Anjali' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <img src={profilesDataset.en.Anjali.avatarUrl} alt="Anjali" className="w-6 h-6 rounded-full object-cover border border-rose-200" />
            Anjali R.
          </button>
        </div>
      </div>

      {/* 3. CORE JOURNEY PROGRESS MONITOR BAR CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm max-w-4xl mx-auto text-left animate-[slideUp_0.25s_ease-out]">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{currentContent.overallProgress}</h3>
            <p className="text-slate-900 font-black font-serif text-lg mt-0.5">{activeProfile.name} • {activeProfile.city}</p>
          </div>
          <span className="text-2xl font-black text-rose-500 font-mono tracking-tight">{activeProfile.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-rose-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${activeProfile.progress}%` }}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between pt-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest gap-1 border-t border-slate-50 mt-4">
          <p>{currentContent.timelineCap}: <span className="text-slate-800 font-bold">{activeProfile.timeline}</span></p>
          <p>{currentContent.impactCap}: <span className="text-slate-800 font-bold">{activeProfile.impact}</span></p>
        </div>
      </div>

      {/* 4. TWO-COLUMN SPLIT DASHBOARD GRID LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
        
        {/* LEFT STREAM: CLEAN CHRONO VERTICAL PROGRESSION FLOW */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm relative text-left">
          <div className="absolute top-12 bottom-12 left-10 sm:left-12 w-0.5 bg-slate-100 z-0"></div>
          
          <div className="space-y-8 relative z-10">
            {activeProfile.phases.map((phase) => (
              <div key={phase.id} className={`flex gap-4 sm:gap-6 transition-opacity duration-300 ${phase.status === 'locked' ? 'opacity-40' : 'opacity-100'}`}>
                
                {/* Clean Indicator Nodes Without ASCII lines */}
                <div className="shrink-0 mt-1">
                  {phase.status === 'completed' ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={14} className="text-emerald-600 stroke-[3]" />
                    </div>
                  ) : phase.status === 'active' ? (
                    <div className="w-8 h-8 rounded-full bg-rose-50 border-2 border-rose-500 flex items-center justify-center relative shadow-sm cursor-pointer">
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping absolute"></div>
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div 
                    onClick={() => phase.status !== 'locked' && setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                    className="flex justify-between items-start group cursor-pointer"
                  >
                    <div>
                      <h3 className={`text-sm font-black tracking-tight font-serif transition-colors ${phase.id === expandedPhase ? 'text-rose-500' : 'text-slate-900 group-hover:text-rose-500'}`}>
                        {phase.name}
                      </h3>
                      <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{phase.duration}</p>
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-600 transition-colors mt-0.5">
                      {phase.id === expandedPhase ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {phase.id === expandedPhase && (
                    <div className="bg-[#F9FAFB] border border-rose-100/60 rounded-2xl p-4 space-y-4 animate-[slideUp_0.15s_ease-out] font-sans">
                      <div className="flex items-center gap-1.5 bg-rose-50 p-2 rounded-lg border border-rose-100/50 text-rose-700 text-[10px] font-mono font-black uppercase tracking-wider">
                        <Sparkles size={12} /> {phase.metrics}
                      </div>
                      
                      <div className="space-y-3">
                        {phase.steps.map((step, idx) => (
                          <div key={idx} className="space-y-1.5 border-b border-slate-200/50 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                              <p className="text-xs font-bold text-slate-800 leading-snug">{step.text}</p>
                            </div>
                            <div className="pl-5">
                              <p className="text-[10px] font-mono text-slate-500 leading-relaxed bg-white border border-slate-100 p-2 rounded-xl whitespace-pre-line shadow-inner">{step.meta}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: REWIRED HIGH-CONVERTING METRIC TILES */}
        <div className="lg:col-span-5 space-y-6 text-left animate-[slideUp_0.4s_ease-out]">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles size={18} className="text-rose-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">{currentContent.metricsHeader}</h3>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-black text-rose-500 uppercase tracking-wider flex items-center gap-1">
                <FileText size={12} /> {currentContent.communityCap}
              </h4>
              <ul className="space-y-2 font-sans text-xs text-slate-600 font-medium">
                {activeProfile.platformMetrics.map((m, i) => (
                  <li key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed flex items-start gap-2">
                    <Check size={14} className="text-rose-500 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-mono font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                <Target size={12} /> {currentContent.outcomeCap}
              </h4>
              <ul className="space-y-2 font-sans text-xs text-slate-600 font-medium">
                {activeProfile.outcomeMetrics.map((m, i) => (
                  <li key={i} className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/40 leading-relaxed text-slate-700 flex items-start gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 bg-rose-50 rounded-full flex items-center justify-center shrink-0 text-rose-500">
              <ShieldAlert size={18} />
            </div>
            <div className="font-sans text-xs">
              <h4 className="font-black text-slate-900 mb-0.5">Trauma-Informed Handholding Network</h4>
              <p className="text-slate-500 font-medium leading-relaxed">This interactive cockpit resolves administrative anxiety cleanly by organizing legal, safety, and rehabilitation modules into one unified progress map.</p>
            </div>
          </div>
        </div>

      </div>

      {/* 5. BRAND VALUE FOOTER WRAPPERS */}
      <div className="pt-6 max-w-4xl mx-auto space-y-4 animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-white border-2 border-rose-100 p-5 rounded-2xl shadow-sm text-left flex flex-col sm:flex-row items-center gap-4">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0 text-rose-500">
            <Globe size={20} />
          </div>
          <p className="text-xs font-semibold leading-relaxed text-slate-600 font-sans">{currentContent.expansionBanner}</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-left flex flex-col sm:flex-row items-center gap-4 shadow-inner">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 text-slate-400">
            <Info size={18} />
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-slate-500 font-mono">{currentContent.scaleNotice}</p>
        </div>
      </div>

    </div>
  );
}