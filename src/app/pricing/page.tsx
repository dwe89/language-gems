'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  X,
  Users,
  User,
  School,
  GraduationCap,
  Star,
  ArrowRight,
  CreditCard,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import Footer from '../../components/layout/Footer';
import SEOWrapper from '../../components/seo/SEOWrapper';

export default function PricingPage() {
  const [audience, setAudience] = useState<'learners' | 'schools'>('learners');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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

  const currentPlans = audience === 'learners' ? learnerPlans : schoolPlans;

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

              {/* Audience Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-white rounded-xl p-1 shadow-lg">
                  <button
                    onClick={() => setAudience('learners')}
                    className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                      audience === 'learners'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-5 h-5 mr-2" />
                    For Learners
                  </button>
                  <button
                    onClick={() => setAudience('schools')}
                    className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                      audience === 'schools'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <School className="w-5 h-5 mr-2" />
                    For Schools
                  </button>
                </div>
              </div>

              {/* Billing Toggle (only for learners) */}
              {audience === 'learners' && (
                <div className="flex justify-center">
                  <div className="bg-white rounded-xl p-1 shadow-lg">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                        billingCycle === 'monthly'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all relative ${
                        billingCycle === 'yearly'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Yearly
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Save 17%
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Schools detailed pricing link */}
              {audience === 'schools' && (
                <div className="flex justify-center mt-4">
                  <Link
                    href="/schools/pricing"
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    View detailed schools pricing & features →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className={`grid gap-8 max-w-6xl mx-auto ${
                Object.keys(currentPlans).length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 justify-center'
              }`}>
                {Object.entries(currentPlans).map(([planKey, plan]) => (
                  <motion.div
                    key={planKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: Object.keys(currentPlans).indexOf(planKey) * 0.1 }}
                    className={`bg-white rounded-2xl p-8 shadow-xl relative border-2 ${
                      plan.popular ? 'border-purple-500 scale-105' : 'border-gray-100'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        planKey.includes('free') || planKey.includes('starter') ? 'bg-gray-100' :
                        planKey.includes('pro') || planKey.includes('professional') ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                        'bg-gradient-to-r from-orange-500 to-red-600'
                      }`}>
                        {planKey.includes('free') || planKey.includes('starter') ? 
                          <GraduationCap className="w-8 h-8 text-gray-600" /> :
                          planKey.includes('enterprise') ? 
                          <Users className="w-8 h-8 text-white" /> :
                          <Crown className="w-8 h-8 text-white" />
                        }
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      
                      {audience === 'schools' && plan.studentLimit && (
                        <p className="text-sm text-blue-600 font-semibold mb-4">{plan.studentLimit}</p>
                      )}

                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {audience === 'schools' ? (
                          typeof plan.price.yearly === 'number' ? (
                            <>
                              £{plan.price.yearly}
                              <span className="text-lg text-gray-600 font-normal">/year</span>
                            </>
                          ) : (
                            plan.price.yearly
                          )
                        ) : (
                          typeof plan.price[billingCycle] === 'number' ? (
                            <>
                              £{plan.price[billingCycle]}
                              <span className="text-lg text-gray-600 font-normal">
                                /{billingCycle === 'monthly' ? 'month' : 'year'}
                              </span>
                            </>
                          ) : (
                            plan.price[billingCycle]
                          )
                        )}
                      </div>

                      {audience === 'learners' && typeof plan.price[billingCycle] === 'number' && plan.price[billingCycle] > 0 && billingCycle === 'yearly' && (
                        <p className="text-sm text-green-600">
                          Save £{(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)} per year
                        </p>
                      )}

                      {audience === 'schools' && (
                        <p className="text-sm text-blue-600 font-semibold">
                          {plan.studentLimit} • Annual billing • +VAT
                        </p>
                      )}
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations && plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start">
                          <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={plan.ctaLink}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all text-center block ${
                        planKey.includes('free') || planKey.includes('starter')
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : planKey.includes('enterprise')
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg transform hover:scale-105'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {planKey.includes('enterprise') ? (
                        <>
                          <Phone className="w-5 h-5 inline mr-2" />
                          {plan.cta}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 inline mr-2" />
                          {plan.cta}
                        </>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* VAT Information for Schools */}
          {audience === 'schools' && (
            <div className="py-8 bg-blue-50">
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Important VAT Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our prices are quoted <strong className="text-blue-600">exclusive of VAT</strong>.
                    Value Added Tax (VAT) at the standard UK rate of 20% will be added to your invoice where applicable.
                    Schools that are VAT registered can typically reclaim this VAT.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Frequently Asked Questions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {audience === 'learners' ? (
                    <>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
                        <p className="text-gray-600">Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
                        <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for yearly subscriptions.</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Is there a free trial?</h3>
                        <p className="text-gray-600">Yes! All paid plans come with a 7-day free trial. No credit card required to start.</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Can I switch between plans?</h3>
                        <p className="text-gray-600">Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Why is LanguageGems so competitively priced?</h3>
                        <p className="text-gray-600">Unlike competitors who charge per language (£500-600+ each) or per student (£2-7 each), LanguageGems offers transparent pricing for your entire school.</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-2">What's the difference between the plans?</h3>
                        <p className="text-gray-600">Basic Plan provides core game access for class-wide use. Standard Plan unlocks individual student logins and comprehensive tracking. Large School Plan is optimized for 750+ students.</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-2">How does it align with GCSE requirements?</h3>
                        <p className="text-gray-600">Our vocabulary is meticulously aligned with AQA and Edexcel GCSE specifications, supporting both Foundation and Higher tier requirements.</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-2">Is there a minimum contract length?</h3>
                        <p className="text-gray-600">All school plans are billed annually to provide the best value and predictable pricing for effective school budgeting.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                We'd love to help you find the perfect plan for your needs. 
                Get in touch with our team for personalized recommendations.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-blue-600 font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Our Team
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SEOWrapper>
  );
}