import { Metadata } from 'next';
import UnifiedVocabularyDashboard from '../../../../components/student/UnifiedVocabularyDashboard';

export const metadata: Metadata = {
  title: 'Vocabulary Dashboard | LanguageGems',
  description: 'Track your vocabulary learning progress with detailed analytics and insights.',
};

export default function VocabularyDashboardPage() {
  console.log('🎯 [VOCAB DASHBOARD PAGE] Page component loaded!');
  return <UnifiedVocabularyDashboard />;
}
