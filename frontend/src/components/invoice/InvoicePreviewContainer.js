import React, { useState } from 'react';
import {
  Printer,
  Download,
  Copy,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Palette,
  Save
} from 'lucide-react';
import InvoicePaper from './InvoicePaper';

const ACCENT_COLORS = [
  { hex: '#00BFFF', name: 'Electric Cyan (ZDL)' },
  { hex: '#32CD32', name: 'Neon Lime (ZDL)' },
  { hex: '#6366F1', name: 'Indigo' },
  { hex: '#EC4899', name: 'Pink Rose' },
  { hex: '#F59E0B', name: 'Amber Glow' },
  { hex: '#10B981', name: 'Emerald' }
];

export default function InvoicePreviewContainer({
  invoice,
  accentColor,
  onChangeAccentColor,
  onSaveInvoice
}) {
  const [zoom, setZoom] = useState(85); // Default 85% for standard desktop screens
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(130, prev + 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(60, prev - 10));
  const handleResetZoom = () => setZoom(85);

  const handlePrintOrPdf = () => {
    const originalTitle = document.title;
    const companyName = invoice.client?.company || invoice.client?.name || 'Client';
    const invNum = invoice.invoiceNumber || 'Draft';
    const invDate = invoice.date || new Date().toISOString().split('T')[0];
    
    // Temporarily change the document title so the browser uses it as the default PDF filename
    document.title = `${companyName} Invoice - ${invNum} - ${invDate}`;
    
    window.print();
    
    // Restore the original title after a short delay (allowing the print dialog to capture it)
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleCopySummary = () => {
    const currency = invoice.currencySymbol || '$';
    const clientName = invoice.client?.company || invoice.client?.name || 'Valued Client';
    const invNum = invoice.invoiceNumber || 'ZDL-2026';
    const dueDate = invoice.dueDate || 'Upon Receipt';

    let itemsText = (invoice.items || [])
      .map((it) => ` - ${it.description || 'Deliverable'}: ${it.quantity} x ${currency}${it.unitPrice}`)
      .join('\n');

    let subtotal = (invoice.items || []).reduce(
      (acc, it) => acc + (parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0),
      0
    );
    let discount = parseFloat(invoice.discountTotal) || 0;
    let amountPaid = parseFloat(invoice.amountPaid) || 0;
    let grandTotal = Math.max(0, subtotal - discount);
    let totalDue = Math.max(0, grandTotal - amountPaid);

    const summary = `ZasDevLabs Invoice #${invNum}
------------------------------------------------
Bill To: ${clientName}
Invoice Date: ${invoice.date}
Due Date: ${dueDate}

Deliverables:
${itemsText}

Subtotal: ${currency}${subtotal.toFixed(2)}
${discount > 0 ? `${invoice.discountLabel || 'Discount'}: -${currency}${discount.toFixed(2)}\n` : ''}${amountPaid > 0 ? `Amount Paid: -${currency}${amountPaid.toFixed(2)}\n` : ''}Total Due: ${currency}${totalDue.toFixed(2)}
Payment Details: ${invoice.bankDetails?.bankName || 'HDFC Bank Ltd.'} - A/C ${invoice.bankDetails?.accountNumber || '50100195551760'}

Thank you for choosing ZasDevLabs!
`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSave = async () => {
    if (onSaveInvoice) {
      await onSaveInvoice();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-white/10 rounded-2xl overflow-hidden">
      {/* Top Toolbar (Non-printable) */}
      <div className="no-print bg-surface-container/90 backdrop-blur-md border-b border-white/10 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-surface border border-white/10 rounded-xl px-2.5 py-1">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs font-mono font-medium text-gray-300 w-11 text-center select-none">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset Zoom to 85%"
            className="p-1 text-gray-400 hover:text-primary rounded transition-colors ml-1 border-l border-white/10 pl-1.5"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        {/* Accent Color Customizer */}
        <div className="flex items-center gap-1.5 bg-surface border border-white/10 rounded-xl px-2 py-1">
          <Palette size={13} className="text-gray-400 mr-1" />
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => onChangeAccentColor(c.hex)}
              title={c.name}
              className={`w-4 h-4 rounded-full transition-transform ${
                accentColor === c.hex ? 'scale-125 ring-2 ring-white/60' : 'hover:scale-110 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            title="Save Invoice"
            className="px-3 py-1.5 bg-surface border border-white/10 hover:border-primary/40 text-xs font-medium text-gray-200 hover:text-primary rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {saveSuccess ? (
              <>
                <Check size={14} className="text-secondary" />
                <span className="text-secondary">Saved!</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            title="Copy Text Summary"
            className="px-3 py-1.5 bg-surface border border-white/10 hover:border-primary/40 text-xs font-medium text-gray-200 hover:text-primary rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-primary" />
                <span className="text-primary">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span className="hidden sm:inline">Copy Summary</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrintOrPdf}
            className="px-3.5 py-1.5 bg-primary text-primary-fg font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/20 hover:bg-opacity-90 active:scale-95 transition-all"
          >
            <Download size={14} />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Canvas Paper Preview Area with Scroll & Scale */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-neutral-900/60 custom-scrollbar">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="my-2 shadow-2xl print-wrapper"
        >
          <InvoicePaper invoice={invoice} accentColor={accentColor} />
        </div>
      </div>
    </div>
  );
}
