import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Upload,
  Copy,
  Check,
  X,
  Cloud,
  HardDrive,
  Code,
  ShieldCheck,
  FileJson,
  AlertCircle,
  Globe,
  Radio,
  Server
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, getCurrentStorageType, setStorageProvider } from '../../services/storage';
import {
  getActiveEnvironment,
  setEnvironmentMode,
  getEnvironmentMetadata,
  isManualEnvironmentOverride
} from '../../services/environment';
import { liveDatabaseId } from '../../firebase';

export default function StorageSettingsModal({
  isOpen,
  onClose,
  storageProvider,
  onDataReloaded
}) {
  const [activeTab, setActiveTab] = useState('cloud'); // 'cloud' | 'backup' | 'supabase'
  const [copiedSql, setCopiedSql] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [providerType, setProviderType] = useState(getCurrentStorageType());
  const [envMeta, setEnvMeta] = useState(getEnvironmentMetadata());

  useEffect(() => {
    if (isOpen) {
      setEnvMeta(getEnvironmentMetadata());
      setProviderType(getCurrentStorageType());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSwitchEnvironment = (mode) => {
    setEnvironmentMode(mode);
    setEnvMeta(getEnvironmentMetadata());
    if (onDataReloaded) {
      setTimeout(() => onDataReloaded(), 100);
    }
  };

  const handleExportBackup = async () => {
    try {
      setExporting(true);
      const backup = await storageProvider.exportAllData();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `zasdevlabs-invoices-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export backup: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        const result = await storageProvider.importAllData(json);
        setImportStatus({
          success: true,
          message: `Restored ${result.invoicesCount || 0} invoices and ${result.clientsCount || 0} clients successfully.`
        });
        if (onDataReloaded) {
          onDataReloaded();
        }
      } catch (err) {
        setImportStatus({
          success: false,
          message: 'Error importing backup: ' + err.message
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCopySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  const handleSwitchProvider = (type) => {
    setProviderType(type);
    setStorageProvider(type);
    if (onDataReloaded) onDataReloaded();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print font-body text-white">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Database size={18} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                Storage & Cloud Synchronization
              </h2>
              <p className="text-xs text-gray-400">
                Data persistence, JSON backup migrations, and Supabase / Firestore cloud integration.
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

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-surface-container/50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'backup'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FileJson size={14} />
            <span>Backup & Migration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'cloud'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Cloud size={14} />
            <span>Cloud & Firestore</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'supabase'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Code size={14} />
            <span>Supabase Blueprint</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-container rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-sm font-heading font-semibold text-white">
                  <Download size={16} className="text-primary" />
                  <span>Export JSON Backup Archive</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Download a full offline snapshot containing your current invoices, saved client directory, and ZasDevLabs company profile into an encrypted or portable JSON file.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={exporting}
                  className="px-4 py-2 bg-primary text-primary-fg font-semibold rounded-xl flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-primary/20"
                >
                  <Download size={14} />
                  <span>{exporting ? 'Generating JSON...' : 'Export Backup File'}</span>
                </button>
              </div>

              <div className="p-4 bg-surface-container rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-sm font-heading font-semibold text-white">
                  <Upload size={16} className="text-secondary" />
                  <span>Restore from JSON Backup</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Import previously exported ZasDevLabs backup files to restore or merge your client database and past invoices across devices.
                </p>

                {importStatus && (
                  <div
                    className={`p-3 rounded-xl border flex items-center gap-2 ${
                      importStatus.success
                        ? 'bg-secondary/10 border-secondary/30 text-secondary'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {importStatus.success ? <Check size={16} /> : <AlertCircle size={16} />}
                    <span>{importStatus.message}</span>
                  </div>
                )}

                <label className="inline-flex cursor-pointer px-4 py-2 bg-surface hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white items-center gap-2 transition-colors">
                  <Upload size={14} />
                  <span>Select JSON Backup File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-container rounded-xl border border-white/10 space-y-3">
                <h3 className="text-sm font-heading font-semibold text-white">
                  Active Storage Engine
                </h3>
                <p className="text-gray-400">
                  Select your primary repository persistence mode. By default, ZasDevLabs uses high-performance offline-first LocalStorage with dual Firestore synchronization when authenticated.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div
                    onClick={() => handleSwitchProvider('local')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      providerType === 'local'
                        ? 'bg-primary/10 border-primary text-white ring-1 ring-primary'
                        : 'bg-surface border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-semibold font-heading">
                        <HardDrive size={15} className="text-primary" />
                        <span>Offline LocalStorage</span>
                      </div>
                      {providerType === 'local' && <Check size={14} className="text-primary" />}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Instant response, zero cloud latency, works offline in any browser without requiring database tokens.
                    </p>
                  </div>

                  <div
                    onClick={() => handleSwitchProvider('firestore')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      providerType === 'firestore'
                        ? 'bg-primary/10 border-primary text-white ring-1 ring-primary'
                        : 'bg-surface border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-semibold font-heading">
                        <Cloud size={15} className="text-secondary" />
                        <span>Firebase Firestore</span>
                      </div>
                      {providerType === 'firestore' && <Check size={14} className="text-secondary" />}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Syncs records securely to your ZasDevLabs cloud database with real-time multi-device accessibility.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-container rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server size={16} className="text-secondary" />
                    <h3 className="text-sm font-heading font-semibold text-white">
                      Firestore Database Environments
                    </h3>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold"
                    style={{
                      backgroundColor: `${envMeta.accentColor}15`,
                      borderColor: `${envMeta.accentColor}40`,
                      color: envMeta.accentColor
                    }}
                  >
                    {envMeta.label}
                  </span>
                </div>

                <p className="text-gray-400 text-[11px] leading-relaxed">
                  ZasDevLabs is configured with dual environment isolation. Test invoices created in development or preview remain safely namespaced and will not pollute live production records.
                </p>

                {/* 3-way toggle: Auto-Detect | Preview | Live */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSwitchEnvironment('auto')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      !envMeta.isManualOverride
                        ? 'bg-primary/10 border-primary text-white ring-1 ring-primary'
                        : 'bg-surface border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-semibold text-xs text-white">Auto-Detect</span>
                      {!envMeta.isManualOverride && <Check size={12} className="text-primary" />}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Based on current URL ({envMeta.detectedEnvironment === 'live' ? 'zasdevlabs.tech' : 'preview URL'})
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchEnvironment('preview')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      envMeta.isManualOverride && envMeta.activeEnvironment === 'preview'
                        ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500'
                        : 'bg-surface border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-semibold text-xs text-amber-400">Dev / Preview</span>
                      {envMeta.isManualOverride && envMeta.activeEnvironment === 'preview' && (
                        <Check size={12} className="text-amber-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Isolated collection namespace ({envMeta.collections.invoices})
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchEnvironment('live')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      envMeta.isManualOverride && envMeta.activeEnvironment === 'live'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-surface border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-semibold text-xs text-emerald-400">Live Production</span>
                      {envMeta.isManualOverride && envMeta.activeEnvironment === 'live' && (
                        <Check size={12} className="text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Production collections (invoices, clients)
                    </p>
                  </button>
                </div>

                {/* Diagnostic Details */}
                <div className="mt-2 p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5 font-mono text-[10px] text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Firestore Database:</span>
                    <span className="text-gray-200 truncate max-w-[260px]">{liveDatabaseId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Target Invoices Path:</span>
                    <span className="text-primary">{envMeta.collections.invoices}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Target Clients Path:</span>
                    <span className="text-secondary">{envMeta.collections.clients}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Current Hostname:</span>
                    <span className="text-gray-300">{envMeta.hostname}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2.5 text-blue-300">
                <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                <span>
                  All invoices created are automatically synced to the active environment's Firestore collections with local offline persistence and zero lock-in exportability.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-sm text-white">
                    Supabase SQL Schema & RLS Policies
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Execute this complete SQL migration in your Supabase SQL Editor to deploy multi-user team invoicing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-surface border border-white/10 hover:border-primary/40 rounded-xl text-xs font-semibold text-gray-200 hover:text-primary flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedSql ? (
                    <>
                      <Check size={13} className="text-primary" />
                      <span className="text-primary">Copied SQL!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Schema</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-3.5 bg-black/60 border border-white/10 rounded-xl text-[11px] font-mono text-gray-300 overflow-x-auto max-h-72 leading-relaxed custom-scrollbar">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-surface hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
