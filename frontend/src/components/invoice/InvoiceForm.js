import React, { useState } from 'react';
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Building,
  CreditCard,
  Plus,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import InvoiceLineItems from './InvoiceLineItems';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($) — United States Dollar' },
  { code: 'INR', symbol: '₹', label: 'INR (₹) — Indian Rupee' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) — Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) — British Pound' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$) — Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD (AU$) — Australian Dollar' },
  { code: 'SGD', symbol: 'SG$', label: 'SGD (SG$) — Singapore Dollar' }
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  { value: 'finalized', label: 'Finalized', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'pending', label: 'Pending Payment', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { value: 'paid', label: 'Paid in Full', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'overdue', label: 'Overdue', color: 'bg-red-500/20 text-red-300 border-red-500/30' }
];

export default function InvoiceForm({
  invoice,
  invoices = [],
  clients = [],
  businessProfile,
  onUpdateInvoice,
  onOpenClientManager,
  onOpenBusinessProfile,
  onSaveClient
}) {
  const [showWireDetails, setShowWireDetails] = useState(false);

  const isFinalized = invoice.status && invoice.status !== 'draft';

  const handleFieldChange = (field, value) => {
    onUpdateInvoice({
      ...invoice,
      [field]: value
    });
  };

  const handleStatusChange = (newStatus) => {
    if (invoice.status === 'draft' && newStatus !== 'draft') {
      const currentClient = invoice.client;
      if (currentClient && (currentClient.name || currentClient.company)) {
        const matched = clients.find(c => c.id === currentClient.id);
        const hasDifferences = !matched || 
          matched.company !== currentClient.company || 
          matched.name !== currentClient.name || 
          matched.email !== currentClient.email;
          
        if (hasDifferences) {
          if (window.confirm("Do you want to save or update this client in your directory?")) {
            onSaveClient(currentClient);
          }
        }
      }
    }
    handleFieldChange('status', newStatus);
  };

  const handleClientSelect = (clientId) => {
    if (!clientId) return;
    const selected = clients.find(c => String(c.id) === String(clientId));
    if (selected) {
      // Calculate next sequence
      const clientInvoices = (invoices || []).filter(inv => inv.client && String(inv.client.id) === String(selected.id));
      let maxSeq = 0;
      clientInvoices.forEach(inv => {
        if (inv.invoiceNumber) {
          const parts = inv.invoiceNumber.split('-');
          if (parts.length > 3) {
            const seq = parseInt(parts[3], 10);
            if (!isNaN(seq) && seq > maxSeq) {
              maxSeq = seq;
            }
          } else if (parts.length === 3) {
             // ZDL-YYYY-CCC format counts as sequence 1
             if (maxSeq < 1) maxSeq = 1;
          }
        }
      });
      
      const year = new Date().getFullYear();
      const clientSeq = selected.clientNumber || `CLT${Math.floor(100 + Math.random() * 900)}`;
      
      let newInvoiceNumber = `ZDL-${year}-${clientSeq}`;
      if (maxSeq >= 1) {
        const nextSeq = String(maxSeq + 1).padStart(3, '0');
        newInvoiceNumber = `ZDL-${year}-${clientSeq}-${nextSeq}`;
      }

      onUpdateInvoice({
        ...invoice,
        client: {
          id: selected.id,
          name: selected.name || '',
          company: selected.company || '',
          email: selected.email || '',
          phone: selected.phone || '',
          address: selected.address || '',
          vatOrTaxNumber: selected.vatOrTaxNumber || '',
          clientNumber: selected.clientNumber || ''
        },
        invoiceNumber: newInvoiceNumber,
        currency: selected.currency || invoice.currency || 'USD',
        currencySymbol: selected.currencySymbol || invoice.currencySymbol || '$'
      });
    }
  };

  const handleCurrencyChange = (currCode) => {
    const found = CURRENCIES.find(c => c.code === currCode);
    if (found) {
      onUpdateInvoice({
        ...invoice,
        currency: found.code,
        currencySymbol: found.symbol
      });
    }
  };

  const generateNextInvoiceNumber = () => {
    if (invoice.client?.id) {
      handleClientSelect(invoice.client.id); // regenerate based on client
    } else {
      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      handleFieldChange('invoiceNumber', `ZDL-${year}-${randomSuffix}`);
    }
  };

  return (
    <div className="space-y-6 text-white text-xs">
      {/* 1. Header & Document Details */}
      <div className="bg-surface border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <FileText size={16} />
            </div>
            <h2 className="font-heading font-semibold text-sm text-white">Invoice Information</h2>
          </div>
          <span className="text-[11px] text-gray-400">Live Vector Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[11px] font-medium text-gray-300 block mb-1">Invoice Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                disabled={isFinalized}
                value={invoice.invoiceNumber || ''}
                onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                placeholder="e.g. ZDL-2026-001"
                className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <button
                type="button"
                disabled={isFinalized}
                onClick={generateNextInvoiceNumber}
                title="Generate new invoice number"
                className="p-2 bg-surface-container hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-primary transition-colors shrink-0 disabled:opacity-50"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-300 block mb-1">Status</label>
            <select
              value={invoice.status || 'draft'}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option 
                  key={opt.value} 
                  value={opt.value} 
                  disabled={isFinalized && opt.value === 'draft'}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-300 block mb-1">Invoice Date</label>
            <input
              type="date"
              disabled={isFinalized}
              value={invoice.date || ''}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-300 block mb-1">Payment Due Date (Optional)</label>
            <input
              type="date"
              disabled={isFinalized}
              value={invoice.dueDate || ''}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-medium text-gray-300 block mb-1">Invoice Currency</label>
            <select
              disabled={isFinalized}
              value={invoice.currency || 'USD'}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Bill To / Client Selection */}
      <div className="bg-surface border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
              <User size={16} />
            </div>
            <h2 className="font-heading font-semibold text-sm text-white">Client / Bill To</h2>
          </div>

          <button
            type="button"
            onClick={onOpenClientManager}
            className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
          >
            <span>Manage Directory</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Quick Directory Selector */}
        <div>
          <label className="text-[11px] font-medium text-gray-300 block mb-1">Select Saved Client</label>
          <select
            disabled={isFinalized}
            onChange={(e) => handleClientSelect(e.target.value)}
            defaultValue=""
            className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="" disabled>
              -- Quick auto-fill from saved client directory --
            </option>
            {clients.map((cli) => (
              <option key={cli.id} value={cli.id}>
                {cli.company ? `${cli.company} (${cli.name})` : cli.name}
              </option>
            ))}
          </select>
        </div>

        {/* Editable Client Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">Company / Organization</label>
            <input
              type="text"
              disabled={isFinalized}
              placeholder="e.g. Acme Corp"
              value={invoice.client?.company || ''}
              onChange={(e) =>
                onUpdateInvoice({
                  ...invoice,
                  client: { ...invoice.client, company: e.target.value }
                })
              }
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1">Contact Person</label>
            <input
              type="text"
              disabled={isFinalized}
              placeholder="e.g. Jane Doe"
              value={invoice.client?.name || ''}
              onChange={(e) =>
                onUpdateInvoice({
                  ...invoice,
                  client: { ...invoice.client, name: e.target.value }
                })
              }
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1">Billing Email</label>
            <input
              type="email"
              disabled={isFinalized}
              placeholder="billing@client.com"
              value={invoice.client?.email || ''}
              onChange={(e) =>
                onUpdateInvoice({
                  ...invoice,
                  client: { ...invoice.client, email: e.target.value }
                })
              }
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              disabled={isFinalized}
              placeholder="+1 (555) 000-0000"
              value={invoice.client?.phone || ''}
              onChange={(e) =>
                onUpdateInvoice({
                  ...invoice,
                  client: { ...invoice.client, phone: e.target.value }
                })
              }
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1">Tax / VAT ID (Optional)</label>
            <input
              type="text"
              disabled={isFinalized}
              placeholder="e.g. VAT/EIN/GSTIN"
              value={invoice.client?.vatOrTaxNumber || ''}
              onChange={(e) =>
                onUpdateInvoice({
                  ...invoice,
                  client: { ...invoice.client, vatOrTaxNumber: e.target.value }
                })
              }
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] text-gray-400 block mb-1">Billing Address</label>
            <textarea
              rows={2}
              disabled={isFinalized}
              placeholder="Street, City, State, ZIP code, Country"
              value={invoice.client?.address || ''}
              onChange={(e) =>
                onUpdateInvoice({
                  ...invoice,
                  client: { ...invoice.client, address: e.target.value }
                })
              }
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* 3. Line Items */}
      <div className="bg-surface border border-white/10 rounded-2xl p-4 sm:p-5">
        <InvoiceLineItems
          items={invoice.items || []}
          currencySymbol={invoice.currencySymbol || '$'}
          isFinalized={isFinalized}
          onUpdateItems={(newItems) => handleFieldChange('items', newItems)}
        />
      </div>

      {/* 4. Global Discounts, Shipping, Notes & Bank Remittance */}
      <div className="bg-surface border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <CreditCard size={16} />
            </div>
            <h2 className="font-heading font-semibold text-sm text-white">Payment Remittance & Terms</h2>
          </div>

          <button
            type="button"
            onClick={onOpenBusinessProfile}
            className="text-[11px] text-primary hover:underline font-medium"
          >
            Edit Company Profile &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-gray-400 block mb-1">
              Flat Discount ({invoice.currencySymbol || '$'})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isFinalized}
              value={invoice.discountTotal || 0}
              onChange={(e) => handleFieldChange('discountTotal', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 block mb-1">
              Shipping / Handling ({invoice.currencySymbol || '$'})
            </label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isFinalized}
              value={invoice.shippingOrExtra || 0}
              onChange={(e) => handleFieldChange('shippingOrExtra', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div className="sm:col-span-2 border-t border-white/10 pt-3">
            <label className="text-[10px] text-gray-400 block mb-1">
              Amount Already Paid ({invoice.currencySymbol || '$'}) (Optional)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isFinalized}
              value={invoice.amountPaid || ''}
              onChange={(e) => handleFieldChange('amountPaid', e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="e.g. 500"
              className="w-full sm:w-1/2 bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div className="sm:col-span-2 pt-1">
            <label className="text-[10px] text-gray-400 block mb-1">Notes / Appreciation</label>
            <input
              type="text"
              disabled={isFinalized}
              placeholder="e.g. Thank you for your business!"
              value={invoice.notes || ''}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between border border-white/10 p-3 rounded-xl mt-2 bg-surface-container/50">
            <div>
              <span className="text-[11px] font-medium text-gray-300 block">Show Bank Details on Invoice</span>
              <span className="text-[10px] text-gray-500">Include remittance information for the client</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                disabled={isFinalized}
                className="sr-only peer"
                checked={invoice.showBankDetails !== false}
                onChange={(e) => handleFieldChange('showBankDetails', e.target.checked)}
              />
              <div className={`w-9 h-5 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 peer-checked:after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-white/10 ${isFinalized ? 'opacity-50' : ''}`}></div>
            </label>
          </div>
        </div>

        {/* Bank & Wire Remittance Preview Toggle */}
        <div className="pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowWireDetails(!showWireDetails)}
            className="text-[11px] text-gray-400 hover:text-gray-200 flex items-center gap-1.5 transition-colors"
          >
            <Info size={13} />
            <span>
              {showWireDetails ? 'Hide bank remittance overrides' : 'Customize bank remittance details for this invoice'}
            </span>
          </button>

          {showWireDetails && (
            <div className="mt-3 p-3 bg-surface-container/60 border border-white/10 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-gray-400 block mb-0.5">Bank Name</label>
                <input
                  type="text"
                  disabled={isFinalized}
                  value={invoice.bankDetails?.bankName || ''}
                  onChange={(e) =>
                    onUpdateInvoice({
                      ...invoice,
                      bankDetails: { ...invoice.bankDetails, bankName: e.target.value }
                    })
                  }
                  className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-0.5">Account Name</label>
                <input
                  type="text"
                  disabled={isFinalized}
                  value={invoice.bankDetails?.accountName || ''}
                  onChange={(e) =>
                    onUpdateInvoice({
                      ...invoice,
                      bankDetails: { ...invoice.bankDetails, accountName: e.target.value }
                    })
                  }
                  className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-0.5">Account / IBAN Number</label>
                <input
                  type="text"
                  disabled={isFinalized}
                  value={invoice.bankDetails?.accountNumber || ''}
                  onChange={(e) =>
                    onUpdateInvoice({
                      ...invoice,
                      bankDetails: { ...invoice.bankDetails, accountNumber: e.target.value }
                    })
                  }
                  className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-0.5">IFSC / SWIFT / Routing</label>
                <input
                  type="text"
                  disabled={isFinalized}
                  value={invoice.bankDetails?.routingOrIfsc || invoice.bankDetails?.swiftBic || ''}
                  onChange={(e) =>
                    onUpdateInvoice({
                      ...invoice,
                      bankDetails: { ...invoice.bankDetails, routingOrIfsc: e.target.value }
                    })
                  }
                  className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white disabled:opacity-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
