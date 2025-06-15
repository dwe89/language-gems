'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import { Inter, Montserrat, Roboto } from "next/font/google";
import { 
  BookOpen, PenTool, BarChart2, Upload, Trophy, 
  ChevronDown, Menu, PieChart, User,
  Settings, LogOut, UserCircle, Gamepad2, Home, Users, FileText
} from 'lucide-react';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  
  return (
    <Link 
      href={href}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function DropdownMenu({ 
  label, 
  icon, 
  items, 
  isActive 
}: { 
  label: string; 
  icon: React.ReactNode; 
  items: { href: string; label: string; icon: React.ReactNode }[];
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        {icon}
        <span>{label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-xl shadow-lg bg-white/95 backdrop-blur-lg border border-slate-200 py-2 z-50">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-4 h-4 mr-3 text-slate-500">{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("DashboardLayout rendering");
  const { user, signOut, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Add check for student role and redirect
  useEffect(() => {
    // Only check role if user is loaded and not currently loading
    if (!isLoading && user && user.user_metadata?.role === 'student') {
      console.log('Student accessing teacher dashboard, redirecting to student dashboard');
      router.push('/student-dashboard');
    }
  }, [user, router, isLoading]);
  
  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Always render the dashboard layout once loading is complete
  const username = user?.user_metadata?.name || user?.email || 'Teacher';
  
  const handleSignOut = async () => {
    await signOut();
    // Force redirect to homepage
    window.location.href = '/';
  };

  // Check which section is currently active
  const isDashboardActive = pathname === '/dashboard';
  const isClassesActive = !!(pathname?.startsWith('/dashboard/classes') || pathname?.startsWith('/dashboard/assignments') || pathname?.startsWith('/dashboard/progress'));
  const isReportsActive = !!(pathname?.startsWith('/dashboard/reports') || pathname?.startsWith('/dashboard/leaderboards'));
  const isContentActive = !!(pathname?.startsWith('/dashboard/content') || pathname?.startsWith('/dashboard/games'));
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 ${montserrat.variable} ${roboto.variable}`}>
      {/* Modern Dashboard Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                  <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 4L8 18V46L32 60L56 46V18L32 4Z" fill="#FFFFFF" fillOpacity="0.9"/>
                    <path d="M32 4L56 18L32 32L8 18L32 4Z" fill="#FFFFFF"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Teacher Dashboard</h1>
                </div>
              </Link>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink 
                icon={<Home className="h-4 w-4" />} 
                label="Dashboard" 
                href="/dashboard" 
              />
              
              <DropdownMenu
                label="Classes"
                icon={<BookOpen className="h-4 w-4" />}
                isActive={isClassesActive}
                items={[
                  { href: '/dashboard/classes', label: 'My Classes', icon: <Users className="h-4 w-4" /> },
                  { href: '/dashboard/assignments', label: 'Assignments', icon: <PenTool className="h-4 w-4" /> },
                  { href: '/dashboard/progress', label: 'Progress Tracking', icon: <BarChart2 className="h-4 w-4" /> },
                ]}
              />
              
              <DropdownMenu
                label="Reports"
                icon={<PieChart className="h-4 w-4" />}
                isActive={isReportsActive}
                items={[
                  { href: '/dashboard/leaderboards', label: 'Leaderboards', icon: <Trophy className="h-4 w-4" /> },
                  { href: '/dashboard/reports', label: 'Student Reports', icon: <FileText className="h-4 w-4" /> },
                ]}
              />
              
              <DropdownMenu
                label="Content"
                icon={<Upload className="h-4 w-4" />}
                isActive={isContentActive}
                items={[
                  { href: '/dashboard/games', label: 'Games', icon: <Gamepad2 className="h-4 w-4" /> },
                  { href: '/dashboard/content', label: 'Custom Content', icon: <Upload className="h-4 w-4" /> },
                ]}
              />
            </nav>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5 text-slate-600" />
              </button>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-slate-700">{username}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserCircle className="h-5 w-5 text-white" />
                  </div>
                </button>
                
                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="text-sm font-medium text-slate-900">{username}</div>
                      <div className="text-sm text-slate-500">{user?.email}</div>
                    </div>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-slate-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg">
            <div className="px-6 py-4 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-700">Dashboard</span>
              </Link>
              <Link
                href="/dashboard/classes"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-700">Classes</span>
              </Link>
              <Link
                href="/dashboard/assignments"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PenTool className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-700">Assignments</span>
              </Link>
              <Link
                href="/dashboard/leaderboards"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Trophy className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-700">Leaderboards</span>
              </Link>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}