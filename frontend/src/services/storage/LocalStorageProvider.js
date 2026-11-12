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
  paymentAccounts: [
    {
      id: 'acc_hdfc_ashwini',
      name: 'HDFC Bank - Ashwini Rao (50100195551760)',
      bankName: 'HDFC Bank Ltd.',
      accountName: 'Ashwini Rao',
      accountNumber: '50100195551760',
      routingOrIfsc: 'HDFC0001234',
      swiftBic: 'HDFCINBBXXX',
      upiId: 'ashwini@okhdfcbank',
      wireNotes: 'Please reference invoice number in wire transfer remarks.'
    },
    {
      id: 'acc_hdfc',
      name: 'HDFC Bank (Domestic INR Remittance)',
      bankName: 'HDFC Bank Ltd.',
      accountName: 'ZasDevLabs / Sashi Kiran Rao',
      accountNumber: '50200012345678',
      routingOrIfsc: 'HDFC0001234',
      swiftBic: 'HDFCINBBXXX',
      upiId: 'skr@zasdevlabs',
      wireNotes: 'Wire transfers accepted in USD, EUR, and INR.'
    },
    {
      id: 'acc_wise',
      name: 'Wise Multi-Currency (Global Wire / USD)',
      bankName: 'Wise Payments / Community Federal Savings Bank',
      accountName: 'ZasDevLabs Tech',
      accountNumber: '8839201948',
      routingOrIfsc: '026073150',
      swiftBic: 'CMFUS33',
      upiId: '',
      wireNotes: 'ACH routing 026073150 for US domestic wires, SWIFT CMFUS33 for international wires.'
    },
    {
      id: 'acc_upi',
      name: 'UPI Direct (Instant QR / Mobile Settlement)',
      bankName: 'UPI Direct (NPCI / India)',
      accountName: 'Sashi Kiran Rao',
      accountNumber: '',
      routingOrIfsc: '',
      swiftBic: '',
      upiId: 'skr@zasdevlabs.tech',
      wireNotes: 'Instant payment via Google Pay, PhonePe, Paytm, or BHIM.'
    }
  ],
  defaultTerms: 'Please quote invoice number in bank remittances.'
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
    handledApps: 'Apex Cloud Console, Mobile Fleet Tracker iOS/Android',
    accentColor: '#00BFFF',
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
    handledApps: 'VedicTech E-Commerce Portal, IoT Hardware Dashboard',
    accentColor: '#32CD32',
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
      } else {
        try {
          const prof = JSON.parse(localStorage.getItem(PROFILE_KEY));
          if (prof && Array.isArray(prof.paymentAccounts) && !prof.paymentAccounts.some(a => a.accountNumber === '50100195551760')) {
            prof.paymentAccounts.unshift(DEFAULT_BUSINESS_PROFILE.paymentAccounts[0]);
            localStorage.setItem(PROFILE_KEY, JSON.stringify(prof));
          }
        } catch (e) {
          // ignore
        }
      }
      if (!localStorage.getItem(CLIENTS_KEY)) {
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(INITIAL_CLIENTS_SEED));
      }

      // Check / Seed Invoice ZDL-2026-396
      const ashwiniBankDetails = {
        name: 'HDFC Bank - Ashwini Rao (50100195551760)',
        bankName: 'HDFC Bank Ltd.',
        accountName: 'Ashwini Rao',
        accountNumber: '50100195551760',
        routingOrIfsc: 'HDFC0001234',
        swiftBic: 'HDFCINBBXXX',
        upiId: 'ashwini@okhdfcbank',
        wireNotes: 'Please reference invoice #ZDL-2026-396 in wire transfer remarks.'
      };

      const invoice396 = {
        id: 'inv_zdl_396',
        invoiceNumber: 'ZDL-2026-396',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
        currency: 'USD',
        currencySymbol: '$',
        accentColor: '#00BFFF',
        sender: DEFAULT_BUSINESS_PROFILE,
        client: INITIAL_CLIENTS_SEED[0],
        items: [
          {
            id: 'item_396_1',
            description: 'Frontend Architecture & Modern Web Engineering',
            quantity: 1,
            unitPrice: 1190,
            taxRate: 0,
            discount: 0
          },
          {
            id: 'item_396_2',
            description: 'Mobile App API Bridge & Cloud Data Sync',
            quantity: 1,
            unitPrice: 600,
            taxRate: 0,
            discount: 0
          }
        ],
        discountTotal: 300,
        discountLabel: 'Special Discount-Referral (Harish Joshi)',
        shippingOrExtra: 0,
        amountPaid: 600,
        notes: 'Special Discount-Referral (Harish Joshi): -$300.00',
        paymentTerms: DEFAULT_BUSINESS_PROFILE.defaultTerms,
        bankDetails: ashwiniBankDetails,
        selectedPaymentAccountId: 'acc_hdfc_ashwini',
        showBankDetails: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingInvoicesStr = localStorage.getItem(INVOICES_KEY);
      if (!existingInvoicesStr) {
        localStorage.setItem(INVOICES_KEY, JSON.stringify([invoice396]));
      } else {
        try {
          const list = JSON.parse(existingInvoicesStr);
          const idx = list.findIndex(inv => inv.invoiceNumber === 'ZDL-2026-396');
          if (idx >= 0) {
            list[idx] = {
              ...list[idx],
              ...invoice396,
              id: list[idx].id || invoice396.id
            };
            localStorage.setItem(INVOICES_KEY, JSON.stringify(list));
          } else {
            // Prepend so it is the active loaded invoice
            localStorage.setItem(INVOICES_KEY, JSON.stringify([invoice396, ...list]));
          }
        } catch (e) {
          localStorage.setItem(INVOICES_KEY, JSON.stringify([invoice396]));
        }
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
      if (!data) return DEFAULT_BUSINESS_PROFILE;
      const parsed = JSON.parse(data);
      if (!parsed.paymentAccounts || parsed.paymentAccounts.length === 0) {
        parsed.paymentAccounts = DEFAULT_BUSINESS_PROFILE.paymentAccounts;
      }
      return parsed;
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
