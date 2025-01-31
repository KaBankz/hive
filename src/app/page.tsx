'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { Features } from '@/components/Features';
import { Impact } from '@/components/Impact';
import { Testimonials } from '@/components/Testimonials';
import { BorderBeam } from '@/components/ui/border-beam';

export default function Home() {
  return (
    <div className='relative min-h-screen bg-zinc-950'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-800/20 via-transparent to-transparent'></div>
      <div className='relative mx-auto max-w-7xl px-4 pt-32 sm:px-6 lg:pt-[28vh]'>
        <div className='text-center'>
          <h1 className='bg-gradient-to-r from-white to-zinc-400 bg-clip-text pb-4 text-5xl font-bold tracking-tight text-transparent sm:text-7xl'>
            Construction Reporting
            <br />
            Redefined
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg text-zinc-400'>
            Stop skipping your daily reports! Create professional construction
            reports in minutes with our intuitive drag-and-drop editor.
          </p>
          <div className='mt-10 flex items-center justify-center gap-4'>
            <Link
              href='/signup'
              className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
              Get Started
              <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
          </div>
        </div>
        <div className='relative mx-auto mt-[15vh] flex w-fit flex-col items-center justify-center overflow-hidden rounded-lg border dark:border-white/10 md:shadow-xl'>
          <Image
            src='/images/dash.jpg'
            alt='Dashboard'
            className='rounded-lg'
            width={1500}
            height={1500}
          />
          <BorderBeam size={250} duration={12} delay={9} />
        </div>
        <Features />
        <Impact />
      </div>
      <Testimonials />
    </div>
  );
}
