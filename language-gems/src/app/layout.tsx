import type { Metadata } from "next";
import { Inter, Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../components/auth/AuthProvider';
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "LanguageGems | Learn Languages with Fun",
  description: "A multi-language learning platform for schools and individual learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${roboto.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen">
            <ClientLayout>{children}</ClientLayout>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
