import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const companies = [
  'Lycée Privé Excellence',
  'ETS NANA & Fils',
  'Cabinet Médical Akwa',
  'Boutique Fatou',
  'Agro-Distrib SARL',
  'ETS Mboua Trading',
  'Cabinet Nkeng & Associés',
  'Pharmacie Centrale',
  'Distrib Plus SARL',
  'École Bilingue Élite',
];

export function SocialProofBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-900 py-5 border-y border-slate-800 overflow-hidden">
      <p className="text-center text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4 px-4">
        {t('social_proof')}
      </p>
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-12 min-w-full shrink-0">
          {[...companies, ...companies].map((name, i) => (
            <span key={i} className="text-slate-500 text-sm font-medium">
              {name}
            </span>
          ))}
        </div>
        <div className="flex animate-marquee whitespace-nowrap gap-12 min-w-full shrink-0 absolute top-0 left-full">
          {[...companies, ...companies].map((name, i) => (
            <span key={i} className="text-slate-500 text-sm font-medium">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
