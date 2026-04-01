'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StrategyData {
  strategy: string;
  count: number;
  winRate: number;
}

interface StrategyBreakdownProps {
  data: StrategyData[];
}

export function StrategyBreakdown({ data }: StrategyBreakdownProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Strategy Breakdown</h3>
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Strategy Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="strategy" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="count" fill="hsl(var(--primary))" name="Number of Trades" />
          <Bar yAxisId="right" dataKey="winRate" fill="#10b981" name="Win Rate %" />
        </BarChart>
      </ResponsiveContainer>

      {/* Table view */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-semibold">Details</h4>
        {data.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 rounded bg-muted/50">
            <span className="font-medium">{item.strategy}</span>
            <span className="text-xs text-muted-foreground">
              {item.count} trades • {item.winRate.toFixed(1)}% win rate
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
