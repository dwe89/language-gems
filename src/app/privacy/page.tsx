import { Metadata } from 'next';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Language Gems',
  description: 'Learn how LanguageGems protects your privacy and handles your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-gray-400 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20">
            <div className="prose prose-lg prose-invert max-w-none">
              
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-cyan-300 mb-4">Information We Collect</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We collect information you provide directly to us, such as when you:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• Create an account or profile</li>
                    <li>• Use our language learning platform</li>
                    <li>• Contact us for support</li>
                    <li>• Subscribe to our newsletters</li>
                    <li>• Participate in surveys or feedback</li>
                  </ul>
                  <p>This may include your name, email address, school information, learning progress, and usage data.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-pink-300 mb-4">How We Use Your Information</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We use the information we collect to:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• Provide and maintain our services</li>
                    <li>• Personalize your learning experience</li>
                    <li>• Track your progress and provide analytics</li>
                    <li>• Communicate with you about our services</li>
                    <li>• Improve our platform and develop new features</li>
                    <li>• Ensure security and prevent fraud</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-purple-300 mb-4">Information Sharing</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• With your explicit consent</li>
                    <li>• To school administrators (for school accounts)</li>
                    <li>• To service providers who assist in our operations</li>
                    <li>• When required by law or to protect our rights</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-amber-300 mb-4">Data Security</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure data storage and backup procedures</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Limited access to personal information by employees</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-green-300 mb-4">COPPA Compliance</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We are committed to protecting children's privacy. For users under 13:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• We require parental or school consent before collecting information</li>
                    <li>• We collect only the minimum information necessary for educational purposes</li>
                    <li>• Parents and schools can review and delete children's information</li>
                    <li>• We do not use children's information for marketing purposes</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-cyan-300 mb-4">Your Rights</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You have the right to:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• Access your personal information</li>
                    <li>• Correct inaccurate information</li>
                    <li>• Delete your account and associated data</li>
                    <li>• Export your data in a portable format</li>
                    <li>• Opt out of marketing communications</li>
                  </ul>
                  <p>To exercise these rights, please contact us at privacy@languagegems.com</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-pink-300 mb-4">Contact Us</h2>
                <div className="text-gray-300 space-y-4">
                  <p>If you have any questions about this Privacy Policy, please contact us:</p>
                  <div className="bg-indigo-900/40 rounded-lg p-6 mt-4">
                    <p><strong>Email:</strong> privacy@languagegems.com</p>
                    <p><strong>Address:</strong> LanguageGems Privacy Team<br />
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
