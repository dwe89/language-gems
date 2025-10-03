'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  BookOpen,
  Building
} from 'lucide-react';
import SchoolCodeSelector from '../../../components/auth/SchoolCodeSelector';

export default function TeacherSignupPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedSchoolCode, setSelectedSchoolCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

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
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Use the teacher signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          schoolName,
          schoolCode: selectedSchoolCode,
          role: 'teacher'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      console.log('Teacher signup successful');

      if (data.needsEmailVerification) {
        setSuccess(true);
        localStorage.setItem('pendingVerificationEmail', email);
      } else {
        // Auto-login and redirect
        setTimeout(() => {
          router.push(data.redirectUrl);
        }, 100);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email!</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <strong>{email}</strong>.
            Click the link to activate your account and access your teacher dashboard!
          </p>
          <Link
            href="/schools"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-6 py-3 hover:shadow-lg transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-600 flex items-start justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side - Benefits - Fixed Width */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 text-white space-y-6 lg:sticky lg:top-8 self-start"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">Transform Your Language Teaching</h1>
            <p className="text-blue-50 text-base lg:text-lg leading-relaxed">
              Join thousands of teachers using LanguageGems to boost student engagement and streamline classroom management.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg mb-1">Student Management</h3>
                <p className="text-blue-50 text-sm">Manage classes, track progress, and create assignments effortlessly</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg mb-1">Powerful Analytics</h3>
                <p className="text-blue-50 text-sm">Get real-time insights into student performance and learning gaps</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg mb-1">GCSE Curriculum Aligned</h3>
                <p className="text-blue-50 text-sm">Content perfectly aligned with AQA and Edexcel specifications</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form - Flexible Width */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-white rounded-2xl p-6 lg:p-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Create Your Teacher Account</h2>
            <p className="text-gray-600 text-sm lg:text-base">
              Start your free trial and transform your language teaching
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                School Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="schoolName"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Language Gems Academy"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This will generate your school code automatically
              </p>
            </div>

            {/* School Code Selector */}
            {schoolName.trim() && (
              <SchoolCodeSelector
                schoolName={schoolName}
                onCodeSelect={setSelectedSchoolCode}
                selectedCode={selectedSchoolCode}
              />
            )}

            <div>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Create Teacher Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Are you an individual learner?{' '}
              <Link href="/auth/signup-learner" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up as learner
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}