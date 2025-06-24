'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function EmailConfirmedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Clear any pending verification email from storage
    localStorage.removeItem('pendingVerificationEmail');

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/auth/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-indigo-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Email Verified Successfully!
          </h1>

          {/* Message */}
          <div className="text-slate-600 mb-8 space-y-3">
            <p>
              Great! Your email address has been verified and your account is now active.
            </p>
            <p className="text-sm">
              You can now sign in and start exploring Language Gems.
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-green-700 text-sm">
              Redirecting to sign in page in <span className="font-bold">{countdown}</span> seconds...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center font-medium"
            >
              <span>Sign In Now</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>

            <Link
              href="/"
              className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>

          {/* Welcome Message */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Welcome to Language Gems! 🎉
              <br />
              Ready to start your language learning journey?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 