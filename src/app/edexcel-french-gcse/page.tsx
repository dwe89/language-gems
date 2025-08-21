import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Target, TrendingUp, Users, Award, Clock, CheckCircle, Star, FileText, Headphones } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getCourseSchema, getFAQSchema, getOrganizationSchema } from '../../lib/seo/structuredData';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Edexcel French GCSE Learning Games & Revision Platform | Language Gems',
  description: 'Master Edexcel French GCSE with interactive games, comprehensive vocabulary practice, and curriculum-aligned content. Perfect preparation for Edexcel French GCSE Foundation and Higher tiers.',
  keywords: [
    'Edexcel French GCSE',
    'Edexcel French GCSE games',
    'Edexcel French GCSE vocabulary',
    'Edexcel French GCSE revision',
    'Edexcel French GCSE preparation',
    'Edexcel French GCSE foundation',
    'Edexcel French GCSE higher',
    'Edexcel French GCSE topics',
    'Edexcel French GCSE speaking',
    'Edexcel French GCSE listening',
    'Edexcel French GCSE writing',
    'Edexcel French GCSE reading'
  ],
  canonical: '/edexcel-french-gcse',
  ogImage: '/images/edexcel-french-gcse-og.jpg',
});

const edexcelFrenchFeatures = [
  {
    icon: Target,
    title: 'Edexcel French GCSE Curriculum Aligned',
    description: 'All vocabulary and exercises match Edexcel French GCSE specifications exactly, covering all five topics and required grammatical structures for both Foundation and Higher tiers.'
  },
  {
    icon: BookOpen,
    title: 'Complete Edexcel Topic Coverage',
    description: 'Master all Edexcel French GCSE topics: Identity and Culture, Local Area Holiday and Travel, School, Future Aspirations Study and Work, International and Global Dimension - with 2000+ curriculum-specific words.'
  },
  {
    icon: TrendingUp,
    title: 'Foundation & Higher Tier Support',
    description: 'Adaptive learning system automatically adjusts difficulty between Foundation and Higher tier requirements, ensuring appropriate challenge levels for all students.'
  },
  {
    icon: Users,
    title: 'Edexcel Assessment Style Practice',
    description: 'Practice with Edexcel-style questions and assessment formats, including speaking, listening, reading, and writing tasks that mirror actual exam conditions.'
  },
  {
    icon: Award,
    title: 'Grade Tracking & Analytics',
    description: 'Monitor progress toward Edexcel French GCSE grade boundaries with detailed analytics showing strengths and areas for improvement across all skill areas.'
  },
  {
    icon: Clock,
    title: 'Exam Timing Practice',
    description: 'Build confidence with timed practice sessions that match Edexcel French GCSE exam durations and question formats for optimal exam preparation.'
  }
];

const edexcelFrenchGames = [
  {
    name: 'Edexcel French Vocabulary Mining',
    description: 'Mine French vocabulary gems using Edexcel-specific word lists, focusing on high-frequency terms from all five topics.',
    features: ['2000+ Edexcel words', 'Topic-based practice', 'Audio pronunciation', 'Progress tracking'],
    difficulty: 'Foundation & Higher',
    time: '10-15 minutes'
  },
  {
    name: 'Edexcel French Grammar Builder',
    description: 'Master Edexcel French grammar requirements through interactive sentence construction and verb conjugation challenges.',
    features: ['All Edexcel tenses', 'Subjunctive practice', 'Agreement rules', 'Instant feedback'],
    difficulty: 'Higher tier focus',
    time: '15-20 minutes'
  },
  {
    name: 'Edexcel French Speaking Practice',
    description: 'Prepare for Edexcel French speaking assessments with role-play scenarios and photo description exercises.',
    features: ['Edexcel role-plays', 'Photo descriptions', 'Conversation practice', 'Recording playback'],
    difficulty: 'Foundation & Higher',
    time: '20-25 minutes'
  },
  {
    name: 'Edexcel French Listening Comprehension',
    description: 'Develop listening skills with Edexcel-style audio exercises featuring native French speakers and exam-format questions.',
    features: ['Native audio', 'Edexcel question types', 'Transcript support', 'Replay options'],
    difficulty: 'Foundation & Higher',
    time: '15-20 minutes'
  }
];

