import React from 'react';
import { LayoutDashboard, FileText, Users, Bell, Settings, LogOut, CreditCard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'invoices', label: 'Factures', icon: FileText },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'payments', label: 'Paiements', icon: CreditCard },
  { id: 'reminders', label: 'Relances', icon: Bell },
];

const planConfig: Record<string, { label: string; className: string }> = {
  starter: { label: 'Starter', className: 'bg-slate-700 text-slate-300' },
  business: { label: 'Business', className: 'bg-blue-600/30 text-blue-300' },
  pro: { label: 'Pro', className: 'bg-indigo-600/30 text-indigo-300' },
};

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

export function Sidebar({ activeTab, setActiveTab, isOpen = false, onClose, onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout: ctxLogout } = useAuth();

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      ctxLogout();
    }
    navigate('/');
  };

  const plan = (user as any)?.plan ?? null;
  const planMeta = plan ? (planConfig[plan] ?? { label: 'Essai', className: 'bg-emerald-600/20 text-emerald-400' }) : { label: 'Essai', className: 'bg-emerald-600/20 text-emerald-400' };
  const displayName = user?.name || user?.email || 'Mon Entreprise';
  const initials = displayName.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('') || 'U';

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-slate-950 text-slate-200 border-r border-slate-800 transition-transform duration-300',
        'fixed top-0 left-0 z-50 lg:relative lg:z-auto w-72 lg:w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Logo */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm">P</div>
          <h1 className="text-lg font-bold tracking-tight text-white">PayTrack CM</h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.id === 'reminders' && (
                <span className="ml-auto text-[10px] bg-orange-500 text-white font-black px-1.5 py-0.5 rounded-full">4</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* User block */}
      <div className="p-3 mt-auto border-t border-slate-800 space-y-1">
        <div className="flex items-center gap-3 px-2 py-3 rounded-lg">
          <div className="w-9 h-9 bg-blue-600/20 border border-blue-600/30 rounded-full flex items-center justify-center text-blue-300 font-black text-sm shrink-0">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden flex-1 min-w-0">
            <span className="text-sm font-semibold text-white truncate">
              {displayName}
            </span>
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full w-fit mt-0.5', planMeta.className)}>
              {planMeta.label}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 gap-3 px-3 h-9 text-sm"
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Button>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 gap-3 px-3 h-9 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
