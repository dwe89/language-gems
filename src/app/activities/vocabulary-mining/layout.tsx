import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'vocabulary-mining',
  GAME_SEO_DATA['vocabulary-mining']?.name || 'Vocabulary Mining',
  GAME_SEO_DATA['vocabulary-mining']?.description || 'Master GCSE vocabulary through intelligent spaced repetition and adaptive learning.'
);

export default function VocabularyMiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
