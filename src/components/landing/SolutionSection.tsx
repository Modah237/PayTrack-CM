import React from 'react';
import { Bell, FileText, BarChart3, MessageCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function SolutionSection() {
  const { t } = useLanguage();

  const solutions = [
    {
      icon: Bell,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      title: t('solution_1_title'),
      desc: t('solution_1_desc'),
      preview: (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-4 space-y-2">
          {[
            { label: 'J+0 · Rappel doux', color: 'bg-blue-100 text-blue-700', tag: 'WhatsApp' },
            { label: 'J+7 · Relance ferme', color: 'bg-orange-100 text-orange-700', tag: 'WhatsApp' },
            { label: 'J+30 · Mise en demeure', color: 'bg-red-100 text-red-700', tag: 'SMS' },
          ].map(({ label, color, tag }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium">{label}</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${color}`}>{tag}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: FileText,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      title: t('solution_2_title'),
      desc: t('solution_2_desc'),
      preview: (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-500 font-medium">FAC-2026-005</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Payée</span>
          </div>
          <div className="text-sm font-black text-slate-900 mb-1">1 200 000 XAF</div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <MessageCircle className="w-3 h-3" />
            Paiement via MTN MoMo · Réconcilié auto.
          </div>
        </div>
      ),
    },
    {
      icon: BarChart3,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      title: t('solution_3_title'),
      desc: t('solution_3_desc'),
      preview: (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-4 space-y-2">
          {[
            { label: 'Taux de recouvrement', value: '68%', color: 'bg-indigo-500', width: '68%' },
            { label: 'Factures payées', value: '12/18', color: 'bg-emerald-500', width: '67%' },
            { label: 'Délai moyen', value: '18 jours', color: 'bg-blue-500', width: '45%' },
          ].map(({ label, value, color, width }) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-slate-500">{label}</span>
                <span className="font-bold text-slate-700">{value}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full">
                <div className={`${color} h-full rounded-full`} style={{ width }} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 mb-3">
            {t('solution_eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
            {t('solution_headline')}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t('solution_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map(({ icon: Icon, iconBg, iconColor, title, desc, preview }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              {preview}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
