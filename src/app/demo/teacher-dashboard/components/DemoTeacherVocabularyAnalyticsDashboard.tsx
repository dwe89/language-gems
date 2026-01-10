
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BookOpen, TrendingUp, TrendingDown, AlertCircle, CheckCircle,
    Brain, Target, Clock, Award, BarChart3, PieChart, Activity,
    RefreshCw, Filter, Download, Eye, ChevronRight, ChevronDown,
    Star, Zap, Heart, Gem, Calendar, ArrowUp, ArrowDown, FileText
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import type {
    TeacherVocabularyAnalytics,
} from '../../../../services/teacherVocabularyAnalytics';
import { DEMO_ENHANCED_WORD_DETAILS } from '../../../../lib/demo/demoFeaturesData';

interface DemoTeacherVocabularyAnalyticsDashboardProps {
    classId?: string;
    dateRange?: { from: string; to: string };
    vocabularySource?: 'all' | 'centralized' | 'custom';
    demoData: TeacherVocabularyAnalytics;
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

export function DemoTeacherVocabularyAnalyticsDashboard({
    classId,
    dateRange,
    vocabularySource = 'all',
    demoData
}: DemoTeacherVocabularyAnalyticsDashboardProps) {

    const [analytics, setAnalytics] = useState<TeacherVocabularyAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'topics' | 'trends' | 'words'>('overview');
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
    const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());

    // Word Analysis State
    const [selectedTopic, setSelectedTopic] = useState<string>('all');
    const [wordSortField, setWordSortField] = useState<'word' | 'translation' | 'accuracy' | 'mistakes' | 'struggling'>('struggling');
    const [wordSortOrder, setWordSortOrder] = useState<'asc' | 'desc'>('desc');
    const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

    // Lazy loading state
    const [loadingSection, setLoadingSection] = useState<string | null>(null);

