'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import Link from 'next/link';
import { 
  Search, Bell, User as UserIcon, Menu, ChevronDown, ChevronRight,
  BookOpen, PenTool, BarChart2, Upload, Trophy, GraduationCap,
  Users, CheckCircle, Plus, Play, Award, Book, Zap, Clock, Calendar,
  Globe, MessageCircle, PieChart
} from 'lucide-react';

export default function DashboardPage() {
  console.log("DashboardPage component started rendering");
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false); // Set initial loading to false
  
  useEffect(() => {
    console.log('User in dashboard:', {
      id: user?.id,
      email: user?.email,
      metadata: user?.user_metadata,
      role: user?.user_metadata?.role,
      isLoading: loading,
      authLoading
    });
  }, [user, loading, authLoading]);
  
  console.log("Before rendering decision, states:", { authLoading, loading });
  
  // Force render the dashboard regardless of loading state
  // Comment out loading checks for now
  /*
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  */

  // Always render Teacher Dashboard for now
  console.log("Rendering TeacherDashboard");
  return <TeacherDashboard username={user?.user_metadata?.name || 'Teacher'} />;
}

function TeacherDashboard({ username = 'Ms. Carter' }: { username?: string }) {
  console.log("TeacherDashboard rendering with username:", username);
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100">
      {/* Remove Top Navigation Bar since it's in the layout now */}
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8 bg-gradient-to-r from-teal-600 to-rose-400 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-1">
              Welcome, {username}! <span className="hidden sm:inline">Let's Spark Language Learning Today!</span>
            </h2>
            <div className="w-24 h-1 bg-coral-400 mb-6"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard 
                icon={<Users className="h-5 w-5" />} 
                label="Active Students" 
                value="42" 
                bgColor="bg-emerald-500/80"
              />
              <StatCard 
                icon={<PenTool className="h-5 w-5" />} 
                label="Active Assignments" 
                value="5" 
                bgColor="bg-rose-400/80"
              />
              <StatCard 
                icon={<CheckCircle className="h-5 w-5" />} 
                label="Avg. Completion Rate" 
                value="78%" 
                bgColor="bg-amber-400/80"
              />
            </div>
            
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg shadow flex items-center transition-all duration-300 transform hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Create New Class
            </button>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-4 right-4 opacity-10">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 40H170L150 160H50L30 40Z" stroke="white" strokeWidth="4"/>
              <path d="M60 20L70 40M140 20L130 40" stroke="white" strokeWidth="4"/>
              <circle cx="100" cy="100" r="30" stroke="white" strokeWidth="4"/>
              <path d="M70 100H130M100 70V130" stroke="white" strokeWidth="4"/>
            </svg>
          </div>
        </section>
        
        {/* Main Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Row 1 */}
          <DashboardCard 
            title="Manage Classes & Students"
            description="Add students, generate logins, and view rosters"
            icon={<BookOpen className="h-8 w-8 text-emerald-600" />}
            buttonText="View Classes"
            buttonColor="bg-emerald-500 hover:bg-emerald-600"
            imageSrc="/classes-illustration.svg"
            href="/dashboard/classes"
          />
          
          <DashboardCard 
            title="Create & Assign Tasks"
            description="Set vocab games, grammar exercises, or exam prep"
            icon={<PenTool className="h-8 w-8 text-rose-500" />}
            buttonText="New Assignment"
            buttonColor="bg-rose-500 hover:bg-rose-600"
            imageSrc="/assignments-illustration.svg"
            href="/dashboard/assignments/new"
          />
          
          <DashboardCard 
            title="Track Student Progress"
            description="See scores, time spent, and skill mastery"
            icon={<BarChart2 className="h-8 w-8 text-amber-500" />}
            buttonText="View Reports"
            buttonColor="bg-amber-500 hover:bg-amber-600"
            imageSrc="/progress-illustration.svg"
            href="/dashboard/progress"
          />
          
          {/* Row 2 */}
          <DashboardCard 
            title="Create Custom Games"
            description="Upload your vocab to generate games and worksheets"
            icon={<Upload className="h-8 w-8 text-purple-500" />}
            buttonText="Upload Vocab"
            buttonColor="bg-purple-500 hover:bg-purple-600"
            imageSrc="/custom-content-illustration.svg"
            href="/dashboard/content/create"
          />
          
          <DashboardCard 
            title="View Student Leaderboards"
            description="See top performing students and class rankings"
            icon={<Trophy className="h-8 w-8 text-teal-500" />}
            buttonText="View Leaderboards"
            buttonColor="bg-teal-500 hover:bg-teal-600"
            imageSrc="/leaderboards-illustration.svg"
            href="/dashboard/leaderboards"
          />
          
          <DashboardCard 
            title="Generate Reports & Analytics"
            description="Get detailed insights into student performance"
            icon={<PieChart className="h-8 w-8 text-indigo-500" />}
            buttonText="View Reports"
            buttonColor="bg-indigo-500 hover:bg-indigo-600"
            imageSrc="/reports-illustration.svg"
            href="/dashboard/reports"
          />
          
          {/* Row 3 - New Sections */}
          <DashboardCard 
            title="Teacher Resource Library"
            description="Access worksheets, lesson plans, and more"
            icon={<Book className="h-8 w-8 text-emerald-600" />}
            buttonText="Explore Resources"
            buttonColor="bg-emerald-500 hover:bg-emerald-600"
            imageSrc="/resource-library-illustration.svg"
            href="/dashboard/resources"
          />
          
          <DashboardCard 
            title="Professional Development"
            description="Grow your teaching skills with tips and tutorials"
            icon={<Award className="h-8 w-8 text-blue-600" />}
            buttonText="Learn More"
            buttonColor="bg-blue-500 hover:bg-blue-600"
            imageSrc="/professional-development-illustration.svg"
            href="/dashboard/professional-development"
          />
          
          <DashboardCard 
            title="Collaborate & Connect"
            description="Chat with colleagues and share resources"
            icon={<Users className="h-8 w-8 text-rose-500" />}
            buttonText="Start Chatting"
            buttonColor="bg-rose-500 hover:bg-rose-600"
            imageSrc="/collaboration-illustration.svg"
            href="/dashboard/collaborate"
          />
          
          {/* Row 4 - Additional New Sections */}
          <DashboardCard 
            title="Analytics & Insights"
            description="Dive deeper into your class's performance"
            icon={<BarChart2 className="h-8 w-8 text-purple-600" />}
            buttonText="View Insights"
            buttonColor="bg-purple-500 hover:bg-purple-600"
            imageSrc="/analytics-illustration.svg"
            href="/dashboard/analytics"
          />
          
          <DashboardCard 
            title="Cultural Exploration"
            description="Bring languages to life with cultural lessons"
            icon={<Globe className="h-8 w-8 text-amber-600" />}
            buttonText="Explore Culture"
            buttonColor="bg-amber-500 hover:bg-amber-600"
            imageSrc="/cultural-exploration-illustration.svg"
            href="/dashboard/cultural"
          />
        </section>
        
        {/* Support & Feedback Widget */}
        <div className="fixed bottom-6 left-6 bg-white rounded-lg shadow-lg border-2 border-blue-400 p-4 w-64 transform transition-transform hover:scale-105">
          <div className="flex items-center mb-3">
            <img 
              src="/feedback-support-illustration.svg" 
              alt="Support" 
              className="w-10 h-10 mr-3"
            />
            <div>
              <h3 className="font-montserrat font-bold text-gray-800">Need Help?</h3>
              <p className="text-xs text-gray-600">Chat with support or share feedback</p>
            </div>
          </div>
          
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded py-2 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Get Support
          </button>
        </div>
      </main>
    </div>
  );
}

