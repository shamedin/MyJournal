'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Brain, Lightbulb, TrendingUp, Library } from 'lucide-react';
import { getTradesFromStorage } from '@/lib/storage';

export default function Home() {
  const [journalCount, setJournalCount] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentMotivationIndex, setCurrentMotivationIndex] = useState(0);

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
      quote: 'The goal of a successful trader is to make the best trades. Money is secondary.',
      author: 'Alexander Elder',
      category: 'Trading Mindset & Discipline',
    },
    {
      quote: 'Risk comes from not knowing what you\'re doing.',
      author: 'Warren Buffett',
      category: 'Trading Mindset & Discipline',
    },
    {
      quote: 'It\'s not whether you\'re right or wrong, but how much you make when you\'re right and how much you lose when you\'re wrong.',
      author: 'George Soros',
      category: 'Trading Mindset & Discipline',
    },
    {
      quote: 'Amateurs think about how much money they can make. Professionals think about how much money they could lose.',
      author: 'Jack Schwager',
      category: 'Trading Mindset & Discipline',
    },
    {
      quote: 'The market is a device for transferring money from the impatient to the patient.',
      author: 'Warren Buffett',
      category: 'Trading Mindset & Discipline',
    },
    {
      quote: 'Trading doesn\'t just reveal your character, it also builds it.',
      author: 'Yvan Byeajee',
      category: 'Psychology & Emotions',
    },
    {
      quote: 'The biggest risk is not taking any risk.',
      author: 'Mark Zuckerberg',
      category: 'Psychology & Emotions',
    },
    {
      quote: 'Control your emotions or they will control you.',
      author: 'Alexander Elder',
      category: 'Psychology & Emotions',
    },
    {
      quote: 'Fear and greed are stronger than long-term resolve.',
      author: 'Peter Bernstein',
      category: 'Psychology & Emotions',
    },
    {
      quote: 'You must be able to accept losses calmly.',
      author: 'Van K. Tharp',
      category: 'Psychology & Emotions',
    },
    {
      quote: 'If you can\'t take a small loss, sooner or later you will take the mother of all losses.',
      author: 'Ed Seykota',
      category: 'Risk Management',
    },
    {
      quote: 'The most important rule of trading is to play great defense.',
      author: 'Paul Tudor Jones',
      category: 'Risk Management',
    },
    {
      quote: 'Never risk more than you can afford to lose.',
      author: 'Larry Hite',
      category: 'Risk Management',
    },
    {
      quote: 'Losers average losers.',
      author: 'Paul Tudor Jones',
      category: 'Risk Management',
    },
    {
      quote: 'Cut your losses short and let your profits run.',
      author: 'David Ricardo',
      category: 'Risk Management',
    },
    {
      quote: 'Trade what you see, not what you think.',
      author: 'Doug Gregory',
      category: 'Strategy & Edge',
    },
    {
      quote: 'The trend is your friend.',
      author: 'Martin Zweig',
      category: 'Strategy & Edge',
    },
    {
      quote: 'Markets are never wrong—opinions often are.',
      author: 'Jesse Livermore',
      category: 'Strategy & Edge',
    },
    {
      quote: 'I never try to predict the market.',
      author: 'George Soros',
      category: 'Strategy & Edge',
    },
    {
      quote: 'Successful trading is always an emotional battle.',
      author: 'Jesse Livermore',
      category: 'Strategy & Edge',
    },
    {
      quote: 'Patience is not the ability to wait, but how you act while waiting.',
      author: 'Joyce Meyer',
      category: 'Consistency & Patience',
    },
    {
      quote: 'There is a time to go long, a time to go short, and a time to go fishing.',
      author: 'Jesse Livermore',
      category: 'Consistency & Patience',
    },
    {
      quote: 'You don\'t need to trade every day.',
      author: 'Unknown Trader',
      category: 'Consistency & Patience',
    },
    {
      quote: 'Good trading is boring.',
      author: 'George Soros',
      category: 'Consistency & Patience',
    },
    {
      quote: 'Wait for the right setup. That\'s where the money is.',
      author: 'Michael Marcus',
      category: 'Consistency & Patience',
    },
    {
      quote: 'Every trader has strengths and weaknesses.',
      author: 'Larry Hite',
      category: 'Learning & Growth',
    },
    {
      quote: 'Learn to take losses. The most important thing in making money is not letting your losses get out of hand.',
      author: 'Marty Schwartz',
      category: 'Learning & Growth',
    },
    {
      quote: 'The hard work in trading comes in the preparation.',
      author: 'Jack Schwager',
      category: 'Learning & Growth',
    },
    {
      quote: 'A good trader knows when not to trade.',
      author: 'Unknown Trader',
      category: 'Learning & Growth',
    },
    {
      quote: 'The market teaches humility.',
      author: 'Unknown Trader',
      category: 'Learning & Growth',
    },
    {
      quote: 'Hope is not a strategy.',
      author: 'Vince Lombardi',
      category: 'Professional Mindset',
    },
    {
      quote: 'Plan the trade and trade the plan.',
      author: 'Unknown Trader',
      category: 'Professional Mindset',
    },
    {
      quote: 'Discipline is the bridge between goals and accomplishment.',
      author: 'Jim Rohn',
      category: 'Professional Mindset',
    },
    {
      quote: 'Without discipline, you don\'t have a strategy.',
      author: 'Unknown Trader',
      category: 'Professional Mindset',
    },
    {
      quote: 'Trading is a business, not a gamble.',
      author: 'Alexander Elder',
      category: 'Professional Mindset',
    },
    {
      quote: 'Losses are part of the game.',
      author: 'Ed Seykota',
      category: 'Losses & Failure',
    },
    {
      quote: 'Fail fast, learn faster.',
      author: 'Unknown Trader',
      category: 'Losses & Failure',
    },
    {
      quote: 'Every loss is tuition.',
      author: 'Unknown Trader',
      category: 'Losses & Failure',
    },
    {
      quote: 'It\'s okay to be wrong, but not okay to stay wrong.',
      author: 'Unknown Trader',
      category: 'Losses & Failure',
    },
    {
      quote: 'The market will always punish arrogance.',
      author: 'Unknown Trader',
      category: 'Losses & Failure',
    },
    {
      quote: 'Consistency is more important than intensity.',
      author: 'Unknown Trader',
      category: 'Success & Mastery',
    },
    {
      quote: 'Master one strategy instead of chasing many.',
      author: 'Unknown Trader',
      category: 'Success & Mastery',
    },
    {
      quote: 'Focus on process, not profit.',
      author: 'Unknown Trader',
      category: 'Success & Mastery',
    },
    {
      quote: 'Small edges, repeated consistently, create big results.',
      author: 'Unknown Trader',
      category: 'Success & Mastery',
    },
    {
      quote: 'The goal is survival first, profit second.',
      author: 'Unknown Trader',
      category: 'Success & Mastery',
    },
    {
      quote: 'Trade small, trade often, trade consistently.',
      author: 'Unknown Trader',
      category: 'Final Wisdom',
    },
    {
      quote: 'You are not competing with others, only yourself.',
      author: 'Unknown Trader',
      category: 'Final Wisdom',
    },
    {
      quote: 'Your biggest enemy is your own mind.',
      author: 'Unknown Trader',
      category: 'Final Wisdom',
    },
    {
      quote: 'The chart reflects human behavior.',
      author: 'Jesse Livermore',
      category: 'Final Wisdom',
    },
    {
      quote: 'Discipline + Risk Management = Long-term survival.',
      author: 'Unknown Trader',
      category: 'Final Wisdom',
    },
  ];

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
          <h2 className="text-3xl font-bold text-center mb-12">Daily Wisdom & Motivation</h2>
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
                ← Previous
              </Button>
              
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {currentMotivationIndex + 1} / {motivations.length}
                </p>
              </div>

              <Button
                onClick={() => setCurrentMotivationIndex((prev) => (prev + 1) % motivations.length)}
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                Next →
              </Button>
            </div>

            {/* Category Filter Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Browse through {motivations.length} daily motivations to inspire your trading journey</p>
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
