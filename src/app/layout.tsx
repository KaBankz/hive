import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@/app/globals.css';

import { ChatButton } from '@/components/ChatButton';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PdfProvider } from '@/context/PdfContext';
import { createClient } from '@/utils/supabase/server';

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
    <html lang='en'>
      <head>
        <link rel='icon' href='/icon.png' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased dark:bg-black`}>
        <PdfProvider>
          <div className='flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gradient-to-b dark:from-black dark:to-zinc-900 dark:text-white'>
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />
            {user && <ChatButton />}
          </div>
        </PdfProvider>
      </body>
    </html>
  );
}
