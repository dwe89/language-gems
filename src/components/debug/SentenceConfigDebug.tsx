'use client';

import React, { useState } from 'react';

interface SentenceConfig {
  source: 'theme' | 'topic' | 'custom' | 'create' | '';
  theme?: string;
  topic?: string;
  customSetId?: string;
  customSet?: any;
  sentenceCount?: number;
  difficulty?: string;
  grammarFocus?: string;
}

export default function SentenceConfigDebug() {
  const [sentenceConfig, setSentenceConfig] = useState<SentenceConfig>({
    source: '',
    theme: '',
    topic: '',
    sentenceCount: 10,
    difficulty: 'intermediate'
  });

  const isConfigured = sentenceConfig.source && (sentenceConfig.theme || sentenceConfig.topic || sentenceConfig.customSetId);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Sentence Configuration Debug</h2>
      
      {/* Configuration Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Configuration Status:</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isConfigured ? '✓ Configured' : '⚠ Needs setup'}
        </span>
      </div>

      {/* Source Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Content Source</label>
        <select
          value={sentenceConfig.source}
          onChange={(e) => setSentenceConfig({...sentenceConfig, source: e.target.value as any})}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Choose source...</option>
          <option value="theme">📚 Theme-based sentences</option>
          <option value="topic">🎯 Topic-based sentences</option>
          <option value="custom">📝 Custom sentence set</option>
          <option value="create">➕ Create new sentence set</option>
        </select>
      </div>

      {/* Theme Selection */}
      {sentenceConfig.source === 'theme' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select
            value={sentenceConfig.theme || ''}
            onChange={(e) => setSentenceConfig({...sentenceConfig, theme: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Choose theme...</option>
            <option value="basics_core_language">Basics & Core Language</option>
            <option value="daily_life">Daily Life</option>
            <option value="food_drink">Food & Drink</option>
            <option value="free_time_leisure">Free Time & Leisure</option>
            <option value="holidays_travel_culture">Holidays, Travel & Culture</option>
          </select>
        </div>
      )}

      {/* Topic Selection */}
      {sentenceConfig.source === 'topic' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
          <select
            value={sentenceConfig.topic || ''}
            onChange={(e) => setSentenceConfig({...sentenceConfig, topic: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Choose topic...</option>
            <option value="greetings_introductions">Greetings & Introductions</option>
            <option value="family_friends">Family & Friends</option>
            <option value="hobbies_interests">Hobbies & Interests</option>
            <option value="food_drink_vocabulary">Food & Drink Vocabulary</option>
            <option value="daily_routine">Daily Routine</option>
          </select>
        </div>
      )}

      {/* Custom Set ID */}
      {sentenceConfig.source === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom Set ID</label>
          <input
            type="text"
            value={sentenceConfig.customSetId || ''}
            onChange={(e) => setSentenceConfig({...sentenceConfig, customSetId: e.target.value})}
            placeholder="Enter custom set ID..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Debug Information */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(sentenceConfig, null, 2)}
        </pre>
        
        <div className="mt-4 space-y-2 text-sm">
          <div>Has Source: <span className={sentenceConfig.source ? 'text-green-600' : 'text-red-600'}>{sentenceConfig.source ? 'Yes' : 'No'}</span></div>
          <div>Has Theme: <span className={sentenceConfig.theme ? 'text-green-600' : 'text-red-600'}>{sentenceConfig.theme ? 'Yes' : 'No'}</span></div>
          <div>Has Topic: <span className={sentenceConfig.topic ? 'text-green-600' : 'text-red-600'}>{sentenceConfig.topic ? 'Yes' : 'No'}</span></div>
          <div>Has Custom Set: <span className={sentenceConfig.customSetId ? 'text-green-600' : 'text-red-600'}>{sentenceConfig.customSetId ? 'Yes' : 'No'}</span></div>
          <div>Is Configured: <span className={isConfigured ? 'text-green-600' : 'text-red-600'}>{isConfigured ? 'Yes' : 'No'}</span></div>
        </div>
      </div>

      {/* Validation Logic Test */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Validation Logic:</h3>
        <code className="text-sm text-blue-800">
          {`(source && (theme || topic || customSetId))`}
        </code>
        <div className="mt-2 text-sm">
          <div>Source: <code>{sentenceConfig.source || 'empty'}</code></div>
          <div>Theme: <code>{sentenceConfig.theme || 'empty'}</code></div>
          <div>Topic: <code>{sentenceConfig.topic || 'empty'}</code></div>
          <div>Custom Set ID: <code>{sentenceConfig.customSetId || 'empty'}</code></div>
          <div className="mt-2 font-medium">
            Result: <span className={isConfigured ? 'text-green-600' : 'text-red-600'}>
              {isConfigured ? 'CONFIGURED' : 'NEEDS SETUP'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
