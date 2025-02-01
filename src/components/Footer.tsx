import Image from 'next/image';
import Link from 'next/link';

import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className='relative mt-12 border-t border-zinc-800/50 bg-zinc-900/30'>
      <div className='mx-auto max-w-7xl px-6 py-8 lg:px-8'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-start justify-between gap-8 sm:flex-row'>
            <div className='flex flex-col items-start gap-6 sm:max-w-[280px]'>
              <div className='flex items-center gap-2.5'>
                <Image
                  src='/hive.png'
                  alt='Hive Logo'
                  width={32}
                  height={32}
                  className='rounded-lg'
                />
                <span className='text-base font-semibold text-white'>Hive</span>
              </div>
              <p className='text-sm leading-normal text-zinc-400'>
                Empowering construction managers with next-generation project
                management tools.
              </p>
            </div>

            <nav className='flex w-full flex-col gap-8 sm:grid sm:w-auto sm:grid-cols-2 sm:gap-x-16 md:grid-cols-3 md:gap-x-24'>
              <div className='flex flex-col gap-3'>
                <span className='text-sm font-medium text-white'>Product</span>
                <div className='flex flex-col gap-2.5'>
                  <Link
                    href='/#features'
                    className='text-sm text-zinc-400 transition-colors hover:text-white'>
                    Features
                  </Link>
                  <Link
                    href='#'
                    className='text-sm text-zinc-400 transition-colors hover:text-white'>
                    About
                  </Link>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <span className='text-sm font-medium text-white'>Company</span>
                <div className='flex flex-col gap-2.5'>
                  <Link
                    href='#'
                    className='text-sm text-zinc-400 transition-colors hover:text-white'>
                    Contact
                  </Link>
                  <Link
                    href='#'
                    className='text-sm text-zinc-400 transition-colors hover:text-white'>
                    Team
                  </Link>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <span className='text-sm font-medium text-white'>Legal</span>
                <div className='flex flex-col gap-2.5'>
                  <Link
                    href='#'
                    className='text-sm text-zinc-400 transition-colors hover:text-white'>
                    Privacy
                  </Link>
                  <Link
                    href='#'
                    className='text-sm text-zinc-400 transition-colors hover:text-white'>
                    Terms
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          <div className='flex flex-col-reverse items-start justify-between gap-4 border-t border-zinc-800/50 pt-4 sm:flex-row sm:items-center'>
            <p className='text-sm text-zinc-400'>
              © {new Date().getFullYear()} Hive. All rights reserved.
            </p>
            <a
              href='https://github.com/kabankz/hive'
              className='group rounded-lg border border-zinc-700 p-1.5 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'>
              <Github className='size-4 text-zinc-400 transition-colors group-hover:text-white' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
