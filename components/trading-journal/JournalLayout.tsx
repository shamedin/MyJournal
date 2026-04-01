'use client';

import React, { useState } from 'react';
import { Trade } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Eye, X } from 'lucide-react';
import { exportTradeAsPDF, exportSingleTradeAsExcel } from '@/lib/exports';
import { deleteTradeFromStorage } from '@/lib/storage';
import { PDFPreview } from './PDFPreview';
import { toast } from 'sonner';

interface JournalLayoutProps {
  trade: Trade;
  onDelete?: (tradeId: string) => void;
}

export function JournalLayout({ trade, onDelete }: JournalLayoutProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleDeleteTrade = () => {
    if (confirm('Are you sure you want to delete this trade?')) {
      deleteTradeFromStorage(trade.id);
      toast.success('Trade deleted');
      if (onDelete) onDelete(trade.id);
    }
  };

  const handlePDFExport = async () => {
    try {
      await exportTradeAsPDF(trade);
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleExcelExport = async () => {
    try {
      await exportSingleTradeAsExcel(trade);
      toast.success('Excel exported successfully!');
    } catch (error) {
      toast.error('Failed to export Excel');
    }
  };

  return (
    <div id={`journal-${trade.id}`} className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Trade #{trade.tradeIdOfTotal}</h2>
          <p className="text-muted-foreground text-sm">{trade.date} • {trade.day}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handlePDFExport}
          >
            <Download className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button 
            size="sm"
            variant="outline"
            onClick={handleExcelExport}
          >
            <Download className="w-4 h-4 mr-1" />
            Excel
          </Button>
          <Button 
            size="sm"
            variant="destructive"
            onClick={handleDeleteTrade}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section (Left) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* 1D Chart */}
            {trade.chart1D && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">1D Chart</h3>
                <img 
                  src={trade.chart1D} 
                  alt="1D Chart"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </Card>
            )}

            {/* 4H Chart */}
            {trade.chart4H && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">4H Chart</h3>
                <img 
                  src={trade.chart4H} 
                  alt="4H Chart"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </Card>
            )}

            {/* 15M Chart */}
            {trade.chart15M && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">15M Chart</h3>
                <img 
                  src={trade.chart15M} 
                  alt="15M Chart"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </Card>
            )}
          </div>
        </div>

        {/* Trade Details Section (Right) */}
        <div className="space-y-4">
          {/* Basic Info */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Trade Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pair:</span>
                <span className="font-semibold">{trade.pair}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span>{trade.time || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Direction:</span>
                <span className={trade.direction === 'BUY' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {trade.direction}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Strategy:</span>
                <span className="font-semibold">{trade.entryModel}</span>
              </div>
            </div>
          </Card>

          {/* Psychology */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Psychology</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Confidence:</span>
                <div className="mt-1 w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${trade.confidence}%` }}
                  />
                </div>
                <span className="text-xs">{trade.confidence}%</span>
              </div>
              {trade.emotions && (
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">"{trade.emotions}"</p>
                </div>
              )}
            </div>
          </Card>

          {/* Risk & Reward */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Risk & Reward</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected R:R:</span>
                <span className="font-semibold">{trade.expectedRR.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actual R:R:</span>
                <span className="font-semibold">{trade.actualRR.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk %:</span>
                <span className="font-semibold">{trade.riskPercent.toFixed(2)}%</span>
              </div>
            </div>
          </Card>

          {/* Result */}
          <Card className={`p-4 ${trade.result === 'WIN' ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
            <h3 className="text-sm font-semibold mb-3">Result</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-bold ${trade.result === 'WIN' ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.result}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">P&L:</span>
                <span className={`font-bold ${trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${trade.profitLoss.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-semibold">${trade.balance.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Width Sections */}
      {trade.notes && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Notes</h3>
          <p className="text-sm whitespace-pre-wrap">{trade.notes}</p>
        </Card>
      )}

      {trade.tags.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {trade.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-96 overflow-auto w-full">
            <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold">PDF Preview</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPreview(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <PDFPreview trade={trade} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
