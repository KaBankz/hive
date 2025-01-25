import Link from 'next/link';

import { Building2, Github, Linkedin, Mail, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className='relative border-t border-white/[0.1] bg-black/30 backdrop-blur-xl backdrop-saturate-150'>
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Brand Column */}
          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-2'>
              <Building2 className='h-6 w-6 text-blue-500' />
              <span className='text-lg font-bold'>Construct It</span>
            </div>
            <p className='text-sm text-zinc-400'>
              Empowering construction managers with next-generation project
              management tools.
            </p>
            <div className='flex gap-4'>
              <a
                href='https://twitter.com'
                className='text-zinc-400 transition-colors hover:text-white'>
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='https://github.com'
                className='text-zinc-400 transition-colors hover:text-white'>
                <Github className='h-5 w-5' />
              </a>
              <a
                href='https://linkedin.com'
                className='text-zinc-400 transition-colors hover:text-white'>
                <Linkedin className='h-5 w-5' />
              </a>
              <a
                href='mailto:hello@constructit.com'
                className='text-zinc-400 transition-colors hover:text-white'>
                <Mail className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400'>
              Product
            </h3>
            <ul className='space-y-3'>
              {[
                'Features',
                'Pricing',
                'Dashboard',
                'API',
                'Integration',
                'Documentation',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href='#'
                    className='text-sm text-zinc-400 transition-colors hover:text-white'>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400'>
              Company
            </h3>
            <ul className='space-y-3'>
              {['About', 'Blog', 'Careers', 'Press', 'Partners', 'Contact'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href='#'
                      className='text-sm text-zinc-400 transition-colors hover:text-white'>
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400'>
              Resources
            </h3>
            <ul className='space-y-3'>
              {[
                'Community',
                'Help Center',
                'Support',
                'Terms',
                'Privacy',
                'Status',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href='#'
                    className='text-sm text-zinc-400 transition-colors hover:text-white'>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='mt-16 border-t border-white/[0.1] pt-8'>
          <p className='text-center text-sm text-zinc-400'>
            © {new Date().getFullYear()} Construct It. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
