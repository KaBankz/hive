'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  ChevronRight,
  Download,
  FileText,
  GripVertical,
  LayoutDashboard,
  PenLine,
  Settings2,
} from 'lucide-react';

import { Testimonials } from '@/components/Testimonials';
import { BorderBeam } from '@/components/ui/border-beam';
import { NumberTicker } from '@/components/ui/number-ticker';

export default function Home() {
  return (
    <div className='relative min-h-screen bg-zinc-950'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-800/20 via-transparent to-transparent'></div>
      <div className='relative mx-auto max-w-7xl px-4 pt-32 sm:px-6 lg:pt-40'>
        <div className='text-center'>
          <h1 className='bg-gradient-to-r from-white to-zinc-400 bg-clip-text pb-4 text-5xl font-bold tracking-tight text-transparent sm:text-7xl'>
            Construction Reporting
            <br />
            Redefined
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg text-zinc-400'>
            Create professional construction reports in minutes with our
            intuitive drag-and-drop editor and customizable templates.
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
        <div className='bg-background relative mx-auto mt-[17vh] flex w-fit flex-col items-center justify-center overflow-hidden rounded-lg border dark:border-white/10 md:shadow-xl'>
          <Image
            src='/images/dash.jpg'
            alt='Dashboard'
            className='rounded-lg'
            width={1500}
            height={1500}
          />
          <BorderBeam size={250} duration={12} delay={9} />
        </div>

        <section className='relative mx-auto max-w-7xl px-4 py-24 sm:px-6'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-8'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
                Why Construction Teams Love Hive
              </h2>
              <p className='mt-4 text-lg text-gray-600 dark:text-zinc-400'>
                Construction reporting shouldn't be a burden. Hive makes your
                daily reporting workflow into a breeze.
              </p>
              <div className='mt-8 space-y-4'>
                {[
                  'Save 2+ hours daily on report creation',
                  'Ensure consistency across all project documentation',
                  'Access insights with AI-powered analysis',
                  'Collaborate seamlessly with your entire team',
                ].map((point) => (
                  <div key={point} className='flex items-center gap-3'>
                    <div className='flex-none rounded-full bg-blue-500/10 p-1'>
                      <div className='h-2 w-2 rounded-full bg-blue-500' />
                    </div>
                    <p className='text-gray-700 dark:text-zinc-300'>{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='relative rounded-2xl border border-gray-200 bg-white p-8 dark:border-white/10 dark:bg-white/5'>
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5' />
              <div className='relative'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Real Results
                </h3>
                <dl className='mt-8 grid grid-cols-2 gap-6'>
                  {[
                    ['Time Saved', 16, ' hrs/week'],
                    ['Report Quality', 94, ' %'],
                    ['Project Compliance', 100, ' %'],
                    ['Cost Reduction', 45, ' %'],
                  ].map(([label, value, suffix]) => (
                    <div key={label}>
                      <dt className='text-sm text-gray-500 dark:text-zinc-400'>
                        {label}
                      </dt>
                      <dd className='mt-1 text-3xl font-semibold text-blue-500'>
                        <NumberTicker value={Number(value)} />
                        {suffix}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <div className='grid gap-8 py-32 sm:grid-cols-2 lg:grid-cols-3'>
          {[
            {
              icon: GripVertical,
              title: 'Drag & Drop Editor',
              description:
                'Easily reorganize report sections with intuitive drag-and-drop functionality.',
            },
            {
              icon: Download,
              title: 'PDF Export',
              description:
                'Generate professional PDF reports with a single click for easy sharing.',
            },
            {
              icon: LayoutDashboard,
              title: 'Customizable Templates',
              description:
                'Start with pre-built templates or create your own to match your needs.',
            },
            {
              icon: Settings2,
              title: 'Section Controls',
              description:
                'Show or hide report sections instantly to create the perfect layout.',
            },
            {
              icon: PenLine,
              title: 'Rich Content Editor',
              description:
                'Add photos, signatures, and detailed notes to your reports.',
            },
            {
              icon: FileText,
              title: 'Smart Forms',
              description:
                'Auto-populate fields and validate data for accurate reporting.',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className='group rounded-2xl border border-gray-200 bg-white p-8 transition duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:bg-white/[0.02] dark:hover:border-white/[0.2] dark:hover:bg-white/[0.04]'>
                <Icon className='mb-4 size-8 text-blue-500' />
                <h3 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
                  {feature.title}
                </h3>
                <p className='text-sm text-gray-600 dark:text-zinc-400'>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <Testimonials />
    </div>
  );
}
