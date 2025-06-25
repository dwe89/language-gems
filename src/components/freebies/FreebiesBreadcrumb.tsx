import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface FreebiesBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function FreebiesBreadcrumb({ items, className = "" }: FreebiesBreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="text-slate-500 hover:text-slate-700 transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          {item.href && !item.active ? (
            <Link 
              href={item.href}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={item.active ? 'text-slate-900 font-medium' : 'text-slate-500'}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 