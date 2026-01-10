'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ArrowRight, ArrowLeft, CheckCircle,
  AlertCircle, GraduationCap, FileText, Trash2, Plus
} from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import { EnhancedAssignmentService, AssignmentCreationData } from '../../services/enhancedAssignmentService';
import AssessmentConfigModal from '../assignments/AssessmentConfigModal';
import { useRouter } from 'next/navigation';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

// Available assessment types - matches the main ASSESSMENT_TYPES list
const AVAILABLE_ASSESSMENTS = [
  {
    id: 'reading-comprehension',
    name: 'Reading Comprehension',
    type: 'reading',
    estimatedTime: '15-25 minutes',
    skills: ['Reading', 'Comprehension'],
    description: 'Test your understanding of written texts'
  },
  {
    id: 'gcse-reading',
    name: 'GCSE Reading Exam',
    type: 'reading',
    estimatedTime: '45-60 min',
    skills: ['Reading'],
    description: 'AQA & Edexcel papers',
    requiresExamBoard: true,
    requiresPaper: true
  },
  {
    id: 'gcse-listening',
    name: 'GCSE Listening Exam',
    type: 'listening',
    estimatedTime: '35-45 min',
    skills: ['Listening'],
    description: 'AQA & Edexcel papers',
    requiresExamBoard: true,
    requiresPaper: true
  },
  {
    id: 'gcse-writing',
    name: 'GCSE Writing Exam',
    type: 'writing',
    estimatedTime: '60-75 min',
    skills: ['Writing'],
    description: 'AQA papers available',
    requiresExamBoard: true,
    requiresPaper: true
  },
  {
    id: 'gcse-speaking',
    name: 'GCSE Speaking Exam',
    type: 'speaking',
    estimatedTime: '7-12 min',
    skills: ['Speaking'],
    description: 'AQA & Edexcel speaking assessments',
    requiresExamBoard: true,
    requiresPaper: false
  },
  {
    id: 'topic-based',
    name: 'Topic-Based Assessments',
    type: 'reading',
    estimatedTime: '15-25 minutes',
    skills: ['Reading', 'Vocabulary', 'Grammar'],
    description: 'Focused practice on specific AQA themes and topics'
  },
  {
    id: 'dictation',
    name: 'Dictation Practice',
    type: 'listening',
    estimatedTime: '10-15 minutes',
    skills: ['Listening', 'Writing', 'Spelling'],
    description: 'Improve listening and writing skills with GCSE-style dictation exercises'
  }
];

interface AssessmentConfig {
  selectedAssessments: Array<{
    id: string;
    type: string;
    name: string;
    estimatedTime: string;
    skills: string[];
    instanceConfig?: {
      language?: 'spanish' | 'french' | 'german';
      level?: 'KS3' | 'KS4';
      difficulty?: 'foundation' | 'higher';
      examBoard?: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
      paper?: string;
      theme?: string;
      topic?: string;
      category?: string;
      subcategory?: string;
      timeLimit?: number;
      maxAttempts?: number;
      autoGrade?: boolean;
      feedbackEnabled?: boolean;
    };
  }>;
  generalLanguage: 'spanish' | 'french' | 'german';
  generalLevel: 'KS3' | 'KS4';
  generalDifficulty: 'foundation' | 'higher';
  generalExamBoard: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
  generalTimeLimit: number;
  generalMaxAttempts: number;
  generalAutoGrade: boolean;
  generalFeedbackEnabled: boolean;
  assessmentCategory: string;
  assessmentSubcategory: string;
}

