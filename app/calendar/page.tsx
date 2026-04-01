'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, Bell, AlertCircle } from 'lucide-react';
import { getEconomicEventsFromStorage, saveEconomicEventToStorage, deleteEconomicEventFromStorage } from '@/lib/storage';
import { EconomicEvent } from '@/lib/types';

export default function EconomicCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterImpact, setFilterImpact] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    date: '',
    time: '',
    impact: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    forecast: '',
    previous: '',
    actual: '',
    currency: '',
    notes: '',
  });

  useEffect(() => {
    const savedEvents = getEconomicEventsFromStorage();
    setEvents(savedEvents);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const event: EconomicEvent = {
      id: Date.now().toString(),
      name: formData.name,
      country: formData.country,
      date: formData.date,
      time: formData.time,
      impact: formData.impact,
      forecast: formData.forecast,
      previous: formData.previous,
      actual: formData.actual,
      currency: formData.currency,
      notes: formData.notes,
    };

    saveEconomicEventToStorage(event);
    setEvents([...events, event]);
    setFormData({
      name: '',
      country: '',
      date: '',
      time: '',
      impact: 'MEDIUM',
      forecast: '',
      previous: '',
      actual: '',
      currency: '',
      notes: '',
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteEconomicEventFromStorage(id);
    setEvents(events.filter(e => e.id !== id));
  };

  const getImpactColor = (impact: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (impact) {
      case 'HIGH':
        return 'bg-red-100 dark:bg-red-950/30 border-red-200 dark:border-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800';
      case 'LOW':
        return 'bg-green-100 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    }
  };

  const getImpactTextColor = (impact: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (impact) {
      case 'HIGH':
        return 'text-red-700 dark:text-red-400';
      case 'MEDIUM':
        return 'text-yellow-700 dark:text-yellow-400';
      case 'LOW':
        return 'text-green-700 dark:text-green-400';
    }
  };

  const filteredEvents = events
    .filter(e => filterImpact === 'ALL' || e.impact === filterImpact)
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const upcomingEvents = filteredEvents.filter(e => {
    const eventDateTime = new Date(`${e.date}T${e.time}`);
    return eventDateTime > new Date();
  });

  const pastEvents = filteredEvents.filter(e => {
    const eventDateTime = new Date(`${e.date}T${e.time}`);
    return eventDateTime <= new Date();
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Economic Calendar</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            Add Event
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Add Economic Event</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g., Non-Farm Payrolls"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g., USA"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time (UTC) *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Impact *</label>
                  <select
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value as 'HIGH' | 'MEDIUM' | 'LOW' })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Forecast</label>
                  <input
                    type="text"
                    value={formData.forecast}
                    onChange={(e) => setFormData({ ...formData, forecast: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="Expected value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Previous</label>
                  <input
                    type="text"
                    value={formData.previous}
                    onChange={(e) => setFormData({ ...formData, previous: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="Previous reading"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Actual (After)</label>
                  <input
                    type="text"
                    value={formData.actual}
                    onChange={(e) => setFormData({ ...formData, actual: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="Actual result"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="e.g., USD"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setFormData({
                    name: '',
                    country: '',
                    date: '',
                    time: '',
                    impact: 'MEDIUM',
                    forecast: '',
                    previous: '',
                    actual: '',
                    currency: '',
                    notes: '',
                  });
                }}>
                  Cancel
                </Button>
                <Button type="submit">Add Event</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Impact Filter */}
        <div className="flex gap-2 mb-6">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(impact => (
            <Button
              key={impact}
              variant={filterImpact === impact ? 'default' : 'outline'}
              onClick={() => setFilterImpact(impact)}
              size="sm"
            >
              {impact === 'ALL' ? 'All Events' : `${impact} Impact`}
            </Button>
          ))}
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Upcoming Events
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <Card key={event.id} className={`p-4 border-l-4 ${getImpactColor(event.impact)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{event.name}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getImpactTextColor(event.impact)}`}>
                          {event.impact}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {event.country} • {new Date(`${event.date}T${event.time}`).toLocaleString()} UTC
                      </p>
                      {(event.forecast || event.previous) && (
                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                          {event.forecast && <p><span className="text-muted-foreground">Forecast:</span> {event.forecast}</p>}
                          {event.previous && <p><span className="text-muted-foreground">Previous:</span> {event.previous}</p>}
                        </div>
                      )}
                      {event.notes && <p className="text-sm italic text-muted-foreground">{event.notes}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Past Events
            </h2>
            <div className="space-y-3">
              {pastEvents.map(event => (
                <Card key={event.id} className={`p-4 border-l-4 opacity-75 ${getImpactColor(event.impact)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{event.name}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getImpactTextColor(event.impact)}`}>
                          {event.impact}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {event.country} • {new Date(`${event.date}T${event.time}`).toLocaleString()} UTC
                      </p>
                      {(event.forecast || event.previous || event.actual) && (
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {event.forecast && <p><span className="text-muted-foreground">Forecast:</span> {event.forecast}</p>}
                          {event.previous && <p><span className="text-muted-foreground">Previous:</span> {event.previous}</p>}
                          {event.actual && <p><span className="text-muted-foreground">Actual:</span> {event.actual}</p>}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No economic events yet. Add events to track important market catalysts.</p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-5 h-5" />
              Add First Event
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
}
