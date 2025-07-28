import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'gem-rush',
  GAME_SEO_DATA['gem-rush']?.name || 'Gem Rush',
  GAME_SEO_DATA['gem-rush']?.description || 'Fast-paced vocabulary learning game where speed and accuracy help you collect precious gems.'
);

export default function GemRushLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}