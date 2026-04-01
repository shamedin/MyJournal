'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Brain, Lightbulb } from 'lucide-react';
import { getTradesFromStorage } from '@/lib/storage';

export default function Home() {
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    const trades = getTradesFromStorage();
    setJournalCount(trades.length);
  }, []);

  const teachings = [
    {
      title: 'Risk Management is Everything',
      content: 'The most successful traders are not those who win the most trades, but those who manage risk effectively. Never risk more than 1-2% of your account on a single trade. This discipline ensures that even a series of losses won\'t wipe out your account. The traders who survive and thrive in forex understand that preserving capital is more important than chasing profits. Risk management is not a limitation; it is your foundation for long-term success.',
      author: 'Forex Trading Wisdom',
    },
    {
      title: 'Master Your Trading Psychology',
      content: 'Forex trading is 90% psychology and 10% strategy. Fear and greed are the twin enemies of profitable trading. Fear makes you exit winning trades too early; greed makes you hold losing trades too long. Learn to observe your emotions without letting them control your decisions. Keep a trading journal, document your trades, and analyze your emotional patterns. The trader who masters their mind will master the markets.',
      author: 'Trading Psychology Mastery',
    },
    {
      title: 'The Power of Your Trading Plan',
      content: 'A trading plan is your roadmap to success. Before you enter any trade, know exactly where you will enter, where you will exit with profit, and where you will cut losses. Never deviate from your plan because of emotions or market noise. Your plan is the result of careful analysis and risk assessment. Those who trade without a plan are gambling; those with plans are investing intelligently. Consistency in following your plan is what separates winners from losers.',
      author: 'Trading Strategy Principles',
    },
    {
      title: 'Learn from Every Trade',
      content: 'Both winning and losing trades are lessons, not outcomes. Every trade you make teaches you something about the market and about yourself. Keep detailed records of your trades, including entry reasons, exit decisions, and emotional state. Review your journal regularly to identify patterns and areas for improvement. The traders who improve fastest are those who treat every trade as data for learning, not as a win or loss to celebrate or regret. Your journal is your path to continuous improvement.',
      author: 'Continuous Trading Improvement',
    },
  ];

  const motivations = [
    {
      quote: 'In forex, there is no finish line. Success is a continuous journey of learning and adaptation.',
      insight: 'The best traders never stop learning. Markets evolve, and so must you.',
    },
    {
      quote: 'The money you make in trading is earned through your discipline, not through luck.',
      insight: 'Every profitable trader followed a plan, managed risk, and remained emotionally disciplined.',
    },
    {
      quote: 'Your losing trades are tuition payments to the market. Pay them wisely and learn the lessons.',
      insight: 'Losses are not failures; they are the cost of education in becoming a better trader.',
    },
    {
      quote: 'Patience in forex is not about waiting. It is about executing your plan perfectly when the setup appears.',
      insight: 'The best traders miss 95% of trades because they are waiting for the perfect setup.',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Daily Motivation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Daily Wisdom & Motivation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {motivations.map((item, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <p className="text-lg font-semibold text-primary italic mb-4">&quot;{item.quote}&quot;</p>
                <p className="text-muted-foreground">{item.insight}</p>
              </Card>
            ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/journal">
              <Card className="p-8 h-full hover:shadow-lg transition-all cursor-pointer group">
                <BookOpen className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Trade Journal</h3>
                <p className="text-muted-foreground mb-4">Document every trade with entry, exit, setup, and emotional notes. Your journal is the foundation for analyzing patterns and improving your trading strategy.</p>
                <p className="text-primary font-semibold">Start Logging Trades →</p>
              </Card>
            </Link>
            <Link href="/statistics">
              <Card className="p-8 h-full hover:shadow-lg transition-all cursor-pointer group">
                <Brain className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Performance Analysis</h3>
                <p className="text-muted-foreground mb-4">Analyze your win rate, profit factor, and trading statistics. Understanding your performance metrics reveals your edge and areas for improvement.</p>
                <p className="text-primary font-semibold">View Your Stats →</p>
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
