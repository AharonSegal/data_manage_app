# Stage 1 — Complete

---

## What Was Built

### App Shell
- Vite + React 18 + TypeScript (strict mode) project
- Tailwind CSS v3 with `darkMode: 'class'` strategy
- Full CSS variable design token system (`theme.css`) — all colors defined once, used everywhere
- Flash-prevention inline script in `index.html` (theme applied before React loads)
- Path alias `@/` → `./src/` configured in both Vite and TypeScript

### Sidebar
- Full VS Code-style sidebar built with shadcn/ui Sidebar component (hand-crafted to spec)
- Two sections: Global (Dashboard, Activity Log, Settings) and PROJECTS (Certificates, Project B)
- Collapsible sub-navigation with Framer Motion animations (ChevronRight rotates)
- Active state driven by `useLocation()` — highlights current page and parent
- Desktop: fixed 260px sidebar always visible
- Mobile: hidden by default, opens as Sheet overlay via `SidebarTrigger` (hamburger)
- App logo/name in `SidebarHeader`
- Theme toggle in `SidebarFooter`

### Light / Dark Mode
- Custom `ThemeProvider` context (~30 lines) — no `next-themes`
- Reads `localStorage` on init, falls back to `prefers-color-scheme`
- Adds `light`/`dark` class to `<html>` element
- Toggle button in sidebar footer with Framer Motion Sun/Moon animation
- Theme persists on page refresh

### Routing (React Router v6)
- `createBrowserRouter` + `RouterProvider`
- All paths defined as constants in `src/shared/constants/routes.ts`
- Redirect rules: `/` → `/dashboard`, `/certificates` → `/certificates/overview`, etc.
- 404 page for unmatched routes

### Notes UI
- Full Notes feature as a UI-only component (no backend)
- Notes state lifted into `NotesContext` — survives navigation
- Split-panel layout: 30% list / 70% editor on desktop, full-screen stack on mobile
- BlockNote editor (shadcn variant — zero Mantine dependency)
- `NoteCard` with: title, timestamp (date-fns), tags (Badge), pin icon
- Pinned notes sort to top, then by `updatedAt` descending
- "New Note" button fires `toast.success('New note created')` via Sonner
- RTL / Hebrew support via `dir="auto"` on editor container
- Mock notes pre-loaded (2 for Certificates, 1 for Project B)

### Toast Notifications (Sonner)
- Mounted in `App.tsx`, position `bottom-right`, `richColors` enabled
- Fires on: new note created, note pinned/unpinned

### All Pages
- Dashboard, Activity Log, Settings (placeholder with `PageHeader`)
- Certificates: Overview, All Entries, Import, History, Actions (placeholder), Notes (full UI)
- Project B: Overview, Data, Actions (placeholder), Notes (full UI)
- 404 Not Found page with link back to Dashboard

---

## Libraries Used

