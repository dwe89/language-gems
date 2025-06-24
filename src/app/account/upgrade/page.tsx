'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../components/auth/AuthProvider';
import { 
  ArrowLeft, Crown, Check, Star, Zap, Shield, Users, BookOpen, 
  BarChart2, Gamepad2, Award, Calendar, FileText, MessageSquare,
  Video, Headphones, Globe, Sparkles, GraduationCap, Target
} from 'lucide-react';

export default function UpgradePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in to upgrade</h2>
          <Link 
            href="/auth/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const coreFeatures = [
    {
      icon: Crown,
      title: 'Full Dashboard Access',
      description: 'Complete access to teacher and student dashboards with all premium tools',
      preview: '/images/features/dashboard-preview.png'
    },
    {
      icon: Users,
      title: 'Class Management',
      description: 'Create unlimited classes, manage students, and track progress in real-time',
      preview: '/images/features/class-management.png'
    },
    {
      icon: FileText,
      title: 'Assignment System',
      description: 'Create custom assignments, track submissions, and provide detailed feedback',
      preview: '/images/features/assignments.png'
    },
    {
      icon: BarChart2,
      title: 'Advanced Analytics',
      description: 'Detailed progress tracking, performance analytics, and custom reports',
      preview: '/images/features/analytics.png'
    },
    {
      icon: Gamepad2,
      title: 'Interactive Games',
      description: '15+ premium learning games with customizable difficulty and topics',
      preview: '/images/features/games.png'
    },
    {
      icon: BookOpen,
      title: 'Vocabulary Mining',
      description: 'AI-powered vocabulary extraction from texts and automatic list generation',
      preview: '/images/features/vocabulary-mining.png'
    }
  ];

  const advancedFeatures = [
    {
      icon: MessageSquare,
      title: 'AI Conversation Practice',
      description: 'Real-time conversations with AI tutors for speaking practice'
    },
    {
      icon: Video,
      title: 'Virtual Classrooms',
      description: 'Integrated video calls and screen sharing for remote learning'
    },
    {
      icon: Headphones,
      title: 'Pronunciation Analysis',
      description: 'AI-powered speech recognition and pronunciation feedback'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Support for 12+ languages with native speaker audio'
    },
    {
      icon: Award,
      title: 'Certification System',
      description: 'Generate certificates and track learning milestones'
    },
    {
      icon: Target,
      title: 'Adaptive Learning',
      description: 'AI that adapts to each student\'s learning pace and style'
    }
  ];

  const pricingPlans = [
    {
      name: 'Teacher Starter',
      price: '£29',
      period: 'per month',
      description: 'Perfect for individual teachers',
      features: [
        'Up to 3 classes',
        'Up to 90 students',
        'Basic analytics',
        'All core games',
        'Assignment system',
        'Email support'
      ],
      highlighted: false,
      comingSoon: true
    },
    {
      name: 'Teacher Pro',
      price: '£49',
      period: 'per month',
      description: 'For serious educators',
      features: [
        'Unlimited classes',
        'Unlimited students',
        'Advanced analytics',
        'All premium games',
        'Vocabulary mining',
        'Priority support',
        'Custom themes',
        'Export capabilities'
      ],
      highlighted: true,
      comingSoon: true
    },
    {
      name: 'School License',
      price: 'Custom',
      period: 'pricing',
      description: 'For schools and institutions',
      features: [
        'Everything in Pro',
        'Multiple teacher accounts',
        'Admin dashboard',
        'Custom branding',
        'Integration support',
        'Training sessions',
        'Dedicated support'
      ],
      highlighted: false,
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>
          
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6 relative">
              <Crown className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                SOON
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              We're building the most comprehensive language learning platform for educators. 
              Get ready for powerful tools, engaging games, and insights that will transform your classroom!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/preview"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <Sparkles className="h-5 w-5 mr-2 inline" />
                Preview Dashboard
              </Link>
              <button
                disabled
                className="px-8 py-4 bg-slate-200 text-slate-500 rounded-lg font-semibold cursor-not-allowed"
              >
                Join Waitlist (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Core Features with Previews */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Core Features Ready for Launch
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-4">
                    {feature.description}
                  </p>

                  {/* Preview placeholder */}
                  <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <IconComponent className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <span className="text-sm text-slate-500">Preview Coming Soon</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Advanced Features in Development
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full">
                    In Development
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Transparent Pricing</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Simple, fair pricing that grows with your needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${
                  plan.highlighted ? 'ring-2 ring-purple-500 transform scale-105' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium text-center py-2">
                    Most Popular
                  </div>
                )}
                
                {plan.comingSoon && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                    COMING SOON
                  </div>
                )}
                
                <div className={`p-8 ${plan.highlighted ? 'pt-12' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {plan.name}
                    </h3>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-slate-900">
                        {plan.price}
                      </span>
                      <span className="text-slate-600 ml-2">
                        / {plan.period}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 mb-6">
                      {plan.description}
                    </p>
                    
                    <button
                      disabled
                      className="w-full py-3 px-6 bg-slate-200 text-slate-500 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Includes:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-2">When will the full platform be available?</h3>
              <p className="text-slate-600">We're working hard to launch in Q2 2024. You can preview the dashboard functionality now, and we'll notify you as soon as premium features become available.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-2">Can I use the platform for free right now?</h3>
              <p className="text-slate-600">Yes! You can access our blog, shop, and game previews. The dashboard preview gives you a taste of what's coming.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-2">Will there be a free tier?</h3>
              <p className="text-slate-600">We're considering a limited free tier for individual teachers. Our focus is on providing incredible value for professional educators and schools.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-2">What makes LanguageGems different?</h3>
              <p className="text-slate-600">We're built specifically for language teachers by language teachers. Our AI-powered tools, comprehensive analytics, and engaging games are designed to save you time while improving student outcomes.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Get a sneak peek of what's coming and be the first to know when we launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/preview"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Preview Dashboard Now
            </Link>
            <Link
              href="/blog"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors border border-white/20"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 