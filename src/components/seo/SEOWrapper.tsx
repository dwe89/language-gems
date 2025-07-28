import { Metadata } from 'next';
import { getOrganizationSchema, getBreadcrumbSchema } from '../../lib/seo/structuredData';

interface SEOWrapperProps {
  children: React.ReactNode;
  structuredData?: object | object[];
  breadcrumbs?: Array<{name: string, url: string}>;
}

// Component for client-side structured data injection
export function StructuredData({ data }: { data: object | object[] }) {
  const dataArray = Array.isArray(data) ? data : [data];
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(dataArray)
      }}
    />
  );
}

// Main SEO wrapper component
export default function SEOWrapper({ 
  children, 
  structuredData, 
  breadcrumbs 
}: SEOWrapperProps) {
  // Prepare structured data array
  const structuredDataArray = [];
  
  // Always include organization schema
  structuredDataArray.push(getOrganizationSchema());
  
  // Add breadcrumbs if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredDataArray.push(getBreadcrumbSchema(breadcrumbs));
  }
  
  // Add custom structured data
  if (structuredData) {
    if (Array.isArray(structuredData)) {
      structuredDataArray.push(...structuredData);
    } else {
      structuredDataArray.push(structuredData);
    }
  }

  return (
    <>
      <StructuredData data={structuredDataArray} />
      {children}
    </>
  );
}

// Helper function to generate metadata with canonical URLs
export function generateMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime
}: {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const fullTitle = title.includes('Language Gems') ? title : `${title} | Language Gems`;
  const baseUrl = 'https://languagegems.com';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: 'Daniel Etienne', url: 'https://languagegems.com/about' }],
    creator: 'Daniel Etienne',
    publisher: 'Language Gems',
    alternates: canonicalUrl ? {
      canonical: canonicalUrl,
    } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'Language Gems',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullOgImage],
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
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
  };

  // Add article-specific metadata
  if (ogType === 'article' && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: ['Daniel Etienne'],
    };
  }

  return metadata;
}

// Helper function for game pages
export function generateGameMetadata(gameId: string, gameName: string, gameDescription: string): Metadata {
  return generateMetadata({
    title: `${gameName} - Interactive Language Learning Game`,
    description: gameDescription,
    keywords: [
      `${gameName.toLowerCase()} game`,
      'interactive language game',
      'GCSE language learning',
      'vocabulary practice',
      'educational game',
      'language learning platform'
    ],
    canonical: `/games/${gameId}`,
    ogImage: `/images/games/${gameId}-og.jpg`,
  });
}

// Helper function for dashboard pages (with noIndex)
export function generateDashboardMetadata(title: string, description: string): Metadata {
  return generateMetadata({
    title,
    description,
    noIndex: true, // Dashboard pages should not be indexed
  });
}

// Helper function for auth pages (with noIndex)
export function generateAuthMetadata(title: string, description: string): Metadata {
  return generateMetadata({
    title,
    description,
    noIndex: true, // Auth pages should not be indexed
  });
}
