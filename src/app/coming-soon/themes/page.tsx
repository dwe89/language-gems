'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Upload, Edit3, Share2, BarChart3, Clock, Star, Palette, FileText, Users, Lightbulb } from 'lucide-react';

export default function ThemesComingSoon() {
  const themeCategories = [
    {
      title: "Daily Life & Culture",
      description: "Food, family, holidays, traditions, and everyday situations",
      lessons: ["Restaurant Conversations", "Family Traditions", "Shopping Scenarios"]
    },
    {
      title: "Academic & Professional",
      description: "Business language, academic writing, professional communication",
      lessons: ["Job Interviews", "Academic Presentations", "Email Etiquette"]
    },
    {
      title: "Travel & Geography",
      description: "Countries, directions, transportation, accommodation",
      lessons: ["Airport Conversations", "Hotel Bookings", "City Navigation"]
    },
    {
      title: "GCSE & Exam Prep",
      description: "Curriculum-aligned content for formal qualifications",
      lessons: ["GCSE Speaking Practice", "A-Level Writing Tasks", "Grammar Drills"]
    }
  ];

  const creationTools = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Smart Content Import",
      description: "Upload documents, images, or audio files and our AI helps create interactive lessons automatically."
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Visual Lesson Builder",
      description: "Drag-and-drop interface to create engaging lessons with multimedia, quizzes, and activities."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Collaborative Creation",
      description: "Work with other teachers to build and share lesson content across your school or department."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "See which lessons work best and get insights on student engagement and learning outcomes."
    }
  ];

  const studentFeatures = [
    "🎯 Personalized learning paths based on proficiency level",
    "📱 Mobile-friendly lessons for learning on the go", 
    "🎧 Audio pronunciation guides from native speakers",
    "📝 Interactive exercises with instant feedback",
    "🏆 Progress tracking and achievement badges",
    "👥 Collaborative activities with classmates"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 animate-pulse">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Lessons</span> & Themes
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Create, customize, and share engaging language lessons tailored to your students' needs. 
              From beginner conversations to advanced academic writing - build it all with our intuitive tools.
            </p>
            
            {/* Status Banner */}
            <div className="inline-flex items-center bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-3 text-yellow-200 mb-8">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Coming Soon • Full Dashboard Integration in Development</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Categories */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">📚 Pre-Built Theme Library</h2>
          <p className="text-gray-400 text-lg">Start with our extensive collection, then customize to your heart's content</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {themeCategories.map((category, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>
              <p className="text-gray-300 mb-6">{category.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-300 mb-2">Sample Lessons:</p>
                {category.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="flex items-center text-sm text-gray-400">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    {lesson}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Creation Tools */}
        <div className="bg-gradient-to-r from-teal-900/50 to-emerald-900/50 rounded-3xl p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">🛠️ Powerful Creation Tools</h3>
            <p className="text-gray-300 text-lg">Professional-grade tools that make lesson creation fast and enjoyable</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {creationTools.map((tool, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {tool.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{tool.title}</h4>
                  <p className="text-gray-300">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Experience */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">🎓 Student Experience</h3>
            <p className="text-gray-300 text-lg mb-8">
              Your custom lessons come alive with interactive features that keep students engaged and motivated to learn.
            </p>
            <div className="space-y-4">
              {studentFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-lg mr-3">{feature.split(' ')[0]}</span>
                  <span className="text-gray-300">{feature.substring(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-6">💡 What Teachers Are Saying</h4>
            <div className="space-y-6">
              <div className="border-l-4 border-emerald-400 pl-4">
                <p className="text-gray-300 italic">"Finally, a platform that lets me create exactly the lessons my students need, not what a textbook thinks they need."</p>
                <p className="text-emerald-300 text-sm mt-2">- Sarah M., High School French Teacher</p>
              </div>
              <div className="border-l-4 border-teal-400 pl-4">
                <p className="text-gray-300 italic">"The multimedia integration is incredible. My students are so much more engaged with audio and video content."</p>
                <p className="text-teal-300 text-sm mt-2">- David L., University Spanish Lecturer</p>
              </div>
              <div className="border-l-4 border-cyan-400 pl-4">
                <p className="text-gray-300 italic">"Being able to share lessons with my department has revolutionized how we collaborate on curriculum."</p>
                <p className="text-cyan-300 text-sm mt-2">- Maria R., Language Department Head</p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Classroom Integration</h4>
            <p className="text-gray-400">Seamlessly integrate with your existing curriculum and teaching style.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Exam Preparation</h4>
            <p className="text-gray-400">Create targeted practice materials for GCSE, A-Level, and university exams.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Special Projects</h4>
            <p className="text-gray-400">Build immersive cultural experiences and cross-curricular projects.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Teaching?</h3>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Join our community of innovative educators. Create your account now for early access to Custom Lessons, plus immediate access to our Shop and Blog!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/auth/signup"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              🚀 Start Creating Today
            </Link>
            <Link 
              href="/blog"
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-colors"
            >
              📖 Read Teaching Tips
            </Link>
          </div>

          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Free account setup
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Access to 500+ resources
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Early beta access
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center text-emerald-300 hover:text-white transition-colors text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>
    </div>
  );
} 