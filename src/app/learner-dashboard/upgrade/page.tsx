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
  ArrowRight,
  Target,
  CreditCard,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function UpgradePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    student: {
      name: 'STUDENT SUBSCRIPTION',
      price: { monthly: 7.99, yearly: 69 },
      description: 'Everything you need for success',
      sections: [
        {
          title: '🤖 AI-POWERED FEATURES',
          features: [
            'AI-marked Writing tasks (instant feedback)',
            'AI-marked Reading comprehension',
            'AI-marked Listening comprehension',
            'AI-generated practice worksheets'
          ]
        },
        {
          title: '🎮 ENGAGING LEARNING',
          features: [
            '15+ interactive games',
            'Spaced repetition (optimizes retention)',
            'Gem collection & achievement system',
            'Daily challenges & streaks'
          ]
        },
        {
          title: '📚 EXAM-ALIGNED CONTENT',
          features: [
            'AQA & Edexcel specifications',
            'Foundation & Higher tier support',
            'Reading, Writing, Listening practice',
            'Grammar & conjugation exercises'
          ]
        },
        {
          title: '📊 TRACK YOUR PROGRESS',
          features: [
            'Personal dashboard',
            'Detailed analytics',
            'Progress reports you can share',
            'Identify weak areas automatically'
          ]
        }
      ],
      monthlyProductId: '6dc6f925-8ebe-45ec-858d-6d0c6279903a',
      yearlyProductId: '0e6c444a-b3d0-4cf2-8d19-d545976f0d40'
    }
  };

  const handleUpgrade = async (productId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            product_id: productId,
            quantity: 1
          }],
          customer_email: user?.email
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session');
        alert('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error upgrading:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const currentPlan = user?.user_metadata?.plan || 'free';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <Link
            href="/learner-dashboard"
            className="mb-6 flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Level Up Your Learning
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Join thousands of students mastering German, Spanish, and French with our AI-powered platform.
          </p>
        </div>

        {/* Pricing Card Section */}
        <div className="max-w-4xl mx-auto">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex items-center">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center ${billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Yearly
                <span className="ml-2 bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full">
                  Save 28%
                </span>
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
              {/* Left Side: Features */}
              <div className="md:col-span-3 p-8 lg:p-12 border-b md:border-b-0 md:border-r border-slate-100">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Crown className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Everything in One Simple Plan</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {plans.student.sections.map((section, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start text-sm">
                            <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-bold text-slate-800">Choose your language:</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Your subscription grants full access to French, Spanish, OR German.
                  </p>
                </div>
              </div>

              {/* Right Side: CTA */}
              <div className="md:col-span-2 bg-slate-50 p-8 lg:p-12 flex flex-col justify-center items-center">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Student Subscription
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-black text-slate-900">
                      £{billingCycle === 'monthly' ? plans.student.price.monthly : plans.student.price.yearly}
                    </span>
                    <span className="text-slate-400 ml-2 font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-emerald-600 font-bold text-sm mt-2">
                      Equivalent to just £5.75/month
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleUpgrade(billingCycle === 'monthly' ? plans.student.monthlyProductId : plans.student.yearlyProductId)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center text-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {billingCycle === 'monthly' ? 'Start 7-Day Free Trial' : 'Get Yearly Access'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 mt-6 text-center leading-relaxed">
                  {billingCycle === 'monthly'
                    ? '£7.99/month after 7 days. Cancel anytime.'
                    : 'Billed annually. No commitment, cancel anytime.'
                  }
                </p>

                <div className="mt-8 flex items-center justify-center grayscale opacity-50">
                  <CreditCard className="w-5 h-5 mr-4" />
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold border border-slate-300 px-1 rounded">VISA</span>
                    <span className="text-[10px] font-bold border border-slate-300 px-1 rounded">MASTERCARD</span>
                    <span className="text-[10px] font-bold border border-slate-300 px-1 rounded">AMEX</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* School Referral */}
          <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Taking GCSE at school?</h3>
              <p className="text-slate-600">Ask your teacher about our School license (unlimited students, all 3 languages, £599-799/year)</p>
            </div>
            <Link
              href="/schools/pricing"
              className="whitespace-nowrap bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all"
            >
              School Pricing Info
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Common Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-600 text-sm">Absolutely! You can cancel your subscription from your account settings with just two clicks. You'll keep access until the end of your current period.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">How does the 7-day trial work?</h3>
              <p className="text-slate-600 text-sm">You'll get full access to all features immediately. We'll only charge your card if you decide to continue after the 7 days are up.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Is this only for GCSE?</h3>
              <p className="text-slate-600 text-sm">No! While we are perfectly aligned with AQA/Edexcel GCSE, our activities and AI tools are excellent for anyone learning these languages at a beginner to intermediate level.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Which languages are included?</h3>
              <p className="text-slate-600 text-sm">Your subscription gives you full access to French, Spanish, OR German. You can switch your primary language at any time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

