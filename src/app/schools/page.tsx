import Link from 'next/link';
import { Metadata } from 'next';
import Footer from '../../components/layout/Footer';
import { generateMetadata } from '../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Language Gems for Schools | GCSE Spanish, French & German Learning Platform',
  description: 'Transform your MFL department with Language Gems. Interactive GCSE language learning games for Spanish, French, and German. Trusted by UK schools with comprehensive teaching resources.',
  keywords: [
    'GCSE Spanish', 'GCSE French', 'GCSE German', 
    'MFL teaching resources', 'Spanish games', 'French games', 'German games',
    'language learning platform schools', 'MFL department', 'GCSE language learning'
  ],
  canonical: '/schools'
});

export default function SchoolsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400/30 via-transparent to-transparent"></div>
            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  LanguageGems
                </span>
                <br />
                <span className="text-white">for Schools</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                Empower your students with an engaging, customizable language learning platform 
                designed specifically for educational environments.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/schools/demo" className="gem-button pink-gem-button text-lg px-10 py-4">
                  🎯 Request a Demo
                </Link>
                <Link href="/schools/pricing" className="gem-button text-lg px-10 py-4">
                  💎 View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-20 px-4 bg-indigo-950/50 backdrop-blur-sm">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Designed for Classrooms
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Exam Style Assessments */}
              <Link href="/assessments" className="group">
                <div className="bg-gradient-to-br from-indigo-900/40 to-emerald-900/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-emerald-400/60 hover:border-emerald-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                  {/* Added a subtle glow effect */}
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-500/30 rounded-full blur-xl animate-pulse opacity-50"></div>
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">📊</div>
                  <h3 className="text-3xl font-bold mb-4 text-emerald-300 relative z-10">Exam Style Assessments</h3>
                  <p className="text-gray-300 leading-relaxed mb-4 relative z-10">
                    Empower teachers with deep insights into student and class performance through official AQA-aligned Exam Style Assessments, tracking strengths and weaknesses by **GCSE theme, topic, and question type**, including detailed time analytics.
                  </p>
                  <div className="text-amber-400 font-medium group-hover:text-amber-300 relative z-10">
                    Explore Assessment Insights →
                  </div>
                </div>
              </Link>

              {/* Customizable Vocabulary */}
              <div className="group bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm p-8 rounded-2xl border border-indigo-400/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-pink-300">Customizable Vocabulary</h3>
                <p className="text-gray-300 leading-relaxed">Create and assign custom vocabulary lists that align with your curriculum and lesson plans. Perfect integration with your teaching style.</p>
              </div>
              
              {/* Advanced Analytics */}
              <div className="group bg-gradient-to-br from-indigo-900/40 to-blue-900/40 backdrop-blur-sm p-8 rounded-2xl border border-indigo-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-300">Advanced Analytics</h3>
                <p className="text-gray-300 leading-relaxed">Monitor student progress with detailed analytics and insights to inform your teaching strategy. See exactly where students need help.</p>
              </div>
              
              <div className="group bg-gradient-to-br from-indigo-900/40 to-amber-900/40 backdrop-blur-sm p-8 rounded-2xl border border-indigo-400/20 hover:border-amber-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-amber-300">Smart Assignments</h3>
                <p className="text-gray-300 leading-relaxed">Assign, track, and grade homework assignments directly through the platform with automatic feedback and adaptive difficulty.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Removed: Testimonials Section */}
        
        {/* Pricing CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Transform 
              <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}Language Learning?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Contact us today for school and district pricing options. Volume discounts available for multiple classrooms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/schools/contact" className="gem-button pink-gem-button text-lg px-10 py-4">
                📞 Contact Sales
              </Link>
              <Link href="/schools/faq" className="gem-button purple-gem-button text-lg px-10 py-4">
                ❓ School FAQs
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">1000+</div>
                <div className="text-gray-400">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">50k+</div>
                <div className="text-gray-400">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">95%</div>
                <div className="text-gray-400">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">24/7</div>
                <div className="text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
