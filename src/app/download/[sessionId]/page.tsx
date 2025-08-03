'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { Download, CheckCircle, AlertCircle, Clock, ArrowLeft } from 'lucide-react';

interface Purchase {
  id: string;
  user_email: string;
  downloads_remaining: number;
  expires_at: string;
  product: {
    id: string;
    name: string;
    file_path: string;
  };
}

export default function DownloadPage() {
  const params = useParams();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.sessionId) {
      fetchPurchase(params.sessionId as string);
    }
  }, [params.sessionId]);

  const fetchPurchase = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          product:products (
            id,
            name,
            file_path
          )
        `)
        .eq('stripe_session_id', sessionId)
        .single();

      if (error) throw error;
      setPurchase(data);
    } catch (error) {
      console.error('Error fetching purchase:', error);
      setError('Purchase not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!purchase?.product.file_path) return;
    
    setDownloading(true);
    
    try {
      // Generate signed URL for download
      const { data, error } = await supabase.storage
        .from('products')
        .createSignedUrl(purchase.product.file_path, 600); // 10 minutes

      if (error) throw error;

      // Update downloads remaining
      await supabase
        .from('purchases')
        .update({ 
          downloads_remaining: Math.max(0, purchase.downloads_remaining - 1) 
        })
        .eq('id', purchase.id);

      // Trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = purchase.product.name;
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

      // Update local state
      setPurchase(prev => prev ? {
        ...prev,
        downloads_remaining: Math.max(0, prev.downloads_remaining - 1)
      } : null);

    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const isExpired = purchase ? new Date(purchase.expires_at) < new Date() : false;
  const canDownload = purchase && purchase.downloads_remaining > 0 && !isExpired;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Download Not Available</h1>
            <p className="text-slate-600 mb-8">
              {error || 'The download link you requested is not valid or has expired.'}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Purchase Successful!
            </h1>
            <p className="text-xl text-slate-600">
              Thank you for your purchase. Your download is ready.
            </p>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {purchase.product.name}
                </h2>
                <p className="text-slate-600">
                  Digital Resource
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 mb-1">Purchase Email</div>
                <div className="font-medium text-slate-800">{purchase.user_email}</div>
              </div>
            </div>

            {/* Download Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Download className="h-5 w-5 text-slate-600 mr-2" />
                  <span className="font-medium text-slate-800">Downloads Remaining</span>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {purchase.downloads_remaining}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-slate-600 mr-2" />
                  <span className="font-medium text-slate-800">Access Expires</span>
                </div>
                <div className="text-sm text-slate-600">
                  {new Date(purchase.expires_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              {canDownload ? (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <Download className="mr-3 h-5 w-5" />
                      Download Your Resource
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <p className="text-red-700 font-medium">
                    {isExpired 
                      ? 'This download link has expired'
                      : 'No downloads remaining'
                    }
                  </p>
                  <p className="text-red-600 text-sm mt-2">
                    Please contact support if you need assistance.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Need Help?
            </h3>
            <p className="text-slate-600 mb-6">
              If you're having trouble downloading your resource or have any questions, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Browse More Resources
              </Link>
              <a
                href="mailto:support@languagegems.com"
                className="border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-slate-400 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 