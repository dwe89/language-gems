'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Calendar, AlertCircle, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';

interface Assessment {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'not_started' | 'in_progress' | 'completed';
  game_config?: {
    assessmentConfig?: {
      selectedAssessments: Array<{
        id: string;
        name: string;
        instanceConfig?: {
          examBoard?: string;
          level?: string;
          topic?: string;
        };
      }>;
    };
  };
}

export default function PendingAssessmentsList() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    if (user?.id) {
      fetchAssessments();
    }
  }, [user?.id]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser;

      // Get enrollments
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .eq('student_id', user!.id);

      if (!enrollments || enrollments.length === 0) {
        setLoading(false);
        return;
      }

      const classIds = enrollments.map(e => e.class_id);

      // Fetch pending assessments
      // We want assignments with game_type = 'assessment'
      // And we need to check completion status
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('*')
        .in('class_id', classIds)
        .eq('game_type', 'assessment')
        .order('due_date', { ascending: true });

      if (error) throw error;

      // Check completion status for each
      // This is a bit naive, ideally we'd join with progress table
      // But for now let's fetch progress
      const { data: progress } = await supabase
        .from('enhanced_assignment_progress')
        .select('assignment_id, status')
        .eq('student_id', user!.id)
        .in('assignment_id', assignments.map(a => a.id));

      const completedIds = new Set(
        progress?.filter(p => p.status === 'completed').map(p => p.assignment_id)
      );

      const allAssessments = assignments.map(a => ({
        ...a,
        status: completedIds.has(a.id) ? 'completed' : 'not_started' // Simplified status
      }));

      setAssessments(allAssessments);

    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(a => 
    activeTab === 'pending' ? a.status !== 'completed' : a.status === 'completed'
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-indigo-600" />
          Assessments
        </h2>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'pending' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            To Do
            {assessments.filter(a => a.status !== 'completed').length > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-xs">
                {assessments.filter(a => a.status !== 'completed').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'completed' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {filteredAssessments.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl border border-gray-200 border-dashed">
          <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-indigo-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No {activeTab} assessments</h3>
          <p className="text-gray-500 mt-1">
            {activeTab === 'pending' 
              ? "You're all caught up! Great job." 
              : "You haven't completed any assessments yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssessments.map((assessment) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${
                    assessment.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    assessment.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {assessment.status === 'completed' ? 'Completed' : 'Assessment'}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {assessment.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Due: {new Date(assessment.due_date).toLocaleDateString()}</span>
                </div>

                {assessment.game_config?.assessmentConfig?.selectedAssessments && (
                  <div className="mb-4 space-y-1">
                    {assessment.game_config.assessmentConfig.selectedAssessments.slice(0, 2).map((sub, idx) => (
                      <div key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        {sub.name}
                      </div>
                    ))}
                    {assessment.game_config.assessmentConfig.selectedAssessments.length > 2 && (
                      <div className="text-xs text-gray-400 pl-1">
                        +{assessment.game_config.assessmentConfig.selectedAssessments.length - 2} more
                      </div>
                    )}
                  </div>
                )}

                <Link
                  href={`/student-dashboard/assessments/${assessment.id}`}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
                    assessment.status === 'completed'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <PlayCircle className="h-4 w-4" />
                  {assessment.status === 'completed' ? 'Review Results' : 'Start Assessment'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
