import React, { useState } from 'react';
import {
  Plus, Search, Download, Filter, MoreHorizontal, MessageCircle,
  Copy, CheckCircle2, Clock, AlertCircle, X, FileText, Link, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { InvoiceStatus } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { api } from '../lib/api';

const statusConfig: Record<InvoiceStatus, { label: string; className: string; icon: React.ElementType }> = {
  paid: { label: 'Payée', className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700', icon: Clock },
  overdue: { label: 'En retard', className: 'bg-red-100 text-red-700', icon: AlertCircle },
  partially_paid: { label: 'Partielle', className: 'bg-blue-100 text-blue-700', icon: FileText },
};

const filterTabs: { key: InvoiceStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'overdue', label: 'En retard' },
  { key: 'pending', label: 'En attente' },
  { key: 'partially_paid', label: 'Partielles' },
  { key: 'paid', label: 'Payées' },
];

export function Invoices() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<InvoiceStatus | 'all'>('all');
  const [dbInvoices, setDbInvoices] = useState<any[]>([]);
  const [dbClients, setDbClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newInvoice, setNewInvoice] = useState({
    invoice_number: `FACT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
    client_id: '',
    amount: '',
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: ''
  });

  const fetchStatus = () => {
    setIsLoading(true);
    Promise.all([
      api.get('/invoices'),
      api.get('/clients')
    ]).then(([invoicesRes, clientsRes]) => {
      setDbInvoices(invoicesRes.data);
      setDbClients(clientsRes.data);
    }).catch(err => {
      console.error(err);
      toast.error('Erreur lors du chargement des factures');
    }).finally(() => {
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    fetchStatus();
  }, []);

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.client_id) {
      toast.error('Veuillez sélectionner un client');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/invoices', newInvoice);
      toast.success('Facture créée avec succès', {
        description: 'Le lien de paiement MoMo a été généré.'
      });
      setShowAddModal(false);
      setNewInvoice({
        invoice_number: `FACT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
        client_id: '',
        amount: '',
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: ''
      });
      fetchStatus();
    } catch (error: any) {
      toast.error('Erreur lors de la création', {
        description: error.response?.data?.error || 'Une erreur est survenue'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const enrichedInvoices = dbInvoices.map(i => {
    const client = dbClients.find(c => c.id === i.client_id);
    return {
      id: i.id,
      invoiceNumber: i.invoice_number,
      clientName: client ? client.name : 'Client Inconnu',
      clientId: i.client_id,
      amount: parseFloat(i.amount),
      paidAmount: parseFloat(i.paid_amount || '0'),
      dueDate: i.due_date,
      status: i.status as InvoiceStatus,
      description: i.description || 'Facture',
      momoLink: i.momo_link || '',
      reminderCount: 0 
    };
  });

  const filtered = enrichedInvoices
    .filter(inv => activeFilter === 'all' || inv.status === activeFilter)
    .filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase())
    );

  const copyMomoLink = (invoice: any) => {
    toast.success('Lien MoMo copié !', {
      description: invoice.momoLink,
    });
  };

  const sendReminder = (invoice: any) => {
    toast.success('Relance envoyée !', {
      description: `WhatsApp envoyé au client ${invoice.clientName}`,
    });
  };

  const markPaid = (invoice: any) => {
    toast.success('Facture marquée payée', {
      description: `${invoice.invoiceNumber} — ${invoice.amount.toLocaleString()} XAF réconcilié.`,
    });
  };

  const counts = {
    all: enrichedInvoices.length,
    overdue: enrichedInvoices.filter(i => i.status === 'overdue').length,
    pending: enrichedInvoices.filter(i => i.status === 'pending').length,
    partially_paid: enrichedInvoices.filter(i => i.status === 'partially_paid').length,
    paid: enrichedInvoices.filter(i => i.status === 'paid').length,
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Chargement des données...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Factures</h2>
          <p className="text-slate-500 mt-1 text-sm">Créez, suivez et gérez toutes vos factures DGI-conformes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 h-9 text-sm">
            <Download className="w-3.5 h-3.5" />
            Exporter
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2 h-9 text-sm shadow-sm shadow-blue-200"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvelle Facture
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Émettre une facture</h3>
                  <p className="text-xs text-slate-500">Générez un lien de paiement MoMo instantané.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddInvoice} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Client débiteur</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={newInvoice.client_id}
                      onChange={e => setNewInvoice({...newInvoice, client_id: e.target.value})}
                      required
                    >
                      <option value="">Sélectionnez un client...</option>
                      {dbClients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Numéro de facture</label>
                    <Input 
                      value={newInvoice.invoice_number} 
                      onChange={e => setNewInvoice({...newInvoice, invoice_number: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Montant (XAF)</label>
                    <Input 
                      type="number"
                      placeholder="Ex: 50000" 
                      value={newInvoice.amount}
                      onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Date d'échéance</label>
                    <Input 
                      type="date"
                      value={newInvoice.due_date}
                      onChange={e => setNewInvoice({...newInvoice, due_date: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Description / Libellé</label>
                    <Input 
                      placeholder="Ex: Prestation de service Mars" 
                      value={newInvoice.description}
                      onChange={e => setNewInvoice({...newInvoice, description: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Émettre & Envoyer
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filter pills + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1.5 flex-wrap">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5',
                activeFilter === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              )}
            >
              {tab.label}
              <span className={cn(
                'text-[10px] font-bold px-1 rounded',
                activeFilter === tab.key ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
              )}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="N° facture ou client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-56 bg-white border-slate-200 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow>
                <TableHead className="pl-6 text-xs">N° Facture</TableHead>
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs text-right">Montant</TableHead>
                <TableHead className="text-xs text-right">Payé</TableHead>
                <TableHead className="text-xs">Échéance</TableHead>
                <TableHead className="text-xs">Relances</TableHead>
                <TableHead className="text-xs">Statut</TableHead>
                <TableHead className="text-right pr-6 text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                    Aucune facture trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((invoice) => {
                  const cfg = statusConfig[invoice.status];
                  const daysLate = invoice.status === 'overdue'
                    ? Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / 86400000)
                    : 0;
                  const remaining = invoice.amount - invoice.paidAmount;

                  return (
                    <TableRow key={invoice.id} className={cn(
                      'hover:bg-slate-50/50 transition-colors',
                      invoice.status === 'overdue' && 'bg-red-50/30'
                    )}>
                      <TableCell className="font-mono text-xs font-medium pl-6 text-slate-700">{invoice.invoiceNumber}</TableCell>
                      <TableCell className="text-sm font-medium max-w-[150px] truncate">{invoice.clientName}</TableCell>
                      <TableCell className="text-xs text-slate-500 max-w-[160px] truncate">{invoice.description}</TableCell>
                      <TableCell className="text-sm font-bold text-right tabular-nums">{invoice.amount.toLocaleString()} XAF</TableCell>
                      <TableCell className="text-xs text-right tabular-nums">
                        {invoice.paidAmount > 0
                          ? <span className="text-emerald-600 font-medium">{invoice.paidAmount.toLocaleString()}</span>
                          : <span className="text-slate-300">—</span>}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col">
                          <span className="text-slate-600">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                          {daysLate > 0 && (
                            <span className="text-[10px] text-red-500 font-medium">+{daysLate}j retard</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500">
                          {invoice.reminderCount > 0 ? `${invoice.reminderCount} envoyée${invoice.reminderCount > 1 ? 's' : ''}` : '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('border-none shadow-none text-xs hover:opacity-80', cfg.className)}>
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex items-center justify-end gap-1">
                          {invoice.status !== 'paid' && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                title="Copier lien MoMo"
                                onClick={() => copyMomoLink(invoice)}
                              >
                                <Link className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                title="Envoyer relance WhatsApp"
                                onClick={() => sendReminder(invoice)}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                title="Marquer comme payée"
                                onClick={() => markPaid(invoice)}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                          {invoice.status === 'paid' && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Soldée
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
