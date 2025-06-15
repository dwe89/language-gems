'use client';

import Link from 'next/link';
import { ArrowLeft, Play, Trophy, Users, BarChart3, Clock, Zap, Star, Gamepad2, Target, Award } from 'lucide-react';

export default function GamesComingSoon() {
  const games = [
    {
      title: "Memory Match",
      description: "Match vocabulary words with images or translations",
      features: ["Timed challenges", "Multiple difficulty levels", "Progress tracking"]
    },
    {
      title: "Word Hangman", 
      description: "Classic hangman with language learning twist",
      features: ["Hint system", "Themed categories", "Multiplayer mode"]
    },
    {
      title: "Speed Quiz",
      description: "Rapid-fire vocabulary and grammar challenges", 
      features: ["Leaderboards", "Daily challenges", "Custom word lists"]
    },
    {
      title: "Story Builder",
      description: "Create stories using target vocabulary",
      features: ["Creative writing", "Grammar practice", "Peer sharing"]
    }
  ];

  const teacherFeatures = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Class Management",
      description: "Create game assignments for your students with custom word lists and difficulty settings."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Analytics", 
      description: "Track student performance, identify learning gaps, and celebrate achievements."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Curriculum Integration",
      description: "Align games with your lesson plans and learning objectives effortlessly."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Achievement System",
      description: "Motivate students with badges, points, and leaderboards that encourage healthy competition."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Interactive Language <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Games</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Make language learning addictive with gamified experiences that students actually want to play. 
              Coming soon with full teacher integration and progress tracking.
            </p>
            
            {/* Status Banner */}
            <div className="inline-flex items-center bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-3 text-yellow-200 mb-8">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Currently in Development • Available in localhost for testing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Games Preview */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">🎮 Game Collection</h2>
          <p className="text-gray-400 text-lg">Four engaging games designed by language teachers, for language teachers</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {games.map((game, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{game.title}</h3>
              </div>
              <p className="text-gray-300 mb-6">{game.description}</p>
              <div className="space-y-2">
                {game.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-gray-400">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Teacher Features */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">👩‍🏫 Built for Teachers</h3>
            <p className="text-gray-300 text-lg">Complete classroom integration with powerful management tools</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {teacherFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Instant Engagement</h4>
            <p className="text-gray-400">Students learn without realizing they're studying. Games make practice feel like play.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Competitive Learning</h4>
            <p className="text-gray-400">Leaderboards and achievements motivate students to practice more and improve faster.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Data-Driven Insights</h4>
            <p className="text-gray-400">Detailed analytics help you identify which students need extra support and which topics need review.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Gamify Your Classroom?</h3>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Create your account now to be first in line when Games launch. Plus, get immediate access to our Shop and Blog resources!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/auth/signup"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              🚀 Create Account - It's Free!
            </Link>
            <Link 
              href="/shop"
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-colors"
            >
              🛒 Explore Shop Resources
            </Link>
          </div>

          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Instant access to Shop & Blog
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Early access to Games
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center text-purple-300 hover:text-white transition-colors text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>
    </div>
  );
} 