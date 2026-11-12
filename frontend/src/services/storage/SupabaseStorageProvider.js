import { StorageProvider } from './StorageProvider';

/**
 * Complete Supabase PostgreSQL Schema Blueprint for ZasDevLabs Invoicing
 */
export const SUPABASE_SQL_SCHEMA = `-- ==========================================================
-- ZasDevLabs Invoice Generator — Supabase SQL Schema
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Business Profile Table
CREATE TABLE IF NOT EXISTS public.business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'ZasDevLabs',
    owner_name TEXT,
    title TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    tax_number TEXT,
    logo_url TEXT,
    default_currency TEXT DEFAULT 'USD',
    default_currency_symbol TEXT DEFAULT '$',
    default_accent_color TEXT DEFAULT '#00BFFF',
    default_tax_rate NUMERIC DEFAULT 18.0,
    bank_details JSONB DEFAULT '{}'::jsonb,
    default_terms TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Clients Directory Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    vat_or_tax_number TEXT,
    currency TEXT DEFAULT 'USD',
    currency_symbol TEXT DEFAULT '$',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled')),
    currency TEXT DEFAULT 'USD',
    currency_symbol TEXT DEFAULT '$',
    accent_color TEXT DEFAULT '#00BFFF',
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    sender JSONB NOT NULL,
    client JSONB NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    discount_total NUMERIC DEFAULT 0,
    shipping_or_extra NUMERIC DEFAULT 0,
    notes TEXT,
    payment_terms TEXT,
    bank_details JSONB DEFAULT '{}'::jsonb,
    subtotal NUMERIC,
    total_tax NUMERIC,
    total_discount NUMERIC,
    total NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.business_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own clients" ON public.clients
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own invoices" ON public.invoices
    FOR ALL USING (auth.uid() = user_id);

-- 6. Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_invoices_user ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON public.invoices(date DESC);
CREATE INDEX IF NOT EXISTS idx_clients_user ON public.clients(user_id);
`;

export class SupabaseStorageProvider extends StorageProvider {
  constructor(config = {}) {
    super();
    this.supabaseUrl = config.supabaseUrl || '';
    this.supabaseAnonKey = config.supabaseAnonKey || '';
  }

  isConfigured() {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  }

  getSqlBlueprint() {
    return SUPABASE_SQL_SCHEMA;
  }

  async getInvoices() {
    if (!this.isConfigured()) {
      throw new Error('Supabase client is not configured. Please supply Supabase URL and Anon Key.');
    }
    // REST API fallback
    const res = await fetch(`${this.supabaseUrl}/rest/v1/invoices?select=*&order=date.desc`, {
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`
      }
    });
    if (!res.ok) throw new Error(`Supabase query failed: ${res.statusText}`);
    return await res.json();
  }

  async getInvoice(id) {
    const res = await fetch(`${this.supabaseUrl}/rest/v1/invoices?id=eq.${id}&select=*`, {
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`
      }
    });
    if (!res.ok) throw new Error(`Supabase query failed: ${res.statusText}`);
    const rows = await res.json();
    return rows[0] || null;
  }

  async saveInvoice(invoice) {
    if (!this.isConfigured()) throw new Error('Supabase not configured');
    const res = await fetch(`${this.supabaseUrl}/rest/v1/invoices`, {
      method: 'POST',
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation,resolution=merge-duplicates'
      },
      body: JSON.stringify(invoice)
    });
    if (!res.ok) throw new Error(`Supabase save failed: ${res.statusText}`);
    const rows = await res.json();
    return rows[0] || invoice;
  }

  async deleteInvoice(id) {
    if (!this.isConfigured()) throw new Error('Supabase not configured');
    const res = await fetch(`${this.supabaseUrl}/rest/v1/invoices?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`
      }
    });
    return res.ok;
  }

  async getClients() {
    if (!this.isConfigured()) return [];
    const res = await fetch(`${this.supabaseUrl}/rest/v1/clients?select=*&order=name.asc`, {
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`
      }
    });
    return res.ok ? await res.json() : [];
  }

  async saveClient(client) {
    if (!this.isConfigured()) throw new Error('Supabase not configured');
    const res = await fetch(`${this.supabaseUrl}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation,resolution=merge-duplicates'
      },
      body: JSON.stringify(client)
    });
    const rows = await res.json();
    return rows[0] || client;
  }

  async deleteClient(id) {
    if (!this.isConfigured()) throw new Error('Supabase not configured');
    const res = await fetch(`${this.supabaseUrl}/rest/v1/clients?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`
      }
    });
    return res.ok;
  }

  async getBusinessProfile() {
    if (!this.isConfigured()) return null;
    const res = await fetch(`${this.supabaseUrl}/rest/v1/business_profiles?select=*&limit=1`, {
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`
      }
    });
    const rows = await res.json();
    return rows[0] || null;
  }

  async saveBusinessProfile(profile) {
    if (!this.isConfigured()) throw new Error('Supabase not configured');
    const res = await fetch(`${this.supabaseUrl}/rest/v1/business_profiles`, {
      method: 'POST',
      headers: {
        apikey: this.supabaseAnonKey,
        Authorization: `Bearer ${this.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation,resolution=merge-duplicates'
      },
      body: JSON.stringify(profile)
    });
    const rows = await res.json();
    return rows[0] || profile;
  }

  async exportAllData() {
    const invoices = await this.getInvoices();
    const clients = await this.getClients();
    const profile = await this.getBusinessProfile();
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      provider: 'Supabase Cloud Adapter',
      data: { profile, clients, invoices }
    };
  }

  async importAllData() {
    throw new Error('Bulk cloud import should be executed via Supabase SQL migration script.');
  }
}
