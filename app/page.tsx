'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, BarChart3, Brain, Flame, Target, Shield, Zap, Heart, RefreshCw, TrendingUp } from 'lucide-react';
import { getTradesFromStorage } from '@/lib/storage';
import { calculateStatistics } from '@/lib/calculations';

const motivationalQuotes = [
  {
    quote: "The market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett",
    category: "Patience"
  },
  {
    quote: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.",
    author: "George Soros",
    category: "Risk Management"
  },
  {
    quote: "The goal of a successful trader is to make the best trades. Money is secondary.",
    author: "Alexander Elder",
    category: "Process"
  },
  {
    quote: "Trading doesn't just reveal your character, it also builds it if you stay in the game long enough.",
    author: "Yvan Byeajee",
    category: "Growth"
  },
  {
    quote: "The most important quality for an investor is temperament, not intellect.",
    author: "Warren Buffett",
    category: "Psychology"
  },
  {
    quote: "Win or lose, everybody gets what they want out of the market.",
    author: "Ed Seykota",
    category: "Self-Awareness"
  }
];

const psychologicalInsights = [
  {
    icon: Brain,
    title: "Master Your Mind",
    content: "Your biggest enemy in trading is not the market—it's your own psychology. Fear and greed are the two emotions that destroy more accounts than any bad strategy ever could. Learn to observe your emotions without acting on them.",
  },
  {
    icon: Shield,
    title: "Protect Your Capital",
    content: "Capital preservation is the foundation of long-term success. A 50% loss requires a 100% gain to break even. Never risk more than you can afford to lose on any single trade. Live to trade another day.",
  },
  {
    icon: Target,
    title: "Focus on Process",
    content: "Winning traders focus on executing their plan, not on profits. When you focus on the process, the results take care of themselves. Judge yourself by how well you followed your rules, not by your P&L.",
  },
  {
    icon: RefreshCw,
    title: "Embrace Losses",
    content: "Losses are tuition fees for the market's education. Every successful trader has lost money. The difference is they learned from each loss and never made the same mistake twice. Losses are feedback, not failure.",
  },
];

const mentalStrengthPrinciples = [
  {
    title: "Discipline Over Motivation",
    description: "Motivation fades, but discipline endures. Build systems and habits that work even when you don't feel like trading. The best traders show up every day with the same routine, regardless of yesterday's results."
  },
  {
    title: "Detach From Outcomes",
    description: "You cannot control the market, only your actions. Execute your edge consistently and let probability work over time. A single trade means nothing—think in terms of 100 trades."
  },
  {
    title: "Patience Is Your Edge",
    description: "The best trades come to those who wait. Most traders overtrade because they can't stand being out of the market. Learn to sit on your hands. No trade is also a trade."
  },
  {
    title: "Continuous Improvement",
    description: "Review your trades daily. What worked? What didn't? The traders who journal and analyze their performance improve exponentially faster than those who don't."
  },
];

const dailyAffirmations = [
  "I am patient and wait for high-probability setups.",
  "I accept losses as part of the trading process.",
  "I follow my trading plan without exception.",
  "I am calm and composed regardless of market conditions.",
  "I take full responsibility for my trading results.",
  "I cut losses quickly and let winners run.",
  "I am committed to continuous improvement.",
  "I trade with discipline, not emotion.",
];

export default function Home() {
  const [stats, setStats] = useState({ totalTrades: 0, winRate: 0, totalProfit: 0 });
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  useEffect(() => {
    const trades = getTradesFromStorage();
    const stats = calculateStatistics(trades);
    setStats({
      totalTrades: stats.totalTrades,
      winRate: stats.winRate,
      totalProfit: stats.totalProfit,
    });

    // Rotate quotes every 10 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 10000);

    // Rotate affirmations every 8 seconds
    const affirmationInterval = setInterval(() => {
      setCurrentAffirmation((prev) => (prev + 1) % dailyAffirmations.length);
    }, 8000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(affirmationInterval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Quote */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Daily Wisdom</p>
            <blockquote className="text-2xl lg:text-3xl font-medium text-balance leading-relaxed">
              &ldquo;{motivationalQuotes[currentQuote].quote}&rdquo;
            </blockquote>
            <p className="text-muted-foreground">
              — {motivationalQuotes[currentQuote].author}
            </p>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {motivationalQuotes[currentQuote].category}
            </span>
          </div>
          
          <div className="flex gap-4 justify-center flex-wrap pt-4">
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

      {/* Daily Affirmation Banner */}
      <section className="py-6 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wider opacity-80 mb-2">Today&apos;s Affirmation</p>
          <p className="text-lg font-medium">{dailyAffirmations[currentAffirmation]}</p>
        </div>
      </section>

      {/* Stats Section */}
      {stats.totalTrades > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Your Trading Overview</h2>
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

      {/* Psychological Insights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Trading Psychology</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Master your mind to master the markets. Psychology accounts for 80% of trading success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {psychologicalInsights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <Card key={idx} className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{insight.content}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mental Strength Principles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Mental Strength Principles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Build the mental fortitude required for consistent profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentalStrengthPrinciples.map((principle, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{principle.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed pl-11">
                  {principle.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Speech Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card to-muted/50">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                <h2 className="text-2xl font-bold">Remember This</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">You are not your last trade.</strong> Whether it was a win or a loss, 
                  it does not define your worth as a trader or as a person. What defines you is your commitment to improvement, 
                  your discipline in following your plan, and your resilience in the face of adversity.
                </p>
                <p>
                  <strong className="text-foreground">The market will always be here tomorrow.</strong> There is no trade you must take today. 
                  If you&apos;re not in the right mental state, step away. If you&apos;re chasing losses, close your platform. 
                  Protect your capital and protect your mind. Both are finite resources.
                </p>
                <p>
                  <strong className="text-foreground">Every expert was once a beginner.</strong> The traders you admire have all blown accounts, 
                  made terrible decisions, and questioned everything. The difference is they kept going. They treated every setback as setup for a comeback.
                </p>
                <p>
                  <strong className="text-foreground">Your edge is consistency.</strong> Not in winning every trade, but in showing up every day 
                  with the same process, the same discipline, and the same commitment to excellence. That&apos;s what separates professionals from amateurs.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/journal">
              <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">Journal</p>
              </Card>
            </Link>
            <Link href="/statistics">
              <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">Statistics</p>
              </Card>
            </Link>
            <Link href="/history">
              <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">History</p>
              </Card>
            </Link>
            <Link href="/pdf-merger">
              <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">PDF Merger</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Heart className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="text-3xl font-bold">Trust the Process</h2>
          <p className="text-muted-foreground text-lg">
            Success in trading is not about being right. It&apos;s about managing risk, controlling emotions, 
            and executing your plan with precision. Journal every trade, learn from every loss, and celebrate every improvement.
          </p>
          <Link href="/journal">
            <Button size="lg" className="gap-2">
              <BookOpen className="w-5 h-5" />
              Begin Your Journey
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
