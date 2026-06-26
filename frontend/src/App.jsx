import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Mic, Globe, ChevronDown, Check } from 'lucide-react';
import Home from './pages/Home';
import SafeMode from './pages/SafeMode';
import HaqFinder from './pages/HaqFinder';
import Boldo from './pages/Boldo';
import Pehchaan from './pages/Pehchaan';
import MyStory from './pages/MyStory';

// Consolidated Context Engine (Strictly Language Only Now)
const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export default function App() {
  const [lang, setLang] = useState('en');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <Router>
        {/* Permanent Pearl White Baseline Background */}
        <div className="min-h-screen bg-[#F9FAFB] text-slate-800 antialiased selection:bg-rose-500 selection:text-white">
          
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/safemode" element={<SafeMode />} />
            <Route path="/haqfinder" element={<HaqFinder />} />
            <Route path="/boldo" element={<Boldo />} />
            <Route path="/pehchaan" element={<Pehchaan />} />
            <Route path="/mystory" element={<MyStory />} />
          </Routes>

        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

function Navbar() {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'mr', label: 'मराठी' }
  ];

  const currentLangLabel = languages.find(l => l.code === lang)?.label || 'Language';

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/safemode', label: 'SAFEMODE' },
    { path: '/haqfinder', label: 'HAQFINDER' },
    { path: '/boldo', label: 'BOLDO' },
    { path: '/pehchaan', label: 'PEHCHAAN' },
    { path: '/mystory', label: 'MYSTORY' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-5 border-b backdrop-blur-md bg-white/90 border-slate-200/80 shadow-sm text-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* BRAND IDENTITY */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-[0_2px_10px_rgba(225,29,72,0.2)]">
            <Mic size={15} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-widest font-serif text-slate-900">SAHELI</span>
        </Link>

        {/* EQUIDISTANT LINKS SEPARATED BY | */}
        <div className="hidden lg:flex items-center text-xs font-bold tracking-widest text-slate-600">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <React.Fragment key={item.path}>
                <Link 
                  to={item.path} 
                  className={`relative py-1.5 px-4 transition-colors hover:text-slate-900 ${
                    isActive ? 'text-rose-500 font-black' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-[-22px] left-4 right-4 h-[2px] bg-rose-500 rounded shadow-[0_0_8px_rgba(225,29,72,0.4)]" />
                  )}
                </Link>
                {idx < navItems.length - 1 && (
                  <span className="font-light select-none text-[10px] text-slate-200">|</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* COMPACT LANGUAGE ACTION DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black tracking-widest uppercase px-5 py-3 rounded-lg flex items-center gap-2 shadow-md shadow-rose-600/10 transition-all active:scale-95"
          >
            <Globe size={13} />
            <span>{currentLangLabel}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2.5 w-40 border rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden bg-white border-slate-200">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold tracking-wide flex items-center justify-between transition-colors ${
                      lang === l.code ? 'bg-rose-500/10 text-rose-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <Check size={12} className="text-rose-500" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}