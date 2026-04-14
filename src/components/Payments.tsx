import React, { useState } from 'react';
import { CreditCard, Smartphone, Banknote, CheckCircle2, TrendingUp, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockPayments } from '../mockData'; // Fallback if empty
import { PaymentMethod } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { Loader2 } from 'lucide-react';

const methodConfig: Record<PaymentMethod, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  momo_mtn: { label: 'MTN MoMo', color: '#f59e0b', icon: Smartphone, bg: 'bg-amber-50 text-amber-700' },
  momo_orange: { label: 'Orange Money', color: '#f97316', icon: Smartphone, bg: 'bg-orange-50 text-orange-700' },
  card: { label: 'Carte bancaire', color: '#6366f1', icon: CreditCard, bg: 'bg-indigo-50 text-indigo-700' },
  cash: { label: 'Espèces', color: '#22c55e', icon: Banknote, bg: 'bg-emerald-50 text-emerald-700' },
};

export function Payments() {
  const [filter, setFilter] = useState<PaymentMethod | 'all'>('all');
  const [dbPayments, setDbPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    api.get('/payments')
      .then(res => setDbPayments(res.data))
      .catch(err => {
        console.error(err);
        toast.error('Erreur lors du chargement des paiements');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = dbPayments.filter(p => filter === 'all' || p.method === filter);
  const totalCollected = dbPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const statsByMethod = {
    momo_mtn: dbPayments.filter(p => p.method === 'momo_mtn').reduce((sum, p) => sum + parseFloat(p.amount), 0),
    momo_orange: dbPayments.filter(p => p.method === 'momo_orange').reduce((sum, p) => sum + parseFloat(p.amount), 0),
    card: dbPayments.filter(p => p.method === 'card').reduce((sum, p) => sum + parseFloat(p.amount), 0),
  };

  const pieDataLocal = [
    { name: 'MTN MoMo', value: statsByMethod.momo_mtn, color: '#f59e0b' },
    { name: 'Orange Money', value: statsByMethod.momo_orange, color: '#f97316' },
    { name: 'Carte', value: statsByMethod.card, color: '#6366f1' },
  ].filter(d => d.value > 0);

  const handleMomoLink = () => {
    toast.info('Lien MoMo', {
      description: 'Pour générer un lien, créez une nouvelle facture dans le module Factures.'
    });
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 flex items-center justify-center h-[50vh]">Historique des transactions...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Paiements</h2>
          <p className="text-slate-500 mt-1 text-sm">Historique des encaissements MoMo, Orange Money et Carte.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 h-9 text-sm">
            <Download className="w-3.5 h-3.5" />
            Exporter
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 gap-2 h-9 text-sm shadow-sm shadow-amber-200 text-white" onClick={handleMomoLink}>
            <Smartphone className="w-3.5 h-3.5" />
            Générer lien MoMo
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-100 shadow-sm bg-white">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalCollected.toLocaleString()} XAF</p>
              <p className="text-xs text-slate-500 mt-0.5">Total encaissé</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm bg-white">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockPayments.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Transactions reçues</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm bg-white">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
              {totalCollected > 0 ? Math.round((statsByMethod.momo_mtn + statsByMethod.momo_orange) / totalCollected * 100) : 0}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Via Mobile Money</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="border border-slate-100 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Répartition par canal</CardTitle>
            <CardDescription className="text-xs">Volume encaissé par méthode de paiement</CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieDataLocal} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieDataLocal.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} XAF`} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods breakdown */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Détail par méthode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pieDataLocal.length > 0 ? pieDataLocal.map((method) => {
                const pct = totalCollected > 0 ? Math.round(method.value / totalCollected * 100) : 0;
                return (
                  <div key={method.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{method.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-xs">{method.value.toLocaleString()} XAF</span>
                        <span className="font-semibold text-slate-900 text-xs w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: method.color }} />
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  Aucun paiement enregistré pour générer des statistiques.
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs font-semibold text-emerald-800">✓ Réconciliation automatique active</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Chaque paiement MoMo reçu stoppe automatiquement les relances et met à jour le statut de la facture.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
          <div>
            <CardTitle className="text-base font-semibold">Historique des paiements</CardTitle>
            <CardDescription className="text-xs">Toutes les transactions réconciliées</CardDescription>
          </div>
          <div className="flex gap-2">
            {(['all', 'momo_mtn', 'momo_orange', 'card'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full font-medium transition-all',
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {f === 'all' ? 'Tout' : methodConfig[f].label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow>
                <TableHead className="pl-6 text-xs">Réf. Transaction</TableHead>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Facture</TableHead>
                <TableHead className="text-xs">Montant</TableHead>
                <TableHead className="text-xs">Méthode</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((payment) => {
                const cfg = methodConfig[payment.method];
                return (
                  <TableRow key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-xs pl-6 text-slate-600">{payment.transaction_ref}</TableCell>
                    <TableCell className="text-sm font-medium">{payment.client_name}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{payment.invoice_number}</TableCell>
                    <TableCell className="font-bold text-sm text-emerald-700">+{parseFloat(payment.amount).toLocaleString()} XAF</TableCell>
                    <TableCell>
                      <Badge className={cn('border-none shadow-none text-xs', cfg.bg)}>
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {new Date(payment.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Réconcilié
                      </span>
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
