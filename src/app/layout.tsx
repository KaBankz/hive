import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ChatButton } from '@/components/ChatButton';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PdfProvider } from '@/context/PdfContext';
import { CSPostHogProvider } from '@/context/PosthogProvider';
import { createClient } from '@/utils/supabase/server';

import '@/app/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hive - Construction Management Reimagined',
  description:
    'The most powerful dashboard for construction managers. Track projects, manage resources, and make data-driven decisions in real-time.',
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
        <link rel='icon' href='/icon.png' />
      </head>
      <CSPostHogProvider>
        <PdfProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} bg-black antialiased`}>
            <div className='flex min-h-screen flex-col bg-gradient-to-b from-black to-zinc-900 text-white'>
              <Header />
              <main className='flex-1'>{children}</main>
              <Footer />
              {process.env.NODE_ENV === 'development' && user && <ChatButton />}
            </div>
          </body>
        </PdfProvider>
      </CSPostHogProvider>
    </html>
  );
}
