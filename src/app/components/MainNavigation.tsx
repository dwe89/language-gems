'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../components/auth/AuthProvider';
import { getNavigationItems } from '../../lib/featureFlags';
import { LogOut, User, Settings, Gem, ChevronDown, Menu, X } from 'lucide-react';
import SmartAuthButtons from '../../components/SmartAuthButtons';

export default function MainNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, signOut, userRole, hasSubscription, isLoading } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoize navigation items to prevent recalculation
  const navItems = useMemo(() => getNavigationItems(), []);

  // Memoize isActive function
  const isActive = useCallback((path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  }, [pathname]);

  // Memoize handlers to prevent recreating on every render
  const handleUserAvatarClick = useCallback(() => {
    router.push('/account');
  }, [router]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [signOut]);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, []);

  // Handle dropdown toggle
  const handleDropdownToggle = useCallback((itemName: string, event?: React.MouseEvent) => {
    // Prevent event bubbling that might interfere with navigation
    if (event) {
      event.stopPropagation();
    }
    setActiveDropdown(prev => prev === itemName ? null : itemName);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle dropdown clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Only log auth state changes when actually mounted and user state changes
  useEffect(() => {
    if (!isMounted || isLoading) return;
    
    console.log('MainNavigation: Auth state updated', {
      isAuthenticated: !!user,
      userId: user?.id,
      email: user?.email,
      role: userRole,
      hasSubscription
    });
  }, [isMounted, isLoading, user?.id, userRole, hasSubscription]); // Optimized dependencies

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 py-3 relative z-[100]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            href={(isMounted && user) ? "/account" : "/"} 
            className="font-bold text-2xl text-white flex items-center group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="mr-2"
            >
              <Gem className="h-8 w-8 text-yellow-300" />
            </motion.div>
            <span className="text-yellow-300">Language<span className="text-white">Gems</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
            {navItems.map((item) => {
              const href = item.comingSoon ? item.comingSoonPath : item.path;
              const hasDropdown = item.hasDropdown && item.dropdownItems;

              if (hasDropdown) {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={(e) => handleDropdownToggle(item.name, e)}
                      className={`flex items-center transition-colors text-white font-medium hover:text-yellow-200 relative ${
                        item.dropdownOnly ? '' : isActive(item.path) ? 'text-yellow-300 font-bold' : ''
                      }`}
                    >
                      {item.name}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                      {item.comingSoon && (
                        <span className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-blue-900 px-1 py-0.5 rounded-full font-bold">
                          Soon
                        </span>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 z-[9999]">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.comingSoon ? '/coming-soon' : dropdownItem.path}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors group cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              // Navigate using router.push
                              const targetPath = dropdownItem.comingSoon ? '/coming-soon' : dropdownItem.path;
                              router.push(targetPath);
                              
                              // Close dropdown
                              setActiveDropdown(null);
                            }}
                          >
                            <span className="font-medium text-gray-900 group-hover:text-blue-600">
                              {dropdownItem.name}
                            </span>
                            {dropdownItem.comingSoon && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                                Soon
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={href || item.path}
                  className={`transition-colors text-white font-medium hover:text-yellow-200 relative ${
                    isActive(item.path) ? 'text-yellow-300 font-bold' : ''
                  }`}
                >
                  {item.name}
                  {item.comingSoon && (
                    <span className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-blue-900 px-1 py-0.5 rounded-full font-bold">
                      Soon
                    </span>
                  )}
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
              onClick={handleMobileMenuToggle}
              className="text-white p-2 hover:text-yellow-200 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-blue-700">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const href = item.comingSoon ? item.comingSoonPath : item.path;
                const hasDropdown = item.hasDropdown && item.dropdownItems;

                // For mobile, show all items as a flat list - no dropdowns
                if (hasDropdown) {
                  return (
                    <li key={item.name}>
                      {/* Main category header (non-clickable for mobile) */}
                      <div className="text-yellow-300 font-semibold text-sm uppercase tracking-wide py-2">
                        {item.name}
                        {item.comingSoon && (
                          <span className="ml-2 text-xs bg-yellow-400 text-blue-900 px-2 py-1 rounded-full font-bold">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      
                      {/* Show all dropdown items as regular links */}
                      <div className="ml-4 space-y-1">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.comingSoon ? '/coming-soon' : dropdownItem.path}
                            className="block text-blue-200 hover:text-white transition-colors py-2 px-3 rounded hover:bg-blue-700"
                            onClick={handleMobileMenuClose}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{dropdownItem.name}</span>
                              {dropdownItem.comingSoon && (
                                <span className="text-xs bg-yellow-400 text-blue-900 px-1 py-0.5 rounded font-bold">
                                  Soon
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </li>
                  );
                }

                // Regular navigation items (no dropdown)
                return (
                  <li key={item.name}>
                    <Link
                      href={href || item.path}
                      className={`block transition-colors text-white relative py-2 ${
                        isActive(item.path) ? 'text-yellow-300 font-medium' : 'hover:text-yellow-200'
                      }`}
                      onClick={handleMobileMenuClose}
                    >
                      {item.name}
                      {item.comingSoon && (
                        <span className="ml-2 text-xs bg-yellow-400 text-blue-900 px-2 py-1 rounded-full font-bold">
                          Coming Soon
                        </span>
                      )}
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
                        handleMobileMenuClose();
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