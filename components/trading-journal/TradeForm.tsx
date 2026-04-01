'use client';

import React, { useState, useEffect } from 'react';
import { Trade, TradeFormData } from '@/lib/types';
import { saveTradeToStorage, getNextTradeId, getFormDraftFromStorage, saveFormDraftToStorage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChartImageUpload } from './ChartImageUpload';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

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
      tradeIdOfDay: ids.dayId,
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            name="date"
            value={formData.date || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="day">Day</Label>
          <Input
            id="day"
            type="text"
            name="day"
            value={formData.day || ''}
            disabled
            className="bg-muted"
          />
        </div>
        <div>
          <Label>Trade # Total</Label>
          <Input
            type="text"
            value={ids.totalId}
            disabled
            className="bg-muted"
          />
        </div>
        <div>
          <Label>Trade # Today</Label>
          <Input
            type="text"
            value={ids.dayId}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Chart Screenshots</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">1D Chart</Label>
            <ChartImageUpload 
              timeframe="1D"
              imageSrc={formData.chart1D}
              onImageChange={(base64) => handleImageChange('1D', base64)}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">4H Chart</Label>
            <ChartImageUpload 
              timeframe="4H"
              imageSrc={formData.chart4H}
              onImageChange={(base64) => handleImageChange('4H', base64)}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">15M Chart</Label>
            <ChartImageUpload 
              timeframe="15M"
              imageSrc={formData.chart15M}
              onImageChange={(base64) => handleImageChange('15M', base64)}
            />
          </div>
        </div>
      </div>

      {/* Trade Details Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Trade Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="pair">Pair *</Label>
            <Input
              id="pair"
              name="pair"
              placeholder="EURUSD"
              value={formData.pair || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              name="time"
              value={formData.time || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="direction">Direction</Label>
            <select
              id="direction"
              name="direction"
              value={formData.direction || 'BUY'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Strategy & Psychology */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Strategy & Psychology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="entryModel">Entry Model/Strategy *</Label>
            <Input
              id="entryModel"
              name="entryModel"
              placeholder="e.g., Breakout, Pullback"
              value={formData.entryModel || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="confidence">Confidence: {formData.confidence || 0}%</Label>
            <input
              id="confidence"
              type="range"
              name="confidence"
              min="0"
              max="100"
              value={formData.confidence || 0}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="emotions">Emotions & Mental State</Label>
          <Textarea
            id="emotions"
            name="emotions"
            placeholder="How were you feeling during this trade?"
            value={formData.emotions || ''}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>

      {/* Risk & Reward */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Risk & Reward</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="expectedRR">Expected R:R</Label>
            <Input
              id="expectedRR"
              type="number"
              step="0.1"
              name="expectedRR"
              placeholder="1.5"
              value={formData.expectedRR || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="actualRR">Actual R:R</Label>
            <Input
              id="actualRR"
              type="number"
              step="0.1"
              name="actualRR"
              placeholder="1.2"
              value={formData.actualRR || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="riskPercent">Risk %</Label>
            <Input
              id="riskPercent"
              type="number"
              step="0.1"
              name="riskPercent"
              placeholder="2"
              value={formData.riskPercent || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="result">Result</Label>
            <select
              id="result"
              name="result"
              value={formData.result || 'WIN'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="WIN">WIN</option>
              <option value="LOSS">LOSS</option>
            </select>
          </div>
        </div>
      </div>

      {/* P&L & Balance */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">P&L & Balance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="profitLoss">Profit/Loss ($)</Label>
            <Input
              id="profitLoss"
              type="number"
              step="0.01"
              name="profitLoss"
              placeholder="100"
              value={formData.profitLoss || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="balance">Account Balance ($)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              name="balance"
              placeholder="10000"
              value={formData.balance || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Notes & Tags */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Notes & Tags</h3>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="scalp, breakout, high-volatility"
            value={formData.tags || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="notes">Trade Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Detailed notes about this trade..."
            value={formData.notes || ''}
            onChange={handleInputChange}
            rows={4}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-6">
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
