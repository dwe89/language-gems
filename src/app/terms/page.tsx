import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import { generateMetadata as createMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = createMetadata({
  title: 'Terms of Service | Language Gems Educational Platform',
  description: 'Terms of service for Language Gems educational platform. Review our policies for using our GCSE language learning games and teaching resources.',
  canonical: '/terms'
});

export default function TermsOfServicePage() {
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
              <Scale className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
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
            <FileText className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Terms and Conditions</h2>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              These terms govern the use of LanguageGems by educational institutions, teachers, and students. Please read carefully before implementing our platform in your educational setting.
            </p>
            <p className="mb-6 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Educational Institution Service</h3>
              <p className="text-green-700 text-sm">
                LanguageGems is designed for use by schools, colleges, and educational institutions. These terms apply to institutional accounts and their authorized users (teachers and students).
              </p>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceptance of Terms</h3>
              <div className="text-gray-700 space-y-4">
                <p>By subscribing to or using LanguageGems as an educational institution, you accept and agree to be bound by these terms. Schools are responsible for ensuring their teachers and students comply with these terms during platform use.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Use License</h3>
              <div className="text-gray-700 space-y-4">
                <p>Permission is granted to temporarily use LanguageGems for educational purposes only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Modify or copy the educational materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the platform</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Share student accounts or access credentials</li>
                </ul>
                <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
              <div className="text-gray-700 space-y-4">
                <h4 className="font-semibold text-gray-800">School Administrator Accounts:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Provide accurate institutional information during setup</li>
                  <li>Maintain secure administrator credentials</li>
                  <li>Properly manage teacher and student account creation</li>
                  <li>Monitor platform usage within your institution</li>
                  <li>Ensure compliance with your institution's IT policies</li>
                </ul>

                <h4 className="font-semibold text-gray-800">Teacher Accounts:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Use accounts only for authorized educational purposes</li>
                  <li>Protect student data and maintain confidentiality</li>
                  <li>Follow school policies for technology use</li>
                  <li>Report any security concerns to school administrators</li>
                </ul>

                <h4 className="font-semibold text-gray-800">Student Accounts:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Created and managed by schools on behalf of students</li>
                  <li>Used only under teacher supervision and guidance</li>
                  <li>Subject to school acceptable use policies</li>
                  <li>May be monitored by teachers and school administrators</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceptable Use</h3>
              <div className="text-gray-700 space-y-4">
                <p>You agree not to use the platform to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Transmit any harmful, offensive, or inappropriate content</li>
                  <li>Interfere with or disrupt the platform or servers</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect personal information about other users</li>
                  <li>Use automated systems to access the platform</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Responsibilities</h3>
              <div className="text-gray-700 space-y-4">
                <p>Educational institutions using LanguageGems agree to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Student Consent:</strong> Obtain all necessary parental/guardian consents for student participation</li>
                  <li><strong>Data Governance:</strong> Maintain appropriate data governance policies for student information</li>
                  <li><strong>Authorized Use:</strong> Ensure only authorized teachers and students access the platform</li>
                  <li><strong>Educational Purpose:</strong> Use the platform solely for legitimate educational purposes</li>
                  <li><strong>Compliance:</strong> Comply with applicable education privacy laws (FERPA, COPPA, GDPR)</li>
                  <li><strong>Account Management:</strong> Properly manage user accounts and access permissions</li>
                  <li><strong>Data Requests:</strong> Handle parent/student data access requests appropriately</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Data Protection</h3>
              <div className="text-gray-700 space-y-4">
                <p>LanguageGems commits to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Process student data only as directed by the school for educational purposes</li>
                  <li>Implement appropriate security measures to protect student information</li>
                  <li>Not sell, rent, or trade student personal information</li>
                  <li>Provide schools with tools to manage and export student data</li>
                  <li>Delete student data upon school request or contract termination</li>
                  <li>Notify schools promptly of any data security incidents</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content and Intellectual Property</h3>
              <div className="text-gray-700 space-y-4">
                <p>All content on LanguageGems, including text, graphics, logos, and software, is the property of LanguageGems or its content suppliers and is protected by copyright and intellectual property laws.</p>
                <p>Users may create custom content (vocabularies, exercises) which remains their intellectual property, but they grant us a license to use this content to provide our services.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Limitation of Liability</h3>
              <div className="text-gray-700 space-y-4">
                <p>LanguageGems shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifications</h3>
              <div className="text-gray-700 space-y-4">
                <p>We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page and updating the "Last updated" date.</p>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
              <p className="text-blue-700 text-sm mb-2">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="text-blue-700 text-sm">
                <p><strong>Email:</strong> support@languagegems.com</p>
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