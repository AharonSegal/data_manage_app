/**
 * AccessDenied.tsx — shown to authenticated users without admin role.
 * Deliberately vague (displays "404") to avoid revealing that access control exists.
 * Provides a subtle sign-out link for pending/blocked users.
 */

import { useAuth } from '@/shared/context/AuthContext';

export const AccessDenied = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] select-none">
      <div className="text-center">
        <p className="text-[120px] font-black leading-none text-[var(--color-text-primary)] opacity-10">
          404
        </p>
        <p className="text-lg font-medium text-[var(--color-text-secondary)] -mt-4">
          Nothing here.
        </p>
      </div>

      {/* Small sign-out hint for pending users — not obvious, just functional */}
      {user && (
        <button
          onClick={signOut}
          className="mt-16 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors underline-offset-2 hover:underline"
        >
          Sign out
        </button>
      )}
    </div>
  );
};
