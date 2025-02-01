'use client';

import React from 'react';

import { cn } from '@/lib/utils';

export const Marquee = ({
  className,
  reverse,
  children,
}: {
  className?: string;
  reverse?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'flex w-full overflow-hidden [--duration:40s] [--gap:1rem]',
        className
      )}>
      <div
        className={cn(
          'flex w-max animate-marquee items-stretch gap-[--gap] hover:paused',
          reverse && 'animate-marquee-reverse'
        )}>
        <div className='flex items-center gap-[--gap]'>{children}</div>
        <div className='flex items-center gap-[--gap]'>{children}</div>
      </div>
    </div>
  );
};
