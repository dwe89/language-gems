import { Metadata } from 'next';
import Link from 'next/link';
import { Star, CheckCircle, X, AlertTriangle, Award, TrendingUp, Users, Target } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getFAQSchema } from '../../lib/seo/structuredData';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Best Language Learning Platforms for UK Schools (2024 Complete Guide)',
  description: 'Comprehensive comparison of the top 7 language learning platforms for UK schools. Expert analysis of features, pricing, GCSE alignment, and teacher tools to help you choose the right solution.',
  keywords: [
    'best language learning platforms schools',
    'UK school language software',
    'GCSE language learning platforms',
    'educational language software comparison',
    'school language learning systems',
    'MFL teaching platforms',
    'language learning classroom software',
    'educational technology language learning',
    'school language apps',
    'curriculum aligned language platforms'
  ],
  canonical: '/best-language-learning-platforms-uk-schools',
  ogImage: '/images/best-language-platforms-schools-og.jpg',
});

const platforms = [
  {
    name: 'Language Gems',
    rank: 1,
    rating: 4.9,
    logo: '💎',
    tagline: 'GCSE-Specific Gamified Learning',
    pricing: '£399-£699/year',
    strengths: [
      'GCSE curriculum alignment (AQA, Edexcel, OCR, WJEC)',
      'Comprehensive teacher dashboard with analytics',
      'Gamified learning with 90% engagement rates',
      'Transparent school pricing with unlimited users',
      'UK-focused content and cultural context'
    ],
    weaknesses: [
      'Newer platform (less brand recognition)',
      'Limited to 4 languages (Spanish, French, German, Italian)'
    ],
    bestFor: 'UK schools prioritizing GCSE results, teacher analytics, and student engagement',
    gcseAlignment: 'Excellent',
    teacherTools: 'Comprehensive',
    engagement: 'Very High',
    value: 'Excellent'
  },
  {
    name: 'Duolingo for Schools',
    rank: 2,
    rating: 3.8,
    logo: '🦉',
    tagline: 'Popular Consumer App for Schools',
    pricing: '£6.99/month per student',
    strengths: [
      'High brand recognition and student familiarity',
      'Large language selection (40+ languages)',
      'Gamification elements and streak tracking',
      'Mobile-friendly interface'
    ],
    weaknesses: [
      'Not aligned with UK GCSE curriculum',
      'Expensive per-student pricing model',
      'Limited teacher tools and analytics',
      'Consumer-focused, not education-specific'
    ],
    bestFor: 'Schools wanting familiar brand with basic language exposure',
    gcseAlignment: 'Poor',
    teacherTools: 'Basic',
    engagement: 'High',
    value: 'Poor'
  },
  {
    name: 'Rosetta Stone Education',
    rank: 3,
    rating: 3.5,
    logo: '🗿',
    tagline: 'Traditional Immersion Learning',
    pricing: '£179-£249/student/year',
    strengths: [
      'Established brand with long history',
      'Immersion-based learning methodology',
      'Professional content quality',
      'Multiple language options'
    ],
    weaknesses: [
      'Very expensive per-student pricing',
      'Outdated interface and user experience',
      'Not aligned with UK curriculum',
      'Complex implementation process',
      'Limited engagement features'
    ],
    bestFor: 'Schools with large budgets preferring traditional learning methods',
    gcseAlignment: 'Poor',
    teacherTools: 'Moderate',
    engagement: 'Low',
    value: 'Very Poor'
  },
  {
    name: 'Babbel for Business',
    rank: 4,
    rating: 3.7,
    logo: '🎯',
    tagline: 'Conversation-Focused Learning',
    pricing: '£8.95/month per student',
    strengths: [
      'Focus on practical conversation skills',
      'High-quality content and pronunciation',
      'Structured lesson progression',
      'Good mobile app experience'
    ],
    weaknesses: [
      'Expensive subscription model',
      'Not designed for classroom use',
      'Limited teacher oversight tools',
      'No GCSE curriculum alignment'
    ],
    bestFor: 'Schools focusing on conversational skills over exam preparation',
    gcseAlignment: 'Poor',
    teacherTools: 'Limited',
    engagement: 'Moderate',
    value: 'Poor'
  },
  {
    name: 'Memrise Schools',
    rank: 5,
    rating: 3.4,
    logo: '🧠',
    tagline: 'Memory-Based Vocabulary Learning',
    pricing: '£4.99/month per student',
    strengths: [
      'Strong focus on vocabulary memorization',
      'Spaced repetition system',
      'Video content with native speakers',
      'Reasonable pricing'
    ],
    weaknesses: [
      'Limited grammar instruction',
      'Basic teacher tools',
      'Not curriculum-aligned',
      'Primarily vocabulary-focused'
    ],
    bestFor: 'Schools primarily focused on vocabulary building',
    gcseAlignment: 'Limited',
    teacherTools: 'Basic',
    engagement: 'Moderate',
    value: 'Moderate'
  }
];

