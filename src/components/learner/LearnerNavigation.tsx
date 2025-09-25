'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';
import {
  Home,
  BookOpen,
  Gamepad2,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Gem,
  Star,
  Zap,
  Target,
  Trophy,
  Settings
} from 'lucide-react';

export default function LearnerNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, signOut } = useAuth();

  // Navigation items for independent learners (no class/assignment dependencies)
  const navItems = [
    {
      name: 'Dashboard',
      href: '/learner-dashboard',
      icon: Home,
      description: 'Your learning overview'
    },
    {
      name: 'Games',
      href: '/games',
      icon: Gamepad2,
      description: 'Interactive learning games'
    },
    {
      name: 'Vocabulary',
      href: '/learner-dashboard/vocabulary',
      icon: BookOpen,
      description: 'Word lists and practice'
    },
    {
      name: 'Progress',
      href: '/learner-dashboard/progress',
      icon: BarChart3,
      description: 'Track your learning'
    },
    {
      name: 'Challenges',
      href: '/learner-dashboard/challenges',
      icon: Target,
      description: 'Daily and weekly challenges'
    }
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/learner-dashboard' && pathname === '/learner-dashboard') return true;
    if (path !== '/learner-dashboard' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/learn');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/learner-dashboard" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Gem className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <span className="text-xl font-bold text-white">
                Language<span className="text-yellow-300">Gems</span>
              </span>
              <div className="text-xs text-purple-200">Learner Portal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* User Stats (Desktop) */}
                <div className="hidden lg:flex items-center space-x-4 bg-white/20 rounded-full px-4 py-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-300" />
                    <span className="text-white font-semibold text-sm">Level 1</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-blue-300" />
                    <span className="text-white font-semibold text-sm">0 XP</span>
                  </div>
                </div>

                {/* User Menu Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-2 hover:bg-white/30 transition-colors">
                    <User className="h-5 w-5 text-white" />
                    <span className="hidden sm:block text-white text-sm font-medium">
                      {user.user_metadata?.name || user.email?.split('@')[0] || 'Learner'}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/learner-dashboard/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-purple-500/30 py-4"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-purple-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-purple-200">{item.description}</div>
                  </div>
                </Link>
              ))}
              
              {/* Mobile User Stats */}
              {user && (
                <div className="px-4 py-3 border-t border-purple-500/30 mt-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-300" />
                      <span className="text-sm">Level 1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-300" />
                      <span className="text-sm">0 XP</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-green-300" />
                      <span className="text-sm">0 Streak</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
