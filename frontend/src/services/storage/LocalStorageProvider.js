import { StorageProvider } from './StorageProvider';

const INVOICES_KEY = 'zdl_invoices_v1';
const CLIENTS_KEY = 'zdl_clients_v1';
const PROFILE_KEY = 'zdl_profile_v1';

export const DEFAULT_BUSINESS_PROFILE = {
  name: 'ZasDevLabs',
  ownerName: 'Sashi Kiran Rao',
  title: 'Full-Stack Developer & 3D Print Designer',
  email: 'skr@zasdevlabs.tech',
  phone: '+91 98450 12345',
  website: 'https://zasdevlabs.tech',
  address: 'ZasDevLabs Technologies, Bengaluru, Karnataka, India',
  taxNumber: 'GSTIN: 29AAAAA0000A1Z5',
  logoUrl: '/logo.jpg',
  defaultCurrency: 'USD',
  defaultCurrencySymbol: '$',
  defaultAccentColor: '#00BFFF',
  defaultTaxRate: 18,
  bankDetails: {
    bankName: 'HDFC Bank Ltd.',
    accountName: 'ZasDevLabs / Sashi Kiran Rao',
    accountNumber: '50200012345678',
    routingOrIfsc: 'HDFC0001234',
    swiftBic: 'HDFCINBBXXX',
    upiId: 'skr@zasdevlabs',
    wireNotes: 'Wire transfers accepted in USD, EUR, and INR.'
  },
  defaultTerms: 'Payment due within 14 days of invoice date. Please quote invoice number in bank remittances. Late payments incur a 1.5% monthly service charge.'
};

export const INITIAL_CLIENTS_SEED = [
  {
    id: 'cli_seed_1',
    name: 'Priya Sharma',
    company: 'Apex Cloud Innovations LLC',
    email: 'billing@apexcloud.io',
    phone: '+1 (415) 555-0192',
    address: '500 Howard Street, Suite 400, San Francisco, CA 94105, USA',
    vatOrTaxNumber: 'US-EIN 94-3829104',
    currency: 'USD',
    currencySymbol: '$',
    clientNumber: '001',
    isClientNumberFrozen: true,
    notes: 'Net 14 payment terms agreed in Master Services Agreement.'
  },
  {
    id: 'cli_seed_2',
    name: 'Arjun Mehta',
    company: 'VedicTech Solutions Pvt Ltd',
    email: 'accounts@vedictech.in',
    phone: '+91 80 4123 9876',
    address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038, India',
    vatOrTaxNumber: 'GSTIN: 29AABCU9603R1ZM',
    currency: 'INR',
    currencySymbol: '₹',
    clientNumber: '002',
    isClientNumberFrozen: true,
    notes: 'Hardware prototyping & 3D printing custom enclosure work.'
  }
];

export class LocalStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.initDefaults();
  }

  initDefaults() {
    try {
      if (!localStorage.getItem(PROFILE_KEY)) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_BUSINESS_PROFILE));
      }
      if (!localStorage.getItem(CLIENTS_KEY)) {
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(INITIAL_CLIENTS_SEED));
      }
      if (!localStorage.getItem(INVOICES_KEY)) {
        // Seed an initial showcase invoice
        const initialInvoice = {
          id: 'inv_seed_1',
          invoiceNumber: 'ZDL-2026-001',
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'draft',
          currency: 'USD',
          currencySymbol: '$',
          accentColor: '#00BFFF',
          sender: DEFAULT_BUSINESS_PROFILE,
          client: INITIAL_CLIENTS_SEED[0],
          items: [
            {
              id: 'item_1',
              description: 'Frontend Architecture & Next.js Design System Implementation',
              quantity: 40,
              unitPrice: 85,
              taxRate: 0,
              discount: 0
            },
            {
              id: 'item_2',
              description: 'Mobile App API Bridge & Real-Time Sync Engine',
              quantity: 25,
              unitPrice: 90,
              taxRate: 0,
              discount: 0
            }
          ],
          discountTotal: 0,
          shippingOrExtra: 0,
          notes: 'Thank you for your business! Please remit payment within 14 days.',
          paymentTerms: DEFAULT_BUSINESS_PROFILE.defaultTerms,
          bankDetails: DEFAULT_BUSINESS_PROFILE.bankDetails,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(INVOICES_KEY, JSON.stringify([initialInvoice]));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or disabled:', e);
    }
  }

  async getInvoices() {
    try {
      const data = localStorage.getItem(INVOICES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get invoices from localStorage', e);
      return [];
    }
  }

  async getInvoice(id) {
    const list = await this.getInvoices();
    return list.find(inv => inv.id === id) || null;
  }

  async saveInvoice(invoice) {
    const list = await this.getInvoices();
    const updatedItem = {
      ...invoice,
      updatedAt: new Date().toISOString()
    };
    if (!updatedItem.id) {
      updatedItem.id = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      updatedItem.createdAt = new Date().toISOString();
    }
    const idx = list.findIndex(inv => inv.id === updatedItem.id);
    let newList;
    if (idx >= 0) {
      newList = [...list];
      newList[idx] = updatedItem;
    } else {
      newList = [updatedItem, ...list];
    }
    localStorage.setItem(INVOICES_KEY, JSON.stringify(newList));
    return updatedItem;
  }

  async deleteInvoice(id) {
    const list = await this.getInvoices();
    const filtered = list.filter(inv => inv.id !== id);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(filtered));
    return true;
  }

  async getClients() {
    try {
      const data = localStorage.getItem(CLIENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get clients from localStorage', e);
      return [];
    }
  }

  async saveClient(client) {
    const list = await this.getClients();
    const updated = { ...client };
    if (!updated.id) {
      updated.id = `cli_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }
    if (!updated.clientNumber) {
      let max = 0;
      list.forEach(c => {
        const num = parseInt(c.clientNumber, 10);
        if (!isNaN(num) && num > max) {
          max = num;
        }
      });
      updated.clientNumber = String(max + 1).padStart(3, '0');
      updated.isClientNumberFrozen = true;
    }
    const idx = list.findIndex(c => c.id === updated.id);
    let newList;
    if (idx >= 0) {
      newList = [...list];
      newList[idx] = updated;
    } else {
      newList = [updated, ...list];
    }
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(newList));
    return updated;
  }

  async deleteClient(id) {
    const list = await this.getClients();
    const filtered = list.filter(c => c.id !== id);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(filtered));
    return true;
  }

  async getBusinessProfile() {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : DEFAULT_BUSINESS_PROFILE;
    } catch (e) {
      return DEFAULT_BUSINESS_PROFILE;
    }
  }

  async saveBusinessProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }

  async exportAllData() {
    const invoices = await this.getInvoices();
    const clients = await this.getClients();
    const profile = await this.getBusinessProfile();
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      provider: 'ZasDevLabs Invoice Storage',
      data: {
        profile,
        clients,
        invoices
      }
    };
  }

  async importAllData(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Invalid JSON backup file format');
    }
    const { data } = jsonData;
    if (!data) {
      throw new Error('Backup file is missing root data payload');
    }

    if (data.profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
    }
    if (Array.isArray(data.clients)) {
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(data.clients));
    }
    if (Array.isArray(data.invoices)) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(data.invoices));
    }

    return {
      success: true,
      invoicesCount: (data.invoices || []).length,
      clientsCount: (data.clients || []).length
    };
  }
}
