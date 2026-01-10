"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '../../../utils/supabase/client';
import { Gem, Gamepad2, Trophy, TrendingUp, Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';
import GameSlideshow from '../../../components/student/GameSlideshow';
import StudentHeader from '../../../components/student/StudentHeader';

export default function StudentLoginPage() {
  const [username, setUsername] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Handle URL error parameters
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'verification_failed':
          setError('Email verification failed. Please try again or request a new verification email.');
          break;
        case 'invalid_verification_link':
          setError('Invalid verification link. Please try signing up again.');
          break;
        default:
          setError('An error occurred during authentication.');
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // First verify student credentials via API (same as existing system)
      const response = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          schoolCode: schoolCode,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Student login failed');
      }

      // If verification successful, use the returned email to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.user.email,
        password: password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      setSuccess('Login successful! Redirecting to your dashboard...');

      // Redirect to student dashboard
      setTimeout(() => {
        router.push('/student-dashboard');
      }, 1000);
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setUsername('stevej');
    setSchoolCode('CHS');
    setPassword('student123');

    // Auto-submit after a brief delay
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
      {/* Student Header Navigation */}
      <StudentHeader />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-yellow-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-300/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-green-300/20 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Game Slideshow */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <div className="w-full max-w-lg">
            <GameSlideshow />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-white/20"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Gem className="h-10 w-10 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                Welcome Back!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-base"
              >
                Ready to continue your language adventure?
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onSubmit={handleSubmit}
              className="space-y-4 mb-6"
            >
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use the username provided by your teacher
                </p>
              </div>

              {/* School Code Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Code
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <input
                    type="text"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your school code (e.g., CHS)"

                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your teacher will provide this code for additional security
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold text-center hover:shadow-xl transition-all text-base shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Gamepad2 className="h-5 w-5" />
                    <span>Sign In & Play</span>
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="border-t border-gray-200 pt-4"
            >
              <div className="text-center space-y-2">
                <p className="text-gray-500 text-xs">
                  Forgot your password? Your teacher can reset it for you.
                </p>
                <p className="text-gray-500 text-xs">
                  Are you a teacher?{' '}
                  <a
                    href={process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://languagegems.com'}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Visit our teacher portal →
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
