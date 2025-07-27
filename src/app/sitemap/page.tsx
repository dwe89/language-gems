import Link from 'next/link';
import { MapPin, GraduationCap, Users, BookOpen, Gamepad2, Target, Shield, Settings, FileText, HelpCircle } from 'lucide-react';

interface PageLink {
  href: string;
  title: string;
  description: string;
}

interface SectionCardProps {
  title: string;
  pages: PageLink[];
  icon: React.ComponentType<any>;
  bgColor?: string;
}

export default function SitemapPage() {
  const mainPages = [
    { href: '/', title: 'Home', description: 'Welcome to LanguageGems - Interactive language learning platform' },
    { href: '/about', title: 'About', description: 'Learn about Daniel Etienne and the LanguageGems mission' },
    { href: '/blog', title: 'Blog', description: 'Educational insights and language learning tips' },
    { href: '/community', title: 'Community', description: 'Connect with fellow language learners and educators' },
  ];

  const accountPages = [
    { href: '/dashboard', title: 'Dashboard', description: 'Your personal learning dashboard' },
    { href: '/account', title: 'Account Settings', description: 'Manage your account preferences' },
    { href: '/account/orders', title: 'Order History', description: 'View your purchase history' },
  ];

  const schoolPages = [
    { href: '/schools', title: 'For Schools', description: 'Educational solutions for schools and institutions' },
    { href: '/schools/pricing', title: 'School Pricing', description: 'Flexible pricing plans for educational institutions' },
  ];

  const gamePages = [
    { href: '/games', title: 'Games Hub', description: 'Interactive language learning games' },
    { href: '/games/gem-collector', title: 'Gem Collector', description: 'Collect gems while learning vocabulary' },
    { href: '/games/detective-listening', title: 'Detective Listening', description: 'Develop listening skills through detective work' },
    { href: '/games/memory-master', title: 'Memory Master', description: 'Enhance vocabulary retention with memory games' },
    { href: '/games/speed-builder', title: 'Speed Builder', description: 'Build language skills with speed challenges' },
    { href: '/games/lava-temple', title: 'Lava Temple', description: 'Adventure-based language learning' },
    { href: '/games/multi-game', title: 'Multi-Game Mode', description: 'Multiple games in one experience' },
  ];

  const examPages = [
    { href: '/exams', title: 'Exam Support', description: 'GCSE and curriculum-aligned content' },
    { href: '/exams/specification', title: 'Exam Specifications', description: 'Detailed exam board specifications' },
    { href: '/exams/aqa', title: 'AQA Exams', description: 'AQA exam board resources' },
    { href: '/exams/edexcel', title: 'Edexcel Exams', description: 'Edexcel exam board resources' },
    { href: '/exams/aqa/gcse', title: 'AQA GCSE', description: 'AQA GCSE language resources' },
    { href: '/exams/edexcel/gcse', title: 'Edexcel GCSE', description: 'Edexcel GCSE language resources' },
  ];

  const teacherPages = [
    { href: '/teacher', title: 'Teacher Hub', description: 'Tools and resources for educators' },
    { href: '/teacher/assignments', title: 'Assignments', description: 'Create and manage student assignments' },
    { href: '/teacher/assignments/create', title: 'Create Assignment', description: 'Build custom assignments for students' },
    { href: '/teacher/analytics', title: 'Analytics', description: 'Track student progress and performance' },
    { href: '/teacher/students', title: 'Student Management', description: 'Manage your students and classes' },
    { href: '/teacher/vocabulary', title: 'Vocabulary Management', description: 'Customize vocabulary sets' },
    { href: '/teacher/worksheets', title: 'Worksheet Generator', description: 'Create printable worksheets' },
  ];

  const resourcePages = [
    { href: '/worksheets', title: 'Worksheets', description: 'Printable language learning worksheets' },
    { href: '/worksheets/create', title: 'Create Worksheet', description: 'Generate custom worksheets' },
    { href: '/vocabulary', title: 'Vocabulary', description: 'Browse and learn vocabulary sets' },
  ];

  const comingSoonPages = [
    { href: '/coming-soon/games', title: 'Upcoming Games', description: 'Preview of games in development' },
    { href: '/coming-soon/themes', title: 'New Themes', description: 'Upcoming curriculum themes' },
  ];

  const legalPages = [
    { href: '/privacy', title: 'Privacy Policy', description: 'How we protect your privacy' },
    { href: '/terms', title: 'Terms of Service', description: 'Terms and conditions of use' },
    { href: '/cookies', title: 'Cookie Policy', description: 'Information about our cookie usage' },
  ];

  const SectionCard = ({ title, pages, icon: Icon, bgColor = "bg-white" }: SectionCardProps) => (
    <div className={`${bgColor} rounded-2xl p-8 shadow-lg border border-gray-100`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">
        {pages.map((page: PageLink, index: number) => (
          <div key={index} className="border-l-4 border-indigo-200 pl-4 py-2 hover:border-indigo-400 transition-colors">
            <Link 
              href={page.href}
              className="block group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {page.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{page.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  return (
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
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
              <MapPin className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Site Map
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Explore all the features and resources available on LanguageGems
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Navigate LanguageGems
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Find everything you need to enhance your language learning journey
              </p>
            </div>

            {/* Site Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              <SectionCard 
                title="Main Pages" 
                pages={mainPages} 
                icon={BookOpen}
                bgColor="bg-gradient-to-br from-blue-50 to-indigo-50"
              />
              
              <SectionCard 
                title="Account & Dashboard" 
                pages={accountPages} 
                icon={Settings}
                bgColor="bg-gradient-to-br from-green-50 to-emerald-50"
              />
              
              <SectionCard 
                title="For Schools" 
                pages={schoolPages} 
                icon={GraduationCap}
                bgColor="bg-gradient-to-br from-purple-50 to-violet-50"
              />
              
              <SectionCard 
                title="Interactive Games" 
                pages={gamePages} 
                icon={Gamepad2}
                bgColor="bg-gradient-to-br from-orange-50 to-red-50"
              />
              
              <SectionCard 
                title="Exam Support" 
                pages={examPages} 
                icon={Target}
                bgColor="bg-gradient-to-br from-cyan-50 to-blue-50"
              />
              
              <SectionCard 
                title="Teacher Tools" 
                pages={teacherPages} 
                icon={Users}
                bgColor="bg-gradient-to-br from-pink-50 to-rose-50"
              />
              
              <SectionCard 
                title="Learning Resources" 
                pages={resourcePages} 
                icon={FileText}
                bgColor="bg-gradient-to-br from-amber-50 to-yellow-50"
              />
              
              <SectionCard 
                title="Coming Soon" 
                pages={comingSoonPages} 
                icon={HelpCircle}
                bgColor="bg-gradient-to-br from-gray-50 to-slate-50"
              />
              
              <SectionCard 
                title="Legal & Privacy" 
                pages={legalPages} 
                icon={Shield}
                bgColor="bg-gradient-to-br from-stone-50 to-neutral-50"
              />
            </div>

            {/* Quick Navigation */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Navigation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  href="/dashboard"
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all group"
                >
                  <Settings className="h-8 w-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-gray-900">Dashboard</span>
                </Link>
                <Link 
                  href="/games"
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all group"
                >
                  <Gamepad2 className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-gray-900">Games</span>
                </Link>
                <Link 
                  href="/teacher"
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all group"
                >
                  <Users className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-gray-900">Teacher Hub</span>
                </Link>
                <Link 
                  href="/schools"
                  className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all group"
                >
                  <GraduationCap className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-gray-900">Schools</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
