'use client';

import { useState } from 'react';
import { User, School } from 'lucide-react';

interface PricingToggleProps {
  onAudienceChange: (audience: 'learners' | 'schools') => void;
  onBillingChange: (billing: 'monthly' | 'yearly') => void;
  initialAudience?: 'learners' | 'schools';
  initialBilling?: 'monthly' | 'yearly';
}

export default function PricingToggle({
  onAudienceChange,
  onBillingChange,
  initialAudience = 'learners',
  initialBilling = 'monthly'
}: PricingToggleProps) {
  const [audience, setAudience] = useState<'learners' | 'schools'>(initialAudience);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialBilling);

  const handleAudienceChange = (newAudience: 'learners' | 'schools') => {
    setAudience(newAudience);
    onAudienceChange(newAudience);
  };

  const handleBillingChange = (newBilling: 'monthly' | 'yearly') => {
    setBillingCycle(newBilling);
    onBillingChange(newBilling);
  };

  return (
    <>
      {/* Audience Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl p-1 shadow-lg">
          <button
            onClick={() => handleAudienceChange('learners')}
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
            onClick={() => handleAudienceChange('schools')}
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
              onClick={() => handleBillingChange('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingChange('yearly')}
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
    </>
  );
}

