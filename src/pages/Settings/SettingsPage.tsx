import { LogOut, Shield } from 'lucide-react';
import { PageHeader } from '@/shared/components/Layout/PageHeader';
import { ThemeToggle } from '@/shared/components/ThemeToggle/ThemeToggle';
import { useAuth } from '@/shared/context/AuthContext';
import { APP_CONFIG } from '@/config/app.config';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
      {title}
    </h2>
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-sidebar-bg)] divide-y divide-[var(--color-border)]">
      {children}
    </div>
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between px-4 py-3">{children}</div>
);

const SettingsPage = () => {
  const { user, role, signOut } = useAuth();

  return (
    <div className="p-6 max-w-xl">
      <PageHeader title="Settings" subtitle="Account and app preferences" />

      <div className="space-y-8">
        {/* Profile */}
        <Section title="Profile">
          <Row>
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? 'User'}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white font-semibold text-sm">
                  {user?.displayName?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {user?.displayName ?? 'Unknown'}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-xs font-semibold">
              <Shield className="h-3 w-3" />
              {role}
            </div>
          </Row>
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <Row>
            <span className="text-sm text-[var(--color-text-primary)]">Theme</span>
            <ThemeToggle compact />
          </Row>
        </Section>

        {/* App info */}
        <Section title="About">
          <Row>
            <span className="text-sm text-[var(--color-text-primary)]">Version</span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              v{APP_CONFIG.version} — Stage {APP_CONFIG.stage}
            </span>
          </Row>
          <Row>
            <span className="text-sm text-[var(--color-text-primary)]">App</span>
            <span className="text-sm text-[var(--color-text-secondary)]">{APP_CONFIG.tagline}</span>
          </Row>
        </Section>

        {/* Account actions */}
        <Section title="Account">
          <Row>
            <span className="text-sm text-[var(--color-text-primary)]">Sign out</span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:border-[var(--color-error)] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </Row>
        </Section>
      </div>
    </div>
  );
};

export default SettingsPage;
