import React, { useState } from 'react';
import {
  Building2,
  Image as ImageIcon,
  CreditCard,
  Check,
  X,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';

export default function BusinessProfileSettings({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) {
  const initialAccounts = (profile?.paymentAccounts && profile.paymentAccounts.length > 0)
    ? profile.paymentAccounts
    : (profile?.bankDetails?.bankName
      ? [{
          id: 'acc_1',
          name: 'Primary Account',
          bankName: profile.bankDetails.bankName || '',
          accountName: profile.bankDetails.accountName || '',
          accountNumber: profile.bankDetails.accountNumber || '',
          routingOrIfsc: profile.bankDetails.routingOrIfsc || '',
          swiftBic: profile.bankDetails.swiftBic || '',
          upiId: profile.bankDetails.upiId || '',
          wireNotes: profile.bankDetails.wireNotes || ''
        }]
      : []);

  const [paymentAccounts, setPaymentAccounts] = useState(initialAccounts);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [accountDraft, setAccountDraft] = useState(null);

  const [formData, setFormData] = useState({
    ...profile,
    bankDetails: {
      ...profile?.bankDetails
    }
  });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartAddAccount = () => {
    setEditingAccountId('new');
    setAccountDraft({
      id: `acc_${Date.now()}`,
      name: '',
      bankName: '',
      accountName: profile?.ownerName || '',
      accountNumber: '',
      routingOrIfsc: '',
      swiftBic: '',
      upiId: '',
      wireNotes: ''
    });
  };

  const handleStartEditAccount = (acc) => {
    setEditingAccountId(acc.id);
    setAccountDraft({ ...acc });
  };

  const handleSaveAccountDraft = () => {
    if (!accountDraft.name && !accountDraft.bankName) return;
    if (editingAccountId === 'new') {
      setPaymentAccounts([...paymentAccounts, accountDraft]);
    } else {
      setPaymentAccounts(paymentAccounts.map((a) => (a.id === editingAccountId ? accountDraft : a)));
    }
    setEditingAccountId(null);
    setAccountDraft(null);
  };

  const handleDeleteAccount = (accId) => {
    setPaymentAccounts(paymentAccounts.filter((a) => a.id !== accId));
    if (editingAccountId === accId) {
      setEditingAccountId(null);
      setAccountDraft(null);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleChange('logoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefaultLogo = () => {
    handleChange('logoUrl', '/logo.jpg');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const primaryBank = paymentAccounts.length > 0 ? paymentAccounts[0] : formData.bankDetails;
    const finalProfile = {
      ...formData,
      paymentAccounts,
      bankDetails: primaryBank
    };
    onSaveProfile(finalProfile);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                Business Profile & Global Defaults
              </h2>
              <p className="text-xs text-gray-400">
                Configure ZasDevLabs company branding, logo, default tax, and remittance wires.
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5 text-xs">
          {/* Logo & Branding */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-xs text-primary uppercase tracking-wider">
              Branding & Logo
            </h3>

            <div className="flex items-center gap-4 p-3 bg-surface-container rounded-xl border border-white/10">
              <div className="w-16 h-16 rounded-xl border border-white/20 bg-black/30 flex items-center justify-center overflow-hidden p-1 shrink-0">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <ImageIcon className="text-gray-500" size={24} />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-surface hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-200 flex items-center gap-1.5 transition-colors">
                    <Upload size={13} />
                    <span>Upload Custom Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleResetToDefaultLogo}
                    className="px-3 py-1.5 bg-surface hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw size={12} />
                    <span>Use Official /logo.jpg</span>
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  Recommended: Square PNG/JPEG with transparent or dark background.
                </p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-xs text-primary uppercase tracking-wider">
              Company Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Company / Studio Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Owner / Representative Name</label>
                <input
                  type="text"
                  value={formData.ownerName || ''}
                  onChange={(e) => handleChange('ownerName', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Primary Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Tax / GSTIN Number</label>
                <input
                  type="text"
                  value={formData.taxNumber || ''}
                  onChange={(e) => handleChange('taxNumber', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Website URL</label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] text-gray-300 block mb-1">Registered Address</label>
                <textarea
                  rows={2}
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Multiple Payment Accounts & Remittance Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={14} />
                <span>Payment Remittance Accounts ({paymentAccounts.length})</span>
              </h3>
              {!editingAccountId && (
                <button
                  type="button"
                  onClick={handleStartAddAccount}
                  className="px-2.5 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-primary-fg border border-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <Plus size={12} />
                  <span>Add Payment Account</span>
                </button>
              )}
            </div>

            {/* List of Configured Payment Accounts */}
            <div className="space-y-2">
              {paymentAccounts.map((acc, index) => (
                <div
                  key={acc.id || index}
                  className="p-3 bg-surface-container border border-white/10 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">
                        {acc.name || acc.bankName || 'Unnamed Account'}
                      </span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.2 bg-primary/20 text-primary text-[9px] font-mono rounded">
                          Default Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {acc.bankName && <span>{acc.bankName}</span>}
                      {acc.accountNumber && <span> • A/C: {acc.accountNumber}</span>}
                      {acc.upiId && <span> • UPI: {acc.upiId}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditAccount(acc)}
                      title="Edit Account"
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAccount(acc.id)}
                      title="Delete Account"
                      className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {paymentAccounts.length === 0 && !editingAccountId && (
                <div className="p-4 border border-dashed border-white/10 rounded-xl text-center text-gray-400 text-xs">
                  No payment accounts configured yet. Click "Add Payment Account" to add one.
                </div>
              )}
            </div>

            {/* Inline Account Editor */}
            {editingAccountId && accountDraft && (
              <div className="p-3.5 bg-surface-container/90 border border-primary/30 rounded-xl space-y-3 mt-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-semibold text-primary text-xs">
                    {editingAccountId === 'new' ? 'Add New Payment Account' : 'Edit Payment Account'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setEditingAccountId(null); setAccountDraft(null); }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-gray-300 block mb-1">
                      Account Label / Friendly Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Bank (Domestic INR), Wise (USD Global Wire), UPI Direct"
                      value={accountDraft.name || ''}
                      onChange={(e) => setAccountDraft({ ...accountDraft, name: e.target.value })}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 block mb-1">Bank Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Bank Ltd., Wise Payments"
                      value={accountDraft.bankName || ''}
                      onChange={(e) => setAccountDraft({ ...accountDraft, bankName: e.target.value })}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 block mb-1">Account Beneficiary Name</label>
                    <input
                      type="text"
                      placeholder="e.g. ZasDevLabs / Sashi Kiran Rao"
                      value={accountDraft.accountName || ''}
                      onChange={(e) => setAccountDraft({ ...accountDraft, accountName: e.target.value })}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 block mb-1">Account Number / IBAN</label>
                    <input
                      type="text"
                      placeholder="e.g. 50200012345678"
                      value={accountDraft.accountNumber || ''}
                      onChange={(e) => setAccountDraft({ ...accountDraft, accountNumber: e.target.value })}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 block mb-1">IFSC / Routing Code</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0001234 or 026073150"
                      value={accountDraft.routingOrIfsc || ''}
                      onChange={(e) => setAccountDraft({ ...accountDraft, routingOrIfsc: e.target.value })}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 block mb-1">SWIFT / BIC Code</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFCINBBXXX or CMFUS33"
                      value={accountDraft.swiftBic || ''}
                      onChange={(e) => setAccountDraft({ ...accountDraft, swiftBic: e.target.value })}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-300 block mb-1">UPI ID (India)</label>
                    <input
                      type="text"
                      placeholder="e.g. skr@zasdevlabs.tech"
                      value={accountDraft.upiId || ''}
                      onChange={(e) => setAccountDraft({ ...accountDraft, upiId: e.target.value })}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-gray-300 block mb-1">Remittance Notes / Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Please quote invoice number in wire memo. ACH / Fedwire accepted."
                      value={accountDraft.wireNotes || ''}
                      onChange={(e) => setAccountDraft({ ...accountDraft, wireNotes: e.target.value })}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setEditingAccountId(null); setAccountDraft(null); }}
                    className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAccountDraft}
                    className="px-3 py-1 bg-primary text-primary-fg rounded-lg text-xs font-semibold"
                  >
                    Save Account
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Default Terms */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-xs text-primary uppercase tracking-wider">
              Default Terms & Conditions
            </h3>
            <textarea
              rows={2}
              value={formData.defaultTerms || ''}
              onChange={(e) => handleChange('defaultTerms', e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/10 rounded-xl text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-primary-fg font-semibold rounded-xl text-xs flex items-center gap-1.5 hover:bg-opacity-90 transition-all shadow-md shadow-primary/20"
            >
              {saved ? (
                <>
                  <Check size={14} />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <span>Save Business Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
