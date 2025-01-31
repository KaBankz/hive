import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group inline-flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white enabled:hover:opacity-90 enabled:hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        outline:
          'rounded-full border border-gray-200 bg-white text-gray-900 enabled:hover:border-gray-300 enabled:hover:bg-gray-50 enabled:hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:enabled:hover:bg-white/10 dark:enabled:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
        toggle:
          'inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors duration-200 enabled:hover:border-gray-300 enabled:hover:bg-gray-50 dark:border-white/[0.1] dark:text-zinc-400 dark:enabled:hover:border-white/[0.2] dark:enabled:hover:bg-white/[0.02]',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-2.5 py-1.5 text-xs',
        lg: 'px-6 py-3',
        full: 'w-full rounded-full px-4 py-2',
        icon: 'size-14 rounded-full p-2',
      },
      scale: {
        true: 'enabled:hover:scale-110',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      scale: false,
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    cta?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  scale,
  cta,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={buttonVariants({ variant, size, scale, className, disabled })}>
      {children}
      {cta && (
        <ChevronRight
          className={cn('size-4 transition-transform duration-200', {
            'group-hover:translate-x-0.5': !disabled,
          })}
        />
      )}
    </button>
  );
}
