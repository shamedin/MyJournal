'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { getSetupsFromStorage, saveSetupToStorage, deleteSetupFromStorage, getTradesFromStorage } from '@/lib/storage';
import { TradingSetup, Trade } from '@/lib/types';

export default function SetupsLibrary() {
  const [setups, setSetups] = useState<TradingSetup[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    entryRules: '',
    exitRules: '',
    riskRewardRatio: 1.5,
  });

  useEffect(() => {
    const savedSetups = getSetupsFromStorage();
    const tradeCdata = getTradesFromStorage();
    setSetups(savedSetups);
    setTrades(tradeCdata);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const setup: TradingSetup = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      entryRules: formData.entryRules,
      exitRules: formData.exitRules,
      riskRewardRatio: formData.riskRewardRatio,
      tags: [],
      createdAt: new Date().toISOString(),
      linkedTrades: [],
      winRate: 0,
      totalUsed: 0,
    };

    saveSetupToStorage(setup);
    setSetups([...setups.filter(s => s.id !== editingId), setup]);
    setFormData({ name: '', category: '', description: '', entryRules: '', exitRules: '', riskRewardRatio: 1.5 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (setup: TradingSetup) => {
    setFormData({
      name: setup.name,
      category: setup.category,
      description: setup.description,
      entryRules: setup.entryRules,
      exitRules: setup.exitRules,
      riskRewardRatio: setup.riskRewardRatio,
    });
    setEditingId(setup.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteSetupFromStorage(id);
    setSetups(setups.filter(s => s.id !== id));
  };

  const getSetupStats = (setupId: string) => {
    const setupTrades = trades.filter(t => t.tags.includes(setupId));
    if (setupTrades.length === 0) return { count: 0, winRate: 0, profit: 0 };

    const wins = setupTrades.filter(t => t.result === 'WIN').length;
    const profit = setupTrades.reduce((sum, t) => sum + t.profitLoss, 0);

    return {
      count: setupTrades.length,
      winRate: (wins / setupTrades.length) * 100,
      profit,
    };
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Trading Setups Library</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            New Setup
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Setup' : 'Create New Setup'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Setup Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g., Morning Breakout"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g., Breakout, Reversal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="Brief description of the setup"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Entry Rules *</label>
                <textarea
                  value={formData.entryRules}
                  onChange={(e) => setFormData({ ...formData, entryRules: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="Define entry conditions and criteria"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Exit Rules *</label>
                <textarea
                  value={formData.exitRules}
                  onChange={(e) => setFormData({ ...formData, exitRules: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="Define exit conditions and profit targets"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Risk/Reward Ratio</label>
                <input
                  type="number"
                  value={formData.riskRewardRatio}
                  onChange={(e) => setFormData({ ...formData, riskRewardRatio: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  step="0.1"
                  min="0.5"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', category: '', description: '', entryRules: '', exitRules: '', riskRewardRatio: 1.5 });
                }}>
                  Cancel
                </Button>
                <Button type="submit">Save Setup</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Setups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {setups.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">No setups yet. Create your first trading setup.</p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-5 h-5" />
                Create Setup
              </Button>
            </div>
          ) : (
            setups.map((setup) => {
              const stats = getSetupStats(setup.id);
              return (
                <Card key={setup.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{setup.name}</h3>
                      {setup.category && <p className="text-sm text-primary">{setup.category}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(setup)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(setup.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {setup.description && (
                    <p className="text-sm text-muted-foreground mb-4">{setup.description}</p>
                  )}

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Entry Rules</p>
                      <p className="text-sm">{setup.entryRules}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Exit Rules</p>
                      <p className="text-sm">{setup.exitRules}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Used</p>
                        <p className="text-lg font-bold">{stats.count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-bold">{stats.count > 0 ? stats.winRate.toFixed(1) : 0}%</p>
                      </div>
                    </div>
                    {stats.profit !== 0 && (
                      <div className="text-right">
                        <p className={`text-lg font-bold ${stats.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          ${stats.profit.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
