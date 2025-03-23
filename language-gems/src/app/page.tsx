"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <div className="w-full relative min-h-[700px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/homepage/backgroundpattern.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
        <div className="container mx-auto px-4 z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-900 leading-tight mb-6">
                DISCOVER THE GEMS OF LANGUAGE LEARNING
              </h1>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-lg">
                <p className="text-lg md:text-xl text-blue-800 font-medium">
                  Interactive games and custom lessons designed for children to master language skills through play
                </p>
              </div>
              <Link href="/games" className="inline-block bg-yellow-400 text-blue-800 font-bold rounded-full px-10 py-5 text-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                Start Learning Now
              </Link>
            </div>
            <div className="lg:col-span-7 flex justify-center relative">
              <div className="relative w-[500px] h-[500px]">
                <Image
                  src="/images/homepage/hero.png"
                  alt="Children Learning Languages"
                  width={500}
                  height={500}
                  priority
                  className="drop-shadow-2xl"
                />
              </div>
              
              {/* Progress Tracking Speech Bubble */}
              <div className="absolute top-10 right-5 bg-white rounded-2xl p-4 shadow-lg transform rotate-6 w-64">
                <h3 className="text-blue-700 font-bold text-lg mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-600">Track your learning journey with fun achievements and rewards!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Gems - Adding more to match prototype */}
        <div className="absolute top-[15%] left-[5%] animate-float">
          <div className="w-12 h-12 bg-blue-400 opacity-80 rounded-lg transform rotate-45"></div>
        </div>
        <div className="absolute bottom-[20%] right-[10%] animate-float-delayed">
          <div className="w-10 h-10 bg-purple-400 opacity-80 rounded-lg transform rotate-12"></div>
        </div>
        <div className="absolute top-[40%] left-[15%] animate-float-slow">
          <div className="w-14 h-14 bg-yellow-400 opacity-80 rounded-lg transform -rotate-12"></div>
        </div>
        <div className="absolute top-[30%] right-[20%] animate-float-slow-delayed">
          <div className="w-8 h-8 bg-pink-400 opacity-80 rounded-lg transform rotate-20"></div>
        </div>
        <div className="absolute bottom-[40%] left-[40%] animate-float">
          <div className="w-9 h-9 bg-cyan-400 opacity-80 rounded-lg transform rotate-30"></div>
        </div>
        <div className="absolute top-[70%] right-[25%] animate-float-delayed">
          <div className="w-11 h-11 bg-red-400 opacity-80 rounded-lg transform -rotate-15"></div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="w-full bg-gradient-to-b from-cyan-500 to-fuchsia-400 py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Games Card */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 relative mr-3">
                <Image
                  src="/images/homepage/feature-section-cards/gamesicon.png"
                  alt="Games Icon"
                  width={64}
                  height={64}
                />
              </div>
              <h2 className="text-3xl font-bold">Games</h2>
            </div>
            <p className="text-lg mb-8">
              Discover fun game areas of language skills to boost your learning journey
            </p>
            <div className="flex space-x-3 mb-6">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔤</span>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧩</span>
              </div>
            </div>
            <Link href="/games" className="inline-block bg-yellow-400 text-blue-700 font-bold rounded-full px-8 py-3 text-lg">
              Play Now
            </Link>
          </div>
          
          {/* Custom Lessons Card */}
          <div className="bg-yellow-400 rounded-3xl p-8 text-blue-900 shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 relative mr-3">
                <Image
                  src="/images/homepage/feature-section-cards/custom-lessons.png"
                  alt="Custom Lessons Icon"
                  width={64}
                  height={64}
                />
              </div>
              <h2 className="text-3xl font-bold">Custom Lessons</h2>
            </div>
            <p className="text-lg mb-10">
              Personalized content with words and patterns for structured learning and faster absorption
            </p>
            <Link href="/themes" className="inline-block bg-blue-600 text-white font-bold rounded-full px-8 py-3 text-lg">
              Explore
            </Link>
          </div>
          
          {/* Word Pop Card */}
          <div className="bg-purple-600 rounded-3xl p-8 text-white shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl">🔠</span>
              </div>
              <h2 className="text-3xl font-bold">Word Pop</h2>
            </div>
            <p className="text-lg mb-10">
              Interactive letter, vowel, and word-based fun vocabulary games for learners
            </p>
            <Link href="/games/word-pop" className="inline-block bg-yellow-400 text-purple-700 font-bold rounded-full px-8 py-3 text-lg">
              Play Word Pop
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Tablet Section */}
      <div className="w-full bg-teal-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white">Demo Tablet</h2>
            <p className="text-xl text-white mt-2">Fun with interactive classroom action!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Experience Our Interactive Learning App</h3>
              <p className="text-xl text-white mb-8">
                Watch how our app makes learning fun and engaging for children of all ages.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400 text-2xl">✓</span>
                  <p className="text-white text-lg">Perfect for classrooms and home learning</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400 text-2xl">✓</span>
                  <p className="text-white text-lg">Teacher-approved content</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400 text-2xl">✓</span>
                  <p className="text-white text-lg">Supports multiple language learning paths</p>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Tablet Device Frame */}
              <div className="w-full relative mx-auto bg-gray-800 rounded-[40px] p-5 shadow-2xl max-w-md overflow-hidden">
                <div className="relative pb-[56.25%] rounded-2xl overflow-hidden">
                  <video 
                    className="absolute inset-0 w-full h-full object-cover"
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
              
              {/* Feature Callouts */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl p-3 shadow-lg transform -rotate-6 w-48">
                <p className="text-blue-700 font-bold text-sm">Interactive vocabulary games!</p>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-lg transform rotate-6 w-48">
                <p className="text-blue-700 font-bold text-sm">Learn with friends!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-2">💎</span>
                <h3 className="text-2xl font-bold">Language Gems</h3>
              </div>
              <p className="text-blue-200 mb-4">
                Making language learning fun and effective for children around the world.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4 text-yellow-400">Learning</h4>
              <ul className="space-y-2">
                <li><Link href="/games" className="text-blue-200 hover:text-white transition-colors">Games</Link></li>
                <li><Link href="/themes" className="text-blue-200 hover:text-white transition-colors">Custom Lessons</Link></li>
                <li><Link href="/progress" className="text-blue-200 hover:text-white transition-colors">Progress Tracking</Link></li>
                <li><Link href="/community" className="text-blue-200 hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4 text-yellow-400">About Us</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-blue-200 hover:text-white transition-colors">Our Story</Link></li>
                <li><Link href="/team" className="text-blue-200 hover:text-white transition-colors">Team</Link></li>
                <li><Link href="/blog" className="text-blue-200 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-blue-200 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4 text-yellow-400">For Schools</h4>
              <ul className="space-y-2">
                <li><Link href="/schools" className="text-blue-200 hover:text-white transition-colors">School Programs</Link></li>
                <li><Link href="/teachers" className="text-blue-200 hover:text-white transition-colors">Teacher Resources</Link></li>
                <li><Link href="/schools/pricing" className="text-blue-200 hover:text-white transition-colors">School Pricing</Link></li>
                <li><Link href="/partnership" className="text-blue-200 hover:text-white transition-colors">Partnership</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">© 2023 Language Gems. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-blue-200 text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-blue-200 text-sm hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-blue-200 text-sm hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
