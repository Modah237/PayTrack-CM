import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageCircle, TrendingUp, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../context/LanguageContext';

function DashboardMockup() {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-3xl" />

      {/* Browser chrome */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Browser bar */}
        <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono mx-2">
            app.paytrack.cm/dashboard
          </div>
        </div>

        {/* Dashboard content */}
        <div className="bg-slate-50 p-4">
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-slate-900">Tableau de bord</div>
              <div className="text-[10px] text-slate-500">Avril 2026</div>
            </div>
            <div className="w-20 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-[9px] text-white font-semibold">+ Facture</span>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">Total à recevoir</span>
                <TrendingUp className="w-3 h-3 text-blue-400" />
              </div>
              <div className="text-base font-black text-slate-900">10,05M</div>
              <div className="text-[9px] text-emerald-600 font-medium">+12% ce mois</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">Recouvré</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-base font-black text-slate-900">3,45M</div>
              <div className="text-[9px] text-emerald-600 font-medium">+8% ce mois</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">En retard</span>
                <Clock className="w-3 h-3 text-orange-400" />
              </div>
              <div className="text-base font-black text-red-600">4,20M</div>
              <div className="text-[9px] text-red-500 font-medium">3 factures</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">Taux</span>
                <BarChart3 className="w-3 h-3 text-indigo-400" />
              </div>
              <div className="text-base font-black text-slate-900">68%</div>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-1">
                <div className="bg-indigo-500 h-full rounded-full w-[68%]" />
              </div>
            </div>
          </div>

          {/* Mini reminders sent indicator */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 flex items-center gap-2">
            <MessageCircle className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="text-[10px] text-emerald-700 font-medium">4 relances WhatsApp envoyées automatiquement aujourd'hui</span>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-lg">
        ROI 60x
      </div>
    </div>
  );
}

export function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-white pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div className="order-2 lg:order-1">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              {t('hero_eyebrow')}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              {t('hero_headline')}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              {t('hero_sub')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 h-auto rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 text-base"
                onClick={() => navigate('/auth?tab=signup')}
              >
                {t('hero_cta_primary')}
              </Button>
              <button
                onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-blue-600 hover:text-blue-700 font-semibold text-base flex items-center justify-center gap-1 px-4 hover:underline transition-colors"
              >
                {t('hero_cta_secondary')}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {[t('hero_trust_1'), t('hero_trust_2'), t('hero_trust_3')].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right — mock dashboard */}
          <div className="order-1 lg:order-2">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
