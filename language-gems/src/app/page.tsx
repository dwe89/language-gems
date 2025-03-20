import Link from 'next/link';
import Image from 'next/image';
import Footer from 'gems/components/layout/Footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <div className="relative w-full flex flex-col items-center justify-center py-20 px-4 text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
            Language<br />Gems
          </h1>

          {/* Treasure Chest with Gems */}
          <div className="relative w-full h-64 md:h-96 mb-8">
            {/* Placeholder for the treasure chest image */}
            <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl w-full h-full flex items-center justify-center">
              <div className="relative">
                {/* Treasure chest placeholder */}
                <div className="w-40 h-32 md:w-64 md:h-48 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-xl relative">
                  <div className="absolute w-full h-1/2 bottom-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-xl">
                    <div className="absolute inset-x-0 top-0 h-2 bg-yellow-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 shadow-lg shadow-cyan-400/50"></div>
                    </div>
                  </div>
                </div>
                
                {/* Gems */}
                <div className="absolute -top-12 -left-12 w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-md rotate-45 shadow-lg shadow-pink-400/50"></div>
                <div className="absolute -top-8 -right-8 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-md rotate-12 shadow-lg shadow-emerald-400/50"></div>
                <div className="absolute -bottom-12 left-0 w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-md rotate-[30deg] shadow-lg shadow-purple-400/50"></div>
                <div className="absolute -bottom-8 right-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md rotate-[15deg] shadow-lg shadow-amber-400/50"></div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="gem-glow inline-block">
            <button className="gem-button text-xl px-10 py-4 z-10 relative">
              Choose your language
            </button>
          </div>
        </div>
      </div>

      {/* Language Options */}
      <div className="w-full bg-indigo-900/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'].map((lang) => (
              <Link 
                key={lang} 
                href={`/learn/${lang.toLowerCase()}`}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
              >
                <span className="text-white font-bold">{lang}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Choose your Language</h3>
              <p className="text-gray-300">Start your language learning journey by selecting from multiple languages.</p>
            </div>
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-pink-300">Play & Learn</h3>
              <p className="text-gray-300">Engage with interactive exercises that make learning fun and effective.</p>
            </div>
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-amber-300">Earn Rewards</h3>
              <p className="text-gray-300">Collect gems and unlock achievements as you progress in your studies.</p>
            </div>
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-emerald-300">Track Progress</h3>
              <p className="text-gray-300">Monitor your learning journey with detailed progress tracking.</p>
            </div>
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-purple-300">School Dashboard</h3>
              <p className="text-gray-300">Teachers can track student progress and assign custom vocabulary lists.</p>
            </div>
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-blue-300">For Schools</h3>
              <p className="text-gray-300">Special features designed for classroom use and educational institutions.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
