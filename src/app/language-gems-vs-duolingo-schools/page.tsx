import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, X, Target, Users, BookOpen, TrendingUp, Award, Clock, AlertTriangle } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getFAQSchema } from '../../lib/seo/structuredData';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Language Gems vs. Duolingo for Schools: Which is Better for GCSE? (2024)',
  description: 'Comprehensive comparison of Language Gems and Duolingo for Schools. Discover why UK schools choose curriculum-aligned platforms over consumer apps for GCSE language learning.',
  keywords: [
    'Duolingo for schools',
    'Duolingo alternative schools',
    'GCSE language learning platform',
    'Language Gems vs Duolingo',
    'educational language software',
    'school language learning platform',
    'curriculum aligned language learning',
    'MFL teaching platform',
    'language learning classroom software',
    'UK school language platform'
  ],
  canonical: '/language-gems-vs-duolingo-schools',
  ogImage: '/images/language-gems-vs-duolingo-og.jpg',
});

const comparisonFeatures = [
  {
    category: 'Curriculum Alignment',
    languageGems: {
      feature: 'GCSE-Specific Content',
      description: 'All vocabulary and grammar aligned with AQA, Edexcel, OCR, and WJEC specifications',
      status: 'included',
      details: '2000+ GCSE words per language, exam board specific themes'
    },
    duolingo: {
      feature: 'Generic Language Learning',
      description: 'Consumer-focused content not aligned with UK curriculum requirements',
      status: 'limited',
      details: 'General vocabulary, no GCSE exam preparation'
    }
  },
  {
    category: 'Teacher Tools',
    languageGems: {
      feature: 'Comprehensive Teacher Dashboard',
      description: 'Detailed analytics, progress tracking, assignment creation, and class management',
      status: 'included',
      details: 'Real-time progress, vocabulary mastery tracking, detailed reports'
    },
    duolingo: {
      feature: 'Basic Teacher Overview',
      description: 'Limited classroom management with basic progress visibility',
      status: 'limited',
      details: 'Simple progress overview, limited customization'
    }
  },
  {
    category: 'Pricing Model',
    languageGems: {
      feature: 'Transparent School Pricing',
      description: 'Clear annual pricing with unlimited teachers and students',
      status: 'included',
      details: 'From £399/year, no per-student costs, no hidden fees'
    },
    duolingo: {
      feature: 'Individual Subscriptions',
      description: 'Per-student pricing model that scales expensively for schools',
      status: 'expensive',
      details: '£6.99/month per student, ads in free version'
    }
  },
  {
    category: 'Content Quality',
    languageGems: {
      feature: 'Professionally Curated',
      description: 'Content created by qualified MFL teachers and curriculum experts',
      status: 'included',
      details: 'Pedagogically sound, exam-focused, culturally accurate'
    },
    duolingo: {
      feature: 'Crowdsourced Content',
      description: 'Community-generated content with inconsistent quality control',
      status: 'limited',
      details: 'Variable quality, not education-focused'
    }
  },
  {
    category: 'Assessment Tools',
    languageGems: {
      feature: 'GCSE-Style Assessments',
      description: 'Practice tests and assessments matching exam formats and requirements',
      status: 'included',
      details: 'Exam-style questions, grade boundaries, progress tracking'
    },
    duolingo: {
      feature: 'Basic Skill Tests',
      description: 'Simple proficiency tests not aligned with UK exam requirements',
      status: 'limited',
      details: 'Generic tests, no GCSE preparation'
    }
  },
  {
    category: 'Offline Access',
    languageGems: {
      feature: 'Classroom-Optimized',
      description: 'Designed for reliable classroom use with offline capabilities',
      status: 'included',
      details: 'Works with school networks, offline mode available'
    },
    duolingo: {
      feature: 'Limited Offline',
      description: 'Basic offline access, requires premium subscription',
      status: 'limited',
      details: 'Premium feature only, limited functionality'
    }
  }
];

const faqs = [
  {
    question: 'Why should schools choose Language Gems over Duolingo for Schools?',
    answer: 'Language Gems is specifically designed for UK GCSE requirements with curriculum-aligned content, comprehensive teacher tools, and transparent school pricing. Unlike Duolingo, which is a consumer app adapted for schools, Language Gems was built from the ground up for educational use with proper teacher dashboards, assessment tools, and exam preparation features.'
  },
  {
    question: 'How does the pricing compare between Language Gems and Duolingo for Schools?',
    answer: 'Language Gems offers transparent annual school pricing starting from £399 with unlimited teachers and students. Duolingo for Schools requires individual subscriptions at £6.99/month per student, making it significantly more expensive for whole-school implementation. A school with 200 students would pay £16,776/year for Duolingo vs £699/year for Language Gems.'
  },
  {
    question: 'Does Duolingo for Schools provide GCSE-specific content?',
    answer: 'No, Duolingo for Schools uses the same consumer content as the regular Duolingo app, which is not aligned with UK GCSE curriculum requirements. Language Gems provides vocabulary and grammar specifically mapped to AQA, Edexcel, OCR, and WJEC specifications, ensuring students practice exactly what they need for their exams.'
  },
  {
    question: 'What teacher tools does Language Gems provide that Duolingo lacks?',
    answer: 'Language Gems offers comprehensive teacher dashboards with detailed analytics, assignment creation tools, progress tracking, vocabulary mastery reports, and class management features. Duolingo for Schools provides only basic progress overview with limited customization and no detailed analytics for informed teaching decisions.'
  },
  {
    question: 'Can both platforms be used offline in classrooms?',
    answer: 'Language Gems is designed for classroom use with reliable offline capabilities and works well with school network restrictions. Duolingo\'s offline features are limited and require premium subscriptions, making it less suitable for consistent classroom use where internet connectivity may be unreliable.'
  }
];

