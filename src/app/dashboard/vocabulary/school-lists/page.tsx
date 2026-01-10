'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import {
    Search, BookOpen, Users, Copy, ChevronRight,
    Filter, Star, Globe, Lock, Sparkles, ArrowLeft,
    CheckCircle, User, School
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface VocabularyList {
    id: string;
    name: string;
    description: string | null;
    language: string;
    theme: string | null;
    topic: string | null;
    item_count: number;
    teacher_id: string;
    teacher_name: string;
    created_at: string;
    is_public: boolean;
    usage_count: number; // Number of teachers who have duplicated this list
}

interface SchoolTeacher {
    id: string;
    display_name: string;
    email: string;
}

export default function SchoolVocabularyDiscoveryPage() {
    const { user } = useAuth();
    const { supabase } = useSupabase();

    const [loading, setLoading] = useState(true);
    const [schoolLists, setSchoolLists] = useState<VocabularyList[]>([]);
    const [publicLists, setPublicLists] = useState<VocabularyList[]>([]);
    const [schoolTeachers, setSchoolTeachers] = useState<SchoolTeacher[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'school' | 'public'>('school');
    const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
    const [duplicateSuccess, setDuplicateSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadSchoolVocabulary();
        }
    }, [user]);

    const loadSchoolVocabulary = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // Get user's school code
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('school_code')
                .eq('user_id', user.id)
                .single();

            if (profileError || !profile?.school_code) {
                console.log('No school found for user');
                setLoading(false);
                return;
            }

            // Get all teachers in the same school
            const { data: teachers, error: teachersError } = await supabase
                .from('user_profiles')
                .select('user_id, display_name, email')
                .eq('school_code', profile.school_code)
                .eq('role', 'teacher')
                .neq('user_id', user.id); // Exclude current user

            if (!teachersError && teachers) {
                setSchoolTeachers(teachers.map(t => ({
                    id: t.user_id,
                    display_name: t.display_name || t.email?.split('@')[0] || 'Unknown Teacher',
                    email: t.email || ''
                })));
            }

            // Get vocabulary lists from school colleagues
            const teacherIds = teachers?.map(t => t.user_id) || [];

            if (teacherIds.length > 0) {
                const { data: lists, error: listsError } = await supabase
                    .from('enhanced_vocabulary_lists')
                    .select(`
            id,
            name,
            description,
            language,
            theme,
            topic,
            item_count,
            teacher_id,
            created_at,
            is_public
          `)
                    .in('teacher_id', teacherIds)
                    .order('created_at', { ascending: false });

                if (!listsError && lists) {
                    // Get usage counts
                    const listIds = lists.map(l => l.id);
                    const { data: usageData } = await supabase
                        .from('enhanced_vocabulary_lists')
                        .select('duplicated_from')
                        .in('duplicated_from', listIds);

                    const usageMap = new Map<string, number>();
                    usageData?.forEach((item: any) => {
                        if (item.duplicated_from) {
                            usageMap.set(item.duplicated_from, (usageMap.get(item.duplicated_from) || 0) + 1);
                        }
                    });

                    // Attach teacher names and usage counts
                    const listsWithTeachers = lists.map(list => {
                        const teacher = teachers?.find(t => t.user_id === list.teacher_id);
                        return {
                            ...list,
                            teacher_name: teacher?.display_name || teacher?.email?.split('@')[0] || 'Unknown Teacher',
                            usage_count: usageMap.get(list.id) || 0
                        };
                    });
                    setSchoolLists(listsWithTeachers);
                }
            }

            // Also load public lists (from all teachers on the platform)
            const { data: pubLists, error: pubListsError } = await supabase
                .from('enhanced_vocabulary_lists')
                .select(`
          id,
          name,
          description,
          language,
          theme,
          topic,
          item_count,
          teacher_id,
          created_at,
          is_public
        `)
                .eq('is_public', true)
                .neq('teacher_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (!pubListsError && pubLists) {
                // Get teacher names for public lists
                const pubTeacherIds = [...new Set(pubLists.map(l => l.teacher_id))];
                const { data: pubTeachers } = await supabase
                    .from('user_profiles')
                    .select('user_id, display_name, email')
                    .in('user_id', pubTeacherIds);

                // Get usage counts for public lists
                const pubListIds = pubLists.map(l => l.id);
                const { data: pubUsageData } = await supabase
                    .from('enhanced_vocabulary_lists')
                    .select('duplicated_from')
                    .in('duplicated_from', pubListIds);

                const pubUsageMap = new Map<string, number>();
                pubUsageData?.forEach((item: any) => {
                    if (item.duplicated_from) {
                        pubUsageMap.set(item.duplicated_from, (pubUsageMap.get(item.duplicated_from) || 0) + 1);
                    }
                });

                const pubListsWithTeachers = pubLists.map(list => {
                    const teacher = pubTeachers?.find(t => t.user_id === list.teacher_id);
                    return {
                        ...list,
                        teacher_name: teacher?.display_name || teacher?.email?.split('@')[0] || 'Teacher',
                        usage_count: pubUsageMap.get(list.id) || 0
                    };
                });
                setPublicLists(pubListsWithTeachers);
            }

        } catch (error) {
            console.error('Error loading school vocabulary:', error);
        } finally {
            setLoading(false);
        }
    };

    const duplicateList = async (listId: string) => {
        if (!user) return;
        setDuplicatingId(listId);

        try {
            // Get the original list
            const { data: originalList, error: listError } = await supabase
                .from('enhanced_vocabulary_lists')
                .select('*')
                .eq('id', listId)
                .single();

            if (listError || !originalList) {
                throw new Error('Failed to fetch original list');
            }

            // Get the items
            const { data: items, error: itemsError } = await supabase
                .from('enhanced_vocabulary_items')
                .select('*')
                .eq('list_id', listId);

            if (itemsError) {
                throw new Error('Failed to fetch list items');
            }

            // Create new list for current user
            const { data: newList, error: createError } = await supabase
                .from('enhanced_vocabulary_lists')
                .insert({
                    teacher_id: user.id,
                    name: `${originalList.name} (Copy)`,
                    description: originalList.description,
                    language: originalList.language,
                    theme: originalList.theme,
                    topic: originalList.topic,
                    item_count: originalList.item_count,
                    is_public: false, // Private by default
                    duplicated_from: listId // Track the source
                })
                .select('id')
                .single();

            if (createError || !newList) {
                throw new Error('Failed to create duplicate list');
            }

            // Copy items to new list
            if (items && items.length > 0) {
                const newItems = items.map(item => ({
                    list_id: newList.id,
                    term: item.term,
                    translation: item.translation,
                    part_of_speech: item.part_of_speech,
                    context_sentence: item.context_sentence,
                    context_translation: item.context_translation,
                    audio_url: item.audio_url,
                    image_url: item.image_url,
                    difficulty_level: item.difficulty_level,
                    notes: item.notes
                }));

                await supabase
                    .from('enhanced_vocabulary_items')
                    .insert(newItems);
            }

            setDuplicateSuccess(listId);
            setTimeout(() => setDuplicateSuccess(null), 3000);

        } catch (error) {
            console.error('Error duplicating list:', error);
            alert('Failed to duplicate list. Please try again.');
        } finally {
            setDuplicatingId(null);
        }
    };

    // Filter lists based on search and filters
    const displayedLists = useMemo(() => {
        const lists = activeTab === 'school' ? schoolLists : publicLists;

        return lists.filter(list => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = list.name.toLowerCase().includes(query);
                const matchesDesc = list.description?.toLowerCase().includes(query);
                const matchesTeacher = list.teacher_name.toLowerCase().includes(query);
                const matchesTheme = list.theme?.toLowerCase().includes(query);
                if (!matchesName && !matchesDesc && !matchesTeacher && !matchesTheme) {
                    return false;
                }
            }

            // Language filter
            if (selectedLanguage !== 'all' && list.language !== selectedLanguage) {
                return false;
            }

            // Teacher filter (only for school tab)
            if (activeTab === 'school' && selectedTeacher !== 'all' && list.teacher_id !== selectedTeacher) {
                return false;
            }

            return true;
        });
    }, [activeTab, schoolLists, publicLists, searchQuery, selectedLanguage, selectedTeacher]);

    // Get unique languages from lists
    const languages = useMemo(() => {
        const lists = activeTab === 'school' ? schoolLists : publicLists;
        const langs = [...new Set(lists.map(l => l.language))];
        return langs.sort();
    }, [activeTab, schoolLists, publicLists]);

    const formatLanguage = (lang: string) => {
        const map: Record<string, string> = {
            'es': '🇪🇸 Spanish',
            'fr': '🇫🇷 French',
            'de': '🇩🇪 German',
            'it': '🇮🇹 Italian',
            'pt': '🇵🇹 Portuguese',
            'en': '🇬🇧 English'
        };
        return map[lang] || lang.toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading school vocabulary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/vocabulary"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to My Vocabulary
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Discover Vocabulary Lists
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Browse and duplicate vocabulary lists from colleagues at your school or from the wider community
                    </p>
                </div>

                {/* Tab Selector */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setActiveTab('school')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === 'school'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        <School className="h-5 w-5" />
                        My School ({schoolLists.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('public')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === 'public'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        <Globe className="h-5 w-5" />
                        Public Lists ({publicLists.length})
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search vocabulary lists..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>

                        {/* Language Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
                            >
                                <option value="all">All Languages</option>
                                {languages.map(lang => (
                                    <option key={lang} value={lang}>{formatLanguage(lang)}</option>
                                ))}
                            </select>
                        </div>

                        {/* Teacher Filter (School tab only) */}
                        {activeTab === 'school' && schoolTeachers.length > 0 && (
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <select
                                    value={selectedTeacher}
                                    onChange={(e) => setSelectedTeacher(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
                                >
                                    <option value="all">All Teachers</option>
                                    {schoolTeachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>{teacher.display_name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                {displayedLists.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Lists Found</h3>
                        <p className="text-gray-600">
                            {activeTab === 'school'
                                ? 'No vocabulary lists from your school colleagues yet.'
                                : 'No public lists match your search criteria.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {displayedLists.map((list, index) => (
                                <motion.div
                                    key={list.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 line-clamp-1">{list.name}</h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <User className="h-3 w-3" />
                                                    {list.teacher_name}
                                                </p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                                                {formatLanguage(list.language)}
                                            </span>
                                        </div>

                                        {list.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{list.description}</p>
                                        )}

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                {list.item_count} words
                                            </span>
                                            {list.usage_count > 0 && (
                                                <span className="flex items-center gap-1 text-purple-600">
                                                    <Users className="h-4 w-4" />
                                                    {list.usage_count} uses
                                                </span>
                                            )}
                                            {list.theme && (
                                                <span className="flex items-center gap-1">
                                                    <Sparkles className="h-4 w-4" />
                                                    {list.theme}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {new Date(list.created_at).toLocaleDateString()}
                                        </span>

                                        {duplicateSuccess === list.id ? (
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                <CheckCircle className="h-4 w-4" />
                                                Copied!
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => duplicateList(list.id)}
                                                disabled={duplicatingId === list.id}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                            >
                                                {duplicatingId === list.id ? (
                                                    <>
                                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                        Copying...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        Copy to My Lists
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
