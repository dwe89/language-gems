
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import { Metadata } from 'next';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy | Student Data Protection | Language Gems',
  description: 'Privacy policy and student data protection information for Language Gems educational platform. GDPR compliant and school-safe.',
  canonical: '/privacy'
});


export default function PrivacyPolicyPage() {
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
                <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
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
            <Lock className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Your Privacy Matters to Us</h2>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              LanguageGems is a B2B educational platform designed for schools and educational institutions. This policy explains how we collect, use, and protect information when schools use our platform with their students.
            </p>
            <p className="mb-6 text-sm text-gray-500">Last updated: 2025-08-04</p> {/* Updated date format */}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Important: B2B Educational Service</h3>
              <p className="text-blue-700 text-sm">
                LanguageGems provides services directly to schools and educational institutions. Schools are responsible for obtaining appropriate consents for student participation and remain the primary controllers of student data. We are committed to entering into Data Processing Agreements (DPAs) with schools as required by relevant data protection laws.
              </p>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Information We Collect</h3>
              <div className="text-gray-700 space-y-4">
                <h4 className="font-semibold text-gray-800">Teacher/Administrator Data:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Account information (name, email, school affiliation)</li>
                  <li>Professional information (role, department, teaching subjects)</li>
                  <li>Platform usage data (features accessed, content created)</li>
                  <li>Communication preferences and support interactions</li>
                </ul>

                <h4 className="font-semibold text-gray-800">Student Data (Collected on Behalf of Schools):</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Basic identifiers (username, class assignment, grade level)</li>
                  <li>Educational progress data (game scores, exercise completion, XP earned)</li>
                  <li>Learning analytics (time spent, accuracy rates, skill progression)</li>
                  <li>Assessment results and performance metrics</li>
                  <li>Gamification data (achievements, badges, streaks)</li>
                  <li>Technical data (device type, browser, IP address for security)</li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> We collect minimal personal information about students. Schools determine what student data is necessary for educational purposes.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Use Information</h3>
              <div className="text-gray-700 space-y-4">
                <h4 className="font-semibold text-gray-800">Teacher/Administrator Data:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Provide access to teacher dashboard and administrative tools</li>
                  <li>Enable class management and student assignment features</li>
                  <li>Deliver educational analytics and progress reports</li>
                  <li>Provide customer support and platform assistance</li>
                  <li>Send service updates and educational resources</li>
                </ul>

                <h4 className="font-semibold text-gray-800">Student Data (Processed on Behalf of Schools):</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Deliver personalized educational content and games</li>
                  <li>Track learning progress and generate performance analytics</li>
                  <li>Enable gamification features (XP, achievements, leaderboards)</li>
                  <li>Provide AI-powered insights to teachers about student progress</li>
                  <li>Generate automated assessments and feedback</li>
                  <li>Ensure platform security and prevent misuse</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-800 text-sm">
                    <strong>Educational Purpose Only:</strong> All student data processing is strictly for educational purposes as directed by the school.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Sharing</h3>
              <div className="text-gray-700 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-800 mb-2">We Never Sell Student Data</h4>
                  <p className="text-red-700 text-sm">LanguageGems does not sell, rent, or trade student personal information to third parties for commercial purposes.</p>
                </div>

                <p>We may share information only in the following limited circumstances:</p>

                <h4 className="font-semibold text-gray-800">Student Data Sharing:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>With the School:</strong> Student progress and performance data is shared with authorized school personnel (teachers, administrators)</li>
                  <li><strong>Service Providers:</strong> Trusted third-party service providers (e.g., cloud hosting, analytics, text-to-speech, email communication) who assist us in operating the platform. These providers are strictly bound by confidentiality and data processing agreements.</li> {/* Updated */}
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect safety</li>
                </ul>

                <h4 className="font-semibold text-gray-800">Teacher Data Sharing:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>With school administrators as part of institutional accounts</li>
                  <li>With service providers under data processing agreements</li>
                  <li>With explicit consent for marketing or partnership opportunities</li>
                  <li>When required by law</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Security</h3>
              <div className="text-gray-700 space-y-4">
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure data storage and backup procedures</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information by authorized employees</li>
                  <li>Adherence to industry best practices for data protection</li> {/* Added */}
                </ul>
              </div>
            </section>

            {/* NEW SECTION: Data Retention */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h3>
              <div className="text-gray-700 space-y-4">
                <p>We retain personal information for as long as necessary to provide the LanguageGems service to schools and their students, and to comply with our legal obligations.</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Active Accounts:</strong> Data associated with active school and student accounts is retained while the account is open.</li>
                  <li><strong>Account Closure:</strong> Upon a school's request to close an account, or termination of service, student data will be securely deleted or anonymized within a specified period, typically 90 days, unless a longer retention period is required by law or specific agreement with the school.</li>
                  <li><strong>Teacher Data:</strong> Teacher account data is retained for administrative and support purposes for a reasonable period after account closure, or as required by law.</li>
                </ul>
              </div>
            </section>

            {/* NEW SECTION: International Data Transfers */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">International Data Transfers</h3>
              <div className="text-gray-700 space-y-4">
                <p>LanguageGems operates globally, and your information may be transferred to, stored, and processed in countries outside of the United Kingdom and the European Economic Area (EEA), such as the United States, where our cloud service providers (e.g., Google Cloud, AWS) are located.</p>
                <p>When we transfer your personal data internationally, we implement appropriate safeguards to ensure your data receives an adequate level of protection as required by applicable data protection laws, such as through the use of Standard Contractual Clauses (SCCs) approved by the European Commission, or reliance on other lawful transfer mechanisms.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Children's Privacy (COPPA & GDPR-K Compliance)</h3>
              <div className="text-gray-700 space-y-4">
                <p>LanguageGems is designed for use in educational settings with appropriate school oversight:</p>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-purple-800 mb-2">School-Based Consent Model</h4>
                  <p className="text-purple-700 text-sm">Schools act as the primary consent mechanism for student participation, operating under their educational authority and existing parental consent processes.</p>
                </div>

                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Minimal Data Collection:</strong> We collect only data necessary for educational purposes</li>
                  <li><strong>No Behavioral Advertising:</strong> Student data is never used for advertising or marketing</li>
                  <li><strong>School Control:</strong> Schools can review, export, or delete student data at any time</li>
                  <li><strong>Parental Rights:</strong> Parents can contact schools to access or delete their child's data</li>
                  <li><strong>Age-Appropriate Design:</strong> Platform features are designed for educational use by minors</li>
                  <li><strong>No Social Features:</strong> Students cannot communicate with unknown users</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Rights & School Responsibilities</h3>
              <div className="text-gray-700 space-y-4">
                <h4 className="font-semibold text-gray-800">For Schools & Teachers:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Access and export all student data from your classes</li>
                  <li>Correct inaccurate student information</li>
                  <li>Delete student accounts and associated data</li>
                  <li>Control which features and data collection are enabled</li>
                  <li>Receive data processing agreements and compliance documentation</li>
                </ul>

                <h4 className="font-semibold text-gray-800">For Parents/Guardians:</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Contact your child's school to review their educational data</li>
                  <li>Request corrections to inaccurate information through the school</li>
                  <li>Request deletion of your child's data through the school</li>
                  <li>Opt your child out of optional platform features</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Contact Process:</strong> For student data requests, please contact your school first. For direct requests to LanguageGems, email us at <a href="mailto:privacy@languagegems.com" className="underline hover:text-blue-900">privacy@languagegems.com</a> with your school's authorization.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Changes to This Privacy Policy</h3>
              <p className="text-blue-700 text-sm mb-2">
                We may update this Privacy Policy from time to time. We will notify schools of any significant changes by posting the new policy on our website or through direct communication. Your continued use of the service after any changes signifies your acceptance of the updated policy.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4"> {/* Adjusted margin-top */}
              <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
              <p className="text-blue-700 text-sm mb-2">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="text-blue-700 text-sm">
                <p><strong>Email:</strong> <a href="mailto:privacy@languagegems.com" className="underline hover:text-blue-900">privacy@languagegems.com</a></p> {/* Prioritize privacy email */}
                <p><strong>General Inquiries:</strong> <a href="mailto:support@languagegems.com" className="underline hover:text-blue-900">support@languagegems.com</a></p> {/* Added general inquiry email */}
                <p><strong>Company:</strong> LanguageGems Ltd</p>
                <p><strong>Website:</strong> <a href="https://www.languagegems.com" className="underline hover:text-blue-900" target="_blank" rel="noopener noreferrer">www.languagegems.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}