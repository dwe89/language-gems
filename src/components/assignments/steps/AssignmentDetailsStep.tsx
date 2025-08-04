'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Settings } from 'lucide-react';
import { StepProps } from '../types/AssignmentTypes';

export default function AssignmentDetailsStep({
  assignmentDetails,
  setAssignmentDetails,
  onStepComplete,
  classes,
}: StepProps) {

  // Check if step is completed
  useEffect(() => {
    const isCompleted = assignmentDetails.title.trim() !== '' &&
                       assignmentDetails.description.trim() !== '' &&
                       assignmentDetails.selectedClasses.length > 0 &&
                       assignmentDetails.dueDate !== '';
    onStepComplete('basic', isCompleted);
  }, [assignmentDetails, onStepComplete]);

  const handleClassToggle = (classId: string) => {
    setAssignmentDetails(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter(id => id !== classId)
        : [...prev.selectedClasses, classId]
    }));
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value; // e.g., "2025-08-04"
    // Ensure time part exists, default to 23:59 if not
    const existingTime = assignmentDetails.dueDate?.split('T')[1] || '23:59';
    setAssignmentDetails(prev => ({ ...prev, dueDate: `${newDate}T${existingTime}` }));
  };

  const handleDueTimeHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value;
    // Ensure date part exists, default to today if not
    const existingDate = assignmentDetails.dueDate?.split('T')[0] || new Date().toISOString().split('T')[0];
    const existingMinute = assignmentDetails.dueDate?.split('T')[1]?.split(':')[1] || '59';
    setAssignmentDetails(prev => ({ ...prev, dueDate: `${existingDate}T${newHour}:${existingMinute}` }));
  };

  const handleDueTimeMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = e.target.value;
    // Ensure date part exists, default to today if not
    const existingDate = assignmentDetails.dueDate?.split('T')[0] || new Date().toISOString().split('T')[0];
    const existingHour = assignmentDetails.dueDate?.split('T')[1]?.split(':')[0] || '23';
    setAssignmentDetails(prev => ({ ...prev, dueDate: `${existingDate}T${existingHour}:${newMinute}` }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Assignment Details</h2>
        <p className="text-sm text-gray-600">Set up the basic information for your assignment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="assignmentTitle" className="flex items-center text-sm font-semibold text-gray-800 mb-2">
              Assignment Title <span className="text-red-400 text-xs ml-1">*</span>
            </label>
            <input
              id="assignmentTitle"
              type="text"
              value={assignmentDetails.title}
              onChange={(e) => setAssignmentDetails(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., French Vocab: Food & Drink"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="assignmentDescription" className="flex items-center text-sm font-semibold text-gray-800 mb-2">
              Description <span className="text-red-400 text-xs ml-1">*</span>
            </label>
            <textarea
              id="assignmentDescription"
              value={assignmentDetails.description}
              onChange={(e) => setAssignmentDetails(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what students will learn and practice..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
            />
          </div>

          {/* Due Date and Time - Grouped Visually */}
          <div className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
            <h3 className="flex items-center text-base font-semibold text-gray-800 mb-4">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Due Date & Time <span className="text-red-400 text-xs ml-1">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={assignmentDetails.dueDate ? assignmentDetails.dueDate.split('T')[0] : ''}
                  onChange={handleDueDateChange}
                  // Set min date to today to prevent selecting past dates (optional but good UX)
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="dueTimeHour" className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="flex space-x-2"> {/* Changed grid to flex for cleaner time input grouping */}
                  <select
                    id="dueTimeHour"
                    value={assignmentDetails.dueDate ? assignmentDetails.dueDate.split('T')[1]?.split(':')[0] || '23' : '23'}
                    onChange={handleDueTimeHourChange}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="flex items-center text-gray-700">:</span> {/* Colon separator */}
                  <select
                    id="dueTimeMinute"
                    value={assignmentDetails.dueDate ? assignmentDetails.dueDate.split('T')[1]?.split(':')[1] || '59' : '59'}
                    onChange={handleDueTimeMinuteChange}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                  >
                    <option value="00">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Class Selection */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
              <Users className="h-4 w-4 mr-2 text-purple-600" />
              Select Classes <span className="text-red-400 text-xs ml-1">*</span> ({assignmentDetails.selectedClasses.length} selected)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {classes.map(cls => (
                <label key={cls.id} htmlFor={`class-${cls.id}`} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <input
                    id={`class-${cls.id}`}
                    type="checkbox"
                    checked={assignmentDetails.selectedClasses.includes(cls.id)}
                    onChange={() => handleClassToggle(cls.id)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                  />
                  <div className="ml-3 flex-1">
                    <span className="text-sm font-medium text-gray-900">{cls.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({cls.student_count} students)</span>
                  </div>
                </label>
              ))}
            </div>
          </div>


          {/* Settings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="flex items-center text-sm font-semibold text-gray-800 mb-3">
              <Settings className="h-4 w-4 mr-2 text-gray-600" />
              Assignment Settings
            </h4>
            <div className="space-y-3">
              <label htmlFor="allowLateSubmissions" className="flex items-center cursor-pointer">
                <input
                  id="allowLateSubmissions"
                  type="checkbox"
                  checked={assignmentDetails.allowLateSubmissions}
                  onChange={(e) => setAssignmentDetails(prev => ({ ...prev, allowLateSubmissions: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">Allow late submissions</span>
              </label>

              <label htmlFor="showResults" className="flex items-center cursor-pointer">
                <input
                  id="showResults"
                  type="checkbox"
                  checked={assignmentDetails.showResults}
                  onChange={(e) => setAssignmentDetails(prev => ({ ...prev, showResults: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">Show results to students</span>
              </label>

              <label htmlFor="randomizeOrder" className="flex items-center cursor-pointer">
                <input
                  id="randomizeOrder"
                  type="checkbox"
                  checked={assignmentDetails.randomizeOrder}
                  onChange={(e) => setAssignmentDetails(prev => ({ ...prev, randomizeOrder: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">Randomize question order</span>
              </label>

              <div className="flex items-center space-x-2">
                <label htmlFor="maxAttempts" className="text-sm text-gray-700">Max attempts:</label>
                <select
                  id="maxAttempts"
                  value={assignmentDetails.maxAttempts}
                  onChange={(e) => setAssignmentDetails(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) || 1 }))}
                  className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="999">Unlimited</option> {/* Using 999 as a placeholder for unlimited */}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}