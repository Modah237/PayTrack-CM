import {
  Users, Search, Filter, Mail, Phone, MapPin, Building2, TrendingUp,
  ChevronRight, MoreHorizontal, Download, Star, CheckCircle2,
  MessageCircle, Clock, FileText, X, Plus, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { Client, DebtorRating, Invoice } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { api } from '../lib/api';

const ratingConfig: Record<DebtorRating, { label: string; color: string; bg: string; icon: React.ElementType; bar: string }> = {
  excellent: { label: 'Excellent', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: Star, bar: 'bg-emerald-500' },
  reliable: { label: 'Fiable', color: 'text-blue-700', bg: 'bg-blue-100', icon: TrendingUp, bar: 'bg-blue-500' },
  risky: { label: 'Risqué', color: 'text-amber-700', bg: 'bg-amber-100', icon: AlertTriangle, bar: 'bg-amber-500' },
  critical: { label: 'Critique', color: 'text-red-700', bg: 'bg-red-100', icon: TrendingDown, bar: 'bg-red-500' },
};

function ScoreGauge({ score, rating }: { score: number; rating: DebtorRating }) {
  const cfg = ratingConfig[rating];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Score débiteur</span>
        <span className="text-sm font-bold text-slate-900">{score}/100</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-700', cfg.bar)} style={{ width: `${score}%` }} />
      </div>
      <Badge className={cn('text-xs border-none shadow-none', cfg.bg, cfg.color)}>
        <cfg.icon className="w-3 h-3 mr-1" />
        {cfg.label}
      </Badge>
    </div>
  );
}

