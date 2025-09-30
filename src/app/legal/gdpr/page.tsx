import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import Footer from '../../../components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GDPR Compliance - LanguageGems',
  description: 'LanguageGems GDPR compliance information for schools and educational institutions. Learn about our data protection practices and your rights.',
  openGraph: {
    title: 'GDPR Compliance - LanguageGems',
    description: 'LanguageGems GDPR compliance information for schools and educational institutions.',
    url: 'https://languagegems.com/legal/gdpr',
    type: 'website',
  },
};

export default function GDPRPage() {
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
                <h1 className="text-2xl font-bold text-gray-900">GDPR Compliance</h1>
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
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">General Data Protection Regulation Compliance</h2>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="mb-4 text-gray-700 leading-relaxed">
              LanguageGems provides educational services to schools and institutions across the UK and EU. This page outlines our GDPR compliance specifically for our B2B educational platform.
            </p>
            <p className="mb-6 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-800 mb-2">Educational Data Processing</h3>
              <p className="text-amber-700 text-sm">
                Schools remain the Data Controllers for student data. LanguageGems acts as a Data Processor, processing student data only on behalf of and as instructed by schools.
              </p>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Role Under GDPR</h3>
              <div className="text-gray-700 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Data Processor</h4>
                  <p className="text-blue-700 text-sm">For student data, LanguageGems acts as a Data Processor on behalf of schools (Data Controllers). We process student data only according to documented instructions from schools.</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Data Controller</h4>
                  <p className="text-green-700 text-sm">For teacher accounts and direct users, LanguageGems acts as a Data Controller, determining the purposes and means of processing personal data.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lawful Basis for Processing</h3>
              <div className="text-gray-700 space-y-4">
                <p>We process personal data under the following lawful bases:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Contract (Article 6(1)(b)):</strong> Processing necessary for the performance of our educational services</li>
                  <li><strong>Legitimate Interest (Article 6(1)(f)):</strong> For platform improvement, security, and analytics</li>
                  <li><strong>Consent (Article 6(1)(a)):</strong> For marketing communications and optional features</li>
                  <li><strong>Legal Obligation (Article 6(1)(c)):</strong> When required by law</li>
                  <li><strong>Public Task (Article 6(1)(e)):</strong> For educational institutions performing public tasks</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Subject Rights in Educational Settings</h3>
              <div className="text-gray-700 space-y-4">
                <p>GDPR rights apply differently in educational contexts:</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">For Teachers & School Staff</h4>
                  <p className="text-blue-700 text-sm">Full GDPR rights apply directly. Contact us at privacy@languagegems.com for any requests.</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">For Students & Parents</h4>
                  <p className="text-green-700 text-sm">Rights requests should typically be made through your school, as they are the Data Controller for student educational data.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Right of Access</h4>
                    <p className="text-gray-700 text-sm">Schools can export all student data; parents can request through school</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Right to Rectification</h4>
                    <p className="text-gray-700 text-sm">Teachers can correct student data; parents can request corrections through school</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Right to Erasure</h4>
                    <p className="text-gray-700 text-sm">Schools can delete student accounts; parents can request deletion through school</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Right to Restrict Processing</h4>
                    <p className="text-gray-700 text-sm">Schools can disable features; parents can request restrictions through school</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Right to Data Portability</h4>
                    <p className="text-gray-700 text-sm">Schools can export student data in standard formats</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Right to Object</h4>
                    <p className="text-gray-700 text-sm">Schools can opt out of non-essential processing features</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Exercise Your Rights</h3>
              <div className="text-gray-700 space-y-4">
                <p>To exercise any of your GDPR rights, please contact us using the details below:</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm mb-2"><strong>Email:</strong> privacy@languagegems.com</p>
                  <p className="text-blue-700 text-sm mb-2"><strong>Subject Line:</strong> "GDPR Rights Request"</p>
                  <p className="text-blue-700 text-sm">We will respond to your request within 30 days as required by GDPR.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Processing Agreements (DPAs)</h3>
              <div className="text-gray-700 space-y-4">
                <p>For educational institutions, we provide comprehensive Data Processing Agreements that include:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Clear definition of processing purposes and categories of data</li>
                  <li>Detailed security measures and technical safeguards</li>
                  <li>Procedures for handling data subject requests</li>
                  <li>Data breach notification protocols</li>
                  <li>International transfer safeguards</li>
                  <li>Sub-processor management and oversight</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">International Data Transfers</h3>
              <div className="text-gray-700 space-y-4">
                <p>When we transfer personal data outside the UK/EU, we ensure adequate protection through:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved contractual terms</li>
                  <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection</li>
                  <li><strong>Binding Corporate Rules:</strong> For transfers within our corporate group</li>
                  <li><strong>Additional Safeguards:</strong> Technical and organizational measures</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Breach Procedures</h3>
              <div className="text-gray-700 space-y-4">
                <p>In the event of a personal data breach, we will:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Notify the relevant supervisory authority within 72 hours</li>
                  <li>Inform affected data subjects without undue delay if high risk</li>
                  <li>Document all breaches and remedial actions taken</li>
                  <li>Conduct thorough investigations and implement preventive measures</li>
                  <li>Cooperate fully with supervisory authority investigations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy by Design & Default</h3>
              <div className="text-gray-700 space-y-4">
                <p>We implement privacy by design and default through:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Data minimization - collecting only necessary data</li>
                  <li>Purpose limitation - using data only for specified purposes</li>
                  <li>Storage limitation - retaining data only as long as necessary</li>
                  <li>Privacy-friendly default settings</li>
                  <li>Regular privacy impact assessments</li>
                  <li>Built-in privacy controls and user consent mechanisms</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Children's Data Protection</h3>
              <div className="text-gray-700 space-y-4">
                <p>For children under 16 (or the applicable age in your jurisdiction), we:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Obtain appropriate consent from parents/guardians or schools</li>
                  <li>Apply enhanced privacy protections</li>
                  <li>Limit data collection to educational necessities</li>
                  <li>Provide clear information about data processing</li>
                  <li>Enable easy withdrawal of consent</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supervisory Authority</h3>
              <div className="text-gray-700 space-y-4">
                <p>You have the right to lodge a complaint with a supervisory authority. In the UK, this is:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-1"><strong>Information Commissioner's Office (ICO)</strong></p>
                  <p className="text-gray-700 text-sm mb-1">Website: ico.org.uk</p>
                  <p className="text-gray-700 text-sm mb-1">Phone: 0303 123 1113</p>
                  <p className="text-gray-700 text-sm">Email: casework@ico.org.uk</p>
                </div>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Data Protection Officer</h3>
              <p className="text-blue-700 text-sm mb-2">
                For GDPR-related inquiries, please contact our Data Protection Officer:
              </p>
              <div className="text-blue-700 text-sm">
                <p><strong>Email:</strong> dpo@languagegems.com</p>
                <p><strong>General Contact:</strong> privacy@languagegems.com</p>
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