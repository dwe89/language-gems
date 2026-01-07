'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { 
  Settings, 
  Users, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  Calendar,
  Target,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface TeacherControl {
  id: string;
  name: string;
  description: string;
  type: 'assignment_restriction' | 'progress_tracking' | 'content_control' | 'time_limit';
  isEnabled: boolean;
  settings: any;
}

interface StudentRestriction {
  studentId: string;
  studentName: string;
  assignmentOnlyMode: boolean;
  allowedVocabularySets: string[];
  timeRestrictions: {
    dailyLimit: number; // minutes
    sessionLimit: number; // minutes
    allowedHours: { start: string; end: string }[];
  };
  progressVisibility: {
    showToStudent: boolean;
    showToParents: boolean;
    detailLevel: 'basic' | 'detailed' | 'full';
  };
}

export default function TeacherControlsPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assignments' | 'restrictions' | 'tracking' | 'reports'>('assignments');
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [students, setStudents] = useState<any[]>([]);
  const [controls, setControls] = useState<TeacherControl[]>([]);
  const [restrictions, setRestrictions] = useState<StudentRestriction[]>([]);

  useEffect(() => {
    if (user) {
      loadTeacherData();
    }
  }, [user]);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      
      // Load teacher's classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, description')
        .eq('teacher_id', user?.id);

      if (classesError) throw classesError;
      setClasses(classesData || []);

      // Load students
      const { data: enrollmentsData, error: studentsError } = await supabase
        .from('class_enrollments')
        .select('student_id, class_id')
        .in('class_id', (classesData || []).map(c => c.id));

      if (studentsError) throw studentsError;
      
      // Get user profiles for these students
      const studentIds = enrollmentsData?.map(e => e.student_id) || [];
      let userProfiles: any[] = [];
      
      if (studentIds.length > 0) {
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id, display_name, email')
          .in('user_id', studentIds);
        userProfiles = profiles || [];
      }

      // Create a map for quick lookup
      const profileMap = new Map();
      userProfiles.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });
      
      const processedStudents = (enrollmentsData || []).map(enrollment => ({
        id: enrollment.student_id,
        name: profileMap.get(enrollment.student_id)?.display_name || 'Unknown',
        email: profileMap.get(enrollment.student_id)?.email || ''
      }));
      
      setStudents(processedStudents);

      // Load existing controls and restrictions
      loadControlsAndRestrictions();
      
    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadControlsAndRestrictions = async () => {
    // Mock data for controls and restrictions
    // In a real implementation, this would come from the database
    const mockControls: TeacherControl[] = [
      {
        id: '1',
        name: 'Assignment Only Mode',
        description: 'Restrict students to only work on assigned vocabulary sets',
        type: 'assignment_restriction',
        isEnabled: false,
        settings: { allowFreeExploration: true }
      },
      {
        id: '2',
        name: 'Progress Visibility',
        description: 'Control what progress information students can see',
        type: 'progress_tracking',
        isEnabled: true,
        settings: { showDetailedStats: true, showComparisons: false }
      },
      {
        id: '3',
        name: 'Time Limits',
        description: 'Set daily and session time limits for vocabulary practice',
        type: 'time_limit',
        isEnabled: false,
        settings: { dailyLimit: 60, sessionLimit: 30 }
      },
      {
        id: '4',
        name: 'Content Filtering',
        description: 'Control which vocabulary sets students can access',
        type: 'content_control',
        isEnabled: true,
        settings: { allowedDifficulties: ['beginner', 'intermediate'] }
      }
    ];

    const mockRestrictions: StudentRestriction[] = students.map(student => ({
      studentId: student.id,
      studentName: student.name,
      assignmentOnlyMode: false,
      allowedVocabularySets: [],
      timeRestrictions: {
        dailyLimit: 60,
        sessionLimit: 30,
        allowedHours: [{ start: '09:00', end: '17:00' }]
      },
      progressVisibility: {
        showToStudent: true,
        showToParents: false,
        detailLevel: 'detailed'
      }
    }));

    setControls(mockControls);
    setRestrictions(mockRestrictions);
  };

  const toggleControl = async (controlId: string) => {
    setControls(prev => prev.map(control => 
      control.id === controlId 
        ? { ...control, isEnabled: !control.isEnabled }
        : control
    ));
    
    // In a real implementation, this would update the database
    console.log('Toggling control:', controlId);
  };

  const updateStudentRestriction = async (studentId: string, updates: Partial<StudentRestriction>) => {
    setRestrictions(prev => prev.map(restriction =>
      restriction.studentId === studentId
        ? { ...restriction, ...updates }
        : restriction
    ));
    
    // In a real implementation, this would update the database
    console.log('Updating student restriction:', studentId, updates);
  };

  const exportProgressReport = () => {
    // Generate and download progress report
    const csvContent = generateProgressReport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary-progress-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // Safe cleanup with timeout
    setTimeout(() => {
      try {
        window.URL.revokeObjectURL(url);
        if (a.parentNode === document.body) {
          document.body.removeChild(a);
        }
      } catch (removeError) {
        console.warn('Failed to remove download link from DOM:', removeError);
      }
    }, 100);
  };

  const generateProgressReport = () => {
    let csv = 'Student Name,Total Gems,Mastered Gems,Current Streak,Assignment Progress,Free Practice Time\n';
    
    // Mock data - in real implementation, this would query actual student progress
    students.forEach(student => {
      csv += `${student.name},${Math.floor(Math.random() * 100)},${Math.floor(Math.random() * 50)},${Math.floor(Math.random() * 20)},${Math.floor(Math.random() * 100)}%,${Math.floor(Math.random() * 120)} min\n`;
    });
    
    return csv;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teacher controls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="w-8 h-8 mr-3 text-indigo-600" />
                Teacher Controls
              </h1>
              <p className="text-gray-600">Manage student access, restrictions, and progress tracking</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              
              <button
                onClick={exportProgressReport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              
              <Link
                href="/dashboard/vocabulary-mining"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Back to Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-8">
          {[
            { id: 'assignments', name: 'Assignment Controls', icon: BookOpen },
            { id: 'restrictions', name: 'Student Restrictions', icon: Lock },
            { id: 'tracking', name: 'Progress Tracking', icon: TrendingUp },
            { id: 'reports', name: 'Reports & Analytics', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Assignment Controls Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Controls</h3>
              <p className="text-gray-600 mb-6">
                Configure how students interact with assignments and vocabulary practice.
              </p>
              
              <div className="space-y-4">
                {controls.filter(c => c.type === 'assignment_restriction').map(control => (
                  <div key={control.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{control.name}</h4>
                      <p className="text-sm text-gray-600">{control.description}</p>
                    </div>
                    <button
                      onClick={() => toggleControl(control.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        control.isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          control.isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Assignment Deadlines */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Deadlines</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Automatic Extensions</h4>
                    <p className="text-sm text-gray-600">Allow automatic deadline extensions for struggling students</p>
                  </div>
                  <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                    Configure
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Late Submission Policy</h4>
                    <p className="text-sm text-gray-600">Set penalties and grace periods for late submissions</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Restrictions Tab */}
        {activeTab === 'restrictions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Restrictions</h3>
              <p className="text-gray-600 mb-6">
                Control individual student access to vocabulary mining features.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 text-sm font-medium text-gray-600">Student</th>
                      <th className="py-2 text-sm font-medium text-gray-600">Assignment Only</th>
                      <th className="py-2 text-sm font-medium text-gray-600">Daily Limit</th>
                      <th className="py-2 text-sm font-medium text-gray-600">Progress Visibility</th>
                      <th className="py-2 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restrictions.map((restriction) => (
                      <tr key={restriction.studentId} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div className="font-medium text-gray-900">{restriction.studentName}</div>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => updateStudentRestriction(restriction.studentId, {
                              assignmentOnlyMode: !restriction.assignmentOnlyMode
                            })}
                            className={`p-1 rounded ${
                              restriction.assignmentOnlyMode ? 'text-red-600' : 'text-gray-400'
                            }`}
                          >
                            {restriction.assignmentOnlyMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">
                            {restriction.timeRestrictions.dailyLimit} min
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => updateStudentRestriction(restriction.studentId, {
                              progressVisibility: {
                                ...restriction.progressVisibility,
                                showToStudent: !restriction.progressVisibility.showToStudent
                              }
                            })}
                            className={`p-1 rounded ${
                              restriction.progressVisibility.showToStudent ? 'text-green-600' : 'text-gray-400'
                            }`}
                          >
                            {restriction.progressVisibility.showToStudent ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="py-3">
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Tracking Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Tracking Granularity</h4>
                  {[
                    { id: 'basic', name: 'Basic Progress', desc: 'Overall completion and scores' },
                    { id: 'detailed', name: 'Detailed Analytics', desc: 'Time spent, accuracy, streaks' },
                    { id: 'comprehensive', name: 'Comprehensive Tracking', desc: 'All interactions and patterns' }
                  ].map(option => (
                    <label key={option.id} className="flex items-start">
                      <input
                        type="radio"
                        name="tracking-level"
                        value={option.id}
                        className="mt-1 mr-3"
                        defaultChecked={option.id === 'detailed'}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.name}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Data Retention</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Store detailed session data</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Track time spent per word</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Record incorrect answers</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Monitor learning patterns</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports & Analytics Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Reports</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Weekly Progress Report</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Automated weekly summary of student progress and achievements.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600">✓ Enabled</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Assignment Completion Alert</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Notifications when students complete or miss assignments.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600">✓ Enabled</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Parent Progress Updates</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Monthly progress reports sent to parents/guardians.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Disabled</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Enable
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Curriculum Coverage Report</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Track coverage of curriculum vocabulary requirements.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600">✓ Enabled</span>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
