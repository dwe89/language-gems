import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Gamepad2, BarChart3, Users, BookOpen, FileText, 
  Star, Target, Zap, Clock, Award, CheckCircle,
  Play, Activity, Trophy, Brain, Sparkles, Rocket
} from 'lucide-react';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Explore LanguageGems Features | Interactive Language Learning',
  description: 'Discover all the powerful features that make LanguageGems the leading platform for language education - games, analytics, assignments, and more.',
};

export default function ExplorePage() {
  const gameFeatures = [
    {
      icon: Gamepad2,
      title: "Memory Challenge",
      description: "Test vocabulary retention with our adaptive memory game that adjusts difficulty based on performance.",
      color: "from-purple-500 to-pink-500",
      highlight: "15+ Game Types"
    },
    {
      icon: Zap,
      title: "Word Blast",
      description: "Fast-paced vocabulary matching game that builds quick recall and language recognition skills.",
      color: "from-blue-500 to-cyan-500",
      highlight: "Timed Challenges"
    },
    {
      icon: Trophy,
      title: "Conjugation Duel",
      description: "Master verb conjugations through competitive gameplay with real-time grammar feedback.",
      color: "from-green-500 to-emerald-500",
      highlight: "Grammar Focus"
    }
  ];

  const analyticsFeatures = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track student progress with detailed insights into vocabulary mastery, game performance, and learning patterns.",
      benefits: ["Individual Progress Tracking", "Class Performance Overview", "Mastery Level Indicators"]
    },
    {
      icon: Target,
      title: "Curriculum Alignment",
      description: "Content specifically designed for GCSE, A-Level, and international language curricula.",
      benefits: ["GCSE Theme Coverage", "Exam Board Alignment", "Progress Milestones"]
    },
    {
      icon: Brain,
      title: "Learning Insights",
      description: "AI-powered recommendations to help students focus on areas that need the most improvement.",
      benefits: ["Personalized Recommendations", "Weakness Identification", "Study Path Optimization"]
    }
  ];

  const teacherTools = [
    {
      icon: Users,
      title: "Classroom Management",
      description: "Effortlessly manage multiple classes, assign work, and monitor student engagement.",
      features: ["Class Creation", "Student Management", "Assignment Distribution", "Progress Monitoring"]
    },
    {
      icon: FileText,
      title: "Assessment Tools",
      description: "Create and deploy comprehensive assessments with automatic grading and detailed feedback.",
      features: ["Reading Comprehension", "Listening Exercises", "Vocabulary Tests", "Grammar Assessments"]
    },
    {
      icon: Award,
      title: "Curriculum Resources",
      description: "Access thousands of curriculum-aligned resources, worksheets, and teaching materials.",
      features: ["Downloadable Worksheets", "Audio Files", "Vocabulary Lists", "Teaching Guides"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-8">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Explore LanguageGems
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
              Discover the comprehensive language learning platform that combines interactive games, 
              powerful analytics, and curriculum-aligned content to transform language education.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full border border-purple-400/30">
                <Star className="inline h-4 w-4 mr-1" />
                15+ Interactive Games
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-400/30">
                <Activity className="inline h-4 w-4 mr-1" />
                Real-time Analytics
              </span>
              <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full border border-green-400/30">
                <CheckCircle className="inline h-4 w-4 mr-1" />
                GCSE Aligned
              </span>
            </div>
          </div>

          {/* Interactive Games Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Interactive Language Games
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Engage students with our collection of research-backed language learning games 
                that make vocabulary and grammar practice fun and effective.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {gameFeatures.map((game, index) => (
                <div key={index} className="group">
                  <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${game.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <game.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-sm text-cyan-400 font-semibold mb-2">{game.highlight}</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{game.title}</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/games" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                <Play className="h-5 w-5 mr-2" />
                Try All Games
              </Link>
            </div>
          </section>

          {/* Analytics & Insights Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powerful Analytics & Insights
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get detailed insights into student progress with our comprehensive analytics dashboard 
                that tracks mastery, identifies learning gaps, and provides actionable recommendations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {analyticsFeatures.map((feature, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-cyan-400/40 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-cyan-300">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 mr-2 text-cyan-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Teacher Tools Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Complete Teacher Toolkit
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything teachers need to deliver engaging language lessons, track student progress, 
                and manage their classroom effectively.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {teacherTools.map((tool, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-900/40 to-emerald-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-emerald-400/40 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-6">
                    <tool.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-emerald-300">{tool.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links Grid */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Explore More Features
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Schools */}
              <Link href="/schools" className="group">
                <div className="bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                  <Users className="h-12 w-12 text-cyan-300 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold mb-2 text-cyan-300">For Schools</h3>
                  <p className="text-gray-300 text-sm">
                    Comprehensive educational solutions
                  </p>
                </div>
              </Link>

              {/* Assessments */}
              <Link href="/assessments" className="group">
                <div className="bg-gradient-to-br from-indigo-900/40 to-emerald-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                  <FileText className="h-12 w-12 text-emerald-300 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold mb-2 text-emerald-300">Assessments</h3>
                  <p className="text-gray-300 text-sm">
                    GCSE-style exam practice
                  </p>
                </div>
              </Link>

              {/* Resources */}
              <Link href="/resources" className="group">
                <div className="bg-gradient-to-br from-indigo-900/40 to-amber-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20 hover:border-amber-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                  <BookOpen className="h-12 w-12 text-amber-300 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold mb-2 text-amber-300">Resources</h3>
                  <p className="text-gray-300 text-sm">
                    Worksheets & teaching materials
                  </p>
                </div>
              </Link>

              {/* Blog */}
              <Link href="/blog" className="group">
                <div className="bg-gradient-to-br from-indigo-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center">
                  <Rocket className="h-12 w-12 text-pink-300 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold mb-2 text-pink-300">Blog</h3>
                  <p className="text-gray-300 text-sm">
                    Latest insights & tips
                  </p>
                </div>
              </Link>

            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-3xl p-12 border border-purple-400/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Ready to Transform Language Learning?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join the growing community of educators using LanguageGems to make 
              language learning more engaging, effective, and enjoyable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/schools/pricing" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                <Users className="h-5 w-5 mr-2" />
                School Pricing
              </Link>
              <Link href="/games" className="inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105">
                <Play className="h-5 w-5 mr-2" />
                Try Games Free
              </Link>
              <Link href="/contact-sales" className="inline-flex items-center border-2 border-purple-400 text-purple-300 px-8 py-4 rounded-xl font-bold hover:bg-purple-400 hover:text-white transition-all duration-300">
                <Clock className="h-5 w-5 mr-2" />
                Book Demo
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
