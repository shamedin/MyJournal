'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Moon, Sun, BookOpen, BarChart3, History, Combine, TrendingUp, Library, FileText, Calendar } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dark mode is already set
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
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
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/history', label: 'History', icon: History },
    { href: '/pdf-merger', label: 'PDF Merger', icon: Combine },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="w-6 h-6" />
            <span>TradeLog</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-lg"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden pb-4 flex gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors text-sm ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
