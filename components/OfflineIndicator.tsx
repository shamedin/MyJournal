'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setupOnlineStatusListener } from '@/lib/pwa-utils';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const unsubscribe = setupOnlineStatusListener((online) => {
      setIsOnline(online);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!mounted) return null;

  if (isOnline) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Wifi className="w-3 h-3" />
        <span>Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium">
      <WifiOff className="w-3 h-3" />
      <span>Offline - Using cached data</span>
    </div>
  );
}

export function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!mounted || !canInstall) return null;

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
        <Check className="w-3 h-3" />
        <span>App installed</span>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 text-xs h-7 px-2"
      onClick={async () => {
        // Trigger install prompt
        const event = new Event('beforeinstallprompt') as any;
        window.dispatchEvent(event);
      }}
    >
      <Download className="w-3 h-3" />
      <span>Install App</span>
    </Button>
  );
}
