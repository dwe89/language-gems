'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import { Inter, Montserrat } from "next/font/google";
import {
  BookOpen, Edit, Hexagon,
  Menu, LogOut, Gem
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

export default function AssessmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut, hasSubscription, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isStudentSubdomain, setIsStudentSubdomain] = useState(false);
  const router = useRouter();
  
  // Handle hydration and subdomain detection
  useEffect(() => {
    setIsHydrated(true);
    // Check if we're on the student subdomain
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsStudentSubdomain(hostname.startsWith('students.'));
    }
  }, []);
  
  // If not hydrated yet, just return children to avoid any potential issues
  if (!isHydrated) {
    return <>{children}</>;
  }
  
  // If not on student subdomain, render children without layout
  if (!isStudentSubdomain) {
    return <>{children}</>;
  }
  
  // Show loading while auth is loading (only for student subdomain after hydration)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading assessments...</p>
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
            
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-2 flex-grow justify-center">
              <NavLink icon={<BookOpen className="h-5 w-5" />} label="Assignments" href="/student-dashboard/assignments" />
              <NavLink icon={<Hexagon className="h-5 w-5" />} label="Games" href="/student-dashboard/games" />
              <NavLink icon={<Edit className="h-5 w-5" />} label="Assessments" href="/assessments" />
            </nav>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 border-l pl-4 border-indigo-600">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm font-medium text-white">{username}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-indigo-700/50 hover:bg-indigo-600/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
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
              <div className="grid grid-cols-1 gap-2">
                <NavLink icon={<BookOpen className="h-5 w-5" />} label="Assignments" href="/student-dashboard/assignments" />
                <NavLink icon={<Hexagon className="h-5 w-5" />} label="Games" href="/student-dashboard/games" />
                <NavLink icon={<Edit className="h-5 w-5" />} label="Assessments" href="/assessments" />
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-700">
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
        {/* Preview Mode Banner for Teachers */}
        {isHydrated && user?.user_metadata?.role === 'teacher' && new URLSearchParams(window.location.search).get('preview') === 'true' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-5 h-5 text-yellow-600 mr-2">👨‍🏫</div>
                <div>
                  <p className="font-medium">Teacher Preview Mode</p>
                  <p className="text-sm">You are viewing this assessment as your students would see it.</p>
                </div>
              </div>
              <Link 
                href="/dashboard/assignments"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Back to Teacher Dashboard
              </Link>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
