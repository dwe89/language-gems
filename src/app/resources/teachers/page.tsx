import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Users, TrendingUp, Award, Clock, Target, Lightbulb, CheckCircle, Download, Play, FileText } from 'lucide-react';
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { getFAQSchema } from '../../../lib/seo/structuredData';
import { generateMetadata } from '../../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'MFL Teachers Resource Hub - Language Learning Games & Tools | Language Gems',
  description: 'Comprehensive resource hub for Modern Foreign Language teachers. Access interactive games, lesson plans, assessment tools, and professional development resources for GCSE language teaching.',
  keywords: [
    'MFL teachers',
    'modern foreign language teachers',
    'language teaching resources',
    'GCSE language teaching',
    'MFL lesson plans',
    'language learning games teachers',
    'MFL assessment tools',
    'language teaching platform',
    'MFL professional development',
    'classroom language games',
    'language teacher dashboard',
    'MFL curriculum resources'
  ],
  canonical: '/resources/teachers',
  ogImage: '/images/mfl-teachers-resources-og.jpg',
});

const teacherBenefits = [
  {
    icon: Users,
    title: 'Classroom Management Made Easy',
    description: 'Comprehensive teacher dashboard with real-time student progress tracking, assignment creation, and performance analytics across all your language classes.'
  },
  {
    icon: TrendingUp,
    title: 'Data-Driven Teaching Insights',
    description: 'Detailed analytics showing vocabulary mastery, common mistakes, and learning patterns to inform your lesson planning and intervention strategies.'
  },
  {
    icon: Target,
    title: 'GCSE Curriculum Alignment',
    description: 'All content is specifically aligned with AQA, Edexcel, OCR, and WJEC specifications, ensuring your students practice exactly what they need for exams.'
  },
  {
    icon: Clock,
    title: 'Time-Saving Lesson Preparation',
    description: 'Ready-made interactive activities, vocabulary lists, and assessment tools that integrate seamlessly into your existing lesson plans.'
  },
  {
    icon: Award,
    title: 'Proven Student Engagement',
    description: 'Gamified learning experiences that increase student motivation and participation, with measurable improvements in vocabulary retention.'
  },
  {
    icon: Lightbulb,
    title: 'Professional Development Support',
    description: 'Access to best practices, teaching strategies, and ongoing support to enhance your MFL teaching with educational technology.'
  }
];

const resourceCategories = [
  {
    title: 'Interactive Games Library',
    description: 'Access to 15+ curriculum-aligned language games',
    icon: Play,
    resources: [
      'Vocabulary Mining with spaced repetition',
      'Grammar games for all skill levels',
      'Listening comprehension activities',
      'Cultural exploration games',
      'Assessment and revision tools'
    ],
    cta: 'Explore Games',
    link: '/games'
  },
  {
    title: 'Lesson Planning Resources',
    description: 'Ready-to-use materials for effective MFL lessons',
    icon: FileText,
    resources: [
      'Curriculum-mapped lesson plans',
      'Vocabulary lists by theme',
      'Grammar progression guides',
      'Assessment rubrics and criteria',
      'Differentiation strategies'
    ],
    cta: 'Download Resources',
    link: '/resources/lesson-plans'
  },
  {
    title: 'Assessment & Analytics',
    description: 'Comprehensive tools for tracking student progress',
    icon: TrendingUp,
    resources: [
      'Real-time progress dashboards',
      'Detailed performance reports',
      'Vocabulary mastery tracking',
      'Class comparison analytics',
      'Parent communication tools'
    ],
    cta: 'View Dashboard',
    link: '/dashboard'
  },
  {
    title: 'Professional Development',
    description: 'Enhance your MFL teaching with modern methods',
    icon: Award,
    resources: [
      'Gamification in language learning',
      'Technology integration strategies',
      'Spaced repetition techniques',
      'Student motivation methods',
      'Best practice case studies'
    ],
    cta: 'Learn More',
    link: '/resources/professional-development'
  }
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Head of MFL, Westfield Academy',
    quote: 'Language Gems has transformed how we teach vocabulary. Our GCSE results improved by 23% since implementing the platform, and student engagement is at an all-time high.',
    subject: 'Spanish & French'
  },
  {
    name: 'David Thompson',
    role: 'German Teacher, Riverside School',
    quote: 'The analytics dashboard gives me insights I never had before. I can identify struggling students early and provide targeted support. It\'s revolutionized my teaching approach.',
    subject: 'German'
  },
  {
    name: 'Emma Rodriguez',
    role: 'MFL Coordinator, Oakwood High',
    quote: 'Finally, a platform designed specifically for UK curriculum requirements. The games are engaging, the content is accurate, and the teacher tools are exactly what we needed.',
    subject: 'Spanish, French & Italian'
  }
];

