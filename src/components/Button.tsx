import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight } from 'lucide-react';

const buttonVariants = cva(
  'group inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:opacity-90 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        outline:
          'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1.5',
        lg: 'px-6 py-3',
        full: 'w-full px-4 py-2',
        icon: 'size-14 rounded-full p-2',
      },
      scale: {
        true: 'hover:scale-110',
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
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={buttonVariants({ variant, size, scale, className })}>
      {children}
      {cta && (
        <ChevronRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
      )}
    </button>
  );
}
