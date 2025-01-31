import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ChevronRight, LogOut, User } from 'lucide-react';

import { createClient } from '@/utils/supabase/server';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function handleLogout() {
    'use server';

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
  }

  return (
    <header className='fixed top-0 z-50 w-full border-b border-white/[0.1] bg-zinc-950/30 backdrop-blur-xl backdrop-saturate-150'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
        <Link
          href='/'
          className='flex items-center space-x-2 transition-opacity hover:opacity-80'>
          <Image
            src='/icon.png'
            alt='Hive'
            width={100}
            height={100}
            className='size-6'
          />
          <span className='text-lg font-bold text-white'>Hive</span>
        </Link>
        <nav className='hidden space-x-8 sm:flex'>
          <Link
            href='#'
            className='text-sm text-zinc-400 transition-colors duration-200 hover:text-white'>
            Features
          </Link>
          <Link
            href='#'
            className='text-sm text-zinc-400 transition-colors duration-200 hover:text-white'>
            Pricing
          </Link>
          <Link
            href='#'
            className='text-sm text-zinc-400 transition-colors duration-200 hover:text-white'>
            About
          </Link>
        </nav>
        <div className='flex items-center space-x-4'>
          {user ? (
            <>
              <Link
                href='/dashboard'
                className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
                Dashboard
                <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Link>
              <form action={handleLogout}>
                <button className='group flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/10'>
                  <User className='size-5 text-zinc-400 transition-all duration-200 group-hover:hidden' />
                  <LogOut className='hidden size-5 text-red-400 transition-all duration-200 group-hover:block' />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href='/login'
                className='text-sm text-zinc-400 transition-colors duration-200 hover:text-white'>
                Log in
              </Link>
              <Link
                href='/signup'
                className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
                Get Started
                <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
