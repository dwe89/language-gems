'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  activeLanguage?: string;
  compact?: boolean;
  className?: string;
}

const languages: Language[] = [
  {
    code: 'spanish',
    name: 'Spanish',
    flag: '/assets/images/spanish-flag.png'
  },
  {
    code: 'french',
    name: 'French',
    flag: '/assets/images/french-flag.png'
  },
  {
    code: 'german',
    name: 'German',
    flag: '/assets/images/german-flag.png'
  }
];

export default function LanguageSelector({ 
  activeLanguage, 
  compact = false,
  className = ''
}: LanguageSelectorProps) {
  return (
    <div className={`language-selector ${className}`}>
      {languages.map((language) => (
        <Link 
          key={language.code}
          href={`/${language.code}`} 
          className={`language-btn ${activeLanguage === language.code ? 'active' : ''} ${compact ? 'compact' : ''}`}
        >
          <Image 
            src={language.flag} 
            alt={language.name} 
            width={compact ? 16 : 24} 
            height={compact ? 12 : 16} 
            className="flag-icon" 
          />
          {!compact && <span>{language.name}</span>}
        </Link>
      ))}
    </div>
  );
} 