'use client';

import React from 'react';
import { Plus, Trash2, ArrowDown } from 'lucide-react';
import type { AQAReadingQuestion, TimeSequenceData } from '@/types/aqa-reading-admin';

interface TimeSequenceEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function TimeSequenceEditor({ question, onUpdate }: TimeSequenceEditorProps) {
  const data = question.question_data as TimeSequenceData;

  const updateData = (updates: Partial<TimeSequenceData>) => {
    onUpdate({ question_data: { ...data, ...updates } });
  };

  const addEvent = () => {
    const newEvents = [
      ...(data.events || []),
      { letter: String.fromCharCode(65 + (data.events?.length || 0)), event: '' },
    ];
    updateData({ events: newEvents });
  };

  const updateEvent = (index: number, field: 'letter' | 'event', value: string) => {
    const newEvents = [...(data.events || [])];
    newEvents[index] = { ...newEvents[index], [field]: value };
    updateData({ events: newEvents });
  };

  const deleteEvent = (index: number) => {
    const deletedLetter = data.events?.[index]?.letter;
    const newEvents = (data.events || []).filter((_, i) => i !== index);
    const newOrder = (data.correctOrder || []).filter((letter) => letter !== deletedLetter);
    updateData({ events: newEvents, correctOrder: newOrder });
  };

  const updateCorrectOrder = (value: string) => {
    const letters = value.split(',').map((l) => l.trim()).filter((l) => l);
    updateData({ correctOrder: letters });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">Events</label>
          <button
            onClick={addEvent}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3 h-3" />
            Add Event
          </button>
        </div>
        <div className="space-y-2">
          {(data.events || []).map((event, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={event.letter}
                onChange={(e) => updateEvent(index, 'letter', e.target.value)}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold"
                placeholder="A"
                maxLength={1}
              />
              <input
                type="text"
                value={event.event}
                onChange={(e) => updateEvent(index, 'event', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Event description"
              />
              <button onClick={() => deleteEvent(index)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <ArrowDown className="w-4 h-4" />
          Correct Order (Chronological)
        </label>
        <input
          type="text"
          value={(data.correctOrder || []).join(', ')}
          onChange={(e) => updateCorrectOrder(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g., C, A, D, B (comma-separated letters)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the letters in the correct chronological order, separated by commas
        </p>
      </div>
    </div>
  );
}

