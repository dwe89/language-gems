import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crossword Generator | TeachWhizz',
  description: 'Create custom crossword puzzles for your classroom',
};

export default function CrosswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 