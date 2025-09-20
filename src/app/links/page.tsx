'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gem, 
  ExternalLink, 
  Music, 
  Globe, 
  Youtube, 
  Facebook,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

// TikTok icon component (since it's not in Lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface LinkButtonProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  isPrimary?: boolean;
  isExternal?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({ 
  href, 
  icon, 
  title, 
  description, 
  isPrimary = false,
  isExternal = false 
}) => {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        flex items-center justify-between group
        ${isPrimary 
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-500 text-white shadow-lg hover:shadow-xl' 
          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center space-x-4">
        <div className={`
          p-3 rounded-xl 
          ${isPrimary 
            ? 'bg-white/20' 
            : 'bg-gradient-to-br from-purple-100 to-pink-100'
          }
        `}>
          <div className={isPrimary ? 'text-white' : 'text-purple-600'}>
            {icon}
          </div>
        </div>
        <div className="text-left">
          <h3 className={`font-semibold text-lg ${isPrimary ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-sm ${isPrimary ? 'text-white/80' : 'text-gray-600'}`}>
              {description}
            </p>
          )}
        </div>
      </div>
      <div className={`
        transition-transform duration-300 group-hover:translate-x-1
        ${isPrimary ? 'text-white' : 'text-gray-400'}
      `}>
        <ExternalLink className="w-5 h-5" />
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  return (
    <Link href={href}>
      {buttonContent}
    </Link>
  );
};

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <Gem className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold mb-2"
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Language
            </span>
            <span className="text-gray-800">Gems</span>
          </motion.h1>

          {/* Welcome Message */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 text-lg"
          >
            Welcome to LanguageGems! Find all our key links below.
          </motion.p>
        </motion.div>

        {/* Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          {/* Priority Link - New Song Pre-save */}
          <LinkButton
            href="https://distrokid.com/hyperfollow/languagegems/spanish-numbers-1-20"
            icon={<Sparkles className="w-6 h-6" />}
            title="Pre-save Our New Song: Spanish Numbers!"
            description="🎵 New release - Spanish Numbers 1-20"
            isPrimary={true}
            isExternal={true}
          />

          {/* Main Website */}
          <LinkButton
            href="https://www.languagegems.com"
            icon={<Globe className="w-6 h-6" />}
            title="Visit Our Website"
            description="Interactive GCSE language learning platform"
            isExternal={true}
          />

          {/* Songs Page */}
          <LinkButton
            href="https://www.languagegems.com/songs"
            icon={<Music className="w-6 h-6" />}
            title="Find More Songs"
            description="Discover our complete song library"
            isExternal={true}
          />

          {/* YouTube Channel */}
          <LinkButton
            href="https://youtube.com/@TheLanguageGems"
            icon={<Youtube className="w-6 h-6" />}
            title="Subscribe on YouTube"
            description="Educational language learning videos"
            isExternal={true}
          />

          {/* TikTok Channel */}
          <LinkButton
            href="https://tiktok.com/@LanguageGems"
            icon={<TikTokIcon className="w-6 h-6" />}
            title="Follow on TikTok"
            description="Quick language learning tips & fun content"
            isExternal={true}
          />

          {/* Facebook */}
          <LinkButton
            href="https://www.facebook.com/thelanguagegems"
            icon={<Facebook className="w-6 h-6" />}
            title="Like us on Facebook"
            description="Join our language learning community"
            isExternal={true}
          />
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} LanguageGems. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Interactive GCSE Language Learning Platform
          </p>
        </motion.div>
      </div>
    </div>
  );
}
