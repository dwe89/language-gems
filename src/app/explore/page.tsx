import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Explore LanguageGems | Features & Pricing',
  description: 'Discover all the features, games, and pricing options available on LanguageGems - the comprehensive language learning platform.',
};

export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Explore LanguageGems
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Discover everything LanguageGems has to offer - from interactive games to comprehensive learning tools and flexible pricing options.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            
            {/* Interactive Games */}
            <Link href="/games" className="group">
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🎮</div>
                <h3 className="text-2xl font-bold mb-4 text-pink-300">Interactive Games</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Engage with 15+ language learning games including Memory Game, Word Blast, Conjugation Duel, and more.
                </p>
                <div className="text-cyan-400 font-medium group-hover:text-cyan-300">
                  Explore Games →
                </div>
              </div>
            </Link>

            {/* Reading Assessments */}
            <Link href="/assessments" className="group">
              <div className="bg-gradient-to-br from-indigo-900/40 to-emerald-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
                <h3 className="text-2xl font-bold mb-4 text-emerald-300">Exam style Assessments</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Gain detailed insights into student strengths and weaknesses with timed assessments across all GCSE themes and question types.
                </p>
                <div className="text-amber-400 font-medium group-hover:text-amber-300">
                  Discover Assessment Insights →
                </div>
              </div>
            </Link>

            {/* For Schools */}
            <Link href="/schools" className="group">
              <div className="bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🏫</div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-300">For Schools</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Comprehensive educational solutions with classroom management, progress tracking, and custom curriculum.
                </p>
                <div className="text-pink-400 font-medium group-hover:text-pink-300">
                  Learn More →
                </div>
              </div>
            </Link>

            {/* School Pricing */}
            <Link href="/schools/pricing" className="group">
              <div className="bg-gradient-to-br from-indigo-900/40 to-amber-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-amber-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">💎</div>
                <h3 className="text-2xl font-bold mb-4 text-amber-300">Pricing Plans</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Flexible pricing for classrooms, schools, and districts. From $99/month with volume discounts available.
                </p>
                <div className="text-purple-400 font-medium group-hover:text-purple-300">
                  View Pricing →
                </div>
              </div>
            </Link>

            {/* Resources */}
            <Link href="/resources" className="group">
              <div className="bg-gradient-to-br from-indigo-900/40 to-green-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-green-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📚</div>
                <h3 className="text-2xl font-bold mb-4 text-green-300">Learning Resources</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Access worksheets, vocabulary lists, teaching materials, and educational guides.
                </p>
                <div className="text-cyan-400 font-medium group-hover:text-cyan-300">
                  Browse Resources →
                </div>
              </div>
            </Link>

            {/* Blog */}
            <Link href="/blog" className="group">
              <div className="bg-gradient-to-br from-indigo-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">✍️</div>
                <h3 className="text-2xl font-bold mb-4 text-pink-300">Blog & Insights</h3>
                <p className className="text-gray-300 leading-relaxed mb-4">
                  Read the latest in language learning research, teaching tips, and educational technology.
                </p>
                <div className="text-purple-400 font-medium group-hover:text-purple-300">
                  Read Blog →
                </div>
              </div>
            </Link>

            {/* About */}
            <Link href="/about" className="group">
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-indigo-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">💡</div>
                <h3 className="text-2xl font-bold mb-4 text-purple-300">About Us</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Learn about our mission to revolutionize language learning through innovative technology.
                </p>
                <div className="text-cyan-400 font-medium group-hover:text-cyan-300">
                  Our Story →
                </div>
              </div>
            </Link>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Whether you're an individual learner or an educational institution, we have the perfect solution for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/schools/pricing" className="gem-button pink-gem-button text-lg px-10 py-4">
                🏫 School Pricing
              </Link>
              <Link href="/games" className="gem-button purple-gem-button text-lg px-10 py-4">
                🎮 Try Games
              </Link>
              <Link href="/about" className="gem-button text-lg px-10 py-4">
                📖 Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
