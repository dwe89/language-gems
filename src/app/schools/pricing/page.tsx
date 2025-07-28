import Link from 'next/link';
import { Metadata } from 'next';
import Footer from '../../../components/layout/Footer'; // Assuming Footer path is correct
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { getPricingSchema, getFAQSchema } from '../../../lib/seo/structuredData';

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
      '✅ Access for all MFL teachers for classroom-wide, shared use.',
      '✅ Access for all students for whole-class game play.',
      '✅ Full Access to ALL Available Languages: French, Spanish, German (more coming soon!).',
      '✅ 15+ Engaging Gamified Learning Activities (read-only mode): VocabMaster, Memory Match, Hangman, Word Scramble, and more!',
      '✅ Professional Audio Integration: High-quality text-to-speech for all vocabulary items.',
      '✅ Built for Modern Classrooms: Responsive design, WCAG 2.1 AA accessibility.',
      '❌ <strong>Individual Student Logins & Progress Tracking</strong>: Not included in this tier.',
      '❌ <strong>Custom Vocabulary Lists</strong>: Not included in this tier.',
      '❌ <strong>Homework Setting Capability</strong>: Not included in this tier.',
    ],
    buttonText: 'Get Basic Plan',
    buttonLink: '/schools/contact?plan=basic',
    highlighted: false,
    gradient: 'from-blue-500 to-cyan-500',
    borderGradient: 'from-blue-400 to-cyan-400',
    icon: '📚',
  },
  {
    name: 'Standard Plan',
    price: '£799',
    period: '/year',
    description: 'The ultimate value for most secondary schools with up to 750 students. Unlocks full features and powerful teacher tools.',
    subtitle: 'Comprehensive solution including individual student logins, data tracking, analytics, and all advanced features for a single school.',
    features: [
      '✅ <strong>All Basic Plan Features</strong> (with individual logins enabled)',
      '✅ Unlimited Teacher Accounts: Full access for all MFL teachers.',
      '✅ Individual Student Logins for up to 750 Students: Empower every student to learn and track their progress.',
      '✅ <strong>Comprehensive Data Analysis Platform</strong>: Instant, in-depth insights into student strengths & weaknesses, identifying specific learning gaps.', // ENHANCED
      '✅ <strong>Full Homework Setting Capability</strong>: Create, assign, track homework with automated marking and instant feedback.',
      '✅ <strong>Fully Aligned Vocabulary</strong>: AQA/Edexcel GCSE specifications alignment for exam support.',
      '✅ <strong>Real-time Analytics & Insights</strong>: Actionable data on student progress, performance, and engagement.',
      '✅ <strong>Multi-Game Assignment System</strong>: Combine multiple games for diverse assignments.',
      '✅ <strong>Custom Vocabulary Lists</strong>: Upload and integrate your own vocabulary sets.',
      '✅ <strong>Spaced Repetition & Gem Collection</strong>: Advanced vocabulary retention with mastery levels.',
      '✅ Competition Features: School-wide leaderboards & achievement systems.',
    ],
    buttonText: 'Get Standard Plan',
    buttonLink: '/schools/contact?plan=standard',
    highlighted: true,
    gradient: 'from-emerald-500 to-teal-500',
    borderGradient: 'from-emerald-400 to-teal-400',
    icon: '💎',
  },
  {
    name: 'Large School Plan',
    price: '£1,199',
    period: '/year',
    description: 'Designed for larger secondary schools (over 750 students) needing robust support and deeper insights.',
    subtitle: 'All Standard Plan features, optimized for larger student bodies with priority support and advanced reporting.',
    features: [
      '✅ <strong>All Standard Plan Features</strong>',
      '✅ Individual Student Logins for Unlimited Students: Optimized for larger student bodies (>750 students).',
      '✅ Priority Email and Chat Support.',
      '✅ <strong>Advanced Analytics & Custom Reports</strong>: Deeper data insights and tailored reporting options, including cross-class comparative analysis.', // ENHANCED
      '✅ Dedicated Onboarding Support.',
      '✅ Strategic Partnership for feature requests and feedback.',
    ],
    buttonText: 'Get Large School Plan',
    buttonLink: '/schools/contact?plan=large-school',
    highlighted: false,
    gradient: 'from-purple-500 to-pink-500',
    borderGradient: 'from-purple-400 to-pink-400',
    icon: '🚀',
  },
];

