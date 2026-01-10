
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardCheck, Plus, Search, Filter, Calendar, Users,
    BarChart2, Clock, CheckCircle, AlertCircle, MoreHorizontal,
    FileText, Mic, PenTool, Layout, GraduationCap, ArrowRight
} from 'lucide-react';
import { DEMO_ASSESSMENTS, Assessment } from '../../../../lib/demo/demoFeaturesData';

export function DemoAssessments() {
    const [activeTab, setActiveTab] = useState<'active' | 'drafts' | 'past'>('active');

    const getStatusColor = (status: Assessment['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'grading': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeIcon = (type: Assessment['type']) => {
        switch (type) {
            case 'speaking': return <Mic className="h-5 w-5" />;
            case 'listening': return <Layout className="h-5 w-5" />; // Proxy icon
            case 'quiz': return <ClipboardCheck className="h-5 w-5" />;
            default: return <FileText className="h-5 w-5" />;
        }
    };

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Assessments & Grading</h2>
                <p className="text-gray-600">Create quizzes, exams, and track student progress</p>
            </div>
            <button
                onClick={() => alert("Assessment wizard disabled in demo")}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 flex items-center shadow-lg shadow-blue-200 transition-all hover:scale-105"
            >
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
            </button>
        </div>
    );

    const renderQuickStats = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                    <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-500">Active Exams</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                    <PenTool className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-sm text-gray-500">To Grade</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                    <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                    <p className="text-sm text-gray-500">Avg Pass Rate</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Clock className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-sm text-gray-500">Upcoming</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {renderHeader()}
            {renderQuickStats()}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex space-x-4">
                        {['active', 'drafts', 'past'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'active' ? DEMO_ASSESSMENTS.filter(a => a.status !== 'completed').length : 0})
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search assessments..."
                                className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300">
                            <Filter className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {DEMO_ASSESSMENTS.map((assessment) => (
                        <div key={assessment.id} className="p-6 hover:bg-gray-50 transition-colors group">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        {getTypeIcon(assessment.type)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assessment.status)} capitalize`}>
                                                {assessment.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center">
                                                <Users className="h-3.5 w-3.5 mr-1" />
                                                {assessment.className}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                                Due: {assessment.dueDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">
                                            {assessment.submittedCount} / {assessment.totalStudents}
                                        </div>
                                        <div className="text-xs text-gray-500">Submitted</div>
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(assessment.submittedCount / assessment.totalStudents) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {assessment.status === 'grading' ? (
                                        <button
                                            onClick={() => alert("Grading interface disabled in demo")}
                                            className="px-4 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-lg hover:bg-yellow-200 transition-colors flex items-center"
                                        >
                                            Grade Now
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </button>
                                    ) : (
                                        <button className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {DEMO_ASSESSMENTS.length === 0 && (
                        <div className="p-12 text-center text-gray-500">No assessments found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
