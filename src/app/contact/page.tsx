import ContactPageClient from './ContactPageClient';
import SEOWrapper, { generateMetadata } from '@/components/seo/SEOWrapper';

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Contact', url: '/contact' }
];

const contactStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact LanguageGems',
  description: "Get in touch with LanguageGems for support, partnerships, enterprise inquiries, or general questions.",
  url: 'https://languagegems.com/contact',
  mainEntityOfPage: 'https://languagegems.com/contact',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@languagegems.com',
    areaServed: 'GB',
    availableLanguage: ['English', 'French', 'Spanish', 'German']
  }
};

export const metadata = generateMetadata({
  title: 'Contact Us - LanguageGems',
  description: "Contact LanguageGems for support, school partnerships, enterprise solutions, or general inquiries. We're here to help with your language learning journey.",
  canonical: '/contact',
  keywords: [
    'LanguageGems contact',
    'language learning support',
    'school language platform',
    'LanguageGems partnerships',
    'language learning help'
  ]
});

export default function ContactPage() {
  return (
    <SEOWrapper structuredData={contactStructuredData} breadcrumbs={breadcrumbs}>
      <ContactPageClient />
    </SEOWrapper>
  );
}
