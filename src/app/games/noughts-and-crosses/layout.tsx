import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'noughts-and-crosses',
  GAME_SEO_DATA['noughts-and-crosses']?.name || 'Noughts and Crosses',
  GAME_SEO_DATA['noughts-and-crosses']?.description || 'Classic tic-tac-toe with a language learning twist. Answer vocabulary questions to claim your squares.'
);

export default function NoughtsandCrossesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}