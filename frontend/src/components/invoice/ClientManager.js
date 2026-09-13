import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Building,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function ClientManager({
  isOpen,
  onClose,
  clients = [],
  onSaveClient,
  onDeleteClient,
  onSelectClientForInvoice
}) {
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const generateNextClientNumber = () => {
    let max = 0;
    clients.forEach(c => {
      const num = parseInt(c.clientNumber, 10);
      if (!isNaN(num) && num > max) {
        max = num;
      }
    });
    return String(max + 1).padStart(3, '0');
  };

  const emptyClient = {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    vatOrTaxNumber: '',
    clientNumber: '',
    isClientNumberFrozen: false,
    currency: 'USD',
    currencySymbol: '$',
    apps: [],
    handledApps: '',
    accentColor: '#00BFFF',
    notes: ''
  };

  const [formData, setFormData] = useState(emptyClient);
  const [appInputText, setAppInputText] = useState('');

  if (!isOpen) return null;

  const parseAppsList = (client) => {
    if (Array.isArray(client?.apps) && client.apps.length > 0) {
      return client.apps.map((a) => (typeof a === 'string' ? { id: `app_${a}`, name: a } : a));
    }
    if (typeof client?.handledApps === 'string' && client.handledApps.trim()) {
      return client.handledApps
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ id: `app_${name.replace(/\s+/g, '_')}`, name }));
    }
    return [];
  };

  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    const appsText = (parseAppsList(c)).map(a => a.name).join(' ').toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.clientNumber || '').includes(q) ||
      (c.handledApps || '').toLowerCase().includes(q) ||
      appsText.includes(q)
    );
  });

  const handleStartCreate = () => {
    setEditingId(null);
    setAppInputText('');
    setFormData({
      ...emptyClient,
      clientNumber: generateNextClientNumber(),
      isClientNumberFrozen: false,
      apps: []
    });
    setIsEditing(true);
  };

  const handleStartEdit = (client) => {
    setEditingId(client.id);
    setAppInputText('');
    const parsedApps = parseAppsList(client);
    setFormData({ 
      ...emptyClient,
      ...client, 
      clientNumber: client.clientNumber || generateNextClientNumber(),
      isClientNumberFrozen: client.isClientNumberFrozen || false,
      apps: parsedApps,
      handledApps: parsedApps.map((a) => a.name).join(', '),
      accentColor: client.accentColor || '#00BFFF'
    });
    setIsEditing(true);
  };

  const handleAddAppTag = () => {
    if (!appInputText.trim()) return;
    const newApp = {
      id: `app_${Date.now()}`,
      name: appInputText.trim()
    };
    const updatedApps = [...(formData.apps || []), newApp];
    setFormData({
      ...formData,
      apps: updatedApps,
      handledApps: updatedApps.map((a) => a.name).join(', ')
    });
    setAppInputText('');
  };

  const handleRemoveAppTag = (appId) => {
    const updatedApps = (formData.apps || []).filter((a) => a.id !== appId && a.name !== appId);
    setFormData({
      ...formData,
      apps: updatedApps,
      handledApps: updatedApps.map((a) => a.name).join(', ')
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name && !formData.company) return;

    onSaveClient({
      ...formData,
      id: editingId || undefined
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client from your directory?')) {
      onDeleteClient(id);
      if (editingId === id) {
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
              <Building size={18} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                Client Directory Manager
              </h2>
              <p className="text-xs text-gray-400">
                Manage recurring client accounts, billing addresses, and tax identifiers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {!isEditing ? (
            <>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by client name, company, or email..."
                    className="w-full pl-9 pr-3 py-2 bg-surface-container border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="px-4 py-2 bg-secondary text-secondary-fg font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-opacity-90 transition-all shrink-0"
                >
                  <Plus size={14} />
                  <span>Add New Client</span>
                </button>
              </div>

              {filteredClients.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No clients found. Click "Add New Client" to save your first client profile.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-3.5 bg-surface-container border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: client.accentColor || '#00BFFF' }}
                            title={`Default Accent: ${client.accentColor || '#00BFFF'}`}
                          />
                          <h4 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                            {client.company || client.name}
                            {client.clientNumber && (
                              <span className="px-1.5 py-0.5 rounded bg-gray-500/20 text-[10px] text-gray-300 font-mono border border-gray-500/30">
                                ID: {client.clientNumber}
                              </span>
                            )}
                          </h4>
                          {client.company && client.name && (
                            <span className="text-[11px] text-gray-400">({client.name})</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 text-xs text-gray-400">
                          {client.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={12} />
                              {client.email}
                            </span>
                          )}
                          {client.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} />
                              {client.phone}
                            </span>
                          )}
                        </div>
                        {/* Apps / Websites list */}
                        {parseAppsList(client).length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            <span className="text-[10px] text-gray-500 font-medium">Apps:</span>
                            {parseAppsList(client).map((app) => (
                              <span
                                key={app.id || app.name}
                                className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]"
                              >
                                {app.name}
                              </span>
                            ))}
                          </div>
                        )}
                        {client.address && (
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            {client.address}
                          </p>
                        )}
                        {client.vatOrTaxNumber && (
                          <p className="text-[10px] text-primary/80 font-mono">
                            Tax ID: {client.vatOrTaxNumber}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        {onSelectClientForInvoice && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectClientForInvoice(client);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 bg-primary/10 border border-primary/20 hover:bg-primary text-primary hover:text-primary-fg text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
                          >
                            <span>Use In Invoice</span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(client)}
                          title="Edit Client"
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(client.id)}
                          title="Delete Client"
                          className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Client Edit / Create Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="font-heading font-semibold text-sm text-primary">
                  {editingId ? 'Edit Client Record' : 'Register New Client'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-300 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Innovations LLC"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 block mb-1">Client ID Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 001"
                      disabled={formData.isClientNumberFrozen}
                      value={formData.clientNumber}
                      onChange={(e) => setFormData({ ...formData, clientNumber: e.target.value })}
                      className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {!formData.isClientNumberFrozen ? (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isClientNumberFrozen: true })}
                        className="px-3 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition-colors"
                        title="Freeze Client Number"
                      >
                        Freeze
                      </button>
                    ) : (
                      <span className="px-3 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-xl text-xs font-medium flex items-center justify-center">
                        Frozen
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 block mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 block mb-1">Billing Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="billing@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 block mb-1">VAT / Tax ID / GSTIN</label>
                  <input
                    type="text"
                    placeholder="e.g. US-EIN 94-3829104"
                    value={formData.vatOrTaxNumber}
                    onChange={(e) => setFormData({ ...formData, vatOrTaxNumber: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 block mb-1">Preferred Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => {
                      const curr = e.target.value;
                      const sym = curr === 'INR' ? '₹' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '$';
                      setFormData({ ...formData, currency: curr, currencySymbol: sym });
                    }}
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (CA$)</option>
                    <option value="AUD">AUD (AU$)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-gray-300 font-medium">
                      Apps & Websites Portfolio (Clients &rarr; Apps)
                    </label>
                    <span className="text-[10px] text-gray-500">
                      {(formData.apps || []).length} registered
                    </span>
                  </div>

                  {/* Existing apps tags */}
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-2 bg-surface-container/60 border border-white/10 rounded-xl">
                    {(formData.apps || []).length === 0 ? (
                      <span className="text-[11px] text-gray-500 italic">No apps/websites added yet. Add below.</span>
                    ) : (
                      (formData.apps || []).map((app) => (
                        <span
                          key={app.id || app.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs"
                        >
                          <span>{app.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAppTag(app.id || app.name)}
                            className="text-cyan-400 hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Add app input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add app/website name (e.g. Acme Mobile App, customer.acme.io)..."
                      value={appInputText}
                      onChange={(e) => setAppInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAppTag();
                        }
                      }}
                      className="flex-1 bg-surface-container border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddAppTag}
                      disabled={!appInputText.trim()}
                      className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-xs font-semibold rounded-xl disabled:opacity-40 transition-colors flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Add App</span>
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-gray-300 block mb-1.5">
                    Default Invoice Theme Color
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { hex: '#00BFFF', name: 'Electric Cyan' },
                      { hex: '#32CD32', name: 'Neon Lime' },
                      { hex: '#6366F1', name: 'Indigo' },
                      { hex: '#EC4899', name: 'Pink Rose' },
                      { hex: '#F59E0B', name: 'Amber Glow' },
                      { hex: '#10B981', name: 'Emerald' },
                      { hex: '#8B5CF6', name: 'Violet' },
                      { hex: '#3B82F6', name: 'Ocean Blue' }
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, accentColor: c.hex })}
                        className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                          (formData.accentColor || '#00BFFF') === c.hex
                            ? 'border-white ring-1 ring-white/50 text-white bg-white/10 font-semibold'
                            : 'border-white/10 text-gray-400 hover:text-white bg-surface-container'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-gray-300 block mb-1">Billing Address</label>
                  <textarea
                    rows={2}
                    placeholder="Street, City, State, ZIP, Country"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-gray-300 block mb-1">Account Notes / Terms</label>
                  <input
                    type="text"
                    placeholder="Special terms, project NDA references..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-white/10 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-fg font-semibold rounded-xl text-xs hover:bg-opacity-90"
                >
                  {editingId ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
