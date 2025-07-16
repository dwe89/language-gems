import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

const EXAM_CATEGORIES = [
  {
    id: 'reading',
    name: 'Reading',
    description: 'Practice comprehension and interpretation of written texts.'
  },
  {
    id: 'listening',
    name: 'Listening',
    description: 'Develop skills for understanding spoken language.'
  },
  {
    id: 'speaking',
    name: 'Speaking',
    description: 'Tasks and prompts to build oral fluency and confidence.'
  },
  {
    id: 'writing',
    name: 'Writing',
    description: 'Practice structuring and expressing ideas in writing.'
  }
];

export default function ExamPracticeSkillsPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Exam Practice Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {EXAM_CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-yellow-50 rounded-lg p-6 shadow text-center flex flex-col items-center">
            <FileText className="h-10 w-10 text-yellow-500 mb-3" />
            <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
            <p className="text-slate-700 mb-4">{cat.description}</p>
            <Link href={`/resources/skills/exam-practice/${cat.id}`} className="inline-block mt-auto px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors">View Resources</Link>
          </div>
        ))}
      </div>
    </div>
  );
} 