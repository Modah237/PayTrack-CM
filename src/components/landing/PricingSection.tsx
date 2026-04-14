import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../context/LanguageContext';

const plans = {
  starter: {
    name: 'Starter',
    monthly: 5000,
    annual: 4000,
    features_fr: [
      '20 factures actives/mois',
      '1 utilisateur',
      'Relances WhatsApp + SMS',
      'Paiement MTN MoMo + Orange',
      'Templates standards',
      'Support email',
    ],
    features_en: [
      '20 active invoices/month',
      '1 user',
      'WhatsApp + SMS reminders',
      'MTN MoMo + Orange payment',
      'Standard templates',
      'Email support',
    ],
  },
  business: {
    name: 'Business',
    monthly: 15000,
    annual: 12000,
    features_fr: [
      '150 factures actives/mois',
      '3 utilisateurs',
      'Tout Starter inclus',
      'Relances SMS automatiques',
      'Rapports avancés',
      'Scoring débiteurs basique',
      'Support prioritaire',
    ],
    features_en: [
      '150 active invoices/month',
      '3 users',
      'Everything in Starter',
      'Automatic SMS reminders',
      'Advanced reports',
      'Basic debtor scoring',
      'Priority support',
    ],
  },
  pro: {
    name: 'Pro',
    monthly: 35000,
    annual: 28000,
    features_fr: [
      'Factures illimitées',
      'Utilisateurs illimités',
      'Tout Business inclus',
      'Accès API complet',
      'Scoring débiteurs avancé',
      'Multi-entreprises',
      'Support dédié 24h/7j',
    ],
    features_en: [
      'Unlimited invoices',
      'Unlimited users',
      'Everything in Business',
      'Full API access',
      'Advanced debtor scoring',
      'Multi-company management',
      'Dedicated 24/7 support',
    ],
  },
};

function formatXAF(amount: number) {
  return `${amount.toLocaleString('fr-FR')} XAF`;
}

interface PricingSectionProps {
  billing: 'monthly' | 'annual';
  onBillingChange: (b: 'monthly' | 'annual') => void;
}

export function PricingSection({ billing, onBillingChange }: PricingSectionProps) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="pricing" className="bg-slate-950 py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400 mb-3">
            {t('pricing_eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">
            {t('pricing_headline')}
          </h2>

          {/* Billing toggle */}
          <div className="inline-flex bg-slate-800 rounded-xl p-1">
            {(['monthly', 'annual'] as const).map(b => (
              <button
                key={b}
                onClick={() => onBillingChange(b)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  billing === b
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b === 'monthly' ? t('pricing_monthly') : t('pricing_annual')}
                {b === 'annual' && (
                  <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {t('pricing_annual_badge')}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Starter */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7">
            <div className="inline-block bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full mb-5">
              {t('pricing_trial')}
            </div>
            <div className="text-white font-black text-2xl mb-1">{plans.starter.name}</div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">
                {formatXAF(billing === 'monthly' ? plans.starter.monthly : plans.starter.annual)}
              </span>
              <span className="text-slate-400 text-sm">{t('pricing_per_month')}</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {(lang === 'fr' ? plans.starter.features_fr : plans.starter.features_en).map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold"
              onClick={() => navigate('/auth?tab=signup')}
            >
              {t('pricing_cta_start')}
            </Button>
          </div>

          {/* Business — highlighted */}
          <div className="bg-blue-600 rounded-2xl p-7 md:scale-105 shadow-2xl shadow-blue-900/60 ring-2 ring-blue-400 relative z-10">
            <div className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-5">
              {t('pricing_popular')}
            </div>
            <div className="text-white font-black text-2xl mb-1">{plans.business.name}</div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">
                {formatXAF(billing === 'monthly' ? plans.business.monthly : plans.business.annual)}
              </span>
              <span className="text-blue-200 text-sm">{t('pricing_per_month')}</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {(lang === 'fr' ? plans.business.features_fr : plans.business.features_en).map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-blue-50">
                  <CheckCircle2 className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg"
              onClick={() => navigate('/auth?tab=signup')}
            >
              {t('pricing_cta_business')}
            </Button>
          </div>

          {/* Pro */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7">
            <div className="inline-block bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full mb-5">
              {t('pricing_team')}
            </div>
            <div className="text-white font-black text-2xl mb-1">{plans.pro.name}</div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">
                {formatXAF(billing === 'monthly' ? plans.pro.monthly : plans.pro.annual)}
              </span>
              <span className="text-slate-400 text-sm">{t('pricing_per_month')}</span>
            </div>
            <ul className="space-y-2.5 mb-8">
              {(lang === 'fr' ? plans.pro.features_fr : plans.pro.features_en).map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold"
              onClick={() => navigate('/auth?tab=signup')}
            >
              {t('pricing_cta_pro')}
            </Button>
          </div>
        </div>

        {/* ROI weapon + footer copy */}
        <div className="text-center mt-10 space-y-2">
          <p className="text-emerald-400 text-sm font-bold">{t('pricing_roi')}</p>
          <p className="text-slate-500 text-sm">{t('pricing_footer')}</p>
        </div>
      </div>
    </section>
  );
}
