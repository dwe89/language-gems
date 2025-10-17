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
      {/* Use a relative wrapper so we can absolutely position the logo and auth to the viewport edges
          while keeping the main nav centered in a constrained container. */}
      <div className="relative w-screen">
        {/* Logo - absolutely positioned far left */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 pl-2 md:pl-4">
          <Link
            href={(isMounted && user) ? "/account" : "/"}
            className="font-bold text-xl md:text-2xl text-white flex items-center group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="mr-1 md:mr-2"
            >
              <Gem className="h-6 w-6 md:h-8 md:w-8 text-yellow-300" />
            </motion.div>
            <span className="text-yellow-300">Language<span className="text-white">Gems</span></span>
          </Link>
        </div>

        {/* Centered nav in a constrained container with padding to avoid overlap */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center lg:px-44 xl:px-48">
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7" ref={dropdownRef}>
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
                    className={`transition-colors font-medium hover:text-yellow-200 relative ${
                      item.featured
                        ? 'text-yellow-300 font-bold px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20'
                        : 'text-white'
                    } ${
                      isActive(item.path) ? 'text-yellow-300 font-bold' : ''
                    }`}
                    title={item.description}
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
          </div>
        </div>

        {/* Auth Buttons - absolutely positioned far right */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 pr-2 md:pr-4">
          {/* Desktop auth controls - only show on large screens */}
          <div className="hidden lg:flex items-center space-x-3">
            {(isMounted && user) ? (
              <>
                <SmartAuthButtons />
                <button
                  onClick={handleLogout}
                  className="py-2 px-6 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-blue-800 rounded-full font-medium transition-all active:scale-95 shadow-sm active:shadow-inner flex items-center"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <SmartAuthButtons />
            )}
          </div>

          {/* Mobile Menu Button - visible on tablets and smaller */}
          <div className="lg:hidden">
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
      </div>

      {/* Mobile Navigation - show on tablets and smaller */}
      {mobileMenuOpen && (
        <nav className="lg:hidden mt-4 py-4 border-t border-blue-700">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => {
              const href = item.comingSoon ? item.comingSoonPath : item.path;
              const hasDropdown = item.hasDropdown && item.dropdownItems;

              // For mobile, show all items as a flat list - no dropdowns
              if (hasDropdown) {
                return (
                  <li key={item.name}>
                    {/* Main category header (non-clickable for mobile) */}
                    <div className="text-yellow-300 font-semibold text-sm uppercase tracking-wide py-2 px-4">
                      {item.name}
                    </div>

                    {item.dropdownItems?.map((dropdownItem) => (
                      <a
                        key={dropdownItem.name}
                        href={dropdownItem.comingSoon ? '/coming-soon' : dropdownItem.path}
                        className="block px-4 py-2 rounded-lg hover:bg-blue-800/50 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(dropdownItem.comingSoon ? '/coming-soon' : dropdownItem.path);
                          handleMobileMenuClose();
                        }}
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </li>
                );
              }

              return (
                <li key={item.name}>
                  <a
                    href={href || item.path}
                    className="block px-4 py-2 rounded-lg hover:bg-blue-800/50 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(href || item.path);
                      handleMobileMenuClose();
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile Auth Buttons */}
          <div className="mt-6 px-4 pt-4 border-t border-blue-700">
            {(isMounted && user) ? (
              <div className="space-y-3">
                <SmartAuthButtons variant="mobile" />
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-blue-900 rounded-full font-bold transition-all active:scale-95 shadow-md active:shadow-inner flex items-center justify-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <SmartAuthButtons variant="mobile" />
            )}
          </div>
        </nav>
      )}

      {/* Keep rest of header structure intact */}
    </header>
  );
}