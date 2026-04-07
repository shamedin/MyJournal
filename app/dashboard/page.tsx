'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { getTradesFromStorage } from '@/lib/storage';
import { calculateStatistics } from '@/lib/calculations';
import { Trade } from '@/lib/types';
import { TradingCalendar } from '@/components/dashboard/TradingCalendar';

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState({
    totalTrades: 0,
    winCount: 0,
    lossCount: 0,
    winRate: 0,
    totalProfit: 0,
    averageWin: 0,
    averageLoss: 0,
    largestWin: 0,
    largestLoss: 0,
    profitFactor: 0,
  });

  useEffect(() => {
    const tradeData = getTradesFromStorage();
    setTrades(tradeData);
    const calculatedStats = calculateStatistics(tradeData);
    setStats(calculatedStats);
  }, []);

  const bestTrade = trades.reduce((best, current) => 
    (!best || current.profitLoss > best.profitLoss) ? current : best
  , null as Trade | null);

  const worstTrade = trades.reduce((worst, current) => 
    (!worst || current.profitLoss < worst.profitLoss) ? current : worst
  , null as Trade | null);

  const getMonthlyData = () => {
    const monthlyTrades: { [key: string]: Trade[] } = {};
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyTrades[monthKey]) {
        monthlyTrades[monthKey] = [];
      }
      monthlyTrades[monthKey].push(trade);
    });

    return Object.entries(monthlyTrades)
      .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
      .slice(0, 6)
      .map(([month, monthTrades]) => {
        const monthStats = calculateStatistics(monthTrades);
        return {
          month,
          trades: monthTrades.length,
          profit: monthStats.totalProfit,
          winRate: monthStats.winRate,
        };
      });
  };

  const getTopPairs = () => {
    const pairStats: { [key: string]: { wins: number; losses: number; profit: number } } = {};
    
    trades.forEach(trade => {
      if (!pairStats[trade.pair]) {
        pairStats[trade.pair] = { wins: 0, losses: 0, profit: 0 };
      }
      
      if (trade.result === 'WIN') {
        pairStats[trade.pair].wins++;
      } else {
        pairStats[trade.pair].losses++;
      }
      
      pairStats[trade.pair].profit += trade.profitLoss;
    });

    return Object.entries(pairStats)
      .map(([pair, data]) => ({
        pair,
        total: data.wins + data.losses,
        winRate: (data.wins / (data.wins + data.losses)) * 100,
        profit: data.profit,
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
  };

  const monthlyData = getMonthlyData();
  const topPairs = getTopPairs();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Trading Dashboard</h1>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-semibold">Total Trades</p>
                <p className="text-4xl font-bold mt-2">{stats.totalTrades}</p>
              </div>
              <Target className="w-12 h-12 text-primary/30" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-semibold">Win Rate</p>
                <p className="text-4xl font-bold mt-2">{stats.winRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.winCount}W / {stats.lossCount}L</p>
              </div>
              <Award className="w-12 h-12 text-green-500/30" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-semibold">Profit Factor</p>
                <p className="text-4xl font-bold mt-2">{stats.profitFactor.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Ideal: {">"} 1.5</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500/30" />
            </div>
          </Card>

          <Card className={`p-6 ${stats.totalProfit >= 0 ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-semibold">Total Profit</p>
                <p className={`text-4xl font-bold mt-2 ${stats.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${stats.totalProfit.toFixed(2)}
                </p>
              </div>
              {stats.totalProfit >= 0 ? (
                <TrendingUp className="w-12 h-12 text-green-500/30" />
              ) : (
                <TrendingDown className="w-12 h-12 text-red-500/30" />
              )}
            </div>
          </Card>
        </div>

        {/* Average Win/Loss */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <p className="text-muted-foreground text-sm font-semibold">Average Win</p>
            <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">${stats.averageWin.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">Largest Win: ${stats.largestWin.toFixed(2)}</p>
          </Card>

          <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <p className="text-muted-foreground text-sm font-semibold">Average Loss</p>
            <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">${stats.averageLoss.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">Largest Loss: ${stats.largestLoss.toFixed(2)}</p>
          </Card>
        </div>

        {/* Best and Worst Trades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {bestTrade && (
            <Card className="p-6 border-green-200 dark:border-green-800">
              <p className="text-muted-foreground text-sm font-semibold mb-4">Best Trade</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{bestTrade.pair}</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">${bestTrade.profitLoss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(bestTrade.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Direction:</span>
                  <span className="font-semibold">{bestTrade.direction}</span>
                </div>
              </div>
            </Card>
          )}

          {worstTrade && (
            <Card className="p-6 border-red-200 dark:border-red-800">
              <p className="text-muted-foreground text-sm font-semibold mb-4">Worst Trade</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{worstTrade.pair}</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">${worstTrade.profitLoss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(worstTrade.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Direction:</span>
                  <span className="font-semibold">{worstTrade.direction}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Trading Calendar */}
        <TradingCalendar trades={trades} />

        {/* Monthly Performance */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Monthly Performance</h2>
          <div className="space-y-3">
            {monthlyData.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold">{month.month}</p>
                  <p className="text-sm text-muted-foreground">{month.trades} trades</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${month.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${month.profit.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">{month.winRate.toFixed(1)}% WR</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Pairs */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Top Trading Pairs</h2>
          <div className="space-y-3">
            {topPairs.map((pair) => (
              <div key={pair.pair} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold">{pair.pair}</p>
                  <p className="text-sm text-muted-foreground">{pair.total} trades</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${pair.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${pair.profit.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">{pair.winRate.toFixed(1)}% WR</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
