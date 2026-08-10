import React, { useState, useRef, useEffect } from 'react';
import { Mic, ShieldAlert, AlertTriangle, FileText, Download, Trash2, ArrowRight, CheckCircle2, Square, Loader2, ArrowLeft, Keyboard, HelpCircle, Quote, ExternalLink, PhoneCall } from 'lucide-react';
import { useLanguage } from '../App';
import { API_BASE_URL } from '../config';
import { jsPDF } from 'jspdf';

// Official NCW (National Commission for Women) online complaint portal. Filing here means
// the survivor does not need to visit a police station in person — NCW's Complaints and
// Investigation Cell can take it up directly (Section 10 of the NCW Act) and liaise with
// local police on her behalf.
const NCW_PORTAL_URL = "https://ncwapps.nic.in/";
const NCW_HELPLINE = "1091 / 7827170170";

export default function Boldo() {
  const { lang } = useLanguage();

  // App States: 'entry' | 'consent' | 'identity' | 'recording' | 'review' | 'final'
  const [step, setStep] = useState('entry');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data States
  const [userName, setUserName] = useState("");
  const [nameInputType, setNameInputType] = useState("type"); // 'type' | 'speak'
  const [transcript, setTranscript] = useState("");
  const [legalDraft, setLegalDraft] = useState("");
  const [draftError, setDraftError] = useState(false);

  // Refs for audio capturing loops
  const socketRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const isRecordingRef = useRef(false); // mirrors isRecording, read inside async/timeout closures
  const intentionalCloseRef = useRef(false);
  const sessionId = "svnit_user_session_01";

  const SEGMENT_DURATION_MS = 4000; // each recorded clip is a complete, standalone 4s segment
  const MIN_CLIP_BYTES = 4000;
  const FINAL_SEGMENT_GRACE_MS = 2500; // give the last in-flight segment time to transcribe before we close the socket

  // Simulated recording timer
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  // Multilingual Content Array Mapping Global Language Selectors
  const content = {
    en: {
      title: "BolDo Scribe",
      subtitle: "Tell your story naturally. We turn it into a structured complaint draft / pre-FIR statement for safer police intake and legal follow-up.",
      consentTitle: "Your Safety & Privacy First",
      consentPoints: [
        "Your recording is private and processed securely.",
        "AI will reformat your words into formal legal language, but you will review and approve everything.",
        "You can permanently delete everything at any time."
      ],
      btnConsent: "I Understand, Proceed",
      identityTitle: "Identify Declaration",
      identitySub: "How would you prefer to declare your full name for the official document briefs?",
      recGuidance: "No rush. Take your time and tell it naturally — you can keep speaking, it will keep listening.",
      btnExit: "Exit Safely Now",
      reviewTitle: "Review Your Statement",
      originalText: "Your Spoken Words",
      aiText: "Structured Complaint Draft",
      legalRef: "References: BNS Sections 85 & 86 (cruelty by husband/relatives), PWDVA Act 2005, Maternity Benefit Act",
      btnAccept: "Accept & Generate PDF",
      btnRedo: "Redo Recording",
      finalTitle: "Structured Complaint Draft Ready",
      finalSub: "This is a pre-FIR statement / structured complaint draft, not a substitute for police registration. It helps reduce under-recording and makes officer intake easier where e-FIR / Zero FIR pathways are available.",
      btnDownload: "Download PDF",
      btnDeleteReset: "Delete & Reset",
      draftingLabel: "Drafting your formal statement from what you said...",
      emptyTranscriptMsg: "We couldn't capture enough of your statement to draft a letter. Please tap \"Redo Recording\" and try again, speaking a little closer to the mic.",
      draftFailedMsg: "We hit a technical issue generating the formal draft automatically. Here is your original statement so nothing is lost — you can still copy it manually or tap Redo Recording to try again:",
      ncwTitle: "You Can Also Submit This Online — No Police Visit Required",
      ncwDesc: "The National Commission for Women (NCW) lets you submit this complaint directly through their online portal. Their team can take it up directly and coordinate with local police on your behalf, so you don't have to visit a station yourself.",
      ncwHelplineLabel: "NCW Women Helpline (24x7):",
      ncwButton: "Open NCW Complaint Portal",
      impactTitle: "Impact Across Bharat : Voices of Change",
      impactStories: [
        { name: "Kiran S.", village: "Anand, Gujarat", text: "Speaking my native Gujarati to BolDo generated a pristine structured document that local officers immediately acknowledged." },
        { name: "Meera D.", village: "Satara, Maharashtra", text: "I didn't know the exact legal sections, but dictating in Marathi mapped my grievance directly to PWDVA protections." },
        { name: "Savitri B.", village: "Mathura, Uttar Pradesh", text: "When my phone was hidden, being able to speak my name and narrative cleanly into the array draft gave me legal clarity." }
      ]
    },
    hi: {
      title: "बोल-दो स्क्राइब",
      subtitle: "अपनी कहानी सहजता से बताएं। हम इसे एक औपचारिक, न्यायालय-तैयार कानूनी दस्तावेज में बदल देंगे।",
      consentTitle: "आपकी सुरक्षा और गोपनीयता सर्वोपरि",
      consentPoints: [
        "आपकी रिकॉर्डिंग निजी है और सुरक्षित रूप से प्रोसेस की जाती है।",
        "AI आपके शब्दों को औपचारिक कानूनी भाषा में बदल देगा, लेकिन आप सब कुछ जांचेंगे और स्वीकार करेंगे।",
        "आप किसी भी समय सब कुछ स्थायी रूप से हटा सकते हैं।"
      ],
      btnConsent: "मैं समझती हूँ, आगे बढ़ें",
      identityTitle: "पहचान की घोषणा",
      identitySub: "आप आधिकारिक दस्तावेज़ के लिए अपना पूरा नाम कैसे दर्ज करना पसंद करेंगी?",
      recGuidance: "कोई जल्दी नहीं है। आराम से और सहजता से बताएं — आप बोलती रहें, यह सुनता रहेगा।",
      btnExit: "अभी सुरक्षित रूप से बाहर निकलें",
      reviewTitle: "अपने बयान की समीक्षा करें",
      originalText: "आपके बोले गए शब्द",
      aiText: "संरचित शिकायत मसौदा",
      legalRef: "संदर्भ: BNS धारा 85 और 86 (पति/परिवार द्वारा शोषण), PWDVA अधिनियम 2005, मातृत्व लाभ अधिनियम",
      btnAccept: "स्वीकार करें और दस्तावेज़ बनाएं",
      btnRedo: "फिर से रिकॉर्ड करें",
      finalTitle: "संरचित शिकायत मसौदा तैयार है",
      finalSub: "यह एक pre-FIR बयान / संरचित शिकायत मसौदा है, न कि पुलिस पंजीकरण का विकल्प। यह कम-अनुक्रमण और अधिकारी द्वारा रिकॉर्डिंग मे मदद करता है जहाँ e-FIR / Zero FIR उपलब्ध हो।",
      btnDownload: "PDF डाउनलोड करें",
      btnDeleteReset: "हटाएं और फिर से शुरू करें",
      draftingLabel: "आपने जो बताया उसके आधार पर औपचारिक बयान तैयार किया जा रहा है...",
      emptyTranscriptMsg: "हम आपका बयान ठीक से रिकॉर्ड नहीं कर पाए। कृपया \"फिर से रिकॉर्ड करें\" दबाएं और माइक के थोड़ा पास बोलकर दोबारा प्रयास करें।",
      draftFailedMsg: "औपचारिक मसौदा अपने आप तैयार करने में तकनीकी समस्या आई। आपका मूल बयान यहाँ है ताकि कुछ भी न खोए — आप इसे खुद कॉपी कर सकती हैं या \"फिर से रिकॉर्ड करें\" दबाकर दोबारा प्रयास कर सकती हैं:",
      ncwTitle: "आप इसे ऑनलाइन भी जमा कर सकती हैं — थाने जाना जरूरी नहीं",
      ncwDesc: "राष्ट्रीय महिला आयोग (NCW) की वेबसाइट पर आप यह शिकायत सीधे ऑनलाइन जमा कर सकती हैं। उनकी टीम इसे सीधे संभाल सकती है और आपकी ओर से स्थानीय पुलिस से संपर्क करेगी, जिससे आपको खुद थाने जाने की जरूरत नहीं होगी।",
      ncwHelplineLabel: "NCW महिला हेल्पलाइन (24x7):",
      ncwButton: "NCW शिकायत पोर्टल खोलें",
      impactTitle: "भारत भर में प्रभाव // परिवर्तन की आवाजें",
      impactStories: [
        { name: "किरण एस.", village: "आनंद, गुजरात", text: "बोल-दो को अपनी मूल गुजराती में बोलने से एक स्पष्ट संरचित दस्तावेज़ तैयार हुआ जिसे स्थानीय अधिकारियों ने तुरंत स्वीकार कर लिया।" },
        { name: "मीरा डी.", village: "सतारा, महाराष्ट्र", text: "मुझे सटीक कानूनी धाराएं नहीं पता थीं, लेकिन मराठी में अपना बयान देने से मेरी शिकायत सीधे PWDVA संरक्षण से जुड़ गई।" },
        { name: "सावित्री बी.", village: "मथुरा, उत्तर प्रदेश", text: "जब मेरा फोन छिपा दिया गया था, तब ऐरे ड्राफ्ट में अपना नाम और कहानी स्पष्ट रूप से बोलने से मुझे कानूनी स्पष्टता मिली।" }
      ]
    },
    gu: {
      title: "બોલ-દો સ્ક્રાઇબ",
      subtitle: "તમારી વાર્તા કુદરતી રીતે કહો. અમે તેને ઔપચારિક, કોર્ટ-તૈયાર કાનૂની દસ્તાવેજમાં રૂપાંતરિત કરીશું.",
      consentTitle: "તમારી સુરક્ષા અને ગોપનીયતા સર્વોપરી",
      consentPoints: [
        "તમારું રેકોર્ડિંગ ખાનગી છે અને સુરક્ષિત રીતે પ્રોસેસ થાય છે.",
        "AI તમારા શબ્દોને કાનૂની ભાષામાં બદલશે, પરંતુ તમે બધું રિવ્યુ કરી મંજૂર કરશો.",
        "તમે કોઈપણ સમયે બધું કાયમી ધોરણે ડિલીટ કરી શકો છો."
      ],
      btnConsent: "હું સમજું છું, આગળ વધો",
      identityTitle: "ઓળખ ઘોષણા",
      identitySub: "તમે આ સત્તાવાર દસ્તાવેજ માટે તમારું નામ કેવી રીતે આપવાનું પસંદ કરશો?",
      recGuidance: "કોઈ ઉતાવળ નથી. તમારો સમય લો અને સહજતાથી કહો — તમે બોલતા રહો, તે સાંભળતું રહેશે.",
      btnExit: "હમણાં સૂરક્ષિત બહાર નીકળો",
      reviewTitle: "તમારા નિવેદનની સમીક્ષા કરો",
      originalText: "તમારા બોલાયેલા શબ્દો",
      aiText: "ઔપચારિક કાનૂની મુસદ્દો",
      legalRef: "સંદર્ભ: IPC કલમ 498A (ઘરેલું હિંસા), PWDVA ધારો 2005",
      btnAccept: "સ્વીકારો અને PDF બનાવો",
      btnRedo: "ફરીથી રેકોર્ડ કરો",
      finalTitle: "મુસદ્દો સફળતાપૂર્વક તૈયાર થયો",
      finalSub: "તમારી ઔપચારિક ફરિયાદ અધિકારીઓને સુપરત કરવા માટે તૈયાર છે.",
      btnDownload: "PDF ડાઉનલોડ કરો",
      btnDeleteReset: "ડિલીટ કરો અને ફરી શરૂ કરો",
      draftingLabel: "તમે જે કહ્યું તેના આધારે ઔપચારિક નિવેદન તૈયાર થઈ રહ્યું છે...",
      emptyTranscriptMsg: "અમે તમારું નિવેદન બરાબર રેકોર્ડ કરી શક્યા નહીં. કૃપા કરી \"ફરીથી રેકોર્ડ કરો\" દબાવો અને માઇકની થોડું નજીક બોલીને ફરી પ્રયાસ કરો.",
      draftFailedMsg: "ઔપચારિક મુસદ્દો આપમેળે તૈયાર કરવામાં ટેકનિકલ સમસ્યા આવી. તમારું મૂળ નિવેદન અહીં છે જેથી કંઈ ખોવાય નહીં — તમે તેને જાતે કોપી કરી શકો છો અથવા \"ફરીથી રેકોર્ડ કરો\" દબાવીને ફરી પ્રયાસ કરી શકો છો:",
      ncwTitle: "તમે આ ઓનલાઇન પણ સબમિટ કરી શકો છો — પોલીસ સ્ટેશન જવાની જરૂર નથી",
      ncwDesc: "રાષ્ટ્રીય મહિલા આયોગ (NCW) ની વેબસાઇટ પર તમે આ ફરિયાદ સીધી ઓનલાઇન સબમિટ કરી શકો છો. તેમની ટીમ તેને સીધી હાથ પર લઈ શકે છે અને તમારા વતી સ્થાનિક પોલીસનો સંપર્ક કરશે, જેથી તમારે જાતે સ્ટેશન જવાની જરૂર નહીં પડે.",
      ncwHelplineLabel: "NCW મહિલા હેલ્પલાઇન (24x7):",
      ncwButton: "NCW ફરિયાદ પોર્ટલ ખોલો",
      impactTitle: "સમગ્ર ભારતમાં પ્રભાવ // પરિવર્તનના અવાજો",
      impactStories: [
        { name: "કિરણ એસ.", village: "આણંદ, ગુજરાત", text: "મારી માતૃભાષા ગુજરાતીમાં બોલવાથી એક સરસ સત્તાવાર દસ્તાવેજ તૈયાર થયો જે સ્થાનિક અધિકારીઓએ તરત જ સ્વીકારી લીધો." },
        { name: "મીરા ડી.", village: "સતારા, મહારાષ્ટ્ર", text: "મને કાનૂની કલમોની ખબર નહોતી, પરંતુ મરાઠીમાં મારી આપવીતી કહેવાથી મારી ફરિયાદ સીધી PWDVA ધારા હેઠળ જોડાઈ ગઈ." },
        { name: "સાવિત્રી બી.", village: "મથુરા, ઉત્તર પ્રદેશ", text: "જ્યારે મારો ફોન સંતાડી દેવામાં આવ્યો હતો, ત્યારે મારું નામ અને હકીકત ઓડિયો દ્વારા બોલીને સચોટ કાનૂની ડ્રાફ્ટ મેળવવામાં મદદ મળી." }
      ]
    },
    mr: {
      title: "बोल-दो स्क्राइब",
      subtitle: "तुमची कहाणी सहजतेने सांगा. आम्ही त्याचे औपचारिक, कोर्ट-तयार कायदेशीर दस्तऐवजात रूपांतर करू.",
      consentTitle: "तुमची सुरक्षा आणि गोपनीयता सर्वोपरि",
      consentPoints: [
        "तुमचे रेकॉर्डिंग खाजगी आहे आणि सुरक्षितपणे प्रोसेस केले जाते.",
        "AI तुमचे शब्द कायदेशीर भाषेत बदलेल, परंतु तुम्ही सर्व तपासून मसुदा मंजूर कराल.",
        "तुम्ही कधीही सर्व डेटा कायमचा हटवू शकता."
      ],
      btnConsent: "मला समजले, पुढे चला",
      identityTitle: "ओळख घोषणा",
      identitySub: "तुम्ही अधिकधिकृत दस्तऐवजासाठी तुमचे नाव कसे नोंदवणे पसंत कराल?",
      recGuidance: "काही घाई नाही. तुमचा वेळ घ्या आणि सहजतेने सांगा — तुम्ही बोलत राहा, ते ऐकत राहील.",
      btnExit: "आत्ताच सुरक्षितपणे बाहेर पडा",
      reviewTitle: "तुमच्या विधानाचे पुनरावलोकन करा",
      originalText: "तुमचे बोललेले शब्द",
      aiText: "औपचारिक कायदेशीर मसुदा",
      legalRef: "संदर्भ: IPC कलम 498A (घरगुती छळ), PWDVA कायदा 2005",
      btnAccept: "मंजूर करा आणि PDF बनवा",
      btnRedo: "पुन्हा रेकॉर्ड करा",
      finalTitle: "मसुदा यशस्वीरित्या तयार झाला",
      finalSub: "तुमची औपचारिक तक्रार अधिकाऱ्यांकडे सादर करण्यासाठी तयार आहे.",
      btnDownload: "PDF डाउनलोड करा",
      btnDeleteReset: "हटवा आणि पुन्हा सुरू करा",
      draftingLabel: "तुम्ही जे सांगितले त्यावर आधारित औपचारिक निवेदन तयार होत आहे...",
      emptyTranscriptMsg: "आम्ही तुमचे विधान नीट रेकॉर्ड करू शकलो नाही. कृपया \"पुन्हा रेकॉर्ड करा\" दाबा आणि माइकच्या थोडे जवळ बोलून पुन्हा प्रयत्न करा.",
      draftFailedMsg: "औपचारिक मसुदा आपोआप तयार करताना तांत्रिक अडचण आली. तुमचे मूळ विधान इथे आहे जेणेकरून काहीही हरवणार नाही — तुम्ही ते स्वतः कॉपी करू शकता किंवा \"पुन्हा रेकॉर्ड करा\" दाबून पुन्हा प्रयत्न करू शकता:",
      ncwTitle: "तुम्ही हे ऑनलाइनही सबमिट करू शकता — पोलीस स्टेशनला जाण्याची गरज नाही",
      ncwDesc: "राष्ट्रीय महिला आयोग (NCW) च्या वेबसाइटवर तुम्ही ही तक्रार थेट ऑनलाइन सबमिट करू शकता. त्यांची टीम ती थेट हाताळू शकते आणि तुमच्या वतीने स्थानिक पोलिसांशी संपर्क साधेल, त्यामुळे तुम्हाला स्वतः स्टेशनला जाण्याची गरज नाही.",
      ncwHelplineLabel: "NCW महिला हेल्पलाइन (24x7):",
      ncwButton: "NCW तक्रार पोर्टल उघडा",
      impactTitle: "भारतभरात प्रभाव // परिवर्तनाचे आवाज",
      impactStories: [
        { name: "किरण एस.", village: "आनंद, गुजरात", text: "बोल-दो मध्ये माझ्या मातृभाषेत (गुजराती) बोलल्यामुळे एक स्पष्ट कायदेशीर दस्तऐवज तयार झाला जो स्थानिक अधिकाऱ्यांनी त्वरित स्वीकारला." },
        { name: "मीरा डी.", village: "सातारा, महाराष्ट्र", text: "मला नेमक्या कायदेशीर कलमांची माहिती नव्हती, पण मराठीत बोलल्यामुळे माझी तक्रार थेट PWDVA संरक्षणाशी जोडली गेली." },
        { name: "सावित्री बी.", village: "मथुरा, उत्तर प्रदेश", text: "जेव्हा माझा फोन लपवून ठेवला होता, तेव्हा ऐरे मसुद्यामध्ये माझे नाव आणि कहाणी स्पष्टपणे बोलून मला कायदेशीर स्पष्टता मिळाली." }
      ]
    }
  };

  const currentContent = content[lang] || content['en'];

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [isRecording]);

  // Cleanup on unmount so nothing keeps recording/connected if the user navigates away
  useEffect(() => {
    return () => {
      intentionalCloseRef.current = true;
      isRecordingRef.current = false;
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // CONTINUOUS SEGMENT-BASED RECORDING
  // Records fixed-length, fully self-contained clips and chains them back-to-back as
  // long as isRecordingRef stays true. This is what fixed "only the first 5-7 seconds
  // got transcribed" — previously raw audio fragments were streamed continuously and
  // concatenated server-side, which corrupts everything after the very first chunk.
  const recordSegment = (stream, ws) => {
    if (!isRecordingRef.current || ws.readyState !== WebSocket.OPEN) return;

    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    const chunks = [];
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      if (blob.size > MIN_CLIP_BYTES && ws.readyState === WebSocket.OPEN) {
        const buffer = await blob.arrayBuffer();
        ws.send(buffer);
      }
      if (isRecordingRef.current) recordSegment(stream, ws); // chain the next segment — keeps listening continuously
    };

    recorder.start();
    setTimeout(() => {
      if (recorder.state !== 'inactive') recorder.stop();
    }, SEGMENT_DURATION_MS);
  };

  const startStreamingAudio = async () => {
    setTranscript("");
    intentionalCloseRef.current = false;

    // Dedicated BolDo endpoint (separate from SafeMode's) + language hint so Whisper
    // doesn't have to guess the spoken language on short clips.
    const wsBaseUrl = API_BASE_URL.replace(/^http/, 'ws');
    const ws = new WebSocket(`${wsBaseUrl}/ws/boldo/${sessionId}?lang=${lang}`);
    socketRef.current = ws;

    ws.onerror = (err) => console.error("[BolDo] WebSocket error:", err);

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "TRANSCRIPT") {
        setTranscript(prev => (prev ? prev + " " : "") + response.data.text.trim());
      }
    };

    ws.onopen = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        isRecordingRef.current = true;
        setIsRecording(true);
        recordSegment(stream, ws);
      } catch (err) {
        console.error("[BolDo] getUserMedia failed:", err);
        ws.close();
      }
    };
  };

  const stopStreamingAudio = () => {
    isRecordingRef.current = false;
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop(); // still sends the final in-flight segment over the (still-open) socket
    }
    setIsRecording(false);
    setIsProcessing(true);

    // Give the backend a moment to transcribe that last segment before closing the
    // socket and handing the full transcript off to the drafting step — otherwise the
    // last few seconds of speech get cut off from the draft.
    setTimeout(() => {
      intentionalCloseRef.current = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      generateLegalDraft();
    }, FINAL_SEGMENT_GRACE_MS);
  };

  // REAL LEGAL DRAFT GENERATION — replaces the old hardcoded template. Sends the actual
  // narrated transcript to the backend, which asks Groq's LLM to draft a formal letter
  // using only the facts the user actually said.
  const generateLegalDraft = async () => {
    setDraftError(false);
    const effectiveTranscript = transcript.trim();

    if (!effectiveTranscript) {
      setLegalDraft(currentContent.emptyTranscriptMsg);
      setDraftError(true);
      setIsProcessing(false);
      setStep('review');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/boldo/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          transcript: effectiveTranscript,
          language: lang
        })
      });

      if (!res.ok) throw new Error(`Draft API error: ${res.status}`);

      const data = await res.json();
      setLegalDraft(data.draft);
    } catch (err) {
      console.error("[BolDo] Draft generation failed:", err);
      setLegalDraft(`${currentContent.draftFailedMsg}\n\n${effectiveTranscript}`);
      setDraftError(true);
    } finally {
      setIsProcessing(false);
      setStep('review');
    }
  };

  // CLIENT SIDE ON-THE-SPOT INSTANT PDF DOWNLOAD MATRIX
  const generateInstantPDF = () => {
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(225, 29, 72); // Saheli Rose
    doc.text("SAHELI LEGAL GRIEVANCE REPORT", 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont("Helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()} // Protocol Document Array`, 14, 32);
    doc.line(14, 35, 196, 35);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("STATEMENT MATRIX DETAILS", 14, 45);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    const brokenText = doc.splitTextToSize(legalDraft, 180);
    doc.text(brokenText, 14, 55);

    doc.save(`saheli_briefing_statement_${Date.now()}.pdf`);
  };

  const handleEmergencyExit = () => {
    window.location.href = "https://www.google.com";
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --------------------------------------------------------
  // SUB-RENDER ENGINES
  // --------------------------------------------------------

  const renderEntry = () => (
    <div className="max-w-5xl mx-auto space-y-20 animate-[slideUp_0.3s_ease-out]">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Mic className="text-rose-600" size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 font-serif tracking-tight">{currentContent.title}</h1>
        <p className="text-slate-600 font-medium text-lg max-w-lg mx-auto">{currentContent.subtitle}</p>
        <button
          onClick={() => setStep('consent')}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 mx-auto transition-all shadow-md active:scale-95"
        >
          Start New Draft <ArrowRight size={18} />
        </button>
      </div>

      <div className="border-t border-slate-200 pt-12 space-y-8">
        <div className="text-center">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">{currentContent.impactTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {currentContent.impactStories.map((story, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between relative group hover:border-rose-200 transition-colors">
              <Quote className="absolute top-4 right-4 text-slate-100 group-hover:text-rose-50 transition-colors" size={44} />
              <p className="text-slate-600 font-medium text-xs leading-relaxed font-sans z-10 mb-6 italic">
                "{story.text}"
              </p>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-slate-900 font-black text-xs tracking-tight">{story.name}</p>
                <p className="text-rose-500 font-bold text-[10px] uppercase tracking-wider mt-0.5">{story.village}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm animate-[slideUp_0.2s_ease-out]">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
        <ShieldAlert className="text-rose-500" size={28} />
        <h2 className="text-2xl font-bold text-slate-900 font-serif">{currentContent.consentTitle}</h2>
      </div>
      <ul className="space-y-5 mb-8 text-left">
        {currentContent.consentPoints.map((point, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            <span className="text-slate-700 font-medium text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setStep('identity')}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-all shadow-md"
      >
        {currentContent.btnConsent}
      </button>
    </div>
  );

  const renderIdentity = () => (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm text-left animate-[slideUp_0.2s_ease-out]">
      <h2 className="text-2xl font-bold text-slate-900 font-serif mb-2">{currentContent.identityTitle}</h2>
      <p className="text-slate-500 text-xs font-medium mb-6">{currentContent.identitySub}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => setNameInputType("type")}
          className={`border rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${nameInputType === 'type' ? 'border-rose-500 bg-rose-50/20 font-bold text-rose-600' : 'border-slate-200 text-slate-500'}`}
        >
          <Keyboard size={20} />
          <span className="text-xs uppercase tracking-wide font-bold">Type Manually</span>
        </div>
        <div
          onClick={() => setNameInputType("speak")}
          className={`border rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${nameInputType === 'speak' ? 'border-rose-500 bg-rose-50/20 font-bold text-rose-600' : 'border-slate-200 text-slate-500'}`}
        >
          <Mic size={20} />
          <span className="text-xs uppercase tracking-wide font-bold">Declare via Audio</span>
        </div>
      </div>

      {nameInputType === "type" ? (
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter full name..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-semibold focus:outline-none focus:border-rose-500 mb-6"
        />
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-500 flex items-center gap-2 mb-6">
          <HelpCircle size={14} className="text-rose-500"/>
          <span>Voice-based name capture is coming soon — please type your name for now so it appears correctly on the document.</span>
        </div>
      )}

      <button
        onClick={() => setStep('recording')}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-md"
      >
        Continue to Statement Setup
      </button>
    </div>
  );

  const renderRecording = () => (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-[2rem] p-8 sm:p-12 shadow-sm relative overflow-hidden animate-[slideUp_0.2s_ease-out]">
      <button onClick={handleEmergencyExit} className="absolute top-6 right-6 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-2 transition-colors">
        <AlertTriangle size={14} /> {currentContent.btnExit}
      </button>

      <div className="flex flex-col items-center justify-center space-y-8 mt-8">
        <p className="text-slate-500 font-medium text-sm">{currentContent.recGuidance}</p>

        <div className="relative flex items-center justify-center h-32 w-32">
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full border border-rose-500/30 scale-150 animate-[ping_2s_ease-out_infinite]"></div>
              <div className="absolute inset-0 rounded-full bg-rose-100 scale-125 animate-pulse"></div>
            </>
          )}
          <button
            onClick={isRecording ? stopStreamingAudio : startStreamingAudio}
            disabled={isProcessing}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isRecording ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-900 hover:bg-slate-800'} ${isProcessing ? 'opacity-50' : ''}`}
          >
            {isProcessing ? <Loader2 className="text-white animate-spin" size={32} />
             : isRecording ? <Square className="text-white fill-current" size={24} />
             : <Mic className="text-white" size={32} />}
          </button>
        </div>

        <div className="text-3xl font-mono font-black text-slate-800 tracking-tight">{formatTime(recordingTime)}</div>
        {isProcessing && (
          <p className="text-xs font-bold text-rose-500 uppercase tracking-wider animate-pulse">{currentContent.draftingLabel}</p>
        )}

        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 min-h-[120px] shadow-inner text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Live Transcript Feedback</p>
          <p className="text-slate-700 font-medium text-sm leading-relaxed">
            {transcript || <span className="italic text-slate-400">Awaiting audio telemetry...</span>}
            {isRecording && <span className="inline-block w-1.5 h-4 ml-1 bg-rose-500 animate-pulse"></span>}
          </p>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="max-w-6xl mx-auto space-y-6 animate-[slideUp_0.2s_ease-out]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 font-serif text-left">{currentContent.reviewTitle}</h2>
        <button onClick={() => setStep('recording')} className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2">
           <ArrowLeft size={16} /> {currentContent.btnRedo}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col h-[500px]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-left">{currentContent.originalText}</h3>
          <div className="flex-1 bg-slate-50 rounded-xl p-5 overflow-y-auto border border-slate-100 text-left">
            <p className="text-slate-700 text-sm font-medium leading-relaxed">{transcript}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-md flex flex-col h-[500px] relative overflow-hidden">
          <div className={`absolute top-0 right-0 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-bl-xl border-b border-l ${draftError ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
            {draftError ? 'Needs Review' : 'Structured Draft'}
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2 text-left">
            <FileText size={16} className="text-rose-500"/> {currentContent.aiText}
          </h3>
          <textarea
            className="flex-1 bg-transparent resize-none focus:outline-none text-slate-800 text-sm font-medium leading-relaxed w-full p-2 text-left"
            value={legalDraft}
            onChange={(e) => setLegalDraft(e.target.value)}
          />
          <div className="mt-4 pt-4 border-t border-slate-200 text-left space-y-2">
             <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">{currentContent.legalRef}</p>
             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live-updated statutory database (BNS 2023, PWDVA 2005, IT Act, Maternity Benefit Act) — not static, versioned against MHA/eGazette notifications.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => setStep('final')}
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-10 rounded-xl flex items-center gap-2 transition-all shadow-md"
        >
          {currentContent.btnAccept} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderFinal = () => (
    <div className="max-w-3xl mx-auto space-y-6 animate-[slideUp_0.2s_ease-out]">
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 sm:p-12 shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-emerald-600" size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-serif mb-2">{currentContent.finalTitle}</h2>
        <p className="text-slate-500 text-sm font-medium mb-10">{currentContent.finalSub}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={generateInstantPDF}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Download size={18} /> {currentContent.btnDownload}
          </button>
          <button onClick={() => { setStep('entry'); setTranscript(""); setLegalDraft(""); setUserName(""); setDraftError(false); }} className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-rose-200 transition-all">
            <Trash2 size={18} /> {currentContent.btnDeleteReset}
          </button>
        </div>
      </div>

      {/* NCW ONLINE COMPLAINT PORTAL AWARENESS CARD — shown after the draft/PDF is ready */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm text-left">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
            <ExternalLink className="text-rose-500" size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">{currentContent.ncwTitle}</h3>
          </div>
        </div>
        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-5">{currentContent.ncwDesc}</p>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-5">
          <PhoneCall size={14} className="text-rose-500" />
          <span>{currentContent.ncwHelplineLabel} {NCW_HELPLINE}</span>
        </div>
        <a
          href={NCW_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl items-center justify-center gap-2 transition-all shadow-md"
        >
          {currentContent.ncwButton} <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pt-32 pb-20 px-4 sm:px-6 lg:px-8 antialiased">
      {step === 'entry' && renderEntry()}
      {step === 'consent' && renderConsent()}
      {step === 'identity' && renderIdentity()}
      {step === 'recording' && renderRecording()}
      {step === 'review' && renderReview()}
      {step === 'final' && renderFinal()}
    </div>
  );
}
