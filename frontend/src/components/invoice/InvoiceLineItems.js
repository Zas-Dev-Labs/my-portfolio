import React, { useMemo } from 'react';
import { Plus, Trash2, Copy, Layers, Sparkles } from 'lucide-react';

const DEFAULT_DELIVERABLES_CATALOG = [
  { description: 'Frontend Architecture & Modern Web Engineering', unitPrice: 1200 },
  { description: 'Full-Stack Web App Development (React, Node.js)', unitPrice: 2500 },
  { description: 'Mobile Application MVP (iOS & Android)', unitPrice: 3200 },
  { description: 'UI/UX Interactive Prototyping & Figma System', unitPrice: 850 },
  { description: 'Cloud Infrastructure Setup & DevOps Automation', unitPrice: 1100 },
  { description: '3D CAD Mechanical Modeling & Functional Print Design', unitPrice: 750 },
  { description: 'API Integration, Microservices & Data Pipelines', unitPrice: 1400 },
  { description: 'Code Review, Security Hardening & Performance Audit', unitPrice: 950 },
  { description: 'Monthly Retainer: Technical Maintenance & Feature Engineering', unitPrice: 1800 }
];

export default function InvoiceLineItems({
  items = [],
  currencySymbol = '$',
  isFinalized = false,
  invoices = [],
  onUpdateItems
}) {
  // Aggregate deliverables catalog from presets and past invoices
  const deliverablesCatalog = useMemo(() => {
    const map = new Map();
    DEFAULT_DELIVERABLES_CATALOG.forEach((item) => {
      map.set(item.description.trim().toLowerCase(), item);
    });

    if (Array.isArray(invoices)) {
      invoices.forEach((inv) => {
        if (Array.isArray(inv?.items)) {
          inv.items.forEach((it) => {
            if (it?.description && it.unitPrice !== undefined) {
              const key = it.description.trim().toLowerCase();
              if (!map.has(key)) {
                map.set(key, {
                  description: it.description.trim(),
                  unitPrice: parseFloat(it.unitPrice) || 0
                });
              }
            }
          });
        }
      });
    }

    return Array.from(map.values());
  }, [invoices]);

  const handleItemChange = (index, field, value) => {
    const updated = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [field]: field === 'description' ? value : Math.max(0, parseFloat(value) || 0)
        };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleDescriptionChange = (index, value) => {
    // Check if the value typed/selected matches an existing deliverable to auto-populate amount
    const matched = deliverablesCatalog.find(
      (d) => d.description.toLowerCase() === value.trim().toLowerCase()
    );

    const updated = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          description: value,
          unitPrice: matched ? matched.unitPrice : item.unitPrice
        };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleSelectPresetForExistingRow = (index, deliverableDesc) => {
    if (!deliverableDesc) return;
    const matched = deliverablesCatalog.find((d) => d.description === deliverableDesc);
    if (!matched) return;

    const updated = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          description: matched.description,
          unitPrice: matched.unitPrice
        };
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleAddItem = (preset = null) => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      description: preset ? preset.description : '',
      quantity: 1,
      unitPrice: preset ? preset.unitPrice : 0,
      taxRate: 0,
      discount: 0
    };
    onUpdateItems([...items, newItem]);
  };

  const handleDuplicateItem = (index) => {
    const original = items[index];
    const clone = {
      ...original,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      description: `${original.description} (Copy)`
    };
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onUpdateItems(updated);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) {
      onUpdateItems([
        {
          id: `item_${Date.now()}`,
          description: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: 0,
          discount: 0
        }
      ]);
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onUpdateItems(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <Layers size={14} className="text-primary" />
          <span>Line Items & Deliverables</span>
        </label>
        
        <div className="flex items-center justify-end gap-2 overflow-hidden">
          {/* Quick preset add selector */}
          {!isFinalized && (
            <select
              value=""
              onChange={(e) => {
                const match = deliverablesCatalog.find((d) => d.description === e.target.value);
                if (match) handleAddItem(match);
              }}
              className="bg-surface-container border border-primary/20 hover:border-primary text-[11px] text-primary rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer max-w-[200px] sm:max-w-xs truncate shrink"
              title="Quick-add a deliverable with auto-populated amount"
            >
              <option value="">+ Add Preset Deliverable...</option>
              {deliverablesCatalog.map((d, i) => (
                <option key={i} value={d.description}>
                  {d.description} ({currencySymbol}{d.unitPrice.toLocaleString()})
                </option>
              ))}
            </select>
          )}

          <span className="text-xs text-gray-400 font-mono whitespace-nowrap shrink-0 px-2 py-0.5 rounded-md bg-surface-container border border-white/5 flex items-center">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Shared Datalist for autocomplete on any row */}
      <datalist id="deliverables-global-catalog">
        {deliverablesCatalog.map((d, i) => (
          <option key={i} value={d.description}>
            {currencySymbol}{d.unitPrice.toLocaleString()}
          </option>
        ))}
      </datalist>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-white/10 rounded-xl bg-surface-container/50">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container text-gray-400 font-medium">
              <th className="py-2.5 px-3 w-7/12">Description / Scope</th>
              <th className="py-2.5 px-2 w-3/12">Auto-Populate Deliverable</th>
              <th className="py-2.5 px-2 w-2/12 text-right">Amount ({currencySymbol})</th>
              <th className="py-2.5 px-2 w-14 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2 px-3">
                  <input
                    type="text"
                    disabled={isFinalized}
                    list="deliverables-global-catalog"
                    placeholder="Enter or choose deliverable (auto-fills amount)..."
                    value={item.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary disabled:opacity-50"
                  />
                </td>
                <td className="py-2 px-2">
                  <select
                    disabled={isFinalized}
                    value=""
                    onChange={(e) => handleSelectPresetForExistingRow(index, e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-gray-300 focus:outline-none focus:border-primary disabled:opacity-50"
                    title="Auto-fill this line item from saved deliverables"
                  >
                    <option value="">⚡ Auto-fill...</option>
                    {deliverablesCatalog.map((d, i) => (
                      <option key={i} value={d.description}>
                        {d.description} ({currencySymbol}{d.unitPrice.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    disabled={isFinalized}
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-lg px-2 py-1.5 text-xs text-right font-mono text-white focus:outline-none focus:border-primary disabled:opacity-50"
                  />
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      disabled={isFinalized}
                      onClick={() => handleDuplicateItem(index)}
                      title="Duplicate item"
                      className="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={isFinalized}
                      onClick={() => handleRemoveItem(index)}
                      title="Delete item"
                      className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-2.5">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="p-3 bg-surface-container/70 border border-white/10 rounded-xl space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-400">Item #{index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={isFinalized}
                  onClick={() => handleDuplicateItem(index)}
                  className="p-1 text-gray-400 hover:text-primary disabled:opacity-50"
                >
                  <Copy size={13} />
                </button>
                <button
                  type="button"
                  disabled={isFinalized}
                  onClick={() => handleRemoveItem(index)}
                  className="p-1 text-gray-400 hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Mobile Auto-populate Selector */}
            {!isFinalized && (
              <select
                value=""
                onChange={(e) => handleSelectPresetForExistingRow(index, e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-primary focus:outline-none"
              >
                <option value="">⚡ Auto-populate from Deliverables...</option>
                {deliverablesCatalog.map((d, i) => (
                  <option key={i} value={d.description}>
                    {d.description} ({currencySymbol}{d.unitPrice.toLocaleString()})
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              disabled={isFinalized}
              list="deliverables-global-catalog"
              placeholder="Description or deliverable name"
              value={item.description}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary disabled:opacity-50"
            />

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">
                Amount ({currencySymbol})
              </label>
              <input
                type="number"
                min="0"
                step="any"
                disabled={isFinalized}
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg px-2 py-1 text-xs text-right font-mono text-white disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={isFinalized}
        onClick={() => handleAddItem()}
        className="w-full py-2.5 px-3 border border-dashed border-white/20 hover:border-primary/60 rounded-xl text-xs text-gray-300 hover:text-primary flex items-center justify-center gap-1.5 transition-colors bg-surface/40 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={14} />
        <span>Add Custom Line Item</span>
      </button>
    </div>
  );
}
