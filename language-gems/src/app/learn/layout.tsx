import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Language Learning | Language Gems',
  description: 'Explore our comprehensive language learning paths and resources.',
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-blue-600">
              Language Gems
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/languages" className="text-gray-700 hover:text-blue-600 transition-colors">
                Languages
              </Link>
              <Link href="/themes" className="text-gray-700 hover:text-blue-600 transition-colors">
                Themes
              </Link>
              <Link href="/games" className="text-gray-700 hover:text-blue-600 transition-colors">
                Games
              </Link>
              <Link href="/exercises" className="text-gray-700 hover:text-blue-600 transition-colors">
                Exercises
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-white shadow-inner mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Language Gems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 