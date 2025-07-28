import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'verb-quest',
  GAME_SEO_DATA['verb-quest']?.name || 'Verb Quest',
  GAME_SEO_DATA['verb-quest']?.description || 'Embark on an RPG adventure to master Spanish verb conjugations through epic battles.'
);

export default function VerbQuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}