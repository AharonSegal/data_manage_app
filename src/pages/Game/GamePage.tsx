/**
 * GamePage.tsx — wrapper page for the Munch Monsters Phaser game.
 * Centers the game canvas inside the main content area with a dark backdrop.
 */

import { lazy, Suspense } from 'react';

const MunchMonstersGame = lazy(() => import('./MunchMonstersGame'));

const GamePage = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[720px] bg-[#060412] overflow-hidden">
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--color-brand)] border-t-transparent animate-spin" />
          <p className="text-sm font-mono text-[#aabbff]">Loading game engine…</p>
        </div>
      }
    >
      <MunchMonstersGame />
    </Suspense>
  </div>
);

export default GamePage;
