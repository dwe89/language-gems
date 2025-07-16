'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Star, Sparkles } from 'lucide-react';

interface ComingSoonProps {
  featureName: string;
  description?: string;
  backUrl?: string;
}

export default function ComingSoon({ 
  featureName, 
  description = "We're working hard to bring you this amazing feature!",
  backUrl = "/"
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Animated Icon */}
          <div className="mb-6 relative">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Clock className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2">Coming Soon!</h1>
          <h2 className="text-xl text-purple-200 mb-6">{featureName}</h2>

          {/* Description */}
          <p className="text-gray-300 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Features Preview */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-center text-sm text-gray-400">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span>Exciting new functionality</span>
            </div>
            <div className="flex items-center justify-center text-sm text-gray-400">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span>Beautiful user interface</span>
            </div>
            <div className="flex items-center justify-center text-sm text-gray-400">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              <span>Enhanced learning experience</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              In the meantime, check out our active features:
            </p>
            <div className="flex gap-3 justify-center">
              <Link 
                href="/blog"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:scale-105 transition-transform"
              >
                📝 Blog
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <Link 
            href={backUrl}
            className="inline-flex items-center mt-8 text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute top-3/4 left-1/2 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-float-slow"></div>
        </div>
      </div>
    </div>
  );
} 