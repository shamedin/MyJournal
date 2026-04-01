export interface Trade {
  id: string;
  tradeIdOfTotal: number;
  tradeIdFromToday: number;
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
  initialBalance: number;
  
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
  initialBalance: number;
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

export interface TradingSetup {
  id: string;
  name: string;
  description: string;
  category: string;
  entryRules: string;
  exitRules: string;
  riskRewardRatio: number;
  tags: string[];
  createdAt: string;
  linkedTrades: string[]; // Trade IDs that used this setup
  winRate: number;
  totalUsed: number;
}

export interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  date: string;
  time: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  forecast: string;
  previous: string;
  actual: string;
  currency: string;
  notes: string;
}

export interface TradingReport {
  id: string;
  month: string;
  year: number;
  startDate: string;
  endDate: string;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  totalProfit: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  averageWin: number;
  averageLoss: number;
  topSetup: TradingSetup | null;
  emotionalInsights: string;
  areasForImprovement: string[];
  lessonsLearned: string[];
  nextMonthGoals: string[];
  createdAt: string;
}
