import type { Metadata } from 'next';
import './styles.css';
import { generateGameMetadata } from '../../../components/seo/SEOWrapper';
import { GAME_SEO_DATA } from '../../../components/seo/GamePageSEO';

export const metadata: Metadata = generateGameMetadata(
  'conjugation-duel',
  GAME_SEO_DATA['conjugation-duel']?.name || 'Conjugation Duel',
  GAME_SEO_DATA['conjugation-duel']?.description || 'Master verb conjugations through competitive gameplay.'
);

export default function ConjugationDuelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="conjugation-duel-game">
      {children}
    </div>
  );
}
