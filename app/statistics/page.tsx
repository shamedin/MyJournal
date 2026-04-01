'use client';

import React, { useState, useEffect } from 'react';
import { getTradesFromStorage } from '@/lib/storage';
import { calculateStatistics, getEquityCurve, getStrategyBreakdown, getWinLossDistribution } from '@/lib/calculations';
import { Trade } from '@/lib/types';
import { StatsOverview } from '@/components/statistics/StatsOverview';
import { EquityCurve } from '@/components/statistics/EquityCurve';
import { WinLossChart } from '@/components/statistics/WinLossChart';
import { StrategyBreakdown } from '@/components/statistics/StrategyBreakdown';
import { RiskRewardAnalysis } from '@/components/statistics/RiskRewardAnalysis';
import { Card } from '@/components/ui/card';

export default function StatisticsPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTrades = getTradesFromStorage();
    setTrades(storedTrades);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        </div>
      </main>
    );
  }

  const stats = calculateStatistics(trades);
  const equityCurve = getEquityCurve(trades);
  const strategyBreakdown = getStrategyBreakdown(trades);
  const winLoss = getWinLossDistribution(trades);

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Trading Statistics</h1>
          <p className="text-muted-foreground mt-2">Analyze your trading performance</p>
        </div>

        {trades.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No trades yet</h3>
            <p className="text-muted-foreground">Create some trades in the journal to see statistics</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* KPI Overview */}
            <div>
              <StatsOverview stats={stats} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EquityCurve data={equityCurve} />
              <WinLossChart wins={winLoss.wins} losses={winLoss.losses} />
            </div>

            {/* Strategy Breakdown */}
            <div>
              <StrategyBreakdown data={strategyBreakdown} />
            </div>

            {/* Risk & Reward */}
            <div>
              <RiskRewardAnalysis stats={stats} />
            </div>

            {/* Additional Stats Table */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Trade Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Trades:</span>
                      <span className="font-semibold">{stats.totalTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wins:</span>
                      <span className="font-semibold text-green-600">{stats.winCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Losses:</span>
                      <span className="font-semibold text-red-600">{stats.lossCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Win Rate:</span>
                      <span className="font-semibold">{stats.winRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Profitability</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total P&L:</span>
                      <span className={`font-semibold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${stats.totalProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Win:</span>
                      <span className="font-semibold text-green-600">${stats.averageWin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Loss:</span>
                      <span className="font-semibold text-red-600">$({Math.abs(stats.averageLoss).toFixed(2)})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit Factor:</span>
                      <span className="font-semibold">
                        {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Risk Management</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Largest Win:</span>
                      <span className="font-semibold text-green-600">${stats.largestWin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Largest Loss:</span>
                      <span className="font-semibold text-red-600">$({Math.abs(stats.largestLoss).toFixed(2)})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg R:R:</span>
                      <span className="font-semibold">{stats.averageRR.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
