
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import { Metadata } from 'next';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Cookie Policy | Language Gems Educational Platform',
  description: 'Cookie usage policy for Language Gems educational platform. Learn how we use cookies to improve your learning experience.',
  canonical: '/cookies'
});


export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <Cookie className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cookie Policy</h1>
                <p className="text-gray-600">LanguageGems.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">How We Use Cookies</h2>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              This policy explains how LanguageGems uses cookies and similar technologies in our educational platform for schools, teachers, and students.
            </p>
            <p className="mb-6 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Educational Platform Cookies</h3>
              <p className="text-green-700 text-sm">
                Our cookies are designed to support educational activities and maintain secure learning environments for schools and their students.
              </p>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Are Cookies?</h3>
              <div className="text-gray-700 space-y-4">
                <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and how you use our platform.</p>
                <p>We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted or expired).</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Types of Cookies We Use</h3>
              <div className="text-gray-700 space-y-6">

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-blue-800 mb-2">🔐 Essential Cookies</h4>
                  <p className="text-blue-700 text-sm mb-2">These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
                  <ul className="text-blue-700 text-sm list-disc pl-6 space-y-1">
                    <li>Authentication and login status</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-purple-800 mb-2">📊 Analytics Cookies</h4>
                  <p className="text-purple-700 text-sm mb-2">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                  <ul className="text-purple-700 text-sm list-disc pl-6 space-y-1">
                    <li>Google Analytics for usage statistics</li>
                    <li>Performance monitoring</li>
                    <li>Error tracking and debugging</li>
                  </ul>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-pink-800 mb-2">⚙️ Educational Functionality Cookies</h4>
                  <p className="text-pink-700 text-sm mb-2">These cookies enable educational features and remember learning preferences for students and teachers.</p>
                  <ul className="text-pink-700 text-sm list-disc pl-6 space-y-1">
                    <li>Student learning progress and game state</li>
                    <li>Teacher dashboard preferences</li>
                    <li>Class assignment settings</li>
                    <li>Accessibility preferences</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-green-800 mb-2">📢 Marketing Cookies (Teachers Only)</h4>
                  <p className="text-green-700 text-sm mb-2">Used only for teacher/administrator accounts to provide relevant educational content and resources.</p>
                  <ul className="text-green-700 text-sm list-disc pl-6 space-y-1">
                    <li>Educational resource recommendations</li>
                    <li>Professional development content</li>
                    <li>School-relevant feature announcements</li>
                  </ul>
                  <p className="text-green-700 text-xs mt-2"><strong>Note:</strong> Marketing cookies are never used for student accounts.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Third-Party Cookies</h3>
              <div className="text-gray-700 space-y-4">
                <p>We may also use third-party cookies from trusted partners to enhance your experience:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Google Analytics:</strong> To understand website usage and improve our services</li>
                  <li><strong>YouTube:</strong> For embedded educational videos</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing functionality</li>
                  <li><strong>Educational Partners:</strong> For integrated learning tools</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h3>
              <div className="text-gray-700 space-y-4">
                <p>You have several options for managing cookies:</p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">Browser Settings</h4>
                  <p className="text-gray-700 text-sm mb-2">Most browsers allow you to:</p>
                  <ul className="text-gray-700 text-sm list-disc pl-6 space-y-1">
                    <li>View and delete cookies</li>
                    <li>Block cookies from specific sites</li>
                    <li>Block third-party cookies</li>
                    <li>Clear all cookies when you close the browser</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <h4 className="text-md font-semibold text-amber-800 mb-2">Cookie Consent Manager</h4>
                  <p className="text-amber-700 text-sm">When you first visit our site, you can choose which types of cookies to accept through our consent banner. You can change your preferences at any time by clicking the "Cookie Settings" link in our footer.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact of Disabling Cookies</h3>
              <div className="text-gray-700 space-y-4">
                <p>If you choose to disable cookies, some features of our platform may not work properly:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>You may need to log in each time you visit</li>
                  <li>Your learning progress may not be saved</li>
                  <li>Personalized content and recommendations may not work</li>
                  <li>Some interactive features may be unavailable</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Updates to This Policy</h3>
              <div className="text-gray-700 space-y-4">
                <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.</p>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
              <p className="text-blue-700 text-sm mb-2">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="text-blue-700 text-sm">
                <p><strong>Email:</strong> hello@languagegems.com</p>
                <p><strong>Company:</strong> LanguageGems Ltd</p>
                <p><strong>Website:</strong> www.languagegems.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
