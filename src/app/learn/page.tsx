'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Gamepad2,
  BookOpen,
  Trophy,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Clock,
  Globe,
  Brain,
  Zap,
  Users,
  Target,
  Award,
  Headphones
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { useAuth } from '../../components/auth/AuthProvider';

// B2C-focused hero text variations
const b2cHeroTextVariations = [
  { text: "Master GCSE Languages", color: "text-blue-600" },
  { text: "Learn Through Gaming", color: "text-green-600" },
  { text: "Build Your Vocabulary", color: "text-purple-600" },
  { text: "Practice Daily", color: "text-indigo-600" },
  { text: "Achieve Fluency", color: "text-emerald-600" },
  { text: "Ace Your Exams", color: "text-orange-600" }
];

// Animated text hook (reused from main homepage)
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

export default function LearnPage() {
  const { text: animatedText, color: textColor } = useTypewriter(b2cHeroTextVariations);
  const { user } = useAuth();

  // B2C-focused features
  const learnerFeatures = [
    {
      title: "15+ Interactive Games",
      description: "From VocabMaster to Word Blast - learn vocabulary through engaging gameplay that makes studying feel like entertainment.",
      icon: Gamepad2,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "GCSE Curriculum Aligned",
      description: "All content matches AQA, Edexcel, and other major exam boards. Practice exactly what you'll see on your exams.",
      icon: Target,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Spaced Repetition Learning",
      description: "Our AI-powered system ensures you review words at optimal intervals for long-term retention and mastery.",
      icon: Brain,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Progress Tracking",
      description: "Watch your vocabulary grow with detailed analytics, streak counters, and achievement badges.",
      icon: Trophy,
      color: "from-orange-500 to-red-600"
    }
  ];

  // Pricing tiers for B2C
  const pricingTiers = [
    {
      name: "Free",
      price: "£0",
      period: "forever",
      description: "Perfect for trying out LanguageGems",
      features: [
        "Access to 3 vocabulary games",
        "Basic progress tracking",
        "100 vocabulary words",
        "Community support"
      ],
      cta: "Start Free",
      ctaLink: "/auth/signup-learner",
      popular: false
    },
    {
      name: "Pro",
      price: "£9.99",
      period: "per month",
      description: "Everything you need to excel in GCSE languages",
      features: [
        "All 15+ interactive games",
        "All original learning songs and tracks",
        "Complete GCSE vocabulary (2000+ words)",
        "Practise exams and quizzes",
        "Grammar guides and tips",
        "Advanced progress analytics",
        "Spaced repetition system",
        "Audio pronunciation",
        "Offline practice mode"
      ],
      cta: "Start Free Trial",
      ctaLink: "/auth/signup-learner?plan=pro",
      popular: true
    }
  ];

  return (
    <SEOWrapper>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {/* Hero Section - B2C Version */}
          <div className="w-full relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="absolute inset-0 bg-[url('/images/homepage/subtle-pattern.svg')] opacity-5"></div>

            <div className="container mx-auto px-6 z-10 py-20">
              <div className="text-center max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    🎮 For Individual Learners
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6"
                >
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 ${textColor}`}>
                    {animatedText}
                    <span className="animate-pulse">|</span>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto"
                >
                  Transform your GCSE language learning with 15+ interactive games, 
                  spaced repetition technology, and curriculum-aligned content. 
                  Make studying Spanish, French, and German actually fun!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 mb-8 justify-center"
                >
                  <Link href="/auth/signup-learner" className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                    <Play className="mr-2 h-5 w-5" />
                    Start Learning Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>

                  <Link href="/games" className="inline-flex items-center justify-center bg-white text-slate-700 font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105 border border-slate-200">
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Try Games Demo
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center gap-8 text-sm text-slate-500 justify-center flex-wrap"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>3 Languages Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    <span>GCSE Exam Ready</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-60 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-60 animate-float-delayed"></div>
          </div>

          {/* Features Section */}
          <div className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Why Students Love LanguageGems
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  We've gamified language learning to make it engaging, effective, and actually enjoyable.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {learnerFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  Choose Your Learning Plan
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  Start free and upgrade when you're ready for the full experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-center">
                {pricingTiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-xl ${
                      tier.popular 
                        ? 'border-purple-500 relative' 
                        : 'border-slate-100'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{tier.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-slate-800">{tier.price}</span>
                        <span className="text-slate-600">/{tier.period}</span>
                      </div>
                      <p className="text-slate-600">{tier.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={tier.ctaLink}
                      className={`w-full inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 text-lg transition-all ${
                        tier.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SEOWrapper>
  );
}
