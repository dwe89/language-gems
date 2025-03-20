import Link from 'next/link';
import Navigation from 'gems/components/layout/Navigation';
import Footer from 'gems/components/layout/Footer';

const languages = [
  { 
    id: 'spanish', 
    name: 'Spanish', 
    flag: '🇪🇸', 
    description: 'One of the world\'s most widely spoken languages. Learn Spanish for travel, work, or connecting with Spanish-speaking communities.',
    difficulty: 'Moderate',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-red-500',
  },
  { 
    id: 'french', 
    name: 'French', 
    flag: '🇫🇷', 
    description: 'A language of diplomacy, cuisine, and culture. Learn French to explore art, literature, and francophone countries around the world.',
    difficulty: 'Moderate',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-indigo-600',
  },
  { 
    id: 'german', 
    name: 'German', 
    flag: '🇩🇪', 
    description: 'A precise and logical language. Learn German for business, engineering, and to explore Central European culture and philosophy.',
    difficulty: 'Moderate to Hard',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-yellow-500',
  },
  { 
    id: 'italian', 
    name: 'Italian', 
    flag: '🇮🇹', 
    description: 'The language of art, music, and exceptional cuisine. Learn Italian to appreciate Renaissance masterpieces and authentic Italian culture.',
    difficulty: 'Moderate',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-red-500',
  },
  { 
    id: 'japanese', 
    name: 'Japanese', 
    flag: '🇯🇵', 
    description: 'A unique language with three writing systems. Learn Japanese to explore anime, manga, and Japan\'s rich cultural heritage.',
    difficulty: 'Hard',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-pink-500',
  },
  { 
    id: 'mandarin', 
    name: 'Mandarin Chinese', 
    flag: '🇨🇳', 
    description: 'The most widely spoken language in the world. Learn Mandarin for business opportunities and to discover China\'s ancient civilization.',
    difficulty: 'Hard',
    gradientFrom: 'from-yellow-400',
    gradientTo: 'to-red-600',
  },
  { 
    id: 'portuguese', 
    name: 'Portuguese', 
    flag: '🇵🇹', 
    description: 'Spoken across multiple continents. Learn Portuguese to connect with Brazil, Portugal, and other Portuguese-speaking nations.',
    difficulty: 'Moderate',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-yellow-400',
  },
  { 
    id: 'arabic', 
    name: 'Arabic', 
    flag: '🇦🇪', 
    description: 'A language with a rich literary tradition. Learn Arabic to appreciate its elegant calligraphy and diverse cultural influences.',
    difficulty: 'Hard',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-cyan-500',
  },
  { 
    id: 'russian', 
    name: 'Russian', 
    flag: '🇷🇺', 
    description: 'A language with a distinguished literary tradition. Learn Russian to read Dostoevsky and Tolstoy in their original language.',
    difficulty: 'Hard',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-red-500',
  },
];

export default function LanguagesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Language</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select from our wide range of language options. Each offers unique features, 
            cultural insights, and tailored learning paths.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {languages.map((language) => (
            <div 
              key={language.id}
              className="bg-indigo-900/30 backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
            >
              <div className={`h-3 bg-gradient-to-r ${language.gradientFrom} ${language.gradientTo}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3 text-3xl">{language.flag}</span>
                    {language.name}
                  </h2>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-800/70 text-cyan-300">
                    {language.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 mb-6">
                  {language.description}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <Link
                    href={`/learn/${language.id}`}
                    className="px-6 py-2 gem-button"
                  >
                    Start Learning
                  </Link>
                  <Link
                    href={`/learn/${language.id}/about`}
                    className="text-cyan-300 hover:underline"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 