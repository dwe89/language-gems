'use client';

import { useState } from 'react';
import { Edit, Save, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import GrammarEditModal from './GrammarEditModal';

interface GrammarEditButtonProps {
  language: string;
  category: string;
  topicSlug: string;
  initialData: {
    title: string;
    description: string;
    difficulty: string;
    estimated_time: number;
    youtube_video_id?: string;
    sections: any[];
    related_topics?: string[];
    practice_url?: string;
    quiz_url?: string;
  };
}

export default function GrammarEditButton({
  language,
  category,
  topicSlug,
  initialData,
}: GrammarEditButtonProps) {
  const { role } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only show for admin users
  if (role !== 'admin') {
    return null;
  }

  return (
    <>
      {/* Floating Edit Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
        title="Edit this page (Admin only)"
      >
        <Edit className="w-5 h-5" />
        <span>Edit Page</span>
      </button>

      {/* Edit Modal */}
      <GrammarEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
        category={category}
        topicSlug={topicSlug}
        initialData={initialData}
      />
    </>
  );
}

