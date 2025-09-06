import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { GraduationCap, Award, Users, BookOpen, MessageCircle, Star, Shield, Target, Heart, Lightbulb, Globe, CheckCircle, Music, Brain, TrendingUp, BarChart2, Gamepad, Edit } from 'lucide-react'; // Added new icons
import SEOWrapper from '../../components/seo/SEOWrapper';
import { generateMetadata } from '../../components/seo/SEOWrapper';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = generateMetadata({
  title: 'About Daniel Etienne - MFL Teacher, Language Gems Founder, EdTech Innovator',
  description: 'Meet Daniel Etienne, experienced MFL teacher, GCSE examiner, and founder of Language Gems, LingoSongs, and TeachWhizz. Discover his passion for innovative language learning and student success.',
  keywords: [
    'Daniel Etienne',
    'MFL teacher',
    'Language Gems founder',
    'LingoSongs',
    'TeachWhizz',
    'GCSE examiner',
    'language learning expert',
    'GCSE language teacher',
    'educational technology',
    'modern foreign languages',
    'language education specialist',
    'AI in education'
  ],
  canonical: '/about',
});

export default function AboutPage() {
  const achievements = [
    {
      icon: GraduationCap,
      title: "7+ Years Teaching Experience",
      description: "Dedicated MFL educator since 2018"
    },
    {
      icon: Award,
      title: "GCSE Examiner Experience",
      description: "Direct experience in national assessment processes"
    },
    {
      icon: Users,
      title: "Curriculum Design Expert",
      description: "Creating inclusive learning environments"
    },
    {
      icon: Target,
      title: "Assessment Specialist",
      description: "Contributing to standardisation processes"
    },
    {
      icon: Music,
      title: "Founder of LingoSongs",
      description: "Creating engaging language learning songs and resources via LingoSongs.com"
    },
    {
      icon: Brain,
      title: "Creator of TeachWhizz",
      description: "Developing AI-powered tools for educators at TeachWhizz.com"
    }
  ];

  // New array for market gaps
  const marketGaps = [
    {
      icon: BarChart2,
      title: "Granular Vocabulary Tracking",
      description: "Tools to precisely see what vocabulary students know and don't know, identifying strengths and weaknesses across topics, units, and themes, both individually and at a class level for effective planning."
    },
    {
      icon: TrendingUp,
      title: "Exam & Assessment Insights",
      description: "Understanding student strengths and weaknesses in specific exam question types, themes, and units, and providing this crucial feedback to students so they can take ownership of their learning."
    },
    {
      icon: Gamepad,
      title: "Engaging & Thematic Games",
      description: "A need for creative, immersive, and thematic language learning games that go beyond repetitive, boring matchups, making learning genuinely enjoyable."
    },
    {
      icon: Edit,
      title: "Customizable Content & Assignment Tools",
      description: "The ability for teachers to assign their own custom vocabulary to interactive games, enabling direct classroom play, homework assignments with progress tracking, and fostering student ownership of their learning journey."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Student-Centered Learning",
      description: "Every student deserves to feel confident and engaged in their language learning journey."
    },
    {
      icon: Lightbulb,
      title: "Innovation in Education",
      description: "Combining traditional teaching excellence with cutting-edge technology and methodology."
    },
    {
      icon: Globe,
      title: "Cultural Understanding",
      description: "Languages are windows to cultures, fostering global citizenship and empathy."
    },
    {
      icon: BookOpen,
      title: "Lifelong Learning",
      description: "Empowering students with skills and confidence that extend far beyond the classroom."
    }
  ];

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ];

  return (
    <SEOWrapper breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Founder Photo */}
            <div className="mx-auto w-32 h-32 mb-8 shadow-2xl rounded-full overflow-hidden">
              <Image
                src="/images/homepage/founder.jpg"
                alt="Photo of founder, Daniel Etienne"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Meet Daniel Etienne
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Passionate Modern Foreign Languages teacher, educational innovator, and creator of LanguageGems, LingoSongs, and TeachWhizz
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">7+</div>
                <div className="text-gray-300 text-sm">Years Teaching</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">1000+</div>
                <div className="text-gray-300 text-sm">Students Inspired</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">50+</div>
                <div className="text-gray-300 text-sm">Resources Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">∞</div>
                <div className="text-gray-300 text-sm">Passion for Languages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                My Journey in Language Education
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From classroom innovation to digital transformation, here's how I'm revolutionizing language learning
              </p>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-slate-700 leading-relaxed mb-6">
                    Hello! I'm Daniel Etienne, a passionate Modern Foreign Languages (MFL) teacher with over seven years' experience in educating and inspiring students since 2018. My journey in education has been driven by a simple yet powerful belief: every student has the potential to excel in language learning when given the right tools and encouragement.
                  </p>
                  
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Throughout my career, I have developed a deep understanding of language acquisition, curriculum design, and student engagement. I am committed to creating inclusive and dynamic learning environments where students can thrive and gain confidence in their language skills. This commitment led me to create LanguageGems – a platform that bridges traditional teaching excellence with innovative technology.
                  </p>
                  
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    In addition to teaching, I also serve as a <strong>GCSE examiner</strong>, bringing direct experience to the national assessment process. This background has provided me with invaluable insights into exam preparation and the critical importance of targeted, constructive feedback in student development.
                  </p>

                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Beyond the classroom and LanguageGems, I am the founder of <strong>LingoSongs.com</strong> and run the associated TikTok channel, where I create engaging songs to help students learn languages in a fun and memorable way. I also developed <strong>TeachWhizz.com</strong>, a platform dedicated to providing AI-powered tools designed to support and empower fellow educators.
                  </p>
                  
                  <p className="text-lg text-slate-600 leading-relaxed">
                    I am dedicated to supporting both learners and educators by providing high-quality resources and innovative teaching strategies tailored to the needs of today's digital-native classrooms. Through LanguageGems, LingoSongs, and TeachWhizz, I aim to make language learning more accessible, engaging, and effective for students worldwide.
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{achievement.title}</h3>
                    <p className="text-slate-600">{achievement.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* New Section: Identifying and Addressing Gaps in Language Education */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Identifying and Addressing Gaps in Language Education
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Throughout my teaching career, I've observed specific challenges in language learning. These insights inspired the development of platforms designed to bridge these gaps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {marketGaps.map((gap, index) => {
                const IconComponent = gap.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{gap.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{gap.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                My Educational Philosophy
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                The core values that drive my approach to language education and inspire every feature of LanguageGems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 border border-indigo-100 hover:border-indigo-200 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Let's Connect!
            </h2>
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto">
              Thank you for visiting LanguageGems.com. I look forward to connecting with fellow educators, language enthusiasts, and anyone passionate about transforming education through technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Explore the Platform
              </Link>
              <Link 
                href="/blog" 
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Read My Blog
              </Link>
            </div>

            {/* Added links to LingoSongs and TeachWhizz */}
            <div className="mt-8 text-slate-700 text-lg">
                <p className="mb-4">Also explore my other projects:</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="https://lingosongs.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-700 hover:text-indigo-900 font-medium transition-colors">
                    <Music className="h-5 w-5 mr-2" /> LingoSongs.com
                  </a>
                  <a href="https://teachwhizz.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-700 hover:text-indigo-900 font-medium transition-colors">
                    <Brain className="h-5 w-5 mr-2" /> TeachWhizz.com
                  </a>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-start gap-4 mb-6">
                <Shield className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Important Disclaimer</h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 mb-4">
                      LanguageGems.com, LingoSongs.com, and TeachWhizz.com are independent educational resources 
                      created and managed by Daniel Etienne, a qualified Modern Foreign Languages teacher with 
                      extensive experience in language teaching and assessment.
                    </p>
                    <p className="text-slate-700 mb-4">
                      <strong>Please note:</strong> These platforms are not affiliated with, endorsed by, or sponsored by any 
                      examination board or official educational body. The content and resources provided are for educational 
                      support and personal use only.
                    </p>
                    <p className="text-slate-700">
                      Any references to national assessment experience are shared in a general professional capacity and do not 
                      imply formal representation or endorsement by examination organisations. All resources and teaching strategies 
                      are based on professional experience and educational best practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      
      <Footer />
    </SEOWrapper>
  );
}