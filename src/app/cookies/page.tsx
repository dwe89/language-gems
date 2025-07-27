import { Metadata } from 'next';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Cookie Policy | Language Gems',
  description: 'Learn about how LanguageGems uses cookies and similar technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Cookie Policy
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Learn about how we use cookies and similar technologies to improve your experience.
            </p>
            <p className="text-gray-400 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20">
            <div className="prose prose-lg prose-invert max-w-none">
              
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-amber-300 mb-4">What Are Cookies?</h2>
                <div className="text-gray-300 space-y-4">
                  <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and how you use our platform.</p>
                  <p>We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted or expired).</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-cyan-300 mb-4">Types of Cookies We Use</h2>
                <div className="text-gray-300 space-y-6">
                  
                  <div className="bg-indigo-900/40 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-cyan-400 mb-3">🔐 Essential Cookies</h3>
                    <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
                    <ul className="mt-3 space-y-1 ml-4">
                      <li>• Authentication and login status</li>
                      <li>• Security and fraud prevention</li>
                      <li>• Load balancing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-900/40 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-3">📊 Analytics Cookies</h3>
                    <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                    <ul className="mt-3 space-y-1 ml-4">
                      <li>• Google Analytics for usage statistics</li>
                      <li>• Performance monitoring</li>
                      <li>• Error tracking and debugging</li>
                    </ul>
                  </div>
                  
                  <div className="bg-pink-900/40 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-pink-400 mb-3">⚙️ Functional Cookies</h3>
                    <p>These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.</p>
                    <ul className="mt-3 space-y-1 ml-4">
                      <li>• Language preferences</li>
                      <li>• Theme and display settings</li>
                      <li>• Learning progress tracking</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-900/40 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-green-400 mb-3">📢 Marketing Cookies</h3>
                    <p>These cookies are used to track visitors across websites to display relevant and engaging advertisements.</p>
                    <ul className="mt-3 space-y-1 ml-4">
                      <li>• Social media integration</li>
                      <li>• Advertising personalization</li>
                      <li>• Campaign effectiveness tracking</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-purple-300 mb-4">Third-Party Cookies</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We may also use third-party cookies from trusted partners to enhance your experience:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• <strong>Google Analytics:</strong> To understand website usage and improve our services</li>
                    <li>• <strong>YouTube:</strong> For embedded educational videos</li>
                    <li>• <strong>Social Media Platforms:</strong> For social sharing functionality</li>
                    <li>• <strong>Educational Partners:</strong> For integrated learning tools</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-cyan-300 mb-4">Managing Your Cookie Preferences</h2>
                <div className="text-gray-300 space-y-4">
                  <p>You have several options for managing cookies:</p>
                  
                  <div className="bg-indigo-900/40 rounded-lg p-6 mt-4">
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">Browser Settings</h3>
                    <p>Most browsers allow you to:</p>
                    <ul className="space-y-1 ml-4 mt-2">
                      <li>• View and delete cookies</li>
                      <li>• Block cookies from specific sites</li>
                      <li>• Block third-party cookies</li>
                      <li>• Clear all cookies when you close the browser</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-900/40 rounded-lg p-6 mt-4">
                    <h3 className="text-lg font-bold text-purple-400 mb-3">Cookie Consent Manager</h3>
                    <p>When you first visit our site, you can choose which types of cookies to accept through our consent banner. You can change your preferences at any time by clicking the "Cookie Settings" link in our footer.</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-pink-300 mb-4">Impact of Disabling Cookies</h2>
                <div className="text-gray-300 space-y-4">
                  <p>If you choose to disable cookies, some features of our platform may not work properly:</p>
                  <ul className="space-y-2 ml-6">
                    <li>• You may need to log in each time you visit</li>
                    <li>• Your learning progress may not be saved</li>
                    <li>• Personalized content and recommendations may not work</li>
                    <li>• Some interactive features may be unavailable</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-green-300 mb-4">Updates to This Policy</h2>
                <div className="text-gray-300 space-y-4">
                  <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-amber-300 mb-4">Contact Us</h2>
                <div className="text-gray-300 space-y-4">
                  <p>If you have any questions about our use of cookies, please contact us:</p>
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
