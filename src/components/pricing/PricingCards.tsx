'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Crown,
  Check,
  X,
  Users,
  GraduationCap,
  Star,
  CreditCard,
  Phone
} from 'lucide-react';

interface PlanFeature {
  name: string;
  price: { monthly: number | string; yearly: number | string };
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  cta: string;
  ctaLink: string;
  studentLimit?: string;
}

interface PricingCardsProps {
  plans: Record<string, PlanFeature>;
  audience: 'learners' | 'schools';
  billingCycle: 'monthly' | 'yearly';
}

export default function PricingCards({ plans, audience, billingCycle }: PricingCardsProps) {
  return (
    <div className={`grid gap-8 max-w-6xl mx-auto ${
      Object.keys(plans).length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 justify-center'
    }`}>
      {Object.entries(plans).map(([planKey, plan]) => (
        <motion.div
          key={planKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: Object.keys(plans).indexOf(planKey) * 0.1 }}
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
  );
}

