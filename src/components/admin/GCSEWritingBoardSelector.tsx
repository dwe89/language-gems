'use client';

import React from 'react';
import { X, BookOpen, FileText } from 'lucide-react';

interface GCSEWritingBoardSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBoard: (board: 'aqa' | 'edexcel') => void;
}

export default function GCSEWritingBoardSelector({ isOpen, onClose, onSelectBoard }: GCSEWritingBoardSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">GCSE Writing Assessments</h2>
            <p className="text-sm text-gray-600 mt-1">Select an exam board to manage papers</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Board Selection */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6">
            {/* AQA Card */}
            <button
              onClick={() => onSelectBoard('aqa')}
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-300 hover:border-blue-500 rounded-xl p-8 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">AQA</h3>
                  <p className="text-sm text-blue-700">
                    Foundation: 70 min<br />
                    Higher: 75 min
                  </p>
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  Click to manage AQA papers
                </div>
              </div>
            </button>

            {/* Edexcel Card */}
            <button
              onClick={() => onSelectBoard('edexcel')}
              className="group relative bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-300 hover:border-purple-500 rounded-xl p-8 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-2">Edexcel</h3>
                  <p className="text-sm text-purple-700">
                    Foundation: 75 min<br />
                    Higher: 80 min
                  </p>
                </div>
                <div className="text-xs text-purple-600 font-medium">
                  Click to manage Edexcel papers
                </div>
              </div>
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 text-center">
              <span className="font-semibold">Note:</span> Both exam boards have different question structures and marking schemes.
              Select the appropriate board to create or edit papers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