export default function LanguageGemsVsDuolingoPage() {
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/comparisons' },
    { name: 'Language Gems vs Duolingo', url: '/language-gems-vs-duolingo-schools' }
  ];

  return (
    <SEOWrapper structuredData={faqSchema} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Language Gems vs. 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Duolingo for Schools</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Comprehensive comparison for UK schools choosing between curriculum-aligned educational platforms 
                and consumer apps adapted for classroom use. Discover why GCSE-specific content matters.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/schools/pricing"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  See Language Gems Pricing
                </Link>
                <Link
                  href="/games"
                  className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-all duration-200"
                >
                  Try Our Games
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Comparison */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                At a Glance: Built for Education vs. Adapted for Schools
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                The fundamental difference between a platform designed for UK education and a consumer app adapted for classroom use
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Language Gems</h3>
                  <p className="text-green-600 font-semibold">Built for UK Education</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">GCSE curriculum-aligned content (AQA, Edexcel, OCR, WJEC)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">Comprehensive teacher dashboard with detailed analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">Transparent school pricing (£399-£699/year)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">GCSE-style assessments and exam preparation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">Professional content created by qualified MFL teachers</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-xl p-8 border-2 border-orange-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Duolingo for Schools</h3>
                  <p className="text-orange-600 font-semibold">Consumer App for Schools</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">Generic content not aligned with UK curriculum</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">Basic teacher overview with limited functionality</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">Expensive per-student pricing (£6.99/month each)</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">No GCSE-specific assessments or exam preparation</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                    <span className="text-slate-700">Crowdsourced content with variable quality</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Comparison */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Feature-by-Feature Comparison
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Detailed analysis of key features that matter most to UK schools and MFL teachers
              </p>
            </div>
            
            <div className="space-y-8">
              {comparisonFeatures.map((comparison, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">{comparison.category}</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                        <h4 className="text-lg font-bold text-slate-900">Language Gems</h4>
                      </div>
                      <h5 className="font-semibold text-green-700 mb-2">{comparison.languageGems.feature}</h5>
                      <p className="text-slate-700 mb-3">{comparison.languageGems.description}</p>
                      <p className="text-sm text-slate-600 italic">{comparison.languageGems.details}</p>
                    </div>
                    
                    <div className="border-2 border-orange-200 rounded-lg p-6 bg-orange-50">
                      <div className="flex items-center mb-4">
                        {comparison.duolingo.status === 'limited' ? (
                          <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
                        ) : (
                          <X className="h-6 w-6 text-red-500 mr-3" />
                        )}
                        <h4 className="text-lg font-bold text-slate-900">Duolingo for Schools</h4>
                      </div>
                      <h5 className="font-semibold text-orange-700 mb-2">{comparison.duolingo.feature}</h5>
                      <p className="text-slate-700 mb-3">{comparison.duolingo.description}</p>
                      <p className="text-sm text-slate-600 italic">{comparison.duolingo.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cost Analysis */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Total Cost of Ownership Analysis
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Real costs for schools implementing language learning platforms
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-slate-50 to-green-50 rounded-xl p-8 border border-green-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">School Size</h3>
                  <div className="space-y-2">
                    <p className="text-slate-700">Small (100 students)</p>
                    <p className="text-slate-700">Medium (300 students)</p>
                    <p className="text-slate-700">Large (500 students)</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-4">Language Gems</h3>
                  <div className="space-y-2">
                    <p className="text-green-600 font-bold">£399/year</p>
                    <p className="text-green-600 font-bold">£699/year</p>
                    <p className="text-green-600 font-bold">£699/year</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-orange-700 mb-4">Duolingo for Schools</h3>
                  <div className="space-y-2">
                    <p className="text-orange-600 font-bold">£8,388/year</p>
                    <p className="text-orange-600 font-bold">£25,164/year</p>
                    <p className="text-orange-600 font-bold">£41,940/year</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-lg text-slate-700">
                  <strong>Language Gems saves schools up to £41,000+ annually</strong> while providing superior educational features
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Choose the Right Platform for Your School?
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Experience the difference of a platform built specifically for UK GCSE requirements. 
              Try Language Gems risk-free and see why schools are making the switch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Book School Demo
              </Link>
              <Link
                href="/schools/pricing"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SEOWrapper>
  );
}
