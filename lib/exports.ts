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
    const margin = 5;
    const contentWidth = pageWidth - (margin * 2);

    // White background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    let yPos = margin;

    // ============ HEADER SECTION ============
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.text('TRADING JOURNAL', margin, yPos);
    yPos += 7;

    // Header line
    pdf.setDrawColor(100, 100, 100);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;

    // Date and Trade IDs
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const dateStr = new Date(trade.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`DATE: ${dateStr}`, margin, yPos);
    yPos += 5;

    pdf.setFontSize(9);
    const col1X = margin;
    const col2X = margin + (contentWidth / 2);
    pdf.text(`Trade ID (Total): ${trade.tradeIdOfTotal}`, col1X, yPos);
    pdf.text(`Trade ID (Today): ${trade.tradeIdFromToday}`, col2X, yPos);
    yPos += 6;

    // ============ CHARTS SECTION (FULL WIDTH, LARGE) ============
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('SCREENSHOTS', margin, yPos);
    yPos += 4;

    // Calculate optimal chart layout
    const chartBoxWidth = (contentWidth - 4) / 3;
    const chartBoxHeight = 38;

    // Helper to add chart with border
    const addChartBox = (imageData: string | undefined, label: string, xPos: number, yPos: number) => {
      // Label
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text(label, xPos, yPos - 2);

      // Border box
      pdf.setDrawColor(150, 150, 150);
      pdf.rect(xPos, yPos, chartBoxWidth, chartBoxHeight);

      // Add image if exists
      if (imageData) {
        try {
          pdf.addImage(imageData, 'JPEG', xPos + 1, yPos + 1, chartBoxWidth - 2, chartBoxHeight - 2);
        } catch (e) {
          // Image error - just keep empty box
        }
      }
    };

    // Add all three charts in a row
    addChartBox(trade.chart1D, '1D', margin, yPos);
    addChartBox(trade.chart4H, '4H', margin + chartBoxWidth + 2, yPos);
    addChartBox(trade.chart15M, '15M', margin + (chartBoxWidth + 2) * 2, yPos);

    yPos += chartBoxHeight + 5;

    // ============ TRADE INFO SECTION ============
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('TRADE INFORMATION', margin, yPos);
    yPos += 4;

    pdf.setDrawColor(150, 150, 150);
    pdf.line(margin, yPos - 1, pageWidth - margin, yPos - 1);

    pdf.setFontSize(9);
    const labelWidth = 30;
    const colHeight = 4.5;
    let infoY = yPos;

    // Two columns for trade info
    const infoLeft = margin;
    const infoRight = margin + (contentWidth / 2);

    // Helper to add info line
    const addInfoLine = (label: string, value: string, x: number, y: number) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(label, x, y);
      pdf.setFont(undefined, 'normal');
      pdf.text(value, x + labelWidth, y);
    };

    // Left column
    addInfoLine('Day:', trade.day, infoLeft, infoY);
    addInfoLine('Pair:', trade.pair, infoLeft, infoY + colHeight);
    addInfoLine('Time:', trade.time || '—', infoLeft, infoY + colHeight * 2);
    addInfoLine('Direction:', trade.direction, infoLeft, infoY + colHeight * 3);
    addInfoLine('Strategy:', trade.entryModel, infoLeft, infoY + colHeight * 4);
    addInfoLine('Confidence:', `${trade.confidence}%`, infoLeft, infoY + colHeight * 5);

    // Right column
    addInfoLine('Result:', trade.result, infoRight, infoY);
    addInfoLine('Expected R:R:', trade.expectedRR.toFixed(2), infoRight, infoY + colHeight);
    addInfoLine('Actual R:R:', trade.actualRR.toFixed(2), infoRight, infoY + colHeight * 2);
    addInfoLine('Risk %:', `${trade.riskPercent.toFixed(2)}%`, infoRight, infoY + colHeight * 3);
    addInfoLine('Profit/Loss:', `$${trade.profitLoss.toFixed(2)}`, infoRight, infoY + colHeight * 4);
    addInfoLine('Balance:', `$${trade.balance.toFixed(2)}`, infoRight, infoY + colHeight * 5);

    yPos = infoY + colHeight * 6 + 2;

    // ============ EMOTIONS SECTION ============
    if (trade.emotions) {
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text('EMOTIONS & MENTAL STATE', margin, yPos);
      yPos += 3;

      pdf.setDrawColor(150, 150, 150);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 2;

      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      const emotionsLines = pdf.splitTextToSize(trade.emotions, contentWidth - 2);
      emotionsLines.slice(0, 2).forEach((line: string) => {
        pdf.text(line, margin, yPos);
        yPos += 3.5;
      });
      yPos += 2;
    }

    // ============ LARGE NOTES SECTION ============
    const notesStartY = yPos;
    const notesHeight = pageHeight - margin - notesStartY - 5;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('NOTES', margin, notesStartY);

    // Notes box with border
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, notesStartY + 3, contentWidth, notesHeight);

    // Add notebook-style lines
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    const lineSpacing = 5;
    for (let i = notesStartY + 8; i < notesStartY + 3 + notesHeight; i += lineSpacing) {
      pdf.line(margin + 2, i, pageWidth - margin - 2, i);
    }

    // Add notes text
    if (trade.notes) {
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      const notesLines = pdf.splitTextToSize(trade.notes, contentWidth - 4);
      let notesTextY = notesStartY + 6;
      
      notesLines.forEach((line: string) => {
        if (notesTextY < notesStartY + 3 + notesHeight - 3) {
          pdf.text(line, margin + 2, notesTextY);
          notesTextY += lineSpacing;
        }
      });
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
