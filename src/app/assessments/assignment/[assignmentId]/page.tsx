'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Target, 
  FileText,
  Clock,
  Users,
  ArrowLeft,
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Assessment {
  id: string;
  name: string;
  type: 'reading-comprehension' | 'aqa-reading' | 'aqa-listening' | 'dictation' | 'four-skills' | 'gcse-reading' | 'gcse-listening' | 'gcse-writing';
  description: string;
  estimatedTime: string;
  skills: string[];
  completed: boolean;
  score?: number;
  timeSpent?: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  game_config: {
    selectedAssessments: Assessment[];
    generalSettings: any;
  };
  due_date: string;
  class_name?: string;
}

// Assessment metadata mapping
const ASSESSMENT_INFO: Record<string, Omit<Assessment, 'id' | 'completed' | 'score' | 'timeSpent'>> = {
  'reading-comprehension': {
    name: 'Reading Comprehension',
    type: 'reading-comprehension',
    description: 'Text-based comprehension with multiple question types',
    estimatedTime: '15-25 min',
    skills: ['Reading']
  },
  'aqa-reading': {
    name: 'AQA Reading Assessment',
    type: 'aqa-reading',
    description: 'Official AQA-style reading assessment',
    estimatedTime: '45-60 min',
    skills: ['Reading']
  },
  'aqa-listening': {
    name: 'AQA Listening Assessment',
    type: 'aqa-listening',
    description: 'Official AQA-style listening assessment',
    estimatedTime: '35-45 min',
    skills: ['Listening']
  },
  'gcse-reading': {
    name: 'GCSE Reading Exam',
    type: 'gcse-reading',
    description: 'AQA & Edexcel papers',
    estimatedTime: '45-60 min',
    skills: ['Reading']
  },
  'gcse-listening': {
    name: 'GCSE Listening Exam',
    type: 'gcse-listening',
    description: 'AQA & Edexcel papers',
    estimatedTime: '35-45 min',
    skills: ['Listening']
  },
  'gcse-writing': {
    name: 'GCSE Writing Exam',
    type: 'gcse-writing',
    description: 'AQA papers available',
    estimatedTime: '60-75 min',
    skills: ['Writing']
  },
  'dictation': {
    name: 'Dictation Assessment',
    type: 'dictation',
    description: 'Listen and write dictation exercises',
    estimatedTime: '20-30 min',
    skills: ['Listening', 'Writing']
  },
  'four-skills': {
    name: 'Four Skills Assessment',
    type: 'four-skills',
    description: 'Comprehensive assessment covering all four skills',
    estimatedTime: '60-90 min',
    skills: ['Reading', 'Writing', 'Listening', 'Speaking']
  }
};

