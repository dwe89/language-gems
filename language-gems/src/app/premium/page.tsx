import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Subscriptions | Language Gems',
  description: 'Upgrade your language learning experience with our premium subscription plans.',
};

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Get started with essential learning tools',
    features: [
      'Access to basic lessons',
      'Limited vocabulary practice',
      '2 games available',
      'Progress tracking',
    ],
    buttonText: 'Get Started',
    buttonLink: '/signup',
    highlighted: false,
    color: 'bg-gray-100 border-gray-300',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
  },
  {
    name: 'Premium',
    price: '$9.99 / month',
    description: 'Enhance your learning with premium features',
    features: [
      'All Basic features',
      'Full vocabulary database',
      'All games and exercises',
      'Personalized learning path',
      'No ads',
      'Offline mode',
    ],
    buttonText: 'Start 7-Day Free Trial',
    buttonLink: '/checkout/premium',
    highlighted: true,
    color: 'bg-blue-50 border-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Premium Plus',
    price: '$19.99 / month',
    description: 'Get the ultimate language learning experience',
    features: [
      'All Premium features',
      '1-on-1 tutoring sessions',
      'Native speaker conversation practice',
      'Pronunciation assessment',
      'Certificate of completion',
      'Priority customer support',
    ],
    buttonText: 'Start 7-Day Free Trial',
    buttonLink: '/checkout/premium-plus',
    highlighted: false,
    color: 'bg-purple-50 border-purple-300',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
];

const premiumFeatures = [
  {
    title: 'Comprehensive Curriculum',
    description: 'Access our complete curriculum for all languages with structured learning paths for beginner to advanced levels.',
    icon: '📚',
  },
  {
    title: 'Personalized Learning',
    description: 'Our AI-powered system adapts to your learning style and pace, focusing on areas you need most.',
    icon: '🧠',
  },
  {
    title: 'Interactive Exercises',
    description: 'Engage with thousands of interactive exercises designed to reinforce learning and track progress.',
    icon: '✏️',
  },
  {
    title: 'Conversation Practice',
    description: 'Practice with our AI conversation partner or connect with native speakers for real-world practice.',
    icon: '💬',
  },
  {
    title: 'Offline Access',
    description: 'Download lessons and exercises to continue learning even without an internet connection.',
    icon: '📱',
  },
  {
    title: 'Progress Certification',
    description: 'Earn certificates as you progress through levels, which you can share with employers or schools.',
    icon: '🏆',
  },
];

export default function PremiumPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Upgrade Your Learning Experience</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the right plan to accelerate your language learning journey and unlock the full potential of Language Gems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`rounded-xl overflow-hidden shadow-lg border-2 ${plan.highlighted ? 'transform md:-translate-y-4' : ''} transition-all duration-300 ${plan.color}`}
          >
            {plan.highlighted && (
              <div className="bg-blue-600 text-white text-center py-2 font-bold">
                Most Popular
              </div>
            )}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="text-3xl font-bold mb-4">{plan.price}</div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={plan.buttonLink} 
                className={`block text-center py-3 px-6 rounded-full font-bold text-white ${plan.buttonColor} transition-colors w-full`}
              >
                {plan.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Premium?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
          <p className="text-lg text-gray-600">Get even more value with our special plans.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-2">Annual Plan Discount</h3>
            <p className="text-gray-600 mb-4">Save 20% when you pay annually instead of monthly.</p>
            <Link 
              href="/checkout/annual" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
            >
              View Annual Plans
            </Link>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-2">Student Discount</h3>
            <p className="text-gray-600 mb-4">Students get 15% off any premium subscription with valid ID.</p>
            <Link 
              href="/checkout/student" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
            >
              Verify Student Status
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 