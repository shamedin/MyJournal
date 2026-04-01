import { Trade, TradeFormData } from './types';

const TRADES_STORAGE_KEY = 'trading-journal-trades';
const FORM_DRAFT_KEY = 'trading-journal-draft';

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
