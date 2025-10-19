'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Award, Clock, Users, Star, ChevronRight, ChevronDown, CheckCircle, Edit } from 'lucide-react';
import Link from 'next/link';
import { GemCard } from '../../../components/ui/GemTheme';
import FlagIcon from '../../../components/ui/FlagIcon';
import { useAuth } from '@/components/auth/AuthProvider';
import GrammarIndexEditModal from '@/components/admin/GrammarIndexEditModal';

// Interfaces for discovered topics and categories
interface DiscoveredTopic {
  name: string;
  slug: string;
  category: string;
  path: string;
  hasContent: boolean; // Renamed from hasQuiz/hasPractice - indicates if topic has interactive content
}

interface GrammarCategory {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  topics: DiscoveredTopic[];
  isExpanded: boolean;
  hasSubcategories?: boolean;
  subcategories?: VerbSubcategory[];
}

interface VerbSubcategory {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  priority: number;
  topics: string[];
  isExpanded: boolean;
  matchedTopics: DiscoveredTopic[];
}

// Verb sub-categorization for better organization
const VERB_SUBCATEGORIES = {
  'essential-tenses': {
    name: 'Essential Tenses',
    description: 'Core tenses every Spanish learner needs',
    icon: Award,
    color: 'from-green-500 to-green-600',
    priority: 1,
    topics: [
      'present-tense', 'present-regular', 'present-irregular', 'present-continuous', 'present-perfect',
      'preterite-tense', 'imperfect-tense', 'imperfect-continuous', 'imperfect-vs-preterite',
      'future-tense', 'future-perfect', 'periphrastic-future',
      'conditional-tense', 'conditional-perfect', 'pluperfect'
    ]
  },
  'subjunctive-moods': {
    name: 'Subjunctive & Moods',
    description: 'Subjunctive forms and imperative mood',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    priority: 2,
    topics: [
      'subjunctive', 'subjunctive-present', 'subjunctive-imperfect',
      'subjunctive-perfect', 'subjunctive-pluperfect', 'imperative'
    ]
  },
  'verb-types': {
    name: 'Verb Types & Patterns',
    description: 'Different types of verbs and their patterns',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    priority: 3,
    topics: [
      'irregular-verbs', 'stem-changing', 'modal-verbs',
      'ser-vs-estar', 'pronominal-verbs', 'auxiliary-verbs'
    ]
  },
  'advanced-constructions': {
    name: 'Advanced Constructions',
    description: 'Complex verb forms and sentence structures',
    icon: BookOpen,
    color: 'from-indigo-500 to-indigo-600',
    priority: 4,
    topics: [
      'passive-voice', 'reported-speech', 'negation',
      'sequence-of-tenses', 'conditional-sentences',
      'infinitive-constructions', 'past-participles', 'gerunds', 'interrogatives'
    ]
  }
};

// Dynamic grammar categories based on file system structure
const CATEGORY_CONFIG = {
  'adjectives': {
    name: 'Adjectives',
    description: 'Master Spanish adjectives, agreement, and position',
    icon: Star,
    color: 'from-purple-500 to-purple-600'
  },
  'adverbial-prepositional': {
    name: 'Adverbs & Prepositions',
    description: 'Master Spanish adverbs, prepositions, and comparisons',
    icon: Target,
    color: 'from-blue-500 to-blue-600'
  },
  'adverbs': {
    name: 'Adverbs',
    description: 'Learn Spanish adverb formation and usage',
    icon: ChevronRight,
    color: 'from-green-500 to-green-600'
  },
  'articles': {
    name: 'Articles',
    description: 'Master definite and indefinite articles',
    icon: BookOpen,
    color: 'from-orange-500 to-orange-600'
  },
  'nouns': {
    name: 'Nouns',
    description: 'Master Spanish nouns, gender, and plurals',
    icon: BookOpen,
    color: 'from-green-500 to-green-600'
  },
  'prepositions': {
    name: 'Prepositions',
    description: 'Learn Spanish prepositions and their usage',
    icon: Target,
    color: 'from-indigo-500 to-indigo-600'
  },
  'pronouns': {
    name: 'Pronouns',
    description: 'Master Spanish pronouns and their forms',
    icon: Users,
    color: 'from-pink-500 to-pink-600'
  },
  'sounds-spelling': {
    name: 'Sounds & Spelling',
    description: 'Learn Spanish pronunciation and spelling rules',
    icon: Award,
    color: 'from-yellow-500 to-yellow-600'
  },
  'syntax': {
    name: 'Syntax',
    description: 'Master Spanish sentence structure and word order',
    icon: Target,
    color: 'from-cyan-500 to-cyan-600'
  },
  'verbs': {
    name: 'Verbs',
    description: 'Master Spanish verb conjugations and tenses',
    icon: Clock,
    color: 'from-red-500 to-red-600',
    hasSubcategories: true
  },
  'word-formation': {
    name: 'Word Formation',
    description: 'Learn Spanish word formation patterns',
    icon: Star,
    color: 'from-teal-500 to-teal-600'
  }
};

