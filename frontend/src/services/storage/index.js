import { LocalStorageProvider, DEFAULT_BUSINESS_PROFILE } from './LocalStorageProvider';
import { FirestoreStorageProvider } from './FirestoreStorageProvider';
import { SupabaseStorageProvider, SUPABASE_SQL_SCHEMA } from './SupabaseStorageProvider';

// Initialize singleton providers
export const localProvider = new LocalStorageProvider();
export const firestoreProvider = new FirestoreStorageProvider(localProvider);

// Active provider instance (can be switched at runtime via StorageSettingsModal)
let currentProviderType = (() => {
  try {
    const saved = localStorage.getItem('zdl_storage_type');
    return saved || 'firestore';
  } catch (e) {
    return 'firestore';
  }
})(); // 'firestore' | 'local' | 'supabase'

let activeSupabaseProvider = null;

export function getStorageProvider() {
  if (currentProviderType === 'firestore') {
    return firestoreProvider;
  }
  if (currentProviderType === 'supabase' && activeSupabaseProvider) {
    return activeSupabaseProvider;
  }
  return localProvider;
}

export function setStorageProvider(type, config = {}) {
  currentProviderType = type;
  try {
    localStorage.setItem('zdl_storage_type', type);
  } catch (e) {}
  if (type === 'supabase') {
    activeSupabaseProvider = new SupabaseStorageProvider(config);
  }
  return getStorageProvider();
}

export function getCurrentStorageType() {
  return currentProviderType;
}

export {
  DEFAULT_BUSINESS_PROFILE,
  SUPABASE_SQL_SCHEMA
};
