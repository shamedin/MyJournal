// PWA utilities for service worker registration and offline management

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: InstallPromptEvent | null = null;
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

// Register service worker
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });

    console.log('[PWA] Service worker registered:', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update().catch((err) => {
        console.log('[PWA] Update check failed:', err);
      });
    }, 60000); // Check every minute

    return registration;
  } catch (error) {
    console.error('[PWA] Service worker registration failed:', error);
  }
}

// Handle install prompt
export function setupInstallPrompt(callback?: (prompt: InstallPromptEvent) => void) {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent the default mini-infobar from showing
    e.preventDefault();

    // Store the event for later use
    deferredPrompt = e as InstallPromptEvent;

    console.log('[PWA] Install prompt available');

    // Call callback if provided
    if (callback) {
      callback(deferredPrompt);
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed');
    deferredPrompt = null;
  });
}

// Show install prompt
export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.log('[PWA] No install prompt available');
    return false;
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[PWA] User response to install prompt: ${outcome}`);

    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('[PWA] Install prompt error:', error);
    return false;
  }
}

// Check if install prompt is available
export function isInstallPromptAvailable() {
  return deferredPrompt !== null;
}

// Setup online/offline listeners
export function setupOnlineStatusListener(callback?: (isOnline: boolean) => void) {
  if (typeof window === 'undefined') return;

  const updateOnlineStatus = () => {
    isOnline = navigator.onLine;
    console.log(`[PWA] Online status: ${isOnline}`);

    if (callback) {
      callback(isOnline);
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  return updateOnlineStatus;
}

// Get current online status
export function getOnlineStatus() {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

// Unregister service worker (for debugging)
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      await registration.unregister();
      console.log('[PWA] Service worker unregistered');
    }
  } catch (error) {
    console.error('[PWA] Failed to unregister service worker:', error);
  }
}

// Clear all caches (for debugging)
export async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log(`[PWA] Cleared cache: ${cacheName}`);
    }
  } catch (error) {
    console.error('[PWA] Failed to clear caches:', error);
  }
}

// Get cache information
export async function getCacheInfo() {
  try {
    const cacheNames = await caches.keys();
    const cacheInfo: Record<string, number> = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      cacheInfo[cacheName] = keys.length;
    }

    return cacheInfo;
  } catch (error) {
    console.error('[PWA] Failed to get cache info:', error);
    return {};
  }
}
