'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import PricingToggle from './PricingToggle';
import PricingCards from './PricingCards';

interface PricingPageClientProps {
  learnerPlans: any;
  schoolPlans: any;
}

export default function PricingPageClient({ learnerPlans, schoolPlans }: PricingPageClientProps) {
  const [audience, setAudience] = useState<'learners' | 'schools'>('learners');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlans = audience === 'learners' ? learnerPlans : schoolPlans;

  return (
    <>
      {/* Toggles */}
      <PricingToggle
        onAudienceChange={setAudience}
        onBillingChange={setBillingCycle}
        initialAudience={audience}
        initialBilling={billingCycle}
      />

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

      {/* Pricing Cards */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <PricingCards
            plans={currentPlans}
            audience={audience}
            billingCycle={billingCycle}
          />
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
    </>
  );
}

