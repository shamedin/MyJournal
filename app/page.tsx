'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Brain, Lightbulb, TrendingUp, Library } from 'lucide-react';
import { getTradesFromStorage } from '@/lib/storage';
import { useLanguage } from '@/lib/language-context';

export default function Home() {
  const { t, language } = useLanguage();
  const [journalCount, setJournalCount] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentMotivationIndex, setCurrentMotivationIndex] = useState(0);

  // Get translated motivations
  const getMotivations = () => {
    const motivationKeys = [
      { quote: 'motivations.quote1', author: 'motivations.author1' },
      { quote: 'motivations.quote2', author: 'motivations.author2' },
      { quote: 'motivations.quote3', author: 'motivations.author3' },
      { quote: 'motivations.quote4', author: 'motivations.author4' },
      { quote: 'motivations.quote5', author: 'motivations.author5' },
      { quote: 'motivations.quote6', author: 'motivations.author6' },
      { quote: 'motivations.quote7', author: 'motivations.author7' },
      { quote: 'motivations.quote8', author: 'motivations.author8' },
      { quote: 'motivations.quote9', author: 'motivations.author9' },
      { quote: 'motivations.quote10', author: 'motivations.author10' },
    ];
    return motivationKeys.map(m => ({
      quote: t(m.quote),
      author: t(m.author),
      category: t('home.mindsetTitle'),
    }));
  };

  // Get translated teachings
  const getTeachings = () => {
    return [
      {
        title: t('teachings.riskManagement'),
        content: t('teachings.riskManagementContent'),
        author: t('teachings.author1'),
      },
      {
        title: t('teachings.tradingPlan'),
        content: t('teachings.tradingPlanContent'),
        author: t('teachings.author2'),
      },
      {
        title: t('teachings.learnTrade'),
        content: t('teachings.learnTradeContent'),
        author: t('teachings.author3'),
      },
    ];
  };

  const teachings = getTeachings();
  const motivations = getMotivations();

  useEffect(() => {
    const trades = getTradesFromStorage();
    setJournalCount(trades.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivations.length);
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Rotating Quote Section - Changes Every 10 Seconds */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-3 animate-in fade-in duration-500">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">{motivations[currentQuoteIndex].category}</p>
            <p className="text-xl lg:text-2xl font-bold text-balance leading-tight">
              "{motivations[currentQuoteIndex].quote}"
            </p>
            <p className="text-sm text-muted-foreground">
              — {motivations[currentQuoteIndex].author}
            </p>
          </div>
        </div>
      </section>

      {/* Daily Motivation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.motivationTitle')}</h2>
          <div className="space-y-6">
            {/* Motivation Display */}
            <Card className="p-8 md:p-10 border-l-4 border-l-primary min-h-64 flex flex-col justify-center">
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-semibold text-primary italic leading-relaxed text-center">
                  &quot;{motivations[currentMotivationIndex].quote}&quot;
                </p>
                <p className="text-lg text-muted-foreground text-center font-medium">
                  — {motivations[currentMotivationIndex].author}
                </p>
                <p className="text-xs text-primary uppercase tracking-widest text-center font-bold">
                  {motivations[currentMotivationIndex].category}
                </p>
              </div>
            </Card>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={() => setCurrentMotivationIndex((prev) => prev === 0 ? motivations.length - 1 : prev - 1)}
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                ← {t('home.previous')}
              </Button>
              
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {currentMotivationIndex + 1} {t('home.of')} {motivations.length}
                </p>
              </div>

              <Button
                onClick={() => setCurrentMotivationIndex((prev) => (prev + 1) % motivations.length)}
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                {t('home.next')} →
              </Button>
            </div>

            {/* Category Filter Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>{t('home.browseMotivations')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Psychological Teachings Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Trading Wisdom & Psychology</h2>
            <p className="text-lg text-muted-foreground">Essential teachings for becoming a consistently profitable forex trader</p>
          </div>

          <div className="space-y-8">
            {teachings.map((teaching, idx) => (
              <Card key={idx} className="p-8 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
            <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2">{teaching.title}</h3>
                      <p className="text-muted-foreground text-sm font-medium mb-3">{teaching.author}</p>
                      <p className="text-base leading-relaxed">{teaching.content}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Tracking */}
      {journalCount > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Your Trading Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-8 text-center bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <p className="text-muted-foreground text-sm font-semibold mb-2">TRADES LOGGED</p>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{journalCount}</p>
                <p className="text-muted-foreground text-sm mt-3">entries in your trading journal</p>
              </Card>
              <Card className="p-8 text-center bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <p className="text-muted-foreground text-sm font-semibold mb-2">DISCIPLINE</p>
                <p className="text-5xl font-bold text-green-600 dark:text-green-400">Building</p>
                <p className="text-muted-foreground text-sm mt-3">every trade makes you stronger</p>
              </Card>
              <Card className="p-8 text-center bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                <p className="text-muted-foreground text-sm font-semibold mb-2">TRADING EDGE</p>
                <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">Developing</p>
                <p className="text-muted-foreground text-sm mt-3">consistency creates profitability</p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Your Trading Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/journal">
              <Card className="p-8 h-full hover:shadow-lg transition-all cursor-pointer group">
                <BookOpen className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">Trade Journal</h3>
                <p className="text-sm text-muted-foreground">Document every trade with entry, exit, setup, and emotional notes.</p>
                <p className="text-xs text-primary font-semibold mt-3">View Journal →</p>
              </Card>
            </Link>
            <Link href="/dashboard">
              <Card className="p-8 h-full hover:shadow-lg transition-all cursor-pointer group">
                <TrendingUp className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">Dashboard</h3>
                <p className="text-sm text-muted-foreground">Track KPIs, win rate, profit factor, and detailed performance metrics.</p>
                <p className="text-xs text-primary font-semibold mt-3">View Dashboard →</p>
              </Card>
            </Link>
            <Link href="/setups">
              <Card className="p-8 h-full hover:shadow-lg transition-all cursor-pointer group">
                <Library className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">Setups Library</h3>
                <p className="text-sm text-muted-foreground">Save and organize your winning trading setups with performance tracking.</p>
                <p className="text-xs text-primary font-semibold mt-3">View Setups →</p>
              </Card>
            </Link>
            <Link href="/statistics">
              <Card className="p-8 h-full hover:shadow-lg transition-all cursor-pointer group">
                <Brain className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">Statistics</h3>
                <p className="text-sm text-muted-foreground">Analyze your win rate, profit factor, and trading statistics in detail.</p>
                <p className="text-xs text-primary font-semibold mt-3">View Stats →</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Inspiring Message Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Your Trading Success Starts Here</h2>
            <div className="space-y-3">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Profitable trading is not about luck or complex strategies. It&apos;s about consistency, discipline, and mastering your emotions.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every trade you log is data. Every loss is a lesson. Every win is validation of your system. Use this journal to build the trading discipline and psychological strength required to succeed in forex.
              </p>
              <p className="text-lg font-semibold text-primary leading-relaxed">
                Start today. Log your trades. Analyze your patterns. Master the forex markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/50">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-muted-foreground">My Journal - Your professional forex trading journal for consistent profitability</p>
          <p className="text-sm text-muted-foreground">Track trades, analyze patterns, master psychology. Your edge is in the data.</p>
          <p className="text-xs text-muted-foreground/75">Trade smart. Trade disciplined. Trade profitably.</p>
        </div>
      </footer>
    </main>
  );
}
