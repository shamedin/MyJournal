'use client';

import React from 'react';
import { Statistics } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface StatsOverviewProps {
  stats: Statistics;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const kpis = [
    {
      label: 'Total Trades',
      value: stats.totalTrades,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Win Rate',
      value: `${stats.winRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Total P&L',
      value: `$${stats.totalProfit.toFixed(2)}`,
      icon: TrendingDown,
      color: stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.totalProfit >= 0 ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950',
    },
    {
      label: 'Profit Factor',
      value: stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Card key={idx} className={`p-6 ${kpi.bgColor}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{kpi.label}</p>
                <p className={`text-2xl lg:text-3xl font-bold mt-2 ${kpi.color}`}>
                  {kpi.value}
                </p>
              </div>
              <Icon className={`w-8 h-8 ${kpi.color} opacity-20`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
