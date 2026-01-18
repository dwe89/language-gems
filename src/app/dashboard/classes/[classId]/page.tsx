'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import Link from 'next/link';
import {
  ArrowLeft, Users, Calendar, Clock, Book, Settings,
  Download, Upload, UserPlus, Mail, Pencil, Trash2,
  CheckCircle, ChevronRight, FileText, Sparkles, TrendingUp, Award, Activity, Star,
  Bell, AlertCircle, Brain, Eye
} from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Card, CardContent } from "../../../../components/ui/card";
import { StudentCard } from "../../../../components/classes/StudentCard";
import { AssignmentCard } from "../../../../components/classes/AssignmentCard";
import { BulkAddStudentsModal } from "../../../../components/classes/BulkAddStudentsModal";
import { downloadStudentCredentialsPDF, type StudentCredential } from "../../../../lib/pdf-utils";
import { AddStudentModal } from "../../../../components/classes/AddStudentModal";
import TeacherVocabularyAnalyticsDashboard from "../../../../components/teacher/TeacherVocabularyAnalyticsDashboard";
import TeacherGrammarAnalyticsDashboard from "../../../../components/teacher/TeacherGrammarAnalyticsDashboard";

// Define types for our data
type ClassData = {
  id: string;
  name: string;
  description: string;
  level: string;
  created_at: string;
  year_group: string;
  teacher_id: string;
};

type Student = {
  id: string;
  name: string;
  username: string;
  joined_date: string;
  last_active: string;
  overall_performance?: number;
};

type WordList = {
  id: string;
  name: string;
  word_count: number;
  assigned_date: string;
  due_date?: string;
  completed_by: number;
  totalStudents?: number;
};

type ClassParams = {
  params: {
    classId: string;
  };
};

