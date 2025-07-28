// SEO-optimized heading components with proper hierarchy validation

import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

// Context to track heading hierarchy
const HeadingContext = React.createContext<{
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
}>({
  currentLevel: 0,
  setCurrentLevel: () => {}
});

export function HeadingProvider({ children }: { children: React.ReactNode }) {
  const [currentLevel, setCurrentLevel] = React.useState(0);
  
  return (
    <HeadingContext.Provider value={{ currentLevel, setCurrentLevel }}>
      {children}
    </HeadingContext.Provider>
  );
}

// Base heading component with hierarchy validation
function BaseHeading({ 
  level, 
  children, 
  className = '', 
  id,
  ...props 
}: HeadingProps & React.HTMLAttributes<HTMLHeadingElement>) {
  const { currentLevel, setCurrentLevel } = React.useContext(HeadingContext);
  
  React.useEffect(() => {
    if (level && level > currentLevel + 1) {
      console.warn(
        `Heading hierarchy violation: H${level} follows H${currentLevel}. ` +
        `Consider using H${currentLevel + 1} instead for proper SEO structure.`
      );
    }
    if (level) {
      setCurrentLevel(level);
    }
  }, [level, currentLevel, setCurrentLevel]);

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      className={className} 
      id={id}
      {...props}
    >
      {children}
    </Tag>
  );
}

// Semantic heading components
export function H1({ children, className = '', id, ...props }: Omit<HeadingProps, 'level'> & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <BaseHeading 
      level={1} 
      className={`text-4xl md:text-5xl lg:text-6xl font-bold ${className}`}
      id={id}
      {...props}
    >
      {children}
    </BaseHeading>
  );
}

export function H2({ children, className = '', id, ...props }: Omit<HeadingProps, 'level'> & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <BaseHeading 
      level={2} 
      className={`text-3xl md:text-4xl font-bold ${className}`}
      id={id}
      {...props}
    >
      {children}
    </BaseHeading>
  );
}

export function H3({ children, className = '', id, ...props }: Omit<HeadingProps, 'level'> & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <BaseHeading 
      level={3} 
      className={`text-2xl md:text-3xl font-bold ${className}`}
      id={id}
      {...props}
    >
      {children}
    </BaseHeading>
  );
}

export function H4({ children, className = '', id, ...props }: Omit<HeadingProps, 'level'> & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <BaseHeading 
      level={4} 
      className={`text-xl md:text-2xl font-semibold ${className}`}
      id={id}
      {...props}
    >
      {children}
    </BaseHeading>
  );
}

export function H5({ children, className = '', id, ...props }: Omit<HeadingProps, 'level'> & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <BaseHeading 
      level={5} 
      className={`text-lg md:text-xl font-semibold ${className}`}
      id={id}
      {...props}
    >
      {children}
    </BaseHeading>
  );
}

export function H6({ children, className = '', id, ...props }: Omit<HeadingProps, 'level'> & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <BaseHeading 
      level={6} 
      className={`text-base md:text-lg font-semibold ${className}`}
      id={id}
      {...props}
    >
      {children}
    </BaseHeading>
  );
}

// Page title component (should be used once per page)
export function PageTitle({ children, className = '', id }: Omit<HeadingProps, 'level'>) {
  return (
    <H1 
      className={`mb-6 text-center lg:text-left ${className}`}
      id={id}
    >
      {children}
    </H1>
  );
}

// Section title component
export function SectionTitle({ children, className = '', id }: Omit<HeadingProps, 'level'>) {
  return (
    <H2 
      className={`mb-8 text-center ${className}`}
      id={id}
    >
      {children}
    </H2>
  );
}

// Subsection title component
export function SubsectionTitle({ children, className = '', id }: Omit<HeadingProps, 'level'>) {
  return (
    <H3 
      className={`mb-6 ${className}`}
      id={id}
    >
      {children}
    </H3>
  );
}

// Game-specific heading components
export function GameTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <PageTitle className={`text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 ${className}`}>
      {children}
    </PageTitle>
  );
}

export function GameSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <SectionTitle className={`text-slate-900 ${className}`}>
      {children}
    </SectionTitle>
  );
}

// Utility function to generate heading IDs from text
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Hook to validate heading structure on page
export function useHeadingValidation() {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels: number[] = [];
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);
    });
    
    // Validate heading hierarchy
    let hasH1 = false;
    let multipleH1 = false;
    let hierarchyViolations: string[] = [];
    
    headingLevels.forEach((level, index) => {
      if (level === 1) {
        if (hasH1) {
          multipleH1 = true;
        }
        hasH1 = true;
      }
      
      if (index > 0) {
        const prevLevel = headingLevels[index - 1];
        if (level > prevLevel + 1) {
          hierarchyViolations.push(`H${level} follows H${prevLevel} at position ${index + 1}`);
        }
      }
    });
    
    // Log validation results
    if (!hasH1) {
      console.warn('SEO Warning: Page is missing an H1 heading');
    }
    
    if (multipleH1) {
      console.warn('SEO Warning: Page has multiple H1 headings. Use only one H1 per page.');
    }
    
    if (hierarchyViolations.length > 0) {
      console.warn('SEO Warning: Heading hierarchy violations found:', hierarchyViolations);
    }
    
    if (hasH1 && !multipleH1 && hierarchyViolations.length === 0) {
      console.log('✅ Heading structure is SEO-optimized');
    }
  }, []);
}
