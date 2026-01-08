import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Target, TrendingUp, Users, Award, Clock, CheckCircle, Star } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getCourseSchema, getFAQSchema, getOrganizationSchema } from '../../lib/seo/structuredData';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'GCSE Spanish Learning Games & Vocabulary Platform | Language Gems',
  description: 'Master GCSE Spanish with interactive games, comprehensive vocabulary practice, and curriculum-aligned content. Perfect for AQA, Edexcel, OCR, and WJEC Spanish GCSE preparation.',
  keywords: [
    'GCSE Spanish learning',
    'GCSE Spanish games',
    'GCSE Spanish vocabulary',
    'Spanish GCSE preparation',
    'interactive Spanish games',
    'GCSE Spanish revision',
    'Spanish vocabulary practice',
    'AQA Spanish GCSE',
    'Edexcel Spanish GCSE',
    'OCR Spanish GCSE',
    'WJEC Spanish GCSE',
    'Spanish learning platform'
  ],
  canonical: '/gcse-spanish-learning',
  ogImage: '/images/gcse-spanish-learning-og.jpg',
});

const spanishFeatures = [
  {
    icon: Target,
    title: 'GCSE Spanish Curriculum Aligned',
    description: 'All vocabulary and exercises match AQA, Edexcel, OCR, and WJEC Spanish GCSE specifications, covering all required themes and topics.'
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Vocabulary Coverage',
    description: 'Master 2000+ essential Spanish words across all GCSE themes: family, school, work, environment, culture, and current affairs.'
  },
  {
    icon: TrendingUp,
    title: 'Adaptive Spanish Learning',
    description: 'AI-powered system adapts to your Spanish learning pace, focusing on weak areas like verb conjugations and gender agreements.'
  },
  {
    icon: Users,
    title: 'Classroom Spanish Integration',
    description: 'Teacher dashboards track Spanish vocabulary mastery, conjugation accuracy, and speaking confidence across your classes.'
  },
  {
    icon: Award,
    title: 'Proven Spanish GCSE Results',
    description: 'Students using our Spanish games show 45% faster vocabulary retention and improved performance in speaking assessments.'
  },
  {
    icon: Clock,
    title: 'Flexible Spanish Practice',
    description: 'Practice Spanish anytime with mobile-responsive games perfect for homework, revision, or quick vocabulary reinforcement.'
  }
];

const spanishGames = [
  {
    name: 'Spanish Vocabulary Mining',
    description: 'Mine Spanish vocabulary gems through spaced repetition, focusing on GCSE-specific words and phrases.',
    features: ['2000+ GCSE words', 'Audio pronunciation', 'Contextual examples', 'Progress tracking'],
    difficulty: 'All levels',
    time: '10-15 minutes'
  },
  {
    name: 'Spanish Conjugation Duel',
    description: 'Master Spanish verb conjugations through competitive battles covering all tenses and moods.',
    features: ['All verb tenses', 'Irregular verbs', 'Subjunctive mood', 'Real-time feedback'],
    difficulty: 'Intermediate+',
    time: '15-20 minutes'
  },
  {
    name: 'Spanish Detective Listening',
    description: 'Develop Spanish listening skills through immersive detective scenarios with native speakers.',
    features: ['Native audio', 'Context clues', 'Comprehension tasks', 'Cultural content'],
    difficulty: 'Intermediate+',
    time: '20-25 minutes'
  },
  {
    name: 'Spanish Memory Match',
    description: 'Strengthen Spanish vocabulary retention by matching words, images, and audio clips.',
    features: ['Visual learning', 'Audio integration', 'Themed categories', 'Difficulty scaling'],
    difficulty: 'All levels',
    time: '5-10 minutes'
  }
];

