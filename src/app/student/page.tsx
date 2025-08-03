"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700">
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💎</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Welcome to LanguageGems!</h1>
            <p className="text-slate-600 text-lg">Ready to master French, Spanish, or German?</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <Link 
              href="/auth/login"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-center block hover:shadow-lg transition-all text-lg"
            >
              🎮 Sign In & Play
            </Link>
            
            <div className="text-center py-2">
              <p className="text-slate-500 text-sm">Don't have an account yet?</p>
              <p className="text-slate-600 font-medium">Ask your teacher for your login details</p>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-6">
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-3">Are you a teacher?</p>
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Visit our teacher portal →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
