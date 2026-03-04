import { usePageTitle } from '@/shared/hooks/usePageTitle';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  usePageTitle(title);

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
      )}
    </div>
  );
};
