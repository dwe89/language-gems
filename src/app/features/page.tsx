import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../../components/layout/Footer';
import SEOWrapper from '../../components/seo/SEOWrapper';
import {
    Gamepad2,
    Brain,
    BarChart3,
    BookOpen,
    Users,
    Clock,
    Target,
    Sparkles,
    Gem,
    Trophy,
    Headphones,
    FileText,
    CheckCircle2,
    Zap,
    GraduationCap,
    Home,
    Building2,
    ArrowRight,
    Play,
    Star,
    Languages,
    Repeat,
    ClipboardCheck,
    LineChart,
    Volume2,
    Accessibility,
    Smartphone,
    Shield
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Features - LanguageGems | Complete Language Learning Platform',
    description: 'Discover 15+ engaging vocabulary games, GCSE alignment, spaced repetition, AI worksheets, homework setting, analytics, and more. LanguageGems transforms language learning for students, teachers, and schools.',
    openGraph: {
        title: 'Features - LanguageGems | Complete Language Learning Platform',
        description: 'Discover 15+ engaging vocabulary games, GCSE alignment, spaced repetition, AI worksheets, homework setting, analytics, and more.',
        url: 'https://languagegems.com/features',
        type: 'website',
    },
};

const games = [
    { name: 'VocabMaster', description: 'Master vocabulary through intelligent spaced repetition and progressive mastery levels', icon: Gem },
    { name: 'Memory Match', description: 'Classic memory game with vocabulary pairs to boost recall and recognition', icon: Brain },
    { name: 'Hangman', description: 'Traditional word guessing game with curriculum-aligned vocabulary', icon: Gamepad2 },
    { name: 'Conjugation Duel', description: 'Battle-style verb conjugation practice across all tenses', icon: Zap },
    { name: 'Sentence Towers', description: 'Build sentences by stacking words in the correct order', icon: Target },
    { name: 'Word Scramble', description: 'Unscramble letters to form correct vocabulary words', icon: Sparkles },
    { name: 'Vocab Blast', description: 'Fast-paced vocabulary challenge with time pressure', icon: Zap },
    { name: 'Detective Listening', description: 'Audio-based comprehension exercises with native pronunciation', icon: Headphones },
    { name: 'Noughts & Crosses', description: 'Strategic vocabulary game combining tic-tac-toe with language learning', icon: Gamepad2 },
    { name: 'Word Towers', description: 'Stack words correctly to build vocabulary towers', icon: Target },
    { name: 'Speed Builder', description: 'Race against the clock to form sentences quickly', icon: Clock },
    { name: 'Word Guesser', description: 'Guess the hidden word with limited hints', icon: Brain },
    { name: 'Verb Quest', description: 'Adventure-style verb conjugation journey', icon: Trophy },
    { name: 'Vocabulary Mining', description: 'Dig for vocabulary gems in this engaging excavation game', icon: Gem },
    { name: 'Lava Temple Word Restore', description: 'Restore words before the lava rises in this thrilling adventure', icon: Sparkles },
];

const coreFeatures = [
    {
        title: 'AQA & Edexcel GCSE Alignment',
        description: 'All vocabulary meticulously aligned with the latest AQA and Edexcel GCSE specifications. Support for both Foundation and Higher tiers, ensuring students are exam-ready.',
        icon: GraduationCap,
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        title: 'Intelligent Spaced Repetition',
        description: 'Our scientifically-proven spaced repetition algorithm ensures long-term vocabulary retention. Words are revisited at optimal intervals for maximum memory consolidation.',
        icon: Repeat,
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        title: 'Comprehensive Analytics',
        description: 'Deep insights into student strengths, weaknesses, and learning gaps. Track progress by topic, game, and time period with actionable data.',
        icon: LineChart,
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        title: 'Full Homework Setting',
        description: 'Create, assign, and track homework with automated marking and instant feedback. Set game-based assignments that students actually want to complete.',
        icon: ClipboardCheck,
        gradient: 'from-orange-500 to-red-500',
    },
    {
        title: 'AI-Generated Worksheets',
        description: 'Generate custom practice worksheets powered by AI. Create differentiated materials for any topic or vocabulary set in seconds.',
        icon: FileText,
        gradient: 'from-cyan-500 to-blue-500',
    },
    {
        title: 'Professional Audio',
        description: 'High-quality text-to-speech with native pronunciation for all vocabulary items. Support listening comprehension and pronunciation practice.',
        icon: Volume2,
        gradient: 'from-pink-500 to-rose-500',
    },
    {
        title: 'Custom Vocabulary Lists',
        description: 'Upload and integrate your own vocabulary sets seamlessly into all games. Perfect for specific lessons, exam preparation, or thematic units.',
        icon: BookOpen,
        gradient: 'from-indigo-500 to-purple-600',
    },
    {
        title: 'Gem Collection & Mastery',
        description: 'Students collect gems as they master vocabulary, creating a visual representation of their progress and motivating continued engagement.',
        icon: Gem,
        gradient: 'from-amber-500 to-orange-500',
    },
];

