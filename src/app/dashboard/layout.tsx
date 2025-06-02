'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import { Inter, Montserrat, Roboto } from "next/font/google";
import { 
  BookOpen, PenTool, BarChart2, Upload, Trophy, 
  Bell, ChevronDown, Search, Menu, PieChart, User,
  Settings, LogOut, UserCircle, Gamepad2
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
      className={`flex items-center space-x-2 py-2 px-3 rounded-md transition-colors ${
        isActive 
          ? 'bg-teal-700 text-white' 
          : 'text-teal-200 hover:bg-teal-700/50 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("DashboardLayout rendering");
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Add check for student role and redirect
  useEffect(() => {
    // Check if user data is loaded and the user is a student
    if (user && user.user_metadata?.role === 'student') {
      console.log('Student accessing teacher dashboard, redirecting to student dashboard');
      router.push('/student-dashboard');
    }
  }, [user, router]);
  
  // Remove the conditional rendering that depends on user
  // Always render the dashboard layout
  const username = user?.user_metadata?.name || user?.email || 'Teacher';
  
  const handleSignOut = async () => {
    await signOut();
    // Force redirect to homepage
    window.location.href = '/';
  };
  
  return (
    <div className={`min-h-screen ${montserrat.variable} ${roboto.variable}`}>
      {/* Dashboard Top Navigation Bar */}
      <header className="bg-teal-800 text-white py-3 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 4L8 18V46L32 60L56 46V18L32 4Z" fill="#4FD1C5" stroke="#FFFFFF" strokeWidth="2"/>
                    <path d="M32 4L56 18L32 32L8 18L32 4Z" fill="#5EEAD4" stroke="#FFFFFF" strokeWidth="2"/>
                  </svg>
                </div>
              </Link>
              <h1 className="text-xl font-montserrat font-bold">Teacher Dashboard</h1>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:block flex-grow max-w-xl mx-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search students, lessons, or vocab..." 
                  className="w-full bg-teal-700/50 border border-teal-600 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-teal-300" />
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-2">
              <NavLink icon={<BookOpen className="h-5 w-5" />} label="Classes" href="/dashboard/classes" />
              <NavLink icon={<PenTool className="h-5 w-5" />} label="Assignments" href="/dashboard/assignments" />
              <NavLink icon={<BarChart2 className="h-5 w-5" />} label="Progress" href="/dashboard/progress" />
              <NavLink icon={<Upload className="h-5 w-5" />} label="Content" href="/dashboard/content" />
              <NavLink icon={<Gamepad2 className="h-5 w-5" />} label="Games" href="/dashboard/games" />
              <NavLink icon={<Trophy className="h-5 w-5" />} label="Leaderboards" href="/dashboard/leaderboards" />
              <NavLink icon={<PieChart className="h-5 w-5" />} label="Reports" href="/dashboard/reports" />
            </nav>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="text-teal-200 hover:text-white">
                <Bell className="h-5 w-5" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 border-l pl-4 border-teal-600 text-teal-200 hover:text-white"
                >
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{username}</span>
                  <ChevronDown className={`h-4 w-4 text-teal-300 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      href="/dashboard/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      href="/dashboard/settings" 
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
                className="lg:hidden text-teal-200 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pt-4 border-t border-teal-700">
              <div className="grid grid-cols-2 gap-2">
                <NavLink icon={<BookOpen className="h-5 w-5" />} label="Classes" href="/dashboard/classes" />
                <NavLink icon={<PenTool className="h-5 w-5" />} label="Assignments" href="/dashboard/assignments" />
                <NavLink icon={<BarChart2 className="h-5 w-5" />} label="Progress" href="/dashboard/progress" />
                <NavLink icon={<Upload className="h-5 w-5" />} label="Content" href="/dashboard/content" />
                <NavLink icon={<Gamepad2 className="h-5 w-5" />} label="Games" href="/dashboard/games" />
                <NavLink icon={<Trophy className="h-5 w-5" />} label="Leaderboards" href="/dashboard/leaderboards" />
                <NavLink icon={<PieChart className="h-5 w-5" />} label="Reports" href="/dashboard/reports" />
              </div>
              <div className="mt-4 pt-4 border-t border-teal-700">
                <Link 
                  href="/dashboard/profile"
                  className="flex items-center py-2 px-3 rounded-md text-teal-200 hover:bg-teal-700/50 hover:text-white"
                >
                  <UserCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Profile</span>
                </Link>
                <Link 
                  href="/dashboard/settings"
                  className="flex items-center py-2 px-3 rounded-md text-teal-200 hover:bg-teal-700/50 hover:text-white"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  <span className="font-medium">Settings</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center py-2 px-3 rounded-md text-teal-200 hover:bg-teal-700/50 hover:text-white w-full text-left"
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
      <main>
        {children}
      </main>
    </div>
  );
} 