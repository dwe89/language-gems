'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Volume2,
  FileAudio,
  Database,
  Settings,
  BarChart3
} from 'lucide-react';

interface AudioGenerationStatus {
  isGenerating: boolean;
  progress: number;
  currentFile: string;
  totalFiles: number;
  completedFiles: number;
  errors: string[];
  estimatedCost: number;
}

interface AudioFileStats {
  totalFiles: number;
  missingFiles: number;
  completionPercentage: number;
  byLanguage: Record<string, { present: number; total: number }>;
  byCase: Record<string, { present: number; total: number }>;
  totalSize: string;
}

export default function AudioGenerationDashboard() {
  const [status, setStatus] = useState<AudioGenerationStatus>({
    isGenerating: false,
    progress: 0,
    currentFile: '',
    totalFiles: 0,
    completedFiles: 0,
    errors: [],
    estimatedCost: 0
  });

  const [stats, setStats] = useState<AudioFileStats | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<string>('all');
  const [forceRegenerate, setForceRegenerate] = useState(false);

  // Mock data - in real implementation, this would come from API calls
  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalFiles: 450,
      missingFiles: 127,
      completionPercentage: 72,
      byLanguage: {
        spanish: { present: 108, total: 150 },
        french: { present: 95, total: 150 },
        german: { present: 120, total: 150 }
      },
      byCase: {
        animals: { present: 45, total: 45 },
        food: { present: 30, total: 45 },
        family: { present: 38, total: 45 },
        colors: { present: 42, total: 45 },
        school: { present: 0, total: 45 },
        travel: { present: 0, total: 45 },
        numbers: { present: 0, total: 45 }
      },
      totalSize: '12.3 MB'
    });
  }, []);

  const handleStartGeneration = async () => {
    setStatus(prev => ({ ...prev, isGenerating: true, progress: 0, errors: [] }));
    
    // Simulate generation process
    const totalFiles = 50; // Example
    for (let i = 0; i <= totalFiles; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setStatus(prev => ({
        ...prev,
        progress: (i / totalFiles) * 100,
        currentFile: `es_animals_word${i}.mp3`,
        completedFiles: i
      }));
    }
    
    setStatus(prev => ({ ...prev, isGenerating: false }));
  };

  const handleStopGeneration = () => {
    setStatus(prev => ({ ...prev, isGenerating: false }));
  };

  const handleTestTTS = async () => {
    // Simulate TTS test
    console.log('Testing Google Cloud TTS...');
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audio generation dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audio Generation Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage audio files for Detective Listening Game</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleTestTTS}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Test TTS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileAudio className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Missing</p>
                <p className="text-2xl font-bold text-gray-900">{stats.missingFiles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSize}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generation Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Audio Generation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Languages</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
              <select
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Cases</option>
                <option value="animals">Animals</option>
                <option value="food">Food</option>
                <option value="family">Family</option>
                <option value="colors">Colors</option>
                <option value="school">School</option>
                <option value="travel">Travel</option>
                <option value="numbers">Numbers</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={forceRegenerate}
                  onChange={(e) => setForceRegenerate(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Force regenerate existing files</span>
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {status.isGenerating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Generating: {status.currentFile}
                </span>
                <span className="text-sm text-gray-500">
                  {status.completedFiles} / {status.totalFiles}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${status.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {!status.isGenerating ? (
              <button
                onClick={handleStartGeneration}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Start Generation</span>
              </button>
            ) : (
              <button
                onClick={handleStopGeneration}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Pause className="h-4 w-4" />
                <span>Stop Generation</span>
              </button>
            )}

            <button className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Status</span>
            </button>

            <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">By Language</h3>
            <div className="space-y-4">
              {Object.entries(stats.byLanguage).map(([language, data]) => (
                <div key={language}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{language}</span>
                    <span className="text-sm text-gray-500">{data.present}/{data.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(data.present / data.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">By Case Type</h3>
            <div className="space-y-4">
              {Object.entries(stats.byCase).map(([caseType, data]) => (
                <div key={caseType}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{caseType}</span>
                    <span className="text-sm text-gray-500">{data.present}/{data.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        data.present === data.total ? 'bg-green-600' : 
                        data.present > 0 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${(data.present / data.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
