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
    <div className="bg-white text-black p-4 rounded-lg space-y-3 max-h-96 overflow-y-auto text-xs">
      {/* Header */}
      <div className="pb-2 border-b-2 border-gray-400">
        <h1 className="text-lg font-bold">TRADING JOURNAL</h1>
        <p className="text-xs mt-1">DATE: {dateStr}</p>
        <div className="text-xs mt-1 grid grid-cols-2 gap-4">
          <p>Trade ID (Total): {trade.tradeIdOfTotal}</p>
          <p>Trade ID (Today): {trade.tradeIdFromToday}</p>
        </div>
      </div>

      {/* Charts Section - 3 columns */}
      <div>
        <h3 className="font-bold text-xs mb-2">SCREENSHOTS</h3>
        <div className="grid grid-cols-3 gap-2">
          {/* 1D Chart */}
          <div className="border border-gray-300 p-1">
            <p className="text-xs font-semibold mb-1">1D</p>
            {trade.chart1D ? (
              <img 
                src={trade.chart1D} 
                alt="1D Chart"
                className="w-full h-20 object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                —
              </div>
            )}
          </div>

          {/* 4H Chart */}
          <div className="border border-gray-300 p-1">
            <p className="text-xs font-semibold mb-1">4H</p>
            {trade.chart4H ? (
              <img 
                src={trade.chart4H} 
                alt="4H Chart"
                className="w-full h-20 object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                —
              </div>
            )}
          </div>

          {/* 15M Chart */}
          <div className="border border-gray-300 p-1">
            <p className="text-xs font-semibold mb-1">15M</p>
            {trade.chart15M ? (
              <img 
                src={trade.chart15M} 
                alt="15M Chart"
                className="w-full h-20 object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                —
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trade Information - 2 columns */}
      <div className="border-t pt-2">
        <h3 className="font-bold text-xs mb-2">TRADE INFORMATION</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Left Column */}
          <div className="space-y-1">
            <div><span className="font-semibold">Day:</span> {trade.day}</div>
            <div><span className="font-semibold">Pair:</span> {trade.pair}</div>
            <div><span className="font-semibold">Time:</span> {trade.time || '—'}</div>
            <div><span className="font-semibold">Direction:</span> {trade.direction}</div>
            <div><span className="font-semibold">Strategy:</span> {trade.entryModel}</div>
            <div><span className="font-semibold">Confidence:</span> {trade.confidence}%</div>
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            <div><span className="font-semibold">Result:</span> {trade.result}</div>
            <div><span className="font-semibold">Expected R:R:</span> {trade.expectedRR.toFixed(2)}</div>
            <div><span className="font-semibold">Actual R:R:</span> {trade.actualRR.toFixed(2)}</div>
            <div><span className="font-semibold">Risk %:</span> {trade.riskPercent.toFixed(2)}%</div>
            <div><span className="font-semibold">P&L:</span> ${trade.profitLoss.toFixed(2)}</div>
            <div><span className="font-semibold">Balance:</span> ${trade.balance.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Emotions Section */}
      {trade.emotions && (
        <div className="border-t pt-2">
          <h3 className="font-bold text-xs mb-1">EMOTIONS</h3>
          <p className="text-xs whitespace-pre-wrap line-clamp-2">{trade.emotions}</p>
        </div>
      )}

      {/* Notes Section */}
      {trade.notes && (
        <div className="border-t pt-2">
          <h3 className="font-bold text-xs mb-1">NOTES</h3>
          <div className="border border-gray-300 p-2 min-h-16 bg-gray-50">
            <p className="text-xs whitespace-pre-wrap line-clamp-3">{trade.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