export function Clients() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dbClients, setDbClients] = useState<any[]>([]);
  const [dbInvoices, setDbInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    sector: '',
    nif: ''
  });

  const fetchStatus = () => {
    setIsLoading(true);
    Promise.all([
      api.get('/clients'),
      api.get('/invoices')
    ]).then(([clientsRes, invoicesRes]) => {
      setDbClients(clientsRes.data);
      setDbInvoices(invoicesRes.data);
    }).catch(err => {
      console.error(err);
      toast.error('Erreur lors du chargement des clients');
    }).finally(() => {
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    fetchStatus();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/clients', newClient);
      toast.success('Client ajouté avec succès');
      setShowAddModal(false);
      setNewClient({ name: '', email: '', phone: '', sector: '', nif: '' });
      fetchStatus();
    } catch (error: any) {
      toast.error('Erreur lors de l’ajout du client', {
        description: error.response?.data?.error || 'Une erreur est survenue'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute stats on the fly since DB schema is normalized
  const enrichedClients: Client[] = dbClients.map(c => {
    const cInvoices = dbInvoices.filter(i => i.client_id === c.id);
    const totalDue = cInvoices.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const totalPaid = cInvoices.reduce((sum, i) => sum + parseFloat(i.paid_amount), 0);
    
    return {
      id: c.id,
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      sector: c.sector || 'Général',
      totalDue,
      totalPaid,
      creditScore: c.credit_score || 100,
      debtorRating: c.debtor_rating || 'reliable',
      avgPaymentDelay: c.avg_payment_delay || 0,
      invoiceCount: cInvoices.length
    };
  });

  const filtered = enrichedClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.sector.toLowerCase().includes(search.toLowerCase())
  );

  const clientInvoices = (clientId: string) => {
    return dbInvoices.filter(i => i.client_id === clientId).map(i => ({
      id: i.id,
      invoiceNumber: i.invoice_number,
      clientId: i.client_id,
      amount: parseFloat(i.amount),
      status: i.status === 'paid' ? 'paid' : i.status === 'overdue' ? 'overdue' : i.status === 'partially_paid' ? 'partially_paid' : 'pending',
      description: i.description
    }));
  };

  const handleRelance = (client: Client) => {
    toast.success('Campagne de relance lancée', {
      description: `Toutes les factures impayées de ${client.name} ont été relancées par WhatsApp.`,
    });
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Chargement des données...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Clients & Scoring</h2>
          <p className="text-slate-500 mt-1 text-sm">Gérez vos clients et analysez leur comportement de paiement.</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 gap-2 h-9 text-sm"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          Nouveau client
        </Button>
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
                  <h3 className="text-lg font-bold text-slate-900">Enregistrer un nouveau client</h3>
                  <p className="text-xs text-slate-500">Ajoutez les coordonnées de votre partenaire B2B.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClient} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Nom de l'entreprise</label>
                    <Input 
                      placeholder="Ex: Tech PME Sarl" 
                      value={newClient.name} 
                      onChange={e => setNewClient({...newClient, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Email contact</label>
                    <Input 
                      type="email" 
                      placeholder="contact@entreprise.cm" 
                      value={newClient.email}
                      onChange={e => setNewClient({...newClient, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Numéro WhatsApp</label>
                    <Input 
                      placeholder="+237 6XX XXX XXX" 
                      value={newClient.phone}
                      onChange={e => setNewClient({...newClient, phone: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">Secteur d'activité</label>
                    <Input 
                      placeholder="Ex: Distribution" 
                      value={newClient.sector}
                      onChange={e => setNewClient({...newClient, sector: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 ml-1">NIF (Optionnel)</label>
                    <Input 
                      placeholder="M0XXXXXXXXXX" 
                      value={newClient.nif}
                      onChange={e => setNewClient({...newClient, nif: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Créer le client
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['excellent', 'reliable', 'risky', 'critical'] as DebtorRating[]).map((rating) => {
          const cfg = ratingConfig[rating];
          const count = enrichedClients.filter(c => c.debtorRating === rating).length;
          return (
            <div key={rating} className={cn('rounded-xl px-4 py-3 border flex items-center gap-3', cfg.bg, 'border-current/10')}>
              <cfg.icon className={cn('w-5 h-5', cfg.color)} />
              <div>
                <p className={cn('text-xl font-bold', cfg.color)}>{count}</p>
                <p className={cn('text-xs', cfg.color)}>{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Input
          placeholder="Rechercher un client ou secteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-4 h-9 text-sm bg-white border-slate-200"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Client Cards */}
      <div className="space-y-3">
        {filtered.map((client) => {
          const cfg = ratingConfig[client.debtorRating];
          const isExpanded = expandedId === client.id;
          const invoices = clientInvoices(client.id);
          const overdueInvoices = invoices.filter(i => i.status === 'overdue');

          return (
            <Card key={client.id} className={cn(
              'border shadow-sm bg-white overflow-hidden transition-all duration-200',
              isExpanded ? 'border-blue-200 shadow-md' : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
            )}>
              <div
                className="flex items-center gap-4 p-5 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : client.id)}
              >
                {/* Avatar */}
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0', cfg.bg, cfg.color)}>
                  {client.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-sm">{client.name}</p>
                    <Badge className={cn('text-[10px] border-none shadow-none px-2', cfg.bg, cfg.color)}>
                      {cfg.label}
                    </Badge>
                    {overdueInvoices.length > 0 && (
                      <Badge className="text-[10px] border-none shadow-none bg-red-100 text-red-600 px-2">
                        {overdueInvoices.length} en retard
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Building2 className="w-3 h-3" />{client.sector}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Phone className="w-3 h-3" />{client.phone}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />Délai moy. {client.avgPaymentDelay}j
                    </span>
                  </div>
                </div>

                {/* Score + Amount */}
                <div className="hidden md:flex flex-col items-end gap-1 shrink-0 w-40">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', cfg.bar)} style={{ width: `${client.creditScore}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400">Score: {client.creditScore}/100</span>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">{client.totalDue.toLocaleString()} XAF</p>
                  <p className="text-[10px] text-slate-400">{client.invoiceCount} factures</p>
                </div>

                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                }
              </div>

              {/* Expanded Panel */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50">
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Score Gauge */}
                    <div className="space-y-4">
                      <ScoreGauge score={client.creditScore} rating={client.debtorRating} />
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-slate-500">Total payé</span><span className="font-medium text-emerald-700">{client.totalPaid.toLocaleString()} XAF</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Total dû</span><span className="font-medium text-red-600">{client.totalDue.toLocaleString()} XAF</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Dernier paiement</span><span className="font-medium">{client.lastPaymentDate ? new Date(client.lastPaymentDate).toLocaleDateString('fr-FR') : '—'}</span></div>
                      </div>
                    </div>

                    {/* Invoices */}
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Factures</p>
                      {invoices.length === 0 ? (
                        <p className="text-xs text-slate-400">Aucune facture</p>
                      ) : (
                        <div className="space-y-2">
                          {invoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-100">
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-mono text-xs text-slate-600">{inv.invoiceNumber}</span>
                                <span className="text-xs text-slate-400 hidden sm:block">— {inv.description}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold">{inv.amount.toLocaleString()} XAF</span>
                                <Badge className={cn(
                                  'text-[10px] border-none shadow-none px-2',
                                  inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                  inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                  inv.status === 'partially_paid' ? 'bg-blue-100 text-blue-700' :
                                  'bg-amber-100 text-amber-700'
                                )}>
                                  {inv.status === 'paid' ? 'Payée' : inv.status === 'overdue' ? 'En retard' : inv.status === 'partially_paid' ? 'Partielle' : 'En attente'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {overdueInvoices.length > 0 && (
                        <Button
                          size="sm"
                          className="mt-3 gap-2 bg-emerald-600 hover:bg-emerald-700 text-xs h-8"
                          onClick={() => handleRelance(client)}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Relancer tous les impayés ({overdueInvoices.length})
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