    // Utility function to format category/subcategory names
    const formatTopicName = (name: string | null | undefined): string => {
        if (!name) return '';
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' & ');
    };

    useEffect(() => {
        setLoading(true);
        // Simulate delay
        const timer = setTimeout(() => {
            setAnalytics(demoData);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [demoData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    // Mock fetching sections logic by just setting state (since demoData has everything)
    const fetchSection = async (section: 'topics' | 'trends' | 'words' | 'students') => {
        if (!analytics) return;
        setLoadingSection(section);
        // Simulate delay
        setTimeout(() => {
            setLoadingSection(null);
        }, 600);
    };

    const handleTabChange = (view: typeof selectedView) => {
        setSelectedView(view);
        // Trigger lazy load simulation
        if (view === 'topics') fetchSection('topics');
        if (view === 'trends') fetchSection('trends');
        if (view === 'words') fetchSection('words');
        if (view === 'students') fetchSection('students');
    };

    const toggleStudentExpansion = (studentId: string) => {
        const newExpanded = new Set(expandedStudents);
        if (newExpanded.has(studentId)) {
            newExpanded.delete(studentId);
        } else {
            newExpanded.add(studentId);
        }
        setExpandedStudents(newExpanded);
    };

    const toggleWordExpansion = (wordWord: string) => {
        const newExpanded = new Set(expandedWords);
        if (newExpanded.has(wordWord)) {
            newExpanded.delete(wordWord);
        } else {
            newExpanded.add(wordWord);
        }
        setExpandedWords(newExpanded);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading vocabulary analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-600">No vocabulary data found for your classes.</p>
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
                    title="Total Words Tracked"
                    value={analytics.classStats.totalWords}
                    icon={<BookOpen className="h-6 w-6 text-green-600" />}
                    subtitle="Class-wide vocabulary"
                    color="green"
                />
                <StatCard
                    title="Proficient Words"
                    value={analytics.classStats.proficientWords}
                    icon={<Award className="h-6 w-6 text-yellow-600" />}
                    subtitle="Class total"
                    color="yellow"
                />
                <StatCard
                    title="Class Accuracy"
                    value={`${analytics.classStats.averageAccuracy}%`}
                    icon={<Target className="h-6 w-6 text-purple-600" />}
                    subtitle="Average performance"
                    color="purple"
                />
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Learning Words"
                    value={analytics.classStats.learningWords}
                    icon={<Brain className="h-6 w-6 text-indigo-600" />}
                    subtitle="In progress"
                    color="indigo"
                />
                <StatCard
                    title="Words Due for Review"
                    value={analytics.classStats.totalWordsReadyForReview}
                    icon={<Clock className="h-6 w-6 text-orange-600" />}
                    subtitle="Across all students"
                    color="orange"
                />
                <StatCard
                    title="Students with Overdue"
                    value={analytics.classStats.studentsWithOverdueWords}
                    icon={<AlertCircle className="h-6 w-6 text-red-600" />}
                    subtitle="Need attention"
                    color="red"
                />
            </div>

            {/* Insights Section */}
            {analytics.insights.classRecommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Class Insights & Recommendations
                    </h3>
                    <div className="space-y-2">
                        {analytics.insights.classRecommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-blue-800">{recommendation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Top and Struggling Students */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        Top Performers
                    </h3>
                    <div className="space-y-3">
                        {analytics.classStats.topPerformingStudents.slice(0, 5).map((student, index) => (
                            <div key={student.studentId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold text-green-700">#{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{student.studentName}</p>
                                        <p className="text-sm text-gray-600">{student.className}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-700">{student.averageAccuracy}%</p>
                                    <p className="text-sm text-gray-600">{student.proficientWords} proficient</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Students Needing Support */}
                {(() => {
                    const activeStudentsNeedingSupport = analytics.insights.studentsNeedingAttention
                        .filter(s => s.totalWords > 0);
                    const inactiveStudents = analytics.studentProgress
                        .filter(s => s.totalWords === 0 && !s.lastActivity);

                    return (
                        <>
                            {activeStudentsNeedingSupport.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                                        Students Needing Support
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">Active students with low accuracy or many overdue words</p>
                                    <div className="space-y-3">
                                        {activeStudentsNeedingSupport.slice(0, 5).map((student, index) => (
                                            <div key={student.studentId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{student.studentName}</p>
                                                        <p className="text-sm text-gray-600">{student.className}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-red-700">{student.averageAccuracy}%</p>
                                                    <p className="text-sm text-gray-600">{student.overdueWords} overdue</p>
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
        </div>
    );

    const renderStudentsView = () => {
        if (loadingSection === 'students') {
            return (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-blue-600">Loading student details...</span>
                </div>
            );
        }

        const getStudentWordDetails = (studentId: string) => {
            // In demo mode we might not have details for everyone unless explicitly mocked, but let's try
            return analytics.studentWordDetails?.find(s => s.studentId === studentId);
        };

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">All Students</h3>
                        <p className="text-sm text-gray-600 mt-1">Individual vocabulary progress - click to see strong/weak words</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {analytics.studentProgress.map((student) => {
                            const isExpanded = expandedStudents.has(student.studentId);
                            const wordDetails = getStudentWordDetails(student.studentId);

                            return (
                                <div key={student.studentId} className="bg-white">
                                    <button
                                        onClick={() => toggleStudentExpansion(student.studentId)}
                                        className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <div className="flex-1 grid grid-cols-7 gap-4 items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                                                        <div className="text-xs text-gray-500">{student.className}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm font-medium text-gray-900">{student.totalWords}</div>
                                                        <div className="text-xs text-gray-500">Total</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm font-medium text-green-600">{student.proficientWords}</div>
                                                        <div className="text-xs text-gray-500">Proficient</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm font-medium text-yellow-600">{student.learningWords}</div>
                                                        <div className="text-xs text-gray-500">Learning</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-sm font-medium text-red-600">{student.strugglingWords}</div>
                                                        <div className="text-xs text-gray-500">Struggling</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className={`text-sm font-medium ${student.averageAccuracy >= 80 ? 'text-green-600' :
                                                            student.averageAccuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                            }`}>
                                                            {student.averageAccuracy}%
                                                        </div>
                                                        <div className="text-xs text-gray-500">Accuracy</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-600">
                                                                {student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'Never'}
                                                            </div>
                                                            <div className="text-xs text-gray-500">Last active</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                                            {wordDetails ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                                    {/* Strong Words */}
                                                    <div className="bg-white rounded-lg border border-green-100 p-4 shadow-sm">
                                                        <h4 className="flex items-center text-sm font-semibold text-green-800 mb-3">
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Top Strong Words
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {wordDetails.strongWords.map((word, idx) => (
                                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                                    <span className="font-medium text-gray-700">{word.word}</span>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-gray-500 text-xs italic">({word.translation})</span>
                                                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{word.accuracy}%</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {wordDetails.strongWords.length === 0 && (
                                                                <p className="text-sm text-gray-400 italic">No strong words recorded yet.</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Weak Words */}
                                                    <div className="bg-white rounded-lg border border-red-100 p-4 shadow-sm">
                                                        <h4 className="flex items-center text-sm font-semibold text-red-800 mb-3">
                                                            <AlertCircle className="h-4 w-4 mr-2" />
                                                            Words Needing Focus
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {wordDetails.weakWords.map((word, idx) => (
                                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                                    <span className="font-medium text-gray-700">{word.word}</span>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-gray-500 text-xs italic">({word.translation})</span>
                                                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">{word.accuracy}%</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {wordDetails.weakWords.length === 0 && (
                                                                <p className="text-sm text-gray-400 italic">No weak words recorded yet.</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Recent Progress */}
                                                    <div className="md:col-span-2 bg-white rounded-lg border border-blue-100 p-4 shadow-sm">
                                                        <h4 className="flex items-center text-sm font-semibold text-blue-800 mb-3">
                                                            <TrendingUp className="h-4 w-4 mr-2" />
                                                            Recent Improvements
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            {wordDetails.recentProgress.map((item, idx) => (
                                                                <div key={idx} className="flex items-center justify-between bg-blue-50/50 p-2 rounded">
                                                                    <div className="font-medium text-gray-700 text-sm">{item.word}</div>
                                                                    <div className="text-xs flex items-center text-blue-600 font-bold">
                                                                        +{item.improvement}%
                                                                        <span className="ml-1 text-gray-400 font-normal">({item.beforeAccuracy}% → {item.afterAccuracy}%)</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center">
                                                    <p className="text-gray-500 mb-2">Detailed data not enabled for this student demo.</p>
                                                    <p className="text-xs text-gray-400">Try expanding the first few students.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderTopicsView = () => {
        if (loadingSection === 'topics') {
            return (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-blue-600">Loading topics...</span>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Weak Topics */}
                {analytics.insights.weakestTopics.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                            Topics Needing Attention
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analytics.insights.weakestTopics.map((topic, index) => (
                                <div key={`${topic.category}-${topic.subcategory}-${index}`} className="group relative p-5 bg-white rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-l-xl" />

                                    <div className="pl-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                    {topic.subcategory ? formatTopicName(topic.category) : 'Topic'}
                                                </h4>
                                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                                    {topic.subcategory ? formatTopicName(topic.subcategory) : formatTopicName(topic.category)}
                                                </h3>
                                            </div>
                                            <div className="flex items-center justify-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-red-100">
                                                {topic.averageAccuracy}%
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100 flex items-start">
                                            <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-gray-600 italic leading-relaxed">
                                                {topic.recommendedAction}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Strong Topics */}
                {analytics.insights.strongestTopics.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                            Strong Performance Topics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analytics.insights.strongestTopics.map((topic, index) => (
                                <div key={`${topic.category}-${topic.subcategory}-${index}`} className="group relative p-5 bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 rounded-l-xl" />

                                    <div className="pl-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                    {topic.subcategory ? formatTopicName(topic.category) : 'Topic'}
                                                </h4>
                                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                                    {topic.subcategory ? formatTopicName(topic.subcategory) : formatTopicName(topic.category)}
                                                </h3>
                                            </div>
                                            <div className="flex items-center justify-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-green-100">
                                                {topic.averageAccuracy}%
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100 flex items-start">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-gray-600 italic leading-relaxed">
                                                {topic.recommendedAction}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };


    const renderWordAnalysisView = () => {
        if (loadingSection === 'words') {
            return (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-blue-600">Loading detailed word analysis...</span>
                </div>
            );
        }

        if (!analytics || !analytics.detailedWordAnalytics || analytics.detailedWordAnalytics.length === 0) {
            return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Word Analysis Data</h4>
                        <p className="text-gray-600">Detailed word metrics are not available for this view.</p>
                    </div>
                </div>
            );
        }

        // Extract unique topics for filtering
        const uniqueTopics = Array.from(
            new Set(
                analytics.detailedWordAnalytics.map(w => w.category || 'Uncategorized')
            )
        ).sort();

        // Filter by topic first
        const filteredByTopic = selectedTopic === 'all'
            ? analytics.detailedWordAnalytics
            : analytics.detailedWordAnalytics.filter(w => (w.category || 'Uncategorized') === selectedTopic);

        // Sort words by selected field
        const comparator = (a: any, b: any) => {
            let va: any; let vb: any;

            switch (wordSortField) {
                case 'word':
                    va = (a.word || '').toLowerCase();
                    vb = (b.word || '').toLowerCase();
                    if (va < vb) return -1;
                    if (va > vb) return 1;
                    return 0;
                case 'translation':
                    va = (a.translation || '').toLowerCase();
                    vb = (b.translation || '').toLowerCase();
                    if (va < vb) return -1;
                    if (va > vb) return 1;
                    return 0;
                case 'accuracy':
                    va = a.accuracy ?? 0;
                    vb = b.accuracy ?? 0;
                    return va - vb;
                case 'mistakes':
                    va = a.mistakeCount ?? a.mistake_count ?? 0;
                    vb = b.mistakeCount ?? b.mistake_count ?? 0;
                    return va - vb;
                case 'struggling':
                default:
                    va = a.strugglingCount ?? a.studentsStruggling ?? a.students_struggling ?? 0;
                    vb = b.strugglingCount ?? b.studentsStruggling ?? b.students_struggling ?? 0;
                    return va - vb;
            }
        };

        const sortedWords = [...filteredByTopic].sort((a, b) => {
            const res = comparator(a, b);
            return wordSortOrder === 'asc' ? res : -res;
        });

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Most Challenging Words</h3>
                        <p className="text-sm text-gray-600">Words that the highest number of students are struggling with</p>
                    </div>
                    {/* Sort and Filter controls */}
                    <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        {/* Topic Filter */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600">Filter by topic:</label>
                            <select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="all">All Topics ({analytics.detailedWordAnalytics.length} words)</option>
                                {uniqueTopics.map(topic => {
                                    const count = (analytics.detailedWordAnalytics || []).filter(
                                        w => (w.category || 'Uncategorized') === topic
                                    ).length;
                                    return (
                                        <option key={topic} value={topic}>
                                            {formatTopicName(topic)} ({count} words)
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Sort Controls */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600">Sort by:</label>
                            <select
                                value={wordSortField}
                                onChange={(e) => setWordSortField(e.target.value as any)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="struggling">Struggling Students</option>
                                <option value="accuracy">Accuracy</option>
                                <option value="word">Word</option>
                                <option value="translation">Translation</option>
                                <option value="mistakes">Mistakes</option>
                            </select>

                            <button
                                onClick={() => setWordSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                                title="Toggle sort order"
                            >
                                {wordSortOrder === 'asc' ? '▲' : '▼'}
                            </button>

                            <button
                                onClick={() => alert("Excel download is not available in demo mode.")}
                                className="ml-2 flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium border border-transparent rounded-lg transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                title="Download filtered data as Excel"
                            >
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Download Report</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="w-8 px-6 py-3"></th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Word</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Translation</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Accuracy</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Struggling</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Common Mistake</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedWords.slice(0, 50).map((word, idx) => {
                                    const isExpanded = expandedWords.has(word.word);
                                    const enhancedDetail = DEMO_ENHANCED_WORD_DETAILS.find(w => w.word === word.word);

                                    return (
                                        <React.Fragment key={idx}>
                                            <tr
                                                className={`hover:bg-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/30' : ''}`}
                                                onClick={() => toggleWordExpansion(word.word)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90 text-blue-600' : 'text-gray-400'}`}>
                                                        <ChevronRight className="h-5 w-5" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{word.word}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{word.translation}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex-1 h-2 bg-gray-100 rounded-full mr-3 max-w-[60px]">
                                                            <div
                                                                className={`h-2 rounded-full ${word.accuracy < 60 ? 'bg-red-500' : word.accuracy < 85 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                                style={{ width: `${word.accuracy}%` }}
                                                            />
                                                        </div>
                                                        <span className={`font-semibold ${word.accuracy < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                                                            {word.accuracy.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-red-600 font-medium">
                                                    {word.strugglingCount} students
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 italic">
                                                    {enhancedDetail?.commonMistakes[0]?.mistake || '-'}
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-gray-50/50">
                                                    <td colSpan={6} className="px-6 py-4">
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            {enhancedDetail ? (
                                                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                                                        {/* Column 1: Core Stats & Skills */}
                                                                        <div className="space-y-6">
                                                                            <div>
                                                                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                                                                                    <Activity className="h-4 w-4 mr-2 text-blue-500" />
                                                                                    Performance by Skill
                                                                                </h4>
                                                                                <div className="h-48">
                                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                                        <BarChart layout="vertical" data={[
                                                                                            { name: 'Reading', value: enhancedDetail.skills.reading, fill: '#3B82F6' },
                                                                                            { name: 'Writing', value: enhancedDetail.skills.writing, fill: '#8B5CF6' },
                                                                                            { name: 'Listening', value: enhancedDetail.skills.listening, fill: '#10B981' },
                                                                                            { name: 'Speaking', value: enhancedDetail.skills.speaking, fill: '#F59E0B' },
                                                                                        ]}>
                                                                                            <XAxis type="number" domain={[0, 100]} hide />
                                                                                            <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                                                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                                                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                                                                                {/* Optional: label list */}
                                                                                            </Bar>
                                                                                        </BarChart>
                                                                                    </ResponsiveContainer>
                                                                                </div>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                                                                    <p className="text-xs text-gray-500 uppercase">Avg Response</p>
                                                                                    <p className="text-lg font-bold text-gray-800">{(enhancedDetail.avgResponseTime / 1000).toFixed(1)}s</p>
                                                                                </div>
                                                                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                                                                    <p className="text-xs text-gray-500 uppercase">Total Attempts</p>
                                                                                    <p className="text-lg font-bold text-gray-800">{enhancedDetail.totalAttempts}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Column 2: Error Analysis */}
                                                                        <div className="md:col-span-2">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                                                                <div>
                                                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                                                                                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                                                                                        Common Mistakes
                                                                                    </h4>
                                                                                    <ul className="space-y-3">
                                                                                        {enhancedDetail.commonMistakes.map((m, i) => (
                                                                                            <li key={i} className="flex items-center justify-between bg-red-50/50 p-3 rounded-lg border border-red-100">
                                                                                                <div className="flex items-center">
                                                                                                    <span className="font-mono text-red-700 font-medium">{m.mistake}</span>
                                                                                                    <span className="ml-2 px-2 py-0.5 bg-white rounded text-[10px] uppercase font-bold text-gray-400 border border-gray-100">{m.type}</span>
                                                                                                </div>
                                                                                                <span className="text-sm font-bold text-red-400">{m.count}x</span>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>

                                                                                <div>
                                                                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                                                                                        <Brain className="h-4 w-4 mr-2 text-purple-500" />
                                                                                        Confused With
                                                                                    </h4>
                                                                                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                                                                        {enhancedDetail.confusedWith.map((c, i) => (
                                                                                            <div key={i} className="mb-3 last:mb-0">
                                                                                                <div className="flex justify-between text-sm mb-1">
                                                                                                    <span className="font-semibold text-purple-900">{c.word}</span>
                                                                                                    <span className="text-purple-600">{c.count} students</span>
                                                                                                </div>
                                                                                                <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                                                                                                    <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: `${(c.count / 20) * 100}%` }}></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                        {enhancedDetail.confusedWith.length === 0 && <p className="text-sm text-gray-500 italic">No significant confusion patterns detected.</p>}
                                                                                    </div>

                                                                                    <div className="mt-6">
                                                                                        <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium text-sm flex items-center justify-center">
                                                                                            <Zap className="h-4 w-4 mr-2" />
                                                                                            Generate Practice Session
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="p-8 text-center text-gray-400 italic">
                                                                    Additional deep-dive data not available for this word in demo.
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div >
            </div >
        );
    };

    const renderTrendsView = () => {
        if (loadingSection === 'trends') {
            return (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-blue-600">Loading trends...</span>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Vocabulary Acquisition Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.trends}>
                                <defs>
                                    <linearGradient id="colorLearned" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return `${date.getMonth() + 1}/${date.getDate()}`;
                                    }}
                                />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" unit="%" />
                                <Tooltip
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="totalWords"
                                    name="Words Learned"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorLearned)"
                                    yAxisId="left"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="averageAccuracy"
                                    name="Avg Accuracy"
                                    stroke="#10B981"
                                    fillOpacity={1}
                                    fill="url(#colorAccuracy)"
                                    yAxisId="right"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Proficiency Distribution</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.trends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            return `${date.getMonth() + 1}/${date.getDate()}`;
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="proficientWords" name="Proficient" stackId="1" stroke="#10B981" fill="#10B981" />
                                    <Area type="monotone" dataKey="learningWords" name="Learning" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                                    <Area type="monotone" dataKey="strugglingWords" name="Struggling" stackId="1" stroke="#EF4444" fill="#EF4444" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Engagement</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.trends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            return `${date.getMonth() + 1}/${date.getDate()}`;
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="activeStudents" name="Active Students" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header with View Selector */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'students', label: 'Students', icon: Users },
                        { id: 'topics', label: 'Topics', icon: Brain },
                        { id: 'words', label: 'Word Analysis', icon: FileText },
                        { id: 'trends', label: 'Trends', icon: Activity },
                    ].map((view) => (
                        <button
                            key={view.id}
                            onClick={() => handleTabChange(view.id as any)}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${selectedView === view.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <view.icon className="h-4 w-4 mr-2" />
                            {view.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ml-2"
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {selectedView === 'overview' && renderOverview()}
                    {selectedView === 'students' && renderStudentsView()}
                    {selectedView === 'topics' && renderTopicsView()}
                    {selectedView === 'words' && renderWordAnalysisView()}
                    {selectedView === 'trends' && renderTrendsView()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
