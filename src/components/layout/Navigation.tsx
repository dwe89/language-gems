'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-indigo-900/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-white mr-8 flex items-center group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-6 h-6 mr-2"
            >
              <Gem className="w-6 h-6 text-cyan-400" />
            </motion.div>
            Language<span className="text-cyan-400">Gems</span>
          </Link>
          <ul className="hidden md:flex space-x-2">
            <li><Link href="/" className="gem-nav-item">Home</Link></li>
            <li><Link href="/themes" className="gem-nav-item">Themes</Link></li>
            <li><Link href="/languages" className="gem-nav-item">Languages</Link></li>
            <li><Link href="/exercises" className="gem-nav-item">Exercises</Link></li>
            <li><Link href="/blog" className="gem-nav-item">Blog</Link></li>
            <li><Link href="/about" className="gem-nav-item">About</Link></li>
          </ul>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            className="text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        <div className="hidden md:flex space-x-3">
          <Link href="/premium" className="gem-button bg-gradient-to-r from-purple-600 to-indigo-600">
            Premium
          </Link>
          <Link href="/auth/login" className="gem-button">
            Login
          </Link>
          <Link href="/schools" className="gem-button pink-gem-button">
            Schools
          </Link>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-900/50 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-2">
            <Link 
              href="/" 
              className="block gem-nav-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/themes" 
              className="block gem-nav-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Themes
            </Link>
            <Link 
              href="/languages" 
              className="block gem-nav-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Languages
            </Link>
            <Link 
              href="/exercises" 
              className="block gem-nav-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Exercises
            </Link>
            <Link 
              href="/blog" 
              className="block gem-nav-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="block gem-nav-item"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-3 space-y-2">
              <Link 
                href="/premium" 
                className="block w-full text-center gem-button bg-gradient-to-r from-purple-600 to-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Premium
              </Link>
              <Link 
                href="/auth/login" 
                className="block w-full text-center gem-button"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/schools" 
                className="block w-full text-center gem-button pink-gem-button"
                onClick={() => setIsMenuOpen(false)}
              >
                Schools
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 