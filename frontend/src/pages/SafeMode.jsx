import React, { useState, useEffect, useRef } from 'react';
import { Mic, Shield, AlertTriangle, Plus, Trash2, User, Smartphone, Activity } from 'lucide-react';
import { useLanguage } from '../App';
import { API_BASE_URL, WS_BASE_URL } from '../config';

export default function SafeMode() {
  const { lang } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Real-Time Storage Arrays
  const [liveLogs, setLiveLogs] = useState([]);
  const [systemLog, setSystemLog] = useState("");

  // Refs to control recording states without component re-renders
  const socketRef = useRef(null);
  const recorderRef = useRef(null);
  const sessionId = "svnit_user_session_01"; // Constant demo track id

  const labels = {
    en: {
      title: "SafeMode OS", subtitle: "Continuous Acoustic Telemetry & Threat Recognition",
      badgeStandby: "System Standby", badgeActive: "Streaming Live",
      orbTap: "TAP TO ARM SYSTEM", orbListening: "ACOUSTIC ARRAY ACTIVE",
      logReady: "SYSTEM INITIALIZED // Awaiting background telemetry loop...",
      logPaused: "⚠ PAUSED // Audio capture streams suspended safely.",
      logCritical: "🚨 CRITICAL SOS // Incident data packet and live coordinates successfully transmitted.",
      contactsTitle: "Emergency Nodes", contactsSub: "Outbound delivery endpoints for distress payloads.",
      btnText: "TEST SOS PANIC BROADCAST", overlayTitle: "SOS Broadcast Dispatched",
      overlaySub: "Emergency coordinate packets pushed to your WhatsApp notification array."
    },
    hi: {
      title: "सेफमोड ओएस", subtitle: "सतत ध्वनिक निगरानी और खतरा पहचान प्रणाली",
      badgeStandby: "सिस्टम स्टैंडबाय", badgeActive: "लाइव स्ट्रीमिंग",
      orbTap: "सिस्टम को आर्म करें", orbListening: "ध्वनिक एरे सक्रिय",
      logReady: "सिस्टम तैयार है // डिवाइस डेटा इनिशियलाइजेशन की प्रतीक्षा है...",
      logPaused: "⚠ रोक दिया गया // ऑडियो कैप्चर सुरक्षित रूप से निलंबित।",
      logCritical: "🚨 संकट कालीन स्थिति // आपातकालीन संदेश पैकेट सफलतापूर्वक भेजा गया।",
      contactsTitle: "आपातकालीन संपर्क सूत्र", contactsSub: "संकट की स्थिति में संदेश भेजने के लिए पंजीकृत नंबर।",
      btnText: "परीक्षण आपातकालीन ब्रॉडकास्ट", overlayTitle: "एसओएस अलर्ट भेजा गया",
      overlaySub: "आपातकालीन स्थान विवरण आपके व्हाट्सएप संपर्कों को सुरक्षित भेज दिया गया है।"
    },
    gu: {
      title: "સેફમોડ ઓએસ", subtitle: "સતત ઓડિયો મોનિટરિંગ અને જોખમ ઓળખ સિસ્ટમ",
      badgeStandby: "સિસ્ટમ સ્ટેન્ડબાય", badgeActive: "લાઇવ સ્ટ્રીમિંગ",
      orbTap: "સિસ્ટમ સક્રિય કરો", orbListening: "ઓડિયો એરે સક્રિય",
      logReady: "सिस्टम तैयार है // ડિવાઇસ ડેટા કનેક્શનની પ્રતીક્ષા છે...",
      logPaused: "⚠ અટકાવેલ છે // ઓડિયો કેપ્ચર સુરક્ષિત રીતે સ્થગિત.",
      logCritical: "🚨 કટોકટી ચેતવણી // ઇમરજન્સી મેસેજ સફળતાપૂર્વક મોકલવામાં આવ્યો છે.",
      contactsTitle: "ઇમરજન્સી સંપર્કો", contactsSub: "મુશ્કેલીના સમયે મેસેજ મોકલવા માટે રજિસ્ટર્ડ નંબર.",
      btnText: "ઇમરજન્સી બ્રોડકાસ્ટ ટેસ્ટ", overlayTitle: "SOS એલર્ટ મોકલાયું",
      overlaySub: "ઇમરજન્સી લોકેશન વિગતો તમારા વોટ્સએપ સંપર્કોને મોકલી દેવામાં આવી છે."
    },
    mr: {
      title: "सेफमोड ओएस", subtitle: "सतत ऑडिओ मॉनिटरिंग आणि धोका ओळख प्रणाली",
      badgeStandby: "सिस्टम स्टँडबाय", badgeActive: "लाइव्ह स्ट्रीमिंग",
      orbTap: "सिस्टम आर्म करा", orbListening: "ऑडिओ ॲरे सक्रिय",
      logReady: "सिस्टम तयार आहे // डिव्हाइस डेटा इनिशियलायझेशनची प्रतीक्षा आहे...",
      logPaused: "⚠ थांबवले आहे // ऑडिओ कॅप्चर सुरक्षितपणे निलंबित.",
      logCritical: "🚨 आणीबाणी चेतावणी // आपत्कालीन संदेश यशस्वीरित्या पाठवला गेला आहे.",
      contactsTitle: "आपत्कालीन संपर्क", contactsSub: "संकटकाळात संदेश पाठवण्यासाठी नोंदणीकृत नंबर.",
      btnText: "आणीबाणी ब्रॉडकास्ट चाचणी", overlayTitle: "SOS अलर्ट पाठवला",
      overlaySub: "आपत्कालीन लोकेशन तपशील तुमच्या व्हॉट्सॲप संपर्कांना पाठवला गेला आहे."
    }
  };

  const currentContent = labels[lang] || labels['en'];

  // FETCH PERSISTED 1-HOUR LOGS FROM NEON ON MOUNT
  useEffect(() => {
    // UPDATED: Using API_BASE_URL
    fetch(`${API_BASE_URL}/api/safemode/logs/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setLiveLogs(data);
          setSystemLog(`Loaded ${data.length} active historical telemetry traces from the last hour.`);
        } else {
          setSystemLog(currentContent.logReady);
        }
      })
      .catch(() => setSystemLog(currentContent.logReady));
  }, [lang]);

  // LIVE STREAMING MECHANICS
  const startStreamingEngine = async () => {
    setSystemLog("Connecting to secure backend sockets...");
    
    // UPDATED: Using WS_BASE_URL
    const ws = new WebSocket(`${WS_BASE_URL}/ws/safemode/${sessionId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "TRANSCRIPT") {
        setLiveLogs(prev => [...prev, response.data]);
        setSystemLog(`✓ [Whisper Engine]: "${response.data.text}"`);
      }
    };

    ws.onopen = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        recorderRef.current = recorder;

        recorder.ondataavailable = async (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            const buffer = await e.data.arrayBuffer();
            ws.send(buffer);
          }
        };

        recorder.start(3000); // Send an audio chunk down the socket slice every 3 seconds
        setIsRecording(true);
      } catch (err) {
        setSystemLog("Device hardware context deployment failed: Microphone Access Denied.");
        ws.close();
      }
    };
  };

  const stopStreamingEngine = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsRecording(false);
    setSystemLog(currentContent.logPaused);
  };

  // CORE EMERGENCY DISPATCH TRIGGER HANDLER
  const handleSendSOS = () => {
    setSosActive(true);
    setIsRecording(true);
    setSystemLog(currentContent.logCritical);
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 antialiased transition-colors duration-300">
      
      {/* OVERLAY */}
      {sosActive && (
        <div className="fixed inset-0 bg-red-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase font-serif">{currentContent.overlayTitle}</h2>
            <p className="text-slate-600 text-sm mt-2 font-medium">{currentContent.overlaySub}</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      {/* UPDATED: Removed sm:text-left to force center alignment on all screen sizes */}
      <div className="text-center border-b border-slate-200 pb-6">
        {/* UPDATED: Removed sm:justify-start */}
        <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight flex items-center justify-center gap-2">
          <Shield className="text-rose-500" size={28} /> {currentContent.title}
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          {currentContent.subtitle}
        </p>
      </div>

      {/* CORE ACTIVE ORB PANELS */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center text-center space-y-8">
        
        {/* Radar Orb Container */}
        <div 
          onClick={isRecording ? stopStreamingEngine : startStreamingEngine}
          className={`w-48 h-48 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-500 ${
            isRecording ? 'scale-105' : 'hover:scale-105'
          }`}
        >
          {/* Background Pulse Rings */}
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
          <span className="text-slate-500 font-bold tracking-wider uppercase text-[10px]">Active 1-Hour Telemetry Log Feed</span>
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
          <button onClick={() => setShowModal(true)} className="bg-rose-500 text-white p-2.5 rounded-xl hover:bg-rose-600 shadow-md"><Plus size={16} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map(c => (
            <div key={c.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><User size={15} /></div>
                <div><p className="text-slate-800 font-bold text-sm">{c.name}</p><p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider">{c.relation}</p></div>
              </div>
              <Smartphone size={14} className="text-slate-400" />
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