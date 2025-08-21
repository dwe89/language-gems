import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Target, TrendingUp, Users, Award, Clock, CheckCircle, Star, FileText, Headphones } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getCourseSchema, getFAQSchema, getOrganizationSchema } from '../../lib/seo/structuredData';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'AQA Spanish GCSE Learning Games & Revision Platform | Language Gems',
  description: 'Master AQA Spanish GCSE with interactive games, comprehensive vocabulary practice, and curriculum-aligned content. Perfect preparation for AQA Spanish GCSE Foundation and Higher tiers.',
  keywords: [
    'AQA Spanish GCSE',
    'AQA Spanish GCSE games',
    'AQA Spanish GCSE vocabulary',
    'AQA Spanish GCSE revision',
    'AQA Spanish GCSE preparation',
    'AQA Spanish GCSE foundation',
    'AQA Spanish GCSE higher',
    'AQA Spanish GCSE themes',
    'AQA Spanish GCSE speaking',
    'AQA Spanish GCSE listening',
    'AQA Spanish GCSE writing',
    'AQA Spanish GCSE reading'
  ],
  canonical: '/aqa-spanish-gcse',
  ogImage: '/images/aqa-spanish-gcse-og.jpg',
});

const aqaSpanishFeatures = [
  {
    icon: Target,
    title: 'AQA Spanish GCSE Curriculum Aligned',
    description: 'All vocabulary and exercises match AQA Spanish GCSE specifications exactly, covering all three themes and required grammatical structures for both Foundation and Higher tiers.'
  },
  {
    icon: BookOpen,
    title: 'Complete AQA Theme Coverage',
    description: 'Master all AQA Spanish GCSE themes: Identity and Culture, Local Area Holiday and Travel, School, Future Aspirations Study and Work - with 2000+ curriculum-specific words.'
  },
  {
    icon: TrendingUp,
    title: 'Foundation & Higher Tier Support',
    description: 'Adaptive learning system automatically adjusts difficulty between Foundation and Higher tier requirements, ensuring appropriate challenge levels for all students.'
  },
  {
    icon: Users,
    title: 'AQA Assessment Style Practice',
    description: 'Practice with AQA-style questions and assessment formats, including speaking, listening, reading, and writing tasks that mirror actual exam conditions.'
  },
  {
    icon: Award,
    title: 'Grade Tracking & Analytics',
    description: 'Monitor progress toward AQA Spanish GCSE grade boundaries with detailed analytics showing strengths and areas for improvement across all skill areas.'
  },
  {
    icon: Clock,
    title: 'Exam Timing Practice',
    description: 'Build confidence with timed practice sessions that match AQA Spanish GCSE exam durations and question formats for optimal exam preparation.'
  }
];

const aqaSpanishGames = [
  {
    name: 'AQA Spanish Vocabulary Mining',
    description: 'Mine Spanish vocabulary gems using AQA-specific word lists, focusing on high-frequency terms from all three themes.',
    features: ['2000+ AQA words', 'Theme-based practice', 'Audio pronunciation', 'Progress tracking'],
    difficulty: 'Foundation & Higher',
    time: '10-15 minutes'
  },
  {
    name: 'AQA Spanish Grammar Builder',
    description: 'Master AQA Spanish grammar requirements through interactive sentence construction and verb conjugation challenges.',
    features: ['All AQA tenses', 'Subjunctive practice', 'Error correction', 'Instant feedback'],
    difficulty: 'Higher tier focus',
    time: '15-20 minutes'
  },
  {
    name: 'AQA Spanish Speaking Practice',
    description: 'Prepare for AQA Spanish speaking assessments with role-play scenarios and photo description exercises.',
    features: ['AQA role-plays', 'Photo descriptions', 'Conversation practice', 'Recording playback'],
    difficulty: 'Foundation & Higher',
    time: '20-25 minutes'
  },
  {
    name: 'AQA Spanish Listening Comprehension',
    description: 'Develop listening skills with AQA-style audio exercises featuring native Spanish speakers and exam-format questions.',
    features: ['Native audio', 'AQA question types', 'Transcript support', 'Replay options'],
    difficulty: 'Foundation & Higher',
    time: '15-20 minutes'
  }
];

