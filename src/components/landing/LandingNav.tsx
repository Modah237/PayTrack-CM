import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../context/LanguageContext';

export function LandingNav() {
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t('nav_howItWorks'), href: '#how' },
    { label: t('nav_pricing'), href: '#pricing' },
    { label: t('nav_testimonials'), href: '#testimonials' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm">P</div>
              <span className={`font-bold text-lg tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                PayTrack CM
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language toggle */}
              <button
                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 rounded border border-slate-200 hover:border-slate-300 transition-all"
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-700 hover:text-slate-900 font-medium"
                onClick={() => navigate('/auth?tab=login')}
              >
                {t('nav_login')}
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-200 hover:-translate-y-0.5 transition-all"
                onClick={() => navigate('/auth?tab=signup')}
              >
                {t('nav_cta')}
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {label}
                </a>
              ))}
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                  className="w-full text-sm font-medium text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                >
                  {lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
                </button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { navigate('/auth?tab=login'); setMobileOpen(false); }}
                >
                  {t('nav_login')}
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={() => { navigate('/auth?tab=signup'); setMobileOpen(false); }}
                >
                  {t('nav_cta')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
