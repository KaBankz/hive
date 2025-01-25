import Link from 'next/link';

import { ChevronRight, Mail } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 dark:from-zinc-950 dark:via-zinc-950 dark:to-black'>
      <div className='w-full max-w-lg text-center'>
        <div className='flex justify-center'>
          <div className='flex size-20 items-center justify-center rounded-2xl bg-blue-50 dark:bg-gradient-to-b dark:from-blue-500/10 dark:to-blue-600/10'>
            <Mail className='size-10 text-blue-500' />
          </div>
        </div>

        <h1 className='mt-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400'>
          Check your email
        </h1>
        <p className='mx-auto mt-4 max-w-md text-base text-gray-600 dark:text-zinc-400'>
          We&apos;ve sent you a confirmation link. Please check your email and
          click the link to activate your account.
        </p>

        <div className='mt-10 flex justify-center'>
          <Link
            href='/'
            className='group inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
            Return to Home
            <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </div>
      </div>
    </div>
  );
}
