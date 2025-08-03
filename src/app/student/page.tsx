"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Gem, Gamepad2, Trophy, TrendingUp } from 'lucide-react';
import GameSlideshow from '../../components/student/GameSlideshow';

export default function StudentHomepage() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();

  // If user is already authenticated, redirect to student dashboard
  useEffect(() => {
    if (!isLoading && user) {
      if (userRole === 'student') {
        router.push('/student-dashboard');
      } else {
        // Non-student users should be redirected to main site
        const mainSiteUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/account'
          : 'https://languagegems.com/account';
        window.location.href = mainSiteUrl;
      }
    }
  }, [user, userRole, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  // Show login interface for non-authenticated users
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

        {/* Right Side - Welcome Form */}
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
              Welcome to LanguageGems!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 text-base"
            >
              Ready to master French, Spanish, or German? 🚀
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/auth/login"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold text-center block hover:shadow-xl transition-all text-base shadow-lg flex items-center justify-center space-x-2"
              >
                <Gamepad2 className="h-5 w-5" />
                <span>Sign In & Play</span>
              </Link>
            </motion.div>

            <div className="text-center py-1">
              <p className="text-gray-500 text-sm">Don't have an account yet?</p>
              <p className="text-gray-700 font-medium text-sm">Ask your teacher for your login details</p>
            </div>
          </motion.div>
          
          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-600 text-xs font-medium">Fun Games</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-600 text-xs font-medium">Earn Points</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-600 text-xs font-medium">Track Progress</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="border-t border-gray-200 pt-4"
          >
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-2">Are you a teacher?</p>
              <a
                href={process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://languagegems.com'}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors text-sm"
              >
                Visit our teacher portal →
              </a>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
