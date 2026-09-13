/**
 * ZasDevLabs Environment & Firebase Configuration Service
 * 
 * Manages dual environment separation between:
 * 1. Development & Preview (localhost, ais-dev-*, ais-pre-*, *.run.app)
 * 2. Live Production (zasdevlabs.tech, www.zasdevlabs.tech)
 * 
 * Provides dynamic collection routing and database instance mapping so that
 * development tests and shared previews never overwrite or pollute live data.
 */

const STORAGE_KEY = 'zasdevlabs_env_mode';

// Detect default environment based on hostname or environment variables
export function detectDefaultEnvironment() {
  if (typeof window === 'undefined') {
    return process.env.ENV === 'production' ? 'live' : 'preview';
  }

  const hostname = (window.location.hostname || '').toLowerCase();

  // Explicit Live domains
  if (
    hostname === 'zasdevlabs.tech' ||
    hostname.endsWith('.zasdevlabs.tech') ||
    process.env.ENV === 'production' ||
    process.env.FIREBASE_ENV === 'live'
  ) {
    return 'live';
  }

  // Preview / Development environments:
  // - localhost / 127.0.0.1
  // - ais-dev-*.run.app
  // - ais-pre-*.run.app
  // - cloud run preview URLs
  return 'preview';
}

// Get the active environment mode ('live' or 'preview')
export function getActiveEnvironment() {
  if (typeof window !== 'undefined') {
    const override = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (override === 'live' || override === 'preview') {
      return override;
    }
  }
  return detectDefaultEnvironment();
}

// Check if current active environment is Live
export function isLiveEnvironment() {
  return getActiveEnvironment() === 'live';
}

// Check if current active environment is Dev / Preview
export function isPreviewEnvironment() {
  return getActiveEnvironment() === 'preview';
}

// Set manual environment override (or reset to 'auto')
export function setEnvironmentMode(mode) {
  if (typeof window === 'undefined') return;

  if (mode === 'auto') {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } else if (mode === 'live' || mode === 'preview') {
    sessionStorage.setItem(STORAGE_KEY, mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }

  // Notify listeners of environment change
  window.dispatchEvent(new CustomEvent('zasdevlabs:env-change', {
    detail: {
      mode: getActiveEnvironment(),
      isLive: isLiveEnvironment(),
      isManualOverride: isManualEnvironmentOverride()
    }
  }));
}

// Check if environment is currently overridden manually
export function isManualEnvironmentOverride() {
  if (typeof window === 'undefined') return false;
  const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  return stored === 'live' || stored === 'preview';
}

/**
 * Maps a base collection name to the active environment collection name.
 * 
 * In Live Mode:
 *   'invoices'  -> 'invoices'
 *   'clients'   -> 'clients'
 *   'settings'  -> 'settings'
 *   'projects'  -> 'projects'
 * 
 * In Dev / Preview Mode:
 *   'invoices'  -> 'dev_invoices'
 *   'clients'   -> 'dev_clients'
 *   'settings'  -> 'dev_settings'
 *   'projects'  -> 'dev_projects'
 */
export function getCollectionName(baseCollection) {
  const env = getActiveEnvironment();
  if (env === 'live') {
    return baseCollection;
  }
  return `dev_${baseCollection}`;
}

// Get comprehensive info about active environment configuration
export function getEnvironmentMetadata() {
  const env = getActiveEnvironment();
  const detected = detectDefaultEnvironment();
  const isOverridden = isManualEnvironmentOverride();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'server';

  return {
    activeEnvironment: env,
    detectedEnvironment: detected,
    isManualOverride: isOverridden,
    isLive: env === 'live',
    isPreview: env === 'preview',
    hostname,
    label: env === 'live' ? 'Live Production' : 'Development & Preview',
    badgeText: env === 'live' ? 'Live DB' : 'Dev / Preview DB',
    accentColor: env === 'live' ? '#10B981' : '#F59E0B',
    domainNote: env === 'live' ? 'zasdevlabs.tech' : 'ais-dev / ais-pre / localhost',
    collections: {
      invoices: getCollectionName('invoices'),
      clients: getCollectionName('clients'),
      settings: getCollectionName('settings'),
      projects: getCollectionName('projects')
    }
  };
}

// Helper hook / subscription for environment changes
export function subscribeEnvironmentChanges(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (event) => {
    callback(event.detail || getEnvironmentMetadata());
  };

  window.addEventListener('zasdevlabs:env-change', handler);
  return () => window.removeEventListener('zasdevlabs:env-change', handler);
}
