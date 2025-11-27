"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Gamepad2,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Play,
  CheckCircle,
  Trophy,
  Globe,
  Brain,
  Zap,
  Target,
  School,
  GraduationCap,
  Heart,
  Sparkles
} from 'lucide-react';
import Footer from '../components/layout/Footer';
import SEOWrapper from '../components/seo/SEOWrapper';
import { useAuth } from '../components/auth/AuthProvider';
import SmartSignupSelector from '../components/auth/SmartSignupSelector';
import { useEditablePage } from '../hooks/useEditablePage';
import { isAdmin } from '../lib/adminCheck';
import PageEditButton from '../components/admin/PageEditButton';
import { iconMap } from '../lib/iconMap';

// Universal hero text variations
const heroTextVariations = [
  { text: "Master Languages", color: "text-blue-600" },
  { text: "Learn Through Gaming", color: "text-green-600" },
  { text: "Achieve GCSE Success", color: "text-purple-600" },
  { text: "Build Vocabulary", color: "text-indigo-600" },
  { text: "Practice Daily", color: "text-emerald-600" },
  { text: "Reach Fluency", color: "text-orange-600" }
];

// Animated text hook
function useTypewriter(texts: any[], speed = 100) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    const fullText = current.text;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentIndex, texts, speed]);

  return {
    text: currentText,
    color: texts[currentIndex].color,
    isDeleting
  };
}

