'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailParam = searchParams?.get('email');
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('pendingVerificationEmail', emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    if (!email) {
      setError('No email address found');
      return;
    }

    setResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Check Your Email
          </h1>

          {/* Message */}
          <div className="text-slate-600 mb-6 space-y-3">
            <p>
              We've sent a verification email to:
            </p>
            {email && (
              <p className="font-semibold text-indigo-600 bg-indigo-50 py-2 px-4 rounded-lg">
                {email}
              </p>
            )}
            <p className="text-sm">
              Click the verification link in your email to activate your account and complete the signup process.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-slate-800 mb-2">Next steps:</h3>
            <ol className="text-sm text-slate-600 space-y-1">
              <li>1. Check your email inbox</li>
              <li>2. Look for an email from Language Gems</li>
              <li>3. Click the verification link</li>
              <li>4. Return here to sign in</li>
            </ol>
          </div>

          {/* Success/Error Messages */}
          {resent && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">Verification email sent successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              disabled={resending || !email}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {resending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </button>

            <Link
              href="/auth/login"
              className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
            >
              Already verified? Sign In
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Didn't receive the email? Check your spam folder or try resending.
              <br />
              Need help? <Link href="/contact" className="text-indigo-600 hover:underline">Contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 