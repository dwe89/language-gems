'use client';

import { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3');
    
    const extractedHeadings: Heading[] = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id; // Ensure heading has an ID
      
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1))
      };
    });

    setHeadings(extractedHeadings);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    // Observe all headings
    headingElements.forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-24 bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <List className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-bold text-slate-900">Table of Contents</h3>
      </div>

      <nav className="space-y-2">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`w-full text-left text-sm transition-all duration-200 flex items-start group ${
              heading.level === 3 ? 'pl-4' : ''
            } ${
              activeId === heading.id
                ? 'text-blue-600 font-semibold'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <ChevronRight 
              className={`h-4 w-4 mr-1 flex-shrink-0 mt-0.5 transition-transform ${
                activeId === heading.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
              } ${
                activeId === heading.id ? 'translate-x-1' : ''
              }`}
            />
            <span className="line-clamp-2">{heading.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

