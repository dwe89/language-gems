import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Target, TrendingUp, Users, Award, Clock } from 'lucide-react';
import { getOrganizationSchema, getCourseSchema, getFAQSchema } from '../../lib/seo/structuredData';

export const metadata: Metadata = {
  title: 'GCSE Language Learning Games & Vocabulary Platform | Language Gems',
  description: 'Transform GCSE language learning with 15+ interactive games, adaptive vocabulary practice, and comprehensive analytics. Trusted by UK schools for Spanish, French, and German GCSE preparation.',
  keywords: [
    'GCSE language learning',
    'GCSE Spanish games',
    'GCSE French games', 
    'GCSE German games',
    'interactive vocabulary games',
    'GCSE language preparation',
    'language learning platform',
    'GCSE revision games',
    'vocabulary practice GCSE',
    'gamified language learning'
  ],
  openGraph: {
    title: 'GCSE Language Learning Games & Vocabulary Platform',
    description: 'Transform GCSE language learning with interactive games and adaptive vocabulary practice.',
    images: ['/images/gcse-language-learning-og.jpg'],
  },
  alternates: {
    canonical: '/gcse-language-learning',
  },
};

const features = [
  {
    icon: Target,
    title: 'GCSE-Aligned Content',
    description: 'All vocabulary and exercises are specifically curated to match GCSE curriculum requirements for AQA, Edexcel, and other major exam boards.'
  },
  {
    icon: TrendingUp,
    title: 'Adaptive Learning Technology',
    description: 'Our AI-powered system adapts to each student\'s learning pace, focusing on weak areas and reinforcing strengths for optimal progress.'
  },
  {
    icon: Users,
    title: 'Classroom Integration',
    description: 'Teacher dashboards provide real-time insights into student progress, making it easy to identify struggling learners and track class performance.'
  },
  {
    icon: Award,
    title: 'Proven Results',
    description: 'Students using Language Gems show 40% faster vocabulary retention and improved confidence in speaking and writing assessments.'
  },
  {
    icon: Clock,
    title: 'Flexible Learning',
    description: 'Study anytime, anywhere with our responsive platform. Perfect for homework, revision sessions, or quick practice during breaks.'
  },
  {
    icon: BookOpen,
    title: '15+ Interactive Games',
    description: 'From vocabulary mining to conjugation duels, our diverse game library keeps students engaged while building essential language skills.'
  }
];

const languages = [
  {
    name: 'Spanish',
    description: 'Master GCSE Spanish with comprehensive vocabulary covering all major themes: family, school, work, environment, and culture.',
    games: ['Vocabulary Mining', 'Conjugation Duel', 'Detective Listening', 'Memory Match'],
    examBoards: ['AQA', 'Edexcel', 'OCR', 'WJEC']
  },
  {
    name: 'French', 
    description: 'Build confidence in GCSE French through interactive games covering essential vocabulary and grammar structures.',
    games: ['Hangman', 'Word Scramble', 'Translation Tycoon', 'Sentence Builder'],
    examBoards: ['AQA', 'Edexcel', 'OCR', 'WJEC']
  },
  {
    name: 'German',
    description: 'Tackle GCSE German vocabulary and complex grammar with engaging, curriculum-aligned learning games.',
    games: ['Verb Quest', 'Memory Match', 'Speed Builder', 'Vocab Blast'],
    examBoards: ['AQA', 'Edexcel', 'OCR']
  }
];

const faqs = [
  {
    question: 'How does Language Gems align with GCSE requirements?',
    answer: 'Our content is specifically designed to match GCSE curriculum requirements across all major exam boards (AQA, Edexcel, OCR, WJEC). We cover all required vocabulary themes and grammatical structures outlined in the specifications.'
  },
  {
    question: 'Can teachers track student progress?',
    answer: 'Yes! Our comprehensive teacher dashboard provides real-time analytics on student performance, time spent learning, vocabulary mastery levels, and areas needing improvement. Perfect for informing lesson planning and intervention strategies.'
  },
  {
    question: 'What makes this different from other language learning apps?',
    answer: 'Unlike consumer apps like Duolingo, Language Gems is specifically designed for UK GCSE requirements. We focus on curriculum-aligned vocabulary, exam-style exercises, and provide detailed analytics that teachers need for classroom management.'
  },
  {
    question: 'How much does it cost for schools?',
    answer: 'We offer transparent annual pricing starting from £399 for basic access. Our whole-school plan at £699/year includes unlimited teachers and students, all games, and comprehensive analytics. No hidden costs or per-user fees.'
  }
];

export default function GCSELanguageLearningPage() {
  const organizationSchema = getOrganizationSchema();
  const spanishCourseSchema = getCourseSchema('Spanish');
  const faqSchema = getFAQSchema(faqs);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, spanishCourseSchema, faqSchema])
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Transform GCSE Language Learning with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Interactive Games</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Help your students excel in GCSE Spanish, French, and German with our curriculum-aligned vocabulary games, 
                adaptive learning technology, and comprehensive teacher analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/schools/pricing"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View School Pricing
                </Link>
                <Link
                  href="/games"
                  className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  Explore Games
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Choose Language Gems for GCSE Success?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our platform is specifically designed for UK schools and GCSE requirements, 
                not adapted from consumer language learning apps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-8 border border-indigo-100 hover:border-indigo-200 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Languages Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                GCSE Languages We Support
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Comprehensive coverage for the most popular GCSE modern foreign languages
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {languages.map((language, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">GCSE {language.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{language.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-2">Popular Games:</h4>
                    <div className="flex flex-wrap gap-2">
                      {language.games.map((game, gameIndex) => (
                        <span key={gameIndex} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Exam Boards:</h4>
                    <div className="flex flex-wrap gap-2">
                      {language.examBoards.map((board, boardIndex) => (
                        <span key={boardIndex} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {board}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
              Ready to Transform Your GCSE Language Teaching?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Join hundreds of UK schools already using Language Gems to improve GCSE results and student engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/schools/pricing"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get School Pricing
              </Link>
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-indigo-600 transition-all duration-200"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
