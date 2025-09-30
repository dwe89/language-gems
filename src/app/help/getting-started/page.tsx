'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Book, CheckCircle } from 'lucide-react';
import Footer from '../../../components/layout/Footer';
import Head from 'next/head';

export default function GettingStartedPage() {
  const articles = [
    {
      title: 'Creating your first assignment',
      description: 'Learn how to create and assign grammar lessons to your students',
      content: `
        Getting started with LanguageGems is easy! Follow these simple steps to create your first assignment:

        ## Step 1: Navigate to Assignments
        - Click on "Assignments" in your dashboard
        - Select "Create New Assignment"

        ## Step 2: Choose Your Content
        - Select the language (Spanish, French, or German)
        - Choose a grammar topic
        - Pick the difficulty level

        ## Step 3: Customize Settings
        - Set due dates
        - Choose which students to assign to
        - Add any special instructions

        ## Step 4: Publish
        - Review your assignment
        - Click "Assign to Students"
        - Students will receive notifications

        Your students can now access the assignment from their dashboard!
      `,
      slug: 'creating-your-first-assignment'
    },
    {
      title: 'Understanding student progress',
      description: 'Learn how to track and analyze your students\' learning progress',
      content: `
        Monitoring student progress is crucial for effective teaching. Here's how to use LanguageGems analytics:

        ## Progress Dashboard
        - View class overview with completion rates
        - See individual student performance
        - Track time spent on activities

        ## Detailed Reports
        - Grammar topic mastery levels
        - Common mistake patterns
        - Improvement trends over time

        ## Using Data for Teaching
        - Identify students who need extra help
        - Adjust lesson plans based on class performance
        - Celebrate student achievements

        ## Setting Goals
        - Create learning objectives
        - Track progress toward goals
        - Share achievements with students
      `,
      slug: 'understanding-student-progress'
    },
    {
      title: 'Setting up your classroom',
      description: 'Configure your virtual classroom environment for optimal learning',
      content: `
        Setting up your classroom properly ensures the best experience for you and your students:

        ## Classroom Settings
        - Add your school name and class details
        - Set your teaching preferences
        - Configure grading options

        ## Student Management
        - Import student lists from CSV
        - Create student groups
        - Set up student accounts

        ## Learning Environment
        - Choose default difficulty levels
        - Set up automatic notifications
        - Configure accessibility options

        ## Getting Students Started
        - Share login instructions
        - Provide platform orientation
        - Assign practice activities
      `,
      slug: 'setting-up-your-classroom'
    },
    {
      title: 'Navigating the dashboard',
      description: 'Master the LanguageGems interface and find what you need quickly',
      content: `
        The LanguageGems dashboard is designed for efficiency. Here's your complete guide:

        ## Main Navigation
        - **Dashboard**: Overview of all activities
        - **Assignments**: Create and manage assignments
        - **Students**: Manage your class roster
        - **Progress**: View analytics and reports
        - **Library**: Browse available content

        ## Quick Actions
        - Use the search bar to find specific topics
        - Create assignments with the + button
        - Access recently viewed content
        - Check notifications in the top right

        ## Customization
        - Pin frequently used items
        - Organize content by subject
        - Set up notification preferences
        - Customize your profile
      `,
      slug: 'navigating-the-dashboard'
    }
  ];

  return (
    <>
      <Head>
        <title>Getting Started - LanguageGems Help Center</title>
        <meta name="description" content="New to LanguageGems? Learn how to create assignments, track student progress, set up your classroom, and navigate the dashboard." />
      </Head>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-12">
            <div className="container mx-auto px-6">
              <Link 
                href="/help" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help Center
              </Link>
              <div className="flex items-center mb-4">
                <Book className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl">
                New to LanguageGems? These guides will help you get up and running quickly.
              </p>
            </div>
          </div>

          {/* Articles */}
          <div className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-12 last:mb-0"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {article.title}
                          </h2>
                          <p className="text-gray-600 text-lg">
                            {article.description}
                          </p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-4" />
                      </div>
                      
                      <div className="prose prose-blue max-w-none">
                        {article.content.split('\n').map((paragraph, pIndex) => {
                          if (paragraph.startsWith('## ')) {
                            return (
                              <h3 key={pIndex} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                                {paragraph.replace('## ', '')}
                              </h3>
                            );
                          } else if (paragraph.startsWith('- ')) {
                            return (
                              <li key={pIndex} className="text-gray-600 ml-4">
                                {paragraph.replace('- ', '')}
                              </li>
                            );
                          } else if (paragraph.trim()) {
                            return (
                              <p key={pIndex} className="text-gray-600 mb-4">
                                {paragraph}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still need help getting started?
              </h2>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you succeed with LanguageGems.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}