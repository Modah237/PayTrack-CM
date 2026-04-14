import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function LandingFooter() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm">P</div>
              <span className="font-bold text-white">PayTrack CM</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {lang === 'fr'
                ? 'Le recouvrement automatisé pour les PMEs africaines.'
                : 'Automated collections for African SMEs.'}
            </p>
            <p className="text-xs text-slate-600">
              {lang === 'fr' ? 'Fait avec ❤️ au Cameroun' : 'Made with ❤️ in Cameroon'}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              {lang === 'fr' ? 'Produit' : 'Product'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {(lang === 'fr'
                ? ['Fonctionnalités', 'Tarifs', 'Intégrations', 'API']
                : ['Features', 'Pricing', 'Integrations', 'API']
              ).map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              {lang === 'fr' ? 'Entreprise' : 'Company'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {(lang === 'fr'
                ? ['À propos', 'Blog', 'Partenaires', 'Contact']
                : ['About', 'Blog', 'Partners', 'Contact']
              ).map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              {lang === 'fr' ? 'Légal' : 'Legal'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {(lang === 'fr'
                ? ['Politique de confidentialité', 'CGU', 'Mentions légales']
                : ['Privacy Policy', 'Terms of Use', 'Legal Notice']
              ).map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2026 PayTrack CM.{' '}
            {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-md">MTN MoMo</span>
            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-md">Orange Money</span>
            <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded-md">WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
