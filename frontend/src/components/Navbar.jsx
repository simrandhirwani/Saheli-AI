import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'SafeMode', path: '/safemode' },
    { name: 'HaqFinder', path: '/haqfinder' },
    { name: 'BolDo', path: '/boldo' },
    { name: 'Pehchaan', path: '/pehchaan' },
    { name: 'Choupal', path: '/choupal' },
  ];

  return (
    // The wrapper creates the padding from the top edge so it "floats"
    <div className="fixed top-0 w-full z-50 px-4 py-5 pointer-events-none">
      <nav className={`mx-auto max-w-6xl transition-all duration-300 pointer-events-auto flex justify-between items-center ${
        scrolled 
          ? 'bg-saheli-surface/80 backdrop-blur-xl border border-saheli-border shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-full py-3 px-6' 
          : 'bg-transparent border-transparent py-4 px-2'
      }`}>
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-saheli-accent/10 border border-saheli-accent/30 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(251,113,133,0.4)] transition-all">
            <Mic size={20} className="text-saheli-accent" />
          </div>
          <span className="text-2xl font-serif font-bold text-white tracking-widest hidden sm:block">SAHELI</span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-saheli-dark/70 p-1.5 rounded-full border border-saheli-border backdrop-blur-md shadow-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
                location.pathname === link.path 
                  ? 'bg-saheli-accent text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <button className="bg-saheli-accent text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-saheli-hover transition-all shadow-[0_0_15px_rgba(251,113,133,0.4)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] hover:-translate-y-0.5">
          Launch Agent
        </button>
      </nav>
    </div>
  );
}