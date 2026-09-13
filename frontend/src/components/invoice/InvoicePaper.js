import React from 'react';

export default function InvoicePaper({
  invoice,
  accentColor = '#00BFFF'
}) {
  const currencySymbol = invoice.currencySymbol || '$';
  const items = invoice.items || [];

  // Compute financial totals
  let subtotal = 0;
  let totalTax = 0;

  items.forEach((item) => {
    const price = parseFloat(item.unitPrice) || 0;
    const lineSubtotal = price;
    const taxRate = parseFloat(item.taxRate) || 0;
    const lineTax = (lineSubtotal * taxRate) / 100;

    subtotal += lineSubtotal;
    totalTax += lineTax;
  });

  const discountTotal = parseFloat(invoice.discountTotal) || 0;
  const shippingOrExtra = parseFloat(invoice.shippingOrExtra) || 0;
  const grandTotal = Math.max(0, subtotal + totalTax + shippingOrExtra - discountTotal);

  const sender = invoice.sender || {};
  const client = invoice.client || {};
  const bank = invoice.bankDetails || sender.bankDetails || {};

  const statusMap = {
    draft: { label: 'DRAFT', bg: '#6B7280', text: '#FFFFFF' },
    pending: { label: 'PENDING', bg: '#D97706', text: '#FFFFFF' },
    paid: { label: 'PAID IN FULL', bg: '#059669', text: '#FFFFFF' },
    overdue: { label: 'OVERDUE', bg: '#DC2626', text: '#FFFFFF' }
  };

  const statusStyle = statusMap[invoice.status] || statusMap.pending;

  return (
    <div
      id="printable-invoice"
      data-testid="invoice-paper"
      className="print-only-target bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden font-body text-xs select-text relative"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '16mm 18mm',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Accent Color Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-2.5"
        style={{ backgroundColor: accentColor }}
      />

      {/* 1. Header: Brand / Sender & Invoice Title */}
      <div className="flex justify-between items-start pt-2 pb-6 border-b border-gray-200">
        <div className="flex items-start gap-4 max-w-[60%]">
          {sender.logoUrl ? (
            <img
              src={sender.logoUrl}
              alt={sender.name || 'ZasDevLabs'}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className="w-14 h-14 rounded-xl object-contain border border-gray-200 p-1 bg-white shrink-0"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-heading font-black text-white text-xl shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              Z
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold font-heading text-gray-900 leading-tight">
              {sender.name || 'ZasDevLabs'}
            </h1>
            {sender.ownerName && (
              <p className="text-xs text-gray-700 font-medium">{sender.ownerName}</p>
            )}
            {sender.title && (
              <p className="text-[11px] text-gray-500">{sender.title}</p>
            )}
            <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap gap-x-3">
              {sender.email && <span>{sender.email}</span>}
              {sender.phone && <span>{sender.phone}</span>}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block">
            <span
              className="text-xs font-bold tracking-wider px-3 py-1 rounded-full uppercase font-heading mb-2 inline-block shadow-sm"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
            >
              {statusStyle.label}
            </span>
          </div>

          <h2
            className="text-3xl font-extrabold font-heading tracking-tight"
            style={{ color: accentColor }}
          >
            INVOICE
          </h2>

          <p className="font-mono text-xs font-semibold text-gray-800 mt-1">
            #{invoice.invoiceNumber || 'ZDL-2026-001'}
          </p>

          <div className="mt-3 text-[11px] text-gray-600 space-y-0.5 font-mono">
            <div>
              <span className="text-gray-400">Date: </span>
              <span className="font-medium text-gray-800">{invoice.date || '—'}</span>
            </div>
            {invoice.dueDate && (
              <div>
                <span className="text-gray-400">Due Date: </span>
                <span className="font-medium text-gray-800">{invoice.dueDate}</span>
              </div>
            )}
            <div>
              <span className="text-gray-400">Currency: </span>
              <span className="font-medium text-gray-800">{invoice.currency || 'USD'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bill To / Client Information */}
      <div className="py-5 grid grid-cols-2 gap-8 border-b border-gray-200">
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider block mb-1 font-heading"
            style={{ color: accentColor }}
          >
            Billed To
          </span>
          {(client.company || client.name) && (
            <h3 className="text-sm font-bold text-gray-900">
              {client.company || client.name}
            </h3>
          )}
          {client.company && client.name && (
            <p className="text-xs text-gray-700 font-medium">Attn: {client.name}</p>
          )}
          {client.email && (
            <p className="text-[11px] text-gray-600 mt-0.5">{client.email}</p>
          )}
          {client.phone && (
            <p className="text-[11px] text-gray-600">{client.phone}</p>
          )}
          {client.address && (
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed whitespace-pre-line">
              {client.address}
            </p>
          )}
          {client.vatOrTaxNumber && (
            <p className="text-[10px] text-gray-500 font-mono mt-1">
              Tax ID: {client.vatOrTaxNumber}
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
          <span
            className="text-[10px] font-bold uppercase tracking-wider block font-heading text-gray-500"
          >
            Payment Overview
          </span>
          <div className="my-1">
            <span className="text-[11px] text-gray-500 block">Total Due:</span>
            <span
              className="text-2xl font-bold font-mono tracking-tight"
              style={{ color: accentColor }}
            >
              {currencySymbol}
              {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          {invoice.dueDate && (
            <p className="text-[10px] text-gray-500">
              Due by {invoice.dueDate}
            </p>
          )}
        </div>
      </div>

      {/* 3. Line Items Table */}
      <div className="py-5">
        <table className="w-full text-left border-collapse invoice-table">
          <thead>
            <tr
              className="border-b-2 text-[10px] font-bold uppercase tracking-wider font-heading"
              style={{ borderColor: accentColor, color: '#374151' }}
            >
              <th className="py-2.5 px-2 w-3/4">Description / Scope</th>
              <th className="py-2.5 px-2 text-right w-1/4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {items.map((item, idx) => {
              const amount = parseFloat(item.unitPrice) || 0;

              return (
                <tr key={item.id || idx} className="align-top">
                  <td className="py-3 px-2">
                    <p className="font-semibold text-gray-900 leading-snug">
                      {item.description || 'Deliverable'}
                    </p>
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-semibold text-gray-900">
                    {currencySymbol}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Financial Summary & Totals */}
      <div className="pt-2 pb-6 border-t border-gray-200 flex justify-end">
        <div className="w-64 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>{currencySymbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          {totalTax > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax:</span>
              <span>+{currencySymbol}{totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          {discountTotal > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Discount:</span>
              <span>-{currencySymbol}{discountTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          {shippingOrExtra > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Shipping / Extra:</span>
              <span>+{currencySymbol}{shippingOrExtra.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          {parseFloat(invoice.amountPaid) > 0 && (
            <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-100 mt-1">
              <span>Amount Paid:</span>
              <span>-{currencySymbol}{parseFloat(invoice.amountPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          <div
            className="flex justify-between items-baseline pt-2 border-t-2 text-sm font-bold mt-1"
            style={{ borderColor: accentColor }}
          >
            <span className="font-heading text-gray-900 text-xs uppercase tracking-wider">
              Total Due ({invoice.currency || 'USD'}):
            </span>
            <span
              className="text-lg font-bold"
              style={{ color: accentColor }}
            >
              {currencySymbol}
              {Math.max(0, grandTotal - (parseFloat(invoice.amountPaid) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Remittance Instructions & Bank Details */}
      {invoice.showBankDetails !== false && (bank.bankName || bank.accountNumber || bank.upiId) && (
        <div className="py-4 border-t border-gray-200 grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-3.5 mt-2">
          <div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider block mb-1 font-heading"
              style={{ color: accentColor }}
            >
              Payment Remittance Details
            </span>
            {bank.bankName && (
              <p className="text-xs font-semibold text-gray-800">{bank.bankName}</p>
            )}
            {bank.accountName && (
              <p className="text-[11px] text-gray-600">Account: {bank.accountName}</p>
            )}
            {bank.accountNumber && (
              <p className="text-[11px] font-mono text-gray-700 font-medium">
                A/C No: {bank.accountNumber}
              </p>
            )}
          </div>

          <div className="text-[11px] text-gray-600 space-y-0.5">
            {bank.routingOrIfsc && (
              <p>
                <span className="text-gray-400">IFSC / Routing: </span>
                <span className="font-mono font-medium text-gray-800">{bank.routingOrIfsc}</span>
              </p>
            )}
            {bank.swiftBic && (
              <p>
                <span className="text-gray-400">SWIFT / BIC: </span>
                <span className="font-mono font-medium text-gray-800">{bank.swiftBic}</span>
              </p>
            )}
            {bank.upiId && (
              <p>
                <span className="text-gray-400">UPI ID: </span>
                <span className="font-mono font-medium text-gray-800">{bank.upiId}</span>
              </p>
            )}
            {bank.wireNotes && (
              <p className="text-[10px] text-gray-500 italic mt-1">{bank.wireNotes}</p>
            )}
          </div>
        </div>
      )}

      {/* 6. Terms & Notes */}
      <div className="pt-5 mt-3 border-t border-gray-200 text-[10px] text-gray-500 space-y-1.5">
        {invoice.notes && (
          <p className="font-medium text-gray-700">{invoice.notes}</p>
        )}
        <div className="pt-2 flex justify-end text-[11px] text-gray-500 font-medium">
          <span>Thank you for choosing ZasDevLabs!</span>
        </div>
      </div>
    </div>
  );
}
