'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart2, TrendingUp, Clock, Calendar, Award, Target,
  Book, MessageSquare, Mic, Pen, CheckCircle, Hexagon
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';

type ProgressCategory = {
  id: string;
  name: string;
  score: number;
  total: number;
  icon: React.ReactNode;
  gemColor: string;
  lastAssessment: string;
  timeSpent?: number;
};

type LanguageSkill = {
  id: string;
  name: string;
  progress: number;
  level: string;
  icon: React.ReactNode;
};

type AssignmentProgress = {
  id: string;
  assignment_id: string;
  student_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  accuracy: number;
  attempts: number;
  time_spent: number;
  completed_at?: string;
  updated_at: string;
  assignment?: {
    id: string;
    title: string;
    type: string;
    due_date?: string;
  };
};

const ProgressCard = ({ category, formatTimeSpent }: { category: ProgressCategory, formatTimeSpent: (seconds: number) => string }) => {
  const percentage = Math.round((category.score / category.total) * 100);

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center mb-4">
        <div className={`${category.gemColor} p-3 rounded-full mr-4`}>
          {category.icon}
        </div>
        <div>
          <h3 className="font-bold text-lg">{category.name}</h3>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last assessment: {category.lastAssessment}</span>
          </div>
          {category.timeSpent && category.timeSpent > 0 && (
            <div className="text-sm text-blue-600 flex items-center mt-1">
              <Target className="h-4 w-4 mr-1" />
              <span>Time spent: {formatTimeSpent(category.timeSpent)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm font-medium">{category.score} / {category.total} points</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <button className="w-full mt-4 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
        See Detailed Report
      </button>
    </div>
  );
};

const SkillProgressBar = ({ skill }: { skill: LanguageSkill }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-full mr-3">
            {skill.icon}
          </div>
          <span className="font-medium">{skill.name}</span>
        </div>
        <div className="text-sm font-medium text-indigo-700">{skill.level}</div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 rounded-full" 
          style={{ width: `${skill.progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const AchievementCard = ({ 
  title, 
  date, 
  description, 
  icon, 
  color = 'bg-indigo-500' 
}: { 
  title: string; 
  date: string; 
  description: string; 
  icon: React.ReactNode;
  color?: string;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex">
      <div className={`${color} text-white p-3 rounded-full mr-4 h-14 w-14 flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="text-sm text-gray-500 mb-2">
          <span>{date}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default function ProgressPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [assignmentProgress, setAssignmentProgress] = useState<AssignmentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAssignmentProgress = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');

        // Get student's class enrollments
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('class_enrollments')
          .select('class_id')
          .eq('student_id', user.id);

        if (enrollmentError) {
          throw enrollmentError;
        }

        const classIds = enrollments?.map(e => e.class_id) || [];

        // Get assignment progress (this tracks progress for assignments)
        const { data: assignmentProgressData, error: progressError } = await supabase
          .from('enhanced_assignment_progress')
          .select(`
            assignment_id,
            status,
            best_score,
            best_accuracy,
            completed_at,
            attempts_count,
            total_time_spent
          `)
          .eq('student_id', user.id);

        if (progressError) {
          console.error('Error fetching assignment progress:', progressError);
          // Continue without progress data rather than failing completely
        }

        // Also get all assignments for the student's classes to show unstarted assignments
        const { data: allAssignments, error: assignmentsError } = await supabase
          .from('assignments')
          .select('id, title, type, due_date, class_id')
          .in('class_id', classIds);

        if (assignmentsError) {
          throw assignmentsError;
        }

        // Create a map of assignment progress for quick lookup
        const progressMap = new Map();
        assignmentProgressData?.forEach(progress => {
          progressMap.set(progress.assignment_id, progress);
        });

        // Transform assignment progress data to match expected format
        const completedProgress = allAssignments?.map(assignment => {
          const progress = progressMap.get(assignment.id);
          return {
            id: progress ? `progress-${assignment.id}` : `not-started-${assignment.id}`,
            assignment_id: assignment.id,
            student_id: user.id,
            status: progress?.status || 'not_started' as 'not_started' | 'in_progress' | 'completed',
            score: progress?.best_score || 0,
            accuracy: progress?.best_accuracy || 0,
            attempts: progress?.attempts_count || 0,
            time_spent: progress?.total_time_spent || 0,
            completed_at: progress?.completed_at,
            updated_at: new Date().toISOString(),
            assignment: assignment
          };
        }) || [];

        // All progress data is now in completedProgress (including not-started assignments)
        const filteredProgress = completedProgress;

        setAssignmentProgress(filteredProgress);
      } catch (err) {
        console.error('Error fetching assignment progress:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentProgress();
  }, [user, supabase]);

  // Calculate progress statistics from real data
  const completedAssignments = assignmentProgress.filter(p => p.status === 'completed').length;
  const inProgressAssignments = assignmentProgress.filter(p => p.status === 'in_progress').length;
  const totalAssignments = assignmentProgress.length;
  const overallPercentage = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  // Calculate total time spent
  const totalTimeSpent = assignmentProgress.reduce((sum, p) => sum + (p.time_spent || 0), 0);
  const averageTimePerAssignment = completedAssignments > 0 ? Math.round(totalTimeSpent / completedAssignments) : 0;

  // Calculate category scores based on assignment types and performance
  const vocabularyAssignments = assignmentProgress.filter(p => 
    p.assignment && ['memory-game', 'word_blast', 'speed-builder', 'gem-collector'].includes(p.assignment.type)
  );
  const vocabularyScore = vocabularyAssignments.length > 0
    ? Math.round(vocabularyAssignments.reduce((sum, p) => sum + p.accuracy, 0) / vocabularyAssignments.length)
    : 0;
  const vocabularyTimeSpent = vocabularyAssignments.reduce((sum, p) => sum + (p.time_spent || 0), 0);

  const categories: ProgressCategory[] = [
    {
      id: '1',
      name: 'Vocabulary',
      score: vocabularyScore,
      total: 100,
      icon: <Book className="h-6 w-6 text-white" />,
      gemColor: 'bg-blue-500',
      lastAssessment: vocabularyAssignments.length > 0
        ? formatLastAssessment(vocabularyAssignments[vocabularyAssignments.length - 1].updated_at)
        : 'No assessments yet',
      timeSpent: vocabularyTimeSpent
    },
    {
      id: '2',
      name: 'Grammar',
      score: 0, // No grammar assignments yet
      total: 100,
      icon: <Pen className="h-6 w-6 text-white" />,
      gemColor: 'bg-purple-500',
      lastAssessment: 'No assessments yet'
    },
    {
      id: '3',
      name: 'Speaking',
      score: 0, // No speaking assignments yet
      total: 100,
      icon: <Mic className="h-6 w-6 text-white" />,
      gemColor: 'bg-green-500',
      lastAssessment: 'No assessments yet'
    },
    {
      id: '4',
      name: 'Comprehension',
      score: 0, // No comprehension assignments yet
      total: 100,
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      gemColor: 'bg-yellow-500',
      lastAssessment: 'No assessments yet'
    }
  ];

  function formatLastAssessment(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  }

  function formatTimeSpent(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }
  
  // Calculate skills based on real assignment progress
  const skills: LanguageSkill[] = [
    {
      id: '1',
      name: 'Vocabulary Recognition',
      progress: vocabularyScore,
      level: vocabularyScore >= 80 ? 'Advanced' : vocabularyScore >= 60 ? 'Intermediate' : vocabularyScore > 0 ? 'Beginner' : 'Not assessed',
      icon: <Book className="h-5 w-5 text-indigo-600" />
    },
    {
      id: '2',
      name: 'Grammar Understanding',
      progress: 0, // No grammar assignments yet
      level: 'Not assessed',
      icon: <Pen className="h-5 w-5 text-indigo-600" />
    },
    {
      id: '3',
      name: 'Listening Comprehension',
      progress: 0, // No listening assignments yet
      level: 'Not assessed',
      icon: <MessageSquare className="h-5 w-5 text-indigo-600" />
    },
    {
      id: '4',
      name: 'Speaking Fluency',
      progress: 0, // No speaking assignments yet
      level: 'Not assessed',
      icon: <Mic className="h-5 w-5 text-indigo-600" />
    }
  ];
  
  // Generate achievements based on real progress
  const achievements = [];

  if (completedAssignments >= 1) {
    achievements.push({
      title: 'First Assignment Complete',
      date: `Earned ${formatLastAssessment(assignmentProgress.find(p => p.status === 'completed')?.completed_at || '')}`,
      description: 'Completed your first assignment!',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-green-500'
    });
  }

  if (completedAssignments >= 5) {
    achievements.push({
      title: 'Assignment Streak',
      date: 'Recently earned',
      description: 'Completed 5 assignments.',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-blue-500'
    });
  }

  if (vocabularyScore >= 80) {
    achievements.push({
      title: 'Vocabulary Master',
      date: 'Recently earned',
      description: 'Achieved 80% or higher accuracy in vocabulary games.',
      icon: <Hexagon className="h-6 w-6" />,
      color: 'bg-purple-500'
    });
  }

  // If no achievements yet, show placeholder
  if (achievements.length === 0) {
    achievements.push({
      title: 'Getting Started',
      date: 'Complete assignments to earn achievements',
      description: 'Your achievements will appear here as you progress.',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-gray-400'
    });
  }

  // Use the calculated overall percentage from assignment completion
  // (already calculated above based on completed vs total assignments)

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white mb-2">Progress Tracking</h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white mb-2">Progress Tracking</h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center py-8">
            <div className="text-red-500 text-xl mb-2">⚠️ Error Loading Progress</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-2">Progress Tracking</h1>
      
      {/* Overall Progress Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Overall Progress</h2>
            <p className="text-gray-600">
              {totalAssignments === 0
                ? "Complete assignments to see your progress!"
                : `${completedAssignments} of ${totalAssignments} assignments completed`
              }
            </p>
          </div>
          <div className="text-3xl font-bold text-indigo-600">{overallPercentage}%</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <ProgressCard key={category.id} category={category} formatTimeSpent={formatTimeSpent} />
          ))}
        </div>
      </div>

      {/* Time Tracking Section */}
      {totalAssignments > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-indigo-600" />
            Time Tracking
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {formatTimeSpent(totalTimeSpent)}
              </div>
              <div className="text-gray-600 font-medium">Total Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatTimeSpent(averageTimePerAssignment)}
              </div>
              <div className="text-gray-600 font-medium">Average per Assignment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {completedAssignments}
              </div>
              <div className="text-gray-600 font-medium">Assignments Completed</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Language Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Language Skills</h2>
          <div className="space-y-6">
            {skills.map(skill => (
              <SkillProgressBar key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Recent Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <AchievementCard 
                key={index}
                title={achievement.title}
                date={achievement.date}
                description={achievement.description}
                icon={achievement.icon}
                color={achievement.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 