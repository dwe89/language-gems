// Structured Data Generators for Language Gems

export interface Game {
  id: string;
  name: string;
  description: string;
  category: string;
  languages: string[];
  path: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

// Organization Schema
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Language Gems",
  "alternateName": "LanguageGems",
  "url": "https://languagegems.com",
  "logo": "https://languagegems.com/images/logo.png",
  "description": "Interactive language learning platform with gamified vocabulary and grammar exercises for GCSE students and language learners.",
  "founder": {
    "@type": "Person",
    "name": "Daniel Etienne",
    "jobTitle": "Modern Foreign Languages Teacher",
    "description": "Experienced MFL teacher with 7+ years in education"
  },
  "sameAs": [
    "https://twitter.com/languagegems",
    "https://linkedin.com/company/languagegems"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "hello@languagegems.com"
  }
});

// Website Schema
export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Language Gems",
  "url": "https://languagegems.com",
  "description": "Interactive language learning platform with 15+ educational games for vocabulary, grammar, and GCSE preparation.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://languagegems.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "Language Gems"
  }
});

// Game Schema
export const getGameSchema = (game: Game) => ({
  "@context": "https://schema.org",
  "@type": "Game",
  "name": game.name,
  "description": game.description,
  "url": `https://languagegems.com${game.path}`,
  "genre": "Educational Game",
  "educationalUse": "Language Learning",
  "learningResourceType": "Interactive Game",
  "inLanguage": game.languages,
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "student",
    "audienceType": "GCSE Students, Language Learners"
  },
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "Language Gems"
  },
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web Browser"
});

// Course Schema for Language Learning
export const getCourseSchema = (language: string) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": `${language} Language Learning Course`,
  "description": `Comprehensive ${language} language learning through interactive games and vocabulary exercises.`,
  "provider": {
    "@type": "EducationalOrganization",
    "name": "Language Gems"
  },
  "educationalLevel": "GCSE, Secondary Education",
  "teaches": `${language} Language`,
  "courseMode": "online",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "instructor": {
      "@type": "Person",
      "name": "Daniel Etienne"
    }
  }
});

// Pricing Schema
export const getPricingSchema = (plans: PricingPlan[]) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Language Gems Educational Platform",
  "description": "Interactive language learning platform for schools with unlimited access to games and vocabulary exercises.",
  "brand": {
    "@type": "Brand",
    "name": "Language Gems"
  },
  "offers": plans.map(plan => ({
    "@type": "Offer",
    "name": plan.name,
    "description": plan.description,
    "price": plan.price.replace('£', ''),
    "priceCurrency": "GBP",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "EducationalOrganization",
      "name": "Language Gems"
    }
  }))
});

// FAQ Schema
export const getFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Breadcrumb Schema
export const getBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `https://languagegems.com${crumb.url}`
  }))
});

// Article Schema for Blog Posts
export const getArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "url": `https://languagegems.com${article.url}`,
  "datePublished": article.publishedTime,
  "dateModified": article.modifiedTime || article.publishedTime,
  "author": {
    "@type": "Person",
    "name": article.author || "Daniel Etienne"
  },
  "publisher": {
    "@type": "EducationalOrganization",
    "name": "Language Gems",
    "logo": {
      "@type": "ImageObject",
      "url": "https://languagegems.com/images/logo.png"
    }
  },
  "image": article.image ? `https://languagegems.com${article.image}` : "https://languagegems.com/images/og-default.jpg",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://languagegems.com${article.url}`
  }
});
