import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Mic, Globe, ChevronDown, Check, Menu, X } from 'lucide-react';
import Home from './pages/Home';
import SafeMode from './pages/SafeMode';
import HaqFinder from './pages/HaqFinder';
import Boldo from './pages/Boldo';
import Pehchaan from './pages/Pehchaan';
import MyStory from './pages/MyStory';

// Consolidated Context Engine
const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export default function App() {
  const [lang, setLang] = useState('en');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <Router>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile toggle state

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        
        {/* BRAND IDENTITY */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-[0_2px_10px_rgba(225,29,72,0.2)]">
            <Mic size={15} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-widest font-serif text-slate-900">SAHELI</span>
        </Link>

        {/* DESKTOP: EQUIDISTANT LINKS SEPARATED BY | */}
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
                    <div className="absolute bottom-[-24px] left-4 right-4 h-[2px] bg-rose-500 rounded shadow-[0_0_8px_rgba(225,29,72,0.4)]" />
                  )}
                </Link>
                {idx < navItems.length - 1 && (
                  <span className="font-light select-none text-[10px] text-slate-200">|</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ACTION CLUSTER: LANGUAGE + HAMBURGER */}
        <div className="flex items-center gap-3">
          
          {/* COMPACT LANGUAGE ACTION DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] sm:text-xs font-black tracking-widest uppercase px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 shadow-md shadow-rose-600/10 transition-all active:scale-95"
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

          {/* MOBILE HAMBURGER BUTTON */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 text-slate-600 hover:text-rose-500 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* MOBILE DROP-DOWN MENU */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen border-t opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="px-4 py-4 flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3.5 rounded-xl text-xs font-black tracking-widest transition-colors ${
                  isActive ? 'bg-rose-50 text-rose-500' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}