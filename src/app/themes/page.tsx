import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Themes | Language Gems',
  description: 'Explore various themes to enhance your language learning experience.',
};

const themes = [
  {
    id: 'daily-life',
    title: 'Daily Life',
    description: 'Learn vocabulary and phrases for everyday situations.',
    icon: '🏠',
    color: 'bg-blue-500',
  },
  {
    id: 'travel',
    title: 'Travel',
    description: 'Essential phrases and vocabulary for travelers.',
    icon: '✈️',
    color: 'bg-green-500',
  },
  {
    id: 'food',
    title: 'Food & Dining',
    description: 'Restaurant vocabulary and culinary expressions.',
    icon: '🍽️',
    color: 'bg-yellow-500',
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Professional vocabulary for workplace communication.',
    icon: '💼',
    color: 'bg-red-500',
  },
  {
    id: 'culture',
    title: 'Culture',
    description: 'Cultural insights and expressions from around the world.',
    icon: '🎭',
    color: 'bg-purple-500',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Academic vocabulary and classroom expressions.',
    icon: '📚',
    color: 'bg-indigo-500',
  },
  {
    id: 'health',
    title: 'Health & Wellness',
    description: 'Vocabulary related to health, medicine, and fitness.',
    icon: '🏥',
    color: 'bg-pink-500',
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    description: 'Vocabulary for movies, music, and leisure activities.',
    icon: '🎬',
    color: 'bg-teal-500',
  },
];

export default function ThemesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Language Learning Themes</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose a theme to focus your language learning on specific areas of interest.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div 
            key={theme.id} 
            className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className={`${theme.color} p-6 text-white h-full flex flex-col`}>
              <div className="text-5xl mb-4">{theme.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{theme.title}</h2>
              <p className="mb-4 flex-grow">{theme.description}</p>
              
              <Link 
                href={`/learn/${theme.id}`} 
                className="inline-block bg-white text-gray-800 font-medium py-2 px-6 rounded-full shadow hover:bg-gray-100 transition-colors text-center"
              >
                Explore Theme
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 