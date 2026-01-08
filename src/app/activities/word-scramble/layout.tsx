import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'word-scramble',
  GAME_SEO_DATA['word-scramble']?.name || 'Word Scramble',
  GAME_SEO_DATA['word-scramble']?.description || 'Unscramble vocabulary words to reinforce spelling patterns and improve recognition speed.'
);

export default function WordScrambleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}