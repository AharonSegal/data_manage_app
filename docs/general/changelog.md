# Changelog

## Stage 1 — App Shell + Notes UI (complete)

Initial scaffold: Vite + React 19 + TypeScript strict mode + Tailwind CSS v3.

### Built
- CSS variable design token system (`theme.css`) — all colors defined once
- Flash-prevention inline script in `index.html` (theme before React loads)
- Path alias `@/` → `./src/` (Vite + TypeScript)
- VS Code-style collapsible sidebar (shadcn Sidebar, Framer Motion animations)
- Light/dark theme toggle — persists to localStorage, respects system preference
- React Router v7 with `createBrowserRouter`, all paths as constants
- Notes UI: split-panel layout, BlockNote editor (shadcn variant), NoteCard, NotesList
- RTL/Hebrew support on editor (`dir="auto"`)
- Sonner toast notifications
- All page stubs: Dashboard, Activity Log, Settings, Certificates (5 pages), Project B (4 pages), 404
- All shadcn/ui components hand-crafted: Button, Badge, Separator, Tooltip, Sheet, Sidebar, Collapsible

### State at end of Stage 1
- Notes were in-memory only (no persistence)
- No authentication
- No Firebase connection

---

## Stage 2 — Firebase, Auth, Persistence, Android (complete)

### Built
- Firebase Firestore connected with offline-first persistence (`persistentLocalCache`, multi-tab)
- Notes migrated from mock data → real Firestore flat collection (`notes/`)
- Real-time `onSnapshot` listener — notes sync instantly across tabs/devices
- Debounced Firestore writes (1s after typing stops)
- Firebase Auth: Google Sign-In, `onAuthStateChanged`, role check via `users/{uid}`
- Role system: `admin` / `pending` / `blocked` — only admins see the app
- LoginPage, AccessDenied wall
- Firestore security rules — role-protected, no self-escalation
- Firebase Hosting deployed: `data-manage-app-19d66.web.app`
- Capacitor Android config — `com.asegal.datacenter`, same Firestore DB, skips auth via `IS_NATIVE`

---

## Base System Polish (complete)

### Built
- Settings page: Google avatar, name, email, role badge, theme toggle, app version, sign out
- Sidebar user profile: avatar + name in footer above ThemeToggle
- ThemeToggle compact variant (for Settings page)
- Error boundary: React class component, retry + reload buttons
- Loading skeletons: `Skeleton`, `SkeletonCard`, `SkeletonPage`
- `usePageTitle` hook — browser tab reflects current page, wired into `PageHeader`
- `services/` infrastructure: Gmail (OAuth2 + Nodemailer) + WhatsApp (Twilio), both with `sendX()` functions

---

## Notes Enhancements (complete)

### Built
- Dashboard becomes all-notes master view (all projects combined)
- Note label/project selector in editor — reassign any note to any project
- `projects.ts` auto-derived from `nav.ts` — add project to nav, it appears in selector
- Project label badge on NoteCard (visible in Dashboard all-notes view)
- BlockNote custom FormattingToolbar with Copy selection button
- `updateNoteProject()` added to NotesContext + Firestore

---

## Documentation + Services Infrastructure (complete)

### Built
- `docs/` folder — all markdown organized, nothing scattered
- `services/` package: Gmail + WhatsApp fully configured, zero TypeScript errors
- `basestate.md` — comprehensive 16-section base documentation
- `.env.example` files (root + services) — credential templates
