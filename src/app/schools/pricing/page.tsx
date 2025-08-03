import Link from 'next/link';
import { Metadata } from 'next';
import Footer from '../../../components/layout/Footer'; // Assuming Footer path is correct
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { getPricingSchema, getFAQSchema } from '../../../lib/seo/structuredData';
import {
  Check,
  Star,
  Building2,
  Zap,
  Sparkles,
  Target,
  BookOpen,
  BarChart3,
  Clock,
  Gem
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing Plans for UK Schools | LanguageGems',
  description: 'Stop paying more for less. LanguageGems offers transparent annual pricing tiers for your ENTIRE school, with unlimited teachers, unlimited students, and zero hidden costs. Get deep, actionable insights into student strengths & weaknesses, weak words, and GCSE topics at both individual and class level.', // UPDATED METADATA
};

// Define the pricing plans based on our refined strategy
const pricingPlans = [
  {
    name: 'Basic Plan',
    price: '£399',
    period: '/year',
    description: 'Perfect for smaller schools or departments focusing on core vocabulary acquisition and gamified practice.',
    subtitle: 'Whole-class access to all games and languages, designed for shared use without individual student tracking.',
    features: [
      'Access for all MFL teachers for classroom-wide, shared use',
      'Access for all students for whole-class game play',
      'Full Access to ALL Available Languages: French, Spanish, German (more coming soon!)',
      '15+ Engaging Gamified Learning Activities: VocabMaster, Memory Match, Hangman, Word Scramble, and more!',
      'Professional Audio Integration: High-quality text-to-speech for all vocabulary items',
      'Built for Modern Classrooms: Responsive design, WCAG 2.1 AA accessibility'
    ],
    limitations: [
      'Individual Student Logins & Progress Tracking: Not included in this tier',
      'Custom Vocabulary Lists: Not included in this tier',
      'Homework Setting Capability: Not included in this tier'
    ],
    buttonText: 'Get Basic Plan',
    buttonLink: '/schools/contact?plan=basic',
    highlighted: false,
    gradient: 'from-blue-500 to-cyan-500',
    borderGradient: 'from-blue-400 to-cyan-400',
    icon: BookOpen,
  },
  {
    name: 'Standard Plan',
    price: '£799',
    period: '/year',
    description: 'The ultimate value for most secondary schools with up to 750 students. Unlocks full features and powerful teacher tools.',
    subtitle: 'Comprehensive solution including individual student logins, data tracking, analytics, and all advanced features for a single school.',
    features: [
      'All Basic Plan Features (with individual logins enabled)',
      'Unlimited Teacher Accounts: Full access for all MFL teachers',
      'Individual Student Logins for up to 750 Students: Empower every student to learn and track their progress',
      'Comprehensive Data Analysis Platform: Instant, in-depth insights into student strengths & weaknesses, identifying specific learning gaps',
      'Full Homework Setting Capability: Create, assign, track homework with automated marking and instant feedback',
      'Fully Aligned Vocabulary: AQA/Edexcel GCSE specifications alignment for exam support',
      'Real-time Analytics & Insights: Actionable data on student progress, performance, and engagement',
      'Multi-Game Assignment System: Combine multiple games for diverse assignments',
      'Custom Vocabulary Lists: Upload and integrate your own vocabulary sets',
      'Spaced Repetition & Gem Collection: Advanced vocabulary retention with mastery levels',
      'Competition Features: School-wide leaderboards & achievement systems'
    ],
    buttonText: 'Get Standard Plan',
    buttonLink: '/schools/contact?plan=standard',
    highlighted: true,
    gradient: 'from-emerald-500 to-teal-500',
    borderGradient: 'from-emerald-400 to-teal-400',
    icon: Gem,
  },
  {
    name: 'Large School Plan',
    price: '£1,199',
    period: '/year',
    description: 'Designed for larger secondary schools (over 750 students) needing robust support and deeper insights.',
    subtitle: 'All Standard Plan features, optimized for larger student bodies with priority support and advanced reporting.',
    features: [
      'All Standard Plan Features',
      'Individual Student Logins for Unlimited Students: Optimized for larger student bodies (>750 students)',
      'Priority Email and Chat Support',
      'Advanced Analytics & Custom Reports: Deeper data insights and tailored reporting options, including cross-class comparative analysis',
      'Dedicated Onboarding Support',
      'Strategic Partnership for feature requests and feedback'
    ],
    buttonText: 'Get Large School Plan',
    buttonLink: '/schools/contact?plan=large-school',
    highlighted: false,
    gradient: 'from-purple-500 to-pink-500',
    borderGradient: 'from-purple-400 to-pink-400',
    icon: Zap,
  },
];