const matPlan = {
  name: 'MAT Plan',
  price: 'Custom Pricing',
  period: '- Contact Us for a Quote',
  description: 'Multi-Academy Trusts (MATs) with multiple schools seeking a centralized solution with trust-level oversight and consolidated billing.',
  subtitle: 'Tailored pricing based on the number and size of schools within the MAT with strategic partnership benefits.',
  features: [
    '🏢 Tailored pricing based on the number and size of schools within the MAT',
    '🏢 Consolidated billing and reporting across all schools',
    '🏢 Centralized account management for the MAT',
    '🏢 Strategic partnership for long-term integration and development',
    '🏢 All features of the Whole School Plan extended across the trust',
    '🏢 Dedicated account manager and priority support',
    '🏢 Custom training and implementation support',
    '🏢 Trust-wide analytics and reporting dashboard'
  ],
  buttonText: 'Contact for Quote',
  buttonLink: '/schools/contact?plan=mat',
  highlighted: false, // MAT plan is not highlighted in the main pricing section
  gradient: 'from-slate-600 to-slate-800',
  borderGradient: 'from-slate-500 to-slate-700',
  icon: '🏢',
};


const testimonials = [
  {
    quote: "LanguageGems has transformed our MFL department. Students are more engaged than ever, and our GCSE results have improved significantly.",
    author: "Sarah Thompson",
    title: "Head of Modern Foreign Languages",
    school: "Westfield Academy",
    avatar: "👩‍🏫",
  },
  {
    quote: "The administrative tools and analytics have made tracking student progress so much easier. Perfect for our Key Stage 3 assessments.",
    author: "James Wilson",
    title: "Deputy Head Teacher",
    school: "Oakwood Secondary School",
    avatar: "👨‍💼",
  },
  {
    quote: "Our whole school implementation has been seamless. The platform works brilliantly for both our Year 7s and our A-Level students.",
    author: "Dr. Emma Clarke",
    title: "Principal",
    school: "Riverside Grammar School",
    avatar: "👩‍🎓",
  },
];

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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                LanguageGems: Pricing Plans
              </span>
              <br />
              <span className="text-white">for UK Schools</span>
            </h1>
            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border border-red-400/30 mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stop paying more for less.
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                LanguageGems offers <strong className="text-emerald-400">transparent annual pricing tiers</strong> for your <strong className="text-emerald-400">ENTIRE school</strong>.
              </p>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
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
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-400/30">
                <h3 className="text-2xl font-bold text-red-300 mb-4">💸 Tired of Paying Per Language?</h3>
                <p className="text-gray-200 text-lg mb-4">
                  Some platforms charge <strong className="text-red-400">£500-£600+ *per language*</strong>. If you teach French, Spanish, and German, you could pay over <strong className="text-red-400">£1700 annually!</strong>
                </p>
                <p className="text-emerald-300 text-xl font-semibold">
                  ✅ LanguageGems gives you <strong>ALL your languages for one transparent tier price</strong>. That's a massive saving for multi-language departments, year after year.
                </p>
              </div>

              {/* Sick of Per-Student Charges */}
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
                <h3 className="text-2xl font-bold text-purple-300 mb-4">😤 Sick of Per-Student Charges & Hidden Fees?</h3>
                <p className="text-gray-200 text-lg mb-4">
                  Certain providers lure you in with a low base price, then hit you with hidden fees of <strong className="text-purple-400">£2-£7 *per student*</strong>. A medium-sized school could easily pay an extra <strong className="text-purple-400">£1000-£2000 annually</strong> just for student logins, making budgeting a nightmare!
                </p>
                <p className="text-emerald-300 text-xl font-semibold">
                  ✅ LanguageGems offers <strong>unlimited student logins for one transparent tier price</strong>. No surprises, just predictable, all-inclusive budgeting for your whole school.
                </p>
              </div>

              {/* Beyond Basic Practice */}
              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/30">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">🎯 Beyond Basic Practice – Deep Insights & Curriculum Alignment</h3>
                <p className="text-gray-200 text-lg mb-4">
                  Many sites offer simple drills or basic activity builders, or focus on a single methodology, providing limited actionable data.
                </p>
                <p className="text-emerald-300 text-xl font-semibold">
                  ✅ LanguageGems provides a <strong>deeply gamified, adaptive, and analytical platform with direct curriculum alignment</strong>. We don't just give students exercises; we engage them with rich, diverse games, provide teachers with comprehensive data analysis on strengths/weaknesses and gaps, and ensure our vocabulary directly supports AQA and Edexcel exams.
                </p>
              </div>

              {/* True Whole-School Access */}
              <div className="bg-gradient-to-r from-green-900/20 to-teal-900/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
                <h3 className="text-2xl font-bold text-green-300 mb-4">🏫 True Whole-School Access vs. Artificial Caps</h3>
                <p className="text-gray-200 text-lg mb-4">
                  Some platforms cap teacher or student numbers, forcing awkward compromises or costly upgrades, or have complex tiered structures that become unmanageable.
                </p>
                <p className="text-emerald-300 text-xl font-semibold">
                  ✅ LanguageGems delivers <strong>true whole-school freedom based on your chosen tier: Unlimited teachers, unlimited students, all languages</strong>. Grow your MFL department without worrying about your subscription.
                </p>
              </div>

              {/* Homework Made Easy */}
              <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/30">
                <h3 className="text-2xl font-bold text-amber-300 mb-4">📝 Homework Made Easy</h3>
                <p className="text-gray-200 text-lg mb-4">
                  Many platforms offer basic assignment features that still require significant teacher time for setup and manual marking.
                </p>
                <p className="text-emerald-300 text-xl font-semibold">
                  ✅ LanguageGems provides <strong>full homework setting capabilities with automated marking and instant student feedback</strong>, significantly reducing teacher workload and centralizing your assignment management.
                </p>
              </div>
            </div>
          </section>

          {/* --- */}

          {/* Pricing Plans - Display all 3 tiers */}
          <div className="flex flex-col md:flex-row justify-center items-stretch mb-24 max-w-6xl mx-auto gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`group relative rounded-2xl overflow-hidden shadow-2xl border-2 ${plan.highlighted ? 'border-pink-400/50 transform md:-translate-y-6 scale-105' : 'border-gray-700/50'} transition-all duration-500 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm hover:scale-105 w-full md:w-1/3`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 px-6 rounded-full font-bold text-sm shadow-lg">
                      ⭐ Best Value for Schools
                    </div>
                  </div>
                )}
                <div className="p-8 relative">
                  {/* Icon and Name */}
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4" role="img" aria-label={`${plan.icon} icon`}>
                      {plan.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
                    <p className="text-gray-400 text-sm">{plan.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-end justify-center mb-2">
                      <span className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                      <span className="text-gray-400 ml-2 text-lg">{plan.period}</span>
                    </div>
                    <p className="text-gray-300 text-center leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mr-3 flex-shrink-0 mt-1`}>
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Link
                    href={plan.buttonLink}
                    className={`block text-center py-4 px-6 rounded-full font-bold text-white bg-gradient-to-r ${plan.gradient} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full`}
                    aria-label={`Select ${plan.name}`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* VAT Information */}
          <section className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl p-8 text-center border border-blue-400/20 mb-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-blue-300">Important VAT Information</h3>
            <p className="text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Our prices are quoted <strong className="text-blue-400">exclusive of VAT</strong>. Value Added Tax (VAT) at the standard UK rate of 20% will be added to your invoice where applicable. Schools that are VAT registered can typically reclaim this VAT.
            </p>
          </section>

          {/* MAT Section - Now positioned right after pricing */}
          <section className="bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-12 text-center border border-slate-400/20 mb-24 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Need a Custom Solution for Your Multi-Academy Trust?
            </h2>
            <div className="text-6xl mb-6" role="img" aria-label="Office building icon">{matPlan.icon}</div>
            <h3 className="text-2xl font-bold text-slate-300 mb-4">{matPlan.name} - {matPlan.price}</h3>
            <p className="text-xl mb-8 text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {matPlan.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto text-left">
                <div className="space-y-3">
                    {matPlan.features.slice(0, Math.ceil(matPlan.features.length / 2)).map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-slate-400 mt-3 mr-3 flex-shrink-0"></div>
                          <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: feature.replace('🏢 ', '') }}></p>
                        </div>
                    ))}
                </div>
                <div className="space-y-3">
                    {matPlan.features.slice(Math.ceil(matPlan.features.length / 2)).map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-slate-400 mt-3 mr-3 flex-shrink-0"></div>
                          <p className="text-slate-300" dangerouslySetInnerHTML={{ __html: feature.replace('🏢 ', '') }}></p>
                        </div>
                    ))}
                </div>
            </div>
            <Link
                href={matPlan.buttonLink}
                className="bg-gradient-to-r from-slate-600 to-slate-800 text-white px-12 py-4 rounded-xl font-bold text-xl hover:shadow-xl transition-all transform hover:scale-105 hover:from-slate-500 hover:to-slate-700"
                aria-label={`Contact for ${matPlan.name} quote`}
            >
                {matPlan.buttonText}
            </Link>
          </section>

          {/* --- */}

          {/* Comprehensive Features Section */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                💎 Complete LanguageGems Feature Showcase
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group bg-gradient-to-br from-indigo-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Target icon">🎯</div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-300">AQA & Edexcel GCSE Alignment</h3>
                <p className="text-gray-300 leading-relaxed">All core vocabulary meticulously aligned with the latest AQA and Edexcel specifications for GCSE, providing direct support for exam preparation and curriculum delivery.</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Gamepad icon">🎮</div>
                <h3 className="text-2xl font-bold mb-4 text-purple-300">15+ Engaging Games</h3>
                <p className="text-gray-300 leading-relaxed">VocabMaster, Memory Match, Hangman, Noughts & Crosses, Word Scramble, Vocab Blast, Detective Listening, Conjugation Duel, Sentence Towers, Word Guesser, and more!</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Gem icon">💎</div>
                <h3 className="text-2xl font-bold mb-4 text-pink-300">Intelligent Spaced Repetition</h3>
                <p className="text-gray-300 leading-relaxed">Advanced vocabulary retention system with progressive mastery levels using proven spaced repetition algorithms.</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Bar chart icon">📊</div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-300">Comprehensive Analytics</h3>
                <p className="text-gray-300 leading-relaxed">Real-time insights into student progress, performance trends, learning gaps, class analytics, and curriculum coverage tracking with actionable data for teachers.</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-900/30 to-amber-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-amber-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Clipboard with checkmark icon">📝</div>
                <h3 className="text-2xl font-bold mb-4 text-amber-300">Multi-Game Assignments</h3>
                <p className="text-gray-300 leading-relaxed">Create comprehensive homework assignments combining multiple games with automated marking, instant feedback, and detailed progress tracking to reduce teacher workload.</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-900/30 to-green-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-green-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Globe icon">🌍</div>
                <h3 className="text-2xl font-bold mb-4 text-green-300">3 Languages (More Coming Soon!)</h3>
                <p className="text-gray-300 leading-relaxed">  Currently supporting French, Spanish, and German. Italian and Mandarin Chinese are in active development. </p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-900/30 to-red-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-red-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Accessibility symbol">♿</div>
                <h3 className="text-2xl font-bold mb-4 text-red-300">Full Accessibility Support</h3>
                <p className="text-gray-300 leading-relaxed">WCAG 2.1 AA compliant with comprehensive screen reader support, keyboard navigation, high contrast modes, and responsive design for all devices.</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-900/30 to-orange-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Speaker icon">🔊</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-300">Professional Audio Integration</h3>
                <p className="text-gray-300 leading-relaxed">High-quality text-to-speech with native pronunciation for all vocabulary items, supporting listening comprehension and pronunciation practice.</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-900/30 to-teal-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-teal-400/40 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Books icon">📚</div>
                <h3 className="text-2xl font-bold mb-4 text-teal-300">Custom Vocabulary Lists</h3>
                <p className="text-gray-300 leading-relaxed">Upload and integrate your own vocabulary sets seamlessly into all games, allowing teachers to customize content for specific lessons or exam preparation.</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="group bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-[1.02]">
                  <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center">
                    <span className="mr-3 text-2xl" role="img" aria-label="Question mark">❓</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-300 leading-relaxed pl-10" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                </div>
              ))}
            </div>
          </section>

          {/* Ready to Transform Section */}
          <section className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 backdrop-blur-sm rounded-3xl p-12 text-center border border-emerald-400/20 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Language Learning at Your School?
            </h2>
            <p className="text-2xl md:text-3xl mb-8 text-emerald-300 font-bold">
              Get the LanguageGems Whole School Plan today for £699 / year
            </p>
            <p className="text-xl mb-10 text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Give your students the competitive edge they deserve with unlimited access to all languages, games, and features.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/schools/contact?plan=whole-school"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-4 rounded-xl font-bold text-xl hover:shadow-xl transition-all transform hover:scale-105"
                aria-label="Get Started Today with Whole School Plan"
              >
                💎 Get Started Today
              </Link>
              <Link
                href="/schools/demo"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-xl font-bold text-xl hover:shadow-xl transition-all transform hover:scale-105"
                aria-label="Request a Demo"
              >
                🚀 Request a Demo
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