-- PayTrack CM Database Schema (PostgreSQL)

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Users (Gestionnaires et comptables)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'manager',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Clients (PME clientes des gestionnaires)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    sector VARCHAR(100),
    credit_score INTEGER DEFAULT 100, -- 0 à 100
    nif VARCHAR(255), -- Numéro d'Identifiant Fiscal
    debtor_rating VARCHAR(50) DEFAULT 'reliable',
    avg_payment_delay INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Invoices (Factures DGI)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'partially_paid', 'overdue'
    description TEXT,
    momo_link VARCHAR(255),
    momo_reference VARCHAR(255), -- ID de transaction Campay pour vérification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Payments (Encaissements MoMo, etc.)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    method VARCHAR(50) NOT NULL, -- 'momo_mtn', 'momo_orange', 'card', 'cash'
    transaction_ref VARCHAR(255) UNIQUE,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reconciled BOOLEAN DEFAULT true
);

-- Table: Reminders (Historique des relances WhatsApp/SMS)
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- 'whatsapp', 'sms', 'email'
    tone VARCHAR(50) NOT NULL, -- 'cordial', 'firm', 'urgent', 'legal'
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'read'
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index utiles pour les requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_reminders_invoice_id ON reminders(invoice_id);
