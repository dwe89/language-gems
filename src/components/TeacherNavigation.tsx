'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from './auth/AuthProvider';
import {
  BookOpen,
  Users,
  FileText,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
  BarChart3,
  Brain,
  Gem
} from 'lucide-react';

interface TeacherNavigationProps {
  children?: React.ReactNode;
}

export default function TeacherNavigation({ children }: TeacherNavigationProps) {
  const { signOut, user, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Define navigation menu items
  const baseMenuItems = [
    {
      name: 'Analytics',
      href: '/dashboard/progress',
      icon: BarChart3,
      description: 'AI-powered insights and student performance tracking'
    },
    {
      name: 'Classes',
      href: '/dashboard/classes',
      icon: BookOpen,
      description: 'Manage your classes and students'
    },
    {
      name: 'Assignments',
      href: '/dashboard/assignments',
      icon: Users,
      description: 'Create and track assignments'
    },
    {
      name: 'Vocabulary',
      href: '/dashboard/vocabulary/analytics',
      icon: Brain,
      description: 'Vocabulary analytics and student progress'
    },
  ];

  // Add admin-only items
  const menuItems = [
    ...baseMenuItems,
    ...(isAdmin || user?.email === 'danieletienne89@gmail.com' ? [{
      name: 'Worksheets',
      href: '/worksheets',
      icon: FileText,
      description: 'AI-powered worksheet generator'
    }] : [])
  ];

  // Handle navigation link clicks
  const handleNavClick = (item: typeof menuItems[0]) => {
    router.push(item.href);
  };

  // Handle user sign out
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-blue-800 shadow-sm border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Back to Site Link */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-200 hover:text-white text-sm transition-colors">
                ← Back to Site
              </Link>
              <Link href="/dashboard" className="flex items-center space-x-2 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <Gem className="h-5 w-5 text-yellow-300" />
                </motion.div>
                <div>
                  <span className="text-xl font-bold text-white">
                    Language<span className="text-yellow-300">Gems</span>
                  </span>
                  <div className="text-xs text-blue-200">Teacher Portal</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href || (pathname && pathname.startsWith(item.href + '/'));

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-200 hover:text-white hover:bg-blue-700'
                    }`}
                    title={item.description}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* User Profile and settings (Desktop) */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-blue-200 hover:text-white transition-colors"
                >
                  <span className="font-medium mr-2">Settings</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => { router.push('/account'); setIsDropdownOpen(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-800 border-t border-blue-900">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href || (pathname && pathname.startsWith(item.href + '/'));

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavClick(item);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-200 hover:text-white hover:bg-blue-700'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-3" />
                    {item.name}
                  </button>
                );
              })}
              {/* Mobile settings and sign out */}
              <div className="border-t border-blue-700 pt-2 mt-2 space-y-1">
                <button
                  onClick={() => { router.push('/account'); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Account
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-300 hover:text-white hover:bg-red-600 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
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
