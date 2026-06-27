import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, MapPin, Award, Calendar, Sparkles, Plus, Quote, Users, ShieldCheck, Smartphone, Mail, Send, Loader2, Globe } from 'lucide-react';
import { useLanguage } from '../App';
import { API_BASE_URL } from '../config';

export default function Pehchaan() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('stories'); // 'stories' | 'helpers' | 'celebrations'
  const [selectedCity, setSelectedCity] = useState('Ahmedabad');
  const [likedStories, setLikedStories] = useState({});
  const [celebrationHearts, setCelebrationHearts] = useState({});
  
  // Post Milestone Form States
  const [showForm, setShowForm] = useState(false);
  const [newMilestoneText, setNewMilestoneText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customMilestones, setCustomMilestones] = useState([]);

  const cities = ["Ahmedabad", "Surat", "Mumbai", "Delhi", "Pune", "Other Cities"];

  // Localized City Names Matrix
  const cityLabels = {
    en: { Ahmedabad: "Ahmedabad", Surat: "Surat", Mumbai: "Mumbai", Delhi: "Delhi", Pune: "Pune", "Other Cities": "Other Cities" },
    hi: { Ahmedabad: "अहमदाबाद", Surat: "सूरत", Mumbai: "मुंबई", Delhi: "दिल्ली", Pune: "पुणे", "Other Cities": "अन्य शहर" },
    gu: { Ahmedabad: "અમદાવાદ", Surat: "સુરત", Mumbai: "મુંબઈ", Delhi: "દિલ્હી", Pune: "પુણે", "Other Cities": "અન્ય શહેરો" },
    mr: { Ahmedabad: "अहमदाबाद", Surat: "सूरत", Mumbai: "मुंबई", Delhi: "दिल्ली", Pune: "पुणे", "Other Cities": "इतर शहरे" }
  };
  const localizedCities = cityLabels[lang] || cityLabels['en'];

  // THE CRITICAL FIX: Like & Heart Toggle Handler
  const handleToggleLike = (id, type) => {
    if (type === 'story') {
      setLikedStories(prev => ({ ...prev, [id]: !prev[id] }));
    } else if (type === 'celebration') {
      setCelebrationHearts(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  // COMPLETE LOCALIZED TRANSLATIONS FOR ALL CHANNELS
  const dataBundle = {
    en: {
      title: "Pehchaan Community Hub",
      subtitle: "A hyper-local mutual aid network. Find strength in shared victories, connect with vetted local helpers, and celebrate steps toward freedom.",
      tabStories: "Survival Stories",
      tabHelpers: "Local Networks",
      tabCelebrations: "Milestones",
      nearText: "Within 3-5 km of chosen sector",
      whatsappShareMsg: "I just read these incredible survival journeys on Saheli Pehchaan. You are never alone. Read here: ",
      btnPost: "Log Progress Milestone",
      placeholderPost: "Share your milestone victory cleanly with the network anonymously...",
      btnSubmit: "Broadcast Milestone",
      expansionBanner: "We are expanding to your cities soon! If you can't find your city, use the 'Other Cities' hub to connect with our global support matrix.",
      stories: [
        { id: 1, author: "Priya S.", city: "Ahmedabad", duration: "18 months free", quote: "I was told I'd be homeless. Today I own a small shop and my daughter goes to school securely." },
        { id: 2, author: "Radhika P.", city: "Ahmedabad", duration: "15 months free", quote: "Do not stand alone. Your community is waiting to anchor you through the administrative friction." },
        { id: 3, author: "Asmita J.", city: "Ahmedabad", duration: "5 months free", quote: "Vetted helpers walked into the local precinct desk with me. The presence changed everything." },
        { id: 4, author: "Ananya R.", city: "Surat", duration: "6 months free", quote: "Finding three neighbors who went through the same filing protocol eliminated my isolation instantly." },
        { id: 5, author: "Bhavna T.", city: "Surat", duration: "11 months free", quote: "The local protection network stood by my side during critical transition steps." },
        { id: 6, author: "Kiran K.", city: "Mumbai", duration: "2 years free", quote: "Reclaiming my assets and legal rights gave me the validation to walk with my head held high." },
        { id: 7, author: "Megha M.", city: "Delhi", duration: "12 months free", quote: "The structured police-ready draft forced the local desk to complete registration within hours." },
        { id: 8, author: "Sunita B.", city: "Pune", duration: "9 months free", quote: "With peer shelter support, I relocated securely and found financial independence safely." },
        { id: 9, author: "Brave Survivor", city: "Other Cities", duration: "Global Hub", quote: "Even outside core cities, the global network matched me with an online legal companion instantly." }
      ],
      helpers: [
        { name: "Meena Ben", city: "Ahmedabad", type: "Neighborhood Helper", badge: "Vouched", desc: "Specializing in local safe emergency shelter placements and support.", phone: "Hidden", email: "Contact via App" },
        { name: "Bhanu Priya", city: "Ahmedabad", type: "Livelihood Mentor", badge: "Vouched", desc: "Connecting survivors to local micro-credit clusters and skill development circles.", phone: "Hidden", email: "Contact via App" },
        { name: "Adv. Jignasa", city: "Surat", type: "Legal Counsel", badge: "Professional", desc: "Stridhan recovery procedures tracking and protection order filing arrays.", phone: "Hidden", email: "Contact via App" },
        { name: "Adv. Anjali Sharma", city: "Mumbai", type: "Legal Advocate", badge: "Professional", desc: "Free legal evaluation mapping under IPC 498A and family protection laws.", phone: "Hidden", email: "Contact via App" },
        { name: "Savitri Devi", city: "Delhi", type: "Community Coordinator", badge: "Vouched", desc: "Accompanying women safely to local police desks and documentation circles.", phone: "Hidden", email: "Contact via App" },
        { name: "Dr. Rohini Pune", city: "Pune", type: "Medical Volunteer", badge: "Professional", desc: "Providing dynamic health assessments and secure institutional logs mapping.", phone: "Hidden", email: "Contact via App" },
        { name: "Global Legal Aid", city: "Other Cities", type: "Advocate Array", badge: "Professional", desc: "Remote video consulting for any sub-jurisdiction legal framework matching.", phone: "Hidden", email: "Contact via App" }
      ],
      celebrations: [
        { id: 1, user: "@brave_today", city: "Ahmedabad", text: "I filed my FIR today! The officers took the text printout seriously immediately.", time: "2 hours ago" },
        { id: 2, user: "@rebuild_life", city: "Ahmedabad", text: "Slept without fear for 30 consecutive days in my independent space. Freedom is magnificent.", time: "1 week ago" },
        { id: 3, user: "@new_beginning", city: "Surat", text: "Finished my first training shift at the micro-enterprise center. Earning independently starting now.", time: "Yesterday" },
        { id: 4, user: "@independent_spirit", city: "Mumbai", text: "Signed my very first rent lease agreement. Moving into my secure studio space this weekend.", time: "3 days ago" },
        { id: 5, user: "@hope_shines", city: "Delhi", text: "Attended my legal aid panel review session. My case has a dedicated lawyer assigned.", time: "4 days ago" },
        { id: 6, user: "@victory_way", city: "Pune", text: "Reclaimed my safe assets and certificates from custody safely after months of duress.", time: "1 week ago" },
        { id: 7, user: "@global_sister", city: "Other Cities", text: "Even from a remote sector, the digital brief generation allowed me to challenge institutional blocks.", time: "3 days ago" }
      ]
    },
    hi: {
      title: "पहचान कम्युनिटी हब",
      subtitle: "एक हाइपर-लोकल साझा सहायता नेटवर्क। साझा जीतों में ताकत पाएं, सत्यापित स्थानीय सहायकों से जुड़ें, और आजादी के कदमों का जश्न मनाएं।",
      tabStories: "सफलता की कहानियां",
      tabHelpers: "स्थानीय नेटवर्क",
      tabCelebrations: "मील का पत्थर",
      nearText: "चुने गए क्षेत्र से 3-5 किमी के भीतर",
      whatsappShareMsg: "मैंने अभी सहेली पहचान पर ये अद्भुत कहानियां पढ़ीं। आप अकेले नहीं हैं। यहाँ पढ़ें: ",
      btnPost: "प्रगति साझा करें",
      placeholderPost: "कम्युनिटी के साथ अपनी सफलता का मील का पत्थर साझा करें...",
      btnSubmit: "प्रसारित करें",
      expansionBanner: "हम जल्द ही आपके शहरों में विस्तार कर रहे हैं! यदि आपको अपना शहर नहीं मिलता है, तो हमारे वैश्विक सहायता नेटवर्क से जुड़ने के लिए 'अन्य शहर' हब का उपयोग करें।",
      stories: [
        { id: 1, author: "प्रिया एस.", city: "Ahmedabad", duration: "18 महीने मुक्त", quote: "मुझसे कहा गया था कि मैं बेघर हो जाऊंगी। आज मेरी अपनी एक छोटी सी दुकान है और बेटी स्कूल जाती है।" },
        { id: 2, author: "राधिका पी.", city: "Ahmedabad", duration: "15 महीने मुक्त", quote: "अकेली मत पड़ो। तुम्हारी कम्युनिटी प्रशासनिक दिक्कतों में तुम्हें सहारा देने के लिए तैयार खड़ी है।" },
        { id: 3, author: "अस्मिता जे.", city: "Ahmedabad", duration: "5 महीने मुक्त", quote: "सत्यापित सहायक मेरे साथ स्थानीय पुलिस डेस्क पर गए। उनकी उपस्थिति ने सब कुछ बदल दिया।" },
        { id: 4, author: "अनन्या आर.", city: "Surat", duration: "6 महीने मुक्त", quote: "उसी कानूनी प्रक्रिया से गुजरने वाली तीन पड़ोसियों से मिलने से मेरा अकेलापन तुरंत खत्म हो गया।" },
        { id: 5, author: "भावना टी.", city: "Surat", duration: "11 महीने मुक्त", quote: "कठिन परिस्थितियों में स्थानीय सुरक्षा नेटवर्क हमेशा मेरे साथ मजबूती से खड़ा रहा।" },
        { id: 6, author: "किरण के.", city: "Mumbai", duration: "2 साल मुक्त", quote: "अपनी संपत्ति और कानूनी अधिकारों को वापस पाने से मुझे समाज में सम्मान से जीने का हौसला मिला।" },
        { id: 7, author: "मेघा एम.", city: "Delhi", duration: "12 महीने मुक्त", quote: "संरचित पुलिस-रेडी मसूदे ने स्थानीय पुलिस डेस्क को कुछ ही घंटों में एफआईआर दर्ज करने पर मजबूर कर दिया।" },
        { id: 8, author: "सुनीता बी.", city: "Pune", duration: "9 महीने मुक्त", quote: "सहेली कम्युनिटी के आश्रय सहयोग से, मैं सुरक्षित रूप से स्थानांतरित हुई और आर्थिक रूप से स्वतंत्र बनी।" },
        { id: 9, author: "बहादुर उत्तरजीवी", city: "Other Cities", duration: "वैश्विक हब", quote: "मुख्य शहरों से बाहर होने पर भी, वैश्विक नेटवर्क ने मुझे तुरंत एक ऑनलाइन कानूनी साथी से जोड़ दिया।" }
      ],
      helpers: [
        { name: "मीना बेन", city: "Ahmedabad", type: "पड़ोस सहायक", badge: "सत्यापित", desc: "स्थानीय सुरक्षित आपातकालीन आश्रय व्यवस्था और तत्काल सहायता में विशेषज्ञ।", phone: "Hidden", email: "Contact via App" },
        { name: "भानु प्रिया", city: "Ahmedabad", type: "आजीविका मेंटर", badge: "सत्यापित", desc: "महिलाओं को स्थानीय लघु ऋण समूहों और कौशल विकास केंद्रों से जोड़ना।", phone: "Hidden", email: "Contact via App" },
        { name: "एडवोकेट जिज्ञासा", city: "Surat", type: "कानूनी सलाहकार", badge: "प्रोफेशनल", desc: "स्त्रीधन वसूली प्रक्रियाओं और सुरक्षा आदेश फाइलिंग की ट्रैकिंग।", phone: "Hidden", email: "Contact via App" },
        { name: "एडवोकेट अंजली शर्मा", city: "Mumbai", type: "कानूनी अधिवक्ता", badge: "प्रोफेशनल", desc: "IPC 498A और पारिवारिक संरक्षण कानूनों के तहत मुफ्त कानूनी मूल्यांकन।", phone: "Hidden", email: "Contact via App" },
        { name: "सावित्री देवी", city: "Delhi", type: "कम्युनिटी समन्वयक", badge: "सत्यापित", desc: "स्थानीय थानों और कानूनी कागजी कार्रवाई में महिलाओं के साथ खड़े रहना।", phone: "Hidden", email: "Contact via App" },
        { name: "डॉ. रोहिणी पुणे", city: "Pune", type: "चिकित्सा स्वयंसेवक", badge: "प्रोफेशनल", desc: "चिकित्सीय सहायता और कानूनी साक्ष्य के लिए मेडिकल रिपोर्ट तैयार करना।", phone: "Hidden", email: "Contact via App" },
        { name: "वैश्विक कानूनी सहायता", city: "Other Cities", type: "अधिवक्ता नेटवर्क", badge: "प्रोफेशनल", desc: "किसी भी क्षेत्र के कानूनी ढांचे के मिलान के लिए रिमोट वीडियो परामर्श।", phone: "Hidden", email: "Contact via App" }
      ],
      celebrations: [
        { id: 1, user: "@brave_today", city: "Ahmedabad", text: "मैंने आज आधिकारिक तौर पर अपनी एफआईआर दर्ज करा दी! पुलिस ने ड्राफ्ट को तुरंत गंभीरता से लिया।", time: "2 घंटे पहले" },
        { id: 2, user: "@rebuild_life", city: "Ahmedabad", text: "अपने स्वतंत्र घर में बिना किसी डर के लगातार 30 दिन की नींद पूरी की। आजज़ादी अनमोल है।", time: "1 सप्ताह पहले" },
        { id: 3, user: "@new_beginning", city: "Surat", text: "लघु उद्योग केंद्र में अपनी पहली ट्रेनिंग शिफ्ट पूरी की। आज से आत्मनिर्भर कमाई शुरू।", time: "कल" },
        { id: 4, user: "@independent_spirit", city: "Mumbai", text: "अपने पहले किराए के घर के समझौते पर हस्ताक्षर किए। इस वीकेंड अपने नए घर में जा रही हूं।", time: "3 दिन पहले" },
        { id: 5, user: "@hope_shines", city: "Delhi", text: "मुफ्त कानूनी सहायता समीक्षा सत्र में भाग लिया। मेरे मामले के लिए एक वकील नियुक्त किया गया है।", time: "4 दिन पहले" },
        { id: 6, user: "@victory_way", city: "Pune", text: "महीनों की मानसिक प्रताड़ना के बाद अपने कानूनी दस्तावेज और जेवर सुरक्षित वापस हासिल किए।", time: "1 सप्ताह पहले" },
        { id: 7, user: "@global_sister", city: "Other Cities", text: "दूरदराज के क्षेत्र में होने के बावजूद, डिजिटल ब्रीफ जनरेशन ने मुझे प्रशासनिक बाधाओं को पार करने में मदद की।", time: "3 दिन पहले" }
      ]
    },
    gu: {
      title: "ઓળખ કમ્યુનિટી હબ",
      subtitle: "એક હાઇપર-લોકલ પરસ્પર સહાય નેટવર્ક. સામૂહિક જીતમાં શક્તિ મેળવો, વેરિફાઇડ સ્થાનિક સહાયકો સાથે જોડાઓ અને આઝાદી તરફના પગલાં ઉજવો.",
      tabStories: "સફળતાની વાર્તાઓ",
      tabHelpers: "સ્થાનિક નેટવર્ક",
      tabCelebrations: "માઈલસ્ટોન",
      nearText: "પસંદ કરેલા ક્ષેત્રથી 3-5 કિમીની અંદર",
      whatsappShareMsg: "મેં હમણાં જ સહેલી ઓળખ પર આ અદ્ભુત વાર્તાઓ વાંચી છે. તમે એકલા નથી. અહીં વાંચો: ",
      btnPost: "પ્રગતિ માઈલસ્ટોન ઉમેરો",
      placeholderPost: "તમારી સફળતા નેટવર્ક સાથે અજ્ઞાત રીતે શેર કરો...",
      btnSubmit: "પ્રસારિત કરો",
      expansionBanner: "અમે ટૂંક સમયમાં તમારા શહેરોમાં વિસ્તરણ કરી રહ્યા છીએ! જો તમને તમારું કસ્ટમ શહેર ન મળે, તો અમારા વૈશ્વિક સપોર્ટ મેટ્રિક્સ સાથે જોડાવા માટે 'અન્ય શહેરો' હબનો ઉપયોગ કરો.",
      stories: [
        { id: 1, author: "પ્રિયા એસ.", city: "Ahmedabad", duration: "18 મહિના મુક્ત", quote: "મને કહેવામાં આવ્યું હતું કે હું બેઘર થઈ જઈશ. આજે મારી પોતાની નાની દુકાન છે અને દીકરી શાળાએ જાય છે." },
        { id: 2, author: "રાધિકા પી.", city: "Ahmedabad", duration: "15 મહિના મુક્ત", quote: "એકલા પડશો નહીં. વહીવટી મુશ્કેલીઓમાં તમને ટેકો આપવા માટે તમારી આખી કમ્યુનિટી તૈયાર છે." },
        { id: 3, author: "અસ્મિતા જે.", city: "Ahmedabad", duration: "5 મહિના મુક્ત", quote: "વેરિફાઇડ મદદગારો મારી સાથે સ્થાનિક પોલીસ સ્ટેશન ગયા. તેમની હાજરીએ આખો કેસ બદલી નાખ્યો." },
        { id: 4, author: "અનન્યા આર.", city: "Surat", duration: "6 મહિના મુક્ત", quote: "આ જ કાનૂની પ્રક્રિયામાંથી પસાર થયેલી ત્રણ પડોશી મહિલાઓ મળતા મારો એકલવાયો ડર તરત જ દૂર થઈ ગયો." },
        { id: 5, author: "ભાવના ટી.", city: "Surat", duration: "11 મહિના મુક્ત", quote: "મુશ્કેલ સંજોગોમાં સ્થાનિક સુરક્ષા નેટવર્ક હંમેશા મારી સાથે મજબૂતીથી ઊભું રહ્યું." },
        { id: 6, author: "કિરણ કે.", city: "Mumbai", duration: "2 વર્ષ મુક્ત", quote: "મારી મિલકત અને કાનૂની અધિકારો પાછા મેળવવાથી મને ગૌરવ સાથે જીવવાની પ્રેરણા મળી." },
        { id: 7, author: "મેઘા એમ.", city: "Delhi", duration: "12 મહિના મુક્ત", quote: "સુવ્યવસ્થિત પોલીસ-રેડી ડ્રાફ્ટના કારણે સ્થાનિક ડેસ્ક પર કલાકોમાં જ એફઆઈઆર સ્વીકારવામાં આવી." },
        { id: 8, author: "સુનીતા બી.", city: "Pune", duration: "9 મહિના મુક્ત", quote: "સાથી બહેનોના આશ્રય સહયોગથી, હું સુરક્ષિત રીતે સ્થળાંતરિત થઈ અને આઠ મહિનામાં પગભર બની શકી." },
        { id: 9, author: "બહાદુર બહેન", city: "Other Cities", duration: "વૈશ્વિક હબ", quote: "મુખ્ય શહેરોની બહાર હોવા છતાં, વૈશ્વિક નેટવર્કે મને તરત જ ઓનલાઈન કાનૂની સાથીદાર સાથે જોડી દીધી." }
      ],
      helpers: [
        { name: "મીના બેન", city: "Ahmedabad", type: "સ્થાનિક મદદગાર", badge: "વેરિફાઇડ", desc: "સ્થાનિક સુરક્ષિત કટોકટી આશ્રય સ્થાનો અને તાત્કાલિક સહાયતામાં વિશેષતા.", phone: "Hidden", email: "Contact via App" },
        { name: "ભાનુ પ્રિયા", city: "Ahmedabad", type: "આજીવિકા માર્ગદર્શક", badge: "વેરિફાઇડ", desc: "મહિલાઓને સ્થાનિક માઇક્રો-ક્રેડિટ જૂથો અને કૌશલ્ય વિકાસ વર્ગો સાથે જોડવા.", phone: "Hidden", email: "Contact via App" },
        { name: "એડવોકેટ જીજ્ઞાસા", city: "Surat", type: "કાનૂની સલાહકાર", badge: "પ્રોફેશનલ", desc: "સ્ત્રીધન વસૂલાત પ્રક્રિયાઓ અને પ્રોટેક્શન ઓર્ડર ફાઇલિંગનું વેરિફિકેશન.", phone: "Hidden", email: "Contact via App" },
        { name: "એડવોકેટ અંજલી શર્મા", city: "Mumbai", type: "કાનૂની એડવોકેટ", badge: "પ્રોફેશનલ", desc: "IPC 498A અને ઘરેલું હિંસા કાયદા હેઠળ મફત કાનૂની માર્ગદર્શન.", phone: "Hidden", email: "Contact via App" },
        { name: "સાવિત્રી દેવી", city: "Delhi", type: "કમ્યુનિટી કોઓર્ડિનેટર", badge: "વેરિફાઇડ", desc: "સ્થાનિક પોલીસ સ્ટેશનો અને કાગળની કામગીરીમાં બહેનોને સાથ આપવો.", phone: "Hidden", email: "Contact via App" },
        { name: "ડો. રોહિણી પુણે", city: "Pune", type: "તબીબી સ્વયંસેવક", badge: "પ્રોફેશનલ", desc: "તબીબી મૂલ્યાંકન અને કાનૂની પુરાવા માટે મેડિકલ રિપોર્ટ તૈયાર કરવા.", phone: "Hidden", email: "Contact via App" },
        { name: "વૈશ્વિક કાનૂની સહાય", city: "Other Cities", type: "એડવોકેટ નેટવર્ક", badge: "પ્રોફેશનલ", desc: "કોઈપણ પ્રાદેશિક કાનૂની માળખાના વિશ્લેષણ માટે વિડીયો કાઉન્સિલિંગ.", phone: "Hidden", email: "Contact via App" }
      ],
      celebrations: [
        { id: 1, user: "@brave_today", city: "Ahmedabad", text: "મેં આજે સત્તાવાર રીતે એફઆઈઆર દાખલ કરી! અધિકારીઓએ પ્રિન્ટઆઉટ ડ્રાફ્ટને તરત જ ગંભીરતાથી લીધો.", time: "2 કલાક પહેલા" },
        { id: 2, user: "@rebuild_life", city: "Ahmedabad", text: "મારા પોતાના સ્વતંત્ર રૂમમાં સતત 30 દિવસ સુધી કોઈ પણ ડર વગર શાંતિથી ઊંઘી શકી. આઝાદી અદ્ભુત છે.", time: "1 અઠવાડિયા પહેલા" },
        { id: 3, user: "@new_beginning", city: "Surat", text: "ઉદ્યોગ કેન્દ્રમાં મારી પ્રથમ ટ્રેનિંગ શિફ્ટ પૂરી કરી. આજથી સ્વનિર્ભર આવક શરૂ થઈ.", time: "ગઈકાલે" },
        { id: 4, user: "@independent_spirit", city: "Mumbai", text: "મારા પ્રથમ ઘરના ભાડા કરાર પર સહી કરી. આ વીકએન્ડમાં નવા રૂમમાં સ્થળાંતર કરીશ.", time: "3 દિવસ પહેલા" },
        { id: 5, user: "@hope_shines", city: "Delhi", text: "કાનૂની સહાય પેનલ સમીક્ષા સત્રમાં હાજરી આપી. મારા કેસ માટે સરકારી વકીલ ફાળવવામાં આવ્યા છે.", time: "4 દિવસ પહેલા" },
        { id: 6, user: "@victory_way", city: "Pune", text: "મહિનાઓની માનસિક હેરાનગતિ પછી મારી સલામત અસ્કયામતો અને પ્રમાણપત્રો પાછા મેળવ્યા.", time: "1 અઠવાડિયા પહેલા" },
        { id: 7, user: "@global_sister", city: "Other Cities", text: "દૂરદરાજના વિસ્તારમાં હોવા છતાં, ડિજિટલ બ્રીફ જનરેશને મને વહીવટી અવરોધો તોડવામાં મદદ કરી.", time: "3 દિવસ પહેલા" }
      ]
    },
    mr: {
      title: "ओळख कम्युनिटी हब",
      subtitle: "एक हायपर-लोकल परस्पर मदत नेटवर्क. सामायिक विजयांमध्ये ताकद शोधा, सत्यापित स्थानिक मदतनीसांशी जोडा आणि स्वातंत्र्याकडे टाकलेल्या पावलांचा उत्सव साजरा करा.",
      tabStories: "यशस्वी कथा",
      tabHelpers: "स्थानिक नेटवर्क",
      tabCelebrations: "यशाचे टप्पे",
      nearText: "निवडलेल्या क्षेत्रापासून 3-5 किमीच्या आत",
      whatsappShareMsg: "मी आत्ताच सहेली ओळख वर या आश्चर्यकारक कथा वाचल्या. तुम्ही एकला नाही आहात. येथे वाचा: ",
      btnPost: "प्रगतीचा टप्पा नोंदवा",
      placeholderPost: "नेटवर्कसह तुमची यशाची कहाणी अनामिकपणे सामायिक करा...",
      btnSubmit: "प्रसारित करा",
      expansionBanner: "आम्ही लवकरच तुमच्या शहरांमध्ये विस्तार करत आहोत! तुम्हाला तुमचे शहर आढळले नसल्यास, आमच्या जागतिक मदत नेटवर्कशी जोडण्यासाठी 'इतर शहरे' हब वापरा.",
      stories: [
        { id: 1, author: "प्रिया एस.", city: "Ahmedabad", duration: "18 महिने मुक्त", quote: "मला सांगण्यात आले होते की मी बेघर होईन. आज माझे स्वतःचे छोटे दुकान आहे आणि माझी मुलगी शाळेत जाते." },
        { id: 2, author: "राधिका पी.", city: "Ahmedabad", duration: "15 महिने मुक्त", quote: "एकट्या पडू नका. प्रशासकीय अडचणींमध्ये तुम्हाला आधार देण्यासाठी तुमची कम्युनिटी सज्ज आहे." },
        { id: 3, author: "अस्मिता जे.", city: "Ahmedabad", duration: "5 महिने मुक्त", quote: "सत्यापित मसुदा घेऊन मसुदा मदतनीस माझ्यासोबत पोलीस ठाण्यात आले. त्यांच्या उपस्थितीने सर्व वातावरण बदलले." },
        { id: 4, author: "अनन्या आर.", city: "Surat", duration: "6 महिने मुक्त", quote: "त्याच कायदेशीर प्रक्रियेतून गेलेल्या तीन शेजारी महिला भेटल्यामुळे माझा एकटेपणा त्वरित संपला." },
        { id: 5, author: "भावना टी.", city: "Surat", duration: "11 महिने मुक्त", quote: "कठिन परिस्थितीत स्थानिक सुरक्षा नेटवर्क नेहमी माझ्या पाठीशी खंबीरपणे उभे राहिले." },
        { id: 6, author: "किरण के.", city: "Mumbai", duration: "2 वर्षे मुक्त", quote: "माझी मालमत्ता आणि कायदेशीर हक्क परत मिळवल्यामुळे मला आदराने जगण्याचा आत्मविश्वास मिळाला." },
        { id: 7, author: "मेघा एम.", city: "Delhi", duration: "12 महिने मुक्त", quote: "संरचित पोलीस मसुद्यामुळे स्थानिक पोलीस ठाण्यात काही तासांतच एफआयआर नोंदवून घेण्यात आला." },
        { id: 8, author: "सुनीता बी.", city: "Pune", duration: "9 महिने मुक्त", quote: "कम्युनिटीच्या आश्रय साहाय्यामुळे, मी सुरक्षितपणे नवीन ठिकाणी स्थायिक झाले आणि आर्थिकदृष्ट्या स्वतंत्र झाले." },
        { id: 9, author: "बहादूर महिला", city: "Other Cities", duration: "वैश्विक हब", quote: "मुख्य शहरांच्या बाहेर असूनही, जागतिक नेटवर्कने मला त्वरित ऑनलाइन कायदेशीर मदतनीसाशी जोडले." }
      ],
      helpers: [
        { name: "मीना बेन", city: "Ahmedabad", type: "शेजारी मदतनीस", badge: "सत्यापित", desc: "स्थानिक सुरक्षित आपत्कालीन आश्रय व्यवस्था और त्वरित साहाय्यामध्ये तज्ज्ञ.", phone: "Hidden", email: "Contact via App" },
        { name: "भानु प्रिया", city: "Ahmedabad", type: "उपजीविका मार्गदर्शक", badge: "सत्यापित", desc: "महिलांना स्थानिक बचत गट आणि कौशल्य विकास केंद्रांशी जोडणे.", phone: "Hidden", email: "Contact via App" },
        { name: "एडव्होकेट जिज्ञासा", city: "Surat", type: "कायदेशीर सल्लागार", badge: "प्रोफेशनल", desc: "स्त्रीधन वसुली प्रक्रिया आणि संरक्षण आदेश फाइलिंगचे योग्य ट्रॅकिंग.", phone: "Hidden", email: "Contact via App" },
        { name: "एडव्होकेट अंजली शर्मा", city: "Mumbai", type: "कायदेशीर वकील", badge: "प्रोफेशनल", desc: "IPC 498A आणि कौटुंबिक संरक्षण कायद्यांतर्गत विनामूल्य कायदेशीर मसुदा मसुदा मूल्यमापन.", phone: "Hidden", email: "Contact via App" },
        { name: "सावित्री देवी", city: "Delhi", type: "कम्युनिटी समन्वयक", badge: "सत्यापित", desc: "स्थानिक पोलीस ठाण्यात जाण्यासाठी आणि कागदपत्रांच्या कामात मदत करणे.", phone: "Hidden", email: "Contact via App" },
        { name: "डॉ. रोहिणी पुणे", city: "Pune", type: "वैद्यकीय स्वयंसेवक", badge: "प्रोफेशनल", desc: "वैद्यकीय साहाय्य आणि कायदेशीर पुराव्यासाठी मेडिकल रिपोर्ट तैयार करणे.", phone: "Hidden", email: "Contact via App" },
        { name: "वैश्विक कायदेशीर मदत", city: "Other Cities", type: "अधिवक्ता नेटवर्क", badge: "प्रोफेशनल", desc: "दूरस्थ भागातील महिलांसाठी व्हिडिओद्वारे कायदेशीर कायदे सल्ला मार्गदर्शन.", phone: "Hidden", email: "Contact via App" }
      ],
      celebrations: [
        { id: 1, user: "@brave_today", city: "Ahmedabad", text: "मी आज पोलीस ठाण्यात माझी एफआयआर दाखल केली! अधिकाऱ्यांनी दस्तऐवज प्रिंटआउट त्वरित गांभीर्याने घेतला.", time: "2 तासांपूर्वी" },
        { id: 2, user: "@rebuild_life", city: "Ahmedabad", text: "माझ्या स्वतंत्र खोलीत सलग 30 दिवस कोणत्याही भीतीशिवाय झोपले. स्वातंत्र्य खरोखरच सुंदर आहे.", time: "1 आठवड्यापूर्वी" },
        { id: 3, user: "@new_beginning", city: "Surat", text: "लघु उद्योग केंद्रात माझी पहिली प्रशिक्षण शिफ्ट पूर्ण केली. आजपासून स्वतःची स्वतंत्र कमाई सुरू.", time: "काल" },
        { id: 4, user: "@independent_spirit", city: "Mumbai", text: "माझ्या पहिल्या भाड्याच्या घराच्या करारावर स्वाक्षरी केली. या वीकेंडला माझ्या स्वतःच्या जागेत जात आहे.", time: "3 दिवसांपूर्वी" },
        { id: 5, user: "@hope_shines", city: "Delhi", text: "विनामूल्य कायदेशीर मदत पॅनेल पुनरावलोकन सत्राला उपस्थित राहिले. माझ्याचे वकील नियुक्त करण्यात आला आहे.", time: "4 दिवसांपूर्वी" },
        { id: 6, user: "@victory_way", city: "Pune", text: "महिन्यांच्या मानसिक त्रासानंतर माझे कायदेशीर दस्तऐवज आणि दागिने सुरक्षितपणे परत मिळवले.", time: "1 आठवड्यापूर्वी" },
        { id: 7, user: "@global_sister", city: "Other Cities", text: "दुर्गम भागात राहूनही, मसुदा निर्मितीमुळे मला प्रशासकीय अडथळ्यांवर मात करता आली.", time: "3 दिवसांपूर्वी" }
      ]
    }
  };

  const currentLang = dataBundle[lang] ? lang : 'en';
  const bundle = dataBundle[currentLang];
  
  const filteredStories = bundle.stories.filter(s => s.city === selectedCity);
  const filteredHelpers = bundle.helpers.filter(h => h.city === selectedCity);
  const filteredCelebrations = [
    ...customMilestones.filter(c => c.city === selectedCity),
    ...bundle.celebrations.filter(c => c.city === selectedCity)
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/pehchaan/milestones`)
      .then(res => res.json())
      .then(data => { if (data && data.length > 0) setCustomMilestones(data); })
      .catch(() => console.log("Neon Server Standby Layer Active. Handled locally."));
  }, [selectedCity]);

  const handlePostMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;
    
    setIsSubmitting(true);
    const payload = {
      user: `@anon_${Math.floor(1000 + Math.random() * 9000)}`,
      city: selectedCity,
      text: newMilestoneText.trim(),
      time: "Just now",
      hearts: 1,
      comments: 0
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/pehchaan/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setCustomMilestones(prev => [payload, ...prev]);
        setNewMilestoneText("");
        setShowForm(false);
      }
    } catch (err) {
      setCustomMilestones(prev => [payload, ...prev]);
      setNewMilestoneText("");
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 antialiased font-sans">
      
      {/* PERFECTLY CENTERED HEADER DESCRIPTION BLOCKS */}
      <div className="text-center pb-4 max-w-3xl mx-auto space-y-3 animate-[slideUp_0.2s_ease-out]">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2 font-serif">
          <Users className="text-rose-500" size={30} /> {bundle.title}
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl mx-auto">{bundle.subtitle}</p>
      </div>

      {/* METROPOLITAN GEOLOCATION CHIPS ROW SETUP */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-5 max-w-3xl mx-auto">
        {cities.map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedCity === city 
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm font-black scale-105' 
                : city === "Other Cities"
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-extrabold'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {city === "Other Cities" ? "🌐 " : "📍 "} {localizedCities[city] || city}
          </button>
        ))}
      </div>

      {/* COMPONENT NAVIGATION TRACK PANELS */}
      <div className="flex border-b border-slate-200 max-w-md mx-auto p-1 bg-slate-100 rounded-xl">
        {["stories", "helpers", "celebrations"].map(tabKey => (
          <button 
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === tabKey ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {tabKey === 'stories' ? bundle.tabStories : tabKey === 'helpers' ? bundle.tabHelpers : bundle.tabCelebrations}
          </button>
        ))}
      </div>

      {/* TAB CHANNEL 1: SURVIVAL STORIES CONTAINER */}
      {activeTab === 'stories' && (
        <div className="space-y-8 animate-[slideUp_0.15s_ease-out]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {filteredStories.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center text-slate-400 font-medium text-xs">No active verification journeys mapped to this node sector layout loops yet.</div>
              ) : (
                filteredStories.map(story => (
                  <div key={story.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col group hover:border-rose-200 transition-all duration-300">
                    <Quote className="absolute top-6 right-6 text-slate-50 group-hover:text-rose-50/50 transition-colors" size={60} />
                    <div className="space-y-4 text-left z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center font-black text-xs text-rose-600 border border-rose-100">{story.author[0]}</div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900">{story.author}</h3>
                          <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5"><MapPin size={10} /> {localizedCities[story.city] || story.city} • {story.duration}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 font-medium text-base leading-relaxed font-sans italic border-l-4 border-rose-500 pl-4 py-1 bg-slate-50/50 rounded-r-xl">"{story.quote}"</p>
                    </div>
                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100 z-10">
                      <button onClick={() => handleToggleLike(story.id, 'story')} className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${likedStories[story.id] ? 'text-rose-600' : 'text-slate-400 hover:text-rose-500'}`}>
                        <Heart size={16} fill={likedStories[story.id] ? "currentColor" : "none"} /> {likedStories[story.id] ? 101 : 100}
                      </button>
                      <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(bundle.whatsappShareMsg + story.quote)}`, '_blank')} className="ml-auto text-slate-400 hover:text-emerald-600 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors">
                        <Share2 size={15} /> WhatsApp
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm text-left space-y-4">
              <h3 className="text-base font-black text-slate-900 font-serif">Stories Mapping Matrix</h3>
              <p className="text-xs text-slate-500 font-medium">{bundle.nearText}</p>
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 text-xs font-sans">
                <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Local Matrix Feeds:</span> <span className="font-black text-slate-800">{filteredStories.length} Profiles Loaded</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Vetted Helper Nodes:</span> <span className="font-black text-emerald-600">{filteredHelpers.length} Verified</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CHANNEL 2: LOCAL NETWORKS DIRECTORY */}
      {activeTab === 'helpers' && (
        <div className="space-y-6 animate-[slideUp_0.15s_ease-out] text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredHelpers.length === 0 ? (
              <div className="col-span-3 bg-white border border-slate-200 rounded-[2rem] p-12 text-center text-slate-400 font-medium text-xs">No local networks help blocks active on this selected region.</div>
            ) : (
              filteredHelpers.map((h, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-rose-100 transition-colors duration-300">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-slate-900 text-sm leading-tight">{h.name}</h3>
                        <span className="text-[10px] text-[#0B6E7F] font-bold uppercase tracking-wider">{h.type}</span>
                      </div>
                      <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-0.5"><Award size={10} /> {h.badge}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{h.desc}</p>
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-500">
                      <p className="flex items-center gap-1.5 truncate"><Mail size={11} className="text-rose-500 shrink-0"/> {h.email}</p>
                      <p className="flex items-center gap-1.5"><Smartphone size={11} className="text-rose-500 shrink-0"/> {h.phone}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 mt-4 pt-3 flex items-center">
                    <span className="text-[10px] font-mono text-emerald-600 font-black tracking-wider uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Identity Vetted & Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CHANNEL 3: MILESTONES & PERSISTENT NEON LOOPS */}
      {activeTab === 'celebrations' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-[slideUp_0.15s_ease-out]">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-left">
            <h2 className="text-base font-black text-slate-900 font-serif tracking-tight flex items-center gap-1.5"><Sparkles className="text-rose-500" size={18} /> Milestone Broadcasts ({localizedCities[selectedCity] || selectedCity})</h2>
            <button onClick={() => setShowForm(!showForm)} className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center gap-1.5 uppercase tracking-wider transition-transform active:scale-95">
              <Plus size={14} /> {bundle.btnPost}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handlePostMilestone} className="bg-white border border-slate-200 rounded-2xl p-5 text-left space-y-4 shadow-sm animate-[slideUp_0.15s_ease-out]">
              <textarea
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                placeholder={bundle.placeholderPost}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-slate-900 h-24 resize-none leading-relaxed"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 text-slate-500 font-bold text-[10px] uppercase rounded-lg tracking-wider">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase rounded-lg tracking-wider flex items-center gap-1">
                  {isSubmitting ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />} {bundle.btnSubmit}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {filteredCelebrations.map((c, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-start gap-4 text-left hover:border-rose-100 transition-colors">
                <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center font-black text-xs text-rose-600 shrink-0 border border-rose-100">🎉</div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black text-slate-900 font-mono">{c.user}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1"><Calendar size={10} /> {c.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium font-sans leading-relaxed">{c.text}</p>
                  <div className="flex items-center gap-4 pt-1 border-t border-slate-50 mt-2">
                    <button onClick={() => handleToggleLike(idx, 'celebration')} className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors ${celebrationHearts[idx] ? 'text-rose-600' : 'text-slate-400 hover:text-rose-500'}`}>
                      <Heart size={13} fill={celebrationHearts[idx] ? "currentColor" : "none"} /> {celebrationHearts[idx] ? 51 : 50} Hearts
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STYLED EXPANSION ANCHOR FOOTER CARD */}
      <div className="border-t border-slate-200 pt-8 max-w-4xl mx-auto">
        <div className="bg-white border-2 border-rose-100 p-5 rounded-2xl shadow-sm text-left flex flex-col sm:flex-row items-center gap-4 animate-[fadeIn_0.5s_ease-out]">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0 text-rose-500">
            <Globe size={20} />
          </div>
          <p className="text-xs font-semibold leading-relaxed text-slate-600 font-sans">{bundle.expansionBanner}</p>
        </div>
      </div>

    </div>
  );
}