'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import { LogOut, User, Settings } from 'lucide-react';

export default function MainNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, refreshSession } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleSignOut = async () => {
    await signOut();
    // Redirect handled in AuthProvider
  };

  // Refresh auth session when component mounts
  useEffect(() => {
    const refreshAuth = async () => {
      await refreshSession();
    };
    
    refreshAuth();
  }, [refreshSession]);

  // Different navigation items based on authentication state
  const publicNavItems = [
    { name: 'Games', path: '/games' },
    { name: 'Blog', path: '/blog' },
    { name: 'Shop', path: '/shop' },
    { name: 'Custom Lessons', path: '/themes' },
    { name: 'Progress Tracking', path: '/premium' },
  ];

  const authenticatedNavItems = [
    { name: 'Games', path: '/games' },
    { name: 'Blog', path: '/blog' },
    { name: 'Shop', path: '/shop' },
    { name: 'Custom Lessons', path: '/dashboard/content' },
    { name: 'Progress Tracking', path: '/dashboard/progress' },
  ];

  // Use the appropriate navigation items based on auth state
  const navItems = user ? authenticatedNavItems : publicNavItems;

  // Add debug output to check authentication state (only log significant changes)
  useEffect(() => {
    const userState = {
      isAuthenticated: !!user, 
      userId: user?.id,
      role: user?.user_metadata?.role
    };
    
    // Only log if state actually changed
    if (user !== null) {
      console.log('Auth state changed in MainNavigation:', userState);
    }
  }, [user?.id, user?.user_metadata?.role]); // Only depend on specific fields that matter

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 py-3 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            href={user ? "/account" : "/"} 
            className="font-bold text-2xl text-white flex items-center"
          >
            <span className="text-3xl mr-2">💎</span>
            <span className="text-yellow-300">Language<span className="text-white">Gems</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors text-white font-medium hover:text-yellow-200 ${
                  isActive(item.path)
                    ? 'text-yellow-300 font-bold'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="py-2 px-4 text-white hover:text-yellow-200 transition-colors flex items-center"
                >
                  <Settings className="mr-1 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="py-2 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-800 rounded-full font-medium transition-colors flex items-center"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="py-2 px-4 text-white hover:text-yellow-200 transition-colors"
                >
                  Creator Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="py-2 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-full font-bold transition-colors"
                >
                  Start Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
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
          <nav className="md:hidden mt-4 py-4 border-t border-blue-700">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block transition-colors text-white ${
                      isActive(item.path)
                        ? 'text-yellow-300 font-medium'
                        : 'hover:text-yellow-200'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-blue-700">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-white hover:text-yellow-200 transition-colors mb-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-white hover:text-yellow-200 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="block text-white hover:text-yellow-200 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Creator Login
                  </Link>
                )}
              </li>
              {!user && (
                <li className="pt-2">
                  <Link
                    href="/auth/signup"
                    className="block py-2 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-full font-bold transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Now
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
} 