const matPlan = {
  name: 'MAT Plan',
  price: 'Custom Pricing',
  period: '- Contact Us for a Quote',
  description: 'Multi-Academy Trusts (MATs) with multiple schools seeking a centralized solution with trust-level oversight and consolidated billing.',
  subtitle: 'Tailored pricing based on the number and size of schools within the MAT with strategic partnership benefits.',
  features: [
    'Tailored pricing based on the number and size of schools within the MAT',
    'Consolidated billing and reporting across all schools',
    'Centralized account management for the MAT',
    'Strategic partnership for long-term integration and development',
    'All features of the Whole School Plan extended across the trust',
    'Dedicated account manager and priority support',
    'Custom training and implementation support',
    'Trust-wide analytics and reporting dashboard'
  ],
  buttonText: 'Contact for Quote',
  buttonLink: '/schools/contact?plan=mat',
  highlighted: false, // MAT plan is not highlighted in the main pricing section
  gradient: 'from-slate-600 to-slate-800',
  borderGradient: 'from-slate-500 to-slate-700',
  icon: Building2,
};




const faqs = [
  {
    question: "Why is LanguageGems so competitively priced compared to other platforms?",
    answer: "Unlike many competitors who charge per language (£500-600+ each) or per student (£2-7 each), LanguageGems offers clear, transparent pricing for your entire school. Our efficient, AI-assisted development model allows us to provide exceptional value without the high overheads of traditional software companies. A typical school teaching 3 languages could save over £1000 annually compared to per-language pricing models, and even more compared to per-student models.",
  },
  {
    question: "What's the difference between the Basic, Standard, and Large School Plans?",
    answer: "The Basic Plan provides core game access for class-wide use without individual student logins or tracking. The Standard Plan unlocks full individual student logins, comprehensive progress tracking, homework setting, and detailed analytics. The Large School Plan offers all Standard features, optimized for schools with over 750 students, along with priority support and advanced reporting capabilities.",
  },
  {
    question: "How does LanguageGems align with AQA and Edexcel GCSE requirements?",
    answer: "Our vocabulary is meticulously aligned with the latest AQA and Edexcel GCSE specifications. Teachers can track student progress against curriculum objectives, and our spaced repetition system ensures students retain vocabulary for exam success. We support both Foundation and Higher tier requirements.",
  },
  {
    question: "Can we integrate LanguageGems with our existing school systems?",
    answer: "Yes! LanguageGems supports CSV imports for easy student data management, and our comprehensive analytics can be exported for your school's reporting needs. Our assignment system works seamlessly with existing homework workflows.",
  },
  {
    question: "What support do you provide for implementation and teacher training?",
    answer: "All Standard and Large School plans include comprehensive teacher training, implementation support, detailed documentation, tutorial videos, and ongoing assistance. We provide UK-based educational support to ensure your staff can maximize the platform's potential.",
  },
  {
    question: "Is there a minimum contract length?",
    answer: "All plans are billed annually to provide the best value and predictable pricing. This helps schools budget effectively without worrying about per-student overages or language add-on costs. MAT plans can be customized based on your specific requirements.",
  },
];

