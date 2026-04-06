'use client';

import React from 'react';
import Link from 'next/link';
import { usePathage } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';
import { BookOpen, BarChart3, History, Combine, TrendingUp, Library } from 'lucide-react';

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
}

export function SidebarNav({ isActive, isDark, toggleDarkMode, mounted, LanguageControls, DesktopLanguageSelector }: any) {
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    { href: '/', labelKey: 'nav.home', icon: <BookOpen className="w-5 h-5 flex-shrink-0" /> },
    { href: '/journal', labelKey: 'nav.journal', icon: <BookOpen className="w-5 h-5 flex-shrink-0" /> },
    { href: '/dashboard', labelKey: 'nav.dashboard', icon: <TrendingUp className="w-5 h-5 flex-shrink-0" /> },
    { href: '/statistics', labelKey: 'nav.statistics', icon: <BarChart3 className="w-5 h-5 flex-shrink-0" /> },
    { href: '/setups', labelKey: 'sidebar.setups', icon: <Library className="w-5 h-5 flex-shrink-0" /> },
    { href: '/history', labelKey: 'nav.history', icon: <History className="w-5 h-5 flex-shrink-0" /> },
    { href: '/pdf-merger', labelKey: 'nav.pdfMerger', icon: <Combine className="w-5 h-5 flex-shrink-0" /> },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-sidebar-primary to-sidebar-accent text-sidebar-primary-foreground shadow-lg'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
            }`}
          >
            {item.icon}
            <span>{t(item.labelKey)}</span>
          </Link>
        ))}
      </nav>

      {/* Settings Section */}
      <div className="space-y-4 pt-6 border-t border-sidebar-border/50">
        <DesktopLanguageSelector />
        <div className="flex items-center justify-between px-4">
          <span className="text-sm text-sidebar-foreground/60">{t('settings.theme')}</span>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-lg hover:bg-sidebar-accent/30"
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export function SidebarMobileNav({ navItems, isActive }: any) {
  const { t } = useLanguage();

  return (
    <nav className="space-y-2">
      {navItems.map((item: NavItem) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
            isActive(item.href)
              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
              : 'text-foreground/70 hover:text-foreground hover:bg-accent/20'
          }`}
        >
          {item.icon}
          <span>{t(item.labelKey)}</span>
        </Link>
      ))}
    </nav>
  );
}
