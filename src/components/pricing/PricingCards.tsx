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
  Phone,
  BookOpen,
  Briefcase
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
  highlight?: boolean;
  promoPrice?: number;
  promoLabel?: string;
}

interface PricingCardsProps {
  plans: Record<string, PlanFeature>;
  audience: 'learners' | 'schools';
  billingCycle: 'monthly' | 'yearly';
}

export default function PricingCards({ plans, audience, billingCycle }: PricingCardsProps) {
  const planCount = Object.keys(plans).length;

  return (
    <div className={`grid gap-8 max-w-7xl mx-auto ${planCount === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
      planCount === 3 ? 'grid-cols-1 md:grid-cols-3' :
        'grid-cols-1 md:grid-cols-2 justify-center'
      }`}>
      {Object.entries(plans).map(([planKey, plan]) => (
        <motion.div
          key={planKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: Object.keys(plans).indexOf(planKey) * 0.1 }}
          className={`bg-white rounded-2xl p-6 shadow-xl relative border-2 flex flex-col ${plan.popular || plan.highlight ? 'border-purple-500 scale-105 z-10' : 'border-gray-100'
            }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
              <div className="inline-flex bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold items-center shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </div>
            </div>
          )}

          {plan.highlight && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
              <div className="inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold items-center shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Best Value
              </div>
            </div>
          )}

          <div className="text-center mb-6 flex-grow-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md ${planKey.includes('free') ? 'bg-gray-100' :
              planKey.includes('tutor') ? 'bg-gradient-to-r from-teal-400 to-emerald-500' :
                planKey.includes('teacher') ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                  planKey.includes('student') || planKey.includes('pro') ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    'bg-gradient-to-r from-orange-500 to-red-600'
              }`}>
              {planKey.includes('free') ? <GraduationCap className="w-7 h-7 text-gray-600" /> :
                planKey.includes('tutor') ? <BookOpen className="w-7 h-7 text-white" /> :
                  planKey.includes('teacher') ? <Briefcase className="w-7 h-7 text-white" /> :
                    planKey.includes('student') ? <Crown className="w-7 h-7 text-white" /> :
                      <Users className="w-7 h-7 text-white" />
              }
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-3 h-10 flex items-center justify-center px-2">{plan.description}</p>

            {audience === 'schools' && plan.studentLimit && (
              <p className="text-xs text-blue-600 font-semibold mb-2">{plan.studentLimit}</p>
            )}

            {/* Promo Label */}
            {plan.promoLabel && (
              <div className="mb-2">
                <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {plan.promoLabel}
                </span>
              </div>
            )}

            <div className="text-3xl font-bold text-gray-900 mb-1">
              {audience === 'schools' ? (
                typeof plan.price.yearly === 'number' ? (
                  <>
                    {plan.promoPrice ? (
                      <div className="flex flex-col items-center">
                        <span className="text-lg text-gray-400 line-through">£{plan.price.yearly}</span>
                        <span className="text-4xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                          £{plan.promoPrice}
                        </span>
                        <span className="text-sm text-gray-500 font-normal">/yr</span>
                      </div>
                    ) : (
                      <>
                        £{plan.price.yearly}
                        <span className="text-sm text-gray-500 font-normal">/yr</span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-2xl">{plan.price.yearly}</span>
                )
              ) : (
                typeof plan.price[billingCycle] === 'number' ? (
                  <>
                    £{plan.price[billingCycle]}
                    <span className="text-sm text-gray-500 font-normal">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl">{plan.price[billingCycle]}</span>
                )
              )}
            </div>

            {audience === 'learners' && typeof plan.price[billingCycle] === 'number' && plan.price[billingCycle] > 0 && billingCycle === 'yearly' && (
              <p className="text-xs text-green-600 font-bold">
                Save £{(Number(plan.price.monthly) * 12 - Number(plan.price.yearly)).toFixed(0)}/yr
              </p>
            )}

            {audience === 'schools' && (
              <p className="text-xs text-gray-400">
                +VAT where applicable
              </p>
            )}
          </div>

          <div className="space-y-3 mb-8 flex-grow">
            {plan.features.slice(0, 8).map((feature, index) => (
              <div key={index} className="flex items-start text-sm">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}

            {plan.limitations && plan.limitations.map((limitation, index) => (
              <div key={index} className="flex items-start text-sm">
                <X className="w-4 h-4 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">{limitation}</span>
              </div>
            ))}
          </div>

          <Link
            href={plan.ctaLink}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all text-center block text-sm ${planKey.includes('free')
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : planKey.includes('tutor')
                ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-white hover:shadow-lg hover:scale-105'
                : planKey.includes('teacher')
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105'
                  : planKey.includes('student') || planKey.includes('pro')
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:scale-105'
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

