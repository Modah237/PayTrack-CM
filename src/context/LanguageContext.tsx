import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'fr' | 'en';

const translations = {
  fr: {
    // Nav
    nav_howItWorks: 'Comment ça marche',
    nav_pricing: 'Tarifs',
    nav_testimonials: 'Témoignages',
    nav_login: 'Connexion',
    nav_cta: 'Essai Gratuit 14 jours',

    // Hero
    hero_eyebrow: 'Le système nerveux financier de la PME camerounaise',
    hero_headline: '20-35% de vos revenus sont bloqués dans des factures impayées.',
    hero_sub: 'PayTrack CM automatise vos relances par WhatsApp, SMS et email. Récupérez ce qui vous appartient — sans passer 10 heures par semaine à courir après vos clients.',
    hero_cta_primary: 'Commencer l\'essai gratuit — 14 jours',
    hero_cta_secondary: 'Voir une démo →',
    hero_trust_1: 'Aucune carte bancaire requise',
    hero_trust_2: 'Installation en 5 minutes',
    hero_trust_3: 'MTN MoMo & Orange Money supportés',

    // Social proof
    social_proof: '150+ PMEs à Douala et Yaoundé font confiance à PayTrack CM',

    // Problem
    problem_eyebrow: 'Le Problème',
    problem_headline: 'Vous perdez de l\'argent. Chaque jour.',
    problem_sub: 'Les PMEs camerounaises passent en moyenne 8 à 12 heures par semaine à relancer manuellement des clients. Voici le vrai coût de cette inefficacité.',
    problem_1_stat: '20-35%',
    problem_1_title: 'de revenus bloqués',
    problem_1_desc: 'Vos factures impayées représentent plus du tiers de votre chiffre d\'affaires potentiel.',
    problem_2_stat: '8-12h',
    problem_2_title: 'perdues chaque semaine',
    problem_2_desc: 'Vous passez des heures à envoyer des messages WhatsApp pour réclamer des paiements.',
    problem_3_stat: '0',
    problem_3_title: 'outil local adapté',
    problem_3_desc: 'Aucun outil ne combine relance automatique + MoMo intégré + tableau de bord créances sur le marché.',

    // Solution
    solution_eyebrow: 'La Solution',
    solution_headline: 'PayTrack CM fait le travail à votre place.',
    solution_sub: 'Vos relances partent automatiquement. Vos paiements arrivent plus vite. Votre temps est libéré.',
    solution_1_title: 'Relances automatiques WhatsApp & SMS',
    solution_1_desc: 'Configurez une fois, le système relance vos clients selon un calendrier intelligent. Ton professionnel, timing optimal. Stoppe automatiquement quand le paiement arrive.',
    solution_2_title: 'Factures professionnelles en 30 secondes',
    solution_2_desc: 'Créez, envoyez et suivez vos factures conformes DGI. Vos clients paient directement via MTN MoMo ou Orange Money depuis le lien dans le message.',
    solution_3_title: 'Tableau de bord temps réel',
    solution_3_desc: 'Voyez exactement qui vous doit quoi, depuis combien de temps, et quelle action a fonctionné. Prenez de meilleures décisions crédit.',

    // How it works
    how_eyebrow: 'Démarrage',
    how_headline: 'Opérationnel en 3 étapes',
    how_1_title: 'Importez vos clients',
    how_1_desc: 'Ajoutez votre liste de clients manuellement ou importez depuis Excel. En quelques minutes, votre base est prête.',
    how_2_title: 'Créez vos premières factures',
    how_2_desc: 'Générez des factures professionnelles conformes DGI. Envoyez par WhatsApp, SMS ou email en un clic.',
    how_3_title: 'Encaissez automatiquement',
    how_3_desc: 'PayTrack relance vos clients aux bons moments. Vous recevez les paiements via MoMo directement sur votre compte.',

    // Testimonials
    testimonials_eyebrow: 'Témoignages',
    testimonials_headline: 'Ce que disent nos clients',

    // Pricing
    pricing_eyebrow: 'Tarifs',
    pricing_headline: 'Des tarifs pensés pour les PMEs africaines',
    pricing_monthly: 'Mensuel',
    pricing_annual: 'Annuel',
    pricing_annual_badge: '-20%',
    pricing_per_month: '/mois',
    pricing_popular: 'Le plus populaire',
    pricing_trial: 'Essai 14 jours',
    pricing_team: 'Pour les équipes',
    pricing_cta_start: 'Commencer gratuitement',
    pricing_cta_business: 'Choisir Business',
    pricing_cta_pro: 'Contacter l\'équipe commerciale',
    pricing_footer: 'Tous les plans incluent l\'essai gratuit de 14 jours. Aucune carte bancaire requise.',
    pricing_roi: 'ROI moyen constaté : 60x l\'abonnement Business dès le premier mois.',

    // Final CTA
    final_headline: 'Prêt à récupérer vos impayés ?',
    final_sub: 'Rejoignez 150+ PMEs qui ont transformé leur gestion des créances. 14 jours gratuits, annulation à tout moment.',
    final_cta_trial: 'Commencer l\'essai gratuit',
    final_cta_whatsapp: 'Nous contacter sur WhatsApp',
    final_trust_1: 'Aucune carte bancaire',
    final_trust_2: 'Annulation facile',
    final_trust_3: 'Support WhatsApp inclus',

    // Auth
    auth_login_tab: 'Connexion',
    auth_signup_tab: 'Créer un compte',
    auth_email: 'Email professionnel',
    auth_password: 'Mot de passe',
    auth_forgot: 'Mot de passe oublié ?',
    auth_login_btn: 'Se connecter',
    auth_google: 'Continuer avec Google',
    auth_business_name: 'Nom de l\'entreprise',
    auth_phone: 'Téléphone',
    auth_phone_placeholder: '6XX XXX XXX',
    auth_signup_btn: 'Créer mon compte gratuit',
    auth_terms: 'En créant un compte, vous acceptez nos Conditions d\'utilisation et notre Politique de confidentialité.',
    auth_switch_to_signup: 'Pas encore de compte ? Commencer l\'essai gratuit →',
    auth_switch_to_login: 'Déjà un compte ? Se connecter →',
    auth_left_tagline: 'Le système nerveux financier de la PME africaine.',
    auth_trust_1: 'Essai gratuit 14 jours',
    auth_trust_2: 'Aucune carte bancaire requise',
    auth_trust_3: 'Support WhatsApp 7j/7',
    auth_toast_signup: 'Bienvenue ! Votre essai de 14 jours commence maintenant.',
    auth_toast_error: 'Email ou mot de passe incorrect. Veuillez réessayer.',
  },
  en: {
    nav_howItWorks: 'How it works',
    nav_pricing: 'Pricing',
    nav_testimonials: 'Testimonials',
    nav_login: 'Login',
    nav_cta: '14-day Free Trial',

    hero_eyebrow: 'The financial nervous system of the African SME',
    hero_headline: '20-35% of your revenue is locked in unpaid invoices.',
    hero_sub: 'PayTrack CM automates your payment reminders via WhatsApp, SMS and email. Get what\'s yours — without spending 10 hours a week chasing clients.',
    hero_cta_primary: 'Start free trial — 14 days',
    hero_cta_secondary: 'Watch a demo →',
    hero_trust_1: 'No credit card required',
    hero_trust_2: 'Set up in 5 minutes',
    hero_trust_3: 'MTN MoMo & Orange Money supported',

    social_proof: '150+ SMEs in Douala and Yaoundé trust PayTrack CM',

    problem_eyebrow: 'The Problem',
    problem_headline: 'You\'re losing money. Every day.',
    problem_sub: 'Cameroonian SMEs spend an average of 8 to 12 hours per week manually chasing clients. Here\'s the real cost of this inefficiency.',
    problem_1_stat: '20-35%',
    problem_1_title: 'revenue blocked',
    problem_1_desc: 'Your unpaid invoices represent more than a third of your potential revenue.',
    problem_2_stat: '8-12h',
    problem_2_title: 'lost every week',
    problem_2_desc: 'You spend hours sending WhatsApp messages to collect payments.',
    problem_3_stat: '0',
    problem_3_title: 'local tools available',
    problem_3_desc: 'No tool combines automated reminders + integrated MoMo + receivables dashboard on the local market.',

    solution_eyebrow: 'The Solution',
    solution_headline: 'PayTrack CM does the work for you.',
    solution_sub: 'Your reminders go out automatically. Your payments come in faster. Your time is freed.',
    solution_1_title: 'Automated WhatsApp & SMS reminders',
    solution_1_desc: 'Set up once, the system reminds your clients on a smart schedule. Professional tone, optimal timing. Stops automatically when payment arrives.',
    solution_2_title: 'Professional invoices in 30 seconds',
    solution_2_desc: 'Create, send and track DGI-compliant invoices. Clients pay directly via MTN MoMo or Orange Money from the link in the message.',
    solution_3_title: 'Real-time dashboard',
    solution_3_desc: 'See exactly who owes what, since when, and which action worked. Make better credit decisions.',

    how_eyebrow: 'Getting Started',
    how_headline: 'Up and running in 3 steps',
    how_1_title: 'Import your clients',
    how_1_desc: 'Add your client list manually or import from Excel. Your database is ready in minutes.',
    how_2_title: 'Create your first invoices',
    how_2_desc: 'Generate professional DGI-compliant invoices. Send via WhatsApp, SMS or email in one click.',
    how_3_title: 'Get paid automatically',
    how_3_desc: 'PayTrack reminds your clients at the right moments. You receive MoMo payments directly to your account.',

    testimonials_eyebrow: 'Testimonials',
    testimonials_headline: 'What our clients say',

    pricing_eyebrow: 'Pricing',
    pricing_headline: 'Pricing built for African SMEs',
    pricing_monthly: 'Monthly',
    pricing_annual: 'Annual',
    pricing_annual_badge: '-20%',
    pricing_per_month: '/month',
    pricing_popular: 'Most popular',
    pricing_trial: '14-day trial',
    pricing_team: 'For teams',
    pricing_cta_start: 'Start for free',
    pricing_cta_business: 'Choose Business',
    pricing_cta_pro: 'Contact sales',
    pricing_footer: 'All plans include a 14-day free trial. No credit card required.',
    pricing_roi: 'Average observed ROI: 60x the Business subscription in the first month.',

    final_headline: 'Ready to recover your unpaid invoices?',
    final_sub: 'Join 150+ SMEs who have transformed their receivables management. 14 days free, cancel anytime.',
    final_cta_trial: 'Start free trial',
    final_cta_whatsapp: 'Contact us on WhatsApp',
    final_trust_1: 'No credit card',
    final_trust_2: 'Cancel easily',
    final_trust_3: 'WhatsApp support included',

    auth_login_tab: 'Login',
    auth_signup_tab: 'Create account',
    auth_email: 'Professional email',
    auth_password: 'Password',
    auth_forgot: 'Forgot password?',
    auth_login_btn: 'Log in',
    auth_google: 'Continue with Google',
    auth_business_name: 'Business name',
    auth_phone: 'Phone',
    auth_phone_placeholder: '6XX XXX XXX',
    auth_signup_btn: 'Create my free account',
    auth_terms: 'By creating an account, you agree to our Terms of Use and Privacy Policy.',
    auth_switch_to_signup: 'No account yet? Start your free trial →',
    auth_switch_to_login: 'Already have an account? Log in →',
    auth_left_tagline: 'The financial nervous system of the African SME.',
    auth_trust_1: '14-day free trial',
    auth_trust_2: 'No credit card required',
    auth_trust_3: 'WhatsApp support 7 days/week',
    auth_toast_signup: 'Welcome! Your 14-day trial starts now.',
    auth_toast_error: 'Incorrect email or password. Please try again.',
  },
} as const;

type TranslationKey = keyof typeof translations.fr;

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  const t = (key: TranslationKey): string => translations[lang][key] as string;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
