"use client";

import Link from 'next/link';
import Image from 'next/image';
import Footer from 'gems/components/layout/Footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-950 to-indigo-950">
      {/* Hero Section */}
      <div className="relative w-full flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center bg-contain opacity-10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent"></div>
          
          {/* Floating gems animation */}
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-md rotate-45 animate-float shadow-lg shadow-purple-400/50"></div>
          <div className="absolute top-3/4 left-1/3 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-md rotate-12 animate-float-slow shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-md rotate-[30deg] animate-float-delayed shadow-lg shadow-emerald-400/50"></div>
          <div className="absolute top-2/3 right-1/3 w-7 h-7 bg-gradient-to-br from-pink-400 to-pink-600 rounded-md rotate-[15deg] animate-float-slow-delayed shadow-lg shadow-pink-400/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-6xl md:text-8xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 animate-shimmer">
              Language Gems
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mt-2 max-w-3xl mx-auto">
              Unlock your language learning potential with our immersive, interactive platform
            </p>
          </div>

          {/* Interactive World Map */}
          <div className="relative w-full h-[40vh] my-8 flex items-center justify-center">
            <div className="relative w-full max-w-4xl h-full bg-indigo-950/40 rounded-xl overflow-hidden backdrop-blur-sm border border-indigo-500/20">
              {/* World Map with Glowing Points */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[90%] h-[90%] bg-[url('/world.svg')] bg-no-repeat bg-center bg-contain opacity-70">
                  {/* Language hotspots */}
                  <div className="absolute top-[25%] left-[20%] w-4 h-4 bg-purple-500 rounded-full animate-ping-slow" data-language="Spanish"></div>
                  <div className="absolute top-[20%] left-[48%] w-4 h-4 bg-cyan-500 rounded-full animate-ping-delayed" data-language="French"></div>
                  <div className="absolute top-[22%] left-[52%] w-4 h-4 bg-green-500 rounded-full animate-ping-slow-delayed" data-language="German"></div>
                  <div className="absolute top-[30%] left-[80%] w-4 h-4 bg-pink-500 rounded-full animate-ping" data-language="Japanese"></div>
                  <div className="absolute top-[35%] left-[77%] w-4 h-4 bg-amber-500 rounded-full animate-ping-delayed" data-language="Chinese"></div>
                </div>
              </div>

              {/* Overlaid Gems */}
              <div className="absolute top-[20%] left-[15%] w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-md rotate-45 shadow-lg shadow-purple-500/50 animate-hover"></div>
              <div className="absolute top-[15%] left-[45%] w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-md rotate-12 shadow-lg shadow-cyan-500/50 animate-hover-delayed"></div>
              <div className="absolute top-[25%] left-[75%] w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-md rotate-[30deg] shadow-lg shadow-pink-500/50 animate-hover-slow"></div>
              <div className="absolute bottom-[20%] left-[30%] w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md rotate-[15deg] shadow-lg shadow-amber-500/50 animate-hover-slow-delayed"></div>
              <div className="absolute bottom-[25%] right-[20%] w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-md rotate-[60deg] shadow-lg shadow-emerald-500/50 animate-hover"></div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link href="/languages" className="gem-button text-lg px-10 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform transition-all hover:-translate-y-1">
              Get Started
            </Link>
            <Link href="/about" className="gem-button-secondary text-lg px-10 py-3 bg-transparent border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 font-medium rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transform transition-all hover:-translate-y-1">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="w-full bg-indigo-900/40 backdrop-blur-md py-16 border-y border-indigo-500/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Choose Your Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {[
              {name: 'English', icon: '🇬🇧', color: 'from-blue-500 to-blue-700'},
              {name: 'Spanish', icon: '🇪🇸', color: 'from-yellow-500 to-red-600'},
              {name: 'French', icon: '🇫🇷', color: 'from-blue-500 to-red-600'},
              {name: 'German', icon: '🇩🇪', color: 'from-red-500 to-yellow-600'},
              {name: 'Japanese', icon: '🇯🇵', color: 'from-red-500 to-white'},
              {name: 'Chinese', icon: '🇨🇳', color: 'from-red-600 to-red-700'}
            ].map((lang) => (
              <Link 
                key={lang.name} 
                href={`/learn/${lang.name.toLowerCase()}`}
                className={`flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br ${lang.color} bg-opacity-80 hover:bg-opacity-100 shadow-lg transform transition-all hover:scale-105 hover:shadow-xl`}
              >
                <span className="text-4xl mb-2">{lang.icon}</span>
                <span className="text-white font-bold">{lang.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-20 px-4 bg-gradient-to-b from-indigo-950 to-gray-950">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">Features & Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-indigo-900/20 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transform transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">Global Languages</h3>
              <p className="text-gray-300 leading-relaxed">Choose from multiple languages and access specialized vocabulary tailored to your needs.</p>
            </div>
            
            <div className="bg-indigo-900/20 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transform transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-pink-300">Interactive Games</h3>
              <p className="text-gray-300 leading-relaxed">Learn through engaging memory games, word associations, and verb conjugation challenges.</p>
            </div>
            
            <div className="bg-indigo-900/20 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transform transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H5.52a2.5 2.5 0 01-2.5-2.5v0a2.5 2.5 0 012.5-2.5H12a2.5 2.5 0 012.5 2.5v0A2.5 2.5 0 0112 4h2.5c1.93 0 3.5 1.57 3.5 3.5V8a4 4 0 01-4 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-300">Gem Rewards</h3>
              <p className="text-gray-300 leading-relaxed">Collect unique gems as you progress, unlocking new levels and tracking your achievements.</p>
            </div>
            
            <div className="bg-indigo-900/20 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transform transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-300">Progress Tracking</h3>
              <p className="text-gray-300 leading-relaxed">Visualize your learning journey with detailed metrics and personalized recommendations.</p>
            </div>
            
            <div className="bg-indigo-900/20 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transform transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-300">Teacher Dashboard</h3>
              <p className="text-gray-300 leading-relaxed">Educators can monitor student progress, assign tasks, and create custom learning paths.</p>
            </div>
            
            <div className="bg-indigo-900/20 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transform transition-all hover:-translate-y-1">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-300">School Integration</h3>
              <p className="text-gray-300 leading-relaxed">Designed for classroom use with features for multiple classes, assignments, and academic tracking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials / Stats Section */}
      <div className="w-full py-16 px-4 bg-indigo-950/80">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500 mb-2">1M+</div>
              <p className="text-gray-300">Active Learners</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-500 mb-2">6</div>
              <p className="text-gray-300">Languages Available</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-red-500 mb-2">500+</div>
              <p className="text-gray-300">Partner Schools</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -500px 0;
          }
          100% {
            background-position: 500px 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-20px) rotate(45deg);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(12deg);
          }
          50% {
            transform: translateY(-15px) rotate(12deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(30deg);
          }
          50% {
            transform: translateY(-25px) rotate(30deg);
          }
        }
        
        @keyframes float-slow-delayed {
          0%, 100% {
            transform: translateY(0) rotate(15deg);
          }
          50% {
            transform: translateY(-10px) rotate(15deg);
          }
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes ping-delayed {
          10%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes ping-slow-delayed {
          20%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes hover {
          0%, 100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-10px) rotate(45deg);
          }
        }
        
        @keyframes hover-delayed {
          0%, 100% {
            transform: translateY(0) rotate(12deg);
          }
          50% {
            transform: translateY(-8px) rotate(12deg);
          }
        }
        
        @keyframes hover-slow {
          0%, 100% {
            transform: translateY(0) rotate(30deg);
          }
          50% {
            transform: translateY(-12px) rotate(30deg);
          }
        }
        
        @keyframes hover-slow-delayed {
          0%, 100% {
            transform: translateY(0) rotate(15deg);
          }
          50% {
            transform: translateY(-15px) rotate(15deg);
          }
        }
        
        .animate-shimmer {
          background-size: 1000px 100%;
          animation: shimmer 8s infinite linear;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow-delayed {
          animation: float-slow-delayed 9s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-delayed {
          animation: ping-delayed 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-slow-delayed {
          animation: ping-slow-delayed 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-hover {
          animation: hover 4s ease-in-out infinite;
        }
        
        .animate-hover-delayed {
          animation: hover-delayed 5s ease-in-out infinite;
        }
        
        .animate-hover-slow {
          animation: hover-slow 6s ease-in-out infinite;
        }
        
        .animate-hover-slow-delayed {
          animation: hover-slow-delayed 7s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
