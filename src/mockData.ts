import { Invoice, Client, Payment, Reminder, DashboardStats, ReminderScenario } from './types';

export const mockClients: Client[] = [
  {
    id: '1', name: 'Lycée Privé Excellence', email: 'contact@excellence.cm',
    phone: '+237 670 000 001', sector: 'Éducation',
    totalDue: 2500000, totalPaid: 1200000, creditScore: 65,
    debtorRating: 'risky', avgPaymentDelay: 22, invoiceCount: 8,
    lastPaymentDate: '2026-02-15',
  },
  {
    id: '2', name: 'ETS NANA & Fils', email: 'nana@gmail.com',
    phone: '+237 690 000 002', sector: 'Commerce',
    totalDue: 1200000, totalPaid: 3800000, creditScore: 82,
    debtorRating: 'reliable', avgPaymentDelay: 8, invoiceCount: 14,
    lastPaymentDate: '2026-04-01',
  },
  {
    id: '3', name: 'Cabinet Médical Akwa', email: 'info@medicalakwa.cm',
    phone: '+237 670 000 003', sector: 'Santé',
    totalDue: 450000, totalPaid: 900000, creditScore: 45,
    debtorRating: 'risky', avgPaymentDelay: 35, invoiceCount: 6,
    lastPaymentDate: '2026-01-20',
  },
  {
    id: '4', name: 'Boutique Fatou', email: 'fatou@shop.cm',
    phone: '+237 690 000 004', sector: 'Commerce',
    totalDue: 300000, totalPaid: 2100000, creditScore: 90,
    debtorRating: 'excellent', avgPaymentDelay: 3, invoiceCount: 18,
    lastPaymentDate: '2026-04-10',
  },
  {
    id: '5', name: 'Agro-Distrib SARL', email: 'sales@agrodistrib.cm',
    phone: '+237 670 000 005', sector: 'Distribution',
    totalDue: 5600000, totalPaid: 4200000, creditScore: 70,
    debtorRating: 'reliable', avgPaymentDelay: 15, invoiceCount: 22,
    lastPaymentDate: '2026-03-28',
  },
  {
    id: '6', name: 'Hervé Dev Solutions', email: 'herve@devs.cm',
    phone: '+237 656 000 006', sector: 'Tech / Freelance',
    totalDue: 180000, totalPaid: 650000, creditScore: 88,
    debtorRating: 'excellent', avgPaymentDelay: 5, invoiceCount: 9,
    lastPaymentDate: '2026-04-08',
  },
  {
    id: '7', name: 'Pharmacie Centrale Douala', email: 'pharm@centrale.cm',
    phone: '+237 699 000 007', sector: 'Santé',
    totalDue: 890000, totalPaid: 500000, creditScore: 32,
    debtorRating: 'critical', avgPaymentDelay: 58, invoiceCount: 4,
    lastPaymentDate: '2025-12-10',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv_1', invoiceNumber: 'FAC-2026-001', clientName: 'Lycée Privé Excellence', clientId: '1',
    amount: 750000, paidAmount: 0, dueDate: '2026-03-10', createdAt: '2026-02-10',
    status: 'overdue', description: 'Frais de scolarité T1 2026',
    momoLink: 'https://pay.campay.net/t/abc123', reminderCount: 3, lastReminderDate: '2026-04-08',
  },
  {
    id: 'inv_2', invoiceNumber: 'FAC-2026-002', clientName: 'ETS NANA & Fils', clientId: '2',
    amount: 450000, paidAmount: 450000, dueDate: '2026-04-15', createdAt: '2026-03-15',
    status: 'paid', description: 'Fournitures bureau Mars 2026',
    momoLink: 'https://pay.campay.net/t/def456', reminderCount: 0,
  },
  {
    id: 'inv_3', invoiceNumber: 'FAC-2026-003', clientName: 'Cabinet Médical Akwa', clientId: '3',
    amount: 150000, paidAmount: 50000, dueDate: '2026-03-20', createdAt: '2026-02-20',
    status: 'partially_paid', description: 'Maintenance équipements médicaux',
    momoLink: 'https://pay.campay.net/t/ghi789', reminderCount: 2, lastReminderDate: '2026-04-05',
  },
  {
    id: 'inv_4', invoiceNumber: 'FAC-2026-004', clientName: 'Boutique Fatou', clientId: '4',
    amount: 300000, paidAmount: 0, dueDate: '2026-05-01', createdAt: '2026-04-01',
    status: 'pending', description: 'Livraison marchandises Avril 2026',
    momoLink: 'https://pay.campay.net/t/jkl012', reminderCount: 0,
  },
  {
    id: 'inv_5', invoiceNumber: 'FAC-2026-005', clientName: 'Agro-Distrib SARL', clientId: '5',
    amount: 1200000, paidAmount: 0, dueDate: '2026-03-05', createdAt: '2026-02-05',
    status: 'overdue', description: 'Livraison produits alimentaires — Lot #A12',
    momoLink: 'https://pay.campay.net/t/mno345', reminderCount: 4, lastReminderDate: '2026-04-12',
  },
  {
    id: 'inv_6', invoiceNumber: 'FAC-2026-006', clientName: 'Pharmacie Centrale Douala', clientId: '7',
    amount: 890000, paidAmount: 0, dueDate: '2026-01-15', createdAt: '2025-12-15',
    status: 'overdue', description: 'Développement site web pharmacie',
    momoLink: 'https://pay.campay.net/t/pqr678', reminderCount: 5, lastReminderDate: '2026-04-10',
  },
  {
    id: 'inv_7', invoiceNumber: 'FAC-2026-007', clientName: 'Hervé Dev Solutions', clientId: '6',
    amount: 180000, paidAmount: 0, dueDate: '2026-04-30', createdAt: '2026-04-01',
    status: 'pending', description: 'Consulting technique Système RH',
    momoLink: 'https://pay.campay.net/t/stu901', reminderCount: 0,
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay_1', invoiceId: 'inv_2', invoiceNumber: 'FAC-2026-002',
    clientName: 'ETS NANA & Fils', amount: 450000, method: 'momo_mtn',
    date: '2026-04-01', transactionRef: 'MTN-CM-20260401-7842', reconciled: true,
  },
  {
    id: 'pay_2', invoiceId: 'inv_3', invoiceNumber: 'FAC-2026-003',
    clientName: 'Cabinet Médical Akwa', amount: 50000, method: 'momo_orange',
    date: '2026-03-25', transactionRef: 'OM-CM-20260325-3391', reconciled: true,
  },
  {
    id: 'pay_3', invoiceId: 'inv_5', invoiceNumber: 'FAC-2026-005',
    clientName: 'Agro-Distrib SARL', amount: 600000, method: 'card',
    date: '2026-03-10', transactionRef: 'CARD-CM-20260310-1182', reconciled: true,
  },
  {
    id: 'pay_4', invoiceId: 'inv_7', invoiceNumber: 'FAC-2026-007',
    clientName: 'Hervé Dev Solutions', amount: 90000, method: 'momo_mtn',
    date: '2026-04-12', transactionRef: 'MTN-CM-20260412-5519', reconciled: true,
  },
];

