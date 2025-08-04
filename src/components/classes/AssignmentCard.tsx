'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "../ui/card";
import { Book, Calendar, Users, Edit, Trash2, BarChart3, FileText, CheckCircle, Clock, Gamepad2 } from 'lucide-react';

type AssignmentProps = {
  assignment: {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    word_count?: number;
    assigned_date?: string;
    due_date?: string;
    created_at?: string;
    status?: string;
    completed_by?: number;
    totalStudents?: number;
    classes?: {
      name: string;
    };
  };
  onDelete?: (id: string) => void;
};

export function AssignmentCard({ assignment, onDelete }: AssignmentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const isOverdue = () => {
    if (!assignment.due_date) return false;
    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    return now > dueDate;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'completed':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'draft':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  // Use title or name, prefer title for assignments page
  const assignmentTitle = assignment.title || assignment.name || 'Untitled Assignment';
  const completionRate = assignment.totalStudents && assignment.totalStudents > 0 
    ? Math.round((assignment.completed_by || 0) / assignment.totalStudents * 100) 
    : 0;
  
  return (
    <Card className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardContent className="relative p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="p-3 bg-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2">{assignmentTitle}</h3>
              {assignment.description && (
                <p className="text-slate-600 text-sm mt-1 line-clamp-2">{assignment.description}</p>
              )}
              {assignment.classes?.name && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {assignment.classes.name}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions Menu */}
          {onDelete && (
            <div className="flex items-center justify-end space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
              <Link
                href={`/dashboard/assignments/${assignment.id}/analytics`}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="View Analytics"
              >
                <BarChart3 className="h-4 w-4" />
              </Link>
              <Link
                href={`/dashboard/assignments/${assignment.id}/edit`}
                className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Edit Assignment"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => onDelete(assignment.id)}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Assignment"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Status and Metadata */}
        <div className="space-y-3 mb-4">
          {assignment.status && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </span>
            </div>
          )}
          
          {(assignment as any).game_type && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-600">
                <Gamepad2 className="h-4 w-4 mr-2" />
                <span>Game Type</span>
              </div>
              <span className="text-slate-700 capitalize">
                {((assignment as any).game_type as string).replace('-', ' ')}
              </span>
            </div>
          )}
          
          {assignment.word_count && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-600">
                <Book className="h-4 w-4 mr-2" />
                <span>Word count</span>
              </div>
              <span className="font-semibold text-slate-900">{assignment.word_count}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Created</span>
            </div>
            <span className="text-slate-700">
              {formatDate(assignment.created_at || assignment.assigned_date || '')}
            </span>
          </div>
          
          {assignment.due_date && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Due date</span>
              </div>
              <span className={`font-medium ${isOverdue() ? 'text-red-600' : 'text-slate-700'}`}>
                {formatDate(assignment.due_date)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Section */}
        {assignment.totalStudents !== undefined && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Progress</span>
              </div>
              <span className="font-semibold text-slate-900">{completionRate}%</span>
            </div>
            
            <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            
            <div className="text-xs text-slate-500 text-center">
              {assignment.completed_by || 0} of {assignment.totalStudents} students completed
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-200/60">
          <Link
            href={`/dashboard/assignments/${assignment.id}`}
            className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center shadow-md hover:shadow-lg group-hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 