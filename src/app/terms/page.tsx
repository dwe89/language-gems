import { Metadata } from 'next';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Language Gems',
  description: 'Terms and conditions for using the LanguageGems platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Please read these terms carefully before using our language learning platform.
            </p>
            <p className="text-gray-400 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20">
            <div className="prose prose-lg prose-invert max-w-none">
              
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-cyan-300 mb-4">Acceptance of Terms</h2>
                <div className="text-gray-300 space-y-4">
                  <p>By accessing and using LanguageGems, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-pink-300 mb-4">Use License</h2>
                <div className="text-gray-300 space-y-4">
                  <p>Permission is granted to temporarily use LanguageGems for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• Modify or copy the materials</li>
                    <li>• Use the materials for any commercial purpose or for any public display</li>
                    <li>• Attempt to reverse engineer any software contained on the platform</li>
                    <li>• Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                  <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-purple-300 mb-4">User Accounts</h2>
                <div className="text-gray-300 space-y-4">
                  <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• Safeguarding your account password</li>
                    <li>• All activities that occur under your account</li>
                    <li>• Notifying us immediately of any unauthorized use</li>
                    <li>• Ensuring your account information remains current</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-amber-300 mb-4">Acceptable Use</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You agree not to use the platform to:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• Violate any applicable laws or regulations</li>
                    <li>• Transmit any harmful, offensive, or inappropriate content</li>
                    <li>• Interfere with or disrupt the platform or servers</li>
                    <li>• Impersonate any person or entity</li>
                    <li>• Collect personal information about other users</li>
                    <li>• Use automated systems to access the platform</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-green-300 mb-4">Educational Use</h2>
                <div className="text-gray-300 space-y-4">
                  <p>For educational institutions using our platform:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• Schools are responsible for obtaining necessary consents for student use</li>
                    <li>• Student data will be used solely for educational purposes</li>
                    <li>• Schools may export student data upon request</li>
                    <li>• We will cooperate with schools to ensure FERPA compliance</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-cyan-300 mb-4">Content and Intellectual Property</h2>
                <div className="text-gray-300 space-y-4">
                  <p>All content on LanguageGems, including text, graphics, logos, and software, is the property of LanguageGems or its content suppliers and is protected by copyright and intellectual property laws.</p>
                  <p>Users may create custom content (vocabularies, exercises) which remains their intellectual property, but they grant us a license to use this content to provide our services.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-pink-300 mb-4">Limitation of Liability</h2>
                <div className="text-gray-300 space-y-4">
                  <p>LanguageGems shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-purple-300 mb-4">Modifications</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page and updating the "Last updated" date.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-amber-300 mb-4">Contact Information</h2>
                <div className="text-gray-300 space-y-4">
                  <p>If you have any questions about these Terms of Service, please contact us:</p>
                  <div className="bg-indigo-900/40 rounded-lg p-6 mt-4">
                    <p><strong>Email:</strong> legal@languagegems.com</p>
                    <p><strong>Address:</strong> LanguageGems Legal Team<br />
                    123 Education Drive<br />
                    Learning City, LC 12345</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}