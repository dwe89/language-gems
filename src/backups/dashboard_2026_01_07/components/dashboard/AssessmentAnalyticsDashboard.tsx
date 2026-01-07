'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, Users, TrendingUp, Clock, Target, Award,
    Eye, CheckCircle, XCircle, AlertTriangle, Download
} from 'lucide-react';
import { AssessmentResultsDetailView } from './AssessmentResultsDetailView';
import { StudentProgress, AssignmentOverviewMetrics } from '@/services/teacherAssignmentAnalytics';

interface AssessmentAnalyticsDashboardProps {
    assignmentId: string;
    onBack: () => void;
}

export function AssessmentAnalyticsDashboard({ assignmentId, onBack }: AssessmentAnalyticsDashboardProps) {
    const [overview, setOverview] = useState<AssignmentOverviewMetrics | null>(null);
    const [studentRoster, setStudentRoster] = useState<StudentProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'students'>('overview');
    const [sortBy, setSortBy] = useState<'name' | 'score' | 'time'>('score');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewingStudentDetails, setViewingStudentDetails] = useState<{ studentId: string; studentName: string } | null>(null);
    const [assignmentTitle, setAssignmentTitle] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, [assignmentId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/dashboard/assignment-analytics/${assignmentId}`, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch analytics');
            }

            const data = await response.json();

            // Fetch assignment title
            const assignmentResponse = await fetch(`/api/assignments/${assignmentId}`);
            if (assignmentResponse.ok) {
                const assignmentData = await assignmentResponse.json();
                setAssignmentTitle(assignmentData.title || assignmentData.name || 'Assessment');
            }

            setOverview(data.overview);
            setStudentRoster(data.students || []);
        } catch (error) {
            console.error('Error fetching assessment analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortedStudents = [...studentRoster].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
            case 'name':
                comparison = a.studentName.localeCompare(b.studentName);
                break;
            case 'score':
                comparison = a.successScore - b.successScore;
                break;
            case 'time':
                comparison = a.timeSpentMinutes - b.timeSpentMinutes;
                break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    // If viewing detailed results for a specific student, show that view
    if (viewingStudentDetails) {
        return (
            <AssessmentResultsDetailView
                assignmentId={assignmentId}
                studentId={viewingStudentDetails.studentId}
                studentName={viewingStudentDetails.studentName}
                onBack={() => {
                    setViewingStudentDetails(null);
                    fetchData(); // Refresh data when returning
                }}
                viewMode="teacher"
            />
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button onClick={onBack} variant="outline" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Assessments
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900">{assignmentTitle}</h1>
                        <p className="text-slate-600 mt-1">Assessment Analytics</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Students
                    </Button>
                </div>

                {/* Overview Cards */}
                {overview && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-2 border-green-200 bg-green-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Completion Rate</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2">{overview.completionRate}%</p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {overview.completedStudents} of {overview.totalStudents} students
                                        </p>
                                    </div>
                                    <CheckCircle className="h-12 w-12 text-green-600 opacity-80" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-200 bg-blue-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Engagement Rate</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2">
                                            {Math.round(((overview.completedStudents + overview.inProgressStudents) / overview.totalStudents) * 100) || 0}%
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {overview.inProgressStudents} students active
                                        </p>
                                    </div>
                                    <Users className="h-12 w-12 text-blue-600 opacity-80" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-purple-200 bg-purple-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Success Score</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2">{overview.classSuccessScore}%</p>
                                        <p className="text-sm text-slate-500 mt-1">Class-wide accuracy</p>
                                    </div>
                                    <Award className="h-12 w-12 text-purple-600 opacity-80" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-red-200 bg-red-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Need Intervention</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-2">{overview.studentsNeedingHelp}</p>
                                        <p className="text-sm text-slate-500 mt-1">Students struggling</p>
                                    </div>
                                    <AlertTriangle className="h-12 w-12 text-red-600 opacity-80" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'overview'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <TrendingUp className="h-4 w-4 inline mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'students'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <Users className="h-4 w-4 inline mr-2" />
                        Student Performance ({studentRoster.length} students)
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && overview && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Progress Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                                    <div className="text-center">
                                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                                        <p className="text-4xl font-bold text-green-900">{overview.completedStudents}</p>
                                        <p className="text-sm text-slate-600 mt-1">Completed</p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                                    <div className="text-center">
                                        <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                                        <p className="text-4xl font-bold text-yellow-900">{overview.inProgressStudents}</p>
                                        <p className="text-sm text-slate-600 mt-1">In Progress</p>
                                    </div>
                                </div>

                                <div className="bg-slate-100 rounded-xl p-6 border-2 border-slate-200">
                                    <div className="text-center">
                                        <Target className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                        <p className="text-4xl font-bold text-slate-900">{overview.notStartedStudents}</p>
                                        <p className="text-sm text-slate-600 mt-1">Not Started</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'students' && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Student Roster</CardTitle>
                                <div className="flex gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    >
                                        <option value="score">Sort by Score</option>
                                        <option value="name">Sort by Name</option>
                                        <option value="time">Sort by Time</option>
                                    </select>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    >
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b-2 border-slate-200">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-slate-700">Student</th>
                                            <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                                            <th className="text-left p-4 font-semibold text-slate-700">Score</th>
                                            <th className="text-left p-4 font-semibold text-slate-700">Questions</th>
                                            <th className="text-left p-4 font-semibold text-slate-700">Time Spent</th>
                                            <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedStudents.map((student) => (
                                            <tr key={student.studentId} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-900">{student.studentName}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${student.status === 'completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : student.status === 'in_progress'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {student.status === 'completed' ? 'COMPLETED' :
                                                            student.status === 'in_progress' ? 'IN PROGRESS' : 'NOT STARTED'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-lg font-bold ${student.successScore >= 75 ? 'text-green-600' :
                                                        student.successScore >= 50 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                        }`}>
                                                        {student.successScore}%
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-slate-700">-</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-slate-700">
                                                        {student.timeSpentMinutes}m
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {student.status === 'completed' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setViewingStudentDetails({
                                                                studentId: student.studentId,
                                                                studentName: student.studentName
                                                            })}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View Details
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
