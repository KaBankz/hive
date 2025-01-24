import Link from 'next/link';

import { XCircle } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-2xl'>
        <div className='mb-8 text-center'>
          <div className='mb-4 inline-flex size-16 items-center justify-center rounded-full bg-red-100'>
            <XCircle className='size-8 text-red-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800'>
            Something Went Wrong
          </h1>
          <p className='mt-2 text-gray-600'>
            We encountered an error while processing your request. Please try
            again.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            href='/'
            className='flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
}