const aqaThemes = [
  {
    theme: 'Theme 1: Identity and Culture',
    topics: ['Family and relationships', 'Technology in everyday life', 'Free-time activities', 'Customs and festivals'],
    vocabulary: '600+ words',
    skills: 'Speaking, Listening, Reading, Writing'
  },
  {
    theme: 'Theme 2: Local Area, Holiday and Travel',
    topics: ['Holiday destinations', 'Local area description', 'Transport', 'Accommodation'],
    vocabulary: '700+ words', 
    skills: 'Speaking, Listening, Reading, Writing'
  },
  {
    theme: 'Theme 3: School, Future Aspirations, Study and Work',
    topics: ['School life', 'Career choices', 'Jobs and employment', 'Further education'],
    vocabulary: '700+ words',
    skills: 'Speaking, Listening, Reading, Writing'
  }
];

const faqs = [
  {
    question: 'How does Language Gems align with AQA Spanish GCSE requirements?',
    answer: 'Our platform is specifically designed to match AQA Spanish GCSE specifications exactly. We cover all three required themes, include both Foundation and Higher tier vocabulary, and provide practice in all four assessment objectives: Listening, Speaking, Reading, and Writing.'
  },
  {
    question: 'What AQA Spanish GCSE grades can students achieve using Language Gems?',
    answer: 'Students using Language Gems regularly see improvements across all grade boundaries. Our adaptive system supports both Foundation tier (grades 1-5) and Higher tier (grades 4-9) students, with many achieving grades 7-9 through consistent practice.'
  },
  {
    question: 'Does Language Gems include AQA Spanish GCSE speaking practice?',
    answer: 'Yes! We provide comprehensive speaking practice including AQA-style role-plays, photo descriptions, and general conversation topics. Students can record themselves and receive feedback on pronunciation and fluency.'
  },
  {
    question: 'How much vocabulary do I need for AQA Spanish GCSE?',
    answer: 'AQA recommends approximately 1200 words for Foundation tier and 1700+ words for Higher tier. Language Gems provides over 2000 AQA-specific vocabulary items across all three themes, ensuring comprehensive coverage.'
  },
  {
    question: 'Can teachers track student progress for AQA Spanish GCSE preparation?',
    answer: 'Absolutely! Our teacher dashboard provides detailed analytics on student performance across all AQA themes and skills, helping teachers identify areas needing additional support and track progress toward grade targets.'
  }
];

export default function AQASpanishGCSEPage() {
  const organizationSchema = getOrganizationSchema();
  const courseSchema = getCourseSchema('AQA Spanish GCSE');
  const faqSchema = getFAQSchema(faqs);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'GCSE Learning', url: '/gcse-language-learning' },
    { name: 'AQA Spanish GCSE', url: '/aqa-spanish-gcse' }
  ];

  return (
    <SEOWrapper structuredData={[courseSchema, faqSchema]} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Master AQA Spanish GCSE with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> Interactive Games</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Achieve AQA Spanish GCSE success with curriculum-aligned vocabulary games, theme-based practice, 
                and comprehensive preparation for Foundation and Higher tiers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/games"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start AQA Spanish Games
                </Link>
                <Link
                  href="/schools/contact"
                  className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-orange-200"
                >
                  Book School Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AQA Themes Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Complete AQA Spanish GCSE Theme Coverage
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Master all three AQA Spanish GCSE themes with targeted vocabulary and skills practice
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {aqaThemes.map((theme, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{theme.theme}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Key Topics:</h4>
                      <ul className="text-slate-600 space-y-1">
                        {theme.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-600 font-semibold">{theme.vocabulary}</span>
                      <span className="text-slate-500">{theme.skills}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Choose Language Gems for AQA Spanish GCSE?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aqaSpanishFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <feature.icon className="h-12 w-12 text-orange-600 mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                AQA Spanish GCSE Games & Activities
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Engaging games designed specifically for AQA Spanish GCSE success
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aqaSpanishGames.map((game, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{game.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{game.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {game.features.map((feature, featureIndex) => (
                          <span key={featureIndex} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Difficulty: {game.difficulty}</span>
                      <span className="text-slate-500">Duration: {game.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                AQA Spanish GCSE Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Excel in AQA Spanish GCSE?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Join thousands of students already improving their AQA Spanish GCSE results with our interactive games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start AQA Spanish Games
              </Link>
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                Contact Sales Team
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SEOWrapper>
  );
}