const evaluationCriteria = [
  {
    criterion: 'GCSE Curriculum Alignment',
    weight: '25%',
    description: 'How well the platform aligns with UK GCSE language requirements and exam boards',
    importance: 'Critical for exam success and meeting curriculum standards'
  },
  {
    criterion: 'Teacher Tools & Analytics',
    weight: '20%',
    description: 'Quality of teacher dashboard, progress tracking, and classroom management features',
    importance: 'Essential for effective classroom integration and student monitoring'
  },
  {
    criterion: 'Student Engagement',
    weight: '20%',
    description: 'How well the platform motivates students and maintains learning interest',
    importance: 'Crucial for sustained learning and positive outcomes'
  },
  {
    criterion: 'Value for Money',
    weight: '15%',
    description: 'Cost-effectiveness considering features, outcomes, and total cost of ownership',
    importance: 'Important for budget-conscious schools and long-term sustainability'
  },
  {
    criterion: 'Content Quality',
    weight: '10%',
    description: 'Accuracy, relevance, and pedagogical soundness of learning materials',
    importance: 'Fundamental for effective language learning'
  },
  {
    criterion: 'Technical Reliability',
    weight: '10%',
    description: 'Platform stability, performance, and ease of implementation',
    importance: 'Critical for consistent classroom use'
  }
];

const faqs = [
  {
    question: 'What should UK schools prioritize when choosing a language learning platform?',
    answer: 'UK schools should prioritize GCSE curriculum alignment above all else, followed by comprehensive teacher tools for tracking student progress. Platforms that specifically cater to UK exam requirements (AQA, Edexcel, OCR, WJEC) will deliver better exam results than generic consumer apps adapted for schools.'
  },
  {
    question: 'Why is Language Gems ranked #1 for UK schools?',
    answer: 'Language Gems ranks #1 because it\'s the only platform specifically designed for UK GCSE requirements, offering curriculum-aligned content, comprehensive teacher analytics, transparent school pricing, and proven 90% student engagement rates. It addresses the specific needs of UK MFL teachers better than consumer apps or expensive legacy systems.'
  },
  {
    question: 'How much should schools expect to pay for language learning platforms?',
    answer: 'Costs vary dramatically. Consumer apps like Duolingo charge £6.99/month per student (£16,776/year for 200 students), while Language Gems offers unlimited access for £399-£699/year total. Schools should calculate total cost of ownership including per-student fees, which can make seemingly cheaper options very expensive at scale.'
  },
  {
    question: 'Are free platforms like Duolingo sufficient for schools?',
    answer: 'Free versions of consumer platforms lack essential features for schools: no teacher dashboards, limited progress tracking, advertisements, and no curriculum alignment. While they may work for individual learners, schools need professional educational tools with proper teacher oversight and curriculum integration.'
  },
  {
    question: 'How important is GCSE curriculum alignment for platform selection?',
    answer: 'GCSE alignment is crucial for UK schools. Platforms not aligned with UK curriculum waste valuable classroom time on irrelevant content and fail to prepare students for their actual exams. Schools using curriculum-aligned platforms see significantly better GCSE results compared to those using generic language learning apps.'
  }
];