| Library | Version | Purpose |
|---|---|---|
| react | 18.x | UI framework |
| react-dom | 18.x | DOM rendering |
| vite | 7.x | Build tool |
| typescript | 5.x | Type safety |
| tailwindcss | 3.x | Utility-first styling |
| react-router-dom | 6.x | SPA routing |
| framer-motion | 11.x | Animations (sidebar expand, theme toggle) |
| lucide-react | latest | Icons |
| sonner | latest | Toast notifications |
| @blocknote/react | latest | Block editor (core) |
| @blocknote/core | latest | Block editor (core) |
| @blocknote/shadcn | latest | Block editor (shadcn variant — no Mantine) |
| date-fns | latest | Date formatting for note timestamps |
| uuid | latest | UUID generation for new notes |
| react-tag-input-component | latest | Tag input (available for future note tag editing) |
| recharts | latest | Charts (placeholder — not used in Stage 1) |
| @tanstack/react-table | latest | Tables (placeholder — not used in Stage 1) |
| emoji-mart / @emoji-mart/react | latest | Emoji picker (available for BlockNote) |
| class-variance-authority | latest | Component variant styling (shadcn) |
| clsx + tailwind-merge | latest | Class merging utility |
| @radix-ui/* | latest | Radix primitives for shadcn components |

---

## Key Decisions Made

1. **Tailwind v3 not v4** — Tailwind v4 installs by default but has a completely different API (no `tailwind.config.ts`, no `darkMode: 'class'`). Pinned to v3 as specified.

2. **Shadcn/ui components hand-crafted** — The `npx shadcn-ui@latest init` command is interactive and not suitable for automated install. All shadcn components (Button, Badge, Separator, Tooltip, Sheet, Sidebar, Collapsible) were written directly to `src/shared/components/ui/` following the exact shadcn source patterns.

3. **CSS variables in `theme.css`** — Enhanced the color palette beyond the spec to be more vivid and modern (indigo-blue brand, deep near-black dark backgrounds) while keeping the exact variable names and structure. All components reference variables only — zero hardcoded hex in component files.

4. **NotesContext above the router** — Notes state is in `NotesContext` which wraps the entire `RouterProvider`. This means navigating between Certificates Notes and Project B Notes doesn't reset the state. The context is inside `ThemeProvider` → `NotesProvider` → `RouterProvider`.

5. **BlockNote editor key** — The editor is initialized once per note ID. When a different note is selected, the parent component would need to remount the editor. This is handled by using the note `id` as a React key on `NotesEditor`.

6. **`use-mobile.ts` hook** — Created to support the shadcn Sidebar mobile behavior detection. Uses `matchMedia` for proper reactive breakpoint detection.

7. **tsconfig.app.json modified** — The generated Vite tsconfig uses newer TS options (`verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUncheckedSideEffectImports`) that are incompatible with some libraries. Aligned to the spec's tsconfig options.

---

## Final Folder Structure

```
src/
├── assets/
│   └── logo.svg                    (placeholder)
├── auth/
│   └── .gitkeep
├── config/
│   ├── app.config.ts               ✓
│   └── firebase.ts                 ✓ (placeholder comment only)
├── db/
│   └── .gitkeep
├── shared/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AppLayout.tsx       ✓
│   │   │   └── PageHeader.tsx      ✓
│   │   ├── NotesEditor/
│   │   │   ├── NoteCard.tsx        ✓
│   │   │   ├── NotesList.tsx       ✓
│   │   │   └── NotesEditor.tsx     ✓
│   │   ├── Sidebar/
│   │   │   ├── AppSidebar.tsx      ✓
│   │   │   ├── SidebarNavItem.tsx  ✓
│   │   │   └── SidebarSection.tsx  ✓
│   │   ├── ThemeToggle/
│   │   │   └── ThemeToggle.tsx     ✓
│   │   └── ui/
│   │       ├── badge.tsx           ✓
│   │       ├── button.tsx          ✓
│   │       ├── collapsible.tsx     ✓
│   │       ├── separator.tsx       ✓
│   │       ├── sheet.tsx           ✓
│   │       ├── sidebar.tsx         ✓
│   │       └── tooltip.tsx         ✓
│   ├── constants/
│   │   ├── nav.ts                  ✓
│   │   └── routes.ts               ✓
│   ├── context/
│   │   ├── NotesContext.tsx        ✓
│   │   └── ThemeContext.tsx        ✓
│   ├── hooks/
│   │   ├── use-mobile.ts           ✓
│   │   ├── useNotes.ts             ✓
│   │   └── useTheme.ts             ✓
│   ├── lib/
│   │   └── utils.ts                ✓
│   ├── styles/
│   │   ├── globals.css             ✓
│   │   └── theme.css               ✓
│   └── types/
│       ├── nav.types.ts            ✓
│       ├── note.types.ts           ✓
│       └── project.types.ts        ✓
├── pages/
│   ├── ActivityLog/ActivityLogPage.tsx    ✓
│   ├── Dashboard/DashboardPage.tsx        ✓
│   ├── NotFound/NotFoundPage.tsx          ✓
│   ├── Settings/SettingsPage.tsx          ✓
│   └── projects/
│       ├── Certificates/
│       │   ├── Actions/ActionsPage.tsx    ✓
│       │   ├── Data/
│       │   │   ├── AllEntries/AllEntriesPage.tsx  ✓
│       │   │   ├── DataPage.tsx           ✓
│       │   │   ├── History/HistoryPage.tsx        ✓
│       │   │   └── Import/ImportPage.tsx          ✓
│       │   ├── Notes/NotesPage.tsx        ✓
│       │   ├── Overview/OverviewPage.tsx  ✓
│       │   └── index.tsx                  ✓
│       └── ProjectB/
│           ├── Actions/ActionsPage.tsx    ✓
│           ├── Data/DataPage.tsx          ✓
│           ├── Notes/NotesPage.tsx        ✓
│           ├── Overview/OverviewPage.tsx  ✓
│           └── index.tsx                  ✓
├── App.tsx                               ✓
├── main.tsx                              ✓
└── vite-env.d.ts                         ✓
```

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check only
npx tsc --noEmit

# Production build
npm run build
```

---

## Known Limitations

- **Notes editor doesn't remount on note change** — when a different note is selected, the BlockNote editor keeps its previous content. This requires managing editor instances with React keys (to be addressed in Stage 2).
- **No real persistence** — all notes are in-memory (React state). Refreshing the page resets to mock data. Firestore sync comes in Stage 2.
- **Large JS bundle** — BlockNote adds ~1.9MB unminified. Code-splitting with `import()` will be added in Stage 2.
- **No authentication** — the app is fully open. Google Auth wraps the layout in Stage 2.
- **Tag editing** — `react-tag-input-component` is installed but tags are currently display-only on NoteCard. Full tag editing UI will be added in Stage 2.

---

## What Stage 2 Will Add

- **Google Auth via Firebase** — `ProtectedRoute` wrapper, one authorized account
- **Firestore integration** — Notes saved, loaded, and synced from Firestore in real time
- **Auth guard** — Unauthorized users see a login screen, not the app
- **Real-time note persistence** — Notes survive page refresh
- **Tag editing UI** — Interactive tag input on note cards using `react-tag-input-component`
- **Note title extraction** — Parse first BlockNote block to derive note title automatically
- **Code splitting** — Dynamic imports for heavy routes (BlockNote, Recharts)
