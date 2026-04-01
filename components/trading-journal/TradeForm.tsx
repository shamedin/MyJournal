'use client';

import React, { useState, useEffect } from 'react';
import { Trade, TradeFormData } from '@/lib/types';
import { saveTradeToStorage, getNextTradeId, getFormDraftFromStorage, saveFormDraftToStorage } from '@/lib/storage';
import { formatRRRatio } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChartImageUpload } from './ChartImageUpload';
import { toast } from 'sonner';

interface TradeFormProps {
  onTradeSubmit?: (trade: Trade) => void;
}

export function TradeForm({ onTradeSubmit }: TradeFormProps) {
  const [formData, setFormData] = useState<Partial<TradeFormData>>({});
  const [ids, setIds] = useState({ totalId: 0, dayId: 0 });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const draft = getFormDraftFromStorage();
    setIds(getNextTradeId());
    
    setFormData(prev => ({
      ...prev,
      ...draft,
      date: draft.date || today,
      day: draft.day || getDayName(new Date()),
    }));
  }, []);

  const getDayName = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    const updated = { ...formData, [name]: newValue };
    setFormData(updated);
    saveFormDraftToStorage(updated);
  };

  const handleImageChange = (timeframe: '1D' | '4H' | '15M', base64: string) => {
    const chartKey = `chart${timeframe}` as keyof TradeFormData;
    const updated = { ...formData, [chartKey]: base64 };
    setFormData(updated);
    saveFormDraftToStorage(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pair || !formData.entryModel) {
      toast.error('Please fill in required fields (Pair, Strategy)');
      return;
    }

    const trade: Trade = {
      id: `${Date.now()}-${Math.random()}`,
      tradeIdOfTotal: ids.totalId,
      tradeIdFromToday: ids.dayId,
      date: formData.date || new Date().toISOString().split('T')[0],
      day: formData.day || getDayName(new Date()),
      pair: formData.pair || '',
      time: formData.time || '',
      direction: formData.direction as 'BUY' | 'SELL' || 'BUY',
      entryModel: formData.entryModel || '',
      emotions: formData.emotions || '',
      confidence: formData.confidence || 0,
      expectedRR: formData.expectedRR || 0,
      actualRR: formData.actualRR || 0,
      riskPercent: formData.riskPercent || 0,
      result: formData.result as 'WIN' | 'LOSS' || 'WIN',
      profitLoss: formData.profitLoss || 0,
      balance: formData.balance || 0,
      initialBalance: formData.initialBalance || 0,
      notes: formData.notes || '',
      tags: (formData.tags || '').split(',').filter(t => t.trim()),
      chart1D: formData.chart1D || '',
      chart4H: formData.chart4H || '',
      chart15M: formData.chart15M || '',
      createdAt: new Date().toISOString(),
    };

    saveTradeToStorage(trade);
    setFormData({});
    saveFormDraftToStorage({});
    toast.success('Trade saved successfully!');
    
    if (onTradeSubmit) {
      onTradeSubmit(trade);
    }

    window.location.href = '/journal';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Label htmlFor="date" className="text-sm font-semibold">DATE:</Label>
            <Input
              id="date"
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleInputChange}
              required
              className="mt-1 font-mono"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold text-muted-foreground">Trade ID of Total Trades:</Label>
            <Input
              type="number"
              value={ids.totalId}
              onChange={(e) => setIds({ ...ids, totalId: parseInt(e.target.value) || 0 })}
              className="mt-1 font-mono font-bold"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground">Trade ID from Today:</Label>
            <Input
              type="number"
              value={ids.dayId}
              onChange={(e) => setIds({ ...ids, dayId: parseInt(e.target.value) || 0 })}
              className="mt-1 font-mono font-bold"
            />
          </div>
        </div>
      </div>

      {/* Main Layout - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN - Chart Screenshots */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm">SCREENSHOTS</h3>
          
          <div className="space-y-4">
            {/* 1D Chart */}
            <div>
              <Label className="text-xs font-bold mb-2 block">1) 1D</Label>
              <div className="border-2 border-border rounded bg-muted/30 overflow-hidden">
                <ChartImageUpload 
                  timeframe="1D"
                  imageSrc={formData.chart1D}
                  onImageChange={(base64) => handleImageChange('1D', base64)}
                />
              </div>
            </div>

            {/* 4H Chart */}
            <div>
              <Label className="text-xs font-bold mb-2 block">2) 4H</Label>
              <div className="border-2 border-border rounded bg-muted/30 overflow-hidden">
                <ChartImageUpload 
                  timeframe="4H"
                  imageSrc={formData.chart4H}
                  onImageChange={(base64) => handleImageChange('4H', base64)}
                />
              </div>
            </div>

            {/* 15M Chart */}
            <div>
              <Label className="text-xs font-bold mb-2 block">3) 15M</Label>
              <div className="border-2 border-border rounded bg-muted/30 overflow-hidden">
                <ChartImageUpload 
                  timeframe="15M"
                  imageSrc={formData.chart15M}
                  onImageChange={(base64) => handleImageChange('15M', base64)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Trade Details */}
        <div className="space-y-4">
          <div className="space-y-3">
            {/* Row 1: Day, Pair */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="day" className="text-xs font-bold">DAY:</Label>
                <Input
                  id="day"
                  type="text"
                  name="day"
                  value={formData.day || ''}
                  disabled
                  className="bg-muted text-xs mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pair" className="text-xs font-bold">PAIR:</Label>
                <Input
                  id="pair"
                  name="pair"
                  placeholder="EURUSD"
                  value={formData.pair || ''}
                  onChange={handleInputChange}
                  required
                  className="text-xs mt-1"
                />
              </div>
            </div>

            {/* Row 2: Time, Direction */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time" className="text-xs font-bold">TIME:</Label>
                <Input
                  id="time"
                  type="time"
                  name="time"
                  value={formData.time || ''}
                  onChange={handleInputChange}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <Label htmlFor="direction" className="text-xs font-bold">BUY/SELL:</Label>
                <select
                  id="direction"
                  name="direction"
                  value={formData.direction || 'BUY'}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 text-xs rounded border border-border bg-background"
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
            </div>

            {/* Row 3: Entry Model */}
            <div>
              <Label htmlFor="entryModel" className="text-xs font-bold">ENTRY MODEL:</Label>
              <Input
                id="entryModel"
                name="entryModel"
                placeholder="e.g., Breakout, Pullback"
                value={formData.entryModel || ''}
                onChange={handleInputChange}
                required
                className="text-xs mt-1"
              />
            </div>

            {/* Row 4: Emotions */}
            <div>
              <Label htmlFor="emotions" className="text-xs font-bold">EMOTIONS:</Label>
              <Textarea
                id="emotions"
                name="emotions"
                placeholder="How were you feeling?"
                value={formData.emotions || ''}
                onChange={handleInputChange}
                rows={2}
                className="text-xs mt-1 resize-none"
              />
            </div>

            {/* Row 5: Confidence */}
            <div>
              <Label htmlFor="confidence" className="text-xs font-bold">CONFIDENCE: {formData.confidence || 0}%</Label>
              <input
                id="confidence"
                type="range"
                name="confidence"
                min="0"
                max="100"
                value={formData.confidence || 0}
                onChange={handleInputChange}
                className="w-full mt-1"
              />
            </div>

            {/* Row 6: Risk/Reward */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedRR" className="text-xs font-bold">
                  EXPECTED R:R: {formData.expectedRR ? formatRRRatio(formData.expectedRR) : '—'}
                </Label>
                <Input
                  id="expectedRR"
                  type="number"
                  step="0.1"
                  name="expectedRR"
                  placeholder="1.5"
                  value={formData.expectedRR || ''}
                  onChange={handleInputChange}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <Label htmlFor="actualRR" className="text-xs font-bold">
                  ACTUAL R:R: {formData.actualRR ? formatRRRatio(formData.actualRR) : '—'}
                </Label>
                <Input
                  id="actualRR"
                  type="number"
                  step="0.1"
                  name="actualRR"
                  placeholder="1.2"
                  value={formData.actualRR || ''}
                  onChange={handleInputChange}
                  className="text-xs mt-1"
                />
              </div>
            </div>

            {/* Row 7: Risk % */}
            <div>
              <Label htmlFor="riskPercent" className="text-xs font-bold">RISK %:</Label>
              <Input
                id="riskPercent"
                type="number"
                step="0.1"
                name="riskPercent"
                placeholder="2"
                value={formData.riskPercent || ''}
                onChange={handleInputChange}
                className="text-xs mt-1"
              />
            </div>

            {/* Row 8: Result & P&L */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="result" className="text-xs font-bold">RESULT:</Label>
                <select
                  id="result"
                  name="result"
                  value={formData.result || 'WIN'}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 text-xs rounded border border-border bg-background mt-1"
                >
                  <option value="WIN">WIN</option>
                  <option value="LOSS">LOSS</option>
                </select>
              </div>
              <div>
                <Label htmlFor="profitLoss" className="text-xs font-bold">PROFIT/LOSS:</Label>
                <Input
                  id="profitLoss"
                  type="number"
                  step="0.01"
                  name="profitLoss"
                  placeholder="100"
                  value={formData.profitLoss || ''}
                  onChange={handleInputChange}
                  className="text-xs mt-1"
                />
              </div>
            </div>

            {/* Row 9: Initial Balance & Current Balance */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialBalance" className="text-xs font-bold">INITIAL BALANCE:</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  name="initialBalance"
                  placeholder="10000"
                  value={formData.initialBalance || ''}
                  onChange={handleInputChange}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <Label htmlFor="balance" className="text-xs font-bold">CURRENT BALANCE:</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  name="balance"
                  placeholder="10000"
                  value={formData.balance || ''}
                  onChange={handleInputChange}
                  className="text-xs mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section - Full Width */}
      <div className="border-t border-border pt-6 space-y-3">
        <h3 className="font-bold text-sm">NOTES:</h3>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Detailed notes about this trade..."
          value={formData.notes || ''}
          onChange={handleInputChange}
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-xs font-semibold">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="scalp, breakout, high-volatility"
          value={formData.tags || ''}
          onChange={handleInputChange}
          className="text-sm"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-6 border-t border-border">
        <Button type="submit" className="flex-1" size="lg">
          Save Trade
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            setFormData({});
            saveFormDraftToStorage({});
            toast.success('Form cleared');
          }}
          size="lg"
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