export default function AssessmentCreator() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = supabaseBrowser;
  const assignmentService = new EnhancedAssignmentService(supabase);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedAssessmentForConfig, setSelectedAssessmentForConfig] = useState<typeof AVAILABLE_ASSESSMENTS[0] | null>(null);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);

  // Availability Check
  const [assessmentAvailability, setAssessmentAvailability] = useState<Record<string, number>>({});
  const [availabilityLoading, setAvailabilityLoading] = useState(true);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const res = await fetch('/api/assessments/availability');
        const data = await res.json();
        if (data.success) {
          setAssessmentAvailability(data.counts);
        }
      } catch (e) {
        console.error('Failed to check availability', e);
      } finally {
        setAvailabilityLoading(false);
      }
    };
    checkAvailability();
  }, []);

  // Assignment Details
  const [assignmentDetails, setAssignmentDetails] = useState<{
    title: string;
    description: string;
    due_date: string;
    class_id: string;
    curriculum_level: 'KS3' | 'KS4';
  }>({
    title: '',
    description: '',
    due_date: '',
    class_id: '',
    curriculum_level: 'KS3'
  });

  // Assessment Config
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>({
    selectedAssessments: [],
    generalLanguage: 'spanish',
    generalLevel: 'KS3',
    generalDifficulty: 'foundation',
    generalExamBoard: 'AQA',
    generalTimeLimit: 30,
    generalMaxAttempts: 1,
    generalAutoGrade: true,
    generalFeedbackEnabled: true,
    assessmentCategory: '',
    assessmentSubcategory: ''
  });

  // Fetch classes
  useEffect(() => {
    if (!user) return;
    const fetchClasses = async () => {
      const { data } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user.id)
        .order('name');
      if (data) setAvailableClasses(data);
    };
    fetchClasses();
  }, [user, supabase]);

  // Date and time handlers
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value; // e.g., "2025-08-04"
    // Ensure time part exists, default to 23:59 if not
    const existingTime = assignmentDetails.due_date?.split('T')[1] || '23:59';
    setAssignmentDetails(prev => ({ ...prev, due_date: `${newDate}T${existingTime}` }));
  };

  const handleDueTimeHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value;
    // Ensure date part exists, default to today if not
    const existingDate = assignmentDetails.due_date?.split('T')[0] || new Date().toISOString().split('T')[0];
    const existingMinute = assignmentDetails.due_date?.split('T')[1]?.split(':')[1] || '59';
    setAssignmentDetails(prev => ({ ...prev, due_date: `${existingDate}T${newHour}:${existingMinute}` }));
  };

  const handleDueTimeMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = e.target.value;
    // Ensure date part exists, default to today if not
    const existingDate = assignmentDetails.due_date?.split('T')[0] || new Date().toISOString().split('T')[0];
    const existingHour = assignmentDetails.due_date?.split('T')[1]?.split(':')[0] || '23';
    setAssignmentDetails(prev => ({ ...prev, due_date: `${existingDate}T${existingHour}:${newMinute}` }));
  };

  const steps: AssessmentStep[] = [
    {
      id: 'details',
      title: 'Assessment Details',
      description: 'Basic info and class selection',
      icon: <FileText className="w-5 h-5" />,
      completed: !!assignmentDetails.title && !!assignmentDetails.due_date && selectedClasses.length > 0
    },
    {
      id: 'selection',
      title: 'Select Assessment',
      description: 'Choose assessment type and content',
      icon: <GraduationCap className="w-5 h-5" />,
      completed: assessmentConfig.selectedAssessments.length > 0
    },
    {
      id: 'review',
      title: 'Review & Create',
      description: 'Final check before assigning',
      icon: <CheckCircle className="w-5 h-5" />,
      completed: false
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const openConfigModal = (assessmentType: typeof AVAILABLE_ASSESSMENTS[0]) => {
    setSelectedAssessmentForConfig(assessmentType);
    setEditingAssessmentId(null);
    setConfigModalOpen(true);
  };

  const handleConfigSave = (config: any) => {
    const newAssessment = {
      id: `${selectedAssessmentForConfig?.id}-${Date.now()}`,
      type: selectedAssessmentForConfig?.id || '',
      name: selectedAssessmentForConfig?.name || '',
      estimatedTime: selectedAssessmentForConfig?.estimatedTime || '',
      skills: selectedAssessmentForConfig?.skills || [],
      instanceConfig: config
    };

    setAssessmentConfig(prev => ({
      ...prev,
      selectedAssessments: [...prev.selectedAssessments, newAssessment] // Append to allow multiple assessments
    }));
    setConfigModalOpen(false);
  };

  const removeAssessment = (id: string) => {
    setAssessmentConfig(prev => ({
      ...prev,
      selectedAssessments: prev.selectedAssessments.filter(a => a.id !== id)
    }));
  };

  const handleCreate = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('User not authenticated');
      if (selectedClasses.length === 0) throw new Error('Please select at least one class.');
      if (assessmentConfig.selectedAssessments.length === 0) throw new Error('Please select an assessment.');

      const finalAssignmentData: AssignmentCreationData = {
        title: assignmentDetails.title,
        description: assignmentDetails.description,
        due_date: assignmentDetails.due_date,
        class_id: '', // Will be set in loop
        curriculum_level: assignmentDetails.curriculum_level,
        game_type: 'assessment',
        config: {
          curriculumLevel: assignmentDetails.curriculum_level,
          assessmentConfig: assessmentConfig
        },
        time_limit: assessmentConfig.generalTimeLimit,
        max_attempts: assessmentConfig.generalMaxAttempts,
        auto_grade: assessmentConfig.generalAutoGrade,
        feedback_enabled: assessmentConfig.generalFeedbackEnabled,
        hints_allowed: false,
        power_ups_enabled: false
      };

      for (const classId of selectedClasses) {
        await assignmentService.createEnhancedAssignment(user.id, {
          ...finalAssignmentData,
          class_id: classId
        });
      }

      router.push('/dashboard/assessments');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Assessment</h1>
        <p className="text-gray-600 mt-2">Assign reading, listening, and exam-style assessments to your classes.</p>
      </div>

      {/* Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2" />
        {steps.map((step, index) => (
          <div key={step.id} className={`flex flex-col items-center bg-white px-4 z-10 ${index <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${index < currentStep ? 'bg-green-500 text-white' :
              index === currentStep ? 'bg-indigo-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
              {index < currentStep ? <CheckCircle className="w-6 h-6" /> : step.icon}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={assignmentDetails.title}
                  onChange={e => setAssignmentDetails(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Year 10 Reading Assessment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={assignmentDetails.due_date ? assignmentDetails.due_date.split('T')[0] : ''}
                    onChange={handleDueDateChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <div className="flex space-x-2">
                    <select
                      value={assignmentDetails.due_date ? assignmentDetails.due_date.split('T')[1]?.split(':')[0] || '23' : '23'}
                      onChange={handleDueTimeHourChange}
                      className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span className="flex items-center text-gray-700">:</span>
                    <select
                      value={assignmentDetails.due_date ? assignmentDetails.due_date.split('T')[1]?.split(':')[1] || '59' : '59'}
                      onChange={handleDueTimeMinuteChange}
                      className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={3}
                value={assignmentDetails.description}
                onChange={e => setAssignmentDetails(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Instructions for students..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Classes <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableClasses.map(cls => (
                  <div
                    key={cls.id}
                    onClick={() => {
                      setSelectedClasses(prev =>
                        prev.includes(cls.id)
                          ? prev.filter(id => id !== cls.id)
                          : [...prev, cls.id]
                      );
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedClasses.includes(cls.id)
                      ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                      : 'hover:bg-gray-50 border-gray-200'
                      }`}
                  >
                    <div className="font-medium text-gray-900">{cls.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Level <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setAssignmentDetails(prev => ({ ...prev, curriculum_level: 'KS3' }))}
                  className={`px-4 py-2 rounded-lg border ${assignmentDetails.curriculum_level === 'KS3'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  KS3 (Years 7-9)
                </button>
                <button
                  onClick={() => setAssignmentDetails(prev => ({ ...prev, curriculum_level: 'KS4' }))}
                  className={`px-4 py-2 rounded-lg border ${assignmentDetails.curriculum_level === 'KS4'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  KS4 (GCSE)
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select Assessment Type <span className="text-red-500">*</span>
              </h3>
              <p className="text-gray-600">Choose the type of assessment you want to assign to your students.</p>
            </div>
            {availabilityLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {AVAILABLE_ASSESSMENTS.some(a => assessmentAvailability[a.id] > 0) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {AVAILABLE_ASSESSMENTS
                      .filter(assessment => assessmentAvailability[assessment.id] > 0)
                      .map(assessment => (
                        <div
                          key={assessment.id}
                          onClick={() => openConfigModal(assessment)}
                          className="border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer bg-white hover:border-indigo-300 group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                              <GraduationCap className="w-6 h-6 text-indigo-600" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{assessment.name}</h3>
                          <p className="text-sm text-gray-500 mb-3">{assessment.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {assessment.skills.map(skill => (
                              <span key={skill} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Assessments Coming Soon</h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">We are currently preparing our assessment library. Please check back later.</p>
                  </div>
                )}
              </>
            )}

            {assessmentConfig.selectedAssessments.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Selected Assessments
                    <span className="ml-2 px-2 py-0.5 text-sm bg-indigo-100 text-indigo-700 rounded-full">
                      {assessmentConfig.selectedAssessments.length}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500">Click another assessment type above to add more</p>
                </div>
                <div className="space-y-3">
                  {assessmentConfig.selectedAssessments.map((assessment, idx) => (
                    <div key={assessment.id} className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100 group hover:border-indigo-200 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-medium text-indigo-900">{assessment.name}</div>
                          <div className="text-sm text-indigo-700">
                            {assessment.instanceConfig?.examBoard || 'General'} • {assessment.instanceConfig?.difficulty || 'Standard'} • {assessment.instanceConfig?.paper || assessment.instanceConfig?.subcategory || 'Standard'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAssessment(assessment.id)}
                        className="p-2 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove assessment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Click any assessment card above to add another assessment to this bundle</span>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Assignment</h3>
                <p className="text-lg font-semibold text-gray-900">{assignmentDetails.title}</p>
                <p className="text-gray-600">{assignmentDetails.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Due Date</h3>
                  <p className="text-gray-900">{new Date(assignmentDetails.due_date).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Classes</h3>
                  <p className="text-gray-900">{selectedClasses.length} classes selected</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Assessments</h3>
                <div className="space-y-2">
                  {assessmentConfig.selectedAssessments.map(a => (
                    <div key={a.id} className="bg-white p-3 rounded border border-gray-200">
                      <span className="font-medium">{a.name}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({a.instanceConfig?.examBoard || 'Standard'} - {a.instanceConfig?.level || 'KS3'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || loading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!steps[currentStep].completed}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${steps[currentStep].completed
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-8 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center shadow-lg shadow-green-200"
          >
            {loading ? 'Creating...' : 'Create Assessment'}
            {!loading && <CheckCircle className="w-4 h-4 ml-2" />}
          </button>
        )}
      </div>

      {/* Config Modal */}
      {selectedAssessmentForConfig && (
        <AssessmentConfigModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          onSave={handleConfigSave}
          assessmentType={selectedAssessmentForConfig}
          currentConfig={editingAssessmentId
            ? assessmentConfig.selectedAssessments.find(a => a.id === editingAssessmentId)?.instanceConfig
            : undefined
          }
        />
      )}
    </div>
  );
}