export function SpanishGrammarClient() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  const [categories, setCategories] = useState<GrammarCategory[]>([]);
  const [practiceReadyTopics, setPracticeReadyTopics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load grammar structure and practice status
  useEffect(() => {
    const loadGrammarStructure = async () => {
      try {
        setLoading(true);

        // Fetch content-ready topics from database FIRST
        const contentResponse = await fetch('/api/grammar/practice-status?language=spanish');
        const contentData = await contentResponse.json();

        let practiceReadySet = new Set<string>();
        if (contentData.success) {
          practiceReadySet = new Set(contentData.data || []);
          setPracticeReadyTopics(practiceReadySet);
        }

        // Fetch topics directly from database instead of file system discovery
        const topicsResponse = await fetch('/api/grammar/topics?language=es');
        const topicsData = await topicsResponse.json();

        if (!topicsData.success) {
          throw new Error('Failed to load grammar topics');
        }

        // Organize topics by category
        const categoryMap: { [key: string]: GrammarCategory } = {};

        topicsData.data.forEach((topic: any) => {
          const categoryKey = topic.category;
          const categoryConfig = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG];

          if (!categoryConfig) {
            console.warn(`No configuration found for category: ${categoryKey}`);
            return;
          }

          if (!categoryMap[categoryKey]) {
            categoryMap[categoryKey] = {
              ...categoryConfig,
              topics: [],
              isExpanded: false
            };
          }

          // Convert database topic to DiscoveredTopic format
          const hasContent = practiceReadySet.has(topic.slug);
          const discoveredTopic: DiscoveredTopic = {
            name: topic.title || topic.topic_name,
            slug: topic.slug,
            category: topic.category,
            path: `${topic.category}/${topic.slug}`,
            hasContent: hasContent
          };



          categoryMap[categoryKey].topics.push(discoveredTopic);
        });

        // Handle verb subcategorization
        if (categoryMap['verbs']) {
          const verbCategory = categoryMap['verbs'];
          const subcategories: VerbSubcategory[] = [];

          // Create subcategories with matched topics
          Object.entries(VERB_SUBCATEGORIES).forEach(([key, subcat]) => {
            const matchedTopics = verbCategory.topics.filter(topic =>
              subcat.topics.includes(topic.slug)
            );

            subcategories.push({
              key,
              name: subcat.name,
              description: subcat.description,
              icon: subcat.icon,
              color: subcat.color,
              priority: subcat.priority,
              topics: subcat.topics,
              isExpanded: false,
              matchedTopics
            });
          });

          // Sort subcategories by priority
          subcategories.sort((a, b) => a.priority - b.priority);

          // Add subcategories to verb category
          verbCategory.subcategories = subcategories;
          verbCategory.hasSubcategories = true;
        }

        // Convert to array and sort
        const categoriesArray = Object.values(categoryMap).sort((a, b) => a.name.localeCompare(b.name));
        setCategories(categoriesArray);

      } catch (err) {
        console.error('Error loading grammar structure:', err);
        setError(err instanceof Error ? err.message : 'Failed to load grammar structure');
      } finally {
        setLoading(false);
      }
    };

    loadGrammarStructure();
  }, []);

  const toggleCategory = (categoryIndex: number) => {
    setCategories(prev => prev.map((cat, index) =>
      index === categoryIndex ? { ...cat, isExpanded: !cat.isExpanded } : cat
    ));
  };

  const toggleSubcategory = (categoryIndex: number, subcategoryKey: string) => {
    setCategories(prev => prev.map((cat, index) => {
      if (index === categoryIndex && cat.subcategories) {
        return {
          ...cat,
          subcategories: cat.subcategories.map(subcat =>
            subcat.key === subcategoryKey
              ? { ...subcat, isExpanded: !subcat.isExpanded }
              : subcat
          )
        };
      }
      return cat;
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Spanish grammar topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Grammar Topics</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare categories for modal
  const categoriesForModal = categories.map(cat => ({
    name: cat.name,
    key: Object.keys(CATEGORY_CONFIG).find(
      key => CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG].name === cat.name
    ) || cat.name.toLowerCase(),
    topics: cat.topics,
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <FlagIcon countryCode="ES" size="lg" className="mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">Spanish Grammar</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master Spanish grammar with comprehensive guides covering all essential topics.
          Explore {categories.reduce((total, cat) => total + cat.topics.length, 0)} grammar topics
          organized into {categories.length} categories.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <GemCard key={category.name} className="overflow-hidden">
            {/* Category Header */}
            <div
              className={`bg-gradient-to-r ${category.color} p-6 cursor-pointer transition-all duration-200 hover:shadow-lg`}
              onClick={() => toggleCategory(categoryIndex)}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <category.icon className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-white/90 mt-1">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-white/90">Topics</div>
                    <div className="text-xl font-bold">{category.topics.length}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/90">Content Ready</div>
                    <div className="text-xl font-bold">
                      {category.topics.filter(t => t.hasContent).length}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-6 w-6 transition-transform duration-200 ${
                      category.isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Topics List or Subcategories */}
            {category.isExpanded && (
              <div className="bg-white">
                {category.hasSubcategories && category.subcategories ? (
                  // Render verb subcategories
                  <div className="space-y-4 p-6">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.key} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Subcategory Header */}
                        <div
                          className={`bg-gradient-to-r ${subcategory.color} p-4 cursor-pointer`}
                          onClick={() => toggleSubcategory(categoryIndex, subcategory.key)}
                        >
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center space-x-3">
                              <subcategory.icon className="h-5 w-5" />
                              <div>
                                <h3 className="font-semibold">{subcategory.name}</h3>
                                <p className="text-sm text-white/90">{subcategory.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="text-xs text-white/90">Topics</div>
                                <div className="font-bold">{subcategory.matchedTopics.length}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white/90">Content</div>
                                <div className="font-bold">
                                  {subcategory.matchedTopics.filter(t => t.hasContent).length}
                                </div>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                  subcategory.isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Subcategory Topics */}
                        {subcategory.isExpanded && (
                          <div className="p-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {subcategory.matchedTopics.map((topic) => (
                                <div key={topic.slug} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-gray-900 text-sm flex-1">{topic.name}</h4>
                                    <div className="flex items-center space-x-1 ml-2">
                                      {topic.hasContent && (
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-1 mt-2">
                                    <Link
                                      href={`/grammar/spanish/${topic.path}`}
                                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium transition-colors text-center"
                                    >
                                      Learn
                                    </Link>

                                    {topic.hasContent && (
                                      <Link
                                        href={`/grammar/spanish/${topic.path}/challenge`}
                                        className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 px-2 py-1 rounded text-xs font-medium transition-colors text-center flex items-center justify-center"
                                      >
                                        <Award className="h-2 w-2 mr-1" />
                                        Challenge
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Render regular topics
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.topics.map((topic) => (
                        <div key={topic.slug} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 flex-1">{topic.name}</h3>
                            <div className="flex items-center space-x-2 ml-2">
                              {topic.hasContent && (
                                <div title="Content Available">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mt-3">
                            <Link
                              href={`/grammar/spanish/${topic.path}`}
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
                            >
                              Learn
                            </Link>

                            {topic.hasContent && (
                              <Link
                                href={`/grammar/spanish/${topic.path}/challenge`}
                                className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center flex items-center justify-center"
                              >
                                <Award className="h-3 w-3 mr-1" />
                                Challenge
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </GemCard>
        ))}
      </div>

      {/* Admin Edit Button */}
      {isAdmin && (
        <>
          <button
            onClick={() => setShowEditModal(true)}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Edit className="w-5 h-5" />
            <span>Manage Topics</span>
          </button>

          {showEditModal && (
            <GrammarIndexEditModal
              language="spanish"
              categories={categoriesForModal}
              onClose={() => setShowEditModal(false)}
              onSave={() => {
                setShowEditModal(false);
                window.location.reload();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
