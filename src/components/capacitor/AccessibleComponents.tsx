'use client';

import { ReactNode, ButtonHTMLAttributes, HTMLAttributes, useEffect, useRef } from 'react';
import { useAccessibility, useFocusTrap } from './useAccessibility';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label?: string;
  description?: string;
  pressed?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  focusable?: boolean;
  className?: string;
}

export function AccessibleButton({
  children,
  label,
  description,
  pressed,
  expanded,
  disabled,
  focusable = true,
  className = '',
  ...props
}: AccessibleButtonProps) {
  const { announceForScreenReader } = useAccessibility();

  const handleClick = () => {
    if (pressed !== undefined) {
      const newState = !pressed;
      announceForScreenReader(`${label || 'Button'} ${newState ? 'pressed' : 'unpressed'}`);
    }
    if (props.onClick) {
      props.onClick(new Event('click') as any);
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-describedby={description ? `${label}-description` : undefined}
      aria-pressed={pressed}
      aria-expanded={expanded}
      aria-disabled={disabled}
      tabIndex={focusable ? 0 : -1}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
      {description && (
        <span id={`${label}-description`} className="sr-only">
          {description}
        </span>
      )}
    </button>
  );
}

interface AccessibleLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  label?: string;
  description?: string;
  external?: boolean;
  className?: string;
}

export function AccessibleLink({
  children,
  href,
  label,
  description,
  external = false,
  className = '',
  ...props
}: AccessibleLinkProps) {
  return (
    <a
      href={href}
      aria-label={label}
      aria-describedby={description ? `${label}-description` : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
      className={className}
      {...props}
    >
      {children}
      {description && (
        <span id={`${label}-description`} className="sr-only">
          {description}
        </span>
      )}
    </a>
  );
}

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  description?: string;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  initialFocus?: HTMLElement | null;
  restoreFocus?: HTMLElement | null;
  className?: string;
}

export function AccessibleModal({
  isOpen,
  onClose,
  children,
  title,
  description,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  initialFocus,
  restoreFocus: initialRestoreFocus,
  className = '',
}: AccessibleModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { saveFocus, checkReducedMotion, trapFocus } = useAccessibility();
  const previousFocusRef = useRef<HTMLElement | null>(initialRestoreFocus || null);

  useEffect(() => {
    if (isOpen) {
      const cleanup = trapFocus(containerRef.current!);
      return cleanup;
    }
  }, [isOpen, trapFocus]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      return;
    }

    document.body.style.overflow = 'hidden';
    previousFocusRef.current = document.activeElement as HTMLElement;

    const focusTarget = initialFocus || containerRef.current?.querySelector<HTMLElement>('[role="dialog"]');
    if (focusTarget) {
      focusTarget.focus();
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, closeOnEscape, initialFocus]);

  if (!isOpen) return null;

  const reducedMotion = checkReducedMotion();

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden p-6"
        style={{
          animation: reducedMotion ? 'none' : undefined,
        }}
      >
        <h2 id="modal-title" className="text-xl font-semibold mb-2">
          {title}
        </h2>
        {description && (
          <p id="modal-description" className="text-gray-600 mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

interface AccessibleLiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  'aria-live'?: 'polite' | 'assertive' | 'off';
  className?: string;
}

export function AccessibleLiveRegion({
  message,
  priority = 'polite',
  className = '',
}: AccessibleLiveRegionProps) {
  useEffect(() => {
    if (message) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = message;

      Object.assign(liveRegion.style, {
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      });

      document.body.appendChild(liveRegion);

      return () => {
        document.body.removeChild(liveRegion);
      };
    }
  }, [message, priority]);

  return null;
}

interface AccessibleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function AccessibleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}: AccessibleSwitchProps) {
  const { announceForScreenReader } = useAccessibility();

  const handleChange = () => {
    const newState = !checked;
    announceForScreenReader(`${label} ${newState ? 'enabled' : 'disabled'}`);
    onChange(newState);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={description ? `${label}-description` : undefined}
      aria-disabled={disabled}
      onClick={handleChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
        aria-hidden="true"
      />
      {description && (
        <span id={`${label}-description`} className="sr-only">
          {description}
        </span>
      )}
    </button>
  );
}

interface AccessibleProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function AccessibleProgress({
  value,
  max = 100,
  label,
  showValue = true,
  className = '',
}: AccessibleProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={className} role="progressbar">
      <div className="flex items-center justify-between mb-1">
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        {showValue && (
          <span className="text-sm text-gray-600">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="presentation"
        />
      </div>
    </div>
  );
}

interface AccessibleCardProps {
  children: ReactNode;
  onClick?: () => void;
  label?: string;
  description?: string;
  interactive?: boolean;
  selected?: boolean;
  className?: string;
}

export function AccessibleCard({
  children,
  onClick,
  label,
  description,
  interactive = false,
  selected = false,
  className = '',
}: AccessibleCardProps) {
  const Component = interactive ? 'button' : 'div';

  return (
    <Component
      role={interactive ? 'button' : undefined}
      aria-label={label}
      aria-describedby={description ? `${label}-description` : undefined}
      aria-pressed={interactive ? selected : undefined}
      onClick={onClick}
      className={`rounded-xl p-4 transition-all duration-200 ${
        interactive
          ? `cursor-pointer hover:scale-105 active:scale-95 ${
              selected ? 'ring-2 ring-blue-500' : ''
            }`
          : ''
      } ${className}`}
    >
      {children}
      {description && (
        <span id={`${label}-description`} className="sr-only">
          {description}
        </span>
      )}
    </Component>
  );
}
