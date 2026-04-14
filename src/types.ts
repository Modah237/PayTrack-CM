export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'partially_paid';
export type PaymentMethod = 'momo_mtn' | 'momo_orange' | 'card' | 'cash';
export type ReminderTone = 'cordial' | 'firm' | 'urgent' | 'legal';
export type DebtorRating = 'excellent' | 'reliable' | 'risky' | 'critical';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientId: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  createdAt: string;
  status: InvoiceStatus;
  description?: string;
  momoLink?: string;
  reminderCount: number;
  lastReminderDate?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  sector: string;
  totalDue: number;
  totalPaid: number;
  creditScore: number; // 0-100
  debtorRating: DebtorRating;
  lastPaymentDate?: string;
  avgPaymentDelay: number; // days
  invoiceCount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  transactionRef: string;
  reconciled: boolean;
}

export interface Reminder {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientPhone: string;
  tone: ReminderTone;
  channel: 'whatsapp' | 'sms' | 'email';
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'pending';
  message: string;
  daysOverdue: number;
}

export interface DashboardStats {
  totalReceivable: number;
  recoveredThisMonth: number;
  overdueAmount: number;
  recoveryRate: number;
  activeClients: number;
  pendingReminders: number;
  avgCollectionDays: number;
  projectedCashIn30Days: number;
}

export interface ReminderScenario {
  day: number;
  tone: ReminderTone;
  channel: 'whatsapp' | 'sms' | 'email';
  label: string;
  messageTemplate: string;
}
