import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Harglim Publishers | Discover Your Next Great Read',
    template: '%s | Harglim Publishers',
  },
  description:
    'Publish your book or discover amazing reads from talented authors. Harglim Publishers - Where stories come to life.',
  keywords: [
    'book publishing',
    'authors',
    'books',
    'publishing house',
    'Indian publishers',
    'self publishing',
    'ebooks',
  ],
  authors: [{ name: 'Harglim Publishers' }],
  creator: 'Harglim Publishers',
  publisher: 'Harglim Publishers',
  openGraph: {
    title: 'Harglim Publishers',
    description: 'Discover Your Next Great Read',
    url: 'https://harglim.com',
    siteName: 'Harglim Publishers',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harglim Publishers',
    description: 'Discover Your Next Great Read',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
