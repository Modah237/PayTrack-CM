import React from 'react';
import { Bell, Search, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockStats } from '@/mockData';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
}

const planConfig = {
  starter: { label: 'Starter', className: 'bg-blue-100 text-blue-700' },
  business: { label: 'Business', className: 'bg-indigo-100 text-indigo-700' },
  pro: { label: 'Pro', className: 'bg-purple-100 text-purple-700' },
};

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const plan = user?.plan ?? null;
  const planMeta = plan ? planConfig[plan] : null;
  const initials = user ? getInitials(user.businessName || user.email) : 'U';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 sm:px-6 gap-3 shrink-0 z-10 sticky top-0">
      {/* Hamburger — mobile only */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-9 w-9 text-slate-500"
        onClick={onMenuClick}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Date — desktop */}
      <div className="hidden md:block">
        <p className="text-xs text-slate-400 capitalize">{today}</p>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden lg:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <Input
          placeholder="Rechercher une facture, un client…"
          className="pl-9 h-9 w-64 bg-slate-50 border-slate-200 text-sm focus-visible:ring-blue-500"
        />
      </div>

      {/* Pending reminders pill */}
      {mockStats.pendingReminders > 0 && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-xs font-semibold text-amber-700">
            {mockStats.pendingReminders} relances en attente
          </span>
        </div>
      )}

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative h-9 w-9 text-slate-500 hover:text-slate-900">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
      </Button>

      {/* New invoice CTA */}
      <Button className="bg-blue-600 hover:bg-blue-700 gap-2 h-9 text-sm shadow-sm shadow-blue-200 hidden sm:flex">
        <Plus className="w-3.5 h-3.5" />
        Nouvelle Facture
      </Button>

      {/* User avatar + plan */}
      <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
        {planMeta && (
          <span className={cn('hidden sm:block text-[10px] font-bold px-2 py-0.5 rounded-full', planMeta.className)}>
            {planMeta.label}
          </span>
        )}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs cursor-pointer hover:bg-blue-700 transition-colors">
          {initials}
        </div>
      </div>
    </header>
  );
}
