'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Gamepad2,
  User,
  LogOut,
  Menu,
  X,
  Gem,
  Star,
  Zap,
  Home,
  Edit,
  Brain
} from 'lucide-react';

export default function StudentNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, signOut, isAdmin } = useAuth(); // Assuming 'user' object contains level and points

  // Navigation items for student dashboard
  const baseNavItems = [
    {
      name: 'Dashboard',
      href: '/student-dashboard',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      name: 'Assignments',
      href: '/student-dashboard/assignments',
      icon: BookOpen,
      description: 'Current and upcoming tasks'
    },
    {
      name: 'Games',
      href: '/games',
      icon: Gamepad2,
      description: 'Practice with fun games'
    },
    {
      name: 'Grammar',
      href: '/grammar',
      icon: Brain,
      description: 'Track your conjugation mastery'
    },
  ];

  // Add admin-only items
  const navItems = [
    ...baseNavItems,
    ...(isAdmin || user?.email === 'danieletienne89@gmail.com' ? [{
      name: 'Assessments',
      href: '/assessments',
      icon: Edit,
      description: 'Take practice assessments'
    }] : [])
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/student-dashboard' && pathname === '/student-dashboard') return true;
    if (path !== '/student-dashboard' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isMounted) {
    return null;
  }

  // Define default values or ensure user object has these properties
  // You'll need to adjust these based on the actual structure of your 'user' object
  const userLevel = user?.user_metadata?.level || 1; // Assuming 'level' is in user_metadata, default to 1
  const userPoints = user?.user_metadata?.points || 0; // Assuming 'points' is in user_metadata, default to 0

  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/student-dashboard"
            className="flex items-center space-x-3 group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Gem className="h-6 w-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">
                Language<span className="text-yellow-300">Gems</span>
              </h1>
              <p className="text-xs text-white/80">Student Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Points/Level Display */}
                <div className="hidden sm:flex items-center space-x-3 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-300" />
                    {/* Dynamically display user level */}
                    <span className="text-white font-semibold text-sm">Level {userLevel}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-blue-300" />
                    {/* Dynamically display user points */}
                    <span className="text-white font-semibold text-sm">{userPoints}</span>
                  </div>
                </div>

                {/* User Avatar & Logout */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/10 backdrop-blur-sm border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-white/60">{item.description}</div>
                    </div>
                  </Link>
                );
              })}

              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}