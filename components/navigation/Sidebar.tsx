'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Moon, Sun, BookOpen, BarChart3, History, Combine, TrendingUp, Library, Menu, X } from 'lucide-react';

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
    { href: '/', label: 'Home', icon: BookOpen },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard', icon: TrendingUp },
    { href: '/statistics', label: 'Statistics', icon: BarChart3 },
    { href: '/setups', label: 'Setups', icon: Library },
    { href: '/history', label: 'History', icon: History },
    { href: '/pdf-merger', label: 'PDF Merger', icon: Combine },
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

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-sidebar-primary to-sidebar-accent text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between pt-6 border-t border-sidebar-border/50">
          <span className="text-sm text-sidebar-foreground/60">Theme</span>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-lg hover:bg-sidebar-accent/30"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-sidebar-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-sidebar-foreground" />
              )}
            </Button>
          )}
        </div>
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
          <div className="flex items-center gap-1">
            {mounted && (
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
          <nav className="border-t border-border bg-card/60 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
                      : 'text-foreground/70 hover:text-foreground hover:bg-accent/20'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </header>
    </>
  );
}
