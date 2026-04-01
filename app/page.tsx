'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Brain, Lightbulb, Heart } from 'lucide-react';
import { getTradesFromStorage } from '@/lib/storage';

export default function Home() {
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    const trades = getTradesFromStorage();
    setJournalCount(trades.length);
  }, []);

  const teachings = [
    {
      title: 'The Power of Self-Awareness',
      content: 'Self-awareness is the foundation of personal growth. When we understand our thoughts, emotions, and behaviors, we gain the ability to change them. Start observing yourself without judgment. Notice what triggers your emotions, how you react to challenges, and what patterns repeat in your life. This awareness is the first step toward transformation.',
      author: 'Psychology of Growth',
    },
    {
      title: 'Embrace Your Struggles',
      content: 'Every challenge you face is an opportunity for growth. Your struggles are not meant to break you; they are meant to strengthen you. The pressure that shapes a diamond is the same force that creates your resilience. When you face difficulties with courage and curiosity, you unlock your potential and discover strength you never knew you had.',
      author: 'Wisdom of Resilience',
    },
    {
      title: 'Emotional Intelligence Matters',
      content: 'Emotional intelligence is more powerful than IQ in determining success and happiness. Learn to recognize your emotions, understand why you feel them, and manage them constructively. When you can navigate your emotions wisely, you can navigate any relationship, any situation, and any life challenge with grace and wisdom.',
      author: 'Emotional Mastery',
    },
    {
      title: 'The Growth Mindset',
      content: 'Your beliefs about your abilities shape your reality. A growth mindset means believing that your qualities can be developed through dedication. You are not fixed; you are evolving. Every skill can be learned, every weakness can be strengthened, and every setback is a setup for a comeback. Your potential is limitless when you believe in growth.',
      author: 'Mindset Psychology',
    },
  ];

  const motivations = [
    {
      quote: 'The cave you fear to enter holds the treasure you seek.',
      insight: 'What we avoid often contains our greatest growth opportunities.',
    },
    {
      quote: 'You are not your past. You are what you do today.',
      insight: 'Every moment is a chance to rewrite your story and become who you want to be.',
    },
    {
      quote: 'The only person you are destined to become is the person you decide to be.',
      insight: 'Your future is not predetermined. It is created by the choices you make now.',
    },
    {
      quote: 'Silence is the canvas. Your thoughts are the paint.',
      insight: 'In stillness and reflection, you discover your authentic voice.',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Opening Statement */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-lg text-primary font-semibold">Welcome to Your Journey</p>
            <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Transform Your Life Through Self-Discovery and Growth
            </h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              This is your sacred space for reflection, learning, and personal evolution. Here, you'll explore the depths of your psyche, discover your true potential, and build a life of meaning and purpose.
            </p>
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
                <Brain className="w-5 h-5" />
                View Your Progress
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Motivation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Daily Wisdom & Motivation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {motivations.map((item, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <p className="text-lg font-semibold text-primary italic mb-4">"{item.quote}"</p>
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
            <h2 className="text-3xl font-bold">Teachings for Personal Growth</h2>
            <p className="text-lg text-muted-foreground">Deep insights into psychology and personal development</p>
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
            <h2 className="text-3xl font-bold text-center mb-12">Your Transformation Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-8 text-center bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <p className="text-muted-foreground text-sm font-semibold mb-2">ENTRIES WRITTEN</p>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{journalCount}</p>
                <p className="text-muted-foreground text-sm mt-3">moments of reflection and growth</p>
              </Card>
              <Card className="p-8 text-center bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <p className="text-muted-foreground text-sm font-semibold mb-2">SELF-AWARENESS</p>
                <p className="text-5xl font-bold text-green-600 dark:text-green-400">Growing</p>
                <p className="text-muted-foreground text-sm mt-3">deepening your understanding daily</p>
              </Card>
              <Card className="p-8 text-center bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                <p className="text-muted-foreground text-sm font-semibold mb-2">PERSONAL EVOLUTION</p>
                <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">Active</p>
                <p className="text-muted-foreground text-sm mt-3">transforming into your best self</p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Tools for Your Growth</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/journal">
              <Card className="p-8 h-full hover:shadow-lg transition-all cursor-pointer group">
                <BookOpen className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Personal Journal</h3>
                <p className="text-muted-foreground mb-4">Write freely about your thoughts, feelings, and experiences. Journaling is one of the most powerful tools for self-discovery and emotional processing.</p>
                <p className="text-primary font-semibold">Explore Your Inner World →</p>
              </Card>
            </Link>
            <Link href="/statistics">
              <Card className="p-8 h-full hover:shadow-lg transition-all cursor-pointer group">
                <Brain className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Insights & Patterns</h3>
                <p className="text-muted-foreground mb-4">Discover patterns in your behavior, emotions, and growth. Understanding your patterns is the key to lasting change and personal transformation.</p>
                <p className="text-primary font-semibold">Analyze Your Journey →</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Inspiring Message Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Remember:</h2>
            <div className="space-y-3">
              <p className="text-lg text-muted-foreground leading-relaxed">
                You are more capable than you believe. You are stronger than you think. And you are worthy of the beautiful life you dream of.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every journal entry is a conversation with yourself. Every reflection brings clarity. Every moment of self-awareness is a victory. Your journey is unique, and your growth is sacred.
              </p>
              <p className="text-lg font-semibold text-primary leading-relaxed">
                Begin now. Begin with intention. Begin with hope. Your transformation awaits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/50">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-muted-foreground">My Journal - A sanctuary for your growth, reflection, and transformation</p>
          <p className="text-sm text-muted-foreground">All your data is kept private and secure, stored locally in your browser for complete privacy.</p>
          <p className="text-xs text-muted-foreground/75">Begin your journey to a better you today.</p>
        </div>
      </footer>
    </main>
  );
}
