
import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, RefreshCw, Filter, AlertTriangle, UserX, Users } from 'lucide-react';
import { MetricCard } from '../../../../components/dashboard/shared/MetricCard';
import { RiskCard } from '../../../../components/dashboard/shared/RiskCard';
import { WeaknessBanner } from '../../../../components/dashboard/shared/WeaknessBanner';
import type { ClassSummaryData, TimeRange } from '../../../../types/teacherAnalytics';

interface DemoClassSummaryDashboardProps {
    classId?: string;
    viewScope?: 'my' | 'school';
    onStudentClick?: (studentId: string) => void;
    demoData: ClassSummaryData;
}

export function DemoClassSummaryDashboard({
    classId,
    viewScope = 'my',
    onStudentClick,
    demoData,
}: DemoClassSummaryDashboardProps) {
    const [data, setData] = useState<ClassSummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>('last_30_days');

    useEffect(() => {
        // Simulate loading delay for realism
        setLoading(true);
        const timer = setTimeout(() => {
            setData(demoData);
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [classId, timeRange, viewScope, demoData]);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 800);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-lg text-gray-600">Loading analytics...</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center text-gray-600 py-12">
                No data available
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Time Range Filter */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Class Performance Overview
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Quick health check for your students (Demo View)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500"
                    >
                        <option value="last_7_days">Last 7 Days</option>
                        <option value="last_30_days">Last 30 Days</option>
                        <option value="current_term">Current Term</option>
                        <option value="all_time">All Time</option>
                    </select>
                    <button
                        onClick={handleRefresh}
                        className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                        title="Refresh data"
                    >
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Class Average"
                    value={data.topMetrics.averageScore}
                    unit="%"
                    trend={{
                        direction: data.topMetrics.trendDirection,
                        percentage: data.topMetrics.trendPercentage,
                    }}
                    icon={<Target className="w-6 h-6" />}
                    color="blue"
                />
                <MetricCard
                    title="Assignments Overdue"
                    value={data.topMetrics.assignmentsOverdue}
                    icon={<Calendar className="w-6 h-6" />}
                    color={data.topMetrics.assignmentsOverdue > 0 ? 'red' : 'green'}
                />
                <MetricCard
                    title="Current Streak"
                    value={data.topMetrics.currentStreak}
                    unit="days"
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="green"
                />
                <MetricCard
                    title="Active Students"
                    value={data.topMetrics.activeStudents || 0}
                    unit={`/${data.topMetrics.totalStudents || 0}`}
                    icon={<Users className="w-6 h-6" />}
                    color="purple"
                />
            </div>

            {/* Critical Alert: Students Never Logged In */}
            {data.studentsNeverLoggedIn && data.studentsNeverLoggedIn.length > 0 && (
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                                <UserX className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                CRITICAL: {data.studentsNeverLoggedIn.length} Student{data.studentsNeverLoggedIn.length !== 1 ? 's' : ''} Never Logged In
                            </h2>
                            <p className="text-red-800 mb-4">
                                These students have not completed any learning activities {timeRange === 'all_time' ? 'yet' : timeRange === 'last_7_days' ? 'in the last 7 days' : timeRange === 'last_30_days' ? 'in the last 30 days' : 'this term'}.
                                They may need login credentials or technical support.
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        alert(`Students who never logged in:\n\n${data.studentsNeverLoggedIn.map(s => s.studentName).join('\n')}`);
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                                >
                                    View All {data.studentsNeverLoggedIn.length} Students
                                </button>
                                <span className="text-sm text-red-700">
                                    First 5: {data.studentsNeverLoggedIn.slice(0, 5).map(s => s.studentName).join(', ')}
                                    {data.studentsNeverLoggedIn.length > 5 && ` +${data.studentsNeverLoggedIn.length - 5} more`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Urgent Interventions - Active Students At Risk */}
            {data.urgentInterventions.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        🚨 Urgent Interventions (Top 5 At-Risk Students)
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Students who ARE engaging but struggling with low accuracy or declining performance
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.urgentInterventions.map((student) => (
                            <RiskCard
                                key={student.studentId}
                                student={student}
                                onClick={() => onStudentClick?.(student.studentId)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Top Class Weakness */}
            {data.topClassWeakness && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        🎯 Top Class Weakness
                    </h2>
                    <WeaknessBanner
                        weakness={data.topClassWeakness}
                        onAssignPractice={() => {
                            console.log('Assign practice for:', data.topClassWeakness?.skillName);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
