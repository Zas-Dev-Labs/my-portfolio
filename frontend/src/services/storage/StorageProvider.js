/**
 * StorageProvider Interface
 * Base contract for storage adapters (LocalStorage, Firestore, Supabase, etc.)
 */
export class StorageProvider {
  async getInvoices() {
    throw new Error('getInvoices not implemented');
  }

  async getInvoice(id) {
    throw new Error('getInvoice not implemented');
  }

  async saveInvoice(invoice) {
    throw new Error('saveInvoice not implemented');
  }

  async deleteInvoice(id) {
    throw new Error('deleteInvoice not implemented');
  }

  async getClients() {
    throw new Error('getClients not implemented');
  }

  async saveClient(client) {
    throw new Error('saveClient not implemented');
  }

  async deleteClient(id) {
    throw new Error('deleteClient not implemented');
  }

  async getBusinessProfile() {
    throw new Error('getBusinessProfile not implemented');
  }

  async saveBusinessProfile(profile) {
    throw new Error('saveBusinessProfile not implemented');
  }

  async exportAllData() {
    throw new Error('exportAllData not implemented');
  }

  async importAllData(jsonData) {
    throw new Error('importAllData not implemented');
  }
}
