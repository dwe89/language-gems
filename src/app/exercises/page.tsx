import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Language Exercises | Language Gems',
  description: 'Practice your language skills with a variety of interactive exercises.',
};

const exercises = [
  {
    id: 'vocabulary',
    title: 'Vocabulary Builder',
    description: 'Expand your vocabulary with interactive flashcards and quizzes.',
    icon: '📝',
    color: 'bg-emerald-500',
    difficulty: 'All Levels',
  },
  {
    id: 'grammar',
    title: 'Grammar Practice',
    description: 'Improve your grammar skills with structured exercises.',
    icon: '📚',
    color: 'bg-blue-500',
    difficulty: 'Beginner to Advanced',
  },
  {
    id: 'listening',
    title: 'Listening Comprehension',
    description: 'Train your ear with audio exercises and dictation practice.',
    icon: '👂',
    color: 'bg-purple-500',
    difficulty: 'All Levels',
  },
  {
    id: 'speaking',
    title: 'Speaking Practice',
    description: 'Improve your pronunciation and conversational skills.',
    icon: '🗣️',
    color: 'bg-red-500',
    difficulty: 'Intermediate',
  },
  {
    id: 'reading',
    title: 'Reading Practice',
    description: 'Enhance your reading skills with adaptive texts and comprehension questions.',
    icon: '📰',
    color: 'bg-yellow-500',
    difficulty: 'All Levels',
  },
  {
    id: 'writing',
    title: 'Writing Exercises',
    description: 'Develop your writing skills with guided exercises and feedback.',
    icon: '✍️',
    color: 'bg-teal-500',
    difficulty: 'Intermediate to Advanced',
  },
  {
    id: 'conversation',
    title: 'Conversation Scenarios',
    description: 'Practice real-life conversations in various contexts.',
    icon: '💬',
    color: 'bg-indigo-500',
    difficulty: 'Intermediate',
  },
  {
    id: 'idioms',
    title: 'Idioms & Expressions',
    description: 'Learn common idioms and cultural expressions.',
    icon: '🎭',
    color: 'bg-orange-500',
    difficulty: 'Advanced',
  },
];

export default function ExercisesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Language Exercises</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Strengthen your language skills with our diverse set of interactive exercises designed for all learning levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div 
            key={exercise.id} 
            className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className={`${exercise.color} p-6 text-white h-full flex flex-col`}>
              <div className="text-5xl mb-4">{exercise.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{exercise.title}</h2>
              <div className="mb-2 text-sm">
                <span className="bg-white/20 px-2 py-1 rounded">
                  {exercise.difficulty}
                </span>
              </div>
              <p className="mb-4 flex-grow">{exercise.description}</p>
              
              <Link 
                href={`/exercises/${exercise.id}`} 
                className="inline-block bg-white text-gray-800 font-medium py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-colors text-center"
              >
                Start Exercise
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 