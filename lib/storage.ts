import { Trade, TradeFormData, TradingSetup, EconomicEvent, TradingReport } from './types';

const TRADES_STORAGE_KEY = 'trading-journal-trades';
const FORM_DRAFT_KEY = 'trading-journal-draft';
const SETUPS_STORAGE_KEY = 'trading-journal-setups';
const ECONOMIC_EVENTS_KEY = 'trading-journal-events';
const REPORTS_STORAGE_KEY = 'trading-journal-reports';

export function getTradesFromStorage(): Trade[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(TRADES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveTradeToStorage(trade: Trade): void {
  if (typeof window === 'undefined') return;
  
  const trades = getTradesFromStorage();
  const existingIndex = trades.findIndex(t => t.id === trade.id);
  
  if (existingIndex >= 0) {
    trades[existingIndex] = trade;
  } else {
    trades.push(trade);
  }
  
  localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
}

export function deleteTradeFromStorage(id: string): void {
  if (typeof window === 'undefined') return;
  
  const trades = getTradesFromStorage();
  const filtered = trades.filter(t => t.id !== id);
  localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(filtered));
}

export function getFormDraftFromStorage(): Partial<TradeFormData> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(FORM_DRAFT_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function saveFormDraftToStorage(data: Partial<TradeFormData>): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(data));
}

export function clearFormDraftFromStorage(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(FORM_DRAFT_KEY);
}

export function getNextTradeId(): { totalId: number; dayId: number } {
  const trades = getTradesFromStorage();
  const today = new Date().toISOString().split('T')[0];
  
  const totalId = trades.length + 1;
  const todaysTrades = trades.filter(t => t.date === today);
  const dayId = todaysTrades.length + 1;
  
  return { totalId, dayId };
}

// Trading Setups Storage
export function getSetupsFromStorage(): TradingSetup[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(SETUPS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveSetupToStorage(setup: TradingSetup): void {
  if (typeof window === 'undefined') return;
  
  const setups = getSetupsFromStorage();
  const existingIndex = setups.findIndex(s => s.id === setup.id);
  
  if (existingIndex >= 0) {
    setups[existingIndex] = setup;
  } else {
    setups.push(setup);
  }
  
  localStorage.setItem(SETUPS_STORAGE_KEY, JSON.stringify(setups));
}

export function deleteSetupFromStorage(id: string): void {
  if (typeof window === 'undefined') return;
  
  const setups = getSetupsFromStorage();
  const filtered = setups.filter(s => s.id !== id);
  localStorage.setItem(SETUPS_STORAGE_KEY, JSON.stringify(filtered));
}

// Economic Events Storage
export function getEconomicEventsFromStorage(): EconomicEvent[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(ECONOMIC_EVENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveEconomicEventToStorage(event: EconomicEvent): void {
  if (typeof window === 'undefined') return;
  
  const events = getEconomicEventsFromStorage();
  const existingIndex = events.findIndex(e => e.id === event.id);
  
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }
  
  localStorage.setItem(ECONOMIC_EVENTS_KEY, JSON.stringify(events));
}

export function deleteEconomicEventFromStorage(id: string): void {
  if (typeof window === 'undefined') return;
  
  const events = getEconomicEventsFromStorage();
  const filtered = events.filter(e => e.id !== id);
  localStorage.setItem(ECONOMIC_EVENTS_KEY, JSON.stringify(filtered));
}

// Reports Storage
export function getReportsFromStorage(): TradingReport[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveReportToStorage(report: TradingReport): void {
  if (typeof window === 'undefined') return;
  
  const reports = getReportsFromStorage();
  const existingIndex = reports.findIndex(r => r.id === report.id);
  
  if (existingIndex >= 0) {
    reports[existingIndex] = report;
  } else {
    reports.push(report);
  }
  
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

export function deleteReportFromStorage(id: string): void {
  if (typeof window === 'undefined') return;
  
  const reports = getReportsFromStorage();
  const filtered = reports.filter(r => r.id !== id);
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(filtered));
}
