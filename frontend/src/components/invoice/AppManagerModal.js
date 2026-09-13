import React, { useState, useMemo } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  ExternalLink,
  Building,
  FilePlus,
  Layers
} from 'lucide-react';

export default function AppManagerModal({
  isOpen,
  onClose,
  clients = [],
  onSaveClient,
  onSelectAppForInvoice,
  onCreateInvoiceForApp
}) {
  const [selectedClientId, setSelectedClientId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingApp, setEditingApp] = useState(null); // { clientId, appId, name, url }
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [targetClientId, setTargetClientId] = useState('');

  // Extract all apps with client context
  const allAppsList = useMemo(() => {
    const list = [];
    clients.forEach((client) => {
      const clientApps = Array.isArray(client.apps) ? client.apps : [];
      
      // If client has legacy handledApps string and no apps array
      if (clientApps.length === 0 && typeof client.handledApps === 'string' && client.handledApps.trim()) {
        client.handledApps.split(',').forEach((appName, idx) => {
          const trimmed = appName.trim();
          if (trimmed) {
            list.push({
              id: `legacy_${client.id}_${idx}`,
              name: trimmed,
              url: '',
              clientId: client.id,
              clientName: client.company || client.name,
              accentColor: client.accentColor || '#00BFFF'
            });
          }
        });
      } else {
        clientApps.forEach((app) => {
          const appObj = typeof app === 'string' ? { id: `app_${app}`, name: app } : app;
          list.push({
            id: appObj.id || `app_${appObj.name}`,
            name: appObj.name,
            url: appObj.url || '',
            clientId: client.id,
            clientName: client.company || client.name,
            accentColor: client.accentColor || '#00BFFF'
          });
        });
      }
    });
    return list;
  }, [clients]);

  const filteredApps = useMemo(() => {
    return allAppsList.filter((item) => {
      const matchesClient = selectedClientId === 'all' || String(item.clientId) === String(selectedClientId);
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.url || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClient && matchesSearch;
    });
  }, [allAppsList, selectedClientId, searchQuery]);

  if (!isOpen) return null;

  const handleCreateApp = (e) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    const clientToAddTo = clients.find((c) => String(c.id) === String(targetClientId || clients[0]?.id));
    if (!clientToAddTo) {
      alert('Please select a client to assign this app/website to.');
      return;
    }

    const currentApps = Array.isArray(clientToAddTo.apps)
      ? [...clientToAddTo.apps]
      : (clientToAddTo.handledApps || '')
          .split(',')
          .map((s) => ({ id: `app_${Date.now()}_${Math.random()}`, name: s.trim() }))
          .filter((a) => a.name);

    const newAppObj = {
      id: `app_${Date.now()}`,
      name: newAppName.trim(),
      url: newAppUrl.trim()
    };

    currentApps.push(newAppObj);
    const updatedClient = {
      ...clientToAddTo,
      apps: currentApps,
      handledApps: currentApps.map((a) => a.name).join(', ')
    };

    onSaveClient(updatedClient);
    setNewAppName('');
    setNewAppUrl('');
  };

  const handleUpdateApp = (e) => {
    e.preventDefault();
    if (!editingApp || !editingApp.name.trim()) return;

    const client = clients.find((c) => String(c.id) === String(editingApp.clientId));
    if (!client) return;

    const currentApps = Array.isArray(client.apps)
      ? [...client.apps]
      : (client.handledApps || '')
          .split(',')
          .map((s) => ({ id: `app_${s.trim()}`, name: s.trim() }))
          .filter((a) => a.name);

    const updatedApps = currentApps.map((a) => {
      const aObj = typeof a === 'string' ? { id: `app_${a}`, name: a } : a;
      if (aObj.id === editingApp.id || aObj.name === editingApp.originalName) {
        return {
          ...aObj,
          name: editingApp.name.trim(),
          url: editingApp.url?.trim() || ''
        };
      }
      return aObj;
    });

    const updatedClient = {
      ...client,
      apps: updatedApps,
      handledApps: updatedApps.map((a) => a.name).join(', ')
    };

    onSaveClient(updatedClient);
    setEditingApp(null);
  };

  const handleDeleteApp = (appItem) => {
    if (!window.confirm(`Are you sure you want to remove "${appItem.name}" from ${appItem.clientName}?`)) {
      return;
    }

    const client = clients.find((c) => String(c.id) === String(appItem.clientId));
    if (!client) return;

    const currentApps = Array.isArray(client.apps)
      ? [...client.apps]
      : (client.handledApps || '')
          .split(',')
          .map((s) => ({ id: `app_${s.trim()}`, name: s.trim() }))
          .filter((a) => a.name);

    const updatedApps = currentApps.filter((a) => {
      const aObj = typeof a === 'string' ? { id: `app_${a}`, name: a } : a;
      return aObj.id !== appItem.id && aObj.name !== appItem.name;
    });

    const updatedClient = {
      ...client,
      apps: updatedApps,
      handledApps: updatedApps.map((a) => a.name).join(', ')
    };

    onSaveClient(updatedClient);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Globe size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                  Apps & Websites Directory
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-gray-300">
                  Clients &rarr; Apps &rarr; Invoices
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Manage the portfolio of apps and websites built or maintained for your clients.
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

        {/* Filter / Search Bar */}
        <div className="p-4 border-b border-white/10 bg-surface-container/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps by name, website, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-[11px] text-gray-400 shrink-0">Client:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full sm:w-auto bg-surface-container border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
            >
              <option value="all">All Clients ({allAppsList.length} Apps)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company || c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main List */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* Add New App Form */}
          <form
            onSubmit={handleCreateApp}
            className="p-3.5 bg-surface-container/50 border border-white/10 rounded-xl space-y-2.5"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Plus size={14} />
              <span>Register New App or Website under Client</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-4">
                <select
                  required
                  value={targetClientId || (clients[0]?.id || '')}
                  onChange={(e) => setTargetClientId(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>-- Select Client --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <input
                  type="text"
                  required
                  placeholder="App / Website Name (e.g. Acme Mobile)"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="URL / Domain (optional)"
                  value={newAppUrl}
                  onChange={(e) => setNewAppUrl(e.target.value)}
                  className="w-full bg-surface border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-1">
                <button
                  type="submit"
                  disabled={!newAppName.trim() || clients.length === 0}
                  className="w-full py-1.5 bg-primary text-primary-fg font-semibold rounded-xl text-xs hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center transition-all"
                  title="Add App"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </form>

          {/* Edit App Modal inline form */}
          {editingApp && (
            <form
              onSubmit={handleUpdateApp}
              className="p-3.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl space-y-2.5 animate-fadeInUp"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                <span>Edit App / Website Details</span>
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">App / Website Name</label>
                  <input
                    type="text"
                    required
                    value={editingApp.name}
                    onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                    className="w-full bg-surface border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">URL / Domain</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editingApp.url || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, url: e.target.value })}
                    className="w-full bg-surface border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 bg-cyan-500 text-black font-semibold rounded-lg text-xs hover:bg-cyan-400 flex items-center gap-1.5"
                >
                  <Check size={13} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Apps Table / List */}
          {filteredApps.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
              <Globe size={28} className="mx-auto text-gray-500 mb-2 opacity-50" />
              <p className="text-xs text-gray-400 font-medium">
                {allAppsList.length === 0
                  ? 'No apps or websites registered under your clients yet.'
                  : 'No apps match your search filter.'}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Use the form above to add an app or website to any client.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredApps.map((app) => (
                <div
                  key={`${app.clientId}_${app.id}`}
                  className="p-3 bg-surface-container/60 hover:bg-surface-container border border-white/5 hover:border-white/15 rounded-xl flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: app.accentColor || '#00BFFF' }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-xs text-white truncate">{app.name}</h4>
                        {app.url && (
                          <a
                            href={app.url.startsWith('http') ? app.url : `https://${app.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 hover:text-cyan-300 transition-colors"
                            title="Open Link"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <Building size={11} />
                        <span className="truncate">{app.clientName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onSelectAppForInvoice && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectAppForInvoice(app);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-[11px] font-medium transition-colors"
                        title="Set this app on the active invoice"
                      >
                        Use in Invoice
                      </button>
                    )}

                    {onCreateInvoiceForApp && (
                      <button
                        type="button"
                        onClick={() => {
                          onCreateInvoiceForApp(app);
                          onClose();
                        }}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        title="Create New Invoice for this App"
                      >
                        <FilePlus size={14} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setEditingApp({
                          id: app.id,
                          originalName: app.name,
                          name: app.name,
                          url: app.url,
                          clientId: app.clientId
                        })
                      }
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                      title="Edit App"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteApp(app)}
                      className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete App"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