function NavLink({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex items-center text-teal-200 hover:text-white">
      <span className="mr-1.5">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

function StatCard({ icon, label, value, bgColor }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string,
  bgColor: string
}) {
  return (
    <div className={`${bgColor} rounded-lg p-4 flex items-center shadow-sm`}>
      <div className="mr-3 bg-white/20 rounded-full p-2">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm opacity-90">{label}</div>
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  description, 
  icon, 
  buttonText, 
  buttonColor, 
  imageSrc,
  href
}: { 
  title: string, 
  description: string, 
  icon: React.ReactNode, 
  buttonText: string, 
  buttonColor: string,
  imageSrc: string,
  href: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] group">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-gray-100 rounded-full p-2 group-hover:animate-sparkle">
            {icon}
          </div>
          <h3 className="font-montserrat font-bold text-gray-800">{title}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <div className="flex justify-center mb-4 h-32 items-center">
          <img 
            src={imageSrc} 
            alt={title} 
            className="max-h-full max-w-full object-contain group-hover:animate-float"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/150x100?text=Image";
            }}
          />
        </div>
        
        <Link href={href} className={`block w-full ${buttonColor} text-white py-2 rounded-lg transition-colors text-center`}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

function StudentDashboard() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your progress and continue learning</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Streak</h2>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">7 days</div>
            <div className="text-sm text-gray-500">Keep going!</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <Book className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Vocabulary</h2>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">243</div>
            <div className="text-sm text-gray-500">Words learned</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-yellow-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">XP</h2>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">1,250</div>
            <div className="text-sm text-gray-500">Experience points</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-emerald-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Badges</h2>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">8</div>
            <div className="text-sm text-gray-500">Earned achievements</div>
            <Link href="/dashboard/achievements" className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View all badges <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignments */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Your Assignments</h2>
              <Link href="/dashboard/assignments" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View all</Link>
            </div>
            <div className="space-y-4">
              {/* Sample assignments */}
              {[
                { name: 'Spanish Vocabulary: Food', due: '2 days', progress: 75 },
                { name: 'Grammar Practice: Present Tense', due: '1 week', progress: 30 },
                { name: 'Listening Exercise: Dialogues', due: 'Tomorrow', progress: 10 },
              ].map((assignment, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{assignment.name}</h3>
                    <span className="text-sm font-medium text-yellow-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Due in {assignment.due}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full" 
                        style={{ width: `${assignment.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{assignment.progress}% complete</span>
                      <Link href={`/dashboard/assignments/${i}`} className="text-xs text-indigo-600 hover:text-indigo-800">Continue</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Continue Learning & Recommendations */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Continue Learning</h2>
            {[
              { name: 'Spanish Practice', description: 'Vocabulary Review', icon: BookOpen, color: 'text-red-600', bgColor: 'bg-red-100' },
              { name: 'Grammar Challenge', description: 'Test your skills', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
              { name: 'Pronunciation', description: 'Speaking exercise', icon: Book, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
            ].map((item, i) => (
              <Link key={i} href={`/exercises/${i}`} className="flex items-center p-3 rounded-md hover:bg-indigo-50 mb-2">
                <div className={`${item.bgColor} rounded-full p-2 mr-3`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </Link>
            ))}
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-medium text-gray-700 mb-3">Recommended for you</h3>
              <Link href="/games" className="block p-3 bg-indigo-50 hover:bg-indigo-100 rounded-md text-indigo-900 mb-2">
                <div className="font-medium">Memory Match Game</div>
                <div className="text-sm text-indigo-700">Practice vocabulary in a fun way</div>
              </Link>
              <Link href="/learn/common-phrases" className="block p-3 bg-indigo-50 hover:bg-indigo-100 rounded-md text-indigo-900">
                <div className="font-medium">Common Phrases</div>
                <div className="text-sm text-indigo-700">Essential travel expressions</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 