import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Target, TrendingUp, Users, Award, Clock, CheckCircle, Star } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getCourseSchema, getFAQSchema } from '../../lib/seo/structuredData';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'GCSE German Learning Games & Vocabulary Platform | Language Gems',
  description: 'Master GCSE German with interactive games, comprehensive vocabulary practice, and curriculum-aligned content. Perfect for AQA, Edexcel, and OCR German GCSE preparation.',
  keywords: [
    'GCSE German learning',
    'GCSE German games',
    'GCSE German vocabulary',
    'German GCSE preparation',
    'interactive German games',
    'GCSE German revision',
    'German vocabulary practice',
    'AQA German GCSE',
    'Edexcel German GCSE',
    'OCR German GCSE',
    'German learning platform',
    'German grammar games'
  ],
  canonical: '/gcse-german-learning',
  ogImage: '/images/gcse-german-learning-og.jpg',
});

const germanFeatures = [
  {
    icon: Target,
    title: 'GCSE German Curriculum Aligned',
    description: 'All vocabulary and exercises match AQA, Edexcel, and OCR German GCSE specifications, covering all required themes and complex grammatical structures.'
  },
  {
    icon: BookOpen,
    title: 'Comprehensive German Vocabulary',
    description: 'Master 2000+ essential German words across all GCSE themes: family, school, work, environment, culture, and German-speaking countries.'
  },
  {
    icon: TrendingUp,
    title: 'Adaptive German Learning',
    description: 'AI-powered system adapts to your German learning pace, focusing on challenging areas like case system, word order, and separable verbs.'
  },
  {
    icon: Users,
    title: 'Classroom German Integration',
    description: 'Teacher dashboards track German vocabulary mastery, case accuracy, and pronunciation improvement across your classes.'
  },
  {
    icon: Award,
    title: 'Proven German GCSE Results',
    description: 'Students using our German games show 38% faster vocabulary retention and improved performance in grammar assessments.'
  },
  {
    icon: Clock,
    title: 'Flexible German Practice',
    description: 'Practice German anytime with mobile-responsive games perfect for homework, revision, or quick case system reinforcement.'
  }
];

const germanGames = [
  {
    name: 'German Vocabulary Mining',
    description: 'Mine German vocabulary gems through spaced repetition, focusing on GCSE-specific words and compound nouns.',
    features: ['2000+ GCSE words', 'Native pronunciation', 'Case examples', 'Progress tracking'],
    difficulty: 'All levels',
    time: '10-15 minutes'
  },
  {
    name: 'German Case Master',
    description: 'Master German cases (Nominativ, Akkusativ, Dativ, Genitiv) through interactive exercises and real-world examples.',
    features: ['All four cases', 'Article practice', 'Preposition rules', 'Real-time feedback'],
    difficulty: 'Intermediate+',
    time: '15-20 minutes'
  },
  {
    name: 'German Culture Quest',
    description: 'Explore German culture and German-speaking countries while learning vocabulary in authentic contexts.',
    features: ['Cultural content', 'Regional differences', 'Current affairs', 'Authentic materials'],
    difficulty: 'Intermediate+',
    time: '20-25 minutes'
  },
  {
    name: 'German Memory Match',
    description: 'Strengthen German vocabulary retention by matching words, images, and audio from native speakers.',
    features: ['Visual learning', 'Audio integration', 'Themed categories', 'Difficulty scaling'],
    difficulty: 'All levels',
    time: '5-10 minutes'
  }
];

const germanThemes = [
  {
    theme: 'Identity and Culture',
    topics: ['Family relationships', 'Personal descriptions', 'German traditions', 'Regional diversity'],
    vocabulary: '300+ words',
    examWeight: '25%'
  },
  {
    theme: 'Local Area, Holiday and Travel',
    topics: ['German cities', 'Holiday destinations', 'Transport systems', 'Accommodation types'],
    vocabulary: '350+ words',
    examWeight: '25%'
  },
  {
    theme: 'School and Future Plans',
    topics: ['German education system', 'Career aspirations', 'University plans', 'Apprenticeships'],
    vocabulary: '400+ words',
    examWeight: '25%'
  },
  {
    theme: 'Global Dimension',
    topics: ['Environmental issues', 'Social problems', 'German-speaking countries', 'Current events'],
    vocabulary: '450+ words',
    examWeight: '25%'
  }
];

const faqs = [
  {
    question: 'How does Language Gems help with GCSE German specifically?',
    answer: 'Our platform is designed specifically for GCSE German requirements, covering all vocabulary themes, complex grammar structures (including the case system), and cultural content required by AQA, Edexcel, and OCR exam boards. Unlike general German apps, we focus exclusively on curriculum-aligned content with proper German cultural context.'
  },
  {
    question: 'Which German grammar topics are covered in the games?',
    answer: 'We cover all GCSE German grammar including the four cases (Nominativ, Akkusativ, Dativ, Genitiv), verb conjugations, word order, separable verbs, modal verbs, and complex sentence structures. Our games specifically target the grammar points that students find most challenging in German GCSE exams.'
  },
  {
    question: 'Can teachers track German vocabulary and grammar progress?',
    answer: 'Yes! Our teacher dashboard provides detailed analytics on German vocabulary mastery and grammar accuracy, showing which themes students struggle with, case system understanding, and time spent practicing. Perfect for identifying students who need extra German support.'
  },
  {
    question: 'How much German vocabulary is included?',
    answer: 'We include over 2000 GCSE German words and phrases, organized by the four main themes. All vocabulary is sourced from official GCSE specifications and includes audio pronunciation by native German speakers from different German-speaking regions.'
  },
  {
    question: 'Is this suitable for all German GCSE exam boards?',
    answer: 'Absolutely! Our content covers AQA, Edexcel, and OCR German GCSE requirements. We regularly update our vocabulary lists and cultural content to ensure alignment with the latest specifications from all major exam boards offering German GCSE.'
  }
];

export default function GCSEGermanLearningPage() {
  const courseSchema = getCourseSchema('German');
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'GCSE Learning', url: '/gcse-language-learning' },
    { name: 'German GCSE', url: '/gcse-german-learning' }
  ];

  return (
    <SEOWrapper structuredData={[courseSchema, faqSchema]} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-red-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Master GCSE German with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600"> Interactive Games</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Achieve German GCSE success with curriculum-aligned vocabulary games, case system practice, 
                and comprehensive cultural content. Trusted by UK schools for AQA, Edexcel, and OCR preparation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/activities/vocabulary-mining"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start German Games
                </Link>
                <Link
                  href="/schools/pricing"
                  className="inline-flex items-center px-8 py-4 bg-white text-yellow-600 font-semibold rounded-lg border-2 border-yellow-600 hover:bg-yellow-50 transition-all duration-200"
                >
                  School Pricing
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
                Why Choose Language Gems for GCSE German?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Specifically designed for UK German GCSE requirements, with focus on complex grammar and cultural understanding.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {germanFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-yellow-50 rounded-xl p-8 border border-yellow-100 hover:border-yellow-200 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-600 rounded-lg flex items-center justify-center mb-6">
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

        {/* German Games Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 to-red-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                German GCSE Games Collection
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Interactive games designed specifically for German vocabulary, grammar, and cultural learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {germanGames.map((game, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{game.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{game.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Difficulty:</span>
                      <span className="text-slate-700 font-medium">{game.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Session Time:</span>
                      <span className="text-slate-700 font-medium">{game.time}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {game.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GCSE Themes Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                GCSE German Themes Coverage
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Complete coverage of all four GCSE German themes with comprehensive vocabulary and cultural content
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {germanThemes.map((theme, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-yellow-50 rounded-xl p-8 border border-yellow-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{theme.theme}</h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      {theme.examWeight}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-4">{theme.vocabulary}</p>
                  <div className="space-y-2">
                    {theme.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-slate-700 text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 to-red-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                German GCSE Questions Answered
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-600 to-red-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Excel in GCSE German?
            </h2>
            <p className="text-xl text-yellow-100 mb-8 leading-relaxed">
              Join thousands of students already improving their German GCSE results with our interactive games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-white text-yellow-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start German Games
              </Link>
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-yellow-600 transition-all duration-200"
              >
                Book School Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SEOWrapper>
  );
}