const additionalFeatures = [
    { title: '3 Languages', description: 'French, Spanish & German (Italian & Mandarin coming soon)', icon: Languages },
    { title: 'School-wide Leaderboards', description: 'Foster healthy competition with class and school rankings', icon: Trophy },
    { title: 'WCAG 2.1 AA Accessible', description: 'Full accessibility support for all learners', icon: Accessibility },
    { title: 'Responsive Design', description: 'Works beautifully on all devices', icon: Smartphone },
    { title: 'UK-Based Support', description: 'Priority support from our educational team', icon: Shield },
    { title: 'Multi-Game Assignments', description: 'Combine multiple games for diverse homework', icon: Gamepad2 },
];

export default function FeaturesPage() {
    return (
        <SEOWrapper>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden py-20 lg:py-32">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
                        <div className="container mx-auto px-6 relative z-10">
                            <div className="text-center max-w-5xl mx-auto">
                                <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-lg">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Complete Language Learning Platform
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
                                    <span className="text-slate-800">Everything You Need to</span>
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                                        Transform MFL Learning
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                    15+ engaging games, GCSE alignment, spaced repetition, AI worksheets,
                                    homework setting, comprehensive analytics, and so much more.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/pricing"
                                        className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                    >
                                        View Pricing
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="/games"
                                        className="inline-flex items-center justify-center bg-white text-slate-800 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-slate-200"
                                    >
                                        <Play className="mr-2 w-5 h-5" />
                                        Try Games Free
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Games Section */}
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-lg">
                                    <Gamepad2 className="w-4 h-4 mr-2" />
                                    15+ Engaging Games
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                                    Games That Students Actually Want to Play
                                </h2>
                                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                    Transform vocabulary learning from a chore into an adventure. Our diverse collection of games keeps students engaged and motivated.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {games.map((game, index) => {
                                    const IconComponent = game.icon;
                                    return (
                                        <div
                                            key={game.name}
                                            className="group bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <IconComponent className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg mb-2">{game.name}</h3>
                                                    <p className="text-slate-600 text-sm leading-relaxed">{game.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="text-center mt-12">
                                <Link
                                    href="/games"
                                    className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    <Play className="mr-2 w-5 h-5" />
                                    Try All Games Free
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Core Features Section */}
                    <section className="py-20">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-lg">
                                    <Star className="w-4 h-4 mr-2" />
                                    Powerful Features
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                                    Built for Real Learning Outcomes
                                </h2>
                                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                    Every feature is designed with one goal: helping students master vocabulary and succeed in their exams.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                {coreFeatures.map((feature, index) => {
                                    const IconComponent = feature.icon;
                                    return (
                                        <div
                                            key={feature.title}
                                            className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                                            <p className="text-slate-600 leading-relaxed text-lg">{feature.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Additional Features Grid */}
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                                    And So Much More...
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                {additionalFeatures.map((feature, index) => {
                                    const IconComponent = feature.icon;
                                    return (
                                        <div
                                            key={feature.title}
                                            className="flex items-center gap-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200"
                                        >
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex-shrink-0">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{feature.title}</h3>
                                                <p className="text-slate-600 text-sm">{feature.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Who It's For Section */}
                    <section className="py-20">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                                    Perfect For Everyone
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {/* Students */}
                                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105">
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 inline-block mb-6">
                                        <GraduationCap className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Students</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">Master GCSE vocabulary through games</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">Track your progress with gems & levels</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">Practice pronunciation with audio</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">Compete with classmates on leaderboards</span>
                                        </li>
                                    </ul>
                                    <Link
                                        href="/pricing"
                                        className="mt-6 inline-flex items-center text-purple-600 font-bold hover:text-purple-700"
                                    >
                                        Student Plans <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                {/* Teachers */}
                                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105">
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 inline-block mb-6">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Teachers & Tutors</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">Set engaging game-based homework</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">Track student progress with analytics</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">Create custom vocabulary lists</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">Auto-marked assignments save hours</span>
                                        </li>
                                    </ul>
                                    <Link
                                        href="/pricing"
                                        className="mt-6 inline-flex items-center text-blue-600 font-bold hover:text-blue-700"
                                    >
                                        Teacher Plans <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                {/* Schools */}
                                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:scale-105">
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 inline-block mb-6">
                                        <Building2 className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Schools</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">UNLIMITED students & teachers</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">School-wide analytics dashboard</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">GCSE aligned curriculum</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-600">One transparent price for everything</span>
                                        </li>
                                    </ul>
                                    <Link
                                        href="/schools/pricing"
                                        className="mt-6 inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700"
                                    >
                                        School Plans <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to Transform Language Learning?
                            </h2>
                            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                                Join thousands of students and teachers already using LanguageGems to master vocabulary and achieve better exam results.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/games"
                                    className="inline-flex items-center justify-center bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    <Play className="mr-2 w-5 h-5" />
                                    Try Games Free
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/30"
                                >
                                    View Pricing
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </SEOWrapper>
    );
}
