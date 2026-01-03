import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LanguageGrammarPageClient from '../../../components/grammar/LanguageGrammarPageClient';

const LANGUAGE_INFO = {
  spanish: { name: 'Spanish', flag: '🇪🇸', description: 'Master Spanish grammar with comprehensive guides, interactive exercises, and quizzes. Covers all levels from beginner to advanced.' },
  french: { name: 'French', flag: '🇫🇷', description: 'Learn French grammar systematically. Complete guide to conjugation, tenses, and sentence structure for GCSE and beyond.' },
  german: { name: 'German', flag: '🇩🇪', description: 'Demystify German grammar. Clear explanations of cases, gender, and word order with practical examples and exercises.' },
  // Add mappings for ISO codes if used in URLs
  es: { name: 'Spanish', flag: '🇪🇸', description: 'Master Spanish grammar with comprehensive guides, interactive exercises, and quizzes. Covers all levels from beginner to advanced.' },
  fr: { name: 'French', flag: '🇫🇷', description: 'Learn French grammar systematically. Complete guide to conjugation, tenses, and sentence structure for GCSE and beyond.' },
  de: { name: 'German', flag: '🇩🇪', description: 'Demystify German grammar. Clear explanations of cases, gender, and word order with practical examples and exercises.' }
};

interface PageProps {
  params: {
    language: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const language = params.language.toLowerCase();
  const info = LANGUAGE_INFO[language as keyof typeof LANGUAGE_INFO];

  if (!info) {
    return notFound();
  }

  return {
    title: `${info.name} Grammar Guide - Complete Learning Resource`,
    description: info.description,
    keywords: [`${info.name} grammar`, `learn ${info.name}`, `GCSE ${info.name}`, `${info.name} conjugation`, `${info.name} exercises`],
    openGraph: {
      title: `${info.name} Grammar Guide - Complete Learning Resource`,
      description: info.description,
      type: 'website',
      url: `https://languagegems.com/grammar/${language}`,
    }
  };
}

export default function LanguageGrammarPage({ params }: PageProps) {
  const language = params.language.toLowerCase();
  const info = LANGUAGE_INFO[language as keyof typeof LANGUAGE_INFO];

  if (!info) {
    notFound();
  }

  return <LanguageGrammarPageClient language={params.language} />;
}
