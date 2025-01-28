'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Marquee } from '@/components/magicui/marquee';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: "Hive has transformed how we handle daily reporting. What used to take hours now takes minutes.",
    author: "Sarah Chen",
    role: "Project Manager",
    company: "BuildTech Solutions",
    image: "https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Sarah"
  },
  {
    quote: "The drag-and-drop editor is a game-changer. Our reports are now consistent and professional.",
    author: "Michael Rodriguez",
    role: "Site Supervisor",
    company: "Rodriguez Construction",
    image: "https://api.dicebear.com/7.x/notionists/png?scale=200&seed=Michael"
  },
  {
    quote: "The AI assistant helps us catch issues before they become problems. It's like having an extra PM.",
    author: "James Wilson",
    role: "Operations Director",
    company: "Wilson & Associates",
    image: "https://api.dicebear.com/7.x/notionists/png?scale=200&seed=James"
  }
];

const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <div className={cn(
      "relative w-[400px] rounded-2xl border p-8 mx-4",
      "border-gray-200 bg-white dark:border-white/10 dark:bg-white/5"
    )}>
      <div className="flex items-center gap-4">
        <Image
          src={testimonial.image}
          alt={testimonial.author}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {testimonial.author}
          </div>
          <div className="text-sm text-gray-500 dark:text-zinc-400">
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>
      <blockquote className="mt-6 text-gray-700 dark:text-zinc-300">
        "{testimonial.quote}"
      </blockquote>
    </div>
  );
};

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Trusted by Construction Leaders
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 dark:text-zinc-400"
          >
            See how construction professionals are transforming their reporting workflow
          </motion.p>
        </div>

        <div className="relative mt-16">
          <Marquee className="[--duration:40s]">
            {firstRow.map((testimonial) => (
              <TestimonialCard key={testimonial.author} testimonial={testimonial} />
            ))}
          </Marquee>
          <Marquee reverse className="mt-8 [--duration:40s]">
            {secondRow.map((testimonial) => (
              <TestimonialCard key={testimonial.author} testimonial={testimonial} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-50 dark:from-zinc-900"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-50 dark:from-zinc-900"></div>
        </div>
      </div>
    </section>
  );
} 