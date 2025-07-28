import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'gem-collector',
  GAME_SEO_DATA['gem-collector']?.name || 'Gem Collector',
  GAME_SEO_DATA['gem-collector']?.description || 'Collect gems while learning vocabulary through engaging gameplay and spaced repetition techniques.'
);

export default function GemCollectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}