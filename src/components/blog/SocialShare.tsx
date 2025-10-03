'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

interface SocialShareProps {
  title: string;
  url: string;
  excerpt?: string;
}

export default function SocialShare({ title, url, excerpt }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt || '');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200"
      >
        <Share2 className="h-4 w-4" />
        <span className="font-medium">Share</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-4 min-w-[200px]">
            <div className="space-y-2">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <Twitter className="h-5 w-5 text-blue-400 group-hover:text-blue-500" />
                <span className="text-sm font-medium text-slate-700">Twitter</span>
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <Facebook className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                <span className="text-sm font-medium text-slate-700">Facebook</span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <Linkedin className="h-5 w-5 text-blue-700 group-hover:text-blue-800" />
                <span className="text-sm font-medium text-slate-700">LinkedIn</span>
              </a>

              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-5 w-5 text-slate-600 group-hover:text-slate-700" />
                    <span className="text-sm font-medium text-slate-700">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

