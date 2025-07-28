import { Metadata } from 'next';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'sentence-builder',
  GAME_SEO_DATA['sentence-builder']?.name || 'Sentence Builder',
  GAME_SEO_DATA['sentence-builder']?.description || 'Construct grammatically correct sentences by arranging words and phrases in the right order.'
);

export default function SentenceBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}