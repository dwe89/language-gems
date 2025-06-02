'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import * as SelectPrimitive from "@radix-ui/react-select";

// Context to share state
const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  setIsOpen: (open: boolean) => void;
} | null>(null);

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
  
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);
  
  return (
    <SelectContext.Provider value={{ value: selectedValue, onValueChange, setIsOpen }}>
      <div ref={ref} {...props} className="relative">
        {children}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </SelectContext.Provider>
  );
});

Select.displayName = 'Select';

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const select = React.useContext(SelectContext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (select) {
      select.setIsOpen(true);
    }
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gray-200 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  const select = React.useContext(SelectContext);
  
  return (
    <span
      ref={ref}
      className={cn("block truncate", className)}
      {...props}
    >
      {select?.value || children}
    </span>
  );
});

SelectValue.displayName = 'SelectValue';

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const select = React.useContext(SelectContext);
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-700 bg-gray-900 text-gray-200 shadow-md",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
});

SelectContent.displayName = 'SelectContent';

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold text-gray-200", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const select = React.useContext(SelectContext);
  
  const handleSelect = () => {
    if (select && select.onValueChange) {
      select.onValueChange(value);
      select.setIsOpen(false);
    }
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-800 focus:bg-gray-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-200",
        select?.value === value && "bg-gray-800",
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
            className="h-4 w-4 text-cyan-400"
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

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
}; 