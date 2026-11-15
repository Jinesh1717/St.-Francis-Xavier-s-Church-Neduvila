import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Japamala / ജപമാല', path: '/japamala' },
    { name: 'Kurisinte Vazhi / കുരിശിന്റെ വഴി', path: '/kurisinte-vazhi' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Notices', path: '/notices' },
    { name: 'About / Contact', path: '/about' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-white/80 shadow-soft'
          : 'bg-white/55 backdrop-blur-md border-b border-white/50 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-skyblue-100/90 flex items-center justify-center text-gold-600 shadow-sm border border-gold-200 group-hover:scale-105 transition-transform backdrop-blur-xs">
              {/* Elegant Christian Cross SVG */}
              <svg className="w-6 h-6 fill-current text-gold-600" viewBox="0 0 24 24">
                <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
              </svg>
            </div>
            <div>
              <span className="block font-serif-church font-bold text-lg sm:text-xl text-slate-900 leading-tight">
                St. Francis Xavier's Church
              </span>
              <span className="block text-xs text-gold-700 font-medium tracking-wide">
                Neduvila • <span className="font-ml text-2xs text-slate-600">വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gold-500 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-white/70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Medium Screen Nav (Compact Links) */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {navLinks.slice(0, 5).map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive ? 'bg-gold-500 text-white shadow-xs' : 'text-slate-700 hover:bg-white/70'
                  }`
                }
              >
                {link.name.split('/')[0].trim()}
              </NavLink>
            ))}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 hover:bg-white/70 rounded-full"
              aria-label="More navigation items"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 bg-white/60 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500 border border-white/70"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Smooth Slide-in glass menu) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-cream-300 px-4 pt-3 pb-6 space-y-1.5 shadow-glass animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gold-500 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-cream-100'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
