import Link from 'next/link';

import {
  ChevronRight,
  Clock,
  FileText,
  LayoutDashboard,
  PieChart,
  Users,
} from 'lucide-react';

export default function Home() {
  return (
    <div className='relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-black'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-500/20 dark:via-transparent dark:to-transparent'></div>
      <div className='relative mx-auto max-w-7xl px-4 pt-32 sm:px-6 lg:pt-40'>
        <div className='text-center'>
          <h1 className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text pb-4 text-5xl font-bold tracking-tight text-transparent sm:text-7xl dark:from-white dark:to-zinc-400'>
            Construction Management,
            <br />
            Reimagined
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-zinc-400'>
            The most powerful dashboard for construction managers. Track
            projects, manage resources, and make data-driven decisions in
            real-time.
          </p>
          <div className='mt-10 flex items-center justify-center gap-4'>
            <Link
              href='/auth/signup'
              className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
              Start your free trial
              <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
            <Link
              href='#'
              className='group inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
              Request demo
              <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid gap-8 py-32 sm:grid-cols-2 lg:grid-cols-3'>
          {[
            {
              icon: LayoutDashboard,
              title: 'Real-time Progress Tracking',
              description:
                'Monitor construction progress with live updates and detailed analytics.',
            },
            {
              icon: Users,
              title: 'Resource Management',
              description:
                'Efficiently allocate workers, equipment, and materials across projects.',
            },
            {
              icon: Clock,
              title: 'Smart Scheduling',
              description:
                "AI-powered scheduling that adapts to your project's changing needs.",
            },
            {
              icon: FileText,
              title: 'Document Control',
              description:
                'Centralized storage for plans, permits, and project documentation.',
            },
            {
              icon: PieChart,
              title: 'Cost Monitoring',
              description:
                'Track budgets and expenses with powerful financial tools.',
            },
            {
              icon: Users,
              title: 'Team Collaboration',
              description:
                'Keep everyone aligned with built-in communication tools.',
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
    </div>
  );
}
