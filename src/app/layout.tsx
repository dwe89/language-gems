import './globals.css'
import type { Metadata } from 'next'
import { Inter, Cinzel, Pirata_One } from 'next/font/google'
import ClientLayout from './components/ClientLayout'
import { Suspense } from 'react'
import { AuthProvider } from '../components/auth/AuthProvider'
import SupabaseProvider from '../components/supabase/SupabaseProvider'

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
  title: 'LanguageGems',
  description: 'An innovative language learning platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} ${pirataOne.variable} font-sans`}>
        <SupabaseProvider>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <ClientLayout>{children}</ClientLayout>
            </Suspense>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
