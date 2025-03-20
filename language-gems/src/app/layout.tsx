import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNavigation from "./components/MainNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LanguageGems | Learn Languages with Fun",
  description: "A multi-language learning platform for schools and individual learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          <MainNavigation />
          <main>{children}</main>
          <footer className="bg-white shadow-inner mt-12 py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">Language Gems</h3>
                  <p className="text-gray-600">
                    Making language learning fun, effective, and accessible for everyone.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Learn</h3>
                  <ul className="space-y-2">
                    <li><a href="/languages" className="text-gray-600 hover:text-blue-600">Languages</a></li>
                    <li><a href="/themes" className="text-gray-600 hover:text-blue-600">Themes</a></li>
                    <li><a href="/exercises" className="text-gray-600 hover:text-blue-600">Exercises</a></li>
                    <li><a href="/games" className="text-gray-600 hover:text-blue-600">Games</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li><a href="/about" className="text-gray-600 hover:text-blue-600">About Us</a></li>
                    <li><a href="/premium" className="text-gray-600 hover:text-blue-600">Premium</a></li>
                    <li><a href="/schools/pricing" className="text-gray-600 hover:text-blue-600">Schools</a></li>
                    <li><a href="/contact" className="text-gray-600 hover:text-blue-600">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Legal</h3>
                  <ul className="space-y-2">
                    <li><a href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
                    <li><a href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                    <li><a href="/cookies" className="text-gray-600 hover:text-blue-600">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Language Gems. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