export default function AssessmentAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.assignmentId as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assignmentId && user) {
      fetchAssignment();
    }
  }, [assignmentId, user]);

  const fetchAssignment = async () => {
    try {
      const { data: assignmentData, error: assignmentError } = await supabaseBrowser
        .from('assignments')
        .select(`
          id,
          title,
          description,
          game_config,
          due_date,
          classes!inner(name)
        `)
        .eq('id', assignmentId)
        .single();

      if (assignmentError) {
        console.error('Assignment fetch error:', assignmentError);
        setError('Failed to load assignment');
        return;
      }

      if (!assignmentData) {
        setError('Assignment not found');
        return;
      }

      // Transform assignment data
      const assignmentWithClassName = {
        ...assignmentData,
        class_name: assignmentData.classes?.[0]?.name
      };

      setAssignment(assignmentWithClassName);

      // Extract assessments from assignment config
      const selectedAssessments = assignmentData.game_config?.selectedAssessments || [];
      const assessmentList: Assessment[] = selectedAssessments.map((assessment: any) => {
        const assessmentInfo = ASSESSMENT_INFO[assessment.type];
        if (!assessmentInfo) {
          console.warn(`Unknown assessment type: ${assessment.type}`);
          return {
            id: assessment.id,
            name: assessment.name || assessment.type,
            type: assessment.type,
            description: 'Assessment',
            estimatedTime: '15-30 min',
            skills: ['General'],
            completed: false
          };
        }
        return {
          id: assessment.id,
          ...assessmentInfo,
          completed: false // TODO: Check actual completion status
        };
      });

      setAssessments(assessmentList);
    } catch (err) {
      console.error('Error fetching assignment:', err);
      setError('Error loading assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentClick = (assessment: Assessment) => {
    // Navigate to the appropriate assessment wrapper with assignment parameters
    let assessmentUrl = '';

    switch (assessment.type) {
      case 'reading-comprehension':
        assessmentUrl = `/assessments/reading-comprehension?assignment=${assignmentId}&mode=assignment`;
        break;
      case 'aqa-reading':
        assessmentUrl = `/assessments/aqa-reading?assignment=${assignmentId}&mode=assignment`;
        break;
      case 'aqa-listening':
        assessmentUrl = `/assessments/aqa-listening?assignment=${assignmentId}&mode=assignment`;
        break;
      case 'gcse-reading':
        assessmentUrl = `/assessments/gcse-reading?assignment=${assignmentId}&mode=assignment`;
        break;
      case 'gcse-listening':
        assessmentUrl = `/assessments/gcse-listening?assignment=${assignmentId}&mode=assignment`;
        break;
      case 'gcse-writing':
        assessmentUrl = `/assessments/gcse-writing?assignment=${assignmentId}&mode=assignment`;
        break;
      case 'dictation':
        assessmentUrl = `/assessments/dictation?assignment=${assignmentId}&mode=assignment`;
        break;
      case 'four-skills':
        assessmentUrl = `/assessments/four-skills?assignment=${assignmentId}&mode=assignment`;
        break;
      default:
        alert(`${assessment.name} is not yet implemented. This feature is coming soon!`);
        return;
    }

    router.push(assessmentUrl);
  };

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case 'reading-comprehension':
      case 'aqa-reading':
      case 'gcse-reading':
        return <BookOpen className="w-6 h-6" />;
      case 'aqa-listening':
      case 'gcse-listening':
        return <Headphones className="w-6 h-6" />;
      case 'gcse-writing':
        return <PenTool className="w-6 h-6" />;
      case 'dictation':
        return <PenTool className="w-6 h-6" />;
      case 'four-skills':
        return <Target className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getAssessmentColor = (type: string) => {
    switch (type) {
      case 'reading-comprehension':
        return 'from-blue-500 to-blue-600';
      case 'aqa-reading':
        return 'from-indigo-500 to-indigo-600';
      case 'aqa-listening':
        return 'from-purple-500 to-purple-600';
      case 'dictation':
        return 'from-green-500 to-green-600';
      case 'four-skills':
        return 'from-teal-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-300" />
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-lg mb-4">{error || 'Assignment not found'}</p>
          <button
            onClick={() => router.push('/dashboard/assignments')}
            className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full transition-all"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard/assignments')}
              className="flex items-center text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Assignments
            </button>
            
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold">{assignment.title}</h1>
              <p className="text-blue-200 text-sm">{assignment.description}</p>
            </div>

            <div className="flex items-center space-x-4 text-white text-sm">
              {assignment.class_name && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {assignment.class_name}
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Due: {new Date(assignment.due_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              onClick={() => handleAssessmentClick(assessment)}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getAssessmentColor(assessment.type)} flex items-center justify-center text-white`}>
                  {getAssessmentIcon(assessment.type)}
                </div>
                {assessment.completed && (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
              </div>

              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-200 transition-colors">
                {assessment.name}
              </h3>
              
              <p className="text-white/70 text-sm mb-4">
                {assessment.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-white/60">
                  <Clock className="w-4 h-4 mr-1" />
                  {assessment.estimatedTime}
                </div>
                
                <div className="flex items-center text-white/60">
                  <Play className="w-4 h-4 mr-1" />
                  {assessment.skills.join(', ')}
                </div>
              </div>

              {assessment.completed && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Score: {assessment.score || 0}%</span>
                    <span>Time: {Math.floor((assessment.timeSpent || 0) / 60)}m</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {assessments.length === 0 && (
          <div className="text-center text-white py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold mb-2">No Assessments</h3>
            <p className="text-white/70">This assignment doesn't contain any assessments.</p>
          </div>
        )}
      </div>
    </div>
  );
}
