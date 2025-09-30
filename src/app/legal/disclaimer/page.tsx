import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import Footer from '../../../components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Disclaimer - LanguageGems',
  description: 'Important information about LanguageGems exam practice materials, content ownership, and relationship with examination boards.',
  openGraph: {
    title: 'Legal Disclaimer - LanguageGems',
    description: 'Important information about LanguageGems exam practice materials.',
    url: 'https://languagegems.com/legal/disclaimer',
    type: 'website',
  },
};

export default function DisclaimerPage() {
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
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Legal Disclaimer</h1>
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
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Important Notice Regarding Exam Practice Materials</h2>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              LanguageGems is an independent educational technology platform. We are committed to providing high-quality, effective, and engaging language learning resources for students and teachers.
            </p>

            <p className="mb-4 text-gray-700 leading-relaxed">
              Our <strong>Exam Practice</strong> and <strong>Assessment</strong> materials, including all questions, texts, audio, visual content, rubrics, and suggested answers, are <strong>original content created and copyrighted by LanguageGems.</strong>
            </p>

            <p className="mb-4 text-gray-700 leading-relaxed">
              While our materials are meticulously designed to <strong>reflect the style, format, structure, and demands</strong> of examinations set by leading UK awarding bodies such as <strong>AQA, Pearson Edexcel, and Eduqas (WJEC Eduqas)</strong>, it is crucial to understand the following:
            </p>

            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
              <li><strong>No Affiliation:</strong> LanguageGems is <strong>not affiliated with, endorsed by, or sponsored by</strong> AQA, Pearson Edexcel, Eduqas, or any other official examination board.</li>
              <li><strong>Original Content:</strong> Our "exam-style" questions and assessments are <strong>not copies of past papers</strong> or official materials from any examination board. They are unique practice questions developed by our expert team.</li>
              <li><strong>Copyright:</strong> Official past papers, mark schemes, specifications, and all other published materials from AQA, Pearson Edexcel, Eduqas, and other awarding bodies are <strong>their intellectual property and remain copyrighted by them.</strong> Our platform does not reproduce these copyrighted materials.</li>
              <li><strong>Purpose:</strong> Our resources are intended solely for <strong>practice, revision, and familiarisation</strong> with common examination formats and question types. They are designed to support students in developing the skills and confidence required for their official examinations.</li>
              <li><strong>AI Training:</strong> Any Artificial Intelligence (AI) or Machine Learning (ML) models used by LanguageGems for content generation or adaptive learning are trained exclusively on <strong>original data created by LanguageGems</strong> or data for which we hold the necessary licenses for AI training. No copyrighted material from examination boards has been used for AI model training without explicit permission.</li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Important Recommendation</h3>
                  <p className="text-amber-700 text-sm">
                    We strongly advise students to also consult official examination board resources and their teachers for comprehensive exam preparation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
              <p className="text-blue-700 text-sm">
                If you have any questions about this disclaimer or our content policies, please contact us through our support channels.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Provide</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Original exam-style practice questions</li>
              <li>• Interactive assessment tools</li>
              <li>• Adaptive learning experiences</li>
              <li>• Progress tracking and analytics</li>
              <li>• Teacher dashboard and resources</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Don't Provide</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Official past papers</li>
              <li>• Copyrighted exam board materials</li>
              <li>• Official mark schemes</li>
              <li>• Guaranteed exam predictions</li>
              <li>• Official certification or accreditation</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
