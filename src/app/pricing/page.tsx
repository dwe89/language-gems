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

    learner: {
      name: 'Independent Learner',
      price: { monthly: 7.99, yearly: 69 },
      description: 'Everything you need for success in German, Spanish OR French',
      features: [
        '🤖 AI-marked Writing tasks (instant feedback)',
        '🤖 AI-marked Reading & Listening comprehension',
        '📝 AI-generated practice worksheets',
        '🎮 UNLIMITED access to 15+ interactive games',
        '🔄 Spaced repetition (optimizes retention)',
        '📊 Personal dashboard & detailed analytics',
        '🏆 Achievement system & daily challenges',
        '🎯 AQA & Edexcel exam alignment'
      ],
      popular: true,
      cta: 'Start 7-Day Free Trial',
      ctaLink: '/auth/signup-learner?plan=learner'
    },
    teacher: {
      name: 'Individual Teacher',
      price: { monthly: 11.99, yearly: 119 },
      description: 'Perfect for private tutors & independent MFL teachers',
      features: [
        'Up to 150 students',
        'UNLIMITED access to ALL 15+ games',
        'Set & track homework assignments',
        'Student progress analytics',
        'Custom vocabulary lists',
        'AQA & Edexcel GCSE alignment',
        'Professional teacher dashboard',
        'Automated marking & feedback'
      ],
      highlight: true,
      cta: 'Start Teacher Plan',
      ctaLink: '/auth/signup?plan=teacher'
    }
  };

  const schoolPlans = {
    standard: {
      name: 'Standard Plan',
      price: { monthly: 'N/A', yearly: 799 },
      promoPrice: 599,
      promoLabel: '🔥 First 100 Schools',
      description: 'The ULTIMATE school solution with UNLIMITED students & teachers.',
      features: [
        '🎓 UNLIMITED Students',
        '👩‍🏫 UNLIMITED Teacher Accounts',
        '🔐 Individual Student Logins',
        '📊 Comprehensive Analytics Dashboard',
        '📝 Full Homework Setting & Auto-Marking',
        '🎯 AQA & Edexcel GCSE Alignment',
        '🎮 15+ Engaging Vocabulary Games',
        '🔄 Spaced Repetition System',
        '📚 Custom Vocabulary Lists',
        '🏆 School-wide Leaderboards',
        '⭐ Priority Support'
      ],
      popular: true,
      studentLimit: 'UNLIMITED students',
      cta: 'Get Standard Plan',
      ctaLink: '/auth/signup?plan=standard'
    },
    mat: {
      name: 'MAT Plan',
      price: { monthly: 'Custom', yearly: 'Custom' },
      description: 'Multi-Academy Trusts centralized solution',
      features: [
        'Tailored pricing for multiple schools',
        'Consolidated billing and reporting',
        'Centralized account management',
        'Trust-wide analytics dashboard',
        'Strategic partnership integration',
        'Custom training & implementation',
        'Priority support channel'
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
              <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
                Choose the perfect plan for your language learning journey.
                Start free, upgrade anytime.
              </p>
              <p className="text-lg text-gray-500 mb-8">
                <a href="/features" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4">
                  ✨ See all 15+ games and features →
                </a>
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