'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showExternalModal, setShowExternalModal] = useState(false);

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
            <span className="ml-2 px-2 py-0.5 bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 text-[10px] font-bold tracking-wider rounded-full uppercase backdrop-blur-sm">Beta</span>
          </Link>
          <ul className="hidden md:flex space-x-2">
            <li><Link href="/" className="gem-nav-item">Home</Link></li>
            <li><Link href="/themes" className="gem-nav-item">Themes</Link></li>
            <li>
              <button
                onClick={() => setShowExternalModal(true)}
                className="gem-nav-item bg-transparent border-none cursor-pointer"
              >
                Resources
              </button>
            </li>
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
      {/* Modal removed to just direct link for simplicity as requested, but implemented as modal if preferred */}
      <ExternalLinkModal
        isOpen={showExternalModal}
        onClose={() => setShowExternalModal(false)}
        url="https://www.secondarymfl.com"
      />

    </nav>
  );
}

function ExternalLinkModal({ isOpen, onClose, url }: { isOpen: boolean; onClose: () => void; url: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 relative overflow-hidden">

        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 mt-2">Leaving LanguageGems</h3>
        <p className="text-gray-600 mb-6">
          You are about to visit our sister site for teaching resources:
          <br />
          <span className="font-semibold text-blue-600 block mt-1">{url}</span>
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-center transition-colors shadow-lg hover:shadow-xl"
          >
            Visit Site →
          </a>
        </div>
      </div>
    </div>
  );
} 