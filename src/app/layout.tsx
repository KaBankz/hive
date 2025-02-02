import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import { PostHogProvider } from '@/analytics/PostHogProvider';
import { ChatButton } from '@/components/ChatButton';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PdfProvider } from '@/context/PdfContext';
import { createClient } from '@/utils/supabase/server';

import '@/app/globals.css';

// If performance is an issue, enable this and go debug :)
const ENABLE_REACT_SCAN = false;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hive - Construction Reporting Redefined',
  description: 'The most powerful reporting tool for construction managers.',
  icons: { icon: '/icon.png' },
  openGraph: {
    title: 'Hive - Construction Reporting Redefined',
    siteName: 'Hive',
    description: 'The most powerful reporting tool for construction managers.',
    images: '/og.png',
    url: 'https://hivereports.com',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang='en' className='dark'>
      <head>
        {ENABLE_REACT_SCAN && (
          <Script
            strategy='beforeInteractive'
            src='https://unpkg.com/react-scan/dist/auto.global.js'
          />
        )}
      </head>
      <PostHogProvider>
        <PdfProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} bg-black antialiased`}>
            <div className='flex min-h-screen flex-col bg-gradient-to-b from-black to-zinc-900 text-white'>
              <Header />
              <main className='flex-1'>{children}</main>
              <Footer />
              {user && <ChatButton />}
            </div>
          </body>
        </PdfProvider>
      </PostHogProvider>
    </html>
  );
}
