
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Brain, TrendingUp, AlertCircle, CheckCircle,
    Target, Activity, RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react';
import {
    TeacherGrammarAnalytics,
} from '../../../../services/teacherGrammarAnalytics';

interface DemoTeacherGrammarAnalyticsDashboardProps {
    classId?: string;
    demoData: TeacherGrammarAnalytics;
}

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: number;
    subtitle?: string;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    subtitle,
    color = 'blue'
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
            <div className={`p-3 rounded-lg bg-${color}-100`}>
                {icon}
            </div>
        </div>
        {trend !== undefined && (
            <div className="mt-4 flex items-center">
                {trend > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(trend)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
        )}
    </motion.div>
);

export function DemoTeacherGrammarAnalyticsDashboard({
    classId,
    demoData
}: DemoTeacherGrammarAnalyticsDashboardProps) {

    const [analytics, setAnalytics] = useState<TeacherGrammarAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedView, setSelectedView] = useState<'overview' | 'students'>('overview');

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setAnalytics(demoData);
            setLoading(false);
        }, 700);
        return () => clearTimeout(timer);
    }, [demoData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 800);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading grammar analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600">No analytics data available.</p>
            </div>
        );
    }

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={analytics.classStats.totalStudents}
                    icon={<Users className="h-6 w-6 text-blue-600" />}
                    subtitle="Across all classes"
                    color="blue"
                />
                <StatCard
                    title="Total Attempts"
                    value={analytics.classStats.totalAttempts}
                    icon={<Activity className="h-6 w-6 text-green-600" />}
                    subtitle="Grammar practice"
                    color="green"
                />
                <StatCard
                    title="Class Accuracy"
                    value={`${Math.round(analytics.classStats.averageAccuracy)}%`}
                    icon={<Target className="h-6 w-6 text-yellow-600" />}
                    subtitle="Average performance"
                    color="yellow"
                />
                <StatCard
                    title="Active Students"
                    value={analytics.classStats.activeStudentsLast7Days}
                    icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
                    subtitle="Last 7 days"
                    color="purple"
                />
            </div>

            {/* Topic Performance Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    Topic Performance Overview
                </h3>
                <div className="space-y-3">
                    {(analytics.topicPerformance || []).slice(0, 8).map((item: any) => (
                        <div key={item.topicId} className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700 capitalize">{item.topicTitle}</span>
                                    <span className={`text-sm font-semibold ${(item.accuracyPercentage || 0) >= 75 ? 'text-green-600' :
                                        (item.accuracyPercentage || 0) >= 60 ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                        {Math.round(item.accuracyPercentage || 0)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${(item.accuracyPercentage || 0) >= 75 ? 'bg-green-500' :
                                            (item.accuracyPercentage || 0) >= 60 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}
                                        style={{ width: `${item.accuracyPercentage || 0}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {item.totalAttempts} attempts • {item.studentsAttempted} students
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Students Needing Support */}
            {(() => {
                const activeStudentsNeedingSupport = analytics.insights.studentsNeedingAttention
                    .filter(s => s.attemptsCount > 0);
                const inactiveStudents = analytics.studentProgress
                    .filter(s => s.totalAttempts === 0);

                return (
                    <>
                        {activeStudentsNeedingSupport.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                                    Students Needing Support
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">Active students with low accuracy in grammar practice</p>
                                <div className="space-y-3">
                                    {activeStudentsNeedingSupport.slice(0, 5).map((student) => (
                                        <div key={student.studentId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{student.studentName}</p>
                                                <p className="text-sm text-gray-600">
                                                    Weakest: {student.weakestTopic} • {student.attemptsCount} attempts
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-red-600">{Math.round(student.accuracy)}%</p>
                                                <p className="text-xs text-gray-500">Accuracy</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                );
            })()}
        </div>
    );

    const renderStudents = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress</h3>
            <div className="space-y-4">
                {analytics.studentProgress.map((student) => (
                    <div key={student.studentId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="font-semibold text-gray-900">{student.studentName}</p>
                                <p className="text-sm text-gray-600">
                                    {student.totalAttempts} attempts • {student.topicsMastered} / {analytics.classStats.totalTopicsTracked} Topics Known
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{Math.round(student.accuracyPercentage)}%</p>
                                <p className="text-xs text-gray-500">Accuracy</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {(student.topicBreakdown || []).slice(0, 4).map((item: any) => (
                                <div key={item.topicId} className="text-center p-2 bg-gray-50 rounded">
                                    <p className="text-xs font-medium text-gray-700 capitalize">{item.topicTitle}</p>
                                    <p className={`text-sm font-bold ${(item.accuracy || 0) >= 75 ? 'text-green-600' :
                                        (item.accuracy || 0) >= 60 ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                        {Math.round(item.accuracy || 0)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header with View Selector */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setSelectedView('overview')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedView === 'overview'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setSelectedView('students')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedView === 'students'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Students
                    </button>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Content */}
            {selectedView === 'overview' && renderOverview()}
            {selectedView === 'students' && renderStudents()}
        </div>
    );
}
