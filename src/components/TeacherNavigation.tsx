'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './auth/AuthProvider';
import { supabaseBrowser } from './auth/AuthProvider';
import { 
  Home, 
  BookOpen, 
  Users, 
  ShoppingBag, 
  User, 
  History,
  Crown,
  Lock,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';

interface TeacherNavigationProps {
  children?: React.ReactNode;
}

export default function TeacherNavigation({ children }: TeacherNavigationProps) {
  const { user, signOut, hasSubscription, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      premium: false,
      description: 'Overview and quick stats'
    },
    {
      name: 'Classes',
      href: '/dashboard/classes',
      icon: BookOpen,
      premium: true,
      description: 'Manage your classes and students'
    },
    {
      name: 'Assignments',
      href: '/dashboard/assignments',
      icon: Users,
      premium: true,
      description: 'Create and track assignments'
    },
  ];

  const handleNavClick = (item: typeof menuItems[0]) => {
    if (item.premium && !hasSubscription) {
      router.push('/account/upgrade');
      return;
    }
    router.push(item.href);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-slate-500 hover:text-slate-700 text-sm">
                ← Back to Site
              </Link>
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">LanguageGems Dashboard</span>
                {!hasSubscription && (
                  <span className="ml-2 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    Free
                  </span>
                )}
                {hasSubscription && (
                  <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full flex items-center">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href || (pathname && pathname.startsWith(item.href + '/'));
                const isLocked = item.premium && !hasSubscription;

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : isLocked
                        ? 'text-slate-400 hover:text-slate-500'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={isLocked ? 'Premium feature - Upgrade to access' : item.description}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {item.name}
                    {isLocked && <Lock className="h-3 w-3 ml-1" />}
                  </button>
                );
              })}

              {/* Upgrade Button */}
              {!hasSubscription && (
                <Link
                  href="/account/upgrade"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade
                </Link>
              )}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4 ml-1 text-slate-400" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-slate-500 border-b">
                        {user?.email}
                      </div>
                      <Link
                        href="/account/settings"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href || (pathname && pathname.startsWith(item.href + '/'));
                const isLocked = item.premium && !hasSubscription;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavClick(item);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      (pathname === item.href || (pathname && pathname.startsWith(item.href + '/')))
                        ? 'bg-indigo-100 text-indigo-700'
                        : isLocked
                        ? 'text-slate-400'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {item.name}
                    {isLocked && <Lock className="h-3 w-3 ml-auto" />}
                  </button>
                );
              })}

              {!hasSubscription && (
                <Link
                  href="/account/upgrade"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium"
                >
                  <Crown className="h-4 w-4 mr-3" />
                  Upgrade to Premium
                </Link>
              )}

              <div className="border-t border-slate-200 pt-3">
                <div className="px-3 py-2 text-xs text-slate-500">
                  {user?.email}
                </div>
                <Link
                  href="/account/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
} 