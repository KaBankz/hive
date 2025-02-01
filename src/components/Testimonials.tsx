'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import { Marquee } from '@/components/magicui/marquee';

const testimonials = [
  {
    quote:
      'Hive has transformed how we handle daily reporting. What used to take hours now takes minutes.',
    author: 'Sarah Chen',
    role: 'Project Manager',
    company: 'BuildTech Solutions',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Sarah',
  },
  {
    quote:
      'The drag-and-drop editor is a game-changer. Our reports are now consistent and professional.',
    author: 'Michael Rodriguez',
    role: 'Site Supervisor',
    company: 'Rodriguez Construction',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Michael',
  },
  {
    quote:
      "The AI assistant helps us catch issues before they become problems. It's like having an extra PM.",
    author: 'James Wilson',
    role: 'Operations Director',
    company: 'Wilson & Associates',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=James',
  },
  {
    quote:
      'Safety compliance tracking has never been easier. The automated alerts are a lifesaver.',
    author: 'Emma Thompson',
    role: 'Safety Coordinator',
    company: 'Thompson Safety Solutions',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Emma',
  },
  {
    quote:
      'The real-time collaboration features have improved our team communication significantly.',
    author: 'David Park',
    role: 'Construction Manager',
    company: 'Park Builders Inc',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=David',
  },
  {
    quote:
      'Being able to access all project documentation from my phone has been revolutionary.',
    author: 'Lisa Martinez',
    role: 'Field Supervisor',
    company: 'Martinez Construction',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Lisa',
  },
  {
    quote:
      'The weather integration helps us plan our work more effectively. Great feature!',
    author: 'Robert Johnson',
    role: 'Project Coordinator',
    company: 'Johnson & Sons',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Robert',
  },
  {
    quote:
      'Document version control is seamless. No more confusion about the latest plans.',
    author: 'Anna Kim',
    role: 'Document Controller',
    company: 'Kim Construction Group',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Anna',
  },
  {
    quote:
      'The cost tracking features have helped us stay within budget on every project.',
    author: 'Thomas Brown',
    role: 'Financial Manager',
    company: 'Brown Contractors',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Thomas',
  },
  {
    quote:
      'Quality control checklists are comprehensive and easy to customize.',
    author: 'Maria Garcia',
    role: 'Quality Manager',
    company: 'Garcia Quality Control',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Maria',
  },
  {
    quote:
      'The equipment tracking system has reduced our downtime significantly.',
    author: 'Steve Anderson',
    role: 'Equipment Manager',
    company: 'Anderson Equipment',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Steve',
  },
  {
    quote:
      'Subcontractor management is streamlined. Communication has never been better.',
    author: 'Rachel Lee',
    role: 'Procurement Manager',
    company: 'Lee Enterprises',
    image: 'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Rachel',
  },
];

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) => {
  return (
    <div className='relative mx-4 w-[400px] rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-8'>
      <div className='flex items-center gap-4'>
        <Image
          src={testimonial.image}
          alt={testimonial.author}
          width={48}
          height={48}
          className='rounded-full'
        />
        <div>
          <div className='font-medium text-white'>{testimonial.author}</div>
          <div className='text-sm text-zinc-400'>
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>
      <blockquote className='mt-6 text-zinc-300'>
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
    </div>
  );
};

export function Testimonials() {
  return (
    <section className='bg-gradient-to-b from-zinc-950 to-zinc-900 py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6'>
        <div className='text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
            Trusted by Construction Leaders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='mt-4 text-lg text-zinc-400'>
            See how construction professionals are transforming their reporting
            workflow
          </motion.p>
        </div>

        <div className='relative mt-16 rounded-2xl'>
          <Marquee className='[--duration:60s]'>
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.author}
                testimonial={testimonial}
              />
            ))}
          </Marquee>
          <div className='pointer-events-none absolute inset-y-0 left-0 w-[15%] rounded-2xl bg-gradient-to-r from-zinc-950/50 via-zinc-950/10 to-transparent' />
          <div className='pointer-events-none absolute inset-y-0 right-0 w-[15%] rounded-2xl bg-gradient-to-l from-zinc-950/50 via-zinc-950/10 to-transparent' />
        </div>
      </div>
    </section>
  );
}
