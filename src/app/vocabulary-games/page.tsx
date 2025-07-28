import { Metadata } from 'next';
import Link from 'next/link';
import { Brain, Zap, Target, Trophy, Clock, Users } from 'lucide-react';
import { getOrganizationSchema, getFAQSchema } from '../../lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'Interactive Vocabulary Games for Language Learning | Language Gems',
  description: 'Boost vocabulary retention with 10+ interactive games featuring spaced repetition, adaptive learning, and GCSE-aligned content. Perfect for Spanish, French, and German vocabulary practice.',
  keywords: [
    'vocabulary games',
    'interactive vocabulary games',
    'language vocabulary practice',
    'vocabulary learning games',
    'Spanish vocabulary games',
    'French vocabulary games',
    'German vocabulary games',
    'vocabulary retention games',
    'educational vocabulary games',
    'GCSE vocabulary practice'
  ],
  openGraph: {
    title: 'Interactive Vocabulary Games for Language Learning',
    description: 'Boost vocabulary retention with interactive games featuring spaced repetition and adaptive learning.',
    images: ['/images/vocabulary-games-og.jpg'],
  },
  alternates: {
    canonical: '/vocabulary-games',
  },
};

const vocabularyGames = [
  {
    id: 'vocabulary-mining',
    name: 'Vocabulary Mining',
    description: 'Mine rare vocabulary gems through intelligent spaced repetition and adaptive learning algorithms.',
    features: ['Spaced Repetition', 'Adaptive Difficulty', 'Progress Tracking', 'Audio Pronunciation'],
    icon: '💎',
    difficulty: 'Beginner to Advanced',
    timePerSession: '10-15 minutes'
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Match words with translations, images, or audio to strengthen neural pathways and improve recall.',
    features: ['Visual Memory', 'Audio Integration', 'Multiple Formats', 'Performance Analytics'],
    icon: '🧠',
    difficulty: 'All Levels',
    timePerSession: '5-10 minutes'
  },
  {
    id: 'hangman',
    name: 'Vocabulary Hangman',
    description: 'Practice spelling and word recognition with themed vocabulary categories and progressive hints.',
    features: ['Spelling Practice', 'Category Selection', 'Hint System', 'Difficulty Scaling'],
    icon: '🎯',
    difficulty: 'Beginner to Intermediate',
    timePerSession: '5-8 minutes'
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble vocabulary words to reinforce spelling patterns and improve recognition speed.',
    features: ['Pattern Recognition', 'Timed Challenges', 'Themed Categories', 'Spelling Reinforcement'],
    icon: '🔤',
    difficulty: 'All Levels',
    timePerSession: '3-7 minutes'
  },
  {
    id: 'vocab-blast',
    name: 'Vocab Blast',
    description: 'Fast-paced vocabulary practice with click-to-reveal translations and themed challenges.',
    features: ['Speed Practice', 'Translation Reveals', 'Theme Integration', 'Competitive Scoring'],
    icon: '💥',
    difficulty: 'Intermediate to Advanced',
    timePerSession: '8-12 minutes'
  },
  {
    id: 'translation-tycoon',
    name: 'Translation Tycoon',
    description: 'Build your translation empire by mastering vocabulary across different contexts and themes.',
    features: ['Context Learning', 'Business Simulation', 'Multiple Themes', 'Achievement System'],
    icon: '🏢',
    difficulty: 'Intermediate to Advanced',
    timePerSession: '15-20 minutes'
  }
];

const benefits = [
  {
    icon: Brain,
    title: 'Scientifically Proven Methods',
    description: 'Our games use spaced repetition and active recall techniques proven to increase vocabulary retention by up to 40%.'
  },
  {
    icon: Zap,
    title: 'Adaptive Learning Technology',
    description: 'AI-powered algorithms adjust difficulty in real-time, ensuring optimal challenge levels for each student.'
  },
  {
    icon: Target,
    title: 'GCSE-Aligned Content',
    description: 'All vocabulary is carefully curated to match GCSE curriculum requirements across major exam boards.'
  },
  {
    icon: Trophy,
    title: 'Gamified Progression',
    description: 'Achievement systems, leaderboards, and progress tracking keep students motivated and engaged.'
  },
  {
    icon: Clock,
    title: 'Flexible Learning Sessions',
    description: 'Short, focused sessions fit perfectly into busy schedules, making consistent practice achievable.'
  },
  {
    icon: Users,
    title: 'Classroom Integration',
    description: 'Teacher dashboards provide insights into student progress and identify areas needing attention.'
  }
];

const faqs = [
  {
    question: 'How do vocabulary games improve retention compared to traditional methods?',
    answer: 'Our games use scientifically-proven techniques like spaced repetition, active recall, and contextual learning. These methods have been shown to improve long-term retention by 40-60% compared to passive study methods like flashcards or rote memorization.'
  },
  {
    question: 'Are the vocabulary lists aligned with GCSE requirements?',
    answer: 'Yes! All vocabulary is specifically curated to match GCSE curriculum requirements for AQA, Edexcel, OCR, and WJEC exam boards. We cover all required themes including family, school, work, environment, and cultural topics.'
  },
  {
    question: 'Can students play these games on mobile devices?',
    answer: 'Absolutely! All our vocabulary games are fully responsive and work seamlessly on tablets, smartphones, and desktop computers. Students can practice anywhere, anytime.'
  },
  {
    question: 'How do teachers track student progress?',
    answer: 'Our comprehensive teacher dashboard shows detailed analytics including vocabulary mastery levels, time spent practicing, common mistakes, and progress over time. This data helps inform lesson planning and identify students who need additional support.'
  },
  {
    question: 'What languages are supported?',
    answer: 'Currently, we support Spanish, French, German, and Italian vocabulary games. Each language includes comprehensive GCSE-level vocabulary across all major themes and topics.'
  }
];

export default function VocabularyGamesPage() {
  const organizationSchema = getOrganizationSchema();
  const faqSchema = getFAQSchema(faqs);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, faqSchema])
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Master Vocabulary with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Interactive Games</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Boost vocabulary retention by 40% with scientifically-proven spaced repetition games. 
                Perfect for GCSE Spanish, French, and German vocabulary practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/games"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Playing Games
                </Link>
                <Link
                  href="/schools/pricing"
                  className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  School Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Our Vocabulary Game Collection
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Each game is designed with specific learning objectives and proven pedagogical methods
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vocabularyGames.map((game, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-8 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg">
                  <div className="text-4xl mb-4">{game.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{game.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{game.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Difficulty:</span>
                      <span className="text-slate-700 font-medium">{game.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Session Time:</span>
                      <span className="text-slate-700 font-medium">{game.timePerSession}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {game.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    href={`/games/${game.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Play {game.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Our Vocabulary Games Work
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Built on proven learning science and designed specifically for language education
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-8 border border-indigo-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Vocabulary Learning?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Join thousands of students already improving their vocabulary retention with our interactive games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Playing Now
              </Link>
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-indigo-600 transition-all duration-200"
              >
                Book School Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
