import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import FreebiesBreadcrumb from '../../../../../components/freebies/FreebiesBreadcrumb';

const VOCAB_CATEGORIES = [
  {
    id: 'word-lists',
    name: 'Word Lists',
    description: 'Curated lists of essential French vocabulary by topic and frequency.'
  },
  {
    id: 'vocab-booklets',
    name: 'Vocab Booklets',
    description: 'Printable and digital booklets for French revision and practice.'
  },
  {
    id: 'frequency-packs',
    name: 'Frequency Packs',
    description: 'High-frequency French word packs for rapid progress.'
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Interactive French vocabulary games and activities.'
  }
];

export default function FrenchVocabularySkillsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          <FreebiesBreadcrumb
            items={[
              { label: 'Resources', href: '/resources' },
              { label: 'Skills Hub', href: '/resources/skills' },
              { label: 'French', href: '/resources/skills/french' },
              { label: 'Vocabulary', active: true }
            ]}
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">French Vocabulary Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {VOCAB_CATEGORIES.map((cat) => (
              <div key={cat.id} className="bg-green-50 rounded-lg p-6 shadow text-center flex flex-col items-center">
                <Users className="h-10 w-10 text-green-500 mb-3" />
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                <p className="text-slate-700 mb-4">{cat.description}</p>
                <Link href={`/resources/skills/french/vocabulary/${cat.id}`} className="inline-block mt-auto px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">View Resources</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}