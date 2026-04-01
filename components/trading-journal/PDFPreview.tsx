'use client';

import React from 'react';
import { Trade } from '@/lib/types';
import { formatRRRatio } from '@/lib/calculations';
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
    <div className="bg-white text-black p-3 rounded-lg space-y-2 max-h-96 overflow-y-auto" style={{ fontSize: '11px' }}>
      {/* Header */}
      <div className="pb-2 border-b-2 border-gray-400">
        <h1 className="text-base font-bold">TRADING JOURNAL</h1>
        <p className="text-xs mt-0.5">DATE: {dateStr}</p>
        <div className="text-xs mt-0.5 grid grid-cols-2 gap-2">
          <p>Trade ID (Total): {trade.tradeIdOfTotal}</p>
          <p>Trade ID (Today): {trade.tradeIdFromToday}</p>
        </div>
      </div>

      {/* Main Layout - Two Columns */}
      <div className="grid grid-cols-3 gap-2">
        {/* Left Column - Charts (60%) - Full Height */}
        <div className="col-span-2 space-y-1">
          <h3 className="font-bold text-xs">SCREENSHOTS</h3>
          
          {/* 1D Chart */}
          <div className="border border-gray-300 p-0.5">
            <p className="text-xs font-semibold mb-0.5">1) 1D</p>
            {trade.chart1D ? (
              <img 
                src={trade.chart1D} 
                alt="1D Chart"
                className="w-full h-24 object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                —
              </div>
            )}
          </div>

          {/* 4H Chart */}
          <div className="border border-gray-300 p-0.5">
            <p className="text-xs font-semibold mb-0.5">2) 4H</p>
            {trade.chart4H ? (
              <img 
                src={trade.chart4H} 
                alt="4H Chart"
                className="w-full h-24 object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                —
              </div>
            )}
          </div>

          {/* 15M Chart */}
          <div className="border border-gray-300 p-0.5">
            <p className="text-xs font-semibold mb-0.5">3) 15M</p>
            {trade.chart15M ? (
              <img 
                src={trade.chart15M} 
                alt="15M Chart"
                className="w-full h-24 object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                —
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Trade Info (40%) */}
        <div className="space-y-0.5">
          <h3 className="font-bold text-xs">TRADE INFO</h3>
          <div className="text-xs space-y-0.5">
            <div><span className="font-semibold">Day:</span> <span className="text-xs">{trade.day}</span></div>
            <div><span className="font-semibold">Pair:</span> <span className="text-xs">{trade.pair}</span></div>
            <div><span className="font-semibold">Time:</span> <span className="text-xs">{trade.time || '—'}</span></div>
            <div><span className="font-semibold">Dir:</span> <span className="text-xs">{trade.direction}</span></div>
            <div><span className="font-semibold">Strat:</span> <span className="text-xs">{trade.entryModel.substring(0, 8)}</span></div>
            <div className="border-t pt-0.5 mt-0.5"><span className="font-semibold">Conf%:</span> <span className="text-xs">{trade.confidence}</span></div>
            <div><span className="font-semibold">ExpRR:</span> <span className="text-xs">{formatRRRatio(trade.expectedRR)}</span></div>
            <div><span className="font-semibold">ActRR:</span> <span className="text-xs">{formatRRRatio(trade.actualRR)}</span></div>
            <div><span className="font-semibold">Risk%:</span> <span className="text-xs">{trade.riskPercent.toFixed(1)}</span></div>
            <div className="border-t pt-0.5 mt-0.5"><span className="font-semibold">Result:</span> <span className="text-xs">{trade.result}</span></div>
            <div><span className="font-semibold">P&L:</span> <span className="text-xs">${trade.profitLoss.toFixed(0)}</span></div>
            {trade.initialBalance > 0 && (
              <>
                <div><span className="font-semibold">InitBal:</span> <span className="text-xs">${(trade.initialBalance / 1000).toFixed(1)}k</span></div>
                <div><span className="font-semibold">CurBal:</span> <span className="text-xs">${(trade.balance / 1000).toFixed(1)}k</span></div>
              </>
            )}
            {(!trade.initialBalance || trade.initialBalance === 0) && (
              <div><span className="font-semibold">Balance:</span> <span className="text-xs">${(trade.balance / 1000).toFixed(1)}k</span></div>
            )}
          </div>
        </div>
      </div>

      {/* Emotions Section */}
      {trade.emotions && (
        <div className="border-t pt-1 mt-1">
          <h3 className="font-bold text-xs mb-0.5">EMOTIONS</h3>
          <p className="text-xs whitespace-pre-wrap line-clamp-1">{trade.emotions.substring(0, 60)}</p>
        </div>
      )}

      {/* Notes Section - 5 Lines */}
      <div className="border-t pt-1 mt-1">
        <h3 className="font-bold text-xs mb-0.5">NOTES (5 lines for writing/images)</h3>
        <div className="border border-gray-300 bg-gray-50 p-1">
          {trade.notes ? (
            <p className="text-xs whitespace-pre-wrap line-clamp-2 mb-1">{trade.notes.substring(0, 80)}</p>
          ) : null}
          <div className="space-y-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-b border-gray-300 h-2"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
