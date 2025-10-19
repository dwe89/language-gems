'use client';

import React, { useState } from 'react';
import { Edit, Settings } from 'lucide-react';
import PageEditorModal from './PageEditorModal';

interface PageEditButtonProps {
  pageSlug: string;
  onSave?: () => void;
}

export default function PageEditButton({ pageSlug, onSave }: PageEditButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    // Optionally reload the page to show updated content
    window.location.reload();
  };

  return (
    <>
      {/* Floating Edit Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
        title="Edit Page Content (Admin only)"
      >
        <Edit className="w-5 h-5" />
        <span>Edit Page</span>
      </button>

      {/* Editor Modal */}
      <PageEditorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        pageSlug={pageSlug}
        onSave={handleSave}
      />
    </>
  );
}

