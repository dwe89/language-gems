import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, X, Smartphone, Monitor, Clock, TrendingUp, Award, Users, AlertTriangle } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getFAQSchema } from '../../lib/seo/structuredData';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Why Schools Choose Language Gems Over Rosetta Stone (2024 Comparison)',
  description: 'Discover why UK schools are switching from Rosetta Stone to Language Gems. Compare modern gamified learning vs traditional methods, pricing, and GCSE curriculum alignment.',
  keywords: [
    'Rosetta Stone alternative',
    'school language software',
    'modern language learning platform',
    'Language Gems vs Rosetta Stone',
    'GCSE language learning software',
    'educational language platform',
    'language learning classroom software',
    'MFL teaching platform',
    'interactive language learning',
    'gamified language education'
  ],
  canonical: '/language-gems-vs-rosetta-stone-schools',
  ogImage: '/images/language-gems-vs-rosetta-stone-og.jpg',
});

const modernVsTraditional = [
  {
    aspect: 'Learning Approach',
    languageGems: {
      title: 'Gamified Interactive Learning',
      description: 'Engaging games and activities that make vocabulary learning enjoyable and memorable',
      icon: Smartphone,
      benefits: ['90% higher engagement', 'Reduced learning anxiety', 'Peer collaboration features']
    },
    rosettaStone: {
      title: 'Traditional Immersion Method',
      description: 'Picture-based learning without translation, following older pedagogical approaches',
      icon: Monitor,
      limitations: ['Can be frustrating for beginners', 'Limited engagement features', 'Outdated interface']
    }
  },
  {
    aspect: 'Technology & UX',
    languageGems: {
      title: 'Modern, Intuitive Design',
      description: 'Contemporary interface designed for digital natives with mobile-responsive features',
      icon: Smartphone,
      benefits: ['Mobile-first design', 'Intuitive navigation', 'Fast loading times']
    },
    rosettaStone: {
      title: 'Legacy Interface',
      description: 'Older design patterns that feel outdated compared to modern educational technology',
      icon: Monitor,
      limitations: ['Dated user interface', 'Slower performance', 'Limited mobile optimization']
    }
  },
  {
    aspect: 'Implementation Speed',
    languageGems: {
      title: 'Quick Setup & Deployment',
      description: 'Schools can be up and running within days with minimal IT requirements',
      icon: Clock,
      benefits: ['Same-day setup possible', 'Cloud-based platform', 'Minimal IT overhead']
    },
    rosettaStone: {
      title: 'Complex Implementation',
      description: 'Lengthy setup process requiring significant IT resources and training',
      icon: Clock,
      limitations: ['Weeks of implementation', 'Complex IT requirements', 'Extensive training needed']
    }
  }
];

const pricingComparison = [
  {
    schoolSize: 'Small School (100 students)',
    languageGems: '£399/year',
    rosettaStone: '£17,900-£24,900/year',
    savings: '£17,500+ saved annually'
  },
  {
    schoolSize: 'Medium School (300 students)',
    languageGems: '£699/year',
    rosettaStone: '£53,700-£74,700/year',
    savings: '£53,000+ saved annually'
  },
  {
    schoolSize: 'Large School (500 students)',
    languageGems: '£699/year',
    rosettaStone: '£89,500-£124,500/year',
    savings: '£88,800+ saved annually'
  }
];

const faqs = [
  {
    question: 'Why are schools switching from Rosetta Stone to Language Gems?',
    answer: 'Schools are making the switch because Language Gems offers modern, engaging technology at a fraction of the cost while providing better curriculum alignment. Our gamified approach increases student engagement by 90%, and our transparent pricing saves schools tens of thousands annually compared to Rosetta Stone\'s expensive per-student model.'
  },
  {
    question: 'How does the learning effectiveness compare between the two platforms?',
    answer: 'Language Gems uses modern pedagogical approaches including spaced repetition, gamification, and active recall, which research shows improves retention by 40%. While Rosetta Stone\'s immersion method has merit, it can be frustrating for beginners and lacks the engagement features that keep students motivated in today\'s digital learning environment.'
  },
  {
    question: 'What about implementation and teacher training requirements?',
    answer: 'Language Gems can be implemented within days with minimal IT requirements and intuitive teacher training. Rosetta Stone typically requires weeks of implementation, complex IT setup, and extensive teacher training. Our platform is designed for busy teachers who need to get started quickly without technical barriers.'
  },
  {
    question: 'How do the costs really compare for schools?',
    answer: 'The cost difference is dramatic. Language Gems offers transparent annual pricing (£399-£699) regardless of student numbers, while Rosetta Stone charges £179-£249 per student annually. A school with 300 students would pay £699/year for Language Gems vs £53,700-£74,700/year for Rosetta Stone - a saving of over £53,000 annually.'
  },
  {
    question: 'Does Language Gems provide the same language coverage as Rosetta Stone?',
    answer: 'Language Gems focuses specifically on the languages most relevant to UK schools (Spanish, French, German, Italian) with deep GCSE curriculum alignment. While Rosetta Stone offers more languages, most schools only need 2-3 languages, and our specialized focus means better quality and more relevant content for UK education requirements.'
  }
];

