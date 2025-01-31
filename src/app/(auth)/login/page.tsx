'use client';

import { useActionState } from 'react';
import Link from 'next/link';

import { login } from '@/app/(auth)/login/actions';
import { Button } from '@/components/Button';

const initialState = {
  error: '',
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 dark:from-zinc-950 dark:via-zinc-950 dark:to-black'>
      <div className='w-full max-w-sm'>
        <div className='text-center'>
          <h1 className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text pb-4 text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400'>
            Welcome Back
          </h1>
          <p className='text-sm text-gray-600 dark:text-zinc-400'>
            Sign in to continue to your dashboard
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
              placeholder='Enter your password'
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember'
                name='remember'
                type='checkbox'
                className='size-4 rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500 focus:ring-offset-0 dark:border-white/10 dark:bg-white/5'
              />
              <label
                htmlFor='remember'
                className='ml-2 block text-sm text-gray-600 dark:text-zinc-400'>
                Remember me
              </label>
            </div>
            <Link
              href='#'
              className='text-sm text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'>
              Forgot password?
            </Link>
          </div>

          <Button
            cta
            size='full'
            className='py-2.5'
            type='submit'
            disabled={pending}>
            Sign in
          </Button>
        </form>

        {state.error && (
          <div className='mt-4 text-center text-sm text-red-500'>
            {state.error}
          </div>
        )}

        <p className='mt-6 text-center text-sm text-gray-600 dark:text-zinc-400'>
          Don&apos;t have an account?{' '}
          <Link
            href='/signup'
            className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
