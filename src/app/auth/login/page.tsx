'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '../../../components/ui/use-toast';
import {
  Users,
  GraduationCap,
  User,
  ArrowRight,
  BookOpen,
  Gamepad2,
  Trophy
} from 'lucide-react';

export default function LoginPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo');
  const error = searchParams?.get('error');
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      let title = 'Login Error';
      let description = 'An error occurred during login. Please try again.';
      let variant: 'destructive' | 'default' = 'destructive';

      if (error === 'verifier_missing') {
        title = 'Session Expired';
        description = 'Please log in again directly on this device. Email links must be opened in the same browser they were requested from.';
      } else if (error === 'verification_failed') {
        title = 'Verification Failed';
        description = 'The verification link is invalid or has expired. Please try logging in again to receive a new link.';
      } else if (error === 'invalid_verification_link') {
        title = 'Invalid Link';
        description = 'The login link used is invalid. Please try again.';
      }

      // Delay toast slightly to ensure UI is ready
      setTimeout(() => {
        toast({
          title,
          description,
          variant,
        });
      }, 500);
    }
  }, [error, toast]);


  const loginOptions = [
    {
      id: 'teacher',
      title: 'Teachers & Schools',
      description: 'Access your classroom dashboard, assignments, and student progress',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      href: '/auth/login-teacher',
      features: ['Classroom Management', 'Student Analytics', 'Assignment Creation']
    },
    {
      id: 'student',
      title: 'Students',
      description: 'Join your class and access assignments from your teacher',
      icon: GraduationCap,
      color: 'from-green-600 to-emerald-600',
      href: '/auth/student-login',
      features: ['Class Assignments', 'Progress Tracking', 'Game Access']
    },
    {
      id: 'learner',
      title: 'Individual Learners',
      description: 'Personal language learning with games and vocabulary practice',
      icon: User,
      color: 'from-purple-600 to-pink-600',
      href: '/auth/login-learner',
      features: ['Personal Dashboard', 'Vocabulary Practice', 'Learning Games']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
              <BookOpen className="w-8 h-8" />
              <span className="text-2xl font-bold">Language Gems</span>
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100"
          >
            Choose your login type to continue
          </motion.p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loginOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 mb-6">{option.description}</p>

                  <div className="space-y-2 mb-8">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={redirectTo ? `${option.href}?redirectTo=${encodeURIComponent(redirectTo)}` : option.href}
                    className={`w-full bg-gradient-to-r ${option.color} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group`}
                  >
                    <span>Login</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-blue-100 mb-4">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-white font-semibold hover:underline">
              Sign up here
            </Link>
          </p>
          <div className="flex items-center justify-center space-x-6 text-blue-200 text-sm">
            <Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}