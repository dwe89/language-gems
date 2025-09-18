"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Gamepad2,
  BookOpen,
  Users,
  Award,
  BarChart3,
  Target,
  Headphones,
  PenTool,
  FileText,
  Zap,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Trophy,
  Clock,
  Globe,
  Brain,
  Lightbulb,
  Hourglass,
  Rocket,
  GitCommit,
  TrendingUp,
  Smartphone
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { getFAQSchema } from '../../lib/seo/structuredData';


import { useAuth } from '../../components/auth/AuthProvider';

// Animated text data for hero section - Teacher-focused benefits
const heroTextVariations = [
  { text: "Boost Student Engagement", color: "text-blue-600" },
  { text: "Uncover Real-time Progress", color: "text-green-600" },
  { text: "Gain Predictive Insights", color: "text-purple-600" },
  { text: "Streamline Assignments", color: "text-indigo-600" },
  { text: "Tailor Learning to Every Student", color: "text-emerald-600" },
  { text: "Excel in GCSE-Style Exams", color: "text-orange-600" }
];

// Animated text hook
function useTypewriter(texts, speed = 100) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    const fullText = current.text;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
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

// Placeholder for founder photo - replace with a real image path
const founderPhoto = "/images/homepage/founder.jpg"; // Corrected to a local path

// Development timeline for "Building in Public" section
const developmentTimeline = [
  {
    date: "September 2024",
    milestone: "Core vocabulary games and teacher dashboard launched",
    status: "done",
    icon: CheckCircle
  },
  {
    date: "January 2025",
    milestone: "Student assessment system and enhanced analytics",
    status: "done",
    icon: CheckCircle
  },
  {
    date: "March 2025",
    milestone: "Advanced AI features and personalized learning paths",
    status: "done",
    icon: CheckCircle
  },
  {
    date: "June 2025",
    milestone: "Teacher resources hub and automatic AI worksheet creator",
    status: "done",
    icon: CheckCircle
  },
  {
    date: "September 2025",
    milestone: "Enhanced student progress tracking and reporting tools",
    status: "in-progress",
    icon: GitCommit
  },
  {
    date: "December 2025",
    milestone: "Individual learner platform and song-based learning",
    status: "upcoming",
    icon: Brain
  },
  {
    date: "Q1 2026",
    milestone: "Mobile app launch and offline capabilities",
    status: "upcoming",
    icon: Smartphone
  }
];

