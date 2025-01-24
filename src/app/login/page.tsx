'use client';

import Link from 'next/link';

import { login } from './actions';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-2xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>Welcome Back</h1>
          <p className='mt-2 text-gray-600'>Please sign in to your account</p>
        </div>

        <form action={login} className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <input
              id='email'
              type='email'
              name='email'
              className='mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-black shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              placeholder='you@example.com'
              required
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              id='password'
              type='password'
              name='password'
              className='mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-black shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              placeholder='••••••••'
              required
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                type='checkbox'
                className='size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-gray-700'>
                Remember me
              </label>
            </div>
            <Link
              href='/forgot-password'
              className='text-sm font-medium text-blue-600 hover:text-blue-500'>
              Forgot password?
            </Link>
          </div>

          <button
            type='submit'
            className='flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
            Sign in
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
