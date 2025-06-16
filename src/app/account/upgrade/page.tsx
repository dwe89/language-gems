'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabase } from '../../../lib/supabase';
import { Product } from '../../../types/ecommerce';
import { ArrowLeft, Crown, Check, Star, Zap, Shield, Users } from 'lucide-react';

export default function UpgradePage() {
  const { user } = useAuth();
  const [subscriptionProducts, setSubscriptionProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionProducts();
  }, []);

  const fetchSubscriptionProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .contains('tags', ['subscription'])
        .eq('is_active', true)
        .order('price_cents', { ascending: true });

      if (error) throw error;
      setSubscriptionProducts(data || []);
    } catch (error) {
      console.error('Error fetching subscription products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceCents: number) => {
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  const handleSubscribe = async (product: Product) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login';
      return;
    }

    setCheckoutLoading(product.id);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            product_id: product.id,
            quantity: 1,
            price_cents: product.price_cents
          }],
          customer_email: user.email,
          mode: 'subscription' // This would need to be handled in the API
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error during subscription checkout:', error);
      alert('There was an error starting your subscription. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const features = [
    {
      icon: Crown,
      title: 'Full Dashboard Access',
      description: 'Access to all premium features and tools'
    },
    {
      icon: Zap,
      title: 'Advanced Games',
      description: 'Interactive learning games and activities'
    },
    {
      icon: Star,
      title: 'Progress Tracking',
      description: 'Detailed analytics and progress reports'
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: '24/7 customer support with priority response'
    },
    {
      icon: Users,
      title: 'Collaboration Tools',
      description: 'Share resources and collaborate with other educators'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in to upgrade</h2>
          <Link 
            href="/auth/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>
          
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6">
              <Crown className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Upgrade to Premium
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Unlock the full potential of LanguageGems with access to premium features, advanced tools, and priority support.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pricing Plans */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-slate-600">Select the plan that best fits your needs</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading subscription plans...</p>
            </div>
          ) : subscriptionProducts.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No subscription plans available</h3>
              <p className="text-slate-500">Check back soon for premium subscription options</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {subscriptionProducts.map((product) => {
                const isAnnual = product.tags?.includes('annual');
                const isRecommended = isAnnual; // Recommend annual plans
                
                return (
                  <div 
                    key={product.id}
                    className={`relative bg-white rounded-lg shadow-sm border-2 overflow-hidden ${
                      isRecommended ? 'border-purple-500' : 'border-slate-200'
                    }`}
                  >
                    {isRecommended && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium text-center py-2">
                        Most Popular
                      </div>
                    )}
                    
                    <div className={`p-8 ${isRecommended ? 'pt-12' : ''}`}>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          {product.name}
                        </h3>
                        
                        <div className="mb-6">
                          <span className="text-4xl font-bold text-slate-900">
                            {formatPrice(product.price_cents)}
                          </span>
                          <span className="text-slate-600 ml-2">
                            / {isAnnual ? 'year' : 'month'}
                          </span>
                          
                          {isAnnual && (
                            <div className="text-sm text-green-600 font-medium mt-1">
                              Save 20% vs monthly
                            </div>
                          )}
                        </div>
                        
                        <p className="text-slate-600 mb-8">
                          {product.description}
                        </p>
                        
                        <button
                          onClick={() => handleSubscribe(product)}
                          disabled={checkoutLoading === product.id}
                          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                            isRecommended
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {checkoutLoading === product.id ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                              Processing...
                            </div>
                          ) : (
                            'Start Subscription'
                          )}
                        </button>
                      </div>
                      
                      {/* Features List */}
                      <div className="mt-8 pt-8 border-t border-slate-200">
                        <h4 className="font-semibold text-slate-800 mb-4">Includes:</h4>
                        <ul className="space-y-3">
                          {features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-600">{feature.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-600">Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-2">What happens to my data if I cancel?</h3>
              <p className="text-slate-600">Your account and data remain safe. You'll keep access to any previously purchased individual resources, but lose access to premium features.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-2">Do you offer student discounts?</h3>
              <p className="text-slate-600">Yes! Please contact our support team with your student verification for special pricing options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 