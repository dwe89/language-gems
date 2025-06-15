'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

interface SimpleDropdownProps {
  items: DropdownItem[];
  trigger?: React.ReactNode;
}

export function SimpleDropdown({ items, trigger }: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
      >
        {trigger || <MoreVertical className="h-4 w-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 min-w-[200px] rounded-lg bg-slate-800 border border-slate-700 shadow-lg py-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                item.variant === 'destructive' 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 