export default function ClassDetailPage({ params }: { params: { classId: string } }) {
  const { classId } = params;

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [isClassOwner, setIsClassOwner] = useState(false);

  useEffect(() => {
    async function fetchClassData() {
      if (!user) return;

      try {
        setLoading(true);
        const supabase = supabaseBrowser;

        // Fetch actual class data
        const { data: classDataResult, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single();

        if (classError) {
          console.error('Error fetching class:', classError);
          setLoading(false);
          return;
        }

        if (!classDataResult) {
          console.error('Class not found');
          setLoading(false);
          return;
        }

        setClassData(classDataResult);

        // Check if current user is the class owner
        setIsClassOwner(classDataResult.teacher_id === user.id);

        // Fetch students in the class
        const { data: enrollments, error: studentsError } = await supabase
          .from('class_enrollments')
          .select(`
            student_id,
            enrolled_at
          `)
          .eq('class_id', classId);

        if (studentsError) {
          console.error('Error fetching students:', studentsError);
        } else if (enrollments && enrollments.length > 0) {
          // Get student IDs
          const studentIds = enrollments.map(item => item.student_id);

          // Fetch user profiles for these students
          const { data: userProfiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('user_id, display_name, username')
            .in('user_id', studentIds);

          if (profilesError) {
            console.error('Error fetching user profiles:', profilesError);
          } else if (userProfiles) {
            // Create a map for quick lookup
            const profileMap = new Map();
            userProfiles.forEach(profile => {
              profileMap.set(profile.user_id, profile);
            });

            // Fetch last activity data for each student
            const lastActivityPromises = studentIds.map(async (studentId) => {
              // Get last activity from multiple sources
              const [gameSessionResult, vocabResult] = await Promise.all([
                // Last game session
                supabase
                  .from('enhanced_game_sessions')
                  .select('ended_at')
                  .eq('student_id', studentId)
                  .not('ended_at', 'is', null)
                  .order('ended_at', { ascending: false })
                  .limit(1)
                  .single(),
                // Last vocabulary practice
                supabase
                  .from('vocabulary_gem_collection')
                  .select('last_encountered_at')
                  .eq('student_id', studentId)
                  .not('last_encountered_at', 'is', null)
                  .order('last_encountered_at', { ascending: false })
                  .limit(1)
                  .single()
              ]);

              // Find the most recent activity
              const activities = [];
              if (gameSessionResult.data?.ended_at) {
                activities.push(new Date(gameSessionResult.data.ended_at));
              }
              if (vocabResult.data?.last_encountered_at) {
                activities.push(new Date(vocabResult.data.last_encountered_at));
              }

              const lastActivity = activities.length > 0
                ? new Date(Math.max(...activities.map(d => d.getTime())))
                : null;

              return { studentId, lastActivity };
            });

            const lastActivityData = await Promise.all(lastActivityPromises);
            const activityMap = new Map();
            lastActivityData.forEach(({ studentId, lastActivity }) => {
              activityMap.set(studentId, lastActivity);
            });

            // Fetch total gems for each student from consolidated analytics
            const { data: gemsData } = await supabase
              .from('student_consolidated_xp_analytics')
              .select('student_id, total_gems')
              .in('student_id', studentIds);

            const gemsMap = new Map();
            if (gemsData) {
              gemsData.forEach(analytics => {
                gemsMap.set(analytics.student_id, analytics.total_gems || 0);
              });
            }

            // Transform to match our Student type
            const formattedStudents: Student[] = enrollments.map(enrollment => {
              const profile = profileMap.get(enrollment.student_id);
              const lastActivity = activityMap.get(enrollment.student_id);
              const totalGems = gemsMap.get(enrollment.student_id);

              return {
                id: enrollment.student_id,
                name: profile?.display_name || 'Unknown',
                username: profile?.username || '',
                joined_date: enrollment.enrolled_at,
                last_active: lastActivity ? lastActivity.toISOString() : enrollment.enrolled_at,
                overall_performance: totalGems,
              };
            });

            setStudents(formattedStudents);
          }
        }

        // Fetch word lists/assignments (simplified for now)
        const { data: assignments, error: assignmentsError } = await supabase
          .from('assignments')
          .select('*')
          .eq('class_id', classId);

        if (assignmentsError) {
          console.error('Error fetching assignments:', assignmentsError);
        } else if (assignments) {
          const formattedLists: WordList[] = assignments.map(item => ({
            id: item.id,
            name: item.title,
            word_count: 0, // TODO: Get real word count from vocabulary lists
            assigned_date: item.created_at,
            due_date: item.due_date,
            completed_by: 0 // TODO: Calculate real completion count
          }));

          setWordLists(formattedLists);
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClassData();
  }, [classId, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityStatus = (lastActiveDate: string) => {
    const now = new Date();
    const lastActive = new Date(lastActiveDate);
    const diffInDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 2) return { status: 'Active', color: 'text-emerald-500' };
    if (diffInDays < 7) return { status: 'Recent', color: 'text-orange-500' };
    if (diffInDays < 14) return { status: 'Away', color: 'text-yellow-500' };
    return { status: 'Inactive', color: 'text-red-500' };
  };

  const downloadCredentialsPDF = async () => {
    if (!classData || students.length === 0) return;

    setDownloadingPDF(true);
    try {
      const response = await fetch('/api/students/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: classId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch credentials');
      }

      if (data.students.length === 0) {
        alert('No student credentials found for this class.');
        return;
      }

      // Download the PDF with school code
      await downloadStudentCredentialsPDF(data.students, data.className, {
        schoolCode: data.schoolCode
      });

    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download student credentials. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const fixStudentCredentials = async () => {
    if (!classData) return;

    setDownloadingPDF(true); // Reuse the loading state
    try {
      const response = await fetch('/api/students/fix-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix credentials');
      }

      alert(`Successfully fixed credentials for ${data.fixed} students!`);

      // Refresh the page to show updated data
      window.location.reload();

    } catch (error) {
      console.error('Error fixing credentials:', error);
      alert('Failed to fix student credentials. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-16 text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-400 animate-pulse mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Class Details</h2>
            <p className="text-slate-600 font-medium">Gathering your class information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-12 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center mb-8 border border-red-200/50 shadow-lg">
              <Users className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Class Not Found</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">The class you're looking for doesn't exist or you don't have access to it.</p>
            <Link
              href="/dashboard/classes"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-3" />
              Back to Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* New, cleaner Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/classes"
                  className="flex items-center px-3 py-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-all duration-200 rounded-lg hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Classes
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <h1 className="text-3xl font-bold text-slate-900">{classData.name}</h1>
              </div>

              <p className="text-slate-600 text-base max-w-2xl leading-relaxed">
                {classData.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
                  <Users className="h-4 w-4 mr-2 text-slate-600" />
                  <span className="text-slate-900 font-semibold text-base">
                    {students.length} Student{students.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
                  <Calendar className="h-4 w-4 mr-2 text-slate-600" />
                  <span className="text-slate-900 font-semibold text-base">
                    Created {formatDate(classData.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel - Reused from previous design */}
            {isClassOwner && (
              <div className="lg:w-72 mt-4 lg:mt-0">
                <div className="bg-slate-100 rounded-2xl border border-slate-200 p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-slate-600 text-sm font-semibold uppercase tracking-wider">
                      Quick Actions
                    </div>
                    <Link
                      href={`/dashboard/classes/${classId}/edit`}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 transition-all duration-200 hover:scale-105 shadow border border-slate-200"
                      title="Edit Class Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="w-full text-left p-3 bg-white hover:bg-slate-50 rounded-xl transition-all duration-200 flex items-center text-slate-700 font-medium shadow border border-slate-200"
                    >
                      <UserPlus className="h-4 w-4 mr-3" />
                      <span>Add Student</span>
                    </button>
                    {students.length > 0 && (
                      <button
                        onClick={downloadCredentialsPDF}
                        disabled={downloadingPDF}
                        className="w-full text-left p-3 bg-white hover:bg-slate-50 rounded-xl transition-all duration-200 flex items-center text-slate-700 font-medium disabled:opacity-50 shadow border border-slate-200"
                      >
                        <FileText className="h-4 w-4 mr-3" />
                        <span>Download Credentials</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-slate-200 bg-white/50 px-8 pt-6">
              <TabsList className="bg-slate-100 border border-slate-200 rounded-xl p-1">
                <TabsTrigger
                  value="overview"
                  className="px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-semibold rounded-lg data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-semibold rounded-lg data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Students
                </TabsTrigger>
                <TabsTrigger
                  value="leaderboard"
                  className="px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-semibold rounded-lg data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger
                  value="vocabulary"
                  className="px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-semibold rounded-lg data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Vocabulary
                </TabsTrigger>
                <TabsTrigger
                  value="grammar"
                  className="px-6 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-semibold rounded-lg data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Grammar
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0">
              <div className="p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Class Overview</h2>
                  <p className="text-slate-600 mt-1">Quick snapshot of your class performance and activity</p>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-8 w-8 text-blue-600" />
                      <span className="text-3xl font-bold text-blue-900">{students.length}</span>
                    </div>
                    <p className="text-blue-700 font-semibold">Total Students</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <span className="text-3xl font-bold text-green-900">
                        {students.filter(s => {
                          const lastActive = new Date(s.last_active);
                          const daysSince = Math.floor((new Date().getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
                          return daysSince < 7;
                        }).length}
                      </span>
                    </div>
                    <p className="text-green-700 font-semibold">Active This Week</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <Book className="h-8 w-8 text-purple-600" />
                      <span className="text-3xl font-bold text-purple-900">{wordLists.length}</span>
                    </div>
                    <p className="text-purple-700 font-semibold">Active Assignments</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="h-8 w-8 text-amber-600" />
                      <span className="text-3xl font-bold text-amber-900">
                        {wordLists.length > 0
                          ? Math.round((wordLists.reduce((sum, wl) => sum + wl.completed_by, 0) / (wordLists.length * students.length)) * 100)
                          : 0}%
                      </span>
                    </div>
                    <p className="text-amber-700 font-semibold">Avg Completion</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h3>
                  {students.length > 0 ? (
                    <div className="space-y-3">
                      {students
                        .sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime())
                        .slice(0, 5)
                        .map(student => (
                          <div key={student.id} className="flex items-center justify-between bg-white rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{student.name}</p>
                                <p className="text-sm text-slate-600">@{student.username}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Last active</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {formatDate(student.last_active)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-center py-8">No student activity yet</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="m-0">
              <div className="p-8 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Students</h2>
                    <p className="text-slate-600 mt-1">
                      {isClassOwner
                        ? 'Manage your class members and track their progress'
                        : `${students.length} student${students.length !== 1 ? 's' : ''} enrolled`}
                    </p>
                    {!isClassOwner && (
                      <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Read-only view (you don't own this class)
                      </p>
                    )}
                  </div>

                  {isClassOwner && (
                    <div className="flex flex-wrap gap-3">
                      {students.length > 0 && (
                        <button
                          onClick={downloadCredentialsPDF}
                          disabled={downloadingPDF}
                          className="inline-flex items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                          {downloadingPDF ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-2" />
                              Download Credentials
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => setShowAddStudentModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Student
                      </button>

                      <button
                        onClick={() => setShowBulkAddModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Add Multiple
                      </button>
                    </div>
                  )}
                </div>

                {students.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {students.map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        classId={classId}
                        onStudentDeleted={(studentId) => {
                          setStudents(students.filter(s => s.id !== studentId));
                        }}
                        readOnly={!isClassOwner}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-3xl border border-slate-200/60 p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 border border-indigo-200/50">
                        <Users className="h-10 w-10 text-indigo-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">No students yet</h3>
                      <p className="text-slate-600 mb-8 leading-relaxed">
                        {isClassOwner
                          ? 'Add students to your class to track their progress and assign vocabulary work.'
                          : 'This class doesn\'t have any students yet.'}
                      </p>
                      {isClassOwner && (
                        <button
                          onClick={() => setShowAddStudentModal(true)}
                          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Your First Student
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="m-0">
              <div className="p-8 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
                    <p className="text-slate-600 mt-1">Create and manage vocabulary assignments for your students</p>
                  </div>

                  <Link
                    href={`/dashboard/assignments/new?classId=${classId}`}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Link>
                </div>

                {wordLists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {wordLists.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={{
                          ...assignment,
                          totalStudents: students.length
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-3xl border border-slate-200/60 p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 border border-indigo-200/50">
                        <Book className="h-10 w-10 text-indigo-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">No assignments yet</h3>
                      <p className="text-slate-600 mb-8 leading-relaxed">
                        Create assignments to give your students vocabulary lists to learn.
                      </p>
                      <Link
                        href={`/dashboard/assignments/new?classId=${classId}`}
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Book className="h-4 w-4 mr-2" />
                        Create First Assignment
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="m-0">
              <div className="p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Class Leaderboard</h2>
                  <p className="text-slate-600 mt-1">Top performers in your class</p>
                </div>

                {students.length > 0 ? (
                  <div className="space-y-4">
                    {students
                      .sort((a, b) => b.overall_performance - a.overall_performance)
                      .map((student, index) => (
                        <div
                          key={student.id}
                          className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${index === 0
                              ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300'
                              : index === 1
                                ? 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-300'
                                : index === 2
                                  ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300'
                                  : 'bg-white border-slate-200'
                            }`}
                        >
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${index === 0
                              ? 'bg-yellow-400 text-yellow-900'
                              : index === 1
                                ? 'bg-slate-400 text-slate-900'
                                : index === 2
                                  ? 'bg-orange-400 text-orange-900'
                                  : 'bg-slate-200 text-slate-700'
                            }`}>
                            {index + 1}
                          </div>

                          <div className="flex-1">
                            <p className="font-bold text-slate-900 text-lg">{student.name}</p>
                            <p className="text-sm text-slate-600">@{student.username}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Star className={`h-5 w-5 ${index < 3 ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
                            <span className="font-bold text-slate-900 text-xl">
                              {student.overall_performance || 0}
                            </span>
                            <span className="text-slate-600">gems</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200">
                    <Award className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No students yet</h3>
                    <p className="text-slate-600">Add students to see the leaderboard</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Vocabulary Tab */}
            <TabsContent value="vocabulary" className="m-0">
              <div className="p-8">
                <TeacherVocabularyAnalyticsDashboard classId={classId} />
              </div>
            </TabsContent>

            {/* Grammar Tab */}
            <TabsContent value="grammar" className="m-0">
              <div className="p-8">
                <TeacherGrammarAnalyticsDashboard classId={classId} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <AddStudentModal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          classId={classId}
          onStudentAdded={(newStudent: Student) => {
            setStudents((prev) => [...prev, newStudent]);
            setShowAddStudentModal(false);
          }}
        />

        <BulkAddStudentsModal
          isOpen={showBulkAddModal}
          onClose={() => setShowBulkAddModal(false)}
          classId={classId}
          onStudentsAdded={(newStudents) => {
            setStudents((prev) => [...prev, ...newStudents]);
            setShowBulkAddModal(false);
          }}
        />
      </div>
    </div>
  );
}
