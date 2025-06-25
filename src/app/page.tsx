"use client";

import Link from 'next/link';
import Image from 'next/image';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
      {/* Hero Section */}
      <div className="w-full relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-[url('/images/homepage/subtle-pattern.svg')] opacity-5"></div>
        
        <div className="container mx-auto px-6 z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  For Teachers & Students
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                Discover the Power of 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Language Learning
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Interactive games, comprehensive lessons, and engaging content designed for modern language education
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/games" className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                  Start Learning
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link href="/resources" className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                  Free Worksheets
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>1000+ Schools</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>50+ Languages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Award Winning</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6 flex justify-center relative">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <Image
                    src="/images/homepage/hero.png"
                    alt="Language Learning Platform"
                    width={500}
                    height={400}
                    priority
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
                
                {/* Floating Feature Cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-slate-100 max-w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">Free Resources</span>
                  </div>
                  <p className="text-xs text-slate-600">Worksheets, activities & materials</p>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-slate-100 max-w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">Curriculum Aligned</span>
                  </div>
                  <p className="text-xs text-slate-600">Meets educational standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-60 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-60 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-60 animate-float-slow"></div>
      </div>

      {/* Feature Cards Section */}
      <div className="w-full bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Everything You Need for Language Learning
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools designed for educators and students to make language learning engaging and effective
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-md mx-auto">
            {/* Interactive Games Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Interactive Games</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Engaging vocabulary games, pronunciation challenges, and skill-building activities that make learning fun and memorable.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Vocabulary</span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Grammar</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Pronunciation</span>
              </div>
              <Link href="/games" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Explore Games
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  See It In Action
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Experience Modern Language Education
              </h2>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Watch how our platform transforms traditional language learning with interactive content and real-time feedback.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Classroom & Remote Learning</h4>
                    <p className="text-slate-600">Perfect for in-person and online education</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Curriculum Aligned Content</h4>
                    <p className="text-slate-600">Meets national and international standards</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Instant Feedback</h4>
                    <p className="text-slate-600">Real-time assessment and guidance</p>
                  </div>
                </div>
              </div>
              
              <Link href="/demo" className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                Schedule Demo
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
            
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-slate-300 text-sm">LanguageGems Platform</span>
                </div>
                <div className="aspect-video">
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                  >
                    <source src="/images/homepage/childrenusingtablet.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      </main>
      
      <Footer />
    </div>
  );
}
