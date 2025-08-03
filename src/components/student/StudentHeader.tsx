'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gem, Rocket } from 'lucide-react';

export default function StudentHeader() {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/student" 
            className="flex items-center space-x-3 group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Gem className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Language<span className="text-yellow-300">Gems</span>
              </h1>
              <p className="text-xs text-white/80">Student Portal</p>
            </div>
          </Link>

          {/* Tagline */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2 text-white/90 text-sm font-medium">
              <span>Master languages through play!</span>
              <Rocket className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
