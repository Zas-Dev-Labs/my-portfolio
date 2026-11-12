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
  Info,
  Globe,
  Check,
  X
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
  onSaveClient,
  onSelectAccentColor
}) {
  const [showWireDetails, setShowWireDetails] = useState(false);
  const [isAddingNewApp, setIsAddingNewApp] = useState(false);
  const [newAppInput, setNewAppInput] = useState('');

  const isFinalized = invoice.status === 'finalized' || invoice.status === 'paid';

  // Compute available apps for selected client (Clients -> Apps hierarchy)
  const availableClientApps = React.useMemo(() => {
    const matchedClient = clients.find((c) => String(c.id) === String(invoice.client?.id)) || invoice.client;
    if (!matchedClient) return [];
    if (Array.isArray(matchedClient.apps) && matchedClient.apps.length > 0) {
      return matchedClient.apps.map((a) => (typeof a === 'string' ? { id: `app_${a}`, name: a } : a));
    }
    if (typeof matchedClient.handledApps === 'string' && matchedClient.handledApps.trim()) {
      return matchedClient.handledApps
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ id: `app_${name.replace(/\s+/g, '_')}`, name }));
    }
    return [];
  }, [clients, invoice.client]);

  const handleAddNewAppToClient = () => {
    const trimmed = newAppInput.trim();
    if (!trimmed) return;

    const currentApps = [...availableClientApps];
    if (!currentApps.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) {
      currentApps.push({ id: `app_${Date.now()}`, name: trimmed });
    }
    const updatedHandledApps = currentApps.map((a) => a.name).join(', ');

    const updatedClient = {
      ...(invoice.client || {}),
      apps: currentApps,
      handledApps: updatedHandledApps
    };

    onUpdateInvoice({
      ...invoice,
      appName: trimmed,
      client: updatedClient
    });

    if (invoice.client?.id && onSaveClient) {
      const existing = clients.find((c) => String(c.id) === String(invoice.client.id));
      if (existing) {
        onSaveClient({
          ...existing,
          apps: currentApps,
          handledApps: updatedHandledApps
        });
      }
    }

    setNewAppInput('');
    setIsAddingNewApp(false);
  };

  const handleFieldChange = (field, value) => {
    onUpdateInvoice({
      ...invoice,
      [field]: value
    });
  };

  const handleStatusChange = (newStatus) => {
    handleFieldChange('status', newStatus);
  };

  const handleResetClient = () => {
    const defaultColor = businessProfile?.defaultAccentColor || '#00BFFF';
    onUpdateInvoice({
      ...invoice,
      client: {
        id: '',
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        vatOrTaxNumber: '',
        clientNumber: '',
        handledApps: '',
        accentColor: ''
      },
      accentColor: defaultColor
    });
    if (onSelectAccentColor) {
      onSelectAccentColor(defaultColor);
    }
  };

  const handleClientSelect = (clientId) => {
    if (!clientId) {
      handleResetClient();
      return;
    }
    const selected = clients.find((c) => String(c.id) === String(clientId));
    if (selected) {
      // Calculate next sequence
      const clientInvoices = (invoices || []).filter(
        (inv) => inv.client && String(inv.client.id) === String(selected.id)
      );
      let maxSeq = 0;
      clientInvoices.forEach((inv) => {
        if (inv.invoiceNumber) {
          const parts = inv.invoiceNumber.split('-');
          if (parts.length > 3) {
            const seq = parseInt(parts[3], 10);
            if (!isNaN(seq) && seq > maxSeq) {
              maxSeq = seq;
            }
          } else if (parts.length === 3) {
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

      const clientAccent =
        selected.accentColor ||
        invoice.accentColor ||
        businessProfile?.defaultAccentColor ||
        '#00BFFF';

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
          clientNumber: selected.clientNumber || '',
          apps: Array.isArray(selected.apps) ? selected.apps : [],
          handledApps: selected.handledApps || '',
          accentColor: selected.accentColor || ''
        },
        invoiceNumber: newInvoiceNumber,
        currency: selected.currency || invoice.currency || 'USD',
        currencySymbol: selected.currencySymbol || invoice.currencySymbol || '$',
        accentColor: clientAccent
      });

      if (onSelectAccentColor) {
        onSelectAccentColor(clientAccent);
      }
    }
  };

  const availablePaymentAccounts = React.useMemo(() => {
    if (businessProfile?.paymentAccounts && businessProfile.paymentAccounts.length > 0) {
      return businessProfile.paymentAccounts;
    }
    if (businessProfile?.bankDetails?.bankName) {
      return [
        {
          id: 'acc_primary',
          name: 'Primary Bank Account',
          ...businessProfile.bankDetails
        }
      ];
    }
    return [];
  }, [businessProfile]);

  const handlePaymentAccountSelect = (accId) => {
    if (!accId) {
      // User explicitly wants payment section blank
      onUpdateInvoice({
        ...invoice,
        selectedPaymentAccountId: '',
        bankDetails: null,
        showBankDetails: false
      });
      return;
    }

    if (accId === 'custom') {
      // Requirement 3: Reset existing info immediately upon choosing "Custom"
      const customDraft = {
        name: 'Custom Remittance',
        bankName: '',
        accountName: businessProfile?.ownerName || '',
        accountNumber: '',
        routingOrIfsc: '',
        swiftBic: '',
        upiId: '',
        wireNotes: ''
      };
      onUpdateInvoice({
        ...invoice,
        selectedPaymentAccountId: 'custom',
        bankDetails: customDraft,
        showBankDetails: true
      });
      setShowWireDetails(true);
      return;
    }

    const matched = availablePaymentAccounts.find((a) => String(a.id) === String(accId));
    if (matched) {
      onUpdateInvoice({
        ...invoice,
        selectedPaymentAccountId: matched.id,
        bankDetails: { ...matched },
        showBankDetails: true
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
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-gray-300">Select Saved Client</label>
            {invoice.client?.id && (
              <button
                type="button"
                onClick={handleResetClient}
                className="text-[10px] text-gray-400 hover:text-red-400 transition-colors"
              >
                Reset Billing Form
              </button>
            )}
          </div>
          <select
            disabled={isFinalized}
            value={invoice.client?.id || ''}
            onChange={(e) => handleClientSelect(e.target.value)}
            className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="">
              -- None / Reset Billing Form --
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

          {/* Requirement 1: Hierarchy Clients -> Apps -> Invoices */}
          <div className="sm:col-span-2 pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-gray-300 flex items-center gap-1.5">
                <Globe size={13} className="text-cyan-400" />
                <span>App / Website Target (Clients &rarr; Apps &rarr; Invoices)</span>
              </label>
              {invoice.appName && (
                <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1">
                  <span>Target: {invoice.appName}</span>
                  {!isFinalized && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('appName', '')}
                      className="text-cyan-400 hover:text-white"
                      title="Clear app selection"
                    >
                      <X size={11} />
                    </button>
                  )}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <select
                disabled={isFinalized}
                value={invoice.appName || ''}
                onChange={(e) => {
                  if (e.target.value === '__add_new__') {
                    setIsAddingNewApp(true);
                  } else {
                    handleFieldChange('appName', e.target.value);
                    setIsAddingNewApp(false);
                  }
                }}
                className="flex-1 bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              >
                <option value="">-- None / General Client Invoice --</option>
                {availableClientApps.map((app) => (
                  <option key={app.id || app.name} value={app.name}>
                    {app.name}
                  </option>
                ))}
                {invoice.appName && !availableClientApps.some((a) => a.name === invoice.appName) && (
                  <option value={invoice.appName}>
                    {invoice.appName} (Selected)
                  </option>
                )}
                <option value="__add_new__">+ Add New App / Website Name...</option>
              </select>

              <button
                type="button"
                disabled={isFinalized}
                onClick={() => setIsAddingNewApp(!isAddingNewApp)}
                className="px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors disabled:opacity-50"
                title="Add a new app or website name under this client"
              >
                <Plus size={13} />
                <span className="hidden sm:inline">Add App</span>
              </button>
            </div>

            {/* Inline Add New App Form */}
            {isAddingNewApp && (
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex flex-col sm:flex-row gap-2 items-center">
                <input
                  type="text"
                  placeholder="Enter App or Website name (e.g. Acme Mobile App)..."
                  value={newAppInput}
                  onChange={(e) => setNewAppInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewAppToClient();
                    }
                  }}
                  className="flex-1 w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <div className="flex gap-1.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleAddNewAppToClient}
                    disabled={!newAppInput.trim()}
                    className="px-3 py-1.5 bg-cyan-500 text-black font-semibold rounded-lg text-xs hover:bg-cyan-400 disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <Check size={13} />
                    <span>Add & Select</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewApp(false);
                      setNewAppInput('');
                    }}
                    className="px-2.5 py-1.5 text-gray-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
          invoices={invoices}
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

        {/* Payment Account Selector */}
        <div className="space-y-1.5 border border-white/10 p-3 rounded-xl bg-surface-container/40">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-gray-300">
              Select Remittance Payment Account
            </label>
            <button
              type="button"
              onClick={onOpenBusinessProfile}
              className="text-[10px] text-primary hover:underline"
            >
              + Manage Accounts in Profile
            </button>
          </div>
          <select
            disabled={isFinalized}
            value={
              invoice.selectedPaymentAccountId !== undefined
                ? invoice.selectedPaymentAccountId
                : invoice.showBankDetails === false
                ? ''
                : availablePaymentAccounts[0]?.id || ''
            }
            onChange={(e) => handlePaymentAccountSelect(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="">-- None (Leave Payment Section Blank on Invoice) --</option>
            {availablePaymentAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name || acc.bankName} {acc.accountNumber ? `• A/C: ${acc.accountNumber}` : ''} {acc.upiId ? `• UPI: ${acc.upiId}` : ''}
              </option>
            ))}
            <option value="custom">-- Custom / Manual Override Remittance Details --</option>
          </select>
          <p className="text-[10px] text-gray-500">
            Choose which bank/remittance info appears at the bottom of this invoice. If none is chosen, the section stays completely blank.
          </p>
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
              Discount Label / Referral Reason
            </label>
            <input
              type="text"
              disabled={isFinalized}
              placeholder="e.g. Special Discount-Referral (Harish Joshi)"
              value={invoice.discountLabel || ''}
              onChange={(e) => handleFieldChange('discountLabel', e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary disabled:opacity-50"
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
            <label className="text-[10px] text-gray-400 block mb-1">Notes / Appreciation (Right-aligned in footer)</label>
            <input
              type="text"
              disabled={isFinalized}
              placeholder="e.g. Special Discount-Referral (Harish Joshi): -$300.00"
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
            <div className="mt-3 p-3 bg-surface-container/60 border border-white/10 rounded-xl space-y-3">
              {invoice.selectedPaymentAccountId === 'custom' && (
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-[11px] text-primary flex items-center gap-2">
                  <Info size={14} className="shrink-0" />
                  <span>
                    New Custom Account: All fields below will be saved and added to your Business Profile's payment accounts list when this invoice is saved.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Account Label / Nickname</label>
                  <input
                    type="text"
                    disabled={isFinalized}
                    placeholder="e.g. Zas Wire Account, Primary Bank"
                    value={invoice.bankDetails?.name || ''}
                    onChange={(e) =>
                      onUpdateInvoice({
                        ...invoice,
                        bankDetails: { ...invoice.bankDetails, name: e.target.value }
                      })
                    }
                    className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Bank Name</label>
                  <input
                    type="text"
                    disabled={isFinalized}
                    placeholder="e.g. JPMorgan Chase, HDFC Bank"
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
                  <label className="text-[10px] text-gray-400 block mb-0.5">Beneficiary / Account Name</label>
                  <input
                    type="text"
                    disabled={isFinalized}
                    placeholder="e.g. ZasDevLabs LLC"
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
                    placeholder="e.g. 9876543210 or GB29 X..."
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
                  <label className="text-[10px] text-gray-400 block mb-0.5">Routing Number / IFSC</label>
                  <input
                    type="text"
                    disabled={isFinalized}
                    placeholder="e.g. 021000021 or HDFC0001234"
                    value={invoice.bankDetails?.routingOrIfsc || ''}
                    onChange={(e) =>
                      onUpdateInvoice({
                        ...invoice,
                        bankDetails: { ...invoice.bankDetails, routingOrIfsc: e.target.value }
                      })
                    }
                    className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">SWIFT / BIC Code</label>
                  <input
                    type="text"
                    disabled={isFinalized}
                    placeholder="e.g. CHASUS33XXX"
                    value={invoice.bankDetails?.swiftBic || ''}
                    onChange={(e) =>
                      onUpdateInvoice({
                        ...invoice,
                        bankDetails: { ...invoice.bankDetails, swiftBic: e.target.value }
                      })
                    }
                    className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">UPI ID / VPA (Optional)</label>
                  <input
                    type="text"
                    disabled={isFinalized}
                    placeholder="e.g. username@okhdfcbank"
                    value={invoice.bankDetails?.upiId || ''}
                    onChange={(e) =>
                      onUpdateInvoice({
                        ...invoice,
                        bankDetails: { ...invoice.bankDetails, upiId: e.target.value }
                      })
                    }
                    className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Remittance Notes / Wire Info</label>
                  <input
                    type="text"
                    disabled={isFinalized}
                    placeholder="e.g. Mention Invoice Number in reference"
                    value={invoice.bankDetails?.wireNotes || ''}
                    onChange={(e) =>
                      onUpdateInvoice({
                        ...invoice,
                        bankDetails: { ...invoice.bankDetails, wireNotes: e.target.value }
                      })
                    }
                    className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
