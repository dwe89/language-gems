import { 
  Target, 
  BookOpen, 
  Star, 
  ChevronRight, 
  Users, 
  Flag,
  Type,
  Hash,
  Clock,
  Zap
} from 'lucide-react';

export interface GrammarCategory {
  id: string;
  name: string;
  displayName: string;
  icon: React.ElementType;
  color: string;
  subcategories: GrammarSubcategory[];
}

export interface GrammarSubcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
}

export const GRAMMAR_CATEGORIES: GrammarCategory[] = [
  {
    id: 'verbs',
    name: 'verbs',
    displayName: 'Verbs',
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    subcategories: [
      { id: 'present_tense', name: 'present_tense', displayName: 'Present Tense', categoryId: 'verbs' },
      { id: 'preterite_tense', name: 'preterite_tense', displayName: 'Preterite Tense', categoryId: 'verbs' },
      { id: 'imperfect_tense', name: 'imperfect_tense', displayName: 'Imperfect Tense', categoryId: 'verbs' },
      { id: 'future_tense', name: 'future_tense', displayName: 'Future Tense', categoryId: 'verbs' },
      { id: 'conditional', name: 'conditional', displayName: 'Conditional', categoryId: 'verbs' },
      { id: 'subjunctive', name: 'subjunctive', displayName: 'Subjunctive', categoryId: 'verbs' },
      { id: 'imperative', name: 'imperative', displayName: 'Imperative', categoryId: 'verbs' },
      { id: 'perfect_tenses', name: 'perfect_tenses', displayName: 'Perfect Tenses', categoryId: 'verbs' },
      { id: 'ser_vs_estar', name: 'ser_vs_estar', displayName: 'Ser vs Estar', categoryId: 'verbs' },
      { id: 'reflexive_verbs', name: 'reflexive_verbs', displayName: 'Reflexive Verbs', categoryId: 'verbs' }
    ]
  },
  {
    id: 'nouns',
    name: 'nouns',
    displayName: 'Nouns',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    subcategories: [
      { id: 'gender', name: 'gender', displayName: 'Gender', categoryId: 'nouns' },
      { id: 'articles', name: 'articles', displayName: 'Articles', categoryId: 'nouns' },
      { id: 'plurals', name: 'plurals', displayName: 'Plurals', categoryId: 'nouns' },
      { id: 'possessives', name: 'possessives', displayName: 'Possessives', categoryId: 'nouns' }
    ]
  },
  {
    id: 'adjectives',
    name: 'adjectives',
    displayName: 'Adjectives',
    icon: Star,
    color: 'from-yellow-500 to-orange-600',
    subcategories: [
      { id: 'agreement', name: 'agreement', displayName: 'Agreement', categoryId: 'adjectives' },
      { id: 'comparison', name: 'comparison', displayName: 'Comparison', categoryId: 'adjectives' },
      { id: 'position', name: 'position', displayName: 'Position', categoryId: 'adjectives' },
      { id: 'demonstrative', name: 'demonstrative', displayName: 'Demonstrative', categoryId: 'adjectives' }
    ]
  },
  {
    id: 'pronouns',
    name: 'pronouns',
    displayName: 'Pronouns',
    icon: Users,
    color: 'from-purple-500 to-pink-600',
    subcategories: [
      { id: 'personal', name: 'personal', displayName: 'Personal', categoryId: 'pronouns' },
      { id: 'possessive', name: 'possessive', displayName: 'Possessive', categoryId: 'pronouns' },
      { id: 'relative', name: 'relative', displayName: 'Relative', categoryId: 'pronouns' },
      { id: 'interrogative', name: 'interrogative', displayName: 'Interrogative', categoryId: 'pronouns' }
    ]
  },
  {
    id: 'prepositions',
    name: 'prepositions',
    displayName: 'Prepositions',
    icon: Flag,
    color: 'from-red-500 to-rose-600',
    subcategories: [
      { id: 'location', name: 'location', displayName: 'Location', categoryId: 'prepositions' },
      { id: 'time', name: 'time', displayName: 'Time', categoryId: 'prepositions' },
      { id: 'direction', name: 'direction', displayName: 'Direction', categoryId: 'prepositions' },
      { id: 'manner', name: 'manner', displayName: 'Manner', categoryId: 'prepositions' }
    ]
  },
  {
    id: 'syntax',
    name: 'syntax',
    displayName: 'Syntax',
    icon: ChevronRight,
    color: 'from-gray-500 to-slate-600',
    subcategories: [
      { id: 'word_order', name: 'word_order', displayName: 'Word Order', categoryId: 'syntax' },
      { id: 'questions', name: 'questions', displayName: 'Questions', categoryId: 'syntax' },
      { id: 'negation', name: 'negation', displayName: 'Negation', categoryId: 'syntax' },
      { id: 'complex_sentences', name: 'complex_sentences', displayName: 'Complex Sentences', categoryId: 'syntax' }
    ]
  },
  {
    id: 'adverbs',
    name: 'adverbs',
    displayName: 'Adverbs',
    icon: Zap,
    color: 'from-cyan-500 to-blue-600',
    subcategories: [
      { id: 'manner', name: 'manner', displayName: 'Manner', categoryId: 'adverbs' },
      { id: 'time', name: 'time', displayName: 'Time', categoryId: 'adverbs' },
      { id: 'frequency', name: 'frequency', displayName: 'Frequency', categoryId: 'adverbs' },
      { id: 'intensity', name: 'intensity', displayName: 'Intensity', categoryId: 'adverbs' }
    ]
  },
  {
    id: 'numbers',
    name: 'numbers',
    displayName: 'Numbers',
    icon: Hash,
    color: 'from-teal-500 to-green-600',
    subcategories: [
      { id: 'cardinal', name: 'cardinal', displayName: 'Cardinal Numbers', categoryId: 'numbers' },
      { id: 'ordinal', name: 'ordinal', displayName: 'Ordinal Numbers', categoryId: 'numbers' },
      { id: 'fractions', name: 'fractions', displayName: 'Fractions', categoryId: 'numbers' },
      { id: 'dates_time', name: 'dates_time', displayName: 'Dates & Time', categoryId: 'numbers' }
    ]
  },
  {
    id: 'general',
    name: 'general',
    displayName: 'General Grammar',
    icon: Type,
    color: 'from-indigo-500 to-purple-600',
    subcategories: [
      { id: 'basics', name: 'basics', displayName: 'Grammar Basics', categoryId: 'general' },
      { id: 'common_mistakes', name: 'common_mistakes', displayName: 'Common Mistakes', categoryId: 'general' },
      { id: 'mixed_practice', name: 'mixed_practice', displayName: 'Mixed Practice', categoryId: 'general' }
    ]
  }
];

// Helper function to get category by ID
export function getGrammarCategoryById(id: string): GrammarCategory | undefined {
  return GRAMMAR_CATEGORIES.find(cat => cat.id === id);
}

// Helper function to get subcategory by ID
export function getGrammarSubcategoryById(categoryId: string, subcategoryId: string): GrammarSubcategory | undefined {
  const category = getGrammarCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
}

// Helper function to get all subcategories
export function getAllGrammarSubcategories(): GrammarSubcategory[] {
  return GRAMMAR_CATEGORIES.flatMap(cat => cat.subcategories);
}
