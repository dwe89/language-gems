import { Metadata } from 'next';

interface BlogMetadataOptions {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
}

export function generateBlogMetadata({
  title,
  description,
  slug,
  keywords = [],
  author = 'Daniel Etienne',
  publishedDate,
  modifiedDate,
  category = 'Language Learning',
  tags = [],
  imageUrl,
  imageAlt,
}: BlogMetadataOptions): Metadata {
  const fullTitle = `${title} | Language Gems`;
  const canonicalUrl = `https://languagegems.com/blog/${slug}`;
  
  // Default image if none provided
  const defaultImage = 'https://languagegems.com/images/og-default.svg';
  const ogImageUrl = imageUrl || defaultImage;
  const ogImageAlt = imageAlt || `${title} - Language Gems`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author, url: 'https://languagegems.com/about' }],
    creator: author,
    publisher: 'Language Gems',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Language Gems',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      locale: 'en_GB',
      type: 'article',
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: [author],
      section: category,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@LanguageGems',
      site: '@LanguageGems',
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
  };
}

export function generateBlogStructuredData({
  title,
  description,
  slug,
  author = 'Daniel Etienne',
  publishedDate,
  modifiedDate,
  imageUrl,
  category = 'Language Learning',
  keywords = [],
}: BlogMetadataOptions) {
  const canonicalUrl = `https://languagegems.com/blog/${slug}`;
  const defaultImage = 'https://languagegems.com/images/og-default.svg';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: imageUrl || defaultImage,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://languagegems.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Language Gems',
      logo: {
        '@type': 'ImageObject',
        url: 'https://languagegems.com/images/logo.png',
      },
    },
    url: canonicalUrl,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    articleSection: category,
    keywords: keywords.join(', '),
    inLanguage: 'en-GB',
  };
}

// Breadcrumb structured data for blog posts
export function generateBlogBreadcrumbs(title: string, category?: string) {
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://languagegems.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://languagegems.com/blog',
    },
  ];

  if (category) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: category,
      item: `https://languagegems.com/blog?category=${category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }

  breadcrumbs.push({
    '@type': 'ListItem',
    position: breadcrumbs.length + 1,
    name: title,
    item: '', // Current page, no item needed
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}