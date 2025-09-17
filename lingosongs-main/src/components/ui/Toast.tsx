'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);
  
  if (!isVisible) return null;
  
  const bgColor = 
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500';
  
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center">
      <div className={`${bgColor} text-white px-6 py-3 rounded-md shadow-lg flex items-center`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-3 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
} 