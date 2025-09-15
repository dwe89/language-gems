"use client";

import * as React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

type SelectContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedLabel?: string;
  setSelectedLabel?: (label: string) => void;
};

const SelectContext = React.createContext<SelectContextType | null>(null);

const Select = React.forwardRef<
  HTMLDivElement,
  {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    defaultValue?: string;
  }
>(({ value, defaultValue, onValueChange, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '');
  const [selectedLabel, setSelectedLabel] = React.useState<string>('');

  React.useEffect(() => {
    if (value !== undefined) setSelectedValue(value);
  }, [value]);

  const handleValueChange = (v: string) => {
    setSelectedValue(v);
    if (onValueChange) onValueChange(v);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && 'current' in ref && ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, ref]);

  return (
    <div ref={ref} {...props} className={cn('relative', (props as any).className)}>
      <SelectContext.Provider value={{ 
        value: selectedValue, 
        onValueChange: handleValueChange, 
        isOpen, 
        setIsOpen, 
        selectedLabel,
        setSelectedLabel
      }}>
        {children}
      </SelectContext.Provider>
    </div>
  );
});

Select.displayName = 'Select';

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (ctx) ctx.setIsOpen(!ctx.isOpen);
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
      onClick={handleClick}
      aria-expanded={ctx?.isOpen}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, children, placeholder, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  return (
    <span
      ref={ref}
      className={cn('block truncate', className)}
      {...props}
    >
      {ctx?.selectedLabel || children || placeholder}
    </span>
  );
});

SelectValue.displayName = 'SelectValue';

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  if (!ctx?.isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white text-slate-950 shadow-lg',
        className
      )}
      style={{ top: '100%', left: 0 }}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
});

SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const select = React.useContext(SelectContext);

  const handleSelect = () => {
    if (select && select.onValueChange) {
      select.onValueChange(value);
      // Store the display text
      if (select.setSelectedLabel) {
        if (typeof children === 'string') {
          select.setSelectedLabel(children);
        } else {
          select.setSelectedLabel(String(children) || value);
        }
      }
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        select?.value === value && 'bg-accent text-accent-foreground',
        className
      )}
      onClick={handleSelect}
      {...props}
    >
      {select?.value === value && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      )}
      <span className="block truncate">{children}</span>
    </div>
  );
});

SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };