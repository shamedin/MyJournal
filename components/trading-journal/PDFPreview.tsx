'use client';

import React from 'react';
import { Trade } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface PDFPreviewProps {
  trade: Trade;
}

export function PDFPreview({ trade }: PDFPreviewProps) {
  const dateStr = new Date(trade.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-lg space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">TRADING JOURNAL</h1>
        <p className="text-sm mt-2">DATE: {dateStr}</p>
        <div className="text-sm mt-2 space-y-1">
          <p>Trade ID of Total Trades: {trade.tradeIdOfTotal}</p>
          <p>Trade ID from Today: {trade.tradeIdFromToday}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="col-span-1 space-y-4">
          <h3 className="font-bold text-sm">SCREENSHOTS</h3>

          {/* 1D Chart */}
          <div className="border border-gray-300 p-2">
            <p className="text-xs font-semibold mb-2">1) 1D</p>
            {trade.chart1D ? (
              <img 
                src={trade.chart1D} 
                alt="1D Chart"
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* 4H Chart */}
          <div className="border border-gray-300 p-2">
            <p className="text-xs font-semibold mb-2">2) 4H</p>
            {trade.chart4H ? (
              <img 
                src={trade.chart4H} 
                alt="4H Chart"
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* 15M Chart */}
          <div className="border border-gray-300 p-2">
            <p className="text-xs font-semibold mb-2">3) 15M</p>
            {trade.chart15M ? (
              <img 
                src={trade.chart15M} 
                alt="15M Chart"
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Trade Details */}
        <div className="col-span-2 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-semibold">DAY:</p>
              <p className="text-xs mt-1">{trade.day}</p>
            </div>
            <div>
              <p className="font-semibold">PAIR:</p>
              <p className="text-xs mt-1">{trade.pair}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-semibold">TIME:</p>
              <p className="text-xs mt-1">{trade.time || '—'}</p>
            </div>
            <div>
              <p className="font-semibold">BUY/SELL:</p>
              <p className="text-xs mt-1">{trade.direction}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">ENTRY MODEL:</p>
            <p className="text-xs mt-1">{trade.entryModel}</p>
          </div>

          <div>
            <p className="font-semibold">EMOTIONS:</p>
            <p className="text-xs mt-1 whitespace-pre-wrap">{trade.emotions || '—'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-semibold">CONFIDENCE:</p>
              <p className="text-xs mt-1">{trade.confidence}%</p>
            </div>
            <div>
              <p className="font-semibold">EXPECTED R:R:</p>
              <p className="text-xs mt-1">{trade.expectedRR.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-semibold">ACTUAL R:R:</p>
              <p className="text-xs mt-1">{trade.actualRR.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">RISK %:</p>
              <p className="text-xs mt-1">{trade.riskPercent.toFixed(2)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-semibold">RESULT:</p>
              <p className="text-xs mt-1">{trade.result}</p>
            </div>
            <div>
              <p className="font-semibold">PROFIT/LOSS:</p>
              <p className="text-xs mt-1">${trade.profitLoss.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">BALANCE:</p>
            <p className="text-xs mt-1">${trade.balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {trade.notes && (
        <div className="border-t pt-4">
          <h3 className="font-bold text-sm mb-2">NOTES:</h3>
          <div className="border border-gray-300 p-3 min-h-24">
            <p className="text-xs whitespace-pre-wrap">{trade.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