const edexcelTopics = [
  {
    topic: 'Topic 1: Identity and Culture',
    subtopics: ['Family and relationships', 'Technology in everyday life', 'Free-time activities', 'Customs and festivals'],
    vocabulary: '500+ words',
    skills: 'Speaking, Listening, Reading, Writing'
  },
  {
    topic: 'Topic 2: Local Area, Holiday and Travel',
    subtopics: ['Holiday destinations', 'Local area description', 'Transport', 'Accommodation'],
    vocabulary: '500+ words', 
    skills: 'Speaking, Listening, Reading, Writing'
  },
  {
    topic: 'Topic 3: School',
    subtopics: ['School subjects', 'School facilities', 'School rules', 'School events'],
    vocabulary: '400+ words',
    skills: 'Speaking, Listening, Reading, Writing'
  },
  {
    topic: 'Topic 4: Future Aspirations, Study and Work',
    subtopics: ['Career choices', 'Jobs and employment', 'Further education', 'Work experience'],
    vocabulary: '400+ words',
    skills: 'Speaking, Listening, Reading, Writing'
  },
  {
    topic: 'Topic 5: International and Global Dimension',
    subtopics: ['Environmental issues', 'Poverty and homelessness', 'Healthy living', 'Social issues'],
    vocabulary: '200+ words',
    skills: 'Reading, Writing (Higher tier)'
  }
];

const faqs = [
  {
    question: 'How does Language Gems align with Edexcel French GCSE requirements?',
    answer: 'Our platform is specifically designed to match Edexcel French GCSE specifications exactly. We cover all five required topics, include both Foundation and Higher tier vocabulary, and provide practice in all four assessment objectives: Listening, Speaking, Reading, and Writing.'
  },
  {
    question: 'What Edexcel French GCSE grades can students achieve using Language Gems?',
    answer: 'Students using Language Gems regularly see improvements across all grade boundaries. Our adaptive system supports both Foundation tier (grades 1-5) and Higher tier (grades 4-9) students, with many achieving grades 7-9 through consistent practice.'
  },
  {
    question: 'Does Language Gems include Edexcel French GCSE speaking practice?',
    answer: 'Yes! We provide comprehensive speaking practice including Edexcel-style role-plays, photo descriptions, and general conversation topics. Students can record themselves and receive feedback on pronunciation and fluency.'
  },
  {
    question: 'How much vocabulary do I need for Edexcel French GCSE?',
    answer: 'Edexcel recommends approximately 1200 words for Foundation tier and 1700+ words for Higher tier. Language Gems provides over 2000 Edexcel-specific vocabulary items across all five topics, ensuring comprehensive coverage.'
  },
  {
    question: 'What is Topic 5 in Edexcel French GCSE?',
    answer: 'Topic 5: International and Global Dimension is unique to Edexcel and covers environmental issues, social problems, and global citizenship. It\'s primarily assessed in reading and writing for Higher tier students.'
  }
];

export default function EdexcelFrenchGCSEPage() {
  const organizationSchema = getOrganizationSchema();
  const courseSchema = getCourseSchema('Edexcel French GCSE');
  const faqSchema = getFAQSchema(faqs);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'GCSE Learning', url: '/gcse-language-learning' },
    { name: 'Edexcel French GCSE', url: '/edexcel-french-gcse' }
  ];

  return (
    <SEOWrapper structuredData={[courseSchema, faqSchema]} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Master Edexcel French GCSE with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600"> Interactive Games</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Achieve Edexcel French GCSE success with curriculum-aligned vocabulary games, topic-based practice, 
                and comprehensive preparation for Foundation and Higher tiers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/games"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Edexcel French Games
                </Link>
                <Link
                  href="/schools/contact"
                  className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-emerald-200"
                >
                  Book School Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Edexcel Topics Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Complete Edexcel French GCSE Topic Coverage
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Master all five Edexcel French GCSE topics with targeted vocabulary and skills practice
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {edexcelTopics.map((topic, index) => (
                <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{topic.topic}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Key Subtopics:</h4>
                      <ul className="text-slate-600 space-y-1">
                        {topic.subtopics.map((subtopic, subtopicIndex) => (
                          <li key={subtopicIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {subtopic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600 font-semibold">{topic.vocabulary}</span>
                      <span className="text-slate-500">{topic.skills}</span>
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
                Why Choose Language Gems for Edexcel French GCSE?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {edexcelFrenchFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <feature.icon className="h-12 w-12 text-emerald-600 mb-6" />
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
                Edexcel French GCSE Games & Activities
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Engaging games designed specifically for Edexcel French GCSE success
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {edexcelFrenchGames.map((game, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{game.name}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{game.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {game.features.map((feature, featureIndex) => (
                          <span key={featureIndex} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
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
                Edexcel French GCSE Frequently Asked Questions
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Excel in Edexcel French GCSE?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Join thousands of students already improving their Edexcel French GCSE results with our interactive games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Edexcel French Games
              </Link>
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-emerald-600 transition-all duration-200"
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
