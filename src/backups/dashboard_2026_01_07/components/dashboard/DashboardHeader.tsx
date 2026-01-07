'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  showBackToDashboard?: boolean;
  children?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  description,
  icon,
  showBackToDashboard = true,
  children
}: DashboardHeaderProps) {
  return (
    <header className="mb-8">
      {showBackToDashboard && (
        <div className="mb-4">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Link>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="text-slate-600">{description}</p>
            )}
          </div>
        </div>
        
        {children && (
          <div className="flex items-center space-x-3">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
