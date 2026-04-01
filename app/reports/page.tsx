'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import { getTradesFromStorage, getReportsFromStorage, saveReportToStorage, deleteReportFromStorage } from '@/lib/storage';
import { calculateStatistics } from '@/lib/calculations';
import { Trade, TradingReport } from '@/lib/types';

export default function Reports() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [reports, setReports] = useState<TradingReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    const tradeData = getTradesFromStorage();
    const reportsData = getReportsFromStorage();
    setTrades(tradeData);
    setReports(reportsData);

    // Generate current month if not exists
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    if (!reportsData.some(r => r.month === currentMonth)) {
      generateReport(currentMonth);
    }
  }, []);

  const generateReport = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const monthNum = parseInt(month) - 1;
    const startDate = new Date(parseInt(year), monthNum, 1);
    const endDate = new Date(parseInt(year), monthNum + 1, 0);

    const monthTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate >= startDate && tradeDate <= endDate;
    });

    if (monthTrades.length === 0) {
      alert('No trades for this month');
      return;
    }

    const stats = calculateStatistics(monthTrades);
    const bestTrade = monthTrades.reduce((best, current) =>
      (!best || current.profitLoss > best.profitLoss) ? current : best
    , null as Trade | null);

    const worstTrade = monthTrades.reduce((worst, current) =>
      (!worst || current.profitLoss < worst.profitLoss) ? current : worst
    , null as Trade | null);

    const report: TradingReport = {
      id: Date.now().toString(),
      month: monthKey,
      year: parseInt(year),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalTrades: stats.totalTrades,
      winRate: stats.winRate,
      profitFactor: stats.profitFactor,
      totalProfit: stats.totalProfit,
      bestTrade,
      worstTrade,
      averageWin: stats.averageWin,
      averageLoss: stats.averageLoss,
      topSetup: null,
      emotionalInsights: 'Review your trading journal entries to identify emotional patterns.',
      areasForImprovement: [
        stats.profitFactor < 1.5 ? 'Improve win rate or trade selection' : '',
        stats.averageLoss > Math.abs(stats.averageWin * 0.3) ? 'Reduce average loss size' : '',
      ].filter(Boolean),
      lessonsLearned: [
        'Focus on high-probability setups',
        'Stick to risk management rules',
        'Review losing trades for patterns',
      ],
      nextMonthGoals: [
        `Achieve ${Math.min(stats.winRate + 5, 100)}% win rate`,
        `Reach ${(stats.profitFactor + 0.3).toFixed(2)} profit factor`,
        'Follow trading plan 100%',
      ],
      createdAt: new Date().toISOString(),
    };

    saveReportToStorage(report);
    setReports([...reports.filter(r => r.id !== report.id), report]);
  };

  const getAvailableMonths = () => {
    const months = new Set<string>();
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  };

  const handleDelete = (id: string) => {
    deleteReportFromStorage(id);
    setReports(reports.filter(r => r.id !== id));
  };

  const downloadReport = (report: TradingReport) => {
    const text = `
TRADING REPORT - ${report.month}
=====================================

PERFORMANCE SUMMARY
-------------------
Total Trades: ${report.totalTrades}
Win Rate: ${report.winRate.toFixed(1)}%
Profit Factor: ${report.profitFactor.toFixed(2)}
Total Profit/Loss: $${report.totalProfit.toFixed(2)}

STATISTICS
----------
Average Win: $${report.averageWin.toFixed(2)}
Average Loss: $${report.averageLoss.toFixed(2)}

BEST TRADE
----------
${report.bestTrade ? `
Pair: ${report.bestTrade.pair}
Profit: $${report.bestTrade.profitLoss.toFixed(2)}
Direction: ${report.bestTrade.direction}
Date: ${new Date(report.bestTrade.date).toLocaleDateString()}
` : 'No trades'}

WORST TRADE
-----------
${report.worstTrade ? `
Pair: ${report.worstTrade.pair}
Loss: $${report.worstTrade.profitLoss.toFixed(2)}
Direction: ${report.worstTrade.direction}
Date: ${new Date(report.worstTrade.date).toLocaleDateString()}
` : 'No trades'}

AREAS FOR IMPROVEMENT
---------------------
${report.areasForImprovement.map(area => `• ${area}`).join('\n')}

LESSONS LEARNED
---------------
${report.lessonsLearned.map(lesson => `• ${lesson}`).join('\n')}

NEXT MONTH GOALS
----------------
${report.nextMonthGoals.map(goal => `• ${goal}`).join('\n')}

Generated on ${new Date(report.createdAt).toLocaleDateString()}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', `trading-report-${report.month}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const availableMonths = getAvailableMonths();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Trading Reports</h1>
        </div>

        {/* Generate Report Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Generate Monthly Report</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md bg-background"
            >
              <option value="">Select a month</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <Button
              onClick={() => {
                if (selectedMonth) {
                  generateReport(selectedMonth);
                  setSelectedMonth('');
                }
              }}
              disabled={!selectedMonth}
            >
              Generate Report
            </Button>
          </div>
        </Card>

        {/* Reports List */}
        {reports.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No reports yet. Start trading and generate your first report.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.sort((a, b) => b.month.localeCompare(a.month)).map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{report.month}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReport(report)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(report.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold mt-1">{report.totalTrades}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold mt-1">{report.winRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Profit Factor</p>
                    <p className="text-2xl font-bold mt-1">{report.profitFactor.toFixed(2)}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${report.totalProfit >= 0 ? 'bg-green-100 dark:bg-green-950/30' : 'bg-red-100 dark:bg-red-950/30'}`}>
                    <p className="text-xs text-muted-foreground">Total P&L</p>
                    <p className={`text-2xl font-bold mt-1 ${report.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${report.totalProfit.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {report.bestTrade && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 rounded-lg">
                      <p className="font-semibold text-sm mb-2">Best Trade</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">{report.bestTrade.pair}</span> <span className="font-bold text-green-600 dark:text-green-400">${report.bestTrade.profitLoss.toFixed(2)}</span></p>
                        <p className="text-muted-foreground">{report.bestTrade.direction}</p>
                      </div>
                    </div>
                  )}
                  {report.worstTrade && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 rounded-lg">
                      <p className="font-semibold text-sm mb-2">Worst Trade</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">{report.worstTrade.pair}</span> <span className="font-bold text-red-600 dark:text-red-400">${report.worstTrade.profitLoss.toFixed(2)}</span></p>
                        <p className="text-muted-foreground">{report.worstTrade.direction}</p>
                      </div>
                    </div>
                  )}
                </div>

                {report.areasForImprovement.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1 text-sm">
                      {report.areasForImprovement.map((area, i) => (
                        <li key={i} className="text-muted-foreground">• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.nextMonthGoals.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Next Month Goals</h4>
                    <ul className="space-y-1 text-sm">
                      {report.nextMonthGoals.map((goal, i) => (
                        <li key={i} className="text-muted-foreground">• {goal}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
