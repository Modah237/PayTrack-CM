import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

// ── Password strength ─────────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const colors = ['bg-slate-200', 'bg-red-400', 'bg-yellow-400', 'bg-emerald-500'];
  return (
    <div className="flex gap-1 mt-1.5">
      {[1, 2, 3].map(i => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-slate-200'}`} />
      ))}
    </div>
  );
}

// ── Google icon ───────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      toast.error(t('auth_toast_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-slate-700 font-medium text-sm">{t('auth_email')}</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="vous@entreprise.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="h-11 border-slate-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-slate-700 font-medium text-sm">{t('auth_password')}</Label>
          <button type="button" className="text-xs text-blue-600 hover:underline">{t('auth_forgot')}</button>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="h-11 border-slate-200 focus:border-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-lg shadow-blue-200"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth_login_btn')}
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">ou</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium gap-2"
        onClick={async () => {
          /* Google OAuth simulated */
        }}
      >
        <GoogleIcon />
        {t('auth_google')}
      </Button>

      <p className="text-center text-sm text-slate-500">
        <button type="button" onClick={onSwitch} className="text-blue-600 hover:underline font-medium">
          {t('auth_switch_to_signup')}
        </button>
      </p>
    </form>
  );
}

// ── Signup form ───────────────────────────────────────────────────────────────

function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ email, password, businessName, phone: `+237 ${phone}` });
      toast.success(t('auth_toast_signup'));
      navigate('/dashboard');
    } catch {
      toast.error(t('auth_toast_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="biz-name" className="text-slate-700 font-medium text-sm">{t('auth_business_name')}</Label>
        <Input
          id="biz-name"
          placeholder="Ex: ETS Dupont & Co"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          required
          className="h-11 border-slate-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-email" className="text-slate-700 font-medium text-sm">{t('auth_email')}</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="vous@entreprise.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="h-11 border-slate-200 focus:border-blue-500"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-phone" className="text-slate-700 font-medium text-sm">{t('auth_phone')}</Label>
        <div className="flex">
          <div className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg text-sm text-slate-600 font-medium whitespace-nowrap">
            🇨🇲 +237
          </div>
          <Input
            id="signup-phone"
            type="tel"
            placeholder={t('auth_phone_placeholder')}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="h-11 border-slate-200 focus:border-blue-500 rounded-l-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-password" className="text-slate-700 font-medium text-sm">{t('auth_password')}</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            className="h-11 border-slate-200 focus:border-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <PasswordStrength password={password} />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth_signup_btn')}
      </Button>

      <p className="text-center text-[11px] text-slate-400 leading-relaxed">
        {t('auth_terms')}
      </p>

      <p className="text-center text-sm text-slate-500">
        <button type="button" onClick={onSwitch} className="text-blue-600 hover:underline font-medium">
          {t('auth_switch_to_login')}
        </button>
      </p>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(
    searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'login') setActiveTab(tab);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex font-sans antialiased">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 text-white p-10 w-[45%] relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg">P</div>
          <span className="text-xl font-bold tracking-tight">PayTrack CM</span>
        </div>

        {/* Center content */}
        <div className="space-y-8 relative">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">PayTrack CM</p>
            <h2 className="text-3xl font-black leading-tight text-white">{t('auth_left_tagline')}</h2>
          </div>

          <div className="space-y-4">
            {[t('auth_trust_1'), t('auth_trust_2'), t('auth_trust_3')].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Testimonial quote */}
          <blockquote className="border-l-2 border-blue-500 pl-4">
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "J'ai récupéré 1,8 million XAF bloqués depuis 6 mois — en 3 semaines seulement."
            </p>
            <footer className="mt-2 text-slate-500 text-xs">
              Jean-Marie N. · Directeur, Lycée Privé Excellence, Douala
            </footer>
          </blockquote>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-4 relative">
          {[
            { stat: '150+', label: 'PMEs actives' },
            { stat: '68%', label: 'Taux recouvrement moyen' },
            { stat: '60x', label: 'ROI abonnement' },
          ].map(({ stat, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white">{stat}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">P</div>
              <span className="text-lg font-bold text-slate-900">PayTrack CM</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900">
              {activeTab === 'login' ? 'Bon retour 👋' : 'Commencez gratuitement'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === 'login'
                ? 'Connectez-vous à votre espace PayTrack CM.'
                : '14 jours gratuits. Aucune carte bancaire requise.'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            {(['login', 'signup'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'login' ? t('auth_login_tab') : t('auth_signup_tab')}
              </button>
            ))}
          </div>

          {activeTab === 'login'
            ? <LoginForm onSwitch={() => setActiveTab('signup')} />
            : <SignupForm onSwitch={() => setActiveTab('login')} />
          }

          <p className="mt-8 text-center text-xs text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">← Retour à l'accueil</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
