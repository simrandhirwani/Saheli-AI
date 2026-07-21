import React, { useState, useEffect, useRef } from 'react';
import { Mic, Shield, AlertTriangle, Plus, Trash2, User, Smartphone, Activity, Info } from 'lucide-react';
import { useLanguage } from '../App';
import { API_BASE_URL } from '../config';

export default function SafeMode() {
  const { lang } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosReason, setSosReason] = useState(null); // 'manual' | 'auto'
  const [sosMeta, setSosMeta] = useState(null); // { keyword, text }
  const [showModal, setShowModal] = useState(false);

  const [liveLogs, setLiveLogs] = useState([]);
  const [systemLog, setSystemLog] = useState("");

  // Refs
  const socketRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const isRecordingRef = useRef(false); // mirrors isRecording, read inside async/timeout closures
  const sosTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const intentionalCloseRef = useRef(false);
  const sessionId = "svnit_user_session_01";

  const MAX_RECONNECT_ATTEMPTS = 4;
  const SEGMENT_DURATION_MS = 4000; // each recorded clip is a complete, standalone 4s segment
  const MIN_CLIP_BYTES = 4000; // skip near-silent clips client-side too, saves a wasted API call

  const labels = {
    en: {
      title: "SafeMode OS", subtitle: "Continuous Acoustic Telemetry & Threat Recognition",
      badgeStandby: "System Standby", badgeActive: "Streaming Live",
      orbTap: "TAP TO ARM SYSTEM", orbListening: "ACOUSTIC ARRAY ACTIVE",
      logReady: "SYSTEM INITIALIZED // Awaiting background telemetry loop...",
      logPaused: "⚠ PAUSED // Audio capture streams suspended safely.",
      logCritical: "🚨 CRITICAL SOS // Incident data packet and live coordinates successfully transmitted.",
      logReconnecting: "⚠ Connection dropped. Attempting to reconnect...",
      logReconnectFailed: "✕ Could not reconnect. Tap the orb to restart telemetry.",
      contactsTitle: "Emergency Nodes", contactsSub: "Outbound delivery endpoints for distress payloads.",
      btnText: "TEST SOS PANIC BROADCAST",
      overlayTitle: "SOS Broadcast Dispatched",
      overlaySub: "Emergency coordinate packets pushed to your WhatsApp notification array.",
      autoAlertTitle: "Distress Phrase Detected",
      autoAlertSub: "Okay — emergency contacts alerted.",
      disclaimer: "Demo mode: contacts and alerts are simulated for this prototype. Automatic live SMS/WhatsApp dispatch is planned for the next build."
    },
    hi: {
      title: "सेफमोड ओएस", subtitle: "सतत ध्वनिक निगरानी और खतरा पहचान प्रणाली",
      badgeStandby: "सिस्टम स्टैंडबाय", badgeActive: "लाइव स्ट्रीमिंग",
      orbTap: "सिस्टम को आर्म करें", orbListening: "ध्वनिक एरे सक्रिय",
      logReady: "सिस्टम तैयार है // डिवाइस डेटा इनिशियलाइजेशन की प्रतीक्षा है...",
      logPaused: "⚠ रोक दिया गया // ऑडियो कैप्चर सुरक्षित रूप से निलंबित।",
      logCritical: "🚨 संकट कालीन स्थिति // आपातकालीन संदेश पैकेट सफलतापूर्वक भेजा गया।",
      logReconnecting: "⚠ कनेक्शन टूट गया। पुनः कनेक्ट करने की कोशिश जारी है...",
      logReconnectFailed: "✕ पुनः कनेक्ट नहीं हो सका। दोबारा शुरू करने के लिए ऑर्ब पर टैप करें।",
      contactsTitle: "आपातकालीन संपर्क सूत्र", contactsSub: "संकट की स्थिति में संदेश भेजने के लिए पंजीकृत नंबर।",
      btnText: "परीक्षण आपातकालीन ब्रॉडकास्ट",
      overlayTitle: "एसओएस अलर्ट भेजा गया",
      overlaySub: "आपातकालीन स्थान विवरण आपके व्हाट्सएप संपर्कों को सुरक्षित भेज दिया गया है।",
      autoAlertTitle: "संकट सूचक शब्द पहचाना गया",
      autoAlertSub: "ठीक है — आपातकालीन संपर्कों को सूचित कर दिया गया है।",
      disclaimer: "डेमो मोड: यह प्रोटोटाइप है, संपर्क और अलर्ट अभी सिम्युलेटेड हैं। अगले चरण में लाइव एसएमएस/व्हाट्सएप भेजना स्वचालित रूप से जोड़ा जाएगा।"
    },
    gu: {
      title: "સેફમોડ ઓએસ", subtitle: "સતત ઓડિયો મોનિટરિંગ અને જોખમ ઓળખ સિસ્ટમ",
      badgeStandby: "સિસ્ટમ સ્ટેન્ડબાય", badgeActive: "લાઇવ સ્ટ્રીમિંગ",
      orbTap: "સિસ્ટમ સક્રિય કરો", orbListening: "ઓડિયો એરે સક્રિય",
      logReady: "સિસ્ટમ તૈયાર છે // ડિવાઇસ ડેટા કનેક્શનની પ્રતીક્ષા છે...",
      logPaused: "⚠ અટકાવેલ છે // ઓડિયો કેપ્ચર સુરક્ષિત રીતે સ્થગિત.",
      logCritical: "🚨 કટોકટી ચેતવણી // ઇમરજન્સી મેસેજ સફળતાપૂર્વક મોકલવામાં આવ્યો છે.",
      logReconnecting: "⚠ કનેક્શન તૂટી ગયું. ફરીથી કનેક્ટ કરવાનો પ્રયાસ ચાલુ છે...",
      logReconnectFailed: "✕ ફરીથી કનેક્ટ થઈ શક્યું નહીં. ફરી શરૂ કરવા ઓર્બ પર ટેપ કરો.",
      contactsTitle: "ઇમરજન્સી સંપર્કો", contactsSub: "મુશ્કેલીના સમયે મેસેજ મોકલવા માટે રજિસ્ટર્ડ નંબર.",
      btnText: "ઇમરજન્સી બ્રોડકાસ્ટ ટેસ્ટ",
      overlayTitle: "SOS એલર્ટ મોકલાયું",
      overlaySub: "ઇમરજન્સી લોકેશન વિગતો તમારા વોટ્સએપ સંપર્કોને મોકલી દેવામાં આવી છે.",
      autoAlertTitle: "તકલીફ સૂચક શબ્દ ઓળખાયો",
      autoAlertSub: "ઠીક છે — ઇમરજન્સી સંપર્કોને જાણ કરવામાં આવી છે.",
      disclaimer: "ડેમો મોડ: આ પ્રોટોટાઇપ છે, સંપર્કો અને એલર્ટ હાલ સિમ્યુલેટેડ છે. આગલા તબક્કામાં લાઇવ એસએમએસ/વોટ્સએપ ઓટોમેટિક મોકલવામાં આવશે."
    },
    mr: {
      title: "सेफमोड ओएस", subtitle: "सतत ऑडिओ मॉनिटरिंग आणि धोका ओळख प्रणाली",
      badgeStandby: "सिस्टम स्टँडबाय", badgeActive: "लाइव्ह स्ट्रीमिंग",
      orbTap: "सिस्टम आर्म करा", orbListening: "ऑडिओ ॲरे सक्रिय",
      logReady: "सिस्टम तयार आहे // डिव्हाइस डेटा इनिशियलायझेशनची प्रतीक्षा आहे...",
      logPaused: "⚠ थांबवले आहे // ऑडिओ कॅप्चर सुरक्षितपणे निलंबित.",
      logCritical: "🚨 आणीबाणी चेतावणी // आपत्कालीन संदेश यशस्वीरित्या पाठवला गेला आहे.",
      logReconnecting: "⚠ कनेक्शन तुटले. पुन्हा कनेक्ट करण्याचा प्रयत्न सुरू आहे...",
      logReconnectFailed: "✕ पुन्हा कनेक्ट होऊ शकले नाही. पुन्हा सुरू करण्यासाठी ऑर्बवर टॅप करा.",
      contactsTitle: "आपत्कालीन संपर्क", contactsSub: "संकटकाळात संदेश पाठवण्यासाठी नोंदणीकृत नंबर.",
      btnText: "आणीबाणी ब्रॉडकास्ट चाचणी",
      overlayTitle: "SOS अलर्ट पाठवला",
      overlaySub: "आपत्कालीन लोकेशन तपशील तुमच्या व्हॉट्सॲप संपर्कांना पाठवला गेला आहे.",
      autoAlertTitle: "संकट सूचक शब्द ओळखला",
      autoAlertSub: "ठीक आहे — आपत्कालीन संपर्कांना सूचित केले गेले आहे.",
      disclaimer: "डेमो मोड: हा प्रोटोटाइप आहे, संपर्क आणि अलर्ट सध्या सिम्युलेटेड आहेत. पुढील टप्प्यात थेट एसएमएस/व्हॉट्सॲप आपोआप पाठवले जाईल."
    }
  };

  const currentContent = labels[lang] || labels['en'];

  // FETCH PERSISTED 24-HOUR LOGS FROM NEON ON MOUNT
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/safemode/logs/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setLiveLogs(data);
          setSystemLog(`Loaded ${data.length} active telemetry traces from the last 24 hours.`);
        } else {
          setSystemLog(currentContent.logReady);
        }
      })
      .catch(() => setSystemLog(currentContent.logReady));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // CLEANUP ON UNMOUNT
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
      if (sosTimerRef.current) {
        clearTimeout(sosTimerRef.current);
      }
    };
  }, []);

  const triggerOverlay = (reason, meta = null) => {
    if (sosTimerRef.current) clearTimeout(sosTimerRef.current);
    setSosReason(reason);
    setSosMeta(meta);
    setSosActive(true);
    // Screen stays red for exactly 3 seconds, then clears itself automatically
    sosTimerRef.current = setTimeout(() => {
      setSosActive(false);
      setSosReason(null);
      setSosMeta(null);
    }, 3000);
  };

  // CONTINUOUS SEGMENT-BASED RECORDING
  // Records fixed-length, fully self-contained clips (stop -> send -> start a fresh
  // recorder) and chains them back-to-back as long as isRecordingRef stays true. This
  // is what makes listening genuinely continuous instead of stopping after ~10s: each
  // clip is independently valid audio, so there's nothing to "run out" or corrupt.
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
      if (isRecordingRef.current) recordSegment(stream, ws); // chain the next segment
    };

    recorder.start();
    setTimeout(() => {
      if (recorder.state !== 'inactive') recorder.stop();
    }, SEGMENT_DURATION_MS);
  };

  const startStreamingEngine = async () => {
    intentionalCloseRef.current = false;
    setSystemLog("Connecting to secure backend sockets...");

    const wsBaseUrl = API_BASE_URL.replace(/^http/, 'ws');
    const ws = new WebSocket(`${wsBaseUrl}/ws/safemode/${sessionId}?lang=${lang}`);
    socketRef.current = ws;

    ws.onerror = (err) => console.error("[SafeMode] WebSocket error:", err);

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "TRANSCRIPT") {
        setLiveLogs(prev => [...prev, response.data]);
        setSystemLog(`✓ [Whisper Engine]: "${response.data.text}"`);
      }
      if (response.type === "DANGER_ALERT") {
        setSystemLog(currentContent.logCritical);
        triggerOverlay('auto', response.data);
      }
    };

    ws.onopen = async () => {
      reconnectAttemptsRef.current = 0;
      try {
        let stream = streamRef.current;
        if (!stream || !stream.active) {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
        }
        isRecordingRef.current = true;
        setIsRecording(true);
        recordSegment(stream, ws);
      } catch (err) {
        console.error("[SafeMode] getUserMedia failed:", err);
        setSystemLog("Device hardware context deployment failed: Microphone Access Denied.");
        ws.close();
      }
    };

    ws.onclose = () => {
      if (intentionalCloseRef.current) return;
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        setSystemLog(currentContent.logReconnectFailed);
        isRecordingRef.current = false;
        setIsRecording(false);
        return;
      }
      reconnectAttemptsRef.current += 1;
      setSystemLog(currentContent.logReconnecting);
      setTimeout(() => {
        if (!intentionalCloseRef.current) startStreamingEngine();
      }, 2000 * reconnectAttemptsRef.current);
    };
  };

  const stopStreamingEngine = () => {
    intentionalCloseRef.current = true;
    isRecordingRef.current = false;
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsRecording(false);
    setSystemLog(currentContent.logPaused);
  };

  // CORE EMERGENCY DISPATCH TRIGGER HANDLER (manual test button)
  const handleSendSOS = () => {
    triggerOverlay('manual');
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      startStreamingEngine();
    }
  };

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', relation: 'Primary Emergency', phone: '9876543210' },
    { id: 2, name: 'Dad', relation: 'Primary Emergency', phone: '9876543211' }
  ]);

  const handleAddContact = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setContacts([...contacts, {
      id: Date.now(),
      name: formData.get('name'),
      relation: formData.get('relation'),
      phone: formData.get('phone')
    }]);
    setShowModal(false);
  };

  const handleDeleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 antialiased transition-colors duration-300">

      {/* OVERLAY */}
      {sosActive && (
        <div className="fixed inset-0 bg-red-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase font-serif">
              {sosReason === 'auto' ? currentContent.autoAlertTitle : currentContent.overlayTitle}
            </h2>
            <p className="text-slate-600 text-sm mt-2 font-medium">
              {sosReason === 'auto' ? currentContent.autoAlertSub : currentContent.overlaySub}
            </p>
            {sosReason === 'auto' && sosMeta?.keyword && (
              <p className="text-[11px] text-red-500 font-bold uppercase tracking-wider">
                Detected phrase: "{sosMeta.keyword}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="text-center border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight flex items-center justify-center gap-2">
          <Shield className="text-rose-500" size={28} /> {currentContent.title}
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          {currentContent.subtitle}
        </p>
      </div>

      {/* CORE ACTIVE ORB PANELS */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center text-center space-y-8">

        <div
          onClick={isRecording ? stopStreamingEngine : startStreamingEngine}
          role="button"
          aria-label={isRecording ? currentContent.orbListening : currentContent.orbTap}
          className={`w-48 h-48 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-500 ${
            isRecording ? 'scale-105' : 'hover:scale-105'
          }`}
        >
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full border border-rose-500/20 scale-[1.35] animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50"></div>
              <div className="absolute inset-0 rounded-full border border-rose-400/30 scale-110 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            </>
          )}

          <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-300 ${isRecording ? 'border-rose-400 bg-rose-50/40 shadow-lg' : 'border-slate-200 bg-slate-50 shadow-inner'}`}></div>
          <div className="z-20 flex flex-col items-center">
            {isRecording ? <Activity size={36} className="text-rose-500 mb-2 animate-pulse" /> : <Mic size={36} className="text-slate-400 mb-2" />}
            <span className={`text-[10px] font-black tracking-widest uppercase ${isRecording ? 'text-rose-600' : 'text-slate-400'}`}>{isRecording ? currentContent.orbListening : currentContent.orbTap}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full pt-6 border-t border-slate-100 text-left font-sans text-xs">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Integrity</p><p className="font-bold text-slate-800">Encrypted</p></div>
          <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pipeline</p><p className="font-bold text-slate-800">Neon Cluster</p></div>
          <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p><p className={`font-bold ${isRecording ? 'text-emerald-600' : 'text-slate-500'}`}>{isRecording ? currentContent.badgeActive : currentContent.badgeStandby}</p></div>
          <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Geofence</p><p className="font-bold text-slate-800">India</p></div>
        </div>
      </div>

      {/* LIVE INTERACTIVE TIME TERMINAL */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-inner space-y-3 max-w-3xl mx-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-500 font-bold tracking-wider uppercase text-[10px]">Active 24-Hour Telemetry Log Feed</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <div className="max-h-[160px] overflow-y-auto space-y-2 text-left font-mono text-xs text-slate-600 pr-1">
          {liveLogs.length === 0 ? (
            <p className="italic text-slate-400">{systemLog}</p>
          ) : (
            liveLogs.map((log, index) => (
              <div key={index} className="bg-white border border-slate-100 p-2.5 rounded-lg shadow-sm flex gap-3">
                <span className="text-rose-500/80 font-bold tracking-tight">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="text-slate-700 font-medium font-sans">"{log.text}"</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CONTACTS CARD BASE */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-sm max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-serif">{currentContent.contactsTitle}</h3>
            <p className="text-slate-500 text-xs font-medium mt-0.5">{currentContent.contactsSub}</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-rose-500 text-white p-2.5 rounded-xl hover:bg-rose-600 shadow-md" aria-label="Add contact"><Plus size={16} /></button>
        </div>

        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-left">
          <Info size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-amber-800 font-medium leading-relaxed">{currentContent.disclaimer}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map(c => (
            <div key={c.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><User size={15} /></div>
                <div><p className="text-slate-800 font-bold text-sm">{c.name}</p><p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider">{c.relation}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone size={14} className="text-slate-400" />
                <button onClick={() => handleDeleteContact(c.id)} aria-label={`Remove ${c.name}`} className="text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 flex flex-col items-center border-t border-slate-100">
          <button onClick={handleSendSOS} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-xl text-xs tracking-widest uppercase shadow-md">{currentContent.btnText}</button>
        </div>
      </div>

      {/* CONTACT ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddContact} className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl w-full max-w-md space-y-5 shadow-2xl animate-[slideUp_0.2s_ease-out]">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Add Network Node</h3>
              <p className="text-slate-500 text-xs mt-1">Register a new trusted emergency contact.</p>
            </div>

            <div className="space-y-3">
              <input name="name" placeholder="Name (e.g. Sister)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:border-rose-500 font-medium" required />
              <input name="relation" placeholder="Relation (e.g. Primary Emergency)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:border-rose-500 font-medium" required />
              <input name="phone" type="tel" placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:outline-none focus:border-rose-500 font-medium" required />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md">Save Node</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
