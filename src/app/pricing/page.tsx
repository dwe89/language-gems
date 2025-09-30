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
      description: 'Perfect for getting started',
      features: [
        '5 games per day',
        'Basic vocabulary lists',
        'Progress tracking',
        'All 3 languages (Spanish, French, German)',
        'Community support'
      ],
      limitations: [
        'Limited daily usage',
        'No offline access'
      ],
      cta: 'Start Free',
      ctaLink: '/auth/signup-learner'
    },
    pro: {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Unlimited learning for serious students',
      features: [
        'Unlimited games & practice',
        'All 3 languages (Spanish, French, German)',
        'Advanced analytics & insights',
        'Offline mode',
        'Priority support',
        'Custom vocabulary lists',
        'Achievement system',
        'Daily challenges',
        'Spaced repetition optimization',
        'Export progress reports',
        'AI-generated worksheets',
        'Reading comprehension exercises',
        'Dictation practice with audio',
        'Interactive song-based learning',
        'AQA & Edexcel assessment prep',
        'Professional text-to-speech audio',
        'Listening comprehension tests',
        'Grammar & conjugation practice',
        'Vocabulary mastery tracking',
        'Personalized learning paths'
      ],
      popular: true,
      cta: 'Start Free Trial',
      ctaLink: '/auth/signup-learner?plan=pro'
    }
  };

  const schoolPlans = {
    basic: {
      name: 'Basic Plan',
      price: { monthly: 'N/A', yearly: 399 },
      description: 'Perfect for smaller schools or departments focusing on core vocabulary acquisition. Students use shared classroom access - no individual accounts.',
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
      cta: 'Get Basic Plan',
      ctaLink: '/schools/contact?plan=basic'
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
      ctaLink: '/schools/contact?plan=standard'
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
      ctaLink: '/schools/contact?plan=large-school'
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
      ctaLink: '/schools/contact?plan=mat'
    }
  };

  return (
    <SEOWrapper
      title="Pricing - LanguageGems | Affordable Language Learning for Everyone"
      description="Choose the perfect LanguageGems plan for you. Free for individuals, affordable plans for families, and comprehensive solutions for schools."
    >
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