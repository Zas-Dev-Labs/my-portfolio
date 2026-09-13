import React, { useState } from 'react';
import {
  Building2,
  Image as ImageIcon,
  CreditCard,
  Check,
  X,
  Upload,
  RefreshCw
} from 'lucide-react';

export default function BusinessProfileSettings({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) {
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

  const handleBankChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
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
    onSaveProfile(formData);
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

          {/* Wire & Bank Remittance Instructions */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard size={14} />
              <span>Remittance & Wire Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankDetails?.bankName || ''}
                  onChange={(e) => handleBankChange('bankName', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Account Beneficiary Name</label>
                <input
                  type="text"
                  value={formData.bankDetails?.accountName || ''}
                  onChange={(e) => handleBankChange('accountName', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">Account Number / IBAN</label>
                <input
                  type="text"
                  value={formData.bankDetails?.accountNumber || ''}
                  onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">IFSC / Routing Code</label>
                <input
                  type="text"
                  value={formData.bankDetails?.routingOrIfsc || ''}
                  onChange={(e) => handleBankChange('routingOrIfsc', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">SWIFT / BIC Code (for International)</label>
                <input
                  type="text"
                  value={formData.bankDetails?.swiftBic || ''}
                  onChange={(e) => handleBankChange('swiftBic', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 block mb-1">UPI ID (India)</label>
                <input
                  type="text"
                  value={formData.bankDetails?.upiId || ''}
                  onChange={(e) => handleBankChange('upiId', e.target.value)}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
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
