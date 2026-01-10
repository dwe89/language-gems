'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DEMO_TEACHER,
  DEMO_CLASSES,
  DEMO_STUDENTS,
  ALL_DEMO_STUDENTS,
  ALL_DEMO_ASSIGNMENTS,
  DEMO_CLASS_OVERVIEWS,
  DEMO_TEACHER_STATS,
  DEMO_TEACHER_NOTIFICATIONS,
  DEMO_STUDENT_NOTIFICATIONS,
  DEMO_RECENT_ACTIVITY,
  getDemoStudentData,
  getDemoTeacherDashboardData,
} from './demoData';

// =====================================================
// TYPES
// =====================================================

interface DemoStudent {
  id: string;
  name: string;
  email: string;
  class_id: string;
  language: string;
  level: number;
  xp: number;
  streak: number;
  accuracy: number;
  totalGems: number;
  wordsLearned: number;
  sessionsCompleted: number;
  assignmentsCompleted: number;
  lastActive: string;
  trend: 'improving' | 'stable' | 'declining';
}

interface DemoContextType {
  isDemo: boolean;
  demoMode: 'teacher' | 'student' | null;
  
  // Teacher data
  teacher: typeof DEMO_TEACHER | null;
  classes: typeof DEMO_CLASSES;
  classOverviews: typeof DEMO_CLASS_OVERVIEWS;
  teacherStats: typeof DEMO_TEACHER_STATS;
  teacherNotifications: typeof DEMO_TEACHER_NOTIFICATIONS;
  recentActivity: ReturnType<typeof getDemoTeacherDashboardData>['recentActivity'];
  allStudents: typeof ALL_DEMO_STUDENTS;
  allAssignments: typeof ALL_DEMO_ASSIGNMENTS;
  
  // Student data
  selectedStudent: DemoStudent | null;
  studentData: ReturnType<typeof getDemoStudentData> | null;
  studentNotifications: typeof DEMO_STUDENT_NOTIFICATIONS;
  
  // Actions
  setDemoMode: (mode: 'teacher' | 'student' | null) => void;
  selectStudent: (studentId: string) => void;
  selectClass: (classId: string) => void;
  selectedClassId: string | null;
  
  // Helpers
  getStudentsByClass: (classId: string) => typeof ALL_DEMO_STUDENTS;
  getAssignmentsByClass: (classId: string) => typeof ALL_DEMO_ASSIGNMENTS;
  getClassById: (classId: string) => typeof DEMO_CLASSES[0] | undefined;
}

// =====================================================
// CONTEXT
// =====================================================

const DemoContext = createContext<DemoContextType | null>(null);

export function useDemoContext() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
}

// Safe hook that returns null if not in demo context
export function useDemoContextSafe() {
  return useContext(DemoContext);
}

// =====================================================
// PROVIDER
// =====================================================

interface DemoProviderProps {
  children: ReactNode;
  initialMode?: 'teacher' | 'student';
  initialStudentId?: string;
}

export function DemoProvider({ 
  children, 
  initialMode = 'teacher',
  initialStudentId 
}: DemoProviderProps) {
  const [demoMode, setDemoMode] = useState<'teacher' | 'student' | null>(initialMode);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || ALL_DEMO_STUDENTS[0].id
  );
  const [selectedClassId, setSelectedClassId] = useState<string | null>(DEMO_CLASSES[0].id);
  
  // Get teacher dashboard data
  const teacherData = getDemoTeacherDashboardData();
  
  // Get student data based on selected student
  const studentData = getDemoStudentData(selectedStudentId);
  const selectedStudent = ALL_DEMO_STUDENTS.find(s => s.id === selectedStudentId) || null;
  
  // Helper functions
  const getStudentsByClass = (classId: string) => {
    return DEMO_STUDENTS[classId] || [];
  };
  
  const getAssignmentsByClass = (classId: string) => {
    const classAssignments = ALL_DEMO_ASSIGNMENTS.filter(a => a.class_id === classId);
    return classAssignments;
  };
  
  const getClassById = (classId: string) => {
    return DEMO_CLASSES.find(c => c.id === classId);
  };
  
  const selectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setDemoMode('student');
  };
  
  const selectClass = (classId: string) => {
    setSelectedClassId(classId);
  };
  
  const value: DemoContextType = {
    isDemo: true,
    demoMode,
    
    // Teacher data
    teacher: DEMO_TEACHER,
    classes: DEMO_CLASSES,
    classOverviews: DEMO_CLASS_OVERVIEWS,
    teacherStats: DEMO_TEACHER_STATS,
    teacherNotifications: DEMO_TEACHER_NOTIFICATIONS,
    recentActivity: teacherData.recentActivity,
    allStudents: ALL_DEMO_STUDENTS,
    allAssignments: ALL_DEMO_ASSIGNMENTS,
    
    // Student data
    selectedStudent: selectedStudent as DemoStudent | null,
    studentData,
    studentNotifications: DEMO_STUDENT_NOTIFICATIONS,
    
    // Actions
    setDemoMode,
    selectStudent,
    selectClass,
    selectedClassId,
    
    // Helpers
    getStudentsByClass,
    getAssignmentsByClass,
    getClassById,
  };
  
  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

export default DemoProvider;
