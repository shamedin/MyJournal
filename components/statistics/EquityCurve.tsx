'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EquityCurveProps {
  data: Array<{ date: string; balance: number }>;
}

export function EquityCurve({ data }: EquityCurveProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="hsl(var(--primary))" 
            dot={false}
            name="Account Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
