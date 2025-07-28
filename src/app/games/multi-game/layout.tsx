import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'multi-game',
  GAME_SEO_DATA['multi-game']?.name || 'Multi-Game',
  GAME_SEO_DATA['multi-game']?.description || 'Experience multiple language learning games in one comprehensive platform.'
);

export default function MultiGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}