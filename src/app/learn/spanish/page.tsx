import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn Spanish | Language Gems',
  description: 'Start your Spanish language learning journey with comprehensive courses and resources.',
};

const learningPaths = [
  {
    id: 'beginner',
    title: 'Beginner Path',
    description: 'Perfect for absolute beginners who want to learn Spanish from scratch.',
    modules: 12,
    estimatedTime: '3 months',
    color: 'bg-gradient-to-r from-blue-500 to-blue-700',
  },
  {
    id: 'intermediate',
    title: 'Intermediate Path',
    description: 'For learners who already have a basic understanding of Spanish grammar and vocabulary.',
    modules: 10,
    estimatedTime: '4 months',
    color: 'bg-gradient-to-r from-green-500 to-green-700',
  },
  {
    id: 'advanced',
    title: 'Advanced Path',
    description: 'Focus on advanced grammar, nuanced expressions, and cultural understanding.',
    modules: 8,
    estimatedTime: '5 months',
    color: 'bg-gradient-to-r from-purple-500 to-purple-700',
  },
  {
    id: 'business',
    title: 'Business Spanish',
    description: 'Learn specialized vocabulary and expressions for professional settings.',
    modules: 6,
    estimatedTime: '3 months',
    color: 'bg-gradient-to-r from-red-500 to-red-700',
  },
];

const resources = [
  {
    title: 'Spanish Grammar Guide',
    description: 'Comprehensive guide to Spanish grammar rules and structures.',
    icon: '📚',
    link: '/resources/spanish/grammar',
  },
  {
    title: 'Pronunciation Trainer',
    description: 'Master Spanish pronunciation with interactive exercises.',
    icon: '🗣️',
    link: '/resources/spanish/pronunciation',
  },
  {
    title: 'Spanish Vocabulary Lists',
    description: 'Categorized vocabulary lists for different topics.',
    icon: '📝',
    link: '/resources/spanish/vocabulary',
  },
  {
    title: 'Cultural Insights',
    description: 'Learn about Hispanic cultures and traditions.',
    icon: '🌎',
    link: '/resources/spanish/culture',
  },
];

export default function LearnSpanishPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-blue-600">Learn Spanish</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover a comprehensive Spanish learning experience tailored to your level and goals.
          From beginner to advanced, our structured paths will guide your learning journey.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Choose Your Learning Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {learningPaths.map((path) => (
            <div 
              key={path.id} 
              className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div className={`${path.color} p-8 text-white h-full flex flex-col`}>
                <h3 className="text-2xl font-bold mb-4">{path.title}</h3>
                <p className="mb-6 flex-grow">{path.description}</p>
                
                <div className="flex justify-between mb-6">
                  <div>
                    <span className="font-medium">Modules:</span> {path.modules}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {path.estimatedTime}
                  </div>
                </div>
                
                <Link 
                  href={`/learn/spanish/${path.id}`} 
                  className="inline-block bg-white text-gray-800 font-medium py-3 px-6 rounded-full shadow hover:bg-gray-100 transition-colors text-center"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Practice Your Spanish Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/games?language=spanish" 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">Spanish Games</h3>
            <p>Learn while having fun with interactive language games.</p>
          </Link>
          
          <Link 
            href="/exercises?language=spanish" 
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">Spanish Exercises</h3>
            <p>Practice with targeted exercises to improve specific skills.</p>
          </Link>
          
          <Link 
            href="/community/spanish" 
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Spanish Community</h3>
            <p>Connect with other learners and native speakers.</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Spanish Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <Link 
              key={index} 
              href={resource.link}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{resource.icon}</div>
              <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
              <p className="text-gray-600">{resource.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 