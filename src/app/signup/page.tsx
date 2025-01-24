'use client';

import { useState } from 'react';
import Link from 'next/link';

import { signup } from './actions';

export default function SignupPage() {
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    await signup(formData);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-2xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>Create Account</h1>
          <p className='mt-2 text-gray-600'>Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
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
              minLength={8}
            />
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700'>
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              name='confirmPassword'
              className='mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-black shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              placeholder='••••••••'
              required
              minLength={8}
            />
            {passwordError && (
              <p className='mt-1 text-sm text-red-600'>{passwordError}</p>
            )}
          </div>

          <div className='flex items-center'>
            <input
              id='terms'
              type='checkbox'
              name='terms'
              className='size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              required
            />
            <label htmlFor='terms' className='ml-2 block text-sm text-gray-700'>
              I agree to the{' '}
              <Link
                href='/terms'
                className='font-medium text-blue-600 hover:text-blue-500'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy'
                className='font-medium text-blue-600 hover:text-blue-500'>
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type='submit'
            className='flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
            Create Account
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
