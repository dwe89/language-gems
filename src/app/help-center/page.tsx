'use client';

import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import { 
  Search, HelpCircle, BookOpen, Users, Settings, Gamepad2, 
  GraduationCap, MessageCircle, ChevronDown, ChevronRight,
  Mail, Phone, Clock, CheckCircle, AlertCircle, Info
} from 'lucide-react';
import Footer from '../../components/layout/Footer';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
    { id: 'games', name: 'Games & Activities', icon: Gamepad2 },
    { id: 'assignments', name: 'Assignments', icon: GraduationCap },
    { id: 'account', name: 'Account & Billing', icon: Settings },
    { id: 'technical', name: 'Technical Support', icon: AlertCircle },
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create my first assignment?',
      answer: 'Navigate to your teacher dashboard and click "Create Assignment". Choose from our 15+ interactive games, select vocabulary categories or upload custom content, set difficulty levels, and assign to your classes. Students will receive instant access through their dashboard.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'How do students access their assignments?',
      answer: 'Students log in to their student dashboard using their school credentials. All assigned games and activities appear on their homepage with clear progress tracking and deadlines.'
    },
    {
      id: 3,
      category: 'games',
      question: 'What games are available on the platform?',
      answer: 'We offer 15+ interactive games including Memory Match, Hangman, Noughts & Crosses, Word Scramble, Vocab Blast, Detective Listening, Conjugation Duel, and more. Each game supports multiple themes and difficulty levels.'
    },
    {
      id: 4,
      category: 'games',
      question: 'Can I customize game content?',
      answer: 'Yes! You can use our extensive GCSE vocabulary database or upload custom vocabulary lists. Games support multiple languages and can be tailored to specific curriculum requirements.'
    },
    {
      id: 5,
      category: 'assignments',
      question: 'How do I track student progress?',
      answer: 'The analytics dashboard provides detailed insights into student performance, completion rates, accuracy scores, and time spent. You can view individual student progress or class-wide statistics.'
    },
    {
      id: 6,
      category: 'assignments',
      question: 'Can I set assignment deadlines?',
      answer: 'Yes, you can set specific deadlines for assignments. Students will see countdown timers and receive notifications as deadlines approach.'
    },
    {
      id: 7,
      category: 'account',
      question: 'How do I add students to my classes?',
      answer: 'Use the class management tool to generate student codes or import class lists. Students can join using their unique codes, or you can create accounts in bulk.'
    },
    {
      id: 8,
      category: 'account',
      question: 'What are the pricing options for schools?',
      answer: 'We offer flexible pricing tiers based on school size and features needed. Visit our pricing page or contact sales for a custom quote tailored to your institution.'
    },
    {
      id: 9,
      category: 'technical',
      question: 'What browsers are supported?',
      answer: 'Language Gems works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'Is the platform accessible on mobile devices?',
      answer: 'Yes! Our platform is fully responsive and works seamlessly on tablets and smartphones, allowing students to learn anywhere, anytime.'
    }
  ];

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Complete walkthrough for new teachers',
      icon: BookOpen,
      link: '/tutorials'
    },
    {
      title: 'Game Documentation',
      description: 'Detailed guides for each game type',
      icon: Gamepad2,
      link: '/documentation'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Users,
      link: '/tutorials'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: MessageCircle,
      link: '/contact-sales'
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    (selectedCategory === 'all' || faq.category === selectedCategory) &&
    (searchQuery === '' || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Head>
        <title>Help Center | Support & FAQs | Language Gems</title>
        <meta name="description" content="Get help with Language Gems platform. Find answers to common questions about our GCSE language learning games, MFL teaching resources, and platform features." />
        <meta name="keywords" content="Language Gems help, GCSE language learning support, MFL teaching help, language games FAQ, teacher support" />
        <link rel="canonical" href="https://languagegems.com/help-center" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Find answers to common questions and get the support you need to make the most of Language Gems
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.link}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100"
              >
                <link.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  {expandedFAQ === faq.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our support team is here to help you succeed with Language Gems
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-sales"
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </Link>
            <Link
              href="/documentation"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-colors flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              View Documentation
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
}
