'use client';

import React, { useState, useEffect } from 'react';
import { TradeForm } from '@/components/trading-journal/TradeForm';
import { JournalLayout } from '@/components/trading-journal/JournalLayout';
import { Trade } from '@/lib/types';
import { getTradesFromStorage } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const storedTrades = getTradesFromStorage();
    // Sort by date descending (newest first)
    setTrades(storedTrades.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const handleTradeSubmit = () => {
    const storedTrades = getTradesFromStorage();
    setTrades(storedTrades.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setShowForm(false);
    setTimeout(() => setShowForm(true), 100);
  };

  const handleTradeDelete = (tradeId: string) => {
    setTrades(trades.filter(t => t.id !== tradeId));
  };

  return (
    <main className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="border-b border-border pb-4">
          <h1 className="text-3xl font-bold">Trading Journal</h1>
          <p className="text-muted-foreground text-sm mt-1">Log and document your trades</p>
        </div>

        {/* Form Section */}
        {showForm && (
          <Card className="p-6 lg:p-8 border-2">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">NEW TRADE ENTRY</h2>
            <TradeForm onTradeSubmit={handleTradeSubmit} />
          </Card>
        )}

        {/* Trades List */}
        {trades.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h2 className="text-xl font-bold">RECENT TRADES</h2>
              <span className="text-xs text-muted-foreground font-semibold">
                {trades.length} total
              </span>
            </div>

            <div className="space-y-3">
              {trades.map((trade) => (
                <div key={trade.id} className="border border-border rounded-lg overflow-hidden">
                  {/* Collapsible Header */}
                  <button
                    onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
                    className="w-full p-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-bold text-lg">Trade #{trade.tradeIdOfTotal}</span>
                      <span className="text-sm text-muted-foreground">{trade.date}</span>
                      <span className="text-sm">{trade.pair}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        trade.direction === 'BUY' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}>
                        {trade.direction}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        trade.result === 'WIN'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                      }`}>
                        {trade.result}
                      </span>
                      <span className={`font-semibold ${trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${trade.profitLoss.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      {expandedTrade === trade.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedTrade === trade.id && (
                    <div className="border-t border-border p-6 bg-muted/20">
                      <JournalLayout trade={trade} onDelete={handleTradeDelete} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {trades.length === 0 && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No trades yet</h3>
            <p className="text-muted-foreground">Create your first trade entry above to get started</p>
          </Card>
        )}
      </div>
    </main>
  );
}
