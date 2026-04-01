export interface Trade {
  id: string;
  tradeIdOfTotal: number;
  tradeIdOfDay: number;
  date: string;
  
  // Charts/Screenshots
  chart1D: string;
  chart4H: string;
  chart15M: string;
  
  // Trade Details
  day: string;
  pair: string;
  time: string;
  direction: 'BUY' | 'SELL';
  entryModel: string;
  emotions: string;
  confidence: number;
  
  // Risk/Reward
  expectedRR: number;
  actualRR: number;
  riskPercent: number;
  
  // Results
  result: 'WIN' | 'LOSS';
  profitLoss: number;
  balance: number;
  
  // Notes & Tags
  notes: string;
  tags: string[];
  
  // Metadata
  createdAt: string;
}

export interface TradeFormData {
  date: string;
  day: string;
  pair: string;
  time: string;
  direction: 'BUY' | 'SELL';
  entryModel: string;
  emotions: string;
  confidence: number;
  expectedRR: number;
  actualRR: number;
  riskPercent: number;
  result: 'WIN' | 'LOSS';
  profitLoss: number;
  balance: number;
  notes: string;
  tags: string;
  chart1D: string;
  chart4H: string;
  chart15M: string;
}

export interface Statistics {
  totalTrades: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  totalProfit: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  averageRR: number;
  profitFactor: number;
}
