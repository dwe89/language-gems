'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import BlogAdminModal from './BlogAdminModal';

interface BlogAdminButtonProps {
  onRefresh?: () => void;
}

export default function BlogAdminButton({ onRefresh }: BlogAdminButtonProps) {
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Refresh the page if no custom refresh function provided
      window.location.reload();
    }
  };

  return (
    <>
      {/* Floating Admin Button */}
      <button
        onClick={() => setShowAdminModal(true)}
        className="fixed bottom-8 left-8 flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all hover:shadow-xl z-40"
        title="Manage Blog Posts"
      >
        <Settings className="w-5 h-5" />
        <span className="font-medium">Manage Posts</span>
      </button>

      {/* Admin Modal */}
      <BlogAdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onRefresh={handleRefresh}
      />
    </>
  );
}

