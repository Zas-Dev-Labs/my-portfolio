import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  X,
  Plus
} from 'lucide-react';

export default function InvoiceHistoryModal({
  isOpen,
  onClose,
  invoices = [],
  onLoadInvoice,
  onDeleteInvoice,
  onCreateNewInvoice
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!isOpen) return null;

  const filteredInvoices = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchesQuery =
      (inv.invoiceNumber || '').toLowerCase().includes(q) ||
      (inv.client?.name || '').toLowerCase().includes(q) ||
      (inv.client?.company || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
            <CheckCircle2 size={10} />
            <span>Paid</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <AlertCircle size={10} />
            <span>Overdue</span>
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock size={10} />
            <span>Pending</span>
          </span>
        );
    }
  };

  const calculateTotal = (inv) => {
    const subtotal = (inv.items || []).reduce(
      (acc, it) => acc + (parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0),
      0
    );
    const discount = parseFloat(inv.discountTotal) || 0;
    return Math.max(0, subtotal - discount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print font-body text-white">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <History size={18} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-white">
                Invoice History & Archives
              </h2>
              <p className="text-xs text-gray-400">
                Browse previously generated invoices, track payment statuses, or reload past work.
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

        {/* Filters & Search */}
        <div className="p-4 border-b border-white/10 bg-surface-container/40 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice # or client name..."
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['all', 'pending', 'paid', 'draft'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-primary text-primary-fg font-semibold'
                    : 'bg-surface border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                onCreateNewInvoice();
                onClose();
              }}
              className="ml-1 px-3 py-1 bg-secondary text-secondary-fg font-semibold rounded-lg text-xs flex items-center gap-1 hover:bg-opacity-90 transition-all shrink-0"
            >
              <Plus size={13} />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Invoice List */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-2.5">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              No invoices match your search filters.
            </div>
          ) : (
            filteredInvoices.map((inv) => {
              const total = calculateTotal(inv);
              const sym = inv.currencySymbol || '$';

              return (
                <div
                  key={inv.id}
                  className="p-3.5 bg-surface-container border border-white/10 hover:border-white/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        {inv.invoiceNumber}
                      </span>
                      {getStatusBadge(inv.status)}
                    </div>
                    <p className="text-xs text-gray-300 font-medium">
                      {inv.client?.company || inv.client?.name || 'Unassigned Client'}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                      <span>Date: {inv.date}</span>
                      <span>Due: {inv.dueDate}</span>
                      <span>
                        {(inv.items || []).length} {(inv.items || []).length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-400 block font-heading">Total Amount</span>
                      <span className="text-base font-bold font-mono text-primary">
                        {sym}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onLoadInvoice(inv);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-fg border border-primary/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                      >
                        <FileText size={13} />
                        <span>Load</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                            onDeleteInvoice(inv.id);
                          }
                        }}
                        title="Delete Invoice"
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
