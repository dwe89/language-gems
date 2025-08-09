import React from 'react';
import { BookOpen, GraduationCap, ArrowLeft } from 'lucide-react';

export interface ExamBoard {
  id: 'aqa' | 'edexcel';
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon: React.ComponentType<any>;
}

export const EXAM_BOARDS: ExamBoard[] = [
  {
    id: 'aqa',
    name: 'aqa',
    displayName: 'AQA',
    description: 'Assessment and Qualifications Alliance - Most popular GCSE exam board',
    color: 'from-blue-600 to-blue-700',
    icon: BookOpen
  },
  {
    id: 'edexcel',
    name: 'edexcel',
    displayName: 'Edexcel',
    description: 'Pearson Edexcel - Comprehensive GCSE curriculum',
    color: 'from-green-600 to-green-700',
    icon: GraduationCap
  }
];

interface KS4ExamBoardSelectorProps {
  onExamBoardSelect: (examBoard: 'aqa' | 'edexcel') => void;
  onBack?: () => void;
  selectedLanguage?: string;
  className?: string;
}

export default function KS4ExamBoardSelector({
  onExamBoardSelect,
  onBack,
  selectedLanguage = 'Spanish',
  className = ''
}: KS4ExamBoardSelectorProps) {
  
  const handleExamBoardClick = (examBoardId: 'aqa' | 'edexcel') => {
    onExamBoardSelect(examBoardId);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your GCSE Exam Board
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select your {selectedLanguage} GCSE exam board to access the correct vocabulary and themes for your course.
        </p>
      </div>

      {/* Exam Board Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {EXAM_BOARDS.map((examBoard) => {
          const IconComponent = examBoard.icon;
          
          return (
            <div
              key={examBoard.id}
              onClick={() => handleExamBoardClick(examBoard.id)}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
            >
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200 p-6">
                {/* Icon and Title */}
                <div className="flex items-center mb-4">
                  <div className={`bg-gradient-to-r ${examBoard.color} text-white p-3 rounded-lg mr-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {examBoard.displayName}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {examBoard.name.toUpperCase()} GCSE
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {examBoard.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {examBoard.id === 'aqa' && (
                    <>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Theme-based vocabulary organization
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Foundation and Higher tier support
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Comprehensive topic coverage
                      </div>
                    </>
                  )}
                  {examBoard.id === 'edexcel' && (
                    <>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Unit-based curriculum structure
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Foundation and Higher tier support
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Structured learning progression
                      </div>
                    </>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Click to select
                  </span>
                  <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-blue-800">
            <strong>Not sure which exam board you're using?</strong> Check with your teacher or look at your course materials. 
            The exam board determines the specific vocabulary and themes you'll need to learn for your GCSE.
          </p>
        </div>
      </div>
    </div>
  );
}