export default function Home() {
  const { text: animatedText, color: textColor } = useTypewriter(heroTextVariations);
  const { user } = useAuth();

  // Auto-redirect logged-in students to their dashboard
  useEffect(() => {
    if (user?.user_metadata?.role === 'student') {
      window.location.href = '/student-dashboard';
    }
  }, [user]);

  // Slideshow images for hero section
  const slideshowImages = [
    { src: "/images/homepage/dashboard-mockups/dashboard-class-overview.jpg", alt: "LanguageGems Teacher Dashboard showing Class Performance Overview and Weak Areas" },
    { src: "/images/homepage/dashboard-mockups/dashboard-student-progress.jpg", alt: "LanguageGems Teacher Dashboard showing Individual Student Progress and AI-Powered Recommendations" },
    { src: "/images/homepage/dashboard-mockups/dashboard-create-assignment.jpg", alt: "LanguageGems Teacher Dashboard showing Assignment Creation Interface and Assignment Summary" }
  ];

  // Slideshow state and logic
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  // FAQ data for structured data (updated for teacher focus)
  const faqs = [
    {
      question: "How does LanguageGems support teachers and improve student outcomes?",
      answer: "LanguageGems provides a comprehensive teacher dashboard with real-time analytics, predictive insights, and automated assignment tools. This saves teachers time, identifies struggling students early, and boosts engagement through gamified, curriculum-aligned content, ultimately leading to better GCSE results."
    },
    {
      question: "Which languages and exam boards does LanguageGems support?",
      answer: "We currently support Spanish, French, and German, with comprehensive vocabulary and grammar content aligned with GCSE-style requirements for exam boards like AQA and Edexcel. Our content is designed to prepare students for success in these examinations."
    },
    {
      question: "What is the pricing structure for schools and educational institutions?",
      answer: "We offer transparent annual pricing designed for schools, starting from £399 for basic access, with our comprehensive school plan at £699/year. This includes unlimited teachers and students, ensuring no hidden costs and scalable learning for your entire department."
    }
  ];

  const faqStructuredData = getFAQSchema(faqs);

  // Feature categories for the new homepage
  const gameCategories = [
    {
      title: "Vocabulary Mastery",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-600",
      description: "Our diverse range of vocabulary games ensures students not only learn new words but retain them long-term.",
      games: [
        { name: "VocabMaster", description: "Intelligent spaced repetition for lasting retention" },
        { name: "Word Blast", description: "Fast-paced word recognition challenges" },
        { name: "Memory Match", description: "Boost memory with engaging vocabulary pairs" },
        { name: "Hangman", description: "Classic word guessing for core vocabulary" }
      ]
    },
    {
      title: "Sentence Construction & Translation",
      icon: PenTool,
      color: "from-green-500 to-emerald-600",
      description: "Beyond individual words, our games build confidence in forming and translating complete sentences.",
      games: [
        { name: "Sentence Sprint", description: "Drag & drop sentence building for fluency" },
        { name: "Translation Tycoon", description: "Business-themed translation practice" },
        { name: "Word Scramble", description: "Unscramble letters to form correct words" }
      ]
    },
    {
      title: "Grammar & Conjugation",
      icon: Target,
      color: "from-purple-500 to-violet-600",
      description: "Master complex grammatical structures and verb conjugations through interactive battles and quests.",
      games: [
        { name: "Conjugation Duel", description: "RPG-style Spanish verb conjugation battles" },
        { name: "Verb Quest", description: "Engaging quests to master grammar rules" }
      ]
    },
    {
      title: "Listening Comprehension",
      icon: Headphones,
      color: "from-orange-500 to-red-600",
      description: "Develop crucial listening skills with audio-based games designed to improve recognition and understanding.",
      games: [
        { name: "Detective Listening Game", description: "Solve cases by identifying words via audio" }
      ]
    }
  ];

  // Updated assessment types for teacher benefits
  const assessmentTypes = [
    {
      title: "GCSE-Style Exam Practice",
      description: "Prepare students for success with official-style questions aligned with GCSE Foundation & Higher tiers, providing invaluable exam readiness.",
      icon: Award,
      features: ["GCSE-style Reading Tests", "GCSE-style Listening Tests", "Writing Tasks with guided prompts", "Speaking Practice prompts & recordings"]
    },
    {
      title: "Reading Comprehension Analytics",
      description: "Automated analysis of multi-language texts provides instant feedback and identifies comprehension gaps, saving teachers marking time.",
      icon: BookOpen,
      features: ["Age-appropriate, diverse texts", "Multiple question types", "Automated marking & feedback", "Detailed progress tracking"]
    },
    {
      title: "Precision Dictation Assessments",
      description: "Improve listening and writing accuracy with audio-to-text practice at variable speeds, pinpointing specific phonetic and spelling weaknesses.",
      icon: Headphones,
      features: ["Normal & slow speed playback", "Foundation & Higher difficulty", "Instant error highlighting", "Targeted remedial practice"]
    },
    {
      title: "Topic & Skill-Based Diagnostics",
      description: "Focused practice on specific curriculum themes and grammatical skills. Understand student strengths and weaknesses by theme, topic, and vocabulary.",
      icon: FileText,
      features: ["Organised by GCSE themes", "Targeted vocabulary & grammar topics", "Identifies weak areas automatically", "Reinforces specific skills"]
    }
  ];

  // Updated platform features for teacher benefits and USPs
  const platformFeatures = [
    {
      title: "Unrivaled Student Engagement",
      description: "15+ interactive games, a cross-game XP system, and 50+ achievements keep students deeply motivated and actively learning.",
      icon: Rocket,
      stat: "Deep Engagement"
    },
    {
      title: "Predictive Analytics & AI Insights",
      description: "Identify struggling students before they fall behind with real-time, AI-powered insights into individual and class performance.",
      icon: Brain,
      stat: "Early Intervention"
    },
    {
      title: "Streamlined Assignment Management",
      description: "Create custom assignments in minutes with reusable templates and auto-grading, saving teachers hours of administrative work.",
      icon: Hourglass,
      stat: "Time-Saving Automation"
    },
    {
      title: "GCSE Curriculum Aligned",
      description: "Comprehensive content aligned with GCSE-style requirements for exam boards like AQA and Edexcel, ready to deploy for your classes.",
      icon: Target,
      stat: "Full GCSE Coverage"
    }
  ];

  // New section for "Why Choose LanguageGems?"
  const differentiators = [
    {
      title: "Comprehensive Gamification Ecosystem",
      description: "Beyond simple games, our cross-game XP system, 50+ achievements, streak tracking, and power-ups drive consistent student motivation and engagement.",
      icon: Trophy
    },
    {
      title: "AI-Powered Predictive Analytics",
      description: "Identify and address student struggles *before* they happen. Get real-time data, word-level difficulty analysis, and optimal assignment suggestions for every student and class.",
      icon: BarChart3
    },
    {
      title: "Sophisticated Assignment Automation",
      description: "Save hours with customizable assignment templates, auto-grading with detailed feedback, flexible vocabulary selection modes, and real-time progress tracking.",
      icon: Zap
    },
    {
      title: "Pinpoint Strengths & Weaknesses",
      description: "Our dashboard provides deep insights into student and class performance by theme, topic, and vocabulary, allowing you to easily spot and address specific learning gaps.",
      icon: Lightbulb
    },
    {
      title: "Unified Teacher Workflow Optimization",
      description: "Manage all classes, assignments, and student progress from one intuitive dashboard, designed to streamline your daily teaching tasks and enhance efficiency.",
      icon: Users
    },
    {
      title: "Multi-Language & Custom Content Support",
      description: "Seamlessly teach Spanish, French, and German with audio integration, multiple game types, and the ability to integrate your own custom vocabulary.",
      icon: Globe
    }
  ];


  return (
    <SEOWrapper structuredData={faqStructuredData}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {/* Hero Section */}
            <div className="w-full relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="absolute inset-0 bg-[url('/images/homepage/subtle-pattern.svg')] opacity-5"></div>

            <div className="container mx-auto px-6 z-10 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Text Column */}
                <div className="lg:col-span-5 text-center lg:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                  >
                    <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      🎓 For Language Teachers & Departments
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6"
                  >
                    LanguageGems:
                    <span className={`block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 min-h-[1.2em] ${textColor}`}>
                      {animatedText}
                      <span className="animate-pulse">|</span>
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0"
                  >
                    Empower your students and streamline your teaching with the most advanced
                    GCSE language platform, combining engaging gamification with powerful AI-driven insights.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start"
                  >
                    <Link href="/schools/pricing" className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                      <Users className="mr-2 h-5 w-5" />
                      See Pricing
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>

                    <Link href="/auth/signup" className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                      Start Free Trial
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center gap-8 text-sm text-slate-500 justify-center lg:justify-start"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>AI-Powered Insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>3 Languages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-purple-500" />
                      <span>GCSE Curriculum Aligned</span>
                    </div>
                  </motion.div>
                </div>

                {/* Slideshow Column */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-7 flex justify-center relative"
                >
                  <div className="relative w-full max-w-lg lg:max-w-none">
                    {/* Background gradient decoration */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl transform rotate-6 opacity-20 hidden lg:block"></div>

                    {/* Slideshow container */}
                    <div className="relative bg-white rounded-3xl p-8 shadow-2xl overflow-hidden h-[450px] w-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={slideshowImages[currentSlideIndex].src}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={slideshowImages[currentSlideIndex].src}
                            alt={slideshowImages[currentSlideIndex].alt}
                            layout="fill"
                            objectFit="cover"
                            priority={currentSlideIndex === 0}
                            className="rounded-2xl"
                          />
                          {/* Semi-transparent overlay for better text contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Slideshow indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {slideshowImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlideIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlideIndex
                              ? 'bg-blue-600 w-6'
                              : 'bg-white/60 hover:bg-white/80'
                            }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Subtle decorative elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-60 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-60 animate-float-delayed"></div>
            <div className="absolute top-1/2 left-5 w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-60 animate-float-slow"></div>
          </div>

          {/* New Section: Founder's Story */}
          <div className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                >
                  The Language Platform Built by a Teacher.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-slate-600 max-w-3xl mx-auto"
                >
                  Built by a language teacher who got frustrated with outdated, expensive platforms that don't actually help students learn.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 bg-slate-50 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto"
              >
                <Image
                  src={founderPhoto}
                  alt="Photo of founder, Daniel Etienne"
                  width={128}
                  height={128}
                  className="rounded-full flex-shrink-0"
                />
                <div className="text-center md:text-left">
                  <p className="text-slate-700 text-lg mb-2 italic">
                    "After 8 years teaching Modern Foreign Languages in UK schools, I became increasingly frustrated with expensive platforms that cost £2000+ annually but failed to engage my students. The games were outdated, the progress tracking was clunky, and my students simply weren't motivated to use them. As a passionate MFL teacher, I knew there had to be a better way - a platform that actually understood how teenagers learn languages and what makes learning fun. So I built LanguageGems from the ground up with modern game design, and now it's being used by schools across the UK to transform language learning."
                  </p>
                  <p className="text-slate-800 font-bold text-base">
                    - Daniel Etienne, Founder & MFL Teacher
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Section: Building in Public & Roadmap */}
          <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                >
                  Our Development Journey
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-slate-600 max-w-3xl mx-auto"
                >
                  Built with continuous teacher feedback, LanguageGems has evolved into a comprehensive platform that schools trust.
                </motion.p>
              </div>

              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {developmentTimeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start bg-white p-6 rounded-lg shadow-sm border border-slate-200"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1 mr-4 ${item.status === 'done' ? 'bg-green-500' :
                          item.status === 'in-progress' ? 'bg-indigo-500 animate-pulse' :
                            'bg-gray-400'
                        }`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-lg mb-2">{item.milestone}</p>
                        <p className="text-gray-600 text-sm font-medium">{item.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: developmentTimeline.length * 0.1 + 0.2 }}
                className="text-center mt-12"
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Ready to Transform Your Language Department?
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  Join hundreds of schools already using LanguageGems to boost student engagement and improve learning outcomes.
                </p>
                <Link href="/schools/pricing" className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                  <Users className="mr-2 h-5 w-5" />
                  View School Pricing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Section: Platform Overview */}
          <div className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                >
                  LanguageGems: Your All-in-One Solution for Modern Language Education
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-slate-600 max-w-3xl mx-auto"
                >
                  More than just games, LanguageGems combines engaging student experiences with powerful teacher tools designed to simplify your workflow and maximize learning outcomes.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {platformFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{feature.stat}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Games Section */}
          <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                >
                  Engage Every Student: Our Interactive Learning Games
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-slate-600 max-w-3xl mx-auto"
                >
                  Our comprehensive gamification ecosystem, featuring over 15 dynamic games, ensures students are constantly motivated and actively learning, turning practice into play.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {gameCategories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{category.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{category.description}</p>
                    <div className="space-y-2">
                      {category.games.map((game, gameIndex) => (
                        <div key={gameIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="font-medium text-slate-800 text-sm">{game.name}</div>
                            <div className="text-xs text-slate-600">{game.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-12"
              >
                <Link
                  href="/games"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Explore Interactive Games
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Assessments Section */}
          <div className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                >
                  Streamline Evaluation: Comprehensive Assessment Tools
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-slate-600 max-w-3xl mx-auto"
                >
                  Gain precise insights into student mastery with automated, curriculum-aligned assessments. Our tools save you time while providing detailed feedback for every student.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {assessmentTypes.map((assessment, index) => (
                  <motion.div
                    key={assessment.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                      <assessment.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{assessment.title}</h3>
                    <p className="text-slate-600 mb-6">{assessment.description}</p>
                    <div className="space-y-2">
                      {assessment.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-12"
              >
                <Link
                  href="/assessments"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Explore assessments
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Teacher Tools Section - CRITICAL SECTION FOR TEACHERS */}
          <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-6">
              <div className="lg:col-span-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl mx-auto text-center"
                >
                  <div className="mb-6">
                    <span className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      🏫 For Department Heads & Teachers
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                    The Most Comprehensive Teacher Dashboard in Language Learning.
                  </h2>

                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    From predictive analytics to automated assignment management, LanguageGems offers a unified dashboard designed to give you complete control and valuable insights, saving you hours of administrative work. Our dashboard pinpoints <strong>student strengths and weaknesses by theme, topic, and vocabulary</strong>, enabling truly targeted intervention.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Real-time Predictive Analytics: Spot student weaknesses early.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PenTool className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Sophisticated Assignment Automation: Save hours with auto-grading.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Customizable & GCSE Curriculum-Aligned Content.</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/signup" className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
                      <Users className="mr-2 h-4 w-4" />
                      Start Your Free School Trial
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Why Choose LanguageGems? (Strong Differentiators) */}
          <div className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
                >
                  Why Choose LanguageGems? Unmatched Innovation for Language Departments
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-slate-600 max-w-3xl mx-auto"
                >
                  We are building the future of language education, providing tools that genuinely transform student engagement and teacher efficiency.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {differentiators.map((diff, index) => (
                  <motion.div
                    key={diff.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                      <diff.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{diff.title}</h3>
                    <p className="text-slate-600 text-sm">{diff.description}</p>
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