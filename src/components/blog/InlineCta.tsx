'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface InlineCtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: 'blue' | 'purple' | 'green';
}

export default function InlineCta({ 
  title, 
  description, 
  buttonText, 
  buttonLink,
  variant = 'blue' 
}: InlineCtaProps) {
  const variantStyles = {
    blue: {
      bg: 'from-blue-600 to-indigo-600',
      hoverBg: 'from-blue-700 to-indigo-700',
      icon: 'text-blue-200',
      text: 'text-blue-100'
    },
    purple: {
      bg: 'from-purple-600 to-pink-600',
      hoverBg: 'from-purple-700 to-pink-700',
      icon: 'text-purple-200',
      text: 'text-purple-100'
    },
    green: {
      bg: 'from-green-600 to-emerald-600',
      hoverBg: 'from-green-700 to-emerald-700',
      icon: 'text-green-200',
      text: 'text-green-100'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`bg-gradient-to-r ${styles.bg} rounded-xl p-6 my-8 shadow-lg`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Sparkles className={`h-8 w-8 ${styles.icon}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className={`${styles.text} mb-4`}>
            {description}
          </p>
          <Link
            href={buttonLink}
            className={`inline-flex items-center px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:shadow-xl transition-all duration-200`}
          >
            {buttonText}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
