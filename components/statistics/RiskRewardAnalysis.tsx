'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Statistics } from '@/lib/types';

interface RiskRewardAnalysisProps {
  stats: Statistics;
}

export function RiskRewardAnalysis({ stats }: RiskRewardAnalysisProps) {
  const metrics = [
    {
      label: 'Average Win',
      value: `$${stats.averageWin.toFixed(2)}`,
      color: 'text-green-600',
    },
    {
      label: 'Average Loss',
      value: `$${Math.abs(stats.averageLoss).toFixed(2)}`,
      color: 'text-red-600',
    },
    {
      label: 'Largest Win',
      value: `$${stats.largestWin.toFixed(2)}`,
      color: 'text-green-600',
    },
    {
      label: 'Largest Loss',
      value: `$${Math.abs(stats.largestLoss).toFixed(2)}`,
      color: 'text-red-600',
    },
    {
      label: 'Average R:R',
      value: stats.averageRR.toFixed(2),
      color: 'text-blue-600',
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Risk & Reward Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="text-center p-4 rounded-lg bg-muted/50">
            <p className="text-muted-foreground text-xs font-medium">{metric.label}</p>
            <p className={`text-xl font-bold mt-2 ${metric.color}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
