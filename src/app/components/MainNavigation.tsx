'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import { getNavigationItems } from '../../lib/featureFlags';
import { LogOut, User, Settings, Gem } from 'lucide-react';
import SmartAuthButtons from '../../components/SmartAuthButtons';

export default function MainNavigation() {
  console.log('MainNavigation component loaded!');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, signOut, refreshSession, isLoading, userRole } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = getNavigationItems();

  // Handle user avatar click
  const handleUserAvatarClick = () => {
    router.push('/account');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Periodically refresh session to keep auth state fresh
  useEffect(() => {
    if (user && !isLoading) {
      const interval = setInterval(() => {
        refreshSession();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user, isLoading, refreshSession]);

  useEffect(() => {
    const userState = {
      isAuthenticated: !!user, 
      userId: user?.id,
      email: user?.email,
      role: userRole  // Use userRole from AuthProvider instead of user_metadata
    };
    
    // Only log if state actually changed
    if (user !== null) {
      console.log('Auth state changed in MainNavigation:', userState);
    }
  }, [user?.id, user?.email, userRole]); // Update dependency to use userRole

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 py-3 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            href={(isMounted && user) ? "/account" : "/"} 
            className="font-bold text-2xl text-white flex items-center"
          >
            <Gem className="h-8 w-8 mr-2 text-yellow-300" />
            <span className="text-yellow-300">Language<span className="text-white">Gems</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const href = item.comingSoon ? item.comingSoonPath : item.path;
              return (
                <Link
                  key={item.name}
                  href={href || item.path}
                  className={`transition-colors text-white font-medium hover:text-yellow-200 relative ${
                    isActive(item.path)
                      ? 'text-yellow-300 font-bold'
                      : ''
                  }`}
                >
                  {item.name}
                  {item.comingSoon && (
                    <span className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-blue-900 px-1 py-0.5 rounded-full font-bold">
                      Soon
                    </span>
                  )}
                  {/* REMOVED DEMO ICON FOR DESKTOP NAVIGATION */}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {(isMounted && user) ? (
              <>
                <SmartAuthButtons />
                <button
                  onClick={handleLogout}
                  className="py-2 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-800 rounded-full font-medium transition-colors flex items-center"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <SmartAuthButtons />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-blue-700">
            <ul className="space-y-4">
              {navItems.map((item) => {
                const href = item.comingSoon ? item.comingSoonPath : item.path;
                return (
                  <li key={item.name}>
                    <Link
                      href={href || item.path}
                      className={`block transition-colors text-white relative ${
                        isActive(item.path)
                          ? 'text-yellow-300 font-medium'
                          : 'hover:text-yellow-200'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                      {item.comingSoon && (
                        <span className="ml-2 text-xs bg-yellow-400 text-blue-900 px-2 py-1 rounded-full font-bold">
                          Coming Soon
                        </span>
                      )}
                      {/* REMOVED DEMO ICON FOR MOBILE NAVIGATION */}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-4 border-t border-blue-700">
                {(isMounted && user) ? (
                  <>
                    <SmartAuthButtons variant="mobile" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-white hover:text-yellow-200 transition-colors mt-3"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <SmartAuthButtons variant="mobile" />
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}