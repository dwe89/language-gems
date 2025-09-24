import './globals.css'
import type { Metadata } from 'next'
import { Inter, Cinzel, Pirata_One } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import ClientLayout from './components/ClientLayout'
import { Suspense } from 'react'
import { AuthProvider } from '../components/auth/AuthProvider'
import { CartProvider } from '../contexts/CartContext'
import SupabaseProvider from '../components/supabase/SupabaseProvider'
import { ThemeProvider } from '../components/theme/ThemeProvider'
import { ToastProvider } from '../components/ui/use-toast';
import { StructuredData } from '../components/seo/SEOWrapper'
import { getOrganizationSchema, getWebsiteSchema } from '../lib/seo/structuredData'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

const pirataOne = Pirata_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pirata',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GCSE Language Learning Games | Interactive Vocabulary Platform | Language Gems',
    template: '%s | Language Gems'
  },
  description: 'Transform GCSE language learning with 15+ interactive games, adaptive vocabulary practice, and comprehensive teacher analytics. Trusted by UK schools for Spanish, French, and German education.',
  keywords: [
    'GCSE language learning',
    'interactive vocabulary games',
    'educational language games',
    'Spanish learning games',
    'French learning games',
    'German learning games',
    'language learning platform',
    'gamified language learning',
    'vocabulary practice games',
    'MFL teaching resources'
  ],
  authors: [{ name: 'Daniel Etienne', url: 'https://languagegems.com/about' }],
  creator: 'Daniel Etienne',
  publisher: 'Language Gems',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://languagegems.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Language Gems - Interactive GCSE Language Learning Games',
    description: 'Transform GCSE language learning with 15+ interactive games, adaptive vocabulary practice, and comprehensive teacher analytics.',
    url: 'https://languagegems.com',
    siteName: 'Language Gems',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Language Gems - Interactive Language Learning Platform',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Language Gems - Interactive GCSE Language Learning Games',
    description: 'Transform GCSE language learning with 15+ interactive games and adaptive vocabulary practice.',
    images: ['/images/og-default.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Global structured data
  const globalStructuredData = [
    getOrganizationSchema(),
    getWebsiteSchema()
  ];

  return (
        <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" defer></script>
      </head>
      <body className={`${inter.variable} ${cinzel.variable} ${pirataOne.variable} font-sans`}>
        <StructuredData data={globalStructuredData} />
        <SupabaseProvider>
          <AuthProvider>
            <CartProvider>
              <ThemeProvider>
                <ToastProvider>
                  <Suspense fallback={<div>Loading...</div>}>
                    <ClientLayout>{children}</ClientLayout>
                  </Suspense>
                </ToastProvider>
              </ThemeProvider>
            </CartProvider>
          </AuthProvider>
        </SupabaseProvider>
        <Analytics />
        <Script src="/console-tests.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
