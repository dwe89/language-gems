import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detective Listening Game | Language Gems',
  description: 'Solve cases by identifying evidence through listening to words in Spanish, French, or German and finding their English translations.'
};

export default function DetectiveListeningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