export default function Home() {
  const { text: animatedText, color: textColor } = useTypewriter(heroTextVariations);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Load editable page content
  const { pageData, isLoading, reload } = useEditablePage('homepage');

  // Check if user is admin
  const userIsAdmin = isAdmin(user?.email);

  // Auto-redirect logged-in users to their appropriate dashboard
  useEffect(() => {
    const from = searchParams.get('from');
    if (from === 'dashboard') {
      // Skip redirect if coming from dashboard
      return;
    }
    if (user?.user_metadata?.role === 'student') {
      window.location.href = '/student-dashboard';
    } else if (user?.user_metadata?.role === 'learner') {
      window.location.href = '/learner-dashboard';
    } else if (user?.user_metadata?.role === 'teacher') {
      window.location.href = '/dashboard';
    }
  }, [user, searchParams]);

  // Fallback features if page data not loaded
  const defaultFeatures = [
    {
      title: "Interactive Learning Games",
      description: "15+ engaging games that make language learning fun and effective",
      icon: "Gamepad2",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "GCSE Curriculum Aligned",
      description: "Content specifically designed for Spanish, French, and German GCSE exams",
      icon: "Award",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Progress Tracking",
      description: "Detailed analytics to monitor learning progress and identify areas for improvement",
      icon: "Trophy",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Spaced Repetition",
      description: "AI-powered system ensures optimal vocabulary retention and long-term memory",
      icon: "Brain",
      color: "from-orange-500 to-red-600"
    }
  ];

  // Use page data or fallback
  const features = pageData?.features || defaultFeatures;
  const hero = pageData?.hero || {};
  const audienceCards = pageData?.audience_cards || [];
  const ctaSection = pageData?.cta_section || {};

  return (
    <SEOWrapper>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="w-full relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="absolute inset-0 bg-[url('/images/homepage/subtle-pattern.svg')] opacity-5"></div>

            <div className="container mx-auto px-6 z-10 py-20">
              <div className="text-center max-w-5xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6"
                >
                  <span className={`block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 min-h-[1.2em] ${textColor}`}>
                    {animatedText}
                    <span className="animate-pulse">|</span>
                  </span>
                  <span className="text-slate-800">with LanguageGems</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto"
                >
                  {hero.subheadline || "The complete GCSE language learning platform for Spanish, French, and German. Perfect for schools, teachers, and individual learners worldwide."}
                </motion.p>

                {/* Audience Selection Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12"
                >
                  {audienceCards.length > 0 ? audienceCards.map((card: any, index: number) => {
                    const Icon = iconMap[card.icon] || School;
                    const borderColor = index === 0 ? 'hover:border-blue-200' : 'hover:border-purple-200';
                    const textColor = index === 0 ? 'text-blue-600 group-hover:text-blue-700' : 'text-purple-600 group-hover:text-purple-700';

                    return (
                      <Link
                        key={index}
                        href={card.cta_url}
                        className={`group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent ${borderColor}`}
                      >
                        <div className="text-center">
                          <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-800 mb-4">{card.title}</h3>
                          <p className="text-slate-600 mb-6 leading-relaxed">
                            {card.description}
                          </p>
                          <div className={`flex items-center justify-center ${textColor} font-semibold`}>
                            <span>{card.cta_text}</span>
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    );
                  }) : (
                    <>
                      <Link
                        href="/schools"
                        className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-200"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <School className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-800 mb-4">For Schools & Teachers</h3>
                          <p className="text-slate-600 mb-6 leading-relaxed">
                            Comprehensive classroom management, detailed analytics, assignment tools, and progress tracking for entire departments.
                          </p>
                          <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                            <span>Explore School Solutions</span>
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/learn"
                        className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-purple-200"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <GraduationCap className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-800 mb-4">For Individual Learners</h3>
                          <p className="text-slate-600 mb-6 leading-relaxed">
                            Personal study plans, gamified learning, progress tracking, and self-paced vocabulary building for independent learners.
                          </p>
                          <div className="flex items-center justify-center text-purple-600 font-semibold group-hover:text-purple-700">
                            <span>Start Learning Today</span>
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </>
                  )}
                </motion.div>

                {/* Quick Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                >
                  <Link href="/games" className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                    <Play className="mr-2 h-5 w-5" />
                    Try Games Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>

                  <button 
                    onClick={() => setShowSignupModal(true)}
                    className="inline-flex items-center justify-center bg-white text-slate-700 font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105 border border-slate-200"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-center gap-8 text-sm text-slate-500 justify-center flex-wrap"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free to Start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Spanish, French & German</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    <span>GCSE Exam Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Loved by Students & Teachers</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-60 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-60 animate-float-delayed"></div>
            <div className="absolute top-1/2 left-5 w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-60 animate-float-slow"></div>
          </div>

          {/* Features Section */}
          <div className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Why Choose LanguageGems?
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  Combining the best of educational technology with proven language learning methods.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature: any, index: number) => {
                  const Icon = iconMap[feature.icon] || Gamepad2;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {ctaSection.headline || "Ready to Transform Language Learning?"}
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {ctaSection.subheadline || "Join thousands of learners and educators who are already experiencing the LanguageGems difference."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {ctaSection.buttons && ctaSection.buttons.length > 0 ? (
                  ctaSection.buttons.map((button: any, index: number) => {
                    const Icon = iconMap[button.icon] || School;
                    const bgClass = button.style === 'primary'
                      ? 'bg-white text-blue-600'
                      : 'bg-purple-700 text-white';

                    return (
                      <Link
                        key={index}
                        href={button.url}
                        className={`inline-flex items-center justify-center ${bgClass} font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105`}
                      >
                        <Icon className="mr-2 h-5 w-5" />
                        {button.text}
                      </Link>
                    );
                  })
                ) : (
                  <>
                    <Link href="/schools" className="inline-flex items-center justify-center bg-white text-blue-600 font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                      <School className="mr-2 h-5 w-5" />
                      For Schools
                    </Link>
                    <Link href="/learn" className="inline-flex items-center justify-center bg-purple-700 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                      <GraduationCap className="mr-2 h-5 w-5" />
                      For Learners
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Signup Modal */}
      <SmartSignupSelector
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />

      {/* Admin Edit Button */}
      {userIsAdmin && <PageEditButton pageSlug="homepage" onSave={reload} />}
    </SEOWrapper>
  );
}
