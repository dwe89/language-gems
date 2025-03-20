'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function MainNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Languages', path: '/languages' },
    { name: 'Themes', path: '/themes' },
    { name: 'Games', path: '/games' },
    { name: 'Exercises', path: '/exercises' },
    { name: 'Premium', path: '/premium' },
    { name: 'Schools', path: '/schools/pricing' },
  ];

  return (
    <header className="bg-white shadow-sm py-4 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="font-bold text-2xl text-blue-600 flex items-center"
          >
            <span className="mr-2">🌟</span>
            <span>Language Gems</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="py-2 px-4 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block transition-colors ${
                      isActive(item.path)
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/signup"
                  className="block py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up Free
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
} 