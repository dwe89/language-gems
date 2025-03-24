'use client';

import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Book, Calendar, Users } from 'lucide-react';

type AssignmentProps = {
  assignment: {
    id: string;
    name: string;
    word_count: number;
    assigned_date: string;
    due_date?: string;
    completed_by: number;
    totalStudents?: number;
  };
};

export function AssignmentCard({ assignment }: AssignmentProps) {
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
  
  return (
    <Card className="overflow-hidden border border-gray-700 bg-gray-800/60 hover:bg-gray-800/80 transition-colors">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-indigo-800 to-purple-700 p-5">
          <h3 className="font-semibold text-white text-lg">{assignment.name}</h3>
          <div className="flex items-center text-indigo-200 text-sm mt-2">
            <Book className="h-4 w-4 mr-1.5" />
            <span>{assignment.word_count} words</span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300 flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                Assigned: {formatDate(assignment.assigned_date)}
              </div>
              
              {assignment.due_date && (
                <div className={`text-sm px-3 py-1 rounded-full border ${
                  isOverdue() 
                    ? 'bg-red-900/30 text-red-300 border-red-800/50' 
                    : 'bg-cyan-900/30 text-cyan-300 border-cyan-800/50'
                }`}>
                  Due: {formatDate(assignment.due_date)}
                </div>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-300">
              <Users className="h-4 w-4 mr-1.5 text-gray-400" />
              <span>{assignment.completed_by} students completed{assignment.totalStudents ? ` (${Math.round(assignment.completed_by / assignment.totalStudents * 100)}%)` : ''}</span>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300">Completion</span>
                <span className="text-gray-300">{assignment.totalStudents ? Math.round(assignment.completed_by / assignment.totalStudents * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                  style={{ width: `${assignment.totalStudents ? Math.round(assignment.completed_by / assignment.totalStudents * 100) : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-1">
              <button className="text-sm px-4 py-1.5 bg-indigo-700/50 text-indigo-200 rounded-md hover:bg-indigo-700/80 hover:text-white transition-colors border border-indigo-600/50">
                View Details
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 