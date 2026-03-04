import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-brand-subtle)] text-[var(--color-brand)] hover:opacity-80',
        secondary:
          'border-transparent bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]',
        destructive:
          'border-transparent bg-[var(--color-error-subtle)] text-[var(--color-error)]',
        outline: 'border-[var(--color-border)] text-[var(--color-text-secondary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
