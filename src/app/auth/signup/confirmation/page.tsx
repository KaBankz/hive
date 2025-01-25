import Link from 'next/link';

import { ChevronRight, Mail } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-950 to-black px-4'>
      <div className='w-full max-w-lg text-center'>
        <div className='flex justify-center'>
          <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-500/10 to-blue-600/10'>
            <Mail className='h-10 w-10 text-blue-500' />
          </div>
        </div>

        <h1 className='mt-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent'>
          Check your email
        </h1>
        <p className='mx-auto mt-4 max-w-md text-base text-zinc-400'>
          We&apos;ve sent you a confirmation link. Please check your email and
          click the link to activate your account.
        </p>

        <div className='mt-10 flex justify-center'>
          <Link
            href='/'
            className='group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl transition-all duration-200 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
            Return to Home
            <ChevronRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </div>
      </div>
    </div>
  );
}
