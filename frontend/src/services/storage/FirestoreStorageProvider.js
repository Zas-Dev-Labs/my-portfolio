import { StorageProvider } from './StorageProvider';
import { db } from '../../firebase';
import { getCollectionName } from '../environment';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

export class FirestoreStorageProvider extends StorageProvider {
  constructor(fallbackProvider) {
    super();
    this.fallback = fallbackProvider;
  }

  async getInvoices() {
    try {
      if (!db) return await this.fallback.getInvoices();
      const colName = getCollectionName('invoices');
      const colRef = collection(db, colName);
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return await this.fallback.getInvoices();
      }
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn('Firestore getInvoices fallback to local storage:', err.message);
      return await this.fallback.getInvoices();
    }
  }

  async getInvoice(id) {
    try {
      if (!db) return await this.fallback.getInvoice(id);
      const colName = getCollectionName('invoices');
      const docRef = doc(db, colName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
      return await this.fallback.getInvoice(id);
    } catch (err) {
      return await this.fallback.getInvoice(id);
    }
  }

  async saveInvoice(invoice) {
    // Always save locally first for guaranteed zero-latency / offline safety
    const localSaved = await this.fallback.saveInvoice(invoice);
    try {
      if (db) {
        const colName = getCollectionName('invoices');
        const docRef = doc(db, colName, localSaved.id);
        await setDoc(docRef, localSaved, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore sync postponed or unauthenticated, saved to local cache:', err.message);
    }
    return localSaved;
  }

  async deleteInvoice(id) {
    await this.fallback.deleteInvoice(id);
    try {
      if (db) {
        const colName = getCollectionName('invoices');
        await deleteDoc(doc(db, colName, id));
      }
    } catch (err) {
      console.warn('Firestore delete failed, cleaned locally:', err.message);
    }
    return true;
  }

  async getClients() {
    try {
      if (!db) return await this.fallback.getClients();
      const colName = getCollectionName('clients');
      const colRef = collection(db, colName);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        return await this.fallback.getClients();
      }
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      return await this.fallback.getClients();
    }
  }

  async saveClient(client) {
    const localSaved = await this.fallback.saveClient(client);
    try {
      if (db) {
        const colName = getCollectionName('clients');
        const docRef = doc(db, colName, localSaved.id);
        await setDoc(docRef, localSaved, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore client save deferred:', err.message);
    }
    return localSaved;
  }

  async deleteClient(id) {
    await this.fallback.deleteClient(id);
    try {
      if (db) {
        const colName = getCollectionName('clients');
        await deleteDoc(doc(db, colName, id));
      }
    } catch (err) {}
    return true;
  }

  async getBusinessProfile() {
    try {
      if (!db) return await this.fallback.getBusinessProfile();
      const colName = getCollectionName('settings');
      const docRef = doc(db, colName, 'business_profile');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data();
      }
      return await this.fallback.getBusinessProfile();
    } catch (err) {
      return await this.fallback.getBusinessProfile();
    }
  }

  async saveBusinessProfile(profile) {
    const localSaved = await this.fallback.saveBusinessProfile(profile);
    try {
      if (db) {
        const colName = getCollectionName('settings');
        const docRef = doc(db, colName, 'business_profile');
        await setDoc(docRef, profile, { merge: true });
      }
    } catch (err) {}
    return localSaved;
  }

  async exportAllData() {
    return await this.fallback.exportAllData();
  }

  async importAllData(jsonData) {
    return await this.fallback.importAllData(jsonData);
  }
}
