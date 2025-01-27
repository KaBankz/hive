'use client';

import { useActionState } from 'react';
import Link from 'next/link';

import { ChevronRight, Mail } from 'lucide-react';

import { signup } from '@/app/(auth)/signup/actions';

const initialState = {
  confirmationSent: false,
  error: '',
};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state.confirmationSent) {
    return <ConfirmationMessage />;
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 dark:from-zinc-950 dark:via-zinc-950 dark:to-black'>
      <div className='w-full max-w-sm'>
        <div className='text-center'>
          <h1 className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text pb-4 text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400'>
            Create an Account
          </h1>
          <p className='text-sm text-gray-600 dark:text-zinc-400'>
            Join thousands of construction managers using Hive
          </p>
        </div>

        <form action={formAction} className='mt-8 space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 dark:text-zinc-400'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              required
              className='mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:hover:border-white/20'
              placeholder='you@company.com'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 dark:text-zinc-400'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              required
              className='mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:hover:border-white/20'
              placeholder='Create a strong password'
            />
          </div>

          <div className='flex items-center'>
            <input
              id='terms'
              name='terms'
              type='checkbox'
              required
              className='size-4 rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500 focus:ring-offset-0 dark:border-white/10 dark:bg-white/5'
            />
            <label
              htmlFor='terms'
              className='ml-2 block text-sm text-gray-600 dark:text-zinc-400'>
              I agree to the{' '}
              <Link
                href='#'
                className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='#'
                className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'>
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type='submit'
            disabled={pending}
            className='group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
            Create Account
            <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </button>
        </form>

        {state.error && (
          <div className='mt-4 text-center text-sm text-red-500'>
            {state.error}
          </div>
        )}

        <p className='mt-6 text-center text-sm text-gray-600 dark:text-zinc-400'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const ConfirmationMessage = () => {
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
};