export const mockReminders: Reminder[] = [
  {
    id: 'rem_1', invoiceId: 'inv_1', invoiceNumber: 'FAC-2026-001',
    clientName: 'Lycée Privé Excellence', clientPhone: '+237 670 000 001',
    tone: 'urgent', channel: 'whatsapp', sentAt: '2026-04-08T09:15:00',
    status: 'read', daysOverdue: 29,
    message: 'Bonjour M. Directeur, votre facture FAC-2026-001 de 750 000 XAF est en retard de 29 jours. Merci de régulariser via ce lien : https://pay.campay.net/t/abc123',
  },
  {
    id: 'rem_2', invoiceId: 'inv_5', invoiceNumber: 'FAC-2026-005',
    clientName: 'Agro-Distrib SARL', clientPhone: '+237 670 000 005',
    tone: 'legal', channel: 'whatsapp', sentAt: '2026-04-12T10:30:00',
    status: 'delivered', daysOverdue: 40,
    message: 'MISE EN DEMEURE — Facture FAC-2026-005 de 1 200 000 XAF non réglée depuis 40 jours. Sans paiement sous 48h, nous transmettrons ce dossier à notre service juridique.',
  },
  {
    id: 'rem_3', invoiceId: 'inv_3', invoiceNumber: 'FAC-2026-003',
    clientName: 'Cabinet Médical Akwa', clientPhone: '+237 670 000 003',
    tone: 'firm', channel: 'sms', sentAt: '2026-04-05T14:00:00',
    status: 'sent', daysOverdue: 16,
    message: 'Rappel : solde restant de 100 000 XAF sur FAC-2026-003. Merci de régulariser rapidement.',
  },
  {
    id: 'rem_4', invoiceId: 'inv_6', invoiceNumber: 'FAC-2026-006',
    clientName: 'Pharmacie Centrale Douala', clientPhone: '+237 699 000 007',
    tone: 'legal', channel: 'whatsapp', sentAt: '2026-04-10T08:00:00',
    status: 'delivered', daysOverdue: 85,
    message: 'MISE EN DEMEURE FINALE — Facture FAC-2026-006 de 890 000 XAF impayée depuis 85 jours. Action juridique engagée sous 72h si aucun paiement reçu.',
  },
];

export const mockStats: DashboardStats = {
  totalReceivable: 10050000,
  recoveredThisMonth: 3450000,
  overdueAmount: 4200000,
  recoveryRate: 68,
  activeClients: 7,
  pendingReminders: 4,
  avgCollectionDays: 18,
  projectedCashIn30Days: 2800000,
};

export const reminderScenarios: ReminderScenario[] = [
  {
    day: 0, tone: 'cordial', channel: 'whatsapp', label: 'Rappel doux (J+0)',
    messageTemplate: 'Bonjour {clientName}, votre facture {invoiceNumber} de {amount} XAF arrive à échéance aujourd\'hui. Payer facilement via : {momoLink} — Merci !',
  },
  {
    day: 7, tone: 'firm', channel: 'whatsapp', label: 'Relance ferme (J+7)',
    messageTemplate: 'Bonjour {clientName}, la facture {invoiceNumber} ({amount} XAF) est en attente depuis 7 jours. Merci de régulariser rapidement : {momoLink}',
  },
  {
    day: 15, tone: 'urgent', channel: 'sms', label: 'Urgence (J+15)',
    messageTemplate: 'URGENT — Facture {invoiceNumber} impayée depuis 15 jours ({amount} XAF). Régularisez maintenant : {momoLink} ou contactez-nous.',
  },
  {
    day: 30, tone: 'legal', channel: 'whatsapp', label: 'Mise en demeure (J+30)',
    messageTemplate: 'MISE EN DEMEURE — {clientName}, votre facture {invoiceNumber} de {amount} XAF est en retard de 30 jours. Sans règlement sous 48h, ce dossier sera transmis à notre service juridique.',
  },
];

export const chartData = [
  { name: 'Nov', recovered: 850000, expected: 1200000 },
  { name: 'Déc', recovered: 1100000, expected: 1400000 },
  { name: 'Jan', recovered: 1800000, expected: 2000000 },
  { name: 'Fév', recovered: 2200000, expected: 2600000 },
  { name: 'Mar', recovered: 2900000, expected: 3200000 },
  { name: 'Avr', recovered: 3450000, expected: 4500000 },
];
