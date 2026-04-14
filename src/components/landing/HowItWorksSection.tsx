import React from 'react';
import { Upload, FileText, Wallet } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    { num: '01', icon: Upload, iconColor: 'text-blue-600', title: t('how_1_title'), desc: t('how_1_desc') },
    { num: '02', icon: FileText, iconColor: 'text-blue-600', title: t('how_2_title'), desc: t('how_2_desc') },
    { num: '03', icon: Wallet, iconColor: 'text-emerald-600', title: t('how_3_title'), desc: t('how_3_desc') },
  ];

  return (
    <section id="how" className="bg-slate-50 py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 mb-3">
            {t('how_eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {t('how_headline')}
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-emerald-400 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {steps.map(({ num, icon: Icon, iconColor, title, desc }) => (
              <div key={num} className="flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="w-20 h-20 rounded-full bg-white shadow-lg border-4 border-slate-100 flex flex-col items-center justify-center mb-6 relative">
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                    {num.slice(-1)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
