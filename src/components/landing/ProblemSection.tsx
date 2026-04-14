import React from 'react';
import { TrendingDown, Clock, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function ProblemSection() {
  const { t } = useLanguage();

  const problems = [
    {
      icon: TrendingDown,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
      stat: t('problem_1_stat'),
      statColor: 'text-red-400',
      title: t('problem_1_title'),
      desc: t('problem_1_desc'),
    },
    {
      icon: Clock,
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      stat: t('problem_2_stat'),
      statColor: 'text-orange-400',
      title: t('problem_2_title'),
      desc: t('problem_2_desc'),
    },
    {
      icon: XCircle,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      stat: t('problem_3_stat'),
      statColor: 'text-slate-300',
      title: t('problem_3_title'),
      desc: t('problem_3_desc'),
    },
  ];

  return (
    <section className="bg-slate-950 py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400 mb-3">
            {t('problem_eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
            {t('problem_headline')}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('problem_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map(({ icon: Icon, iconBg, iconColor, stat, statColor, title, desc }) => (
            <div
              key={title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition-colors"
            >
              <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div className={`text-5xl font-black ${statColor} mb-2`}>{stat}</div>
              <div className="text-white font-bold text-lg mb-3">{title}</div>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
