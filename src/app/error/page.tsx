import Link from 'next/link';

import { AlertCircle, ChevronRight, Home } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-950 to-black px-4'>
      <div className='w-full max-w-lg text-center'>
        <div className='flex justify-center'>
          <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-red-500/10 to-red-600/10'>
            <AlertCircle className='h-10 w-10 text-red-500' />
          </div>
        </div>

        <h1 className='mt-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent'>
          Something went wrong
        </h1>
        <p className='mx-auto mt-4 max-w-md text-base text-zinc-400'>
          We apologize for the inconvenience. Please return to the homepage.
        </p>

        <div className='mt-10 flex justify-center'>
          <Link
            href='/'
            className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
            <Home className='h-4 w-4' />
            Back to Home
            <ChevronRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </div>
      </div>
    </div>
  );
}