const faqs = [
  {
    question: 'How does Language Gems integrate with existing MFL curricula?',
    answer: 'Our platform is specifically designed to complement existing MFL curricula for AQA, Edexcel, OCR, and WJEC exam boards. All vocabulary and grammar content is mapped to official specifications, making it easy to integrate into your current lesson plans and schemes of work.'
  },
  {
    question: 'What training and support is provided for teachers?',
    answer: 'We provide comprehensive onboarding including platform training, best practice workshops, and ongoing pedagogical support. Our team includes experienced MFL teachers who understand the challenges you face and can provide practical guidance on implementation.'
  },
  {
    question: 'How can I track student progress and performance?',
    answer: 'The teacher dashboard provides detailed analytics including vocabulary mastery levels, time spent learning, common mistakes, and progress over time. You can generate reports for individual students, classes, or year groups to inform your teaching and identify students needing additional support.'
  },
  {
    question: 'Can I create custom assignments and assessments?',
    answer: 'Yes! You can create custom assignments using our vocabulary database, set specific learning objectives, and track completion rates. The platform also allows you to create assessments aligned with your curriculum requirements and generate detailed performance reports.'
  },
  {
    question: 'What languages and levels are supported?',
    answer: 'We currently support Spanish, French, German, and Italian at GCSE level (equivalent to A2/B1 CEFR). Our content covers all major themes and topics required by UK exam boards, with plans to expand to A-Level content based on teacher feedback.'
  }
];

export default function MFLTeachersResourceHub() {
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Teachers', url: '/resources/teachers' }
  ];

  return (
    <SEOWrapper structuredData={faqSchema} breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                MFL Teachers 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"> Resource Hub</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Empower your Modern Foreign Language teaching with interactive games, comprehensive analytics, 
                and curriculum-aligned resources designed specifically for UK GCSE requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/schools/pricing"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get School Access
                </Link>
                <Link
                  href="/games"
                  className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-all duration-200"
                >
                  Explore Games
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why MFL Teachers Choose Language Gems
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Purpose-built for Modern Foreign Language educators who want to enhance student engagement and improve learning outcomes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-8 border border-purple-100 hover:border-purple-200 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
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

        {/* Resource Categories Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Comprehensive Teaching Resources
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Everything you need to deliver engaging, effective MFL lessons with measurable results
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resourceCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{category.title}</h3>
                        <p className="text-slate-600">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {category.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-slate-700 text-sm">{resource}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link
                      href={category.link}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      {category.cta}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                What MFL Teachers Are Saying
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Real feedback from Modern Foreign Language teachers using Language Gems in their classrooms
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-8 border border-purple-100">
                  <div className="mb-6">
                    <div className="flex text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <CheckCircle key={i} className="h-5 w-5" />
                      ))}
                    </div>
                    <p className="text-slate-700 italic leading-relaxed">"{testimonial.quote}"</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-slate-600 text-sm">{testimonial.role}</p>
                    <p className="text-purple-600 text-sm font-medium">{testimonial.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600">
                Common questions from MFL teachers about implementing Language Gems
              </p>
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
              Ready to Transform Your MFL Teaching?
            </h2>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Join hundreds of MFL teachers already using Language Gems to improve student engagement and GCSE results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/schools/pricing"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get School Pricing
              </Link>
              <Link
                href="/schools/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-purple-600 transition-all duration-200"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SEOWrapper>
  );
}
