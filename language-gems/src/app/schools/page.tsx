import Link from 'next/link';
import Navigation from 'gems/components/layout/Navigation';
import Footer from 'gems/components/layout/Footer';

export default function SchoolsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                LanguageGems for Schools
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Empower your students with an engaging, customizable language learning platform 
                designed specifically for educational environments.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/schools/demo" className="gem-button pink-gem-button">
                  Request a Demo
                </Link>
                <Link href="/schools/pricing" className="gem-button">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 px-4 bg-indigo-950/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Designed for Classrooms</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-pink-300">Customizable Vocabulary</h3>
                <p className="text-gray-300">Create and assign custom vocabulary lists that align with your curriculum and lesson plans.</p>
              </div>
              
              <div className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-cyan-300">Progress Tracking</h3>
                <p className="text-gray-300">Monitor student progress with detailed analytics and insights to inform your teaching strategy.</p>
              </div>
              
              <div className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-300">Homework Management</h3>
                <p className="text-gray-300">Assign, track, and grade homework assignments directly through the platform with automatic feedback.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">What Educators Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Jane Doe</h3>
                    <p className="text-gray-400">Spanish Teacher, Lincoln High School</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic">
                  "LanguageGems has transformed my classroom. The customizable vocab lists allow me to perfectly align with our textbook, and students love the gamified approach to learning."
                </blockquote>
              </div>
              
              <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">JS</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">John Smith</h3>
                    <p className="text-gray-400">French Department Head, Westview College</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic">
                  "The analytics have given our department incredible insights into student struggles and strengths. We've been able to adjust our curriculum based on real data, improving outcomes dramatically."
                </blockquote>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing CTA */}
        <section className="py-16 px-4 bg-indigo-900/30">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Language Learning?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Contact us today for school and district pricing options. Volume discounts available for multiple classrooms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/schools/contact" className="gem-button pink-gem-button">
                Contact Sales
              </Link>
              <Link href="/schools/faq" className="gem-button">
                School FAQs
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 