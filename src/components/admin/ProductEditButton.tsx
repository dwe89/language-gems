'use client';

import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import ProductEditModal from './ProductEditModal';

interface ProductEditButtonProps {
  productId: string;
  onSave?: () => void;
}

export default function ProductEditButton({ productId, onSave }: ProductEditButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    setIsModalOpen(false);
    if (onSave) {
      onSave();
    } else {
      // Reload the page to show updated content
      window.location.reload();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 z-50 flex items-center space-x-2"
        title="Edit Product"
      >
        <Edit className="h-5 w-5" />
        <span className="font-medium">Edit Product</span>
      </button>

      <ProductEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        onSave={handleSave}
      />
    </>
  );
}

