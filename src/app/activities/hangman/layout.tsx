import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'hangman',
  GAME_SEO_DATA['hangman']?.name || 'Hangman',
  GAME_SEO_DATA['hangman']?.description || 'Practice spelling and vocabulary recognition with our educational hangman game.'
);

export default function HangmanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
