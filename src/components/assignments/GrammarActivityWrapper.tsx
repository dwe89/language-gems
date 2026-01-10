'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Target, Award, CheckCircle, Lock, X, ChevronRight } from 'lucide-react';
import { supabaseBrowser } from '../auth/AuthProvider';

interface GrammarActivityWrapperProps {
  assignmentId: string;
  activityId: string;
  topicId: string;
  topicTitle: string;
  contentTypes: string[];
  onClose: () => void;
  userId: string;
}

type ContentType = 'lesson' | 'practice' | 'quiz';

interface ContentProgress {
  lesson: boolean;
  practice: boolean;
  quiz: boolean;
}

const contentTypeInfo = {
  lesson: {
    icon: BookOpen,
    label: 'Lesson',
    color: 'blue',
    description: 'Learn the concepts and rules',
  },
  practice: {
    icon: Target,
    label: 'Practice',
    color: 'green',
    description: 'Apply what you learned',
  },
  quiz: {
    icon: Award,
    label: 'Quiz',
    color: 'orange',
    description: 'Test your knowledge',
  },
};

export default function GrammarActivityWrapper({
  assignmentId,
  activityId,
  topicId,
  topicTitle,
  contentTypes,
  onClose,
  userId,
}: GrammarActivityWrapperProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ContentProgress>({
    lesson: false,
    practice: false,
    quiz: false,
  });
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<ContentType | null>(null);

  useEffect(() => {
    loadProgress();
  }, [assignmentId, activityId, topicId]);

  const loadProgress = async () => {
    try {
      setLoading(true);

      // Fetch step progress from grammar_topic_step_progress
      // This table tracks completion of lesson/practice/test steps per topic in assignments
      const { data: stepProgress, error } = await supabaseBrowser
        .from('grammar_topic_step_progress')
        .select('*')
        .eq('student_id', userId)
        .eq('topic_id', topicId)
        .eq('assignment_id', assignmentId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('⚠️ Error loading grammar step progress:', error);
      }

      const newProgress: ContentProgress = {
        lesson: stepProgress?.lesson_completed || false,
        practice: stepProgress?.practice_completed || false,
        quiz: stepProgress?.test_completed || false,
      };

      console.log('📊 [GRAMMAR WRAPPER] Loaded step progress:', newProgress);

      setProgress(newProgress);

      // Determine current step - find first incomplete step
      if (!newProgress.lesson && contentTypes.includes('lesson')) {
        setCurrentStep('lesson');
      } else if (!newProgress.practice && contentTypes.includes('practice')) {
        setCurrentStep('practice');
      } else if (!newProgress.quiz && contentTypes.includes('quiz')) {
        setCurrentStep('quiz');
      } else {
        // All complete, default to first available
        setCurrentStep((contentTypes[0] as ContentType) || null);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const canStartContent = (type: ContentType): boolean => {
    const index = contentTypes.indexOf(type);
    if (index === 0) return true; // First content type is always available

    // Check if previous content types are completed
    for (let i = 0; i < index; i++) {
      const prevType = contentTypes[i] as ContentType;
      if (!progress[prevType]) return false;
    }
    return true;
  };

  const handleStartContent = async (type: ContentType) => {
    if (!canStartContent(type)) return;

    try {
      // Fetch topic details to build the proper navigation URL
      const { data: topicData, error } = await supabaseBrowser
        .from('grammar_topics')
        .select('slug, category, language')
        .eq('id', topicId)
        .single();

      if (error || !topicData) {
        console.error('Error fetching topic:', error);
        alert('Topic not found. Please try again.');
        return;
      }

      const topicSlug = topicData.slug;
      const categorySlug = topicData.category;
      
      // Map language code to full name (e.g., 'es' -> 'spanish')
      const languageMap: Record<string, string> = {
        'es': 'spanish',
        'spanish': 'spanish',
        'fr': 'french',
        'french': 'french',
        'de': 'german',
        'german': 'german',
        'it': 'italian',
        'italian': 'italian',
      };
      const languageSlug = languageMap[topicData.language] || topicData.language;

      // Build the URL based on content type
      let url = '';
      const baseUrl = `/grammar/${languageSlug}/${categorySlug}/${topicSlug}`;
      const params = `?assignment=${assignmentId}&activityId=${activityId}&mode=assignment`;

      switch (type) {
        case 'lesson':
          url = `${baseUrl}${params}`;
          break;
        case 'practice':
          url = `${baseUrl}/practice${params}`;
          break;
        case 'quiz':
          url = `${baseUrl}/test${params}`;
          break;
        default:
          alert(`Content type "${type}" is not supported.`);
          return;
      }

      console.log('🔗 [GRAMMAR WRAPPER] Navigating to:', url);
      router.push(url);
    } catch (error) {
      console.error('Error starting content:', error);
      alert('Failed to start activity. Please try again.');
    }
  };

  const getStepNumber = (type: ContentType): number => {
    return contentTypes.indexOf(type) + 1;
  };

  const getTotalSteps = (): number => {
    return contentTypes.length;
  };

  const getCompletedCount = (): number => {
    return contentTypes.filter((type) => progress[type as ContentType]).length;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600">Loading progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">{topicTitle}</h2>
          <div className="flex items-center gap-2 text-purple-100">
            <span className="text-sm">
              Progress: {getCompletedCount()} of {getTotalSteps()} completed
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(getCompletedCount() / getTotalSteps()) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Steps */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm mb-4">
            Complete each activity in order to master this topic:
          </p>

          {contentTypes.map((type) => {
            const contentType = type as ContentType;
            const info = contentTypeInfo[contentType];
            const Icon = info.icon;
            const isCompleted = progress[contentType];
            const canStart = canStartContent(contentType);
            const isCurrent = currentStep === contentType;
            const stepNumber = getStepNumber(contentType);

            return (
              <div
                key={type}
                className={`relative border-2 rounded-xl p-5 transition-all duration-200 ${
                  isCompleted
                    ? 'bg-green-50 border-green-300'
                    : canStart
                    ? `bg-${info.color}-50 border-${info.color}-300 shadow-md`
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number Badge */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : canStart
                        ? `bg-${info.color}-500 text-white`
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                  </div>

                  {/* Content Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-5 w-5 text-${info.color}-600`} />
                      <h3 className="font-bold text-lg text-gray-900">{info.label}</h3>
                      {!canStart && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>
                    <p className="text-sm text-gray-600">{info.description}</p>

                    {isCompleted && (
                      <div className="mt-2 flex items-center gap-2 text-green-700 text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleStartContent(contentType)}
                      disabled={!canStart}
                      className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center gap-2 ${
                        !canStart
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : isCompleted
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                          : `bg-gradient-to-r from-${info.color}-500 to-${info.color}-600 text-white hover:from-${info.color}-600 hover:to-${info.color}-700 transform hover:scale-105 shadow-lg`
                      }`}
                    >
                      {isCompleted ? 'Review' : isCurrent ? 'Start' : 'Locked'}
                      {canStart && <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-2xl p-6 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Learning Path</h4>
              <p className="text-sm text-gray-600">
                Complete activities in order for the best learning experience. Each step builds on the
                previous one to help you master the topic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
