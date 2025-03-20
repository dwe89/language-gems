import Link from 'next/link';
import Navigation from 'gems/components/layout/Navigation';
import Footer from 'gems/components/layout/Footer';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Dashboard</h1>
          <p className="text-gray-300">Track your progress and continue learning</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Stats Card */}
          <div className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-cyan-300">Your Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Words Learned</span>
                <span className="text-white font-bold">128</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Streak</span>
                <span className="text-white font-bold">7 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Gems Collected</span>
                <span className="text-white font-bold">245</span>
              </div>
            </div>
          </div>
          
          {/* Recent Languages Card */}
          <div className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-pink-300">Recent Languages</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SP</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-medium">Spanish</h3>
                  <p className="text-gray-400 text-sm">Last practiced 2 days ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FR</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-medium">French</h3>
                  <p className="text-gray-400 text-sm">Last practiced 5 days ago</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/languages" className="text-cyan-300 hover:underline">
                Browse all languages →
              </Link>
            </div>
          </div>
          
          {/* Continue Learning Card */}
          <div className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-amber-300">Continue Learning</h2>
            <div className="bg-indigo-800/50 p-4 rounded-md">
              <h3 className="text-white font-medium mb-2">Spanish - Food & Dining</h3>
              <div className="w-full bg-gray-700 h-2 rounded-full mb-2">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-gray-400 text-sm mb-4">65% Complete</p>
              <Link 
                href="/learn/spanish/food-dining" 
                className="block text-center py-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-md text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-colors"
              >
                Continue
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 