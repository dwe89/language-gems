'use client';

import { useState } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  X,
  Zap,
  Star,
  Trophy,
  BookOpen,
  Gamepad2,
  BarChart3,
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function UpgradePage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'family'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        '5 games per day',
        'Basic vocabulary lists',
        'Progress tracking',
        'Spanish only'
      ],
      limitations: [
        'Limited daily usage',
        'No offline access',
        'Basic support only',
        'Single language'
      ]
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
        'Export progress reports'
      ],
      popular: true
    },
    family: {
      name: 'Family',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'Perfect for families with multiple learners',
      features: [
        'Everything in Pro',
        'Up to 6 family members',
        'Family progress dashboard',
        'Parental controls',
        'Shared vocabulary lists',
        'Family challenges',
        'Bulk progress reports'
      ]
    }
  };

  const handleUpgrade = async (plan: 'pro' | 'family') => {
    // This would integrate with Stripe or another payment processor
    console.log(`Upgrading to ${plan} plan (${billingCycle})`);
    
    // For now, just show an alert
    alert(`Upgrade to ${plan} plan coming soon! This would redirect to payment processing.`);
  };

  const currentPlan = user?.user_metadata?.plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/learner-dashboard"
            className="p-2 hover:bg-white/50 rounded-lg transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Learning</h1>
            <p className="text-gray-600">Unlock unlimited access to all LanguageGems features</p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(plans).map(([planKey, plan]) => (
            <motion.div
              key={planKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: Object.keys(plans).indexOf(planKey) * 0.1 }}
              className={`bg-white rounded-2xl p-8 shadow-xl relative ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              } ${currentPlan === planKey ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              {currentPlan === planKey && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Current Plan
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  planKey === 'free' ? 'bg-gray-100' :
                  planKey === 'pro' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                  'bg-gradient-to-r from-orange-500 to-red-600'
                }`}>
                  {planKey === 'free' ? <BookOpen className="w-8 h-8 text-gray-600" /> :
                   planKey === 'pro' ? <Crown className="w-8 h-8 text-white" /> :
                   <Trophy className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  £{plan.price[billingCycle]}
                  {planKey !== 'free' && (
                    <span className="text-lg text-gray-600 font-normal">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                {planKey !== 'free' && billingCycle === 'yearly' && (
                  <p className="text-sm text-green-600">
                    Save £{(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)} per year
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations && plan.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-center">
                    <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => planKey !== 'free' && handleUpgrade(planKey as 'pro' | 'family')}
                disabled={currentPlan === planKey}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                  currentPlan === planKey
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : planKey === 'free'
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : planKey === 'pro'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {currentPlan === planKey ? (
                  'Current Plan'
                ) : planKey === 'free' ? (
                  'Free Forever'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 inline mr-2" />
                    Upgrade to {plan.name}
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">30-Day Money Back Guarantee</h3>
            <p className="text-gray-600">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