const spanishThemes = [
  {
    theme: 'Identity and Culture',
    topics: ['Family relationships', 'Personal descriptions', 'Spanish traditions', 'Regional differences'],
    vocabulary: '300+ words',
    examWeight: '25%'
  },
  {
    theme: 'Local Area, Holiday and Travel',
    topics: ['Spanish cities', 'Holiday destinations', 'Transport', 'Accommodation'],
    vocabulary: '350+ words',
    examWeight: '25%'
  },
  {
    theme: 'School and Future Plans',
    topics: ['Spanish education system', 'Career aspirations', 'University plans', 'Work experience'],
    vocabulary: '400+ words',
    examWeight: '25%'
  },
  {
    theme: 'Global Dimension',
    topics: ['Environment', 'Social issues', 'Spanish-speaking countries', 'Current affairs'],
    vocabulary: '450+ words',
    examWeight: '25%'
  }
];

const faqs = [
  {
    question: 'How does Language Gems help with GCSE Spanish specifically?',
    answer: 'Our platform is designed specifically for GCSE Spanish requirements, covering all vocabulary themes, verb conjugations, and cultural content required by AQA, Edexcel, OCR, and WJEC exam boards. Unlike general Spanish apps, we focus exclusively on curriculum-aligned content.'
  },
  {
    question: 'Which Spanish verb tenses are covered in the games?',
    answer: 'We cover all GCSE Spanish verb tenses including present, preterite, imperfect, future, conditional, present subjunctive, and perfect tenses. Our Conjugation Duel game specifically targets the irregular verbs that students find most challenging.'
  },
  {
    question: 'Can teachers track Spanish vocabulary progress?',
    answer: 'Yes! Our teacher dashboard provides detailed analytics on Spanish vocabulary mastery, showing which themes students struggle with, conjugation accuracy rates, and time spent practicing. Perfect for identifying students who need extra Spanish support.'
  },
  {
    question: 'How much Spanish vocabulary is included?',
    answer: 'We include over 2000 GCSE Spanish words and phrases, organized by the four main themes. All vocabulary is sourced from official GCSE specifications and includes audio pronunciation by native Spanish speakers.'
  },
  {
    question: 'Is this suitable for all Spanish GCSE exam boards?',
    answer: 'Absolutely! Our content covers AQA, Edexcel, OCR, and WJEC Spanish GCSE requirements. We regularly update our vocabulary lists to ensure alignment with the latest specifications from all major exam boards.'
  }
];

export default function GCSESpanishLearningPage() {
  const courseSchema = getCourseSchema('Spanish');
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'GCSE Learning', url: '/gcse-language-learning' },
    { name: 'Spanish GCSE', url: '/gcse-spanish-learning' }
  ];

  return (
    <SEOWrapper structuredData={[courseSchema, faqSchema]} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Master GCSE Spanish with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> Interactive Games</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Achieve Spanish GCSE success with curriculum-aligned vocabulary games, verb conjugation practice, 
                and comprehensive teacher analytics. Trusted by UK schools for AQA, Edexcel, OCR, and WJEC preparation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/activities/vocabulary-mining"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Spanish Games
                </Link>
                <Link
                  href="/schools/pricing"
                  className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-all duration-200"
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
                Why Choose Language Gems for GCSE Spanish?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Specifically designed for UK Spanish GCSE requirements, not adapted from general Spanish learning apps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spanishFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-xl p-8 border border-orange-100 hover:border-orange-200 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-6">
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

        {/* Spanish Games Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Spanish GCSE Games Collection
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Interactive games designed specifically for Spanish vocabulary, grammar, and cultural learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {spanishGames.map((game, index) => (
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
                        <span key={featureIndex} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
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
                GCSE Spanish Themes Coverage
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Complete coverage of all four GCSE Spanish themes with comprehensive vocabulary and cultural content
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {spanishThemes.map((theme, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-xl p-8 border border-orange-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{theme.theme}</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Spanish GCSE Questions Answered
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
              Ready to Excel in GCSE Spanish?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Join thousands of students already improving their Spanish GCSE results with our interactive games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Spanish Games
              </Link>
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-orange-600 transition-all duration-200"
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
