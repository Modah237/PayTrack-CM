import React, { useState } from 'react';
import {
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  ArrowUpRight, ArrowDownRight, Zap, Users, CalendarClock, Wallet,
  MoreHorizontal, Download, Plus, ChevronRight, MessageCircle, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { InvoiceStatus } from '../types';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { chartData } from '../mockData'; // static fallback for area chart
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

const statusConfig = {
  paid: { label: 'Payée', className: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700' },
  overdue: { label: 'En retard', className: 'bg-red-100 text-red-700' },
  partially_paid: { label: 'Partielle', className: 'bg-blue-100 text-blue-700' },
};

const onboardingSteps = [
  { id: 'client', label: 'Ajoutez votre premier client' },
  { id: 'invoice', label: 'Créez une facture' },
  { id: 'reminder', label: 'Configurez vos relances automatiques' },
  { id: 'momo', label: 'Connectez MTN MoMo / Orange Money' },
];

const periodData: Record<string, typeof chartData> = {
  '7j': chartData.slice(-2),
  '30j': chartData.slice(-3),
  '90j': chartData,
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<string[]>(['client']);
  const [period, setPeriod] = useState<'7j' | '30j' | '90j'>('90j');
  const [dbInvoices, setDbInvoices] = useState<any[]>([]);
  const [dbClients, setDbClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    Promise.all([
      api.get('/invoices'),
      api.get('/clients')
    ]).then(([invoicesRes, clientsRes]) => {
      setDbInvoices(invoicesRes.data);
      setDbClients(clientsRes.data);
    }).catch(err => {
      console.error(err);
      toast.error('Erreur lors du chargement du dashboard');
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const totalReceivable = dbInvoices.reduce((acc, i) => acc + parseFloat(i.amount), 0);
  const recoveredAmount = dbInvoices.reduce((acc, i) => acc + parseFloat(i.paid_amount || '0'), 0);
  const overdueInvoices = dbInvoices.filter(i => i.status === 'overdue');
  const overdueAmount = overdueInvoices.reduce((acc, i) => acc + (parseFloat(i.amount) - parseFloat(i.paid_amount || '0')), 0);
  const recoveryRate = totalReceivable > 0 ? Math.round((recoveredAmount / totalReceivable) * 100) : 0;
  
  const stats = {
    totalReceivable,
    recoveredThisMonth: recoveredAmount,
    overdueAmount,
    recoveryRate,
    avgCollectionDays: 14, // static for now
    activeClients: dbClients.length,
    pendingReminders: overdueInvoices.length,
    projectedCashIn30Days: totalReceivable - recoveredAmount,
  };

  const criticalInvoices = overdueInvoices.map(i => {
    const client = dbClients.find(c => c.id === i.client_id);
    return {
      ...i,
      clientName: client?.name || 'Inconnu',
      amount: parseFloat(i.amount),
      dueDate: i.due_date,
      invoiceNumber: i.invoice_number,
      reminderCount: 0
    };
  });

  const pieDataLocal = [
    { name: 'Recouvré', value: stats.recoveredThisMonth, color: '#22c55e' },
    { name: 'En retard', value: stats.overdueAmount, color: '#ef4444' },
    { name: 'En attente', value: Math.max(0, stats.totalReceivable - stats.recoveredThisMonth - stats.overdueAmount), color: '#f59e0b' },
  ];

  const derivedKpis = [
    {
      title: 'Total à recevoir',
      value: `${stats.totalReceivable.toLocaleString()} XAF`,
      delta: '+12% vs mois dernier',
      deltaPositive: true,
      icon: Wallet,
      accent: 'bg-blue-500',
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Total Recouvré',
      value: `${stats.recoveredThisMonth.toLocaleString()} XAF`,
      delta: '+8% vs mois dernier',
      deltaPositive: true,
      icon: CheckCircle2,
      accent: 'bg-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'En retard',
      value: `${stats.overdueAmount.toLocaleString()} XAF`,
      delta: '+5% vs mois dernier',
      deltaPositive: false,
      icon: Clock,
      accent: 'bg-red-500',
      iconBg: 'bg-red-50 text-red-600',
    },
    {
      title: 'Taux de recouvrement',
      value: `${stats.recoveryRate}%`,
      delta: `${stats.avgCollectionDays}j délai moyen`,
      deltaPositive: true,
      icon: TrendingUp,
      accent: 'bg-indigo-500',
      iconBg: 'bg-indigo-50 text-indigo-600',
      isProgress: true,
      progressValue: stats.recoveryRate,
    },
  ];

  const derivedSecondaryKpis = [
    { label: 'Clients actifs', value: stats.activeClients, icon: Users, color: 'text-blue-600' },
    { label: 'Relances en attente', value: stats.pendingReminders, icon: Zap, color: 'text-amber-600' },
    { label: 'Encaissement prévu 30j', value: `${(stats.projectedCashIn30Days / 1000).toFixed(0)}k XAF`, icon: CalendarClock, color: 'text-indigo-600' },
  ];

  if (isLoading) return <div className="p-8 text-center text-slate-500 flex items-center justify-center h-[50vh]">Chargement de votre tableau de bord...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tableau de bord</h2>
          <p className="text-slate-500 mt-1 text-sm">Bienvenue, Jean. Voici l'état de votre portefeuille créances.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 h-9 text-sm">
            <Download className="w-3.5 h-3.5" />
            Exporter
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2 h-9 text-sm shadow-sm shadow-blue-200"
            onClick={() => toast.success('Formulaire de création', { description: 'Module en cours d\'intégration.' })}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Onboarding checklist — dismissible */}
      {showOnboarding && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 relative">
          <button
            onClick={() => setShowOnboarding(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Commencez à être payé plus vite</h3>
              <p className="text-slate-500 text-xs mb-4">Complétez ces 4 étapes pour activer votre système de recouvrement automatique.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onboardingSteps.map(({ id, label }) => {
                  const done = completedSteps.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => setCompletedSteps(prev => done ? prev.filter(s => s !== id) : [...prev, id])}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left',
                        done ? 'bg-blue-600/10 text-blue-700' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                      )}
                    >
                      <CheckCircle2 className={cn('w-4 h-4 shrink-0', done ? 'text-blue-600' : 'text-slate-300')} />
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 bg-blue-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps.length / onboardingSteps.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-blue-600 font-semibold shrink-0">
                  {completedSteps.length}/{onboardingSteps.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {derivedSecondaryKpis.map((kpi) => (
          <div key={kpi.label} className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 border border-slate-100 shadow-sm">
            <kpi.icon className={cn('w-5 h-5', kpi.color)} />
            <div>
              <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-500">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {derivedKpis.map((card) => (
          <Card key={card.title} className="border border-slate-100 shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow">
            <div className={cn('absolute top-0 left-0 w-1 h-full', card.accent)} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-5">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</CardTitle>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.iconBg)}>
                <card.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="pl-5">
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{card.value}</div>
              {card.isProgress ? (
                <div className="mt-2">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${card.progressValue}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">{card.delta}</p>
                </div>
              ) : (
                <p className={cn(
                  'text-xs flex items-center gap-1 mt-1.5 font-medium',
                  card.deltaPositive ? 'text-emerald-600' : 'text-red-500'
                )}>
                  {card.deltaPositive
                    ? <ArrowUpRight className="w-3 h-3" />
                    : <ArrowDownRight className="w-3 h-3" />}
                  {card.delta}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Performance de recouvrement</CardTitle>
              <CardDescription className="text-xs">Créances attendues vs. montants réellement recouvrés</CardDescription>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
              {(['7j', '30j', '90j'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold transition-all',
                    period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="h-[260px] pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={periodData[period]} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} width={40} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
                  formatter={(value: number, name: string) => [`${value.toLocaleString()} XAF`, name === 'recovered' ? 'Recouvré' : 'Attendu']}
                />
                <Area type="monotone" dataKey="expected" stroke="#cbd5e1" fill="url(#colorExpected)" strokeWidth={1.5} strokeDasharray="4 3" />
                <Area type="monotone" dataKey="recovered" stroke="#3b82f6" fill="url(#colorRecovered)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right column: Pie + Top debtors */}
        <div className="flex flex-col gap-4">
          {/* Pie Chart */}
          <Card className="border border-slate-100 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Répartition portefeuille</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4 py-2">
              <div className="h-[100px] w-[100px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieDataLocal} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" strokeWidth={2}>
                      {pieDataLocal.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 flex-1">
                {pieDataLocal.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-500">{entry.name}</p>
                      <p className="text-xs font-semibold text-slate-800">{(entry.value / 1000).toFixed(0)}k XAF</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top debtors */}
          <Card className="border border-slate-100 shadow-sm bg-white flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Top débiteurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dbClients.slice(0, 4).map((client) => {
                const totalDue = dbInvoices.filter(i => i.client_id === client.id).reduce((acc, i) => acc + parseFloat(i.amount), 0);
                const score = client.credit_score || 100;
                if (totalDue === 0) return null;
                
                return (
                <div key={client.id} className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    score > 70 ? 'bg-emerald-500' : score > 40 ? 'bg-amber-500' : 'bg-red-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{client.name}</p>
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                      <div className={cn('h-full rounded-full', score > 70 ? 'bg-emerald-500' : score > 40 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-800 shrink-0">{(totalDue / 1000).toFixed(0)}k</p>
                </div>
              )})}
              <Button variant="ghost" className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8" onClick={() => onNavigate?.('clients')}>
                Voir tous les clients <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Critical Invoices Table */}
      <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
          <div>
            <CardTitle className="text-base font-semibold">Factures critiques</CardTitle>
            <CardDescription className="text-xs">Factures en retard · Nécessitent une action immédiate</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onNavigate?.('invoices')}>
            Voir tout <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow>
                <TableHead className="pl-6 text-xs">N° Facture</TableHead>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Montant</TableHead>
                <TableHead className="text-xs">Échéance</TableHead>
                <TableHead className="text-xs">Relances</TableHead>
                <TableHead className="text-xs">Statut</TableHead>
                <TableHead className="text-right pr-6 text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criticalInvoices.map((invoice) => {
                const daysLate = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / 86400000);
                return (
                  <TableRow key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-xs font-medium pl-6">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-sm">{invoice.clientName}</TableCell>
                    <TableCell className="font-bold text-sm">{invoice.amount.toLocaleString()} XAF</TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      <span className="flex items-center gap-1">
                        {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                        <Badge className="bg-red-100 text-red-600 text-[10px] border-none shadow-none hover:bg-red-100 ml-1">
                          +{daysLate}j
                        </Badge>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500">{invoice.reminderCount} envoyée{invoice.reminderCount > 1 ? 's' : ''}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-700 border-none shadow-none hover:bg-red-100 text-xs">
                        En retard
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[11px] gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        onClick={() => toast.success(`Relance envoyée`, { description: `WhatsApp envoyé à ${invoice.clientName}` })}
                      >
                        <MessageCircle className="w-3 h-3" />
                        Relancer
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
