import Link from 'next/link';

import { AlertCircle, ChevronRight, Home } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 dark:from-zinc-950 dark:via-zinc-950 dark:to-black'>
      <div className='w-full max-w-lg text-center'>
        <div className='flex justify-center'>
          <div className='flex size-20 items-center justify-center rounded-2xl bg-red-50 dark:bg-gradient-to-b dark:from-red-500/10 dark:to-red-600/10'>
            <AlertCircle className='size-10 text-red-500' />
          </div>
        </div>

        <h1 className='mt-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400'>
          Something went wrong
        </h1>
        <p className='mx-auto mt-4 max-w-md text-base text-gray-600 dark:text-zinc-400'>
          We apologize for the inconvenience. Please return to the homepage.
        </p>

        <div className='mt-10 flex justify-center'>
          <Link
            href='/'
            className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
            <Home className='size-4' />
            Back to Home
            <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </div>
      </div>
    </div>
  );
}
