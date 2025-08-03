'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, ArrowRight, Home, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const orderId = searchParams?.get('order_id');
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (orderId: string, productId: string, productName: string) => {
    setDownloading(productId);
    try {
      const response = await fetch(`/api/orders/${orderId}/download/${productId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.downloadUrl) {
          // Create a temporary link to trigger download
          const link = document.createElement('a');
          link.href = data.downloadUrl;
          link.download = productName;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          
          // Safe cleanup with timeout
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
        console.log('Fetching order details for session:', sessionId);
        response = await fetch(`/api/orders/by-session/${sessionId}`);
      } else if (orderId) {
        console.log('Fetching order details for order:', orderId);
        response = await fetch(`/api/orders/${orderId}`);
      } else {
        throw new Error('No session ID or order ID provided');
      }
      
      console.log('Order fetch response:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Order details received:', data);
        setOrderDetails(data);
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
          <p className="text-slate-600">Loading your order details...</p>
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
            href="/shop"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

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
            {sessionId && (
              <p className="text-sm text-green-600 mt-1">
                Session ID: {sessionId}
              </p>
            )}
            {orderId && (
              <p className="text-sm text-green-600 mt-1">
                Order ID: {orderId.slice(0, 8).toUpperCase()}
              </p>
            )}
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
                    <span className="text-slate-600">Payment Method:</span>
                    <span className="font-medium">Card</span>
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
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Lifetime access to purchased materials
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
              <p className="text-sm text-slate-600 mt-1">Click download to access your educational resources</p>
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
                        <div className="flex items-center text-sm text-slate-500">
                          <span>Quantity: {item.quantity}</span>
                          <span className="mx-2">•</span>
                          <span>£{(item.price_cents / 100).toFixed(2)}</span>
                        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/account/orders"
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            View My Orders
          </Link>
          {/* Removed 'Continue Shopping' button to /shop */}
          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 mb-4">
            If you have any questions about your purchase or need assistance downloading your resources, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/support"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            A confirmation email with download links has been sent to your email address.
            <br />
            Please check your spam folder if you don't see it in your inbox.
          </p>
        </div>
      </div>
    </div>
  );
} 