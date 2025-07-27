import Link from 'next/link';
import Footer from '../../components/layout/Footer';

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
              <div className="group bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm p-8 rounded-2xl border border-indigo-400/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-pink-300">Customizable Vocabulary</h3>
                <p className="text-gray-300 leading-relaxed">Create and assign custom vocabulary lists that align with your curriculum and lesson plans. Perfect integration with your teaching style.</p>
              </div>
              
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
        
        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-16">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                What Educators Say
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="group bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm p-8 rounded-2xl border border-indigo-400/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">JD</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">Jane Doe</h3>
                    <p className="text-blue-300">Spanish Teacher</p>
                    <p className="text-gray-400 text-sm">Lincoln High School</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic text-lg leading-relaxed">
                  "LanguageGems has transformed my classroom. The customizable vocab lists allow me to perfectly align with our textbook, and students love the gamified approach to learning."
                </blockquote>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-indigo-900/30 to-pink-900/30 backdrop-blur-sm p-8 rounded-2xl border border-indigo-400/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">JS</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">John Smith</h3>
                    <p className="text-pink-300">French Department Head</p>
                    <p className="text-gray-400 text-sm">Westview College</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic text-lg leading-relaxed">
                  "The analytics have given our department incredible insights into student struggles and strengths. We've been able to adjust our curriculum based on real data, improving outcomes dramatically."
                </blockquote>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
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