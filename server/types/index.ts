export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    created_at: Date;
}

export interface Client {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    sector: string | null;
    credit_score: number;
    nif: string | null;
    debtor_rating: 'excellent' | 'reliable' | 'risky' | 'critical';
    avg_payment_delay: number;
    created_at: Date;
    updated_at: Date;
}

export interface Invoice {
    id: string;
    invoice_number: string;
    client_id: string;
    amount: number;
    paid_amount: number;
    due_date: Date;
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue';
    description: string | null;
    momo_link: string | null;
    momo_reference: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface AuthenticatedRequest extends Express.Request {
    user?: User;
}
