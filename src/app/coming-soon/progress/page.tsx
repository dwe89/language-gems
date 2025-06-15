'use client';

import Link from 'next/link';
import { ArrowLeft, BarChart3, Target, TrendingUp, Clock, Star, Award, Users, BookOpen, Zap, PieChart, Calendar } from 'lucide-react';

export default function ProgressComingSoon() {
  const trackingFeatures = [
    {
      title: "Real-Time Performance",
      description: "Watch student progress unfold in real-time with live dashboards",
      metrics: ["Speaking confidence", "Vocabulary retention", "Grammar accuracy", "Participation rates"]
    },
    {
      title: "Predictive Analytics",
      description: "AI-powered insights that predict learning outcomes and suggest interventions",
      metrics: ["Risk identification", "Success predictions", "Learning path optimization", "Intervention timing"]
    },
    {
      title: "Skill Mapping",
      description: "Detailed breakdown of language skills with visual progress tracking",
      metrics: ["Reading comprehension", "Writing fluency", "Listening skills", "Speaking confidence"]
    },
    {
      title: "Engagement Analytics",
      description: "Understand how students interact with different content types",
      metrics: ["Time on task", "Activity completion", "Help-seeking behavior", "Collaboration patterns"]
    }
  ];

  const reportTypes = [
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Individual Student Reports",
      description: "Comprehensive profiles showing strengths, weaknesses, and personalized recommendations."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Class Overview Reports",
      description: "Class-wide analytics to identify trends and plan targeted instruction."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Progress Over Time",
      description: "Longitudinal tracking to celebrate growth and identify learning plateaus."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Standards Alignment",
      description: "Track progress against curriculum standards and learning objectives."
    }
  ];

  const stakeholderBenefits = [
    {
      role: "Teachers",
      icon: "👩‍🏫",
      benefits: [
        "Identify struggling students before they fall behind",
        "Celebrate success with data-driven evidence",
        "Plan lessons based on real learning needs",
        "Track effectiveness of teaching strategies"
      ]
    },
    {
      role: "Students", 
      icon: "🎓",
      benefits: [
        "Visualize their own learning journey",
        "Set and track personal goals",
        "Get personalized study recommendations",
        "Celebrate achievements with badges and milestones"
      ]
    },
    {
      role: "Parents",
      icon: "👨‍👩‍👧‍👦", 
      benefits: [
        "Stay informed about child's progress",
        "Support learning with targeted activities",
        "Celebrate achievements together",
        "Communicate effectively with teachers"
      ]
    },
    {
      role: "Administrators",
      icon: "🏫",
      benefits: [
        "Monitor program effectiveness across schools",
        "Make data-driven curriculum decisions",
        "Track ROI on language programs",
        "Support teacher professional development"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 animate-pulse">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Progress <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">Tracking</span> & Analytics
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform learning data into actionable insights. Track every aspect of language acquisition with powerful analytics that help teachers teach better and students learn faster.
            </p>
            
            {/* Status Banner */}
            <div className="inline-flex items-center bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-3 text-yellow-200 mb-8">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Advanced Analytics in Development • Basic tracking available now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">📊 Advanced Analytics Engine</h2>
          <p className="text-gray-400 text-lg">Comprehensive tracking that goes beyond simple grades</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {trackingFeatures.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-300 mb-2">Key Metrics:</p>
                {feature.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex items-center text-sm text-gray-400">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Report Types */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">📈 Intelligent Reporting</h3>
            <p className="text-gray-300 text-lg">Multiple report types for different needs and audiences</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {reportTypes.map((report, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {report.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{report.title}</h4>
                  <p className="text-gray-300">{report.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholder Benefits */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">🎯 Benefits for Everyone</h3>
            <p className="text-gray-300 text-lg">Valuable insights tailored to each stakeholder's needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {stakeholderBenefits.map((stakeholder, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">{stakeholder.icon}</span>
                  <h4 className="text-xl font-bold text-white">{stakeholder.role}</h4>
                </div>
                <div className="space-y-3">
                  {stakeholder.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start">
                      <Star className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
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
            <h4 className="text-xl font-bold text-white mb-2">Real-Time Updates</h4>
            <p className="text-gray-400">See progress happen live as students complete activities and assessments.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Achievement Tracking</h4>
            <p className="text-gray-400">Celebrate milestones and motivate continued learning with visual progress indicators.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Curriculum Alignment</h4>
            <p className="text-gray-400">Track progress against specific learning standards and curriculum requirements.</p>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">📱 What the Dashboard Will Look Like</h3>
            <p className="text-gray-300 text-lg">Clean, intuitive interface that makes complex data simple to understand</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-400/30">
              <h4 className="text-white font-semibold mb-2">📊 Class Overview</h4>
              <p className="text-gray-400 text-sm">Visual charts showing class-wide performance trends</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-400/30">
              <h4 className="text-white font-semibold mb-2">👤 Student Profiles</h4>
              <p className="text-gray-400 text-sm">Individual progress tracking with personalized insights</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-xl p-6 border border-orange-400/30">
              <h4 className="text-white font-semibold mb-2">🎯 Goal Setting</h4>
              <p className="text-gray-400 text-sm">Interactive goal setting and milestone tracking</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Track Student Success?</h3>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Be among the first to experience next-generation progress tracking. Create your account now for early access, plus explore our Shop and Blog resources!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/auth/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              📊 Get Early Access
            </Link>
            <Link 
              href="/shop"
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-colors"
            >
              🛒 Browse Resources
            </Link>
          </div>

          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Free account
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Immediate shop access
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Beta preview access
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-300 hover:text-white transition-colors text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>
    </div>
  );
} 