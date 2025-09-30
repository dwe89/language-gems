'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Book,
  Users,
  Settings,
  CreditCard,
  HelpCircle,
  FileText,
  Video,
  Mail,
  ExternalLink,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import HelpSearchBar from '../../components/help/HelpSearchBar';
import HelpQuickActions from '../../components/help/HelpQuickActions';
import HelpCategories from '../../components/help/HelpCategories';
import Head from 'next/head';

export default function HelpCenterPage() {

  const helpCategories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of using LanguageGems',
      articles: [
        'Creating your first assignment',
        'Understanding student progress',
        'Setting up your classroom',
        'Navigating the dashboard'
      ],
      slug: 'getting-started'
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Managing students and assignments',
      articles: [
        'Adding students to your class',
        'Creating student groups',
        'Assigning homework',
        'Tracking student progress'
      ],
      slug: 'student-management'
    },
    {
      icon: Settings,
      title: 'Platform Features',
      description: 'Understanding all platform capabilities',
      articles: [
        'Using interactive games',
        'Vocabulary practice tools',
        'Grammar exercises',
        'Audio pronunciation guides'
      ],
      slug: 'platform-features'
    },
    {
      icon: CreditCard,
      title: 'Billing & Subscriptions',
      description: 'Account, billing, and subscription help',
      articles: [
        'Upgrading your plan',
        'Managing billing information',
        'Understanding subscription features',
        'Canceling your subscription'
      ],
      slug: 'billing'
    }
  ];

  const quickActions = [
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      action: 'Browse Videos',
      href: '/help/videos'
    },
    {
      icon: FileText,
      title: 'User Guide',
      description: 'Complete platform documentation',
      action: 'Read Guide',
      href: '/help/user-guide'
    },
    {
      icon: MessageCircle,
      title: 'Contact Support',
      description: 'Get help from our team',
      action: 'Contact Us',
      href: '/contact'
    }
  ];

  const popularArticles = [
    {
      title: 'How to create your first Spanish lesson',
      category: 'Getting Started',
      views: '2.3k views'
    },
    {
      title: 'Setting up automatic grading',
      category: 'Platform Features',
      views: '1.8k views'
    },
    {
      title: 'Understanding student progress reports',
      category: 'Student Management',
      views: '1.5k views'
    },
    {
      title: 'Upgrading to School Pro plan',
      category: 'Billing & Subscriptions',
      views: '1.2k views'
    }
  ];

  return (
    <>
      <Head>
        <title>Help Center - LanguageGems Support</title>
        <meta name="description" content="Find answers to your questions about LanguageGems. Browse our help articles, video tutorials, and guides to get the most out of our language learning platform." />
      </Head>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
            <div className="container mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  How can we help you?
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Find answers, browse guides, and get the support you need
                </p>

                <HelpSearchBar />
              </motion.div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Quick Actions
              </h2>
              <HelpQuickActions actions={quickActions} />
            </div>
          </div>

          {/* Help Categories */}
          <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Browse by Category
              </h2>
              <HelpCategories categories={helpCategories} />
            </div>
          </div>

          {/* Popular Articles */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Popular Articles
              </h2>
              <div className="max-w-4xl mx-auto">
                {popularArticles.map((article, index) => (
                  <motion.div
                    key={article.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <Link
                      href={`/help/article/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block py-6 hover:bg-gray-50 -mx-6 px-6 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-3">
                              {article.category}
                            </span>
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="py-16 bg-blue-50">
            <div className="container mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Still need help?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Support
                  </Link>
                  <a
                    href="mailto:support@languagegems.com"
                    className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Email Directly
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}