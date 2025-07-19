import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'Conjugation Duel - Language Gems',
  description: 'Epic verb conjugation battles in different arenas and leagues',
};

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
