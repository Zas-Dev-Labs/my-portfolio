import React from 'react';
import InvoiceAuthGate from './InvoiceAuthGate';
import InvoiceWorkspace from './InvoiceWorkspace';

/**
 * Locked Administrative Invoice Generator Entry Point
 * Mounts under /tools/invoice, /admin/invoices, and /invoices
 */
export default function InvoiceApp() {
  return (
    <InvoiceAuthGate>
      <InvoiceWorkspace />
    </InvoiceAuthGate>
  );
}
