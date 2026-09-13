import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Building2,
  Database,
  History,
  Plus,
  ArrowLeft,
  Check,
  ShieldCheck,
  Layout,
  Eye,
  Sliders
} from 'lucide-react';
import Logo from '../Logo';
import InvoiceForm from './InvoiceForm';
import InvoicePreviewContainer from './InvoicePreviewContainer';
import ClientManager from './ClientManager';
import BusinessProfileSettings from './BusinessProfileSettings';
import StorageSettingsModal from './StorageSettingsModal';
import InvoiceHistoryModal from './InvoiceHistoryModal';
import {
  getStorageProvider,
  DEFAULT_BUSINESS_PROFILE
} from '../../services/storage';
import {
  getEnvironmentMetadata,
  subscribeEnvironmentChanges
} from '../../services/environment';

export default function InvoiceWorkspace() {
  const navigate = useNavigate();
  const storage = getStorageProvider();

  // Environment State
  const [envMeta, setEnvMeta] = useState(getEnvironmentMetadata());

  // Storage & Core Data States
  const [profile, setProfile] = useState(DEFAULT_BUSINESS_PROFILE);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Invoice State
  const todayStr = new Date().toISOString().split('T')[0];
  const dueStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const createBlankInvoice = useCallback((baseProfile) => ({
    id: `inv_${Date.now()}`,
    invoiceNumber: `ZDL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    date: todayStr,
    dueDate: dueStr,
    status: 'draft',
    currency: baseProfile?.defaultCurrency || 'USD',
    currencySymbol: baseProfile?.defaultCurrencySymbol || '$',
    accentColor: baseProfile?.defaultAccentColor || '#00BFFF',
    sender: baseProfile || DEFAULT_BUSINESS_PROFILE,
    client: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      vatOrTaxNumber: ''
    },
    items: [
      {
        id: `item_${Date.now()}_1`,
        description: 'Frontend Architecture & Modern Web Engineering',
        quantity: 1,
        unitPrice: 1200,
        taxRate: 0,
        discount: 0
      }
    ],
    discountTotal: 0,
    shippingOrExtra: 0,
    notes: 'Thank you for your business! Please reference invoice number during remittance.',
    paymentTerms: baseProfile?.defaultTerms || DEFAULT_BUSINESS_PROFILE.defaultTerms,
    bankDetails: baseProfile?.bankDetails || DEFAULT_BUSINESS_PROFILE.bankDetails,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }), [todayStr, dueStr]);

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [accentColor, setAccentColor] = useState('#00BFFF');

  // View mode for mobile screens ('editor' | 'preview')
  const [mobileView, setMobileView] = useState('editor');

  // Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [saveBanner, setSaveBanner] = useState('');

  // Load initial data from Storage Provider
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [loadedProfile, loadedClients, loadedInvoices] = await Promise.all([
        storage.getBusinessProfile(),
        storage.getClients(),
        storage.getInvoices()
      ]);

      const prof = loadedProfile || DEFAULT_BUSINESS_PROFILE;
      setProfile(prof);
      setClients(loadedClients || []);
      setInvoices(loadedInvoices || []);

      if (loadedInvoices && loadedInvoices.length > 0) {
        setActiveInvoice(loadedInvoices[0]);
        setAccentColor(loadedInvoices[0].accentColor || prof.defaultAccentColor || '#00BFFF');
      } else {
        const blank = createBlankInvoice(prof);
        setActiveInvoice(blank);
        setAccentColor(blank.accentColor);
      }
    } catch (err) {
      console.error('Failed to load invoice workspace data:', err);
    } finally {
      setLoading(false);
    }
  }, [storage, createBlankInvoice]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Re-sync when environment changes (e.g. toggled in settings)
  useEffect(() => {
    const unsub = subscribeEnvironmentChanges((newMeta) => {
      setEnvMeta(newMeta);
      loadAllData();
    });
    return () => unsub();
  }, [loadAllData]);

  // Handle invoice save
  const handleSaveInvoice = async (invToSave = activeInvoice) => {
    if (!invToSave) return;
    try {
      const updated = {
        ...invToSave,
        accentColor,
        sender: profile
      };
      const saved = await storage.saveInvoice(updated);
      setActiveInvoice(saved);

      // Refresh invoice list
      const list = await storage.getInvoices();
      setInvoices(list);

      setSaveBanner('Invoice saved successfully');
      setTimeout(() => setSaveBanner(''), 3000);
      return saved;
    } catch (err) {
      alert('Error saving invoice: ' + err.message);
    }
  };

  // Handle client save / update
  const handleSaveClient = async (clientData) => {
    try {
      const saved = await storage.saveClient(clientData);
      const list = await storage.getClients();
      setClients(list);
      return saved;
    } catch (err) {
      alert('Error saving client: ' + err.message);
    }
  };

  // Handle client delete
  const handleDeleteClient = async (clientId) => {
    try {
      await storage.deleteClient(clientId);
      const list = await storage.getClients();
      setClients(list);
    } catch (err) {
      alert('Error deleting client: ' + err.message);
    }
  };

  // Handle profile save
  const handleSaveProfile = async (newProfile) => {
    try {
      const saved = await storage.saveBusinessProfile(newProfile);
      setProfile(saved);
      // Also update current invoice sender and bank details
      if (activeInvoice) {
        setActiveInvoice((prev) => ({
          ...prev,
          sender: saved,
          bankDetails: saved.bankDetails
        }));
      }
    } catch (err) {
      alert('Error saving profile: ' + err.message);
    }
  };

  // Handle invoice delete from history
  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await storage.deleteInvoice(invoiceId);
      const list = await storage.getInvoices();
      setInvoices(list);
      if (activeInvoice?.id === invoiceId) {
        if (list.length > 0) {
          setActiveInvoice(list[0]);
        } else {
          setActiveInvoice(createBlankInvoice(profile));
        }
      }
    } catch (err) {
      alert('Error deleting invoice: ' + err.message);
    }
  };

  // Create new invoice
  const handleCreateNewInvoice = () => {
    const blank = createBlankInvoice(profile);
    setActiveInvoice(blank);
    setAccentColor(profile.defaultAccentColor || '#00BFFF');
    setMobileView('editor');
  };

  // Select client from manager into active invoice
  const handleSelectClientForInvoice = (client) => {
    if (!activeInvoice) return;
    setActiveInvoice({
      ...activeInvoice,
      client: {
        id: client.id,
        name: client.name || '',
        company: client.company || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        vatOrTaxNumber: client.vatOrTaxNumber || ''
      },
      currency: client.currency || activeInvoice.currency,
      currencySymbol: client.currencySymbol || activeInvoice.currencySymbol
    });
  };

  if (loading || !activeInvoice) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-white font-body">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-gray-400 font-medium">
          Loading ZasDevLabs Invoice Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white font-body flex flex-col selection:bg-primary/30 selection:text-white">
      {/* 1. Parent Navigation & Administrative Dock Bar (Hidden in Print) */}
      <header className="no-print bg-surface/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 lg:px-6 py-3">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-3">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 rounded-xl bg-surface-container border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors"
              title="Back to Admin Dashboard"
            >
              <ArrowLeft size={16} />
            </Link>

            <div className="flex items-center gap-2.5">
              <Logo size={28} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold font-heading text-white leading-none">
                    ZasDevLabs
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold tracking-wider uppercase font-mono">
                    Invoice Suite
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStorageModal(true)}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${envMeta.accentColor}18`,
                      borderColor: `${envMeta.accentColor}40`,
                      color: envMeta.accentColor
                    }}
                    title={`Database Environment: ${envMeta.label} (${envMeta.collections.invoices}). Click to configure.`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: envMeta.accentColor }} />
                    <span className="font-semibold">{envMeta.badgeText}</span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 hidden sm:block">
                  Offline-First Vector Billing & PDF Generator
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Dock Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleCreateNewInvoice}
              className="px-3 py-1.5 bg-primary text-primary-fg font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20 hover:bg-opacity-90 active:scale-95 transition-all"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Invoice</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="px-3 py-1.5 bg-surface-container hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <History size={14} className="text-primary" />
              <span className="hidden md:inline">History</span>
              <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.2 rounded-full">
                {invoices.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowClientModal(true)}
              className="px-3 py-1.5 bg-surface-container hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Users size={14} className="text-secondary" />
              <span className="hidden md:inline">Clients</span>
              <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.2 rounded-full">
                {clients.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="px-2.5 py-1.5 bg-surface-container hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Business Profile & Branding"
            >
              <Building2 size={14} />
              <span className="hidden lg:inline">Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setShowStorageModal(true)}
              className="px-2.5 py-1.5 bg-surface-container hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Data Backup & Cloud Sync"
            >
              <Database size={14} className="text-purple-400" />
              <span className="hidden lg:inline">Sync / Backup</span>
            </button>
          </div>
        </div>

        {/* Mobile View Toggle Bar */}
        <div className="flex lg:hidden mt-2.5 pt-2.5 border-t border-white/10 justify-center gap-2">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'editor'
                ? 'bg-primary text-primary-fg shadow-md shadow-primary/20'
                : 'bg-surface-container text-gray-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'preview'
                ? 'bg-primary text-primary-fg shadow-md shadow-primary/20'
                : 'bg-surface-container text-gray-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>Vector Preview</span>
          </button>
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveBanner && (
        <div className="no-print fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-secondary text-secondary-fg font-semibold text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-fadeInUp">
          <Check size={16} />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* 2. Main Workspace (Split View on Desktop, Tabbed on Mobile) */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Invoice Editor */}
        <div
          className={`lg:col-span-6 xl:col-span-5 space-y-6 ${
            mobileView === 'editor' ? 'block' : 'hidden lg:block'
          } no-print`}
        >
          <InvoiceForm
            invoice={activeInvoice}
            invoices={invoices}
            clients={clients}
            businessProfile={profile}
            onUpdateInvoice={(updated) => setActiveInvoice(updated)}
            onOpenClientManager={() => setShowClientModal(true)}
            onOpenBusinessProfile={() => setShowProfileModal(true)}
            onSaveClient={handleSaveClient}
          />
        </div>

        {/* Right Column: Interactive Vector Preview Canvas */}
        <div
          className={`lg:col-span-6 xl:col-span-7 h-[calc(100vh-6rem)] sticky top-20 print:block print:h-auto ${
            mobileView === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <InvoicePreviewContainer
            invoice={activeInvoice}
            accentColor={accentColor}
            onChangeAccentColor={(c) => {
              setAccentColor(c);
              setActiveInvoice((prev) => ({ ...prev, accentColor: c }));
            }}
            onSaveInvoice={() => handleSaveInvoice(activeInvoice)}
          />
        </div>
      </main>

      {/* 3. Modals */}
      <ClientManager
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        clients={clients}
        onSaveClient={handleSaveClient}
        onDeleteClient={handleDeleteClient}
        onSelectClientForInvoice={handleSelectClientForInvoice}
      />

      <BusinessProfileSettings
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <StorageSettingsModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
        storageProvider={storage}
        onDataReloaded={loadAllData}
      />

      <InvoiceHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        invoices={invoices}
        onLoadInvoice={(inv) => {
          setActiveInvoice(inv);
          if (inv.accentColor) setAccentColor(inv.accentColor);
        }}
        onDeleteInvoice={handleDeleteInvoice}
        onCreateNewInvoice={handleCreateNewInvoice}
      />
    </div>
  );
}
