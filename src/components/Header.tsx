import Link from 'next/link';

import { Building2, ChevronRight } from 'lucide-react';

export async function Header() {
  return (
    <header className='fixed top-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.1] dark:bg-black/30'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
        <Link
          href='/'
          className='flex items-center space-x-2 transition-opacity hover:opacity-80'>
          <Building2 className='size-6 text-blue-500' />
          <span className='text-lg font-bold text-gray-900 dark:text-white'>
            Construct It
          </span>
        </Link>
        <nav className='hidden space-x-8 sm:flex'>
          <Link
            href='#'
            className='text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'>
            Features
          </Link>
          <Link
            href='#'
            className='text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'>
            Pricing
          </Link>
          <Link
            href='#'
            className='text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'>
            About
          </Link>
        </nav>
        <Link
          href='/editor'
          className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
          Get Started
          <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
        </Link>
      </div>
    </header>
  );
}
