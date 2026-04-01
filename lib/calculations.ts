import { Trade, Statistics } from './types';

export function calculateStatistics(trades: Trade[]): Statistics {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winCount: 0,
      lossCount: 0,
      winRate: 0,
      totalProfit: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      averageRR: 0,
      profitFactor: 0,
    };
  }

  const winTrades = trades.filter(t => t.result === 'WIN');
  const lossTrades = trades.filter(t => t.result === 'LOSS');

  const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
  const totalWins = winTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
  const totalLosses = Math.abs(lossTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0));

  const averageWin = winTrades.length > 0 ? totalWins / winTrades.length : 0;
  const averageLoss = lossTrades.length > 0 ? totalLosses / lossTrades.length : 0;

  const largestWin = winTrades.length > 0 ? Math.max(...winTrades.map(t => t.profitLoss)) : 0;
  const largestLoss = lossTrades.length > 0 ? Math.min(...lossTrades.map(t => t.profitLoss)) : 0;

  const averageRR = trades.length > 0 
    ? trades.reduce((sum, t) => sum + (t.actualRR || 0), 0) / trades.length 
    : 0;

  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : (totalWins > 0 ? Infinity : 0);

  return {
    totalTrades: trades.length,
    winCount: winTrades.length,
    lossCount: lossTrades.length,
    winRate: (winTrades.length / trades.length) * 100,
    totalProfit,
    averageWin,
    averageLoss,
    largestWin,
    largestLoss,
    averageRR,
    profitFactor,
  };
}

export function getEquityCurve(trades: Trade[]): Array<{ date: string; balance: number }> {
  const sorted = [...trades].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  const equityCurve: Array<{ date: string; balance: number }> = [];
  sorted.forEach(trade => {
    equityCurve.push({
      date: trade.date,
      balance: trade.balance,
    });
  });
  
  return equityCurve;
}

export function getStrategyBreakdown(trades: Trade[]): Array<{ strategy: string; count: number; winRate: number }> {
  const grouped: Record<string, Trade[]> = {};
  
  trades.forEach(trade => {
    const strategy = trade.entryModel || 'Unknown';
    if (!grouped[strategy]) {
      grouped[strategy] = [];
    }
    grouped[strategy].push(trade);
  });
  
  return Object.entries(grouped).map(([strategy, strategyTrades]) => ({
    strategy,
    count: strategyTrades.length,
    winRate: (strategyTrades.filter(t => t.result === 'WIN').length / strategyTrades.length) * 100,
  }));
}

export function getWinLossDistribution(trades: Trade[]): { wins: number; losses: number } {
  return {
    wins: trades.filter(t => t.result === 'WIN').length,
    losses: trades.filter(t => t.result === 'LOSS').length,
  };
}
