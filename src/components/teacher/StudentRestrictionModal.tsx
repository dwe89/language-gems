'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  Clock, 
  Eye, 
  BookOpen, 
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';

interface StudentRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    email: string;
  };
  currentRestrictions: {
    assignmentOnlyMode: boolean;
    allowedVocabularySets: string[];
    timeRestrictions: {
      dailyLimit: number;
      sessionLimit: number;
      allowedHours: { start: string; end: string }[];
    };
    progressVisibility: {
      showToStudent: boolean;
      showToParents: boolean;
      detailLevel: 'basic' | 'detailed' | 'full';
    };
  };
  onSave: (restrictions: any) => void;
}

export function StudentRestrictionModal({
  isOpen,
  onClose,
  student,
  currentRestrictions,
  onSave
}: StudentRestrictionModalProps) {
  const [restrictions, setRestrictions] = useState(currentRestrictions);
  const [activeTab, setActiveTab] = useState<'access' | 'time' | 'progress'>('access');

  const handleSave = () => {
    onSave(restrictions);
    onClose();
  };

  const handleReset = () => {
    setRestrictions(currentRestrictions);
  };

  const addTimeSlot = () => {
    setRestrictions(prev => ({
      ...prev,
      timeRestrictions: {
        ...prev.timeRestrictions,
        allowedHours: [
          ...prev.timeRestrictions.allowedHours,
          { start: '09:00', end: '17:00' }
        ]
      }
    }));
  };

  const removeTimeSlot = (index: number) => {
    setRestrictions(prev => ({
      ...prev,
      timeRestrictions: {
        ...prev.timeRestrictions,
        allowedHours: prev.timeRestrictions.allowedHours.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    setRestrictions(prev => ({
      ...prev,
      timeRestrictions: {
        ...prev.timeRestrictions,
        allowedHours: prev.timeRestrictions.allowedHours.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Student Restrictions</h2>
              <p className="text-sm text-gray-600">{student.name} ({student.email})</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('access')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'access'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Access Control
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'time'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Time Limits
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'progress'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Progress Visibility
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Access Control Tab */}
            {activeTab === 'access' && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={restrictions.assignmentOnlyMode}
                      onChange={(e) => setRestrictions(prev => ({
                        ...prev,
                        assignmentOnlyMode: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">Assignment Only Mode</span>
                  </label>
                  <p className="ml-6 text-sm text-gray-600">
                    Restrict student to only work on assigned vocabulary sets
                  </p>
                  
                  {restrictions.assignmentOnlyMode && (
                    <div className="ml-6 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">
                          Student will not be able to access free practice vocabulary sets
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Allowed Vocabulary Sets</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">GCSE Spanish Core Vocabulary</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">Family & Relationships</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="ml-3 text-sm text-gray-700">Advanced Grammar Patterns</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Content Difficulty</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">Beginner</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">Intermediate</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="ml-3 text-sm text-gray-700">Advanced</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Time Limits Tab */}
            {activeTab === 'time' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={restrictions.timeRestrictions.dailyLimit}
                      onChange={(e) => setRestrictions(prev => ({
                        ...prev,
                        timeRestrictions: {
                          ...prev.timeRestrictions,
                          dailyLimit: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      max="480"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={restrictions.timeRestrictions.sessionLimit}
                      onChange={(e) => setRestrictions(prev => ({
                        ...prev,
                        timeRestrictions: {
                          ...prev.timeRestrictions,
                          sessionLimit: parseInt(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      max="120"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">Allowed Hours</h4>
                    <button
                      onClick={addTimeSlot}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      + Add Time Slot
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {restrictions.timeRestrictions.allowedHours.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {restrictions.timeRestrictions.allowedHours.length > 1 && (
                          <button
                            onClick={() => removeTimeSlot(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Progress Visibility Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Visibility Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={restrictions.progressVisibility.showToStudent}
                        onChange={(e) => setRestrictions(prev => ({
                          ...prev,
                          progressVisibility: {
                            ...prev.progressVisibility,
                            showToStudent: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Show progress to student</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={restrictions.progressVisibility.showToParents}
                        onChange={(e) => setRestrictions(prev => ({
                          ...prev,
                          progressVisibility: {
                            ...prev.progressVisibility,
                            showToParents: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Share progress with parents</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Detail Level</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'basic', label: 'Basic', desc: 'Overall scores and completion' },
                      { value: 'detailed', label: 'Detailed', desc: 'Time spent, accuracy, streaks' },
                      { value: 'full', label: 'Full', desc: 'All interactions and analytics' }
                    ].map(option => (
                      <label key={option.value} className="flex items-start">
                        <input
                          type="radio"
                          name="detailLevel"
                          value={option.value}
                          checked={restrictions.progressVisibility.detailLevel === option.value}
                          onChange={(e) => setRestrictions(prev => ({
                            ...prev,
                            progressVisibility: {
                              ...prev.progressVisibility,
                              detailLevel: e.target.value as any
                            }
                          }))}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
