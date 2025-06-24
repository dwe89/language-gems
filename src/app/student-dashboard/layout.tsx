'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import { Inter, Montserrat } from "next/font/google";
import { 
  BookOpen, Award, BarChart2, Edit, Hexagon, 
  Bell, ChevronDown, Search, Menu, UserCircle, 
  Settings, LogOut, Gem
} from 'lucide-react';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  
  return (
    <Link 
      href={href}
      className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-colors ${
        isActive 
          ? 'bg-indigo-600 text-white' 
          : 'text-indigo-100 hover:bg-indigo-600/50 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut, hasSubscription, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();
  
  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Add check for teacher/admin role and redirect
  useEffect(() => {
    // Check if user data is loaded and the user is a teacher or admin
    if (user && (user.user_metadata?.role === 'teacher' || user.user_metadata?.role === 'admin')) {
      console.log('Teacher or admin accessing student dashboard, redirecting to teacher dashboard');
      router.push('/account');
    }
  }, [user, router]);

  // Check if we should redirect to preview in production
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isPreviewPage = window.location.pathname === '/student-dashboard/preview';
    
    // In production, redirect to preview unless user has subscription or is already on preview page
    if (isProduction && !hasSubscription && !isLoading && !isPreviewPage) {
      setShouldRedirect(true);
      router.push('/student-dashboard/preview');
      return;
    }
  }, [hasSubscription, isLoading, router]);

  // Show loading while checking redirect
  if (shouldRedirect || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Get username from user data - only show after hydration to prevent mismatch
  const username = isHydrated ? (user?.user_metadata?.name || user?.email || 'Student') : 'Student';
  
  const handleSignOut = async () => {
    await signOut();
    // Force redirect to homepage
    window.location.href = '/';
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 ${montserrat.variable}`}>
      {/* Dashboard Top Navigation Bar */}
      <header className="bg-indigo-800 text-white py-3 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <Link href="/student-dashboard">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Gem className="h-5 w-5 text-white" />
                </div>
              </Link>
              <h1 className="text-xl font-montserrat font-bold">LanguageGems Dashboard</h1>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:block flex-grow max-w-xl mx-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search games, lessons, and more..." 
                  className="w-full bg-indigo-700/50 border border-indigo-600 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-indigo-300" />
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-2">
              <NavLink icon={<BookOpen className="h-5 w-5" />} label="Assignments" href="/student-dashboard/assignments" />
              <NavLink icon={<Hexagon className="h-5 w-5" />} label="Games" href="/student-dashboard/games" />
              <NavLink icon={<BarChart2 className="h-5 w-5" />} label="Progress" href="/student-dashboard/progress" />
              <NavLink icon={<Edit className="h-5 w-5" />} label="Exam Prep" href="/student-dashboard/exam-prep" />
            </nav>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="text-indigo-200 hover:text-white">
                <Bell className="h-5 w-5" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 border-l pl-4 border-indigo-600 text-indigo-200 hover:text-white"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{username}</span>
                  <ChevronDown className={`h-4 w-4 text-indigo-300 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      href="/student-dashboard/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      href="/student-dashboard/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setUserMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <button 
                className="lg:hidden text-indigo-200 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pt-4 border-t border-indigo-700">
              <div className="grid grid-cols-2 gap-2">
                <NavLink icon={<BookOpen className="h-5 w-5" />} label="Assignments" href="/student-dashboard/assignments" />
                <NavLink icon={<Hexagon className="h-5 w-5" />} label="Games" href="/student-dashboard/games" />
                <NavLink icon={<BarChart2 className="h-5 w-5" />} label="Progress" href="/student-dashboard/progress" />
                <NavLink icon={<Edit className="h-5 w-5" />} label="Exam Prep" href="/student-dashboard/exam-prep" />
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-700">
                <Link 
                  href="/student-dashboard/profile"
                  className="flex items-center py-2 px-3 rounded-md text-indigo-200 hover:bg-indigo-700/50 hover:text-white"
                >
                  <UserCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Profile</span>
                </Link>
                <Link 
                  href="/student-dashboard/settings"
                  className="flex items-center py-2 px-3 rounded-md text-indigo-200 hover:bg-indigo-700/50 hover:text-white"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  <span className="font-medium">Settings</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center py-2 px-3 rounded-md text-indigo-200 hover:bg-indigo-700/50 hover:text-white w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>
      
      {/* Page Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
} 