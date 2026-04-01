import { Trade } from './types';
import { formatRRRatio } from './calculations';
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
    pdf.setFont(undefined, 'bold', 'underline');
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

    // ============ MAIN LAYOUT - TWO COLUMNS ============
    const chartColWidth = (contentWidth * 0.6);
    const infoColWidth = (contentWidth * 0.4) - 2;
    const chartColX = margin;
    const infoColX = margin + chartColWidth + 2;

    // ============ LEFT COLUMN - SCREENSHOTS (FULL HEIGHT, ONE COLUMN) ============
    let chartY = yPos;
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.text('SCREENSHOTS', chartColX, chartY);
    chartY += 3;

    const chartBoxHeight = 72;
    const chartSpacing = 1;

    // Helper to add chart with border in one column
    const addChartBox = (imageData: string | undefined, label: string, yPos: number) => {
      // Label
      pdf.setFontSize(7);
      pdf.setFont(undefined, 'bold');
      pdf.text(label, chartColX, yPos - 0.5);

      // Border box
      pdf.setDrawColor(150, 150, 150);
      pdf.rect(chartColX, yPos, chartColWidth, chartBoxHeight);

      // Add image if exists
      if (imageData) {
        try {
          pdf.addImage(imageData, 'JPEG', chartColX + 0.5, yPos + 0.5, chartColWidth - 1, chartBoxHeight - 1);
        } catch (e) {
          // Image error - just keep empty box
        }
      }
    };

    // Add all three charts vertically in left column
    addChartBox(trade.chart1D, '1) 1D', chartY);
    chartY += chartBoxHeight + chartSpacing;
    addChartBox(trade.chart4H, '2) 4H', chartY);
    chartY += chartBoxHeight + chartSpacing;
    addChartBox(trade.chart15M, '3) 15M', chartY);
    chartY += chartBoxHeight + chartSpacing;

    // ============ RIGHT COLUMN - TRADE INFO (COMPACT) ============
    let infoY = yPos;
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('TRADE INFO', infoColX, infoY);
    infoY += 3;

    pdf.setFontSize(6.5);
    const infoLineHeight = 2.8;

    const addCompactInfo = (label: string, value: string, y: number) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(label + ':', infoColX, y);
      pdf.setFont(undefined, 'normal');
      // Truncate long values
      const truncValue = value.length > 12 ? value.substring(0, 12) + '.' : value;
      pdf.text(truncValue, infoColX + 13, y);
      return y + infoLineHeight;
    };

    infoY = addCompactInfo('Day', trade.day, infoY);
    infoY = addCompactInfo('Pair', trade.pair, infoY);
    infoY = addCompactInfo('Time', trade.time || '—', infoY);
    infoY = addCompactInfo('Dir', trade.direction, infoY);
    infoY = addCompactInfo('Strat', trade.entryModel.substring(0, 10), infoY);
    infoY += 0.5;
    infoY = addCompactInfo('Conf%', `${trade.confidence}`, infoY);
    infoY = addCompactInfo('ExpRR', formatRRRatio(trade.expectedRR), infoY);
    infoY = addCompactInfo('ActRR', formatRRRatio(trade.actualRR), infoY);
    infoY = addCompactInfo('Risk%', `${trade.riskPercent.toFixed(1)}`, infoY);
    infoY += 0.5;
    infoY = addCompactInfo('Result', trade.result, infoY);
    infoY = addCompactInfo('P&L', `$${Math.abs(trade.profitLoss).toFixed(0)}`, infoY);
    if (trade.initialBalance > 0) {
      infoY = addCompactInfo('InitBal', `$${(trade.initialBalance / 1000).toFixed(1)}k`, infoY);
      infoY = addCompactInfo('CurBal', `$${(trade.balance / 1000).toFixed(1)}k`, infoY);
    } else {
      infoY = addCompactInfo('Balance', `$${(trade.balance / 1000).toFixed(1)}k`, infoY);
    }

    // Move to next section below content
    yPos = Math.max(chartY, infoY) + 3;

    // ============ EMOTIONS SECTION (SMALL) ============
    if (trade.emotions) {
      pdf.setFontSize(7);
      pdf.setFont(undefined, 'bold');
      pdf.text('EMOTIONS:', margin, yPos);
      yPos += 5;

      pdf.setFontSize(7);
      pdf.setFont(undefined, 'normal');
      const emotionsLines = pdf.splitTextToSize(trade.emotions, contentWidth - 2);
      emotionsLines.slice(0, 1).forEach((line: string) => {
        pdf.text(line, margin, yPos);
        yPos += 2;
      });
      yPos += 1;
    }

    // ============ NOTES SECTION - 5 LINES FOR WRITING ============
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('NOTES:', margin, yPos);
    yPos += 2.5;

    // Notes box with border
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.4);
    const notesBoxHeight = 5 * 4.5; // 5 lines, each 4.5mm apart
    pdf.rect(margin, yPos, contentWidth, notesBoxHeight);

    // Add 5 horizontal lines for writing/drawing
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.15);
    const lineSpacing = 4.5;
    for (let i = 0; i < 5; i++) {
      const lineY = yPos + 2 + (i * lineSpacing);
      pdf.line(margin + 2, lineY, pageWidth - margin - 2, lineY);
    }

    // Add notes text if exists (small, upper area)
    if (trade.notes) {
      pdf.setFontSize(6);
      pdf.setFont(undefined, 'normal');
      const notesLines = pdf.splitTextToSize(trade.notes, contentWidth - 4);
      let notesTextY = yPos + 1.5;

      notesLines.slice(0, 3).forEach((line: string) => {
        if (notesTextY < yPos + notesBoxHeight - 2) {
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
      'Expected R:R': formatRRRatio(trade.expectedRR),
      'Actual R:R': formatRRRatio(trade.actualRR),
      'Risk %': trade.riskPercent,
      'Result': trade.result,
      'Profit/Loss': trade.profitLoss,
      'Initial Balance': trade.initialBalance || '—',
      'Current Balance': trade.balance,
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
      'Expected R:R': formatRRRatio(trade.expectedRR),
      'Actual R:R': formatRRRatio(trade.actualRR),
      'Risk %': trade.riskPercent,
      'Result': trade.result,
      'Profit/Loss': trade.profitLoss,
      'Initial Balance': trade.initialBalance || '—',
      'Current Balance': trade.balance,
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
