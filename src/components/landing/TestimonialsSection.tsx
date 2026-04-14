import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const testimonials = [
  {
    initials: 'JN',
    bg: 'bg-emerald-600',
    name: 'Jean-Marie Nkemdirim',
    role: 'Directeur, Lycée Privé Excellence, Douala',
    quote_fr: "Avant PayTrack, je passais mes vendredis soirs à envoyer des messages WhatsApp pour les frais de scolarité. Aujourd'hui, le système le fait seul. J'ai récupéré 1,8 million XAF bloqués depuis 6 mois — en 3 semaines.",
    quote_en: "Before PayTrack, I spent my Friday evenings sending WhatsApp messages for school fees. Today, the system does it automatically. I recovered 1.8 million XAF blocked for 6 months — in 3 weeks.",
  },
  {
    initials: 'FD',
    bg: 'bg-orange-500',
    name: 'Fatimata Diallo',
    role: 'Gérante, Boutique Mode Fatou, Yaoundé',
    quote_fr: "Mes clients paient maintenant via MoMo sans que j'aie à les relancer moi-même. Ma trésorerie est beaucoup plus prévisible. Le plan Starter est vraiment accessible pour une petite boutique comme la mienne.",
    quote_en: "My clients now pay via MoMo without me having to chase them. My cash flow is much more predictable. The Starter plan is really affordable for a small shop like mine.",
  },
  {
    initials: 'EM',
    bg: 'bg-blue-600',
    name: 'Emmanuel Mbida',
    role: 'Gérant, Agro-Distrib SARL, Bafoussam',
    quote_fr: "Le tableau de bord me montre exactement qui doit quoi et depuis combien de temps. Je prends de meilleures décisions sur les crédits client. C'est devenu indispensable pour notre activité de distribution.",
    quote_en: "The dashboard shows me exactly who owes what and for how long. I make better credit decisions. It's become indispensable for our distribution business.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { lang } = useLanguage();
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 mb-3">
            {t('testimonials_eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {t('testimonials_headline')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ initials, bg, name, role, quote_fr, quote_en }) => (
            <div
              key={name}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 hover:shadow-md transition-shadow flex flex-col"
            >
              <Stars />
              <blockquote className="mt-5 text-slate-600 text-sm leading-relaxed italic flex-1">
                "{lang === 'fr' ? quote_fr : quote_en}"
              </blockquote>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center text-white font-black text-sm shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
