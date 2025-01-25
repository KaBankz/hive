import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@/app/globals.css';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Construct It - Construction Management Reimagined',
  description:
    'The most powerful dashboard for construction managers. Track projects, manage resources, and make data-driven decisions in real-time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased dark:bg-black`}>
        <div className='flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gradient-to-b dark:from-black dark:to-zinc-900 dark:text-white'>
          <Header />
          <main className='flex-1'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
