import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'vocab-master',
  GAME_SEO_DATA['vocab-master']?.name || 'Vocab Master',
  GAME_SEO_DATA['vocab-master']?.description || 'Master vocabulary through comprehensive practice sessions and adaptive learning.'
);

export default function VocabMasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}