export default function LanguageGemsVsRosettaStonePage() {
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/comparisons' },
    { name: 'Language Gems vs Rosetta Stone', url: '/language-gems-vs-rosetta-stone-schools' }
  ];

  return (
    <SEOWrapper structuredData={faqSchema} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Why Schools Choose Language Gems Over 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"> Rosetta Stone</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Discover why UK schools are switching from expensive, outdated language learning software 
                to modern, engaging platforms that deliver better results at a fraction of the cost.
              </p>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-8 max-w-2xl mx-auto">
                <p className="text-lg font-semibold text-purple-700">
                  Schools save an average of £50,000+ annually while improving student engagement by 90%
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/schools/contact"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Book School Demo
                </Link>
                <Link
                  href="/schools/pricing"
                  className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-all duration-200"
                >
                  Compare Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Modern vs Traditional */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Modern Learning vs. Traditional Methods
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                The fundamental difference between next-generation educational technology and legacy learning systems
              </p>
            </div>
            
            <div className="space-y-12">
              {modernVsTraditional.map((comparison, index) => (
                <div key={index} className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl p-8 border border-purple-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">{comparison.aspect}</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                          <comparison.languageGems.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Language Gems</h4>
                          <p className="text-purple-600 font-semibold text-sm">{comparison.languageGems.title}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-4">{comparison.languageGems.description}</p>
                      <ul className="space-y-2">
                        {comparison.languageGems.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-slate-700 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 border-2 border-orange-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-4">
                          <comparison.rosettaStone.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Rosetta Stone</h4>
                          <p className="text-orange-600 font-semibold text-sm">{comparison.rosettaStone.title}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-4">{comparison.rosettaStone.description}</p>
                      <ul className="space-y-2">
                        {comparison.rosettaStone.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                            <span className="text-slate-700 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Dramatic Cost Savings for Schools
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                See how much your school can save by switching to modern, cost-effective language learning technology
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-4 px-4 font-bold text-slate-900">School Size</th>
                      <th className="text-center py-4 px-4 font-bold text-purple-600">Language Gems</th>
                      <th className="text-center py-4 px-4 font-bold text-orange-600">Rosetta Stone</th>
                      <th className="text-center py-4 px-4 font-bold text-green-600">Annual Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingComparison.map((row, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-4 px-4 font-medium text-slate-900">{row.schoolSize}</td>
                        <td className="py-4 px-4 text-center font-bold text-purple-600">{row.languageGems}</td>
                        <td className="py-4 px-4 text-center font-bold text-orange-600">{row.rosettaStone}</td>
                        <td className="py-4 px-4 text-center font-bold text-green-600">{row.savings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-lg text-slate-700 mb-4">
                  <strong>Based on Rosetta Stone's published pricing of £179-£249 per student annually</strong>
                </p>
                <p className="text-purple-600 font-semibold">
                  Language Gems provides unlimited access for all students and teachers at a fixed annual rate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Student Engagement */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Proven Student Engagement Results
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Real data from schools that have made the switch to modern language learning technology
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-purple-600 mb-2">90%</h3>
                <p className="text-slate-700 font-medium">Increase in Student Engagement</p>
                <p className="text-sm text-slate-600 mt-2">Compared to traditional language learning methods</p>
              </div>
              
              <div className="text-center bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-green-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-green-600 mb-2">40%</h3>
                <p className="text-slate-700 font-medium">Better Vocabulary Retention</p>
                <p className="text-sm text-slate-600 mt-2">Through spaced repetition and gamification</p>
              </div>
              
              <div className="text-center bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border border-orange-100">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-orange-600 mb-2">95%</h3>
                <p className="text-slate-700 font-medium">Teacher Satisfaction Rate</p>
                <p className="text-sm text-slate-600 mt-2">With ease of use and student progress tracking</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Common Questions About Making the Switch
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Modernize Your Language Learning?
            </h2>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Join the schools that have already made the switch to engaging, cost-effective language learning. 
              See the difference modern technology makes for your students and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Schedule Demo
              </Link>
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                Try Our Games
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SEOWrapper>
  );
}
