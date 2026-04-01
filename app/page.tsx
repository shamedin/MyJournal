'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, BarChart3, Download, TrendingUp, Combine } from 'lucide-react';
import { getTradesFromStorage } from '@/lib/storage';
import { calculateStatistics } from '@/lib/calculations';

export default function Home() {
  const [stats, setStats] = useState({ totalTrades: 0, winRate: 0, totalProfit: 0 });

  useEffect(() => {
    const trades = getTradesFromStorage();
    const stats = calculateStatistics(trades);
    setStats({
      totalTrades: stats.totalTrades,
      winRate: stats.winRate,
      totalProfit: stats.totalProfit,
    });
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: 'Trade Journal',
      description: 'Log your trades with detailed information including charts, emotions, and notes.',
      href: '/journal',
    },
    {
      icon: BarChart3,
      title: 'Statistics',
      description: 'Analyze your trading performance with comprehensive charts and metrics.',
      href: '/statistics',
    },
    {
      icon: Download,
      title: 'Export',
      description: 'Export your trades as PDF or Excel for backup and analysis.',
      href: '/journal',
    },
    {
      icon: Combine,
      title: 'PDF Merger',
      description: 'Merge multiple PDFs, reorder pages, and export as a single document.',
      href: '/pdf-merger',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-balance">
            Professional Trading Journal
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Track, analyze, and improve your trading with a powerful, minimal trading journal. Keep records of every trade, review your psychology, and optimize your strategy.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/journal">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Start Journaling
              </Button>
            </Link>
            <Link href="/statistics">
              <Button size="lg" variant="outline" className="gap-2">
                <BarChart3 className="w-5 h-5" />
                View Statistics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats.totalTrades > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Your Trading Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium">Total Trades</p>
                <p className="text-4xl font-bold mt-2">{stats.totalTrades}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium">Win Rate</p>
                <p className="text-4xl font-bold mt-2 text-green-600">{stats.winRate.toFixed(1)}%</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium">Total P&L</p>
                <p className={`text-4xl font-bold mt-2 ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stats.totalProfit.toFixed(2)}
                </p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to become a better trader</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link key={idx} href={feature.href}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground rounded-lg mx-4 mb-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Improve Your Trading?</h2>
          <p className="text-lg opacity-90">
            Start tracking your trades today and gain the insights you need to become a consistently profitable trader.
          </p>
          <Link href="/journal">
            <Button size="lg" variant="secondary" className="gap-2">
              <BookOpen className="w-5 h-5" />
              Begin Your Journal
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>TradeLog - A professional trading journal for serious traders</p>
          <p className="mt-2">All data is stored locally in your browser. No server storage.</p>
        </div>
      </footer>
    </main>
  );
}
