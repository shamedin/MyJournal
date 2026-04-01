'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getTradesFromStorage, deleteTradeFromStorage } from '@/lib/storage';
import { Trade } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Download } from 'lucide-react';
import { exportSingleTradeAsExcel } from '@/lib/exports';
import { toast } from 'sonner';

export default function HistoryPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPair, setFilterPair] = useState<string>('');
  const [filterResult, setFilterResult] = useState<string>('');
  const [filterStrategy, setFilterStrategy] = useState<string>('');

  useEffect(() => {
    const storedTrades = getTradesFromStorage();
    setTrades(storedTrades.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const uniquePairs = useMemo(() => {
    return Array.from(new Set(trades.map(t => t.pair))).filter(Boolean);
  }, [trades]);

  const uniqueStrategies = useMemo(() => {
    return Array.from(new Set(trades.map(t => t.entryModel))).filter(Boolean);
  }, [trades]);

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const matchesSearch = 
        trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.entryModel.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPair = !filterPair || trade.pair === filterPair;
      const matchesResult = !filterResult || trade.result === filterResult;
      const matchesStrategy = !filterStrategy || trade.entryModel === filterStrategy;

      return matchesSearch && matchesPair && matchesResult && matchesStrategy;
    });
  }, [trades, searchTerm, filterPair, filterResult, filterStrategy]);

  const handleDeleteTrade = (tradeId: string) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      deleteTradeFromStorage(tradeId);
      setTrades(trades.filter(t => t.id !== tradeId));
      toast.success('Trade deleted');
    }
  };

  const handleExportTrade = async (trade: Trade) => {
    try {
      await exportSingleTradeAsExcel(trade);
      toast.success('Trade exported as Excel');
    } catch (error) {
      toast.error('Failed to export trade');
    }
  };

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Trade History</h1>
          <p className="text-muted-foreground mt-2">View, filter, and manage all your trades</p>
        </div>

        {trades.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No trades yet</h3>
            <p className="text-muted-foreground">Start creating trades in the journal</p>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Search</label>
                  <Input
                    placeholder="Search trades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Pair</label>
                  <select
                    value={filterPair}
                    onChange={(e) => setFilterPair(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  >
                    <option value="">All Pairs</option>
                    {uniquePairs.map(pair => (
                      <option key={pair} value={pair}>{pair}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Result</label>
                  <select
                    value={filterResult}
                    onChange={(e) => setFilterResult(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  >
                    <option value="">All Results</option>
                    <option value="WIN">Wins</option>
                    <option value="LOSS">Losses</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Strategy</label>
                  <select
                    value={filterStrategy}
                    onChange={(e) => setFilterStrategy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  >
                    <option value="">All Strategies</option>
                    {uniqueStrategies.map(strategy => (
                      <option key={strategy} value={strategy}>{strategy}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterPair('');
                      setFilterResult('');
                      setFilterStrategy('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {filteredTrades.length} of {trades.length} trades
              </div>
            </Card>

            {/* Trades Table */}
            {filteredTrades.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No trades match your filters</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">ID</th>
                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                        <th className="px-4 py-3 text-left font-semibold">Pair</th>
                        <th className="px-4 py-3 text-left font-semibold">Strategy</th>
                        <th className="px-4 py-3 text-center font-semibold">Direction</th>
                        <th className="px-4 py-3 text-center font-semibold">Result</th>
                        <th className="px-4 py-3 text-right font-semibold">P&L</th>
                        <th className="px-4 py-3 text-right font-semibold">Balance</th>
                        <th className="px-4 py-3 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrades.map((trade) => (
                        <tr key={trade.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-semibold">#{trade.tradeIdOfTotal}</td>
                          <td className="px-4 py-3 text-muted-foreground">{trade.date}</td>
                          <td className="px-4 py-3 font-semibold">{trade.pair}</td>
                          <td className="px-4 py-3">{trade.entryModel}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              trade.direction === 'BUY' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            }`}>
                              {trade.direction}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              trade.result === 'WIN'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                            }`}>
                              {trade.result}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-right font-semibold ${
                            trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${trade.profitLoss.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            ${trade.balance.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExportTrade(trade)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteTrade(trade.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Summary Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Summary for Filtered Trades</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Total Trades</p>
                  <p className="text-2xl font-bold">{filteredTrades.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Win Rate</p>
                  <p className="text-2xl font-bold">
                    {filteredTrades.length > 0 
                      ? ((filteredTrades.filter(t => t.result === 'WIN').length / filteredTrades.length) * 100).toFixed(1)
                      : '0'}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total P&L</p>
                  <p className={`text-2xl font-bold ${
                    filteredTrades.reduce((sum, t) => sum + t.profitLoss, 0) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    ${filteredTrades.reduce((sum, t) => sum + t.profitLoss, 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Avg P&L</p>
                  <p className={`text-2xl font-bold ${
                    (filteredTrades.reduce((sum, t) => sum + t.profitLoss, 0) / filteredTrades.length) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    ${(filteredTrades.reduce((sum, t) => sum + t.profitLoss, 0) / filteredTrades.length).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
