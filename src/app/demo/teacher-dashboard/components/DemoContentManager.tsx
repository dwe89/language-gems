
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Library, Plus, Search, Filter, MoreVertical, Edit2, Trash2,
    BookOpen, Music, Mic, FileText, Globe, Clock, Star, Download,
    Users, ChevronRight, PlayCircle
} from 'lucide-react';
import { DEMO_CONTENT_SETS, ContentSet } from '../../../../lib/demo/demoFeaturesData';

export function DemoContentManager() {
    const [activeTab, setActiveTab] = useState<'vocabulary' | 'sentences' | 'audio'>('vocabulary');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSet, setSelectedSet] = useState<string | null>(null);

    const renderContentHeader = () => (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Content Library</h2>
                <p className="text-gray-600">Manage your custom vocabulary lists and sentence builders</p>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={() => alert("Import feature disabled in demo")}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center transition-colors"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Import Content
                </button>
                <button
                    onClick={() => alert("Create wizard disabled in demo")}
                    className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 flex items-center shadow-lg shadow-blue-200 transition-all hover:scale-105"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                </button>
            </div>
        </div>
    );

    const renderTabs = () => (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
            {[
                { id: 'vocabulary', label: 'Vocabulary Sets', icon: BookOpen },
                { id: 'sentences', label: 'Sentence Builders', icon: FileText },
                { id: 'audio', label: 'Custom Audio', icon: Mic }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                </button>
            ))}
        </div>
    );

    const renderVocabularyList = () => (
        <div className="grid grid-cols-1 gap-4">
            {DEMO_CONTENT_SETS.map((set, idx) => (
                <motion.div
                    key={set.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => setSelectedSet(set.id)}
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {set.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center">
                                        <Globe className="h-3.5 w-3.5 mr-1" />
                                        {set.language}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{set.wordCount} words</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>Updated {set.lastModified}</span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    {set.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium border border-gray-200">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <div className="flex items-center justify-end text-yellow-500 mb-1">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 font-bold text-gray-700">{set.rating}</span>
                                </div>
                                <p className="text-xs text-gray-500">{set.downloads} downloads</p>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const renderEmptyState = (type: string) => (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                {type === 'sentences' ? <FileText className="h-8 w-8 text-gray-400" /> : <Mic className="h-8 w-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900">No {type} content yet</h3>
            <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                Get started by creating your first {type === 'sentences' ? 'sentence builder' : 'audio recording'} to share with your students.
            </p>
            <button
                onClick={() => alert("Creation disabled in demo")}
                className="mt-6 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
                Create {type === 'sentences' ? 'Sentence Builder' : 'Audio'}
            </button>
        </div>
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {renderContentHeader()}
            {renderTabs()}

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search your content library..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 flex items-center hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'vocabulary' && renderVocabularyList()}
                    {activeTab === 'sentences' && renderEmptyState('sentences')}
                    {activeTab === 'audio' && renderEmptyState('audio resources')}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
