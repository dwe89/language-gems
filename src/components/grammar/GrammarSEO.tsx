import { Metadata } from 'next';

interface GrammarSEOProps {
  language: 'spanish' | 'french' | 'german';
  category: string;
  topic: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keywords?: string[];
  examples?: string[];
}

const LANGUAGE_INFO = {
  spanish: { name: 'Spanish', code: 'es', flag: '🇪🇸' },
  french: { name: 'French', code: 'fr', flag: '🇫🇷' },
  german: { name: 'German', code: 'de', flag: '🇩🇪' }
};

export function generateGrammarMetadata({
  language,
  category,
  topic,
  title,
  description,
  difficulty,
  keywords = [],
  examples = []
}: GrammarSEOProps): Metadata {
  const languageInfo = LANGUAGE_INFO[language];
  const fullTitle = `${title} - ${languageInfo.name} Grammar Guide | Language Gems`;
  const fullDescription = `${description} Complete ${difficulty} level guide to ${languageInfo.name} ${category}. Learn with examples, practice exercises, and interactive quizzes.`;
  
  // Generate comprehensive keywords
  const baseKeywords = [
    `${languageInfo.name.toLowerCase()} grammar`,
    `${languageInfo.name.toLowerCase()} ${category}`,
    `${topic.replace(/-/g, ' ')}`,
    `learn ${languageInfo.name.toLowerCase()}`,
    `${languageInfo.name.toLowerCase()} lessons`,
    `${languageInfo.name.toLowerCase()} tutorial`,
    `${difficulty} ${languageInfo.name.toLowerCase()}`,
    'language learning',
    'grammar guide',
    'language gems'
  ];

  const allKeywords = [...baseKeywords, ...keywords].join(', ');
  const canonical = `/grammar/${language}/${category}/${topic}`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: [{ name: 'Language Gems Team' }],
    creator: 'Language Gems',
    publisher: 'Language Gems',
    alternates: {
      canonical: `https://languagegems.com${canonical}`
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: `https://languagegems.com${canonical}`,
      siteName: 'Language Gems',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: `/images/grammar/${language}-${category}-${topic}-og.jpg`,
          width: 1200,
          height: 630,
          alt: `${title} - ${languageInfo.name} Grammar Guide`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [`/images/grammar/${language}-${category}-${topic}-og.jpg`],
      creator: '@LanguageGems'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:author': 'Language Gems Team',
      'article:section': `${languageInfo.name} Grammar`,
      'article:tag': allKeywords,
      'language': languageInfo.code,
      'content-language': languageInfo.code,
      'audience': 'students, teachers, language learners',
      'educational-level': difficulty,
      'subject': `${languageInfo.name} Grammar`
    }
  };
}

export function generateGrammarStructuredData({
  language,
  category,
  topic,
  title,
  description,
  difficulty,
  examples = []
}: GrammarSEOProps) {
  const languageInfo = LANGUAGE_INFO[language];
  const canonical = `/grammar/${language}/${category}/${topic}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalResource',
    name: title,
    description: description,
    url: `https://languagegems.com${canonical}`,
    author: {
      '@type': 'Organization',
      name: 'Language Gems',
      url: 'https://languagegems.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Language Gems',
      url: 'https://languagegems.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://languagegems.com/images/logo.png'
      }
    },
    educationalLevel: difficulty,
    learningResourceType: 'Grammar Guide',
    inLanguage: languageInfo.code,
    about: {
      '@type': 'Thing',
      name: `${languageInfo.name} ${category}`,
      description: `Learn ${languageInfo.name} ${category} with comprehensive explanations and examples`
    },
    teaches: `${languageInfo.name} ${topic.replace(/-/g, ' ')}`,
    educationalUse: ['study', 'practice', 'reference'],
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student'
    },
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    ...(examples.length > 0 && {
      exampleOfWork: examples.map(example => ({
        '@type': 'CreativeWork',
        text: example
      }))
    })
  };
}

// Helper function to generate breadcrumb structured data
export function generateGrammarBreadcrumbs({
  language,
  category,
  topic,
  title
}: Pick<GrammarSEOProps, 'language' | 'category' | 'topic' | 'title'>) {
  const languageInfo = LANGUAGE_INFO[language];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Grammar',
        item: 'https://languagegems.com/grammar'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${languageInfo.name} Grammar`,
        item: `https://languagegems.com/grammar/${language}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        item: `https://languagegems.com/grammar/${language}/${category}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: title,
        item: `https://languagegems.com/grammar/${language}/${category}/${topic}`
      }
    ]
  };
}

// Helper to generate FAQ structured data for common grammar questions
export function generateGrammarFAQ(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
