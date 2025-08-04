'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Zap } from 'lucide-react';
import Footer from '../../../components/layout/Footer';

export default function AIPolicyPage() {
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
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Ethics & Policy</h1>
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
            <Zap className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Responsible AI in Education</h2>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              LanguageGems uses artificial intelligence to enhance educational outcomes for schools and their students. This policy outlines how we responsibly implement AI in our B2B educational platform.
            </p>
            <p className="mb-6 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-purple-800 mb-2">AI in Educational Settings</h3>
              <p className="text-purple-700 text-sm">
                Our AI features are designed specifically for educational institutions, with teacher oversight and student privacy as core principles.
              </p>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Our AI Principles</h3>
              <div className="text-gray-700 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🎯 Educational Purpose</h4>
                  <p className="text-blue-700 text-sm">All AI features are designed solely to enhance learning outcomes and support educational goals.</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🔒 Privacy First</h4>
                  <p className="text-green-700 text-sm">Student data privacy is paramount in all AI processing and model training.</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">⚖️ Fairness & Bias Mitigation</h4>
                  <p className="text-purple-700 text-sm">We actively work to identify and reduce bias in our AI systems.</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">👨‍🏫 Human Oversight</h4>
                  <p className="text-amber-700 text-sm">Teachers remain in control, with AI serving as a supportive tool.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Use AI</h3>
              <div className="text-gray-700 space-y-4">
                <p>LanguageGems uses artificial intelligence in the following ways:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>AI Insights:</strong> Analyzing student performance data to provide actionable insights for teachers</li>
                  <li><strong>AI Marking:</strong> Automated assessment of student responses with human oversight</li>
                  <li><strong>Adaptive Learning:</strong> Personalizing content difficulty and pacing based on individual progress</li>
                  <li><strong>Content Generation:</strong> Creating practice exercises and worksheets tailored to curriculum needs</li>
                  <li><strong>Speech Recognition:</strong> Evaluating pronunciation and speaking exercises</li>
                  <li><strong>Natural Language Processing:</strong> Understanding and responding to student inputs</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Data Used for AI (School-Authorized)</h3>
              <div className="text-gray-700 space-y-4">
                <p>Our AI systems process student educational data only as authorized by schools:</p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">School Control</h4>
                  <p className="text-green-700 text-sm">Schools can control which AI features are enabled and what data is processed for their students.</p>
                </div>

                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Performance Data:</strong> Game scores, exercise completion, assessment results</li>
                  <li><strong>Learning Patterns:</strong> Time spent on activities, skill progression, difficulty preferences</li>
                  <li><strong>Error Analysis:</strong> Common mistakes, areas needing reinforcement</li>
                  <li><strong>Engagement Metrics:</strong> Activity participation, session duration</li>
                  <li><strong>Curriculum Alignment:</strong> Progress against learning objectives</li>
                </ul>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-red-800 text-sm">
                    <strong>Never Used for AI:</strong> Student names, personal identifiers, or data outside the educational context. All processing is anonymized where possible.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher Control & Oversight</h3>
              <div className="text-gray-700 space-y-4">
                <p>Teachers and schools maintain full control over AI features:</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Teacher Authority</h4>
                  <p className="text-blue-700 text-sm">Teachers are the educational experts. AI provides insights to support their professional judgment, never to replace it.</p>
                </div>

                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Review & Override:</strong> Teachers can review and override any AI-generated insights or assessments</li>
                  <li><strong>Suggestions Only:</strong> All AI recommendations are presented as suggestions to support teaching</li>
                  <li><strong>Educational Authority:</strong> Teachers remain the final authority in all educational decisions</li>
                  <li><strong>Feedback Loop:</strong> Teachers can provide feedback to improve AI accuracy</li>
                  <li><strong>Transparency:</strong> Clear explanations of how AI insights are generated</li>
                  <li><strong>Opt-Out Options:</strong> Schools can disable AI features if preferred</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bias Mitigation & Fairness</h3>
              <div className="text-gray-700 space-y-4">
                <p>We are committed to ensuring our AI systems are fair and unbiased:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Regular testing for bias across different demographic groups</li>
                  <li>Diverse training data that represents various learning styles and backgrounds</li>
                  <li>Ongoing monitoring of AI outputs for potential discriminatory patterns</li>
                  <li>Transparent reporting of AI system limitations and known biases</li>
                  <li>Continuous improvement based on feedback and bias detection</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transparency & Explainability</h3>
              <div className="text-gray-700 space-y-4">
                <p>We strive to make our AI systems transparent and understandable:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Clear explanations of how AI insights are generated</li>
                  <li>Documentation of AI model capabilities and limitations</li>
                  <li>Regular updates on AI system improvements and changes</li>
                  <li>Open communication about AI decision-making processes</li>
                  <li>Training resources to help educators understand AI features</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Security & Privacy</h3>
              <div className="text-gray-700 space-y-4">
                <p>AI processing adheres to our strict privacy and security standards:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>All AI processing occurs within secure, encrypted environments</li>
                  <li>Student data is never used for commercial AI model training</li>
                  <li>AI models are trained only on appropriately licensed educational content</li>
                  <li>Regular security audits of AI systems and data handling</li>
                  <li>Compliance with GDPR, COPPA, and other relevant privacy regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Limitations & Disclaimers</h3>
              <div className="text-gray-700 space-y-4">
                <p>We acknowledge the following limitations of our AI systems:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>AI insights are probabilistic and may not always be accurate</li>
                  <li>AI systems may have biases despite our mitigation efforts</li>
                  <li>AI-generated content should be reviewed by qualified educators</li>
                  <li>AI assessments are supplementary to, not replacements for, human judgment</li>
                  <li>System performance may vary across different languages and contexts</li>
                </ul>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Contact & Feedback</h3>
              <p className="text-blue-700 text-sm mb-2">
                We welcome feedback on our AI systems and policies. Please contact us:
              </p>
              <div className="text-blue-700 text-sm">
                <p><strong>Email:</strong> ai-ethics@languagegems.com</p>
                <p><strong>General Contact:</strong> hello@languagegems.com</p>
                <p><strong>Company:</strong> LanguageGems Ltd</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}