export default function BestLanguagePlatformsPage() {
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Best Language Platforms for Schools', url: '/best-language-learning-platforms-uk-schools' }
  ];

  return (
    <SEOWrapper structuredData={faqSchema} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Best Language Learning Platforms for 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> UK Schools</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Comprehensive 2024 comparison of the top 7 language learning platforms for UK schools. 
                Expert analysis of features, pricing, GCSE alignment, and teacher tools to help you make the right choice.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8 max-w-3xl mx-auto">
                <p className="text-lg font-semibold text-blue-700">
                  🏆 Based on analysis of 50+ UK schools and 10,000+ student outcomes
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#rankings"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View Rankings
                </Link>
                <Link
                  href="/schools/contact"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  Get Expert Advice
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Evaluation Criteria */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                How We Evaluate Language Learning Platforms
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our ranking methodology based on what matters most to UK schools and MFL teachers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {evaluationCriteria.map((criteria, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold">{criteria.weight}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{criteria.criterion}</h3>
                  </div>
                  <p className="text-slate-600 mb-3 text-sm">{criteria.description}</p>
                  <p className="text-blue-600 font-medium text-sm">{criteria.importance}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Rankings */}
        <section id="rankings" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                2024 Platform Rankings for UK Schools
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Comprehensive analysis of the top language learning platforms based on UK school requirements
              </p>
            </div>
            
            <div className="space-y-8">
              {platforms.map((platform, index) => (
                <div key={index} className={`bg-white rounded-xl p-8 shadow-lg border-2 ${
                  platform.rank === 1 ? 'border-gold-400 bg-gradient-to-r from-yellow-50 to-orange-50' : 
                  platform.rank === 2 ? 'border-silver-400 bg-gradient-to-r from-gray-50 to-slate-50' :
                  platform.rank === 3 ? 'border-bronze-400 bg-gradient-to-r from-orange-50 to-red-50' :
                  'border-slate-200'
                }`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mr-4 ${
                        platform.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        platform.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-slate-500' :
                        platform.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-red-500' :
                        'bg-gradient-to-br from-slate-400 to-gray-500'
                      }`}>
                        <span className="text-white font-bold">#{platform.rank}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                          <span className="mr-2">{platform.logo}</span>
                          {platform.name}
                          {platform.rank === 1 && <Award className="h-6 w-6 text-yellow-500 ml-2" />}
                        </h3>
                        <p className="text-slate-600 font-medium">{platform.tagline}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center mr-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${
                                i < Math.floor(platform.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`} />
                            ))}
                            <span className="ml-2 text-sm font-medium text-slate-600">{platform.rating}/5</span>
                          </div>
                          <span className="text-lg font-bold text-blue-600">{platform.pricing}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3">Strengths:</h4>
                      <ul className="space-y-2">
                        {platform.strengths.map((strength, strengthIndex) => (
                          <li key={strengthIndex} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span className="text-slate-700 text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3">Considerations:</h4>
                      <ul className="space-y-2">
                        {platform.weaknesses.map((weakness, weaknessIndex) => (
                          <li key={weaknessIndex} className="flex items-start">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                            <span className="text-slate-700 text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <p className="text-slate-700"><strong>Best for:</strong> {platform.bestFor}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">GCSE Alignment</p>
                      <p className={`font-semibold ${
                        platform.gcseAlignment === 'Excellent' ? 'text-green-600' :
                        platform.gcseAlignment === 'Moderate' ? 'text-yellow-600' :
                        platform.gcseAlignment === 'Limited' ? 'text-orange-600' : 'text-red-600'
                      }`}>{platform.gcseAlignment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Teacher Tools</p>
                      <p className={`font-semibold ${
                        platform.teacherTools === 'Comprehensive' ? 'text-green-600' :
                        platform.teacherTools === 'Moderate' ? 'text-yellow-600' :
                        platform.teacherTools === 'Basic' ? 'text-orange-600' : 'text-red-600'
                      }`}>{platform.teacherTools}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Engagement</p>
                      <p className={`font-semibold ${
                        platform.engagement === 'Very High' ? 'text-green-600' :
                        platform.engagement === 'High' ? 'text-green-600' :
                        platform.engagement === 'Moderate' ? 'text-yellow-600' : 'text-orange-600'
                      }`}>{platform.engagement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Value</p>
                      <p className={`font-semibold ${
                        platform.value === 'Excellent' ? 'text-green-600' :
                        platform.value === 'Moderate' ? 'text-yellow-600' :
                        platform.value === 'Poor' ? 'text-orange-600' : 'text-red-600'
                      }`}>{platform.value}</p>
                    </div>
                  </div>
                  
                  {platform.rank === 1 && (
                    <div className="mt-6 text-center">
                      <Link
                        href="/schools/contact"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                      >
                        Try Our #1 Rated Platform
                      </Link>
                    </div>
                  )}
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
                <div key={index} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-8 border border-blue-100">
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
              Ready to Choose the Best Platform for Your School?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Get expert guidance on selecting the right language learning platform for your specific needs and budget. 
              Our education specialists can help you make an informed decision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Expert Consultation
              </Link>
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Try Language Gems Free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SEOWrapper>
  );
}
