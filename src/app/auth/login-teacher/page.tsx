'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  BarChart3,
  Trophy,
  Target,
  GraduationCap
} from 'lucide-react';

export default function TeacherLoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams?.get('email') ? decodeURIComponent(searchParams.get('email')!) : '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn(email, password, 'teacher');
      if (result.error) {
        setError(result.error);
        return;
      }

      // Check if there's a pending invitation to accept
      const schoolCode = searchParams?.get('school_code');
      const isInvitation = searchParams?.get('invitation');

      if (schoolCode && isInvitation) {
        // Accept the invitation
        const inviteResponse = await fetch('/api/auth/accept-invitation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ school_code: schoolCode })
        });

        if (!inviteResponse.ok) {
          const data = await inviteResponse.json();
          setError(data.error || 'Failed to accept invitation');
          return;
        }

        // Show success message and redirect
        router.push('/account?invitation_accepted=true');
        return;
      }

      // Check for redirect parameter
      const redirectTo = searchParams?.get('redirectTo') || '/account';
      router.push(redirectTo);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-300/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-300/20 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white space-y-8 max-w-lg"
          >
            <div>
              <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-blue-100 transition-colors mb-8">
                <BookOpen className="w-8 h-8" />
                <span className="text-2xl font-bold">Language Gems</span>
              </Link>
              <h1 className="text-4xl font-bold mb-4">Welcome Back, Teacher!</h1>
              <p className="text-xl text-blue-100">
                Access your classroom dashboard and manage your students' language learning journey.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Classroom Management</h3>
                  <p className="text-blue-100">Manage students, create classes, and assign learning activities</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Student Analytics</h3>
                  <p className="text-blue-100">Track progress, identify weak areas, and celebrate achievements</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Assignment Creation</h3>
                  <p className="text-blue-100">Create custom assignments and assessments for your curriculum</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Gamified Learning</h3>
                  <p className="text-blue-100">Engage students with 15+ interactive games and achievement systems</p>
                </div>
              </div>
            </div>
          </motion.div>
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
                className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <GraduationCap className="h-10 w-10 text-white" />
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
                className="text-gray-600"
              >
                Sign in to your teacher dashboard
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 text-center"
            >
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Forgot your password?
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
                  Sign up here
                </Link>
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <Link href="/auth/login" className="hover:text-blue-600 transition-colors">← Back to login options</Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
