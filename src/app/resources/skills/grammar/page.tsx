import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const GRAMMAR_CATEGORIES = [
  {
    id: 'tenses',
    name: 'Tenses',
    description: 'Present, Past, Future, Conditional, Subjunctive, and more.'
  },
  {
    id: 'verb-conjugations',
    name: 'Verb Conjugations',
    description: 'Regular, irregular, reflexive, and modal verbs.'
  },
  {
    id: 'sentence-structures',
    name: 'Sentence Structures',
    description: 'Questions, negatives, word order, and complex sentences.'
  }
];

export default function GrammarSkillsPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Grammar Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {GRAMMAR_CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-indigo-50 rounded-lg p-6 shadow text-center flex flex-col items-center">
            <BookOpen className="h-10 w-10 text-indigo-500 mb-3" />
            <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
            <p className="text-slate-700 mb-4">{cat.description}</p>
            <Link href={`/resources/skills/grammar/${cat.id}`} className="inline-block mt-auto px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">View Resources</Link>
          </div>
        ))}
      </div>
    </div>
  );
} 