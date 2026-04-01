import { Trade } from './types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export async function exportTradeAsPDF(trade: Trade): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const contentWidth = pageWidth - (margin * 2);
    let leftColY = margin + 18;
    let rightColY = margin + 6;

    // White background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header Section
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('TRADING JOURNAL', margin, margin + 3);

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    const dateStr = new Date(trade.date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    pdf.text(`DATE: ${dateStr}`, margin, margin + 8);

    // Trade ID section
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Trade ID of Total Trades: ${trade.tradeIdOfTotal}`, margin, margin + 13);
    pdf.text(`Trade ID from Today: ${trade.tradeIdFromToday}`, margin, margin + 16);

    // Screenshots Header
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.text('SCREENSHOTS', margin, margin + 18);

    // Layout dimensions
    const chartColWidth = (contentWidth / 2) - 2;
    const chartHeight = 32;

    // Add chart images
    const addChartToColumn = (imageData: string | undefined, label: string, yPos: number) => {
      if (imageData) {
        pdf.setFontSize(8);
        pdf.setFont(undefined, 'bold');
        pdf.text(label, margin, yPos);
        
        try {
          pdf.addImage(imageData, 'JPEG', margin, yPos + 2, chartColWidth - 2, chartHeight);
          return yPos + chartHeight + 4;
        } catch {
          return yPos + 4;
        }
      }
      return yPos;
    };

    // Add charts in left column
    leftColY = addChartToColumn(trade.chart1D, '1) 1D', leftColY);
    leftColY = addChartToColumn(trade.chart4H, '2) 4H', leftColY);
    leftColY = addChartToColumn(trade.chart15M, '3) 15M', leftColY);

    // Right column - Trade Details
    const rightX = margin + chartColWidth + 4;
    const detailLineHeight = 5;

    const addDetailLine = (label: string, value: string, yPos: number) => {
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text(label, rightX, yPos);
      pdf.setFont(undefined, 'normal');
      pdf.text(value, rightX + 22, yPos);
      return yPos + detailLineHeight;
    };

    rightColY = addDetailLine('DAY:', trade.day, rightColY);
    rightColY = addDetailLine('PAIR:', trade.pair, rightColY);
    rightColY = addDetailLine('TIME:', trade.time || '—', rightColY);
    rightColY = addDetailLine('BUY/SELL:', trade.direction, rightColY);
    rightColY = addDetailLine('ENTRY MODEL:', trade.entryModel, rightColY);

    // Emotions section
    if (trade.emotions) {
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text('EMOTIONS:', rightX, rightColY);
      rightColY += 3;
      pdf.setFont(undefined, 'normal');
      const emotionsLines = pdf.splitTextToSize(trade.emotions, 38);
      emotionsLines.slice(0, 2).forEach((line: string) => {
        pdf.text(line, rightX + 2, rightColY);
        rightColY += 3;
      });
    }

    rightColY = addDetailLine('CONFIDENCE:', `${trade.confidence}%`, rightColY);
    rightColY = addDetailLine('EXPECTED R:R:', trade.expectedRR.toFixed(2), rightColY);
    rightColY = addDetailLine('ACTUAL R:R:', trade.actualRR.toFixed(2), rightColY);
    rightColY = addDetailLine('RISK %:', `${trade.riskPercent.toFixed(2)}%`, rightColY);
    rightColY = addDetailLine('RESULT:', trade.result, rightColY);
    rightColY = addDetailLine('PROFIT/LOSS:', `$${trade.profitLoss.toFixed(2)}`, rightColY);
    rightColY = addDetailLine('BALANCE:', `$${trade.balance.toFixed(2)}`, rightColY);

    // Add notes on second page if exists
    if (trade.notes) {
      pdf.addPage();
      let notesY = margin;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('NOTES:', margin, notesY);
      notesY += 8;

      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      const notesLines = pdf.splitTextToSize(trade.notes, contentWidth);
      pdf.text(notesLines, margin, notesY);

      // Draw box around notes
      pdf.setDrawColor(100, 100, 100);
      pdf.rect(margin - 2, margin + 6, contentWidth + 4, pageHeight - (margin * 2) - 12);
    }

    // Save PDF
    pdf.save(`trade-${trade.tradeIdOfTotal}-${trade.date}.pdf`);
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
