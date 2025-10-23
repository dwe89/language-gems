import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community - Coming Soon | Language Gems',
  description: 'Our teacher community is coming soon. Join thousands of MFL educators in sharing resources and connecting.',
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Coming Soon Icon */}
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Clock className="w-12 h-12 text-indigo-600" />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Community Coming Soon
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          We're building an amazing community space for MFL teachers to connect, share resources,
          and support each other. Stay tuned for updates!
        </p>

        {/* Back to Home Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What to Expect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">Teacher networking and collaboration</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">Resource sharing platform</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">Professional development opportunities</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-600">Discussion forums and support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
