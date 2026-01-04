import { Metadata } from 'next';
import Footer from '../../components/layout/Footer';
import SEOWrapper from '../../components/seo/SEOWrapper';
import PricingPageClient from '../../components/pricing/PricingPageClient';

export const metadata: Metadata = {
  title: 'Pricing - LanguageGems | Affordable Language Learning for Everyone',
  description: 'Choose the perfect LanguageGems plan for you. Free for individuals, affordable plans for families, and comprehensive solutions for schools.',
  openGraph: {
    title: 'Pricing - LanguageGems | Affordable Language Learning for Everyone',
    description: 'Choose the perfect LanguageGems plan for you. Free for individuals, affordable plans for families, and comprehensive solutions for schools.',
    url: 'https://languagegems.com/pricing',
    type: 'website',
  },
};

export default function PricingPage() {

  const learnerPlans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Try before you commit',
      features: [
        '3 song lessons per day',
        '5 vocabulary games per day',
        'Basic progress tracking',
        'All 3 languages (Spanish, French, German)',
        'Community support'
      ],
      limitations: [
        'Limited daily usage',
        'No karaoke mode',
        'No offline access',
        'Basic analytics only'
      ],
      cta: 'Start Free',
      ctaLink: '/auth/signup-learner'
    },
    learner: {
      name: 'Learner',
      price: { monthly: 4.99, yearly: 49.99 },
      description: 'Perfect for casual learners & TikTok fans',
      features: [
        'Unlimited song lessons',
        '🎤 Karaoke mode with lyrics sync',
        'Unlimited vocabulary games',
        'All 3 languages (Spanish, French, German)',
        'Song-based learning with quizzes',
        'Vocabulary flashcard export',
        'Basic progress tracking',
        'Email support'
      ],
      limitations: [
        'No offline mode',
        'No worksheets',
        'Basic analytics'
      ],
      cta: 'Start Learning',
      ctaLink: '/auth/signup-learner?plan=learner'
    },
    student: {
      name: 'Student',
      price: { monthly: 7.99, yearly: 79.99 },
      description: 'Ideal for GCSE/KS3 exam prep',
      features: [
        'Everything in Learner, plus:',
        '🎯 AQA & Edexcel exam alignment',
        '📝 AI-generated worksheets',
        '🎧 Listening comprehension tests',
        '📖 Reading comprehension exercises',
        'Dictation practice with audio',
        'Grammar & conjugation practice',
        'Spaced repetition optimization',
        'Detailed progress analytics',
        'Export progress reports',
        'Priority email support'
      ],
      popular: true,
      cta: 'Start Student Plan',
      ctaLink: '/auth/signup-learner?plan=student'
    },
    pro: {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Ultimate learning for serious polyglots',
      features: [
        'Everything in Student, plus:',
        '🏆 Sing-Along Challenge mode',
        '📱 Offline mode for all content',
        '🎨 Custom vocabulary lists',
        '🏅 Achievement & badge system',
        '⚡ Daily learning challenges',
        '🎯 Personalized learning paths',
        '📊 Advanced analytics dashboard',
        '🎤 Pronunciation scoring (Coming Soon)',
        '👥 Priority 1-on-1 support',
        '✨ Early access to new features'
      ],
      cta: 'Go Pro',
      ctaLink: '/auth/signup-learner?plan=pro'
    }
  };

  const schoolPlans = {
    basic: {
      name: 'Basic Plan',
      price: { monthly: 'N/A', yearly: 0 },
      description: 'Perfect to get started. Give your entire school access to our core language games today. No approval needed.',
      features: [
        'Access for all MFL teachers for classroom-wide, shared use',
        'Access for all students for whole-class game play',
        'Full Access to ALL Available Languages: French, Spanish, German',
        '15+ Engaging Gamified Learning Activities',
        'Professional Audio Integration: High-quality text-to-speech',
        'Built for Modern Classrooms: Responsive design, WCAG 2.1 AA accessibility'
      ],
      limitations: [
        'Individual Student Logins & Progress Tracking: Not included',
        'Custom Vocabulary Lists: Not included',
        'Homework Setting Capability: Not included',
        'Assessments & Dictation: Not included',
        'Reading & Listening Comprehension: Not included',
        'Advanced Analytics Dashboard: Not included',
        'Assignment Creation: Not included'
      ],
      studentLimit: 'Whole-class access',
      cta: 'Get Started for Free',
      ctaLink: '/auth/signup?plan=basic'
    },
    standard: {
      name: 'Standard Plan',
      price: { monthly: 'N/A', yearly: 799 },
      description: 'The ultimate value for most secondary schools with up to 750 students',
      features: [
        'All Basic Plan Features (with individual logins enabled)',
        'Unlimited Teacher Accounts: Full access for all MFL teachers',
        'Individual Student Logins for up to 750 Students',
        'Comprehensive Data Analysis Platform: Instant insights into student strengths & weaknesses',
        'Full Homework Setting Capability: Automated marking and instant feedback',
        'Fully Aligned Vocabulary: AQA/Edexcel GCSE specifications alignment',
        'Real-time Analytics & Insights: Actionable data on student progress',
        'Multi-Game Assignment System: Combine multiple games for assignments',
        'Custom Vocabulary Lists: Upload and integrate your own vocabulary',
        'Spaced Repetition & Gem Collection: Advanced vocabulary retention',
        'Competition Features: School-wide leaderboards & achievement systems'
      ],
      popular: true,
      studentLimit: 'Up to 750 students',
      cta: 'Get Standard Plan',
      ctaLink: '/auth/signup?plan=standard'
    },
    large: {
      name: 'Large School Plan',
      price: { monthly: 'N/A', yearly: 1199 },
      description: 'Designed for larger secondary schools (over 750 students)',
      features: [
        'All Standard Plan Features',
        'Individual Student Logins for Unlimited Students',
        'Priority Email and Chat Support',
        'Advanced Analytics & Custom Reports: Deeper data insights',
        'Dedicated Onboarding Support',
        'Strategic Partnership for feature requests and feedback'
      ],
      studentLimit: 'Unlimited students',
      cta: 'Get Large School Plan',
      ctaLink: '/auth/signup?plan=large-school'
    },
    mat: {
      name: 'MAT Plan',
      price: { monthly: 'Custom', yearly: 'Custom' },
      description: 'Multi-Academy Trusts with multiple schools seeking centralized solution',
      features: [
        'Tailored pricing based on number and size of schools',
        'Consolidated billing and reporting across all schools',
        'Centralized account management for the MAT',
        'Strategic partnership for long-term integration',
        'All features of the Standard Plan extended across the trust',
        'Dedicated account manager and priority support',
        'Custom training and implementation support',
        'Trust-wide analytics and reporting dashboard'
      ],
      studentLimit: 'Multiple schools',
      cta: 'Contact for Quote',
      ctaLink: '/contact?plan=mat'
    }
  };

  return (
    <SEOWrapper>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
            <div className="container mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Choose the perfect plan for your language learning journey.
                Start free, upgrade anytime.
              </p>

              <PricingPageClient
                learnerPlans={learnerPlans}
                schoolPlans={schoolPlans}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SEOWrapper>
  );
}