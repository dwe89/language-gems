import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Language Learning Games | Language Gems',
  description: 'Interactive language learning games to enhance your vocabulary and grammar skills.'
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 