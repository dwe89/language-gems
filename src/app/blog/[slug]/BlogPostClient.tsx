'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';

interface BlogPostClientProps {
  title: string;
  excerpt: string;
}

export default function BlogPostClient({ title, excerpt }: BlogPostClientProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </button>
  );
}
