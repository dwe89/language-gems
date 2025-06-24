'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../components/auth/AuthProvider';
import { ArrowLeft, Plus, Minus, Trash2, CreditCard, Lock, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems, clearServerCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (priceCents: number) => {
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    setLoading(true);
    try {
      console.log('Starting checkout process...');
      console.log('Current URL:', window.location.href);
      console.log('Items to checkout:', state.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price_cents: item.product.price_cents
      })));

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price_cents: item.product.price_cents
          })),
          customer_email: user?.email || null // Allow guest checkout
        }),
      });

      console.log('API Response status:', response.status);
      console.log('API Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to create checkout session: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API Response data:', responseData);
      
      if (responseData.url) {
        console.log('Redirecting to Stripe checkout:', responseData.url);
        window.location.href = responseData.url;
      } else {
        throw new Error('No checkout URL received from API');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch by waiting for client mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-8">Discover our educational resources to get started</p>
            <Link
              href="/shop"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-600 mt-2">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Cart Items</h2>
              </div>
              
              <div className="divide-y divide-slate-200">
                {state.items.map((item) => (
                  <div key={item.product.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">📚</span>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 mb-2">
                          {item.product.name}
                        </h3>
                        
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {item.product.description}
                        </p>

                        {/* Tags */}
                        {item.product.tags && item.product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.product.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4 text-slate-500" />
                            </button>
                            
                            <span className="px-3 py-1 bg-slate-100 rounded text-sm font-medium min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                            >
                              <Plus className="h-4 w-4 text-slate-500" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-800">
                          {formatPrice(item.product.price_cents)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-slate-600">
                            {formatPrice(item.product.price_cents * item.quantity)} total
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart */}
              <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
                
                {/* Debug buttons - only show in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="flex gap-2">
                    <button
                      onClick={clearServerCart}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium px-3 py-1 border border-orange-200 rounded"
                      title="Clear phantom cart items from server (Development only)"
                    >
                      Clear Server Cart
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/stripe/debug');
                          const data = await response.json();
                          console.log('Debug info:', data);
                          alert(`Debug info logged to console. Base URL: ${data.envVars.baseUrl}`);
                        } catch (error) {
                          console.error('Debug test failed:', error);
                          alert('Debug test failed - check console');
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 border border-blue-200 rounded"
                      title="Test API connectivity (Development only)"
                    >
                      Test API
                    </button>
                    <button
                      onClick={async () => {
                        if (state.items.length === 0) {
                          alert('Add items to cart first');
                          return;
                        }
                        try {
                          const response = await fetch('/api/test/create-test-purchase', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              email: user?.email || 'test@example.com',
                              productIds: state.items.map(item => item.product.id)
                            })
                          });
                          const data = await response.json();
                          if (data.success) {
                            window.location.href = data.successUrl;
                          } else {
                            alert(`Test failed: ${data.error}`);
                          }
                        } catch (error) {
                          console.error('Test purchase failed:', error);
                          alert('Test purchase failed - check console');
                        }
                      }}
                      className="text-green-600 hover:text-green-700 text-sm font-medium px-3 py-1 border border-green-200 rounded"
                      title="Create test purchase (Development only)"
                    >
                      Test Purchase
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-8">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Guest Checkout Notice */}
                {!user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">Guest Checkout Available</div>
                      <p className="text-blue-600">
                        You can check out without an account. Your download links will be sent to the email you provide at checkout.
                      </p>
                      <Link
                        href="/auth/login"
                        className="text-blue-700 hover:text-blue-800 font-medium mt-2 inline-block"
                      >
                        Sign in to track orders →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Delivery</span>
                    <span className="font-medium text-green-600">Free (Digital)</span>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-slate-800">Total</span>
                      <span className="text-lg font-semibold text-indigo-600">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || state.items.length === 0}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </button>

                {/* Security Notice */}
                <div className="flex items-center justify-center text-sm text-slate-500">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure checkout powered by Stripe
                </div>

                {/* Continue Shopping */}
                <Link
                  href="/shop"
                  className="w-full py-2 px-4 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 