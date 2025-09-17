'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Toast, { ToastContainer, ToastProps } from './ToastNotification';

interface ToastContextType {
  showToast: (props: Omit<ToastProps, 'id' | 'onClose'>) => string;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  const showToast = useCallback((props: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = uuidv4();
    const toast: ToastProps = {
      ...props,
      id,
      onClose: () => hideToast(id)
    };
    
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);
  
  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}; 