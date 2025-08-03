'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, School, ArrowRight, Gem } from 'lucide-react';
import Link from 'next/link';
import GameSlideshow from '../../../../components/student/GameSlideshow';

export default function StudentLogin() {
  const router = useRouter();
  const { user, userRole, isLoading, signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already authenticated, redirect appropriately
  useEffect(() => {
    if (!isLoading && user) {
      if (userRole === 'student') {
        router.push('/student-dashboard');
      } else {
        // Non-student users redirect to main site
        const mainSiteUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/account'
          : 'https://languagegems.com/account';
        window.location.href = mainSiteUrl;
      }
    }
  }, [user, userRole, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First verify student credentials via API
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
        throw new Error(data.error || 'Login failed');
      }

      // If verification successful, use the returned email to sign in
      const { error: signInError } = await signIn(data.user.email, password);

      if (signInError) {
        throw new Error(signInError);
      }

      // Success - redirect will happen via useEffect
    } catch (err) {
      console.error('Student login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
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
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Gem className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h1>
            <p className="text-gray-600 text-base">Ready to continue your language adventure?</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username Field */}
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* School Code Field */}
            <div className="space-y-1">
              <label htmlFor="schoolCode" className="block text-sm font-medium text-gray-700">
                School Code
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="schoolCode"
                  type="text"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all uppercase text-sm"
                  placeholder="ENTER SCHOOL CODE"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold text-base hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Let's Play!</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Help Text */}
          <div className="mt-5 text-center">
            <p className="text-gray-500 text-xs mb-1">Need help logging in?</p>
            <p className="text-gray-600 font-medium text-xs">Ask your teacher for your login details</p>
          </div>

          {/* Teacher Portal Link */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-2">Are you a teacher?</p>
              <Link
                href={process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://languagegems.com'}
                className="text-purple-600 hover:text-purple-700 font-medium text-xs transition-colors"
              >
                Visit our teacher portal →
              </Link>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
