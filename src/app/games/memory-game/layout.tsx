import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'memory-match',
  GAME_SEO_DATA['memory-match']?.name || 'Memory Match',
  GAME_SEO_DATA['memory-match']?.description || 'Enhance vocabulary retention with engaging memory card games.'
);

export default function MemoryGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
