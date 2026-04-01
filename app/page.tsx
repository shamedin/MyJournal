'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Brain, Lightbulb, Heart, Zap, Compass } from 'lucide-react';
import { getTradesFromStorage } from '@/lib/storage';
import { calculateStatistics } from '@/lib/calculations';

export default function Home() {
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    const trades = getTradesFromStorage();
    setJournalCount(trades.length);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: 'Personal Journal',
      description: 'Reflect on your thoughts, emotions, and personal growth. Track your mental and emotional well-being.',
      href: '/journal',
    },
    {
      icon: Brain,
      title: 'Self-Discovery',
      description: 'Explore psychological insights about yourself and understand your patterns of behavior and thinking.',
      href: '/statistics',
    },
    {
      icon: Lightbulb,
      title: 'Teachings & Insights',
      description: 'Access wisdom, spiritual teachings, and improvement strategies to enhance your mental clarity.',
      href: '/journal',
    },
    {
      icon: Heart,
      title: 'Emotional Growth',
      description: 'Work on emotional intelligence, resilience, and mental health through guided practices.',
      href: '/pdf-merger',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold text-balance">
            My Journal
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Your personal sanctuary for psychological growth, mental clarity, and self-improvement. Explore your inner world, reflect on life's lessons, and transform through wisdom and teachings.
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
                <Brain className="w-5 h-5" />
                Explore Insights
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      {journalCount > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Your Growth Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium">Journal Entries</p>
                <p className="text-4xl font-bold mt-2">{journalCount}</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium">Self-Reflection</p>
                <p className="text-4xl font-bold mt-2 text-blue-600">Active</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm font-medium">Growth Status</p>
                <p className="text-4xl font-bold mt-2 text-green-600">In Progress</p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Powerful Features for Growth</h2>
            <p className="text-xl text-muted-foreground">Everything you need for psychological well-being and personal transformation</p>
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
          <h2 className="text-3xl font-bold">Ready to Elevate Your Life?</h2>
          <p className="text-lg opacity-90">
            Begin your journey of self-discovery, mental clarity, and personal growth today. Transform your life through reflection, wisdom, and intentional growth.
          </p>
          <Link href="/journal">
            <Button size="lg" variant="secondary" className="gap-2">
              <BookOpen className="w-5 h-5" />
              Begin Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>My Journal - Your personal space for growth, reflection, and transformation</p>
          <p className="mt-2">All data is stored locally in your browser. Your privacy is protected.</p>
        </div>
      </footer>
    </main>
  );
}
