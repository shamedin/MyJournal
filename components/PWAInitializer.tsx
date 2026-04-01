'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa-utils';

export function PWAInitializer() {
  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker();
  }, []);

  return null;
}
