import { NumberTicker } from '@/components/ui/number-ticker';

export function Impact() {
  const impactList = [
    'Save 2+ hours daily on report creation',
    'Ensure consistency across all project documentation',
    'Access insights with AI-powered analysis',
    'Collaborate seamlessly with your entire team',
  ];
  const realResults = [
    ['Time Saved', 16, ' hrs/week'],
    ['Report Quality', 94, ' %'],
    ['Project Compliance', 100, ' %'],
    ['Cost Reduction', 45, ' %'],
  ];
  return (
    <section className='relative mx-auto max-w-7xl px-4 py-24 sm:px-6'>
      <div className='grid gap-12 lg:grid-cols-2 lg:gap-8'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
            Why Construction Teams Love Hive
          </h2>
          <p className='mt-4 text-lg text-zinc-400'>
            Construction reporting shouldn&apos;t be a burden. Hive makes your
            daily reporting workflow into a breeze.
          </p>
          <div className='mt-8 space-y-4'>
            {impactList.map((point) => (
              <div key={point} className='flex items-center gap-3'>
                <div className='flex-none rounded-full bg-blue-500/10 p-1'>
                  <div className='size-2 rounded-full bg-blue-500' />
                </div>
                <p className='text-zinc-300'>{point}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-8'>
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10' />
          <div className='relative'>
            <h3 className='text-xl font-semibold text-white'>Real Results</h3>
            <dl className='mt-8 grid grid-cols-2 gap-6'>
              {realResults.map(([label, value, suffix]) => (
                <div key={label}>
                  <dt className='text-sm text-zinc-400'>{label}</dt>
                  <dd className='mt-1 text-3xl font-semibold text-blue-500'>
                    <NumberTicker
                      value={Number(value)}
                      delay={0.5}
                      className='text-white'
                    />
                    {suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
