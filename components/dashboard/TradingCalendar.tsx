'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Trade } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TradingCalendarProps {
  trades: Trade[];
}

export function TradingCalendar({ trades }: TradingCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Group trades by date
  const tradesByDate = useMemo(() => {
    const grouped: { [key: string]: Trade[] } = {};
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(trade);
    });
    
    return grouped;
  }, [trades]);

  // Calculate daily stats
  const dailyStats = useMemo(() => {
    const stats: { [key: string]: { profit: number; trades: number; wins: number } } = {};
    
    Object.entries(tradesByDate).forEach(([date, dayTrades]) => {
      const profit = dayTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
      const wins = dayTrades.filter(t => t.result === 'WIN').length;
      
      stats[date] = {
        profit,
        trades: dayTrades.length,
        wins,
      };
    });
    
    return stats;
  }, [tradesByDate]);

  // Get all days in the current month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Find min and max profit for color scaling
  const allProfits = Object.values(dailyStats).map(s => s.profit);
  const maxProfit = Math.max(...allProfits.filter(p => p > 0), 0.01);
  const minProfit = Math.min(...allProfits.filter(p => p < 0), -0.01);

  const getColorClass = (profit: number) => {
    if (profit > 0) {
      const intensity = Math.min(profit / maxProfit, 1);
      if (intensity > 0.75) return 'bg-green-600 dark:bg-green-700 text-white';
      if (intensity > 0.5) return 'bg-green-500 dark:bg-green-600 text-white';
      if (intensity > 0.25) return 'bg-green-400 dark:bg-green-500 text-white';
      return 'bg-green-300 dark:bg-green-600/50 text-white';
    } else if (profit < 0) {
      const intensity = Math.min(Math.abs(profit) / Math.abs(minProfit), 1);
      if (intensity > 0.75) return 'bg-red-600 dark:bg-red-700 text-white';
      if (intensity > 0.5) return 'bg-red-500 dark:bg-red-600 text-white';
      if (intensity > 0.25) return 'bg-red-400 dark:bg-red-500 text-white';
      return 'bg-red-300 dark:bg-red-600/50 text-white';
    }
    return 'bg-muted text-foreground';
  };

  const monthString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Card className="p-6 mb-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Trading Calendar</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold min-w-32 text-center">{monthString}</span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />;
              }

              const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                .toISOString()
                .split('T')[0];
              const dayData = dailyStats[dateStr];

              return (
                <div
                  key={`day-${day}`}
                  className="relative group"
                  title={
                    dayData
                      ? `${dayData.trades} trades | Profit: $${dayData.profit.toFixed(2)} | Wins: ${dayData.wins}`
                      : 'No trades'
                  }
                >
                  <div
                    className={`
                      w-full aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                      transition-all hover:ring-2 hover:ring-offset-2 hover:ring-primary cursor-pointer
                      ${dayData ? getColorClass(dayData.profit) : 'bg-muted/30 text-muted-foreground'}
                    `}
                  >
                    {day}
                  </div>

                  {/* Tooltip */}
                  {dayData && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-popover text-popover-foreground text-xs px-3 py-2 rounded-lg shadow-lg border border-border whitespace-nowrap">
                        <div className="font-semibold">${dayData.profit.toFixed(2)}</div>
                        <div className="text-muted-foreground">{dayData.trades} trade(s), {dayData.wins}W</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 dark:bg-green-700 rounded" />
            <span>Profitable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded" />
            <span>No Trades</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 dark:bg-red-700 rounded" />
            <span>Loss</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
