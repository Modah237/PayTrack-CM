import React from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../context/LanguageContext';

export function FinalCTASection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24 text-white text-center relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <h2 className="text-3xl md:text-5xl font-black leading-tight mb-5">
          {t('final_headline')}
        </h2>
        <p className="text-blue-100 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          {t('final_sub')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 h-auto rounded-xl shadow-xl text-base transition-all hover:-translate-y-0.5"
            onClick={() => navigate('/auth?tab=signup')}
          >
            {t('final_cta_trial')}
          </Button>

          <a
            href="https://wa.me/237600000000?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20PayTrack%20CM"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-8 py-4 h-auto rounded-xl shadow-xl text-base gap-2 transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              {t('final_cta_whatsapp')}
            </Button>
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {[t('final_trust_1'), t('final_trust_2'), t('final_trust_3')].map(item => (
            <span key={item} className="flex items-center gap-1.5 text-sm text-blue-100/80 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
