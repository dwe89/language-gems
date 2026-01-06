'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Home, Sparkles, Crown, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const orderId = searchParams?.get('order_id');
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isSubscription, setIsSubscription] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (orderId: string, productId: string, productName: string) => {
    setDownloading(productId);
    try {
      const response = await fetch(`/api/orders/${orderId}/download/${productId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.downloadUrl) {
          const link = document.createElement('a');
          link.href = data.downloadUrl;
          link.download = productName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            try {
              if (link.parentNode === document.body) {
                document.body.removeChild(link);
              }
            } catch (removeError) {
              console.warn('Failed to remove download link from DOM:', removeError);
            }
          }, 100);
        }
      } else {
        const errorData = await response.json();
        alert(`Download failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => {
    if (sessionId || orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId, orderId]);

  const fetchOrderDetails = async () => {
    try {
      let response;

      if (sessionId) {
        response = await fetch(`/api/orders/by-session/${sessionId}`);
      } else if (orderId) {
        response = await fetch(`/api/orders/${orderId}`);
      } else {
        throw new Error('No session ID or order ID provided');
      }

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);

        // Check if any order item is a subscription
        const hasSubscription = data?.order?.order_items?.some((item: any) =>
          item.product?.resource_type === 'Subscription' ||
          item.product?.name?.toLowerCase().includes('subscription') ||
          item.product?.slug?.includes('subscription')
        );
        setIsSubscription(hasSubscription);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch order details:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your details...</p>
        </div>
      </div>
    );
  }

  if (!sessionId && !orderId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Invalid Session</h2>
          <p className="text-slate-600 mb-8">We couldn't find the checkout session. Please contact support if you believe this is an error.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // SUBSCRIPTION SUCCESS PAGE
  if (isSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mx-auto flex items-center justify-center h-24 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
              <Crown className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Welcome to Premium! 🎉
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your subscription is now active. You have full access to all premium features.
            </p>
          </div>

          {/* Subscription Details */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Subscription Activated
              </h2>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">
                    {orderDetails?.order?.order_items?.[0]?.product?.name || 'Premium Subscription'}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">Your 7-day free trial has started</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Active
                  </span>
                </div>
              </div>

              <h4 className="font-medium text-slate-800 mb-4">What you can do now:</h4>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Access <strong>unlimited</strong> vocabulary games and exercises</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Use <strong>AI-powered</strong> writing and reading assessments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Track your progress with <strong>detailed analytics</strong></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Earn achievements and complete <strong>daily challenges</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              href="/learner-dashboard"
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-semibold"
            >
              Go to My Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/games"
              className="flex items-center justify-center px-6 py-4 border-2 border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition-colors font-semibold"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Learning
            </Link>
          </div>

          {/* Confirmation Notice */}
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              A confirmation email has been sent to your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // REGULAR ORDER SUCCESS PAGE (for downloadable products)
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-20 w-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Thank you for your purchase. Your educational resources are now available for download.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 bg-green-50 border-b border-green-200">
            <h2 className="text-lg font-semibold text-green-800">Order Confirmation</h2>
            {orderDetails?.order && (
              <p className="text-sm text-green-600 mt-1">
                Order #{orderDetails.order.id.slice(0, 8).toUpperCase()}
              </p>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-800 mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Order Status:</span>
                    <span className="font-medium text-green-600">
                      {orderDetails?.order?.status || 'Completed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Order Date:</span>
                    <span className="font-medium">
                      {orderDetails?.order?.created_at
                        ? new Date(orderDetails.order.created_at).toLocaleDateString()
                        : new Date().toLocaleDateString()
                      }
                    </span>
                  </div>
                  {orderDetails?.order?.total_cents && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total:</span>
                      <span className="font-medium">
                        £{(orderDetails.order.total_cents / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-3">Next Steps</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Download links have been emailed to you
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Resources are available in your account
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items */}
        {orderDetails?.order?.order_items && orderDetails.order.order_items.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Your Purchases</h2>
            </div>

            <div className="divide-y divide-slate-200">
              {orderDetails.order.order_items.map((item: any) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📚</span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {item.product?.name || 'Educational Resource'}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {item.product?.description || 'Premium educational content'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(
                        orderDetails.order.id,
                        item.product.id,
                        item.product.name
                      )}
                      disabled={downloading === item.product.id}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {downloading === item.product.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      {downloading === item.product.id ? 'Preparing...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/account/orders"
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            View My Orders
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Email Notice */}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            A confirmation email with download links has been sent to your email address.
          </p>
        </div>
      </div>
    </div>
  );
}