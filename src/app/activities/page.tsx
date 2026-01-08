import { Metadata } from 'next';
import GamesPageClient from '../../components/games/GamesPageClient';

export const metadata: Metadata = {
  title: 'GCSE Language Learning Games | Spanish, French & German Games',
  description: '15+ interactive GCSE language learning games for Spanish, French, and German. Vocabulary games, grammar practice, and MFL teaching resources for UK schools.',
  keywords: ['GCSE Spanish games', 'GCSE French games', 'GCSE German games', 'MFL teaching resources', 'language learning games', 'vocabulary games', 'grammar games'],
  alternates: {
    canonical: 'https://languagegems.com/activities',
  },
};

export default function GamesPage() {
  return <GamesPageClient />;
}
