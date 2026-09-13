import React from 'react';
import { Plus, Trash2, Copy, Layers } from 'lucide-react';

export default function InvoiceLineItems({
  items = [],
  currencySymbol = '$',
  isFinalized = false,
  onUpdateItems
}) {
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

  const handleAddItem = () => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
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
      // Keep at least one empty row
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
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers size={14} className="text-primary" />
          <span>Line Items & Deliverables</span>
        </label>
        <span className="text-xs text-gray-400 font-mono">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-white/10 rounded-xl bg-surface-container/50">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container text-gray-400 font-medium">
              <th className="py-2.5 px-3 w-3/4">Description / Scope</th>
              <th className="py-2.5 px-2 w-1/4 text-right">Amount ({currencySymbol})</th>
              <th className="py-2.5 px-2 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item, index) => {
              const price = parseFloat(item.unitPrice) || 0;

              return (
                <tr key={item.id || index} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      disabled={isFinalized}
                      placeholder="Service name, milestone, or deliverable..."
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary disabled:opacity-50"
                    />
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-2.5">
        {items.map((item, index) => {
          const price = parseFloat(item.unitPrice) || 0;

          return (
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

              <input
                type="text"
                disabled={isFinalized}
                placeholder="Description / scope of work"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary disabled:opacity-50"
              />

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Amount ({currencySymbol})</label>
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
          );
        })}
      </div>

      <button
        type="button"
        disabled={isFinalized}
        onClick={handleAddItem}
        className="w-full py-2.5 px-3 border border-dashed border-white/20 hover:border-primary/60 rounded-xl text-xs text-gray-300 hover:text-primary flex items-center justify-center gap-1.5 transition-colors bg-surface/40 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={14} />
        <span>Add Line Item</span>
      </button>
    </div>
  );
}
