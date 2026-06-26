import React, { useState, useRef, useEffect } from 'react';
import { Mic, MapPin, Phone, Send, Volume2, ShieldAlert, Scale, FileText, Bot, User, Loader2 } from 'lucide-react';
import { useLanguage } from '../App';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function HaqFinder() {
  const navigate = useNavigate(); 
  const { lang } = useLanguage();
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // FIX 1: Change reference to the container itself
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);

  // FIX 2: Scroll only the container's internal height, not the window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  // Multilingual Content Library (9 Rights)
  const content = {
    en: {
      title: "HaqFinder Engine",
      subtitle: "Discover statutory legal rights and welfare schemes through natural conversation.",
      rightsHeading: "Core Statutory Rights & Frameworks",
      localHeading: "Crisis Resolution Nodes",
      botTitle: "Saheli Legal AI",
      placeholder: "Tap mic or type your grievance...",
      listenText: "Listen",
      draftBtn: "Draft Legal Grievance",
      errorMsg: "Network error connecting to the backend server.",
      cards: [
        { title: "Protection from Domestic Violence", desc: "Right to safe housing, protection orders, and medical aid.", code: "PWDVA Act, 2005" },
        { title: "Right to Equal Remuneration", desc: "Constitutional mandate guaranteeing equal pay for identical work profiles.", code: "Equal Remuneration Act" },
        { title: "Right Against Workplace Harassment", desc: "Mandatory internal complaints committee for safe working environments.", code: "POSH Act, 2013" },
        { title: "Maternity Protection Laws", desc: "26 weeks of fully paid leave and comprehensive health infrastructure support.", code: "Maternity Benefit Act" },
        { title: "Right to Safe Abortion", desc: "Legal right to terminate pregnancy safely up to 24 weeks under specific conditions.", code: "MTP Act, 1971" },
        { title: "Right to Property & Inheritance", desc: "Equal coparcenary rights for daughters in ancestral property.", code: "Hindu Succession Act" },
        { title: "Right to Free Legal Aid", desc: "Entitlement to free legal representation for women regardless of income.", code: "Legal Services Act" },
        { title: "Right to Privacy & Dignity", desc: "Protection of identity for survivors of assault and basic fundamental liberty.", code: "Article 21" },
        { title: "Protection Against Dowry", desc: "Strict penalization for giving, taking, or demanding dowry.", code: "Dowry Prohibition Act" }
      ]
    },
    hi: {
      title: "हकफ़ाइंडर इंजन",
      subtitle: "प्राकृतिक बातचीत के माध्यम से वैधानिक कानूनी अधिकारों और कल्याणकारी योजनाओं की खोज करें।",
      rightsHeading: "प्रमुख संवैधानिक अधिकार",
      localHeading: "संकट समाधान केंद्र",
      botTitle: "सहेली कानूनी एआई",
      placeholder: "माइक दबाएं या अपनी शिकायत लिखें...",
      listenText: "सुनें",
      draftBtn: "कानूनी शिकायत का मसौदा बनाएं",
      errorMsg: "सर्वर से जुड़ने में नेटवर्क त्रुटि।",
      cards: [
        { title: "घरेलू हिंसा से संरक्षण", desc: "सुरक्षित आवास, सुरक्षा आदेश और मुफ्त चिकित्सा सहायता का अधिकार।", code: "PWDVA अधिनियम, 2005" },
        { title: "समान वेतन का अधिकार", desc: "समान कार्य के लिए पुरुषों और महिलाओं दोनों के लिए समान वेतन की गारंटी।", code: "समान पारिश्रमिक अधिनियम" },
        { title: "कार्यस्थल पर उत्पीड़न के खिलाफ अधिकार", desc: "सुरक्षित कार्य वातावरण के लिए अनिवार्य आंतरिक शिकायत समिति।", code: "POSH अधिनियम, 2013" },
        { title: "मातृत्व लाभ का अधिकार", desc: "26 सप्ताह का सवैतनिक अवकाश और व्यापक स्वास्थ्य सुरक्षा।", code: "मातृत्व लाभ अधिनियम" },
        { title: "सुरक्षित गर्भपात का अधिकार", desc: "विशिष्ट परिस्थितियों में 24 सप्ताह तक सुरक्षित गर्भपात का कानूनी अधिकार।", code: "MTP अधिनियम, 1971" },
        { title: "संपत्ति और उत्तराधिकार का अधिकार", desc: "पैतृक संपत्ति में बेटियों के लिए समान जन्मजात अधिकार।", code: "हिंदू उत्तराधिकार अधिनियम" },
        { title: "मुफ्त कानूनी सहायता", desc: "आय की परवाह किए बिना महिलाओं के लिए मुफ्त कानूनी प्रतिनिधित्व का अधिकार।", code: "कानूनी सेवा प्राधिकरण अधिनियम" },
        { title: "निजता और गरिमा का अधिकार", desc: "हमले की शिकार महिलाओं की पहचान की सुरक्षा और मौलिक स्वतंत्रता।", code: "अनुच्छेद 21" },
        { title: "दहेज के खिलाफ संरक्षण", desc: "दहेज देने, लेने या मांगने पर सख्त सजा का प्रावधान।", code: "दहेज निषेध अधिनियम" }
      ]
    },
    gu: {
      title: "હકફાઇન્ડર એન્જિન",
      subtitle: "કુદરતી વાતચીત દ્વારા તમારા કાનૂની અધિકારો અને સરકારી કલ્યાણ યોજનાઓ વિશે જાણો.",
      rightsHeading: "મુખ્ય કાનૂની અધિકારો",
      localHeading: "સહાયતા અને માર્ગદર્શન કેન્દ્રો",
      botTitle: "સહેલી કાનૂની એઆઈ",
      placeholder: "માઇક દબાવો અથવા તમારી ફરિયાદ લખો...",
      listenText: "સાંભળો",
      draftBtn: "કાનૂની ફરિયાદનો ડ્રાફ્ટ બનાવો",
      errorMsg: "સર્વર સાથે જોડાવામાં નેટવર્ક ભૂલ.",
      cards: [
        { title: "ઘરેલુ હિંસાથી રક્ષણ", desc: "સુરક્ષિત આવાસ, સુરક્ષા આદેશો અને તબીબી સહાયનો અધિકાર.", code: "PWDVA એક્ટ, 2005" },
        { title: "સમાન વેતનનો અધિકાર", desc: "સમાન કામ માટે સમાન વેતનની ખાતરી આપતો બંધારણીય અધિકાર.", code: "સમાન વેતન કાયદો" },
        { title: "કાર્યસ્થળ પર ઉત્પીડન સામે અધિકાર", desc: "સુરક્ષિત કાર્ય વાતાવરણ માટે આંતરિક ફરિયાદ સમિતિ (ICC) ફરજિયાત.", code: "POSH એક્ટ, 2013" },
        { title: "માતૃત્વ સુરક્ષા કાયદા", desc: "26 અઠવાડિયાની સંપૂર્ણ પેઇડ રજા અને વ્યાપક આરોગ્ય સહાય.", code: "માતૃત્વ લાભ કાયદો" },
        { title: "સુરક્ષિત ગર્ભપાતનો અધિકાર", desc: "ચોક્કસ શરતો હેઠળ 24 અઠવાડિયા સુધી ગર્ભપાતનો કાનૂની અધિકાર.", code: "MTP એક્ટ, 1971" },
        { title: "સંપત્તિ અને વારસાનો અધિકાર", desc: "પૈતૃક સંપત્તિમાં પુત્રીઓ માટે સમાન અધિકાર.", code: "હિન્દુ ઉત્તરાધિકાર કાયદો" },
        { title: "મફત કાનૂની સહાયનો અધિકાર", desc: "આવકને ધ્યાનમાં લીધા વિના મહિલાઓ માટે મફત કાનૂની પ્રતિનિધિત્વ.", code: "કાનૂની સેવા સત્તા મંડળ કાયદો" },
        { title: "ગોપનીયતા અને ગરિમાનો અધિકાર", desc: "પીડિતાઓની ઓળખ સુરક્ષિત રાખવાનો અને મૂળભૂત સ્વાતંત્ર્યનો અધિકાર.", code: "કલમ 21" },
        { title: "દહેજ સામે રક્ષણ", desc: "દહેજ આપવા, લેવા કે માંગવા પર કડક સજા.", code: "દહેજ પ્રતિબંધક કાયદો" }
      ]
    },
    mr: {
      title: "हकफाइंडर इंजिन",
      subtitle: "नैसर्गिक संवादाद्वारे तुमचे कायदेशीर अधिकार आणि सरकारी योजना सहज शोधा.",
      rightsHeading: "प्रमुख कायदेशीर हक्क",
      localHeading: "स्थानिक मदत केंद्रे",
      botTitle: "सहेली कायदेशीर एआय",
      placeholder: "माइक दाबा किंवा तुमची तक्रार लिहा...",
      listenText: "ऐका",
      draftBtn: "कायदेशीर तक्रारीचा मसुदा तयार करा",
      errorMsg: "सर्व्हरशी कनेक्ट करताना नेटवर्क त्रुटी.",
      cards: [
        { title: "घरगुती हिंसेपासून संरक्षण", desc: "सुरक्षित निवारा, संरक्षण आदेश आणि वैद्यकीय मदत मिळवण्याचा कायदेशीर हक्क.", code: "PWDVA कायदा, 2005" },
        { title: "समान वेतनाचा अधिकार", desc: "समान कामासाठी पुरुष आणि महिलांना समान वेतन देणारे घटनात्मक संरक्षण.", code: "समान वेतन कायदा" },
        { title: "कामाच्या ठिकाणी छळाविरुद्ध अधिकार", desc: "सुरक्षित कामाच्या वातावरणासाठी अनिवार्य अंतर्गत तक्रार समिती.", code: "POSH कायदा, 2013" },
        { title: "मातृत्व लाभाचा अधिकार", desc: "२६ आठवड्यांची सशुल्क रजा आणि आरोग्य सेवांचे कायदेशीर संरक्षण.", code: "मॅटर्निटी बेनिफिट ऍक्ट" },
        { title: "सुरक्षित गर्भपाताचा अधिकार", desc: "विशिष्ट परिस्थितीत २४ आठवड्यांपर्यंत कायदेशीर आणि सुरक्षित गर्भपात.", code: "MTP कायदा, 1971" },
        { title: "संपत्ती आणि वारसा हक्क", desc: "वडिलोपार्जित संपत्तीत मुलींना मुलांसमान समान हक्क.", code: "हिंदू वारसा कायदा" },
        { title: "मोफत कायदेशीर मदत", desc: "उत्पन्नाची पर्वा न करता महिलांसाठी मोफत कायदेशीर मदतीचा अधिकार.", code: "कायदेशीर सेवा प्राधिकरण कायदा" },
        { title: "गोपनीयतेचा आणि सन्मानाचा हक्क", desc: "अत्याचार पीडितांच्या ओळखीचे संरक्षण आणि मूलभूत स्वातंत्र्य.", code: "कलम 21" },
        { title: "हुंड्याविरुद्ध संरक्षण", desc: "हुंडा देणे, घेणे किंवा मागणी करणे यावर कडक शिक्षेची तरतूद.", code: "हुंडा प्रतिबंधक कायदा" }
      ]
    }
  };

  const currentContent = content[lang] || content['en'];

  // Update initial greeting when language changes globally
  useEffect(() => {
    let initialGreeting = "Welcome to Saheli. How can I assist you with your legal rights or government schemes today?";
    if (lang === 'hi') initialGreeting = "सहेली में आपका स्वागत है। मैं आज आपके कानूनी अधिकारों या योजनाओं में आपकी क्या सहायता कर सकती हूँ?";
    if (lang === 'gu') initialGreeting = "સહેલીમાં આપનું સ્વાગત છે. હું આજે તમારા કાનૂની અધિકારો અથવા યોજનાઓ વિશે તમને શું મદદ કરી શકું?";
    if (lang === 'mr') initialGreeting = "सहेलीमध्ये आपले स्वागत आहे. मी आज तुमच्या कायदेशीर अधिकारांबद्दल किंवा योजनांबद्दल काय मदत करू शकते?";
    
    // Preserve chat history during language toggle
    if (messages.length === 0) {
      setMessages([{ id: Date.now(), text: initialGreeting, isBot: true, hasAction: false }]);
    }
  }, [lang, messages.length]);

  const localOffices = [
    { name: "National Women Helpline", contact: "1091", loc: "All India Emergency Response" },
    { name: "Abhayam Women Helpline", contact: "181", loc: "Gujarat State Emergency" },
    { name: "NCW Control Room", contact: "7827170170", loc: "National Commission for Women" },
    { name: "Central Police / Cyber", contact: "112", loc: "All India Emergency Matrix" },
    { name: "One Stop Centre (Sakhi)", contact: "+91 261 2422023", loc: "Civil Hospital Campus, Surat" },
    { name: "District Women Officer", contact: "0261-2655900", loc: "Collector Office, Surat" }
  ];

  // ==========================================
  // SECURE BACKEND INTEGRATION
  // ==========================================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMsg = { id: Date.now(), text: userText, isBot: false };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Format chat history to send to backend
      const chatHistory = messages.map(msg => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.text
      }));

      // Call your backend instead of Groq directly
      const response = await fetch(`${API_BASE_URL}/api/haqfinder/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          history: chatHistory,
          language: lang // Pass the current UI language to help the backend prompt
        })
      });

      if (!response.ok) throw new Error("Backend API Error");

      const data = await response.json();
      const botReply = data.reply; // Assuming your backend returns { "reply": "..." }

      const suggestsDrafting = botReply.toLowerCase().includes('draft') || 
                               botReply.toLowerCase().includes('मसौदा') || 
                               botReply.toLowerCase().includes('ડ્રાફ્ટ') || 
                               botReply.toLowerCase().includes('मसुदा');

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: botReply, 
        isBot: true, 
        hasAction: suggestsDrafting 
      }]);

    } catch (error) {
      console.error("Backend Request Failed:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: currentContent.errorMsg, isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 antialiased">
      
      {/* HEADER: Centered */}
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-black text-slate-900 font-serif tracking-tight flex items-center justify-center gap-3">
          <Scale className="text-rose-500" size={32} />
          {currentContent.title}
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-3">
          {currentContent.subtitle}
        </p>
      </div>

      {/* CENTER PIECE: SECURE AI DIALOG CONSOLE */}
      <div className="max-w-4xl mx-auto w-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col h-[500px] shadow-sm">
        
        {/* Chat Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center">
              <Bot size={20} className="text-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">{currentContent.botTitle}</h3>
              <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
              </p>
            </div>
          </div>
        </div>

        {/* FIX 3: Attach chatContainerRef to this div, and remove the dummy div at the bottom */}
        <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              {msg.isBot && <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mb-1"><Bot size={14} className="text-slate-500" /></div>}
              
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm font-medium leading-relaxed shadow-sm ${
                msg.isBot 
                  ? 'bg-slate-50 border border-slate-200 text-slate-700 rounded-bl-sm whitespace-pre-wrap' 
                  : 'bg-rose-500 text-white rounded-br-sm whitespace-pre-wrap'
              }`}>
                <p>{msg.text}</p>
                
                {msg.hasAction && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60">
                    <button onClick={() => navigate('/boldo')} className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-colors">
                      <FileText size={14} /> {currentContent.draftBtn}
                    </button>
                  </div>
                )}

                {msg.isBot && (
                  <button className="flex items-center gap-1.5 mt-3 text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-wider">
                    <Volume2 size={12} /> {currentContent.listenText}
                  </button>
                )}
              </div>

              {!msg.isBot && <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mb-1"><User size={14} className="text-rose-600" /></div>}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
             <div className="flex items-end gap-2 justify-start">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mb-1">
                 <Bot size={14} className="text-slate-500" />
               </div>
               <div className="bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-rose-500" />
                 <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Processing...</span>
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3.5 rounded-full transition-all shrink-0 shadow-sm ${
              isRecording 
                ? 'bg-rose-100 border-2 border-rose-500 text-rose-600 animate-pulse' 
                : 'bg-white border border-slate-200 text-slate-400 hover:text-rose-500'
            }`}
          >
            <Mic size={18} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={isTyping ? "Saheli is processing..." : currentContent.placeholder}
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            className="bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white p-3.5 rounded-full transition-colors shrink-0 shadow-md"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>

      <hr className="border-slate-200 max-w-4xl mx-auto" />

      {/* BOTTOM GRID: 9 STATUTORY RIGHTS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-500" /> {currentContent.rightsHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentContent.cards.map((card, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-rose-200 hover:shadow-md transition-all cursor-default">
              <span className="inline-block text-[10px] bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md font-mono font-bold text-slate-500 tracking-wider mb-3 shadow-sm">
                {card.code}
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">{card.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LOCAL HELPLINE NODES */}
      <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 sm:p-8 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-6 flex items-center gap-2">
          <MapPin size={16} /> {currentContent.localHeading}
        </h2>
        {/* Updated grid spacing for the 6 emergency contact nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {localOffices.map((office, idx) => (
            <div key={idx} className="bg-white border border-rose-100 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-bold text-slate-900">{office.name}</p>
                <p className="text-xs text-slate-500 mt-1">{office.loc}</p>
              </div>
              <a href={`tel:${office.contact}`} className="flex items-center justify-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 py-2.5 px-5 rounded-xl text-xs font-bold transition-colors shrink-0">
                <Phone size={14} /> Call Now
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}