export default function SchoolsPricingPage() {
  // Generate structured data for pricing
  const pricingStructuredData = getPricingSchema(pricingPlans);
  const faqStructuredData = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Schools', url: '/schools' },
    { name: 'Pricing', url: '/schools/pricing' }
  ];

  return (
    <SEOWrapper
      structuredData={[pricingStructuredData, faqStructuredData]}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-800">
              LanguageGems:
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Pricing Plans
              </span>
              <span className="block text-slate-700">for UK Schools</span>
            </h1>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 mb-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                Stop paying more for less.
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                LanguageGems offers <strong className="text-blue-600">transparent annual pricing tiers</strong> for your <strong className="text-blue-600">ENTIRE school</strong>.
              </p>
            </div>
            <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Experience the future of MFL education: engaging, adaptive language learning with powerful tools for every teacher and student, all designed to transform results, not budgets.
            </p>
          </div>

          {/* Competitive Advantages Section - MOVED TO TOP */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                ⚔️ Why LanguageGems Outperforms the Competition
              </span>
            </h2>
            <div className="space-y-12 max-w-4xl mx-auto">
              {/* Tired of Paying Per Language */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-200 shadow-lg">
                <h3 className="text-2xl font-bold text-red-600 mb-4">💸 Tired of Paying Per Language?</h3>
                <p className="text-slate-700 text-lg mb-4">
                  Some platforms charge <strong className="text-red-600">£500-£600+ *per language*</strong>. If you teach French, Spanish, and German, you could pay over <strong className="text-red-600">£1700 annually!</strong>
                </p>
                <p className="text-emerald-700 text-xl font-semibold bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  ✅ LanguageGems gives you <strong>ALL your languages for one transparent tier price</strong>. That's a massive saving for multi-language departments, year after year.
                </p>
              </div>

              {/* Sick of Per-Student Charges */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">😤 Sick of Per-Student Charges & Hidden Fees?</h3>
                <p className="text-slate-700 text-lg mb-4">
                  Certain providers lure you in with a low base price, then hit you with hidden fees of <strong className="text-purple-600">£2-£7 *per student*</strong>. A medium-sized school could easily pay an extra <strong className="text-purple-600">£1000-£2000 annually</strong> just for student logins, making budgeting a nightmare!
                </p>
                <p className="text-emerald-700 text-xl font-semibold bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  ✅ LanguageGems offers <strong>unlimited student logins for one transparent tier price</strong>. No surprises, just predictable, all-inclusive budgeting for your whole school.
                </p>
              </div>

              {/* Beyond Basic Practice */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">🎯 Beyond Basic Practice – Deep Insights & Curriculum Alignment</h3>
                <p className="text-slate-700 text-lg mb-4">
                  Many sites offer simple drills or basic activity builders, or focus on a single methodology, providing limited actionable data.
                </p>
                <p className="text-emerald-700 text-xl font-semibold bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  ✅ LanguageGems provides a <strong>deeply gamified, adaptive, and analytical platform with direct curriculum alignment</strong>. We don't just give students exercises; we engage them with rich, diverse games, provide teachers with comprehensive data analysis on strengths/weaknesses and gaps, and ensure our vocabulary directly supports AQA and Edexcel exams.
                </p>
              </div>

              {/* True Whole-School Access */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 shadow-lg">
                <h3 className="text-2xl font-bold text-green-600 mb-4">🏫 True Whole-School Access vs. Artificial Caps</h3>
                <p className="text-slate-700 text-lg mb-4">
                  Some platforms cap teacher or student numbers, forcing awkward compromises or costly upgrades, or have complex tiered structures that become unmanageable.
                </p>
                <p className="text-emerald-700 text-xl font-semibold bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  ✅ LanguageGems delivers <strong>true whole-school freedom based on your chosen tier: Unlimited teachers, unlimited students, all languages</strong>. Grow your MFL department without worrying about your subscription.
                </p>
              </div>

              {/* Homework Made Easy */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-amber-200 shadow-lg">
                <h3 className="text-2xl font-bold text-amber-600 mb-4">📝 Homework Made Easy</h3>
                <p className="text-slate-700 text-lg mb-4">
                  Many platforms offer basic assignment features that still require significant teacher time for setup and manual marking.
                </p>
                <p className="text-emerald-700 text-xl font-semibold bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  ✅ LanguageGems provides <strong>full homework setting capabilities with automated marking and instant student feedback</strong>, significantly reducing teacher workload and centralizing your assignment management.
                </p>
              </div>
            </div>
          </section>

          {/* --- */}

          {/* Pricing Plans - Display all 3 tiers */}
          <div className="flex flex-col lg:flex-row justify-center items-stretch mb-24 max-w-7xl mx-auto gap-8 pt-8">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`group relative rounded-2xl overflow-visible shadow-xl border-2 ${
                    plan.highlighted
                      ? 'border-blue-300 transform lg:-translate-y-6 scale-105 bg-white mt-6'
                      : 'border-slate-200 bg-white/90 mt-6'
                  } transition-all duration-500 backdrop-blur-sm hover:scale-105 w-full lg:w-1/3`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 px-8 rounded-full font-bold text-sm shadow-xl flex items-center whitespace-nowrap">
                        <Star className="w-4 h-4 mr-2" />
                        Best Value for Schools
                      </div>
                    </div>
                  )}
                  <div className="p-8 relative">
                    {/* Icon and Name */}
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${plan.gradient}`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h2>
                      <p className="text-slate-600 text-sm">{plan.subtitle}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-end justify-center mb-2">
                        <span className={`text-4xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        <span className="text-slate-500 ml-2 text-lg">{plan.period}</span>
                      </div>
                      <p className="text-slate-600 text-center leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mr-3 flex-shrink-0 mt-0.5`}>
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Limitations for Basic Plan */}
                    {plan.limitations && (
                      <ul className="mb-8 space-y-3">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">×</span>
                            </div>
                            <span className="text-slate-500 text-sm leading-relaxed">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Button */}
                    <Link
                      href={plan.buttonLink}
                      className={`block text-center py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${plan.gradient} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full`}
                      aria-label={`Select ${plan.name}`}
                    >
                      {plan.buttonText}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VAT Information */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-blue-200/50 mb-12 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Important VAT Information</h3>
            <p className="text-slate-600 leading-relaxed max-w-4xl mx-auto">
              Our prices are quoted <strong className="text-blue-600">exclusive of VAT</strong>. Value Added Tax (VAT) at the standard UK rate of 20% will be added to your invoice where applicable. Schools that are VAT registered can typically reclaim this VAT.
            </p>
          </section>

          {/* MAT Section - Now positioned right after pricing */}
          <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 text-center border border-slate-200 mb-24 max-w-4xl mx-auto shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
              Need a Custom Solution for Your Multi-Academy Trust?
            </h2>
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${matPlan.gradient}`}>
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-4">{matPlan.name} - {matPlan.price}</h3>
            <p className="text-lg mb-8 text-slate-600 leading-relaxed max-w-3xl mx-auto">
                {matPlan.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto text-left">
                <div className="space-y-3">
                    {matPlan.features.slice(0, Math.ceil(matPlan.features.length / 2)).map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${matPlan.gradient} flex items-center justify-center mr-3 flex-shrink-0 mt-0.5`}>
                                <Check className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                        </div>
                    ))}
                </div>
                <div className="space-y-3">
                    {matPlan.features.slice(Math.ceil(matPlan.features.length / 2)).map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${matPlan.gradient} flex items-center justify-center mr-3 flex-shrink-0 mt-0.5`}>
                                <Check className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Link
                href={matPlan.buttonLink}
                className={`bg-gradient-to-r ${matPlan.gradient} text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105`}
                aria-label={`Contact for ${matPlan.name} quote`}
            >
                {matPlan.buttonText}
            </Link>
          </section>

          {/* Comprehensive Features Section */}
          <section className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-800">
              Complete LanguageGems Feature Showcase
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800 text-center">AQA & Edexcel GCSE Alignment</h3>
                <p className="text-slate-600 leading-relaxed text-center">All core vocabulary meticulously aligned with the latest AQA and Edexcel specifications for GCSE, providing direct support for exam preparation and curriculum delivery.</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800 text-center">15+ Engaging Games</h3>
                <p className="text-slate-600 leading-relaxed text-center">VocabMaster, Memory Match, Hangman, Noughts & Crosses, Word Scramble, Vocab Blast, Detective Listening, Conjugation Duel, Sentence Towers, Word Guesser, and more!</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:scale-110 transition-transform duration-300">
                    <Gem className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800 text-center">Intelligent Spaced Repetition</h3>
                <p className="text-slate-600 leading-relaxed text-center">Advanced vocabulary retention system with progressive mastery levels using proven spaced repetition algorithms.</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-cyan-300 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800 text-center">Comprehensive Analytics</h3>
                <p className="text-slate-600 leading-relaxed text-center">Real-time insights into student progress, performance trends, learning gaps, class analytics, and curriculum coverage tracking with actionable data for teachers.</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-amber-300 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800 text-center">Multi-Game Assignments</h3>
                <p className="text-slate-600 leading-relaxed text-center">Create comprehensive homework assignments combining multiple games with automated marking, instant feedback, and detailed progress tracking to reduce teacher workload.</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-green-300 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 text-center">3 Languages (More Coming Soon!)</h3>
                <p className="text-slate-600 leading-relaxed text-center">Currently supporting French, Spanish, and German. Italian and Mandarin Chinese are in active development. </p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-red-300 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 text-center">Full Accessibility Support</h3>
                <p className="text-slate-600 leading-relaxed text-center">WCAG 2.1 AA compliant with comprehensive screen reader support, keyboard navigation, high contrast modes, and responsive design for all devices.</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-orange-300 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 text-center">Professional Audio Integration</h3>
                <p className="text-slate-600 leading-relaxed text-center">High-quality text-to-speech with native pronunciation for all vocabulary items, supporting listening comprehension and pronunciation practice.</p>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-teal-300 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800 text-center">Custom Vocabulary Lists</h3>
                <p className="text-slate-600 leading-relaxed text-center">Upload and integrate your own vocabulary sets seamlessly into all games, allowing teachers to customize content for specific lessons or exam preparation.</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-800">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                  <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center">
                    <div className="mr-3 p-1 rounded-full bg-blue-100">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed pl-10" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                </div>
              ))}
            </div>
          </section>

          {/* Ready to Transform Section */}
          <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 text-center border border-slate-200 mb-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
              Ready to Transform Language Learning at Your School?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-600 font-bold">
              Get the LanguageGems Standard Plan today for £799 / year
            </p>
            <p className="text-lg mb-10 text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Give your students the competitive edge they deserve with unlimited access to all languages, games, and features.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/schools/contact?plan=standard"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center"
                aria-label="Get Started Today with Standard Plan"
              >
                <Gem className="mr-2 w-5 h-5" />
                Get Started Today
              </Link>
              <Link
                href="/schools/demo"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center"
                aria-label="Request a Demo"
              >
                <Clock className="mr-2 w-5 h-5" />
                Request a Demo
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      </div>
    </SEOWrapper>
  );
}