'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, Users } from 'lucide-react';
import Footer from '../../../components/layout/Footer';

export default function AccessibilityPage() {
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
              <Eye className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Accessibility Statement</h1>
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
            <Users className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Commitment to Accessibility</h2>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              LanguageGems is committed to providing an accessible educational platform for all schools, teachers, and students, including those with disabilities. We design our platform to support inclusive learning environments.
            </p>
            <p className="mb-6 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Educational Accessibility</h3>
              <p className="text-blue-700 text-sm">
                Our accessibility features are designed specifically for educational settings, supporting diverse learning needs and teaching requirements.
              </p>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Accessibility Standards</h3>
              <div className="text-gray-700 space-y-4">
                <p>LanguageGems aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities.</p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">WCAG 2.1 AA Compliance</h4>
                  <p className="text-green-700 text-sm">We follow the four main principles of accessibility: Perceivable, Operable, Understandable, and Robust (POUR).</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility Features</h3>
              <div className="text-gray-700 space-y-4">
                <p>Our platform includes the following accessibility features:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 Keyboard Navigation</h4>
                    <p className="text-blue-700 text-sm">Full keyboard accessibility for all interactive elements</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">🔍 Screen Reader Support</h4>
                    <p className="text-purple-700 text-sm">Compatible with NVDA, JAWS, and VoiceOver</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">🎨 High Contrast Mode</h4>
                    <p className="text-green-700 text-sm">Enhanced color contrast for better visibility</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-2">📝 Alternative Text</h4>
                    <p className="text-amber-700 text-sm">Descriptive alt text for all images and graphics</p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h4 className="font-semibold text-pink-800 mb-2">🔤 Scalable Text</h4>
                    <p className="text-pink-700 text-sm">Text can be resized up to 200% without loss of functionality</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h4 className="font-semibold text-indigo-800 mb-2">⏱️ Timing Controls</h4>
                    <p className="text-indigo-700 text-sm">Adjustable time limits for timed activities</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Accessibility Features</h3>
              <div className="text-gray-700 space-y-4">
                <p>Our platform includes specialized features for educational accessibility:</p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">For Students with Learning Differences</h4>
                  <ul className="text-green-700 text-sm list-disc pl-6 space-y-1">
                    <li>Text-to-speech for reading support</li>
                    <li>Adjustable game speed and difficulty</li>
                    <li>Visual and audio cues for navigation</li>
                    <li>Extended time options for activities</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">For Teachers</h4>
                  <ul className="text-blue-700 text-sm list-disc pl-6 space-y-1">
                    <li>Accessibility settings management for student accounts</li>
                    <li>Alternative format options for assignments</li>
                    <li>Progress tracking with accessibility considerations</li>
                    <li>Integration with school assistive technology</li>
                  </ul>
                </div>

                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Multiple Input Methods:</strong> Support for various input devices and assistive technologies</li>
                  <li><strong>Customizable Interface:</strong> Adjustable font sizes, colors, and layout options</li>
                  <li><strong>Clear Navigation:</strong> Consistent and predictable navigation structure</li>
                  <li><strong>Error Prevention:</strong> Clear error messages and correction suggestions</li>
                  <li><strong>Cognitive Support:</strong> Simple language options and visual instruction aids</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assistive Technology Compatibility</h3>
              <div className="text-gray-700 space-y-4">
                <p>LanguageGems is designed to work with common assistive technologies:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Screen Readers:</strong> NVDA, JAWS, VoiceOver, TalkBack</li>
                  <li><strong>Voice Recognition:</strong> Dragon NaturallySpeaking, Windows Speech Recognition</li>
                  <li><strong>Switch Navigation:</strong> Single-switch and multi-switch devices</li>
                  <li><strong>Eye-tracking:</strong> Compatible with eye-tracking input devices</li>
                  <li><strong>Magnification:</strong> Works with screen magnification software</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Known Limitations</h3>
              <div className="text-gray-700 space-y-4">
                <p>We are continuously working to improve accessibility. Current known limitations include:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Some interactive game elements may have limited screen reader support</li>
                  <li>Complex visual content may require additional description</li>
                  <li>Some third-party embedded content may not meet full accessibility standards</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> We are actively working to address these limitations in future updates.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Testing & Validation</h3>
              <div className="text-gray-700 space-y-4">
                <p>We regularly test our platform for accessibility through:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Automated accessibility testing tools</li>
                  <li>Manual testing with assistive technologies</li>
                  <li>User testing with individuals who have disabilities</li>
                  <li>Regular accessibility audits by third-party experts</li>
                  <li>Ongoing monitoring and improvement processes</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback & Support</h3>
              <div className="text-gray-700 space-y-4">
                <p>We welcome feedback on the accessibility of LanguageGems. If you encounter any accessibility barriers or have suggestions for improvement, please let us know:</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Accessibility Support</h4>
                  <div className="text-blue-700 text-sm space-y-1">
                    <p><strong>Email:</strong> accessibility@languagegems.com</p>
                    <p><strong>Phone:</strong> Available upon request</p>
                    <p><strong>Response Time:</strong> We aim to respond within 2 business days</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Formats</h3>
              <div className="text-gray-700 space-y-4">
                <p>If you need content in an alternative format, we can provide:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Large print versions of educational materials</li>
                  <li>Audio descriptions of visual content</li>
                  <li>Simplified language versions where appropriate</li>
                  <li>Braille versions upon request</li>
                  <li>Electronic formats compatible with assistive technology</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ongoing Commitment</h3>
              <div className="text-gray-700 space-y-4">
                <p>Our commitment to accessibility is ongoing. We:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Regularly review and update our accessibility practices</li>
                  <li>Train our development team on accessibility best practices</li>
                  <li>Include accessibility considerations in all new feature development</li>
                  <li>Monitor changes in accessibility standards and regulations</li>
                  <li>Engage with the disability community for feedback and guidance</li>
                </ul>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
              <p className="text-blue-700 text-sm mb-2">
                For accessibility-related questions, feedback, or support:
              </p>
              <div className="text-blue-700 text-sm">
                <p><strong>Accessibility Team:</strong> accessibility@languagegems.com</p>
                <p><strong>General Support:</strong> hello@languagegems.com</p>
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