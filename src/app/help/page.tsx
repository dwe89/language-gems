'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import Head from 'next/head';

export default function HelpCenterPage() {
  return (
    <>
      <Head>
        <title>Help Center - Coming Soon - LanguageGems</title>
        <meta name="description" content="Our comprehensive help center is coming soon. In the meantime, feel free to contact our support team for assistance." />
      </Head>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {/* Coming Soon Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[60vh] flex items-center">
            <div className="container mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <Clock className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Help Center Coming Soon
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  We're working hard to build a comprehensive help center with guides, tutorials, and answers to all your questions. Check back soon!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Contact Support
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* What to Expect Section */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  What to Expect
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Step-by-Step Guides
                    </h3>
                    <p className="text-gray-600">
                      Detailed tutorials for every feature and functionality
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎥</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Video Tutorials
                    </h3>
                    <p className="text-gray-600">
                      Visual walkthroughs to help you get started quickly
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Community Support
                    </h3>
                    <p className="text-gray-600">
                      Connect with other teachers and share best practices
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}