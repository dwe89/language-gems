import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Target, TrendingUp, Users, Award, Clock, CheckCircle, Star } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getCourseSchema, getFAQSchema } from '../../lib/seo/structuredData';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'GCSE French Learning Games & Vocabulary Platform | Language Gems',
  description: 'Excel in GCSE French with interactive games, comprehensive vocabulary practice, and curriculum-aligned content. Perfect for AQA, Edexcel, OCR, and WJEC French GCSE preparation.',
  keywords: [
    'GCSE French learning',
    'GCSE French games',
    'GCSE French vocabulary',
    'French GCSE preparation',
    'interactive French games',
    'GCSE French revision',
    'French vocabulary practice',
    'AQA French GCSE',
    'Edexcel French GCSE',
    'OCR French GCSE',
    'WJEC French GCSE',
    'French learning platform'
  ],
  canonical: '/gcse-french-learning',
  ogImage: '/images/gcse-french-learning-og.jpg',
});

const frenchFeatures = [
  {
    icon: Target,
    title: 'GCSE French Curriculum Aligned',
    description: 'All vocabulary and exercises match AQA, Edexcel, OCR, and WJEC French GCSE specifications, covering all required themes and grammatical structures.'
  },
  {
    icon: BookOpen,
    title: 'Comprehensive French Vocabulary',
    description: 'Master 2000+ essential French words across all GCSE themes: family, school, work, environment, culture, and francophone countries.'
  },
  {
    icon: TrendingUp,
    title: 'Adaptive French Learning',
    description: 'AI-powered system adapts to your French learning pace, focusing on challenging areas like subjunctive mood and complex tenses.'
  },
  {
    icon: Users,
    title: 'Classroom French Integration',
    description: 'Teacher dashboards track French vocabulary mastery, pronunciation accuracy, and grammar comprehension across your classes.'
  },
  {
    icon: Award,
    title: 'Proven French GCSE Results',
    description: 'Students using our French games show 42% faster vocabulary retention and improved performance in oral assessments.'
  },
  {
    icon: Clock,
    title: 'Flexible French Practice',
    description: 'Practice French anytime with mobile-responsive games perfect for homework, revision, or quick grammar reinforcement.'
  }
];

const frenchGames = [
  {
    name: 'French Vocabulary Mining',
    description: 'Mine French vocabulary gems through spaced repetition, focusing on GCSE-specific words and idiomatic expressions.',
    features: ['2000+ GCSE words', 'Native pronunciation', 'Cultural context', 'Progress tracking'],
    difficulty: 'All levels',
    time: '10-15 minutes'
  },
  {
    name: 'French Grammar Builder',
    description: 'Master French grammar through interactive sentence construction and verb conjugation challenges.',
    features: ['All verb tenses', 'Subjunctive mood', 'Agreement rules', 'Real-time feedback'],
    difficulty: 'Intermediate+',
    time: '15-20 minutes'
  },
  {
    name: 'French Cultural Explorer',
    description: 'Explore French culture and francophone countries while learning vocabulary in authentic contexts.',
    features: ['Cultural content', 'Regional variations', 'Current affairs', 'Authentic materials'],
    difficulty: 'Intermediate+',
    time: '20-25 minutes'
  },
  {
    name: 'French Memory Match',
    description: 'Strengthen French vocabulary retention by matching words, images, and audio from native speakers.',
    features: ['Visual learning', 'Audio integration', 'Themed categories', 'Difficulty scaling'],
    difficulty: 'All levels',
    time: '5-10 minutes'
  }
];

const frenchThemes = [
  {
    theme: 'Identity and Culture',
    topics: ['Family relationships', 'Personal descriptions', 'French traditions', 'Francophone diversity'],
    vocabulary: '300+ words',
    examWeight: '25%'
  },
  {
    theme: 'Local Area, Holiday and Travel',
    topics: ['French regions', 'Holiday destinations', 'Transport systems', 'Accommodation types'],
    vocabulary: '350+ words',
    examWeight: '25%'
  },
  {
    theme: 'School and Future Plans',
    topics: ['French education system', 'Career aspirations', 'Higher education', 'Work experience'],
    vocabulary: '400+ words',
    examWeight: '25%'
  },
  {
    theme: 'Global Dimension',
    topics: ['Environmental issues', 'Social problems', 'Francophone countries', 'Current events'],
    vocabulary: '450+ words',
    examWeight: '25%'
  }
];

const faqs = [
  {
    question: 'How does Language Gems help with GCSE French specifically?',
    answer: 'Our platform is designed specifically for GCSE French requirements, covering all vocabulary themes, complex grammar structures, and cultural content required by AQA, Edexcel, OCR, and WJEC exam boards. Unlike general French apps, we focus exclusively on curriculum-aligned content with proper French cultural context.'
  },
  {
    question: 'Which French grammar topics are covered in the games?',
    answer: 'We cover all GCSE French grammar including verb tenses (present, perfect, imperfect, future, conditional, subjunctive), agreement rules, pronouns, and complex sentence structures. Our games specifically target the grammar points that students find most challenging in French GCSE exams.'
  },
  {
    question: 'Can teachers track French vocabulary and grammar progress?',
    answer: 'Yes! Our teacher dashboard provides detailed analytics on French vocabulary mastery and grammar accuracy, showing which themes students struggle with, pronunciation improvement, and time spent practicing. Perfect for identifying students who need extra French support.'
  },
  {
    question: 'How much French vocabulary is included?',
    answer: 'We include over 2000 GCSE French words and phrases, organized by the four main themes. All vocabulary is sourced from official GCSE specifications and includes audio pronunciation by native French speakers from different francophone regions.'
  },
  {
    question: 'Is this suitable for all French GCSE exam boards?',
    answer: 'Absolutely! Our content covers AQA, Edexcel, OCR, and WJEC French GCSE requirements. We regularly update our vocabulary lists and cultural content to ensure alignment with the latest specifications from all major exam boards.'
  }
];

export default function GCSEFrenchLearningPage() {
  const courseSchema = getCourseSchema('French');
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'GCSE Learning', url: '/gcse-language-learning' },
    { name: 'French GCSE', url: '/gcse-french-learning' }
  ];

  return (
    <SEOWrapper structuredData={[courseSchema, faqSchema]} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Master GCSE French with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Interactive Games</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Achieve French GCSE success with curriculum-aligned vocabulary games, grammar practice, 
                and comprehensive cultural content. Trusted by UK schools for AQA, Edexcel, OCR, and WJEC preparation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/games/vocabulary-mining"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start French Games
                </Link>
                <Link
                  href="/schools/pricing"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200"
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
                Why Choose Language Gems for GCSE French?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Specifically designed for UK French GCSE requirements, with authentic cultural content and native pronunciation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {frenchFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
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

        {/* French Games Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                French GCSE Games Collection
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Interactive games designed specifically for French vocabulary, grammar, and cultural learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {frenchGames.map((game, index) => (
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
                        <span key={featureIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
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
                GCSE French Themes Coverage
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Complete coverage of all four GCSE French themes with comprehensive vocabulary and cultural content
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {frenchThemes.map((theme, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{theme.theme}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                French GCSE Questions Answered
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Excel in GCSE French?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of students already improving their French GCSE results with our interactive games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start French Games
              </Link>
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200"
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
