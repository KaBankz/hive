'use client';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { login } from './actions';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-950 to-black px-4'>
      <div className='w-full max-w-sm'>
        <div className='text-center'>
          <h1 className='bg-gradient-to-r from-white to-zinc-400 bg-clip-text pb-4 text-3xl font-bold tracking-tight text-transparent'>
            Welcome Back
          </h1>
          <p className='text-sm text-zinc-400'>
            Sign in to continue to your dashboard
          </p>
        </div>

        <form action={login} className='mt-8 space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-zinc-400'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              required
              className='mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white backdrop-blur-xl transition-colors placeholder:text-zinc-500 hover:border-white/20 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              placeholder='Enter your email'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-zinc-400'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              required
              className='mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white backdrop-blur-xl transition-colors placeholder:text-zinc-500 hover:border-white/20 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              placeholder='Enter your password'
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember'
                name='remember'
                type='checkbox'
                className='h-4 w-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0'
              />
              <label
                htmlFor='remember'
                className='ml-2 block text-sm text-zinc-400'>
                Remember me
              </label>
            </div>
            <Link href='#' className='text-sm text-zinc-400 hover:text-white'>
              Forgot password?
            </Link>
          </div>

          <button
            type='submit'
            className='group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
            Sign in
            <ChevronRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-zinc-400'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/signup'
            className='text-blue-400 hover:text-blue-300'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
