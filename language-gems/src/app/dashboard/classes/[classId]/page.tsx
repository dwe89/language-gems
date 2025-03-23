'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Calendar, Clock, Book, Settings, 
  Download, Upload, UserPlus, Mail, Pencil, Trash2, 
  CheckCircle, AlertCircle
} from 'lucide-react';

// Define types for our data
type ClassData = {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  schedule: {
    day: string;
    time: string;
  }[];
  created_at: string;
  student_count: number;
  assigned_lists: number;
  code: string;
};

type Student = {
  id: string;
  name: string;
  email: string;
  progress: number;
  joined_date: string;
  last_active: string;
};

type WordList = {
  id: string;
  name: string;
  word_count: number;
  assigned_date: string;
  due_date?: string;
  completed_by: number;
};

export default function ClassDetailPage({ params }: { params: { classId: string } }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'wordlists' | 'settings'>('overview');
  
  useEffect(() => {
    async function fetchClassData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // For demo purposes, using mock data
        // In a real app, we would fetch this from Supabase
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock class data
        const mockClass: ClassData = {
          id: params.classId,
          name: "Beginner English A1",
          description: "Fundamental English for absolute beginners focusing on essential grammar and vocabulary.",
          level: "beginner",
          schedule: [
            { day: "Monday", time: "10:00 - 11:30" },
            { day: "Wednesday", time: "10:00 - 11:30" }
          ],
          created_at: "2023-09-01T09:00:00Z",
          student_count: 12,
          assigned_lists: 5,
          code: "ENG101"
        };
        
        // Mock students
        const mockStudents: Student[] = [
          {
            id: "student-1",
            name: "Alex Johnson",
            email: "alex.johnson@example.com",
            progress: 65,
            joined_date: "2023-09-15T10:30:00Z",
            last_active: "2023-11-05T14:22:00Z"
          },
          {
            id: "student-2",
            name: "Maria Garcia",
            email: "maria.garcia@example.com",
            progress: 82,
            joined_date: "2023-08-20T09:15:00Z",
            last_active: "2023-11-06T11:45:00Z"
          },
          {
            id: "student-3",
            name: "Hiroshi Tanaka",
            email: "hiroshi.tanaka@example.com",
            progress: 38,
            joined_date: "2023-10-02T16:40:00Z",
            last_active: "2023-11-03T18:10:00Z"
          },
          {
            id: "student-6",
            name: "Aisha Patel",
            email: "aisha.patel@example.com",
            progress: 28,
            joined_date: "2023-10-15T10:10:00Z",
            last_active: "2023-11-01T12:45:00Z"
          }
        ];
        
        // Mock word lists
        const mockWordLists: WordList[] = [
          {
            id: "list-123",
            name: "Essential Verbs - Beginner Level",
            word_count: 20,
            assigned_date: "2023-10-10T14:20:00Z",
            due_date: "2023-11-15T23:59:59Z",
            completed_by: 2
          },
          {
            id: "list-456",
            name: "Food and Cooking Vocabulary",
            word_count: 30,
            assigned_date: "2023-09-28T11:10:00Z",
            due_date: "2023-10-28T23:59:59Z",
            completed_by: 4
          },
          {
            id: "list-789",
            name: "Travel Phrases",
            word_count: 25,
            assigned_date: "2023-10-05T09:30:00Z",
            completed_by: 3
          }
        ];
        
        setClassData(mockClass);
        setStudents(mockStudents);
        setWordLists(mockWordLists);
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClassData();
  }, [params.classId, user]);
  
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  if (!classData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Class Not Found</h2>
        <p className="text-gray-300 mb-6">The class you're looking for doesn't exist or you don't have access to it.</p>
        <Link 
          href="/dashboard/classes" 
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <Link 
          href="/dashboard/classes" 
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to All Classes
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{classData.name}</h1>
            <p className="text-gray-300">{classData.description}</p>
            
            <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2">
              <span className={`inline-flex items-center text-sm ${
                classData.level === 'beginner' ? 'text-green-400' :
                classData.level === 'intermediate' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                <Book className="h-4 w-4 mr-1" />
                {classData.level.charAt(0).toUpperCase() + classData.level.slice(1)} Level
              </span>
              
              <span className="inline-flex items-center text-sm text-gray-300">
                <Users className="h-4 w-4 mr-1" />
                {classData.student_count} Students
              </span>
              
              <span className="inline-flex items-center text-sm text-gray-300">
                <Calendar className="h-4 w-4 mr-1" />
                Created {formatDate(classData.created_at)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="bg-indigo-800/40 px-4 py-2 rounded-md border border-indigo-700 flex items-center">
              <div className="mr-3">
                <div className="text-xs text-gray-400">Class Code</div>
                <div className="text-lg font-medium text-white">{classData.code}</div>
              </div>
              <button className="text-cyan-400 hover:text-cyan-300">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-8 border-b border-indigo-800">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center py-4 px-6 border-b-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`inline-flex items-center py-4 px-6 border-b-2 text-sm font-medium ${
              activeTab === 'students'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Students
          </button>
          <button
            onClick={() => setActiveTab('wordlists')}
            className={`inline-flex items-center py-4 px-6 border-b-2 text-sm font-medium ${
              activeTab === 'wordlists'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
            }`}
          >
            <Book className="h-4 w-4 mr-2" />
            Word Lists
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center py-4 px-6 border-b-2 text-sm font-medium ${
              activeTab === 'settings'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </nav>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-cyan-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Students</h2>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{classData.student_count}</div>
              <p className="text-gray-300 text-sm">Students enrolled in this class</p>
              <Link 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveTab('students'); }} 
                className="mt-4 inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Manage Students
                <ArrowLeft className="h-4 w-4 ml-1 transform rotate-180" />
              </Link>
            </div>
            
            <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Book className="h-6 w-6 text-yellow-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Word Lists</h2>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{classData.assigned_lists}</div>
              <p className="text-gray-300 text-sm">Lists assigned to this class</p>
              <Link 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveTab('wordlists'); }} 
                className="mt-4 inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Manage Word Lists
                <ArrowLeft className="h-4 w-4 ml-1 transform rotate-180" />
              </Link>
            </div>
            
            <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-green-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Schedule</h2>
              </div>
              <div className="space-y-2">
                {classData.schedule.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-gray-300">{item.day}</div>
                    <div className="text-white">{item.time}</div>
                  </div>
                ))}
              </div>
              <Link 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }} 
                className="mt-4 inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Edit Schedule
                <ArrowLeft className="h-4 w-4 ml-1 transform rotate-180" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Students</h2>
                <Link 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveTab('students'); }} 
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {students.slice(0, 3).map(student => {
                  const activityStatus = getActivityStatus(student.last_active);
                  
                  return (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{student.name}</div>
                          <div className="text-gray-400 text-sm">{student.email}</div>
                        </div>
                      </div>
                      <div className={`text-sm ${activityStatus.color}`}>
                        {activityStatus.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Word Lists</h2>
                <Link 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveTab('wordlists'); }} 
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {wordLists.slice(0, 3).map(list => (
                  <div key={list.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{list.name}</div>
                      <div className="text-gray-400 text-sm">
                        {list.word_count} words • {list.completed_by} completed
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      {list.due_date ? (
                        <span>Due {formatDate(list.due_date)}</span>
                      ) : (
                        <span>No deadline</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Students</h2>
            <div className="flex gap-2">
              <button className="flex items-center px-3 py-1 bg-indigo-800/40 hover:bg-indigo-700/60 text-white rounded-md text-sm">
                <Mail className="h-4 w-4 mr-1" />
                Message All
              </button>
              <button className="flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">
                <UserPlus className="h-4 w-4 mr-1" />
                Add Student
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-indigo-800">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Student</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Joined</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Active</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-800/50">
                {students.map(student => {
                  const activityStatus = getActivityStatus(student.last_active);
                  
                  return (
                    <tr key={student.id} className="hover:bg-indigo-800/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 bg-indigo-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{student.name.charAt(0)}</span>
                          </div>
                          <div className="ml-3">
                            <div className="text-white font-medium">{student.name}</div>
                            <div className="text-gray-400 text-sm">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-full bg-indigo-950/50 rounded-full h-2 mr-2 max-w-[100px]">
                            <div 
                              className={`h-2 rounded-full ${
                                student.progress >= 75 ? 'bg-green-500' :
                                student.progress >= 50 ? 'bg-cyan-500' :
                                student.progress >= 25 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-300 text-sm">
                          {formatDate(student.joined_date)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`text-sm ${activityStatus.color}`}>
                          {activityStatus.status}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatDate(student.last_active)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/students/${student.id}/performance`}
                            className="p-1 text-cyan-400 hover:text-cyan-300 rounded"
                            title="View Performance"
                          >
                            <Book className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/dashboard/students/${student.id}/message`}
                            className="p-1 text-cyan-400 hover:text-cyan-300 rounded"
                            title="Message Student"
                          >
                            <Mail className="h-5 w-5" />
                          </Link>
                          <button
                            className="p-1 text-red-400 hover:text-red-300 rounded"
                            title="Remove Student"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Word Lists Tab */}
      {activeTab === 'wordlists' && (
        <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Word Lists</h2>
            <div className="flex gap-2">
              <Link
                href="/dashboard/content"
                className="flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
              >
                <Book className="h-4 w-4 mr-1" />
                Assign New List
              </Link>
            </div>
          </div>
          
          {wordLists.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No word lists assigned</h3>
              <p className="text-gray-300 mb-6">Assign vocabulary lists to help your students learn new words.</p>
              <Link 
                href="/dashboard/content" 
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                <Book className="h-4 w-4 mr-2" />
                Browse Word Lists
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {wordLists.map(list => (
                <div key={list.id} className="bg-indigo-800/30 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{list.name}</h3>
                      <div className="text-gray-400 text-sm mt-1">
                        {list.word_count} words • Assigned on {formatDate(list.assigned_date)}
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="text-gray-300 text-sm mr-2">
                          {list.completed_by} of {classData.student_count} completed
                        </span>
                        <div className="w-24 bg-indigo-950/50 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                            style={{ width: `${(list.completed_by / classData.student_count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {list.due_date && (
                        <div className="text-sm text-gray-300 mb-2">
                          Due {formatDate(list.due_date)}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/content/${list.id}`}
                          className="p-1 text-cyan-400 hover:text-cyan-300 rounded"
                          title="View List"
                        >
                          <Book className="h-5 w-5" />
                        </Link>
                        <button
                          className="p-1 text-cyan-400 hover:text-cyan-300 rounded"
                          title="Edit Assignment"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          className="p-1 text-red-400 hover:text-red-300 rounded"
                          title="Remove Assignment"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Class Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="class_name" className="block text-sm font-medium text-gray-300 mb-1">
                Class Name
              </label>
              <input
                id="class_name"
                type="text"
                defaultValue={classData.name}
                className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="class_description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="class_description"
                rows={3}
                defaultValue={classData.description}
                className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="class_level" className="block text-sm font-medium text-gray-300 mb-1">
                Level
              </label>
              <select
                id="class_level"
                defaultValue={classData.level}
                className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Schedule
              </label>
              <div className="space-y-2">
                {classData.schedule.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <select
                      defaultValue={item.day}
                      className="block px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    
                    <input
                      type="text"
                      defaultValue={item.time}
                      placeholder="Time (e.g. 10:00 - 11:30)"
                      className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    
                    <button
                      className="p-2 text-red-400 hover:text-red-300 rounded"
                      title="Remove Schedule"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                <button
                  className="inline-flex items-center px-3 py-2 bg-indigo-800/40 hover:bg-indigo-700/60 text-white rounded-md text-sm mt-2"
                >
                  + Add Schedule
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="class_code" className="block text-sm font-medium text-gray-300 mb-1">
                Class Code
              </label>
              <div className="flex">
                <input
                  id="class_code"
                  type="text"
                  defaultValue={classData.code}
                  className="block w-full px-3 py-2 border border-indigo-700 rounded-l-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Students can use this code to join your class.
              </p>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-indigo-800">
              <button
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Class
              </button>
              
              <button
                className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 