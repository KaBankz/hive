import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LogOut, User } from 'lucide-react';

import { Button } from '@/components/Button';
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
        <div className='flex basis-[200px] items-center'>
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
        </div>

        <nav className='absolute left-1/2 hidden -translate-x-1/2 space-x-8 sm:flex'>
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

        <div className='flex basis-[200px] items-center justify-end space-x-4'>
          {user ? (
            <>
              <Link href='/dashboard'>
                <Button cta>Dashboard</Button>
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
              <Link href='/signup'>
                <Button cta>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
