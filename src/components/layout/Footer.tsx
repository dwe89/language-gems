import Link from 'next/link';
import { Gamepad2, Search, BookOpen, FileText, Building2, Gem, HelpCircle, Book, Video, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-indigo-950 py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">LanguageGems</h3>
            <p className="text-gray-300 mb-4">
              A comprehensive language learning platform designed for educators and students worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/games" className="hover:text-white transition-colors flex items-center"><Gamepad2 className="w-4 h-4 mr-2" />Interactive Games</Link></li>
              <li><Link href="/explore" className="hover:text-white transition-colors flex items-center"><Search className="w-4 h-4 mr-2" />Explore Features</Link></li>
              <li><a href="https://www.secondarymfl.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center"><BookOpen className="w-4 h-4 mr-2" />Learning Resources</a></li>
              <li><Link href="/blog" className="hover:text-white transition-colors flex items-center"><FileText className="w-4 h-4 mr-2" />Blog & Insights</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">For Educators</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/schools" className="hover:text-white transition-colors flex items-center"><Building2 className="w-4 h-4 mr-2" />School Solutions</Link></li>
              <li><Link href="/schools/pricing" className="hover:text-white transition-colors flex items-center"><Gem className="w-4 h-4 mr-2" />Pricing Plans</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors flex items-center"><Users className="w-4 h-4 mr-2" />About Us</Link></li>
              <li><Link href="/contact-sales" className="hover:text-white transition-colors flex items-center"><FileText className="w-4 h-4 mr-2" />Contact Sales</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/help-center" className="hover:text-white transition-colors flex items-center"><HelpCircle className="w-4 h-4 mr-2" />Help Center</Link></li>
              <li><Link href="/documentation" className="hover:text-white transition-colors flex items-center"><Book className="w-4 h-4 mr-2" />Documentation</Link></li>
              <li><Link href="/tutorials" className="hover:text-white transition-colors flex items-center"><Video className="w-4 h-4 mr-2" />Tutorials</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors flex items-center"><Users className="w-4 h-4 mr-2" />Community</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} LanguageGems. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              LanguageGems is a trading name for Etienne Education Ltd
            </p>
            <p className="text-gray-500 text-xs">
              Company number 16909378
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </Link>
            <Link href="/legal/disclaimer" className="text-gray-400 hover:text-white text-sm">
              Disclaimer
            </Link>
            <Link href="/legal/ai-policy" className="text-gray-400 hover:text-white text-sm">
              AI Policy
            </Link>
            <Link href="/legal/gdpr" className="text-gray-400 hover:text-white text-sm">
              GDPR
            </Link>
            <Link href="/legal/accessibility" className="text-gray-400 hover:text-white text-sm">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 