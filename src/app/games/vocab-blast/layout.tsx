import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'vocab-blast',
  GAME_SEO_DATA['vocab-blast']?.name || 'Vocab Blast',
  GAME_SEO_DATA['vocab-blast']?.description || 'Fast-paced vocabulary practice with click-to-reveal translations and themed challenges.'
);

export default function VocabBlastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}