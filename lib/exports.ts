import { Trade } from './types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export async function exportTradeAsPDF(tradeId: string, elementId: string): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Trade element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = pdf.internal.pageSize.getWidth() - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`trade-${tradeId}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}

export function exportAllTradesAsExcel(trades: Trade[]): void {
  try {
    const data = trades.map(trade => ({
      'Trade ID': trade.tradeIdOfTotal,
      'Date': trade.date,
      'Day': trade.day,
      'Pair': trade.pair,
      'Time': trade.time,
      'Direction': trade.direction,
      'Strategy': trade.entryModel,
      'Confidence': trade.confidence,
      'Expected R:R': trade.expectedRR,
      'Actual R:R': trade.actualRR,
      'Risk %': trade.riskPercent,
      'Result': trade.result,
      'Profit/Loss': trade.profitLoss,
      'Balance': trade.balance,
      'Notes': trade.notes,
      'Tags': trade.tags.join(', '),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trades');

    // Add summary sheet
    const summaryData = [
      { Metric: 'Total Trades', Value: trades.length },
      { Metric: 'Win Rate', Value: `${((trades.filter(t => t.result === 'WIN').length / trades.length) * 100).toFixed(2)}%` },
      { Metric: 'Total P&L', Value: trades.reduce((sum, t) => sum + t.profitLoss, 0) },
      { Metric: 'Average P&L', Value: (trades.reduce((sum, t) => sum + t.profitLoss, 0) / trades.length).toFixed(2) },
    ];

    const summarySummarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySummarySheet, 'Summary');

    XLSX.writeFile(wb, `trading-journal-${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Excel export error:', error);
    throw error;
  }
}

export async function exportSingleTradeAsExcel(trade: Trade): Promise<void> {
  try {
    const data = [{
      'Trade ID': trade.tradeIdOfTotal,
      'Date': trade.date,
      'Day': trade.day,
      'Pair': trade.pair,
      'Time': trade.time,
      'Direction': trade.direction,
      'Strategy': trade.entryModel,
      'Confidence': trade.confidence,
      'Expected R:R': trade.expectedRR,
      'Actual R:R': trade.actualRR,
      'Risk %': trade.riskPercent,
      'Result': trade.result,
      'Profit/Loss': trade.profitLoss,
      'Balance': trade.balance,
      'Notes': trade.notes,
      'Tags': trade.tags.join(', '),
    }];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trade');

    XLSX.writeFile(wb, `trade-${trade.tradeIdOfTotal}-${trade.date}.xlsx`);
  } catch (error) {
    console.error('Excel export error:', error);
    throw error;
  }
}
