'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import BlogEditModal from './BlogEditModal';

interface BlogEditButtonProps {
  postId: string;
  slug: string;
  initialData: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    tags: string[];
    seo_title: string | null;
    seo_description: string | null;
    reading_time_minutes: number;
    featured_image_url?: string | null;
  };
}

export default function BlogEditButton({
  postId,
  slug,
  initialData,
}: BlogEditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Edit Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
        title="Edit this blog post (Admin only)"
      >
        <Edit className="w-5 h-5" />
        <span>Edit Post</span>
      </button>

      {/* Edit Modal */}
      <BlogEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postId={postId}
        slug={slug}
        initialData={initialData}
      />
    </>
  );
}

