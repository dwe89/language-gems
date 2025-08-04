'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, ChevronUp, Bell, Search, 
  User, Settings, LogOut, Home, BookOpen, BarChart3,
  Trophy, Gem, Sun, Moon, Maximize2, Minimize2,
  Volume2, VolumeX, Wifi, WifiOff, Battery,
  Signal, Clock, Calendar
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../theme/ThemeProvider';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface ResponsiveStudentLayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onViewChange?: (view: string) => void;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

// =====================================================
// MOBILE MENU COMPONENT
// =====================================================

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  currentView, 
  onViewChange 
}) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, color: 'text-blue-500' },
    { id: 'assignments', label: 'Assignments', icon: BookOpen, color: 'text-green-500' },
    { id: 'progress', label: 'Progress', icon: BarChart3, color: 'text-purple-500' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'text-yellow-500' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-500' }
  ];

  const handleItemClick = (itemId: string) => {
    onViewChange(itemId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Gem className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 student-font-display">LanguageGems</h2>
                    <p className="text-xs text-gray-600">Student Portal</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate student-font-display">
                    {user?.user_metadata?.first_name || 'Student'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    Level 5 • 2,450 XP
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    currentView === item.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <item.icon className={`h-4 w-4 ${
                      currentView === item.id ? 'text-blue-600' : item.color
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <span className="font-medium student-font-display">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 student-font-display">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">Continue Assignment</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <Trophy className="h-4 w-4" />
                  <span className="font-medium">Daily Challenge</span>
                </button>
              </div>
            </div>

            {/* Settings & Theme */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="font-medium">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => signOut()}
                className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// =====================================================
// NOTIFICATION PANEL COMPONENT
// =====================================================

const NotificationPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationProps[];
}> = ({ isOpen, onClose, notifications }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Notification Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 student-font-display">
                  Notifications
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      notification.type === 'success' ? 'bg-green-50 border-green-400' :
                      notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      notification.type === 'error' ? 'bg-red-50 border-red-400' :
                      'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 student-font-display">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No notifications</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// =====================================================
// MAIN RESPONSIVE LAYOUT COMPONENT
// =====================================================

export default function ResponsiveStudentLayout({
  children,
  currentView = 'home',
  onViewChange = () => {}
}: ResponsiveStudentLayoutProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notifications] = useState<NotificationProps[]>([
    {
      id: '1',
      title: 'Assignment Due Soon',
      message: 'Spanish Vocabulary Quiz is due in 2 hours',
      type: 'warning',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Word Master" badge',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    }
  ]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentView]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 student-font-body">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Gem className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 student-font-display text-sm">
                LanguageGems
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <div className={`p-1.5 rounded-full ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setNotificationPanelOpen(true)}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 px-4 py-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments, games, progress..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentView={currentView}
        onViewChange={onViewChange}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        notifications={notifications}
      />

      {/* Main Content */}
      <main className="lg:hidden">
        <div className="px-4 py-6">
          {children}
        </div>
      </main>

      {/* Desktop Content (hidden on mobile) */}
      <div className="hidden lg:block">
        {children}
      </div>

      {/* Mobile Bottom Navigation (Optional) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-5 py-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'assignments', icon: BookOpen, label: 'Tasks' },
            { id: 'progress', icon: BarChart3, label: 'Progress' },
            { id: 'achievements', icon: Trophy, label: 'Awards' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative flex flex-col items-center py-2 px-1 ${
                currentView === item.id
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
}
