'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Moon, Sun, BookOpen, BarChart3, History, Combine, TrendingUp, Library, Menu, X } from 'lucide-react';

// Dynamically import components that need language context with ssr disabled
const LanguageControls = dynamic(
  () => import('./LanguageControls').then(mod => mod.LanguageControls),
  { ssr: false }
);

const DesktopLanguageSelector = dynamic(
  () => import('./LanguageControls').then(mod => mod.DesktopLanguageSelector),
  { ssr: false }
);

const SidebarNav = dynamic(
  () => import('./SidebarContent').then(mod => mod.SidebarNav),
  { ssr: false }
);

const SidebarMobileNav = dynamic(
  () => import('./SidebarContent').then(mod => mod.SidebarMobileNav),
  { ssr: false }
);

export function Sidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem('theme');
    const isDarkMode = theme === 'dark';
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newIsDark = !isDark;
    
    if (newIsDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDark(newIsDark);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:bg-sidebar lg:border-r lg:border-sidebar-border lg:p-6 lg:flex lg:flex-col lg:gap-8 lg:pt-6 lg:shadow-xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sidebar-primary to-accent flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <span className="text-sidebar-foreground text-lg font-bold">TradeLog</span>
        </Link>

        {/* Navigation */}
        <SidebarNav 
          isActive={isActive} 
          isDark={isDark} 
          toggleDarkMode={toggleDarkMode} 
          mounted={mounted}
          LanguageControls={LanguageControls}
          DesktopLanguageSelector={DesktopLanguageSelector}
        />
      </aside>

      {/* Mobile/Tablet Header */}
      <header className="lg:hidden sticky top-0 z-50 border-b border-border bg-gradient-to-r from-background via-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground font-bold">TradeLog</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-0">
            {mounted && (
              <>
                <LanguageControls />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="rounded-lg hover:bg-primary/20 w-12 h-12 flex items-center justify-center transition-all"
                >
                  {isDark ? (
                    <Sun className="w-6 h-6 text-primary font-bold" />
                  ) : (
                    <Moon className="w-6 h-6 text-primary font-bold" />
                  )}
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg hover:bg-primary/20 w-12 h-12 flex items-center justify-center transition-all duration-200"
            >
              {sidebarOpen ? (
                <X className="w-7 h-7 text-primary font-bold" />
              ) : (
                <Menu className="w-7 h-7 text-primary font-bold" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        {sidebarOpen && (
          <div className="border-t border-border bg-card/60 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
            <SidebarMobileNav navItems={navItems} isActive={isActive} />
          </div>
        )}
      </header>
    </>
  );
}
