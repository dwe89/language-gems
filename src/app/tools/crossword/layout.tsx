import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crossword Generator | LanguageGems',
  description: 'Create custom crossword puzzles for language learning and education',
  keywords: 'crossword, puzzle, education, language learning, vocabulary, teaching tools',
};

export default function CrosswordLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {children}
    </div>
  );
}
