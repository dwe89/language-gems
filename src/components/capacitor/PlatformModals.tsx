'use client';

import { useEffect, useRef, ReactNode, MouseEvent, TouchEvent } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useCapacitor } from './CapacitorProvider';
import { triggerHaptic, triggerNotification } from './usePlatformGestures';
import { useSafeArea } from './EnhancedSafeAreaWrapper';
import { useSetStatusBar } from './useStatusBarTheming';

interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showCloseButton?: boolean;
  variant?: 'centered' | 'bottom-sheet';
  height?: string;
}

interface PlatformAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function PlatformModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  variant = 'centered',
  height,
}: PlatformModalProps) {
  const { platform } = useCapacitor();
  const modalRef = useRef<HTMLDivElement>(null);
  const { safeAreaPadding } = useSafeArea();
  const { setStatusBar } = useSetStatusBar();

  const iOS = platform === 'ios';
  const android = platform === 'android';

  useEffect(() => {
    if (isOpen && iOS) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, iOS]);

  useEffect(() => {
    if (isOpen) {
      setStatusBar('dark', iOS ? 'rgba(0,0,0,0.4)' : '#000000');
    } else {
      setStatusBar('auto');
    }
  }, [isOpen, iOS, setStatusBar]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      triggerHaptic('light');
      onClose();
    }
  };

  if (!isOpen) return null;

  const centeredVariant = (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: iOS ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)',
        backdropFilter: iOS ? 'blur(8px)' : 'none',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden ${
          iOS ? 'animate-modal-slide-up' : android ? 'animate-modal-fade-in' : ''
        }`}
        style={{ height }}
      >
        {showCloseButton && (
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              iOS
                ? 'hover:bg-gray-100'
                : android
                ? 'bg-gray-100 hover:bg-gray-200'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="p-6">
          <h2 className={`text-lg font-semibold mb-4 ${
            iOS ? 'text-gray-900' : android ? 'text-gray-900' : 'text-white'
          }`}>
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );

  const bottomSheetVariant = (
    <div
      ref={modalRef}
      className="fixed inset-x-0 bottom-0 z-50"
      style={{
        paddingBottom: safeAreaPadding.paddingBottom,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`bg-white rounded-t-3xl shadow-2xl overflow-hidden ${
          iOS ? 'animate-bottom-sheet-slide-up' : android ? 'animate-bottom-sheet-fade-up' : ''
        }`}
        style={{ height }}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
        <div className="h-4 bg-gradient-to-b from-gray-200 to-transparent" />
      </div>
    </div>
  );

  return variant === 'bottom-sheet' ? bottomSheetVariant : centeredVariant;
}

export function PlatformAlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}: PlatformAlertDialogProps) {
  const { platform } = useCapacitor();
  const { safeAreaPadding } = useSafeArea();

  if (!isOpen) return null;

  const iOS = platform === 'ios';
  const android = platform === 'android';

  const variantStyles = {
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      buttonColor: iOS
        ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
        : android
        ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
        : 'bg-red-500 hover:bg-red-600 active:bg-red-700',
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      buttonColor: iOS
        ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
        : android
        ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
        : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700',
    },
    info: {
      icon: Check,
      iconColor: 'text-blue-500',
      buttonColor: iOS
        ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
        : android
        ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
    },
  };

  const variantStyle = variantStyles[variant];
  const Icon = variantStyle.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden ${
          iOS ? 'animate-modal-slide-up' : android ? 'animate-modal-fade-in' : ''
        }`}
        style={{
          paddingBottom: safeAreaPadding.paddingBottom,
        }}
      >
        <div className="p-6 text-center">
          <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center ${iOS ? 'animate-scale-in' : ''}`}>
            <Icon className={`w-6 h-6 ${variantStyle.iconColor}`} />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="space-y-3">
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className={`w-full py-3 px-4 rounded-lg font-medium text-gray-700 transition-colors ${
                iOS
                  ? 'bg-gray-100 hover:bg-gray-200'
                  : android
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                triggerNotification(variant === 'danger' ? 'error' : variant === 'warning' ? 'warning' : 'success');
                onConfirm();
              }}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${variantStyle.buttonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
