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
  CheckCircle, ChevronRight
} from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Card, CardContent } from "../../../../components/ui/card";
import { StudentCard } from "../../../../components/classes/StudentCard";
import { AssignmentCard } from "../../../../components/classes/AssignmentCard";
import { BulkAddStudentsModal } from "../../../../components/classes/BulkAddStudentsModal";
import { use } from 'react';

// Define types for our data
type ClassData = {
  id: string;
  name: string;
  description: string;
  level: string;
  created_at: string;
  code: string;
  teacher_id: string;
};

type Student = {
  id: string;
  name: string;
  username: string;
  progress: number;
  joined_date: string;
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

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  // Properly use React.use() to access params
  const { classId } = use(params);
  
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  
  useEffect(() => {
    async function fetchClassData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch actual class data
        const { data: classDataResult, error: classError } = await supabaseBrowser
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
        
        // Fetch students in the class
        const { data: enrollments, error: studentsError } = await supabaseBrowser
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
          const { data: userProfiles, error: profilesError } = await supabaseBrowser
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
            
            // Transform to match our Student type
            const formattedStudents: Student[] = enrollments.map(enrollment => {
              const profile = profileMap.get(enrollment.student_id);
              return {
                id: enrollment.student_id,
                name: profile?.display_name || 'Unknown',
                username: profile?.username || '',
                progress: 0, // TODO: Calculate real progress from assignments/vocabulary
                joined_date: enrollment.enrolled_at,
              };
            });
            
            setStudents(formattedStudents);
          }
        }
        
        // Fetch word lists/assignments (simplified for now)
        const { data: assignments, error: assignmentsError } = await supabaseBrowser
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
    
    if (diffInDays < 2) return { status: 'Active', color: 'text-green-400' };
    if (diffInDays < 7) return { status: 'Recent', color: 'text-teal-400' };
    if (diffInDays < 14) return { status: 'Away', color: 'text-yellow-400' };
    return { status: 'Inactive', color: 'text-red-400' };
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        <p className="text-gray-400 text-lg">Loading class data...</p>
      </div>
    );
  }
  
  if (!classData) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="text-center py-16 px-4 bg-gray-800/30 border border-gray-700 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Class Not Found</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">The class you're looking for doesn't exist or you don't have access to it.</p>
          <Link 
            href="/dashboard/classes" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <Link href="/dashboard/classes" className="hover:text-gray-300">Classes</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-300">{classData.name}</span>
      </div>
      
      {/* Main class header */}
      <div className="bg-gradient-to-r from-teal-900/70 to-emerald-900/70 rounded-xl border border-teal-800/50 overflow-hidden shadow-xl">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{classData.name}</h1>
              {classData.description && (
                <p className="mt-2 text-teal-100/90 text-lg max-w-2xl">{classData.description}</p>
              )}
              
              <div className="flex flex-wrap items-center mt-5 gap-3">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  classData.level === 'beginner' ? 'bg-green-900/60 text-green-200 border border-green-800/70' :
                  classData.level === 'intermediate' ? 'bg-yellow-900/60 text-yellow-200 border border-yellow-800/70' :
                  'bg-red-900/60 text-red-200 border border-red-800/70'
                }`}>
                  <Book className="h-4 w-4 mr-1.5" />
                  {classData.level.charAt(0).toUpperCase() + classData.level.slice(1)}
                </span>
                
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 text-white text-sm border border-white/20">
                  <Users className="h-4 w-4 mr-1.5" />
                  {students.length} Student{students.length !== 1 ? 's' : ''}
                </span>
                
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 text-white text-sm border border-white/20">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Created {formatDate(classData.created_at)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-5 rounded-lg border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-teal-200/80 font-semibold mb-1">Class Code</div>
                    <div className="text-3xl font-bold text-white tracking-wide">{classData.code || 'No code'}</div>
                  </div>
                  <Link 
                    href={`/dashboard/classes/${classId}/edit`} 
                    className="ml-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white transition-all"
                  >
                    <Pencil className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setShowBulkAddModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="border-b border-slate-800">
          <Tabs defaultValue="students" className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="w-full sm:w-auto bg-slate-800/80 border border-slate-700/50">
                <TabsTrigger value="students" className="px-5 py-2.5 data-[state=active]:bg-indigo-700/80 data-[state=active]:text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Students
                </TabsTrigger>
                <TabsTrigger value="assignments" className="px-5 py-2.5 data-[state=active]:bg-indigo-700/80 data-[state=active]:text-white">
                  <Book className="h-4 w-4 mr-2" />
                  Assignments
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="students" className="m-0">
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-white">Students</h2>
                  <div className="flex space-x-3 mt-2 sm:mt-0">
                    <Button variant="outline" onClick={() => setShowBulkAddModal(true)} className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-gray-300 hover:text-white">
                      <Users className="h-4 w-4 mr-2" />
                      Add Multiple
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  {students.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {students.map((student) => (
                        <StudentCard 
                          key={student.id} 
                          student={student} 
                          classId={classId}
                          onStudentDeleted={(studentId) => {
                            setStudents(students.filter(s => s.id !== studentId));
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 px-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                      <Users className="h-16 w-16 mx-auto text-slate-600 mb-4" />
                      <p className="text-slate-300 text-xl font-medium mb-2">No students added yet</p>
                      <p className="text-slate-400 max-w-md mx-auto mb-6">Add students to your class to track their progress and assign work.</p>
                      <Button onClick={() => setShowBulkAddModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add First Student
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="m-0">
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-white">Assignments</h2>
                  <Button className="mt-2 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Book className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
                
                <div className="pt-2">
                  {wordLists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <div className="text-center py-20 px-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                      <Book className="h-16 w-16 mx-auto text-slate-600 mb-4" />
                      <p className="text-slate-300 text-xl font-medium mb-2">No assignments created yet</p>
                      <p className="text-slate-400 max-w-md mx-auto mb-6">Create assignments to give your students vocabulary lists to learn.</p>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Book className="h-4 w-4 mr-2" />
                        Create First Assignment
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
  );
} 