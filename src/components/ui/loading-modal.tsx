'use client';

import React from 'react';
import { Loader2, Sparkles, Wand2, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  steps?: string[];
  currentStep?: number;
}

export function LoadingModal({ 
  isOpen, 
  title = "Generating Your Word Search", 
  description = "Please wait while we create your puzzle...",
  steps = [
    "Selecting vocabulary words...",
    "Creating puzzle grid...",
    "Placing words in grid...",
    "Adding random letters...",
    "Finalizing puzzle..."
  ],
  currentStep = 0
}: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Loading Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -inset-1">
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-spin opacity-20">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                    index === currentStep 
                      ? 'text-purple-600 font-medium' 
                      : index < currentStep 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  ) : index === currentStep ? (
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                  )}
                  <span className="text-left">{step}</span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            {/* Fun Loading Messages */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Creating something amazing...</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}