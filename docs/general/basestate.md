# DataCenter — Base State Documentation

> **Document purpose:** Complete reference for the base system as it stands before any project-specific content is added. Every architectural decision, technology, file, capability, and design pattern that exists in the codebase is described here. Read this before touching any project-specific feature.

---

## 1. What Is This Project?

**DataCenter** is a private client project management platform. It is a personal internal tool — not a public SaaS — built to manage multiple independent projects from a single interface. Each project has its own data, actions, and notes. Automation (email, WhatsApp) will be triggered from within projects as actions.

The system runs in two modes simultaneously:
- **Web app** — hosted on Firebase Hosting, accessed in a browser, protected by Google Sign-In + role-based auth
- **Android app** — built as a native APK via Capacitor, skips auth entirely, connects to the same Firestore database

Both modes use the same React codebase. The distinction is handled at the `IS_NATIVE` flag level.

**Current version:** v1.1.0 — Base System Complete

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework (with code splitting via React.lazy + Suspense) |
| TypeScript | 5.9.3 | Type safety, strict mode |
| Vite | 7.3.1 | Build tool, dev server |
| React Router DOM | 7.13.1 | Client-side routing |
| Tailwind CSS | 3.4.19 | Utility-first styling |

### UI Components
| Library | Version | Purpose |
|---|---|---|
| shadcn/ui (Radix) | various | Accessible headless components |
| Lucide React | 0.576.0 | Icon set |
| Framer Motion | 12.34.5 | Animations |
| Sonner | 2.0.7 | Toast notifications |
| BlockNote (shadcn variant) | 0.47.1 | Rich text / block editor |
| react-tag-input-component | 2.0.2 | Inline tag editing |
| Recharts | 3.7.0 | Charts (installed, ready for dashboard) |
| @tanstack/react-table | 8.21.3 | Data tables (installed, ready for project data) |
| date-fns | 4.1.0 | Date formatting |
| emoji-mart | 5.6.0 | Emoji picker |

### Backend / Infrastructure
| Technology | Purpose |
|---|---|
| Firebase Firestore | Primary database (real-time, offline-first) — collections: `notes`, `activityLogs`, `users` |
| Firebase Auth | Google Sign-In, user identity |
| Firebase Hosting | Web deployment (`data-manage-app-19d66.web.app`) |
| Firebase Cloud Functions | HTTPS Callable endpoints for email + WhatsApp (scaffold in `functions/`) |
| Capacitor | Android APK wrapper |

### Services (server-side, `services/`)
| Library | Version | Purpose |
|---|---|---|
| Nodemailer | 8.x | Gmail sending |
| googleapis | 144.x | Gmail OAuth2 token exchange |
| Twilio | 5.x | WhatsApp sending via API |
| dotenv | 16.x | Credential loading |

### Dev Tooling
| Tool | Purpose |
|---|---|
| ESLint + typescript-eslint | Linting |
| PostCSS + Autoprefixer | CSS processing |
| `tsc -b` | Pre-build type check |

---

## 3. Repository Structure

```
data_manage_app/
│
├── src/                          # React application source
│   ├── App.tsx                   # Root — auth guard, router, providers
│   ├── main.tsx                  # Vite entry point
│   │
│   ├── config/
│   │   ├── app.config.ts         # App name, version, stage constant
│   │   ├── firebase.ts           # Firebase init (Firestore + Auth)
│   │   └── auth.config.ts        # IS_NATIVE flag + HARDCODED_UID (gitignored)
│   │
│   ├── pages/
│   │   ├── Dashboard/            # All-notes master view
│   │   ├── Notes/                # Global (General) notes only
│   │   ├── ActivityLog/          # Placeholder — Stage 2
│   │   ├── Settings/             # Full settings page
│   │   ├── NotFound/             # 404 page
│   │   └── projects/
│   │       ├── Certificates/     # Project: Certificates (stub pages)
│   │       │   ├── Overview/
│   │       │   ├── Data/
│   │       │   │   ├── AllEntries/
│   │       │   │   ├── Import/
│   │       │   │   └── History/
│   │       │   ├── Actions/
│   │       │   └── Notes/
│   │       └── ProjectB/         # Project: Project B (stub pages)
│   │           ├── Overview/
│   │           ├── Data/
│   │           ├── Actions/
│   │           └── Notes/
│   │
│   └── shared/
│       ├── components/
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx         # Google Sign-In screen
│       │   │   └── AccessDenied.tsx      # Wall for non-admin users
│       │   ├── ErrorBoundary/
│       │   │   └── ErrorBoundary.tsx     # React class error boundary
│       │   ├── Layout/
│       │   │   ├── AppLayout.tsx         # Sidebar + OfflineBar + mobile label + outlet
│       │   │   ├── Breadcrumbs.tsx       # Auto breadcrumbs from NAV_ITEMS on deep routes
│       │   │   └── PageHeader.tsx        # Title + subtitle + breadcrumbs + usePageTitle
│       │   ├── OfflineBar/
│       │   │   └── OfflineBar.tsx        # Animated offline banner (Framer Motion slide)
│       │   ├── NotesEditor/
│       │   │   ├── NoteCard.tsx          # Note list card (preview, tags, pin, delete)
│       │   │   ├── NotesList.tsx         # Scrollable note list with search + sections
│       │   │   └── NotesEditor.tsx       # Full editor (BlockNote + title + tags + toolbar)
│       │   ├── Sidebar/
│       │   │   ├── AppSidebar.tsx        # Main nav sidebar
│       │   │   ├── SidebarNavItem.tsx    # Single nav item (with children support)
│       │   │   └── SidebarSection.tsx    # Section label
│       │   ├── ThemeToggle/
│       │   │   └── ThemeToggle.tsx       # Light/Dark toggle (full + compact variant)
│       │   └── ui/                       # shadcn components
│       │       ├── badge.tsx
│       │       ├── button.tsx
│       │       ├── collapsible.tsx
│       │       ├── separator.tsx
│       │       ├── sheet.tsx
│       │       ├── sidebar.tsx
│       │       ├── skeleton.tsx          # Skeleton, SkeletonCard, SkeletonPage
│       │       └── tooltip.tsx
│       │
│       ├── constants/
│       │   ├── nav.ts            # NAV_ITEMS — all sidebar navigation items
│       │   ├── projects.ts       # PROJECTS list (derived from nav.ts) + getProjectLabel()
│       │   └── routes.ts         # ROUTES — all path constants (never hardcoded strings)
│       │
│       ├── context/
│       │   ├── ActivityContext.tsx # Activity log state + Firestore CRUD + logActivity()
│       │   ├── AuthContext.tsx   # User, role, isAdmin, signIn, signOut
│       │   ├── NotesContext.tsx  # All notes state + Firestore CRUD
│       │   └── ThemeContext.tsx  # light/dark theme state + localStorage persistence
│       │
│       ├── hooks/
│       │   ├── use-mobile.ts            # useIsMobile() — breakpoint detection
│       │   ├── useAuth.ts               # Re-export of useAuth from AuthContext
│       │   ├── useCurrentPageLabel.ts   # Derives page label from pathname (for mobile top bar)
│       │   ├── useNoteKeyboardShortcut.ts # 'N' key → create note (ignores inputs/editors)
│       │   ├── useNotes.ts              # Re-export of useNotes from NotesContext
│       │   ├── useOnlineStatus.ts       # Tracks navigator.onLine via event listeners
│       │   ├── usePageTitle.ts          # Sets document.title on mount
│       │   └── useTheme.ts              # Re-export of useTheme from ThemeContext
│       │
│       ├── styles/
│       │   ├── globals.css       # Base styles, BlockNote overrides, tag editor dark mode
│       │   └── theme.css         # All CSS color variables (light + dark)
│       │
│       └── types/
│           ├── activity.types.ts # ActivityEntry, ActivityType, ActivityStatus, Firestore variant
│           ├── nav.types.ts      # NavItem interface
│           ├── note.types.ts     # Note interface
│           └── project.types.ts  # Project-related types
│
├── services/                     # Node.js server-side services (independent package)
│   ├── gmail/
│   │   ├── config.ts             # OAuth2 credential loader
│   │   ├── transport.ts          # Nodemailer + googleapis OAuth2 transport
│   │   ├── send.ts               # sendEmail(EmailOptions) → SendResult
│   │   ├── templates/            # Empty — action templates go here
│   │   └── README.md             # OAuth2 setup walkthrough
│   ├── whatsapp/
│   │   ├── config.ts             # Twilio credential loader
│   │   ├── client.ts             # Twilio client singleton
│   │   ├── send.ts               # sendWhatsApp(WhatsAppOptions) → SendResult
│   │   ├── deeplink.ts           # createWhatsAppLink() — free fallback
│   │   └── README.md             # Twilio sandbox + production setup
│   ├── types.ts                  # SendResult, EmailOptions, WhatsAppOptions
│   ├── index.ts                  # Barrel export
│   ├── .env.example              # 7 credential placeholder vars
│   ├── package.json              # CommonJS, isolated from Vite app
│   └── tsconfig.json             # Node.js CommonJS TS config
│
├── functions/                    # Firebase Cloud Functions (Node.js 20)
│   ├── src/
│   │   ├── index.ts              # Re-exports all callable functions
│   │   ├── gmail/index.ts        # sendEmailHttp — HTTPS callable wrapping sendEmail()
│   │   └── whatsapp/index.ts     # sendWhatsAppHttp — HTTPS callable wrapping sendWhatsApp()
│   ├── package.json              # Depends on firebase-functions v6 + datacenter-services (local)
│   └── tsconfig.json             # CommonJS, ES2020
│
├── android/                      # Capacitor Android project (generated)
├── dist/                         # Vite build output (gitignored)
├── public/                       # Static assets (favicon.svg, manifest.json)
│
├── .env.local                    # Firebase config env vars (gitignored)
├── .env.example                  # Firebase env var template (safe to commit)
├── .firebaserc                   # Firebase project alias (data-manage-app-19d66)
├── .gitignore                    # Ignores: dist, node_modules, .env.local, auth.config.ts, services/.env
├── AUTH.md                       # Auth system documentation
├── basestate.md                  # This file
├── capacitor.config.ts           # Capacitor: appId, webDir, Android scheme
├── firebase.json                 # Firebase Hosting config + Firestore rules reference
├── firestore.rules               # Firestore security rules
├── package.json                  # Frontend dependencies
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TS project references
├── tsconfig.app.json             # Frontend TS config (ESNext, bundler, strict)
└── vite.config.ts                # Vite config (@/ alias, React plugin)
```

---

## 4. Authentication System

### Overview
The auth system has two completely separate flows:

**Web (browser):** Google Sign-In → Firestore role check → `admin` role required to access the app.

**Android (native):** Skips auth entirely. `IS_NATIVE = Capacitor.isNativePlatform()` returns `true`, `isAdmin` is immediately `true`, no Firebase Auth interaction.

### Web Flow — Step by Step
1. App loads → `onAuthStateChanged` listener fires
2. No user → `<LoginPage />` rendered (Google Sign-In button)
3. User signs in → listener fires again with user object
4. Fetch `users/{uid}` from Firestore:
   - **First sign-in:** document doesn't exist → create it with `role: 'pending'`
   - **Returning user:** document exists → read `role` field, update `lastLoginAt`
5. `role === 'admin'` → `isAdmin = true` → full app renders
6. `role === 'pending'` or `'blocked'` → `<AccessDenied />` rendered (silent wall, no useful info)

### Role System
| Role | Access |
|---|---|
| `admin` | Full app access |
| `pending` | Default on first sign-in — sees AccessDenied wall |
| `blocked` | Explicitly blocked — sees AccessDenied wall |

Roles are set manually via Firebase Console → Firestore → `users` collection.

### Firestore Security Rules
```
/users/{userId}
  - read:   own document only (to check role on page load)
  - create: own document only (first sign-in)
  - update: own document, CANNOT change role field (prevents privilege escalation)

/{everything else}
  - read/write: admin role only
```

### Key Files
| File | Purpose |
|---|---|
| `src/shared/context/AuthContext.tsx` | Full auth state + both flows |
| `src/config/auth.config.ts` | `IS_NATIVE` flag (gitignored) |
| `src/shared/components/auth/LoginPage.tsx` | Google Sign-In UI |
| `src/shared/components/auth/AccessDenied.tsx` | Non-admin wall |
| `firestore.rules` | Deployed security rules |
| `AUTH.md` | Extended auth documentation |

---

## 5. Database — Firestore

### Configuration
```ts
// Offline-first with multi-tab support
initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
})
```

**What this means:**
- First load: fetches from Firestore network, stores in IndexedDB
- Subsequent loads: serves from IndexedDB instantly (no loading flicker)
- Offline: reads work from cache, writes queue and sync when back online
- Multiple tabs: all tabs share the same IndexedDB cache

### Collections (current)
```
notes/                  — flat collection, all notes from all projects
  {noteId}/
    title: string
    content: string       — BlockNote JSON serialized
    createdAt: Timestamp
    updatedAt: Timestamp
    pinned: boolean
    tags: string[]
    projectId: string     — 'global' | 'certificates' | 'project-b' | any future project
    color?: string        — reserved for future color coding

activityLogs/           — activity log, most recent 100 entries
  {logId}/
    timestamp: Timestamp  — serverTimestamp() on write
    type: string          — 'email' | 'whatsapp' | 'data_import' | 'note' | 'manual' | 'system'
    description: string   — human-readable event description
    status: string        — 'success' | 'failed' | 'pending'
    projectId?: string    — optional, links entry to a project
    metadata?: object     — optional, extra context (e.g. recipient, message ID)

users/                  — user profile + role
  {uid}/
    uid: string
    email: string
    displayName: string
    photoURL: string
    role: 'admin' | 'pending' | 'blocked'
    createdAt: Timestamp
    lastLoginAt: Timestamp
```

### Real-time Listener
The entire `notes` collection has a live `onSnapshot` listener (ordered by `updatedAt desc`) running for the entire session. Any Firestore write — from any device, any tab — instantly updates the UI.

---

## 6. Notes System

The notes system is the only fully functional data feature in the base state. All other project data pages are stubs.

### Architecture
- **Single flat Firestore collection** — all notes in one place, filtered client-side by `projectId`
- **Global state** — `NotesContext` fetches all notes once and shares them across all views
- **No subcollections** — notes can be reassigned between projects without data migration

### Views
| View | Route | Notes Shown | Create Creates |
|---|---|---|---|
| **Dashboard** | `/dashboard` | ALL notes from all projects | General (`global`) |
| **Global Notes** | `/notes` | `projectId === 'global'` only | General (`global`) |
| **Certificates Notes** | `/certificates/notes` | `projectId === 'certificates'` | Certificates note |
| **Project B Notes** | `/project-b/notes` | `projectId === 'project-b'` | Project B note |

### Note Operations
All operations go through `NotesContext`:

| Function | What It Does |
|---|---|
| `createNote(projectId)` | Adds Firestore doc, auto-selects new note |
| `updateNote(id, content)` | Updates BlockNote JSON content |
| `renameNote(id, title)` | Updates title (called on title input blur) |
| `updateTags(id, tags)` | Replaces tag array |
| `updateNoteProject(id, projectId)` | Reassigns note to different project |
| `togglePin(id)` | Flips pinned boolean |
| `deleteNote(id)` | Deletes Firestore doc, deselects if active |
| `restoreNote(note)` | Re-creates doc with original ID (undo delete) |
| `getNotesForProject(projectId)` | Client-side filter |

### NoteCard Features
- Title (truncated, 1 line)
- Content preview (first ~60 chars of text, stripped from BlockNote JSON)
- Tag chips (max 2 shown, overflow badge `+N`)
- Timestamp (relative: "2 hours ago", "Yesterday", absolute: "Jan 4" for older)
- Pin indicator (colored left border when pinned)
- Delete button (appears on hover, top-right X)
- Pin toggle button (bottom-right, appears on hover; always visible when pinned)
- **Project label badge** (shown on Dashboard view — small pill with project name)

### NotesList Features
- Search bar (filters by title + tags, client-side, instant)
- "PINNED" section header (only when pinned notes exist)
- "ALL NOTES" / "NOTES" section header
- Animated card transitions (Framer Motion layout animations)
- Empty state with CTA button

### NotesEditor Features
- **Editable title** — large input at top, saves on blur or Enter
- **Tag editor** — `react-tag-input-component`, live editing with dark mode support
- **Project label selector** — `<select>` showing current project, change reassigns note to new project immediately. List auto-derived from `nav.ts` — adding a project to nav automatically adds it to the selector
- **Toolbar** — Pin toggle, Delete button, "Edited X ago" timestamp
- **BlockNote rich text editor** — full block editor with:
  - Bold, italic, underline, strikethrough
  - Text alignment (left, center, right)
  - Text + background color
  - Headings, paragraphs, bullet lists, numbered lists, check lists
  - Nested blocks (indent/outdent)
  - Links
  - **Custom Copy button** — copies selected text to clipboard with checkmark feedback (uses `onMouseDown + preventDefault` to preserve selection)
- **Debounced saves** — Firestore write fires 1 second after user stops typing (not on every keystroke)
- `key={selectedNote.id}` — editor fully remounts on note switch (prevents content bleed)

### Mobile Behavior
- Below 768px: single-column — list view OR editor view (not split)
- Back arrow in editor header returns to list
- Creates/selects notes automatically switch to editor view

---

## 7. Design System

### Color Variables
All colors are CSS custom properties defined in `src/shared/styles/theme.css`. Zero hardcoded hex values in any component.

**Light mode and dark mode each define:**
```
--color-brand           Main accent color (#4f6ef7 light / #6183f8 dark)
--color-brand-hover     Hover shade
--color-brand-subtle    Transparent brand for backgrounds

--color-bg              Page background
--color-bg-secondary    Slightly elevated background
--color-surface         Card/panel background
--color-surface-raised  Elevated card background

--color-border          Default border
--color-border-subtle   Muted border

--color-text-primary    Main text
--color-text-secondary  Muted text
--color-text-tertiary   Very muted (timestamps, placeholders)
--color-text-inverted   White on dark backgrounds

--color-sidebar-bg, -active, -active-text, -hover, -text, -section, -border

--color-success / -subtle
--color-warning / -subtle
--color-error   / -subtle
--color-info    / -subtle

--color-note-card-bg, -border, -hover, -active

--radius                Border radius (0.5rem)
--shadow-sm/md/lg       Box shadows
```

### Theme Toggle
- Controlled by `ThemeContext` — reads/writes `localStorage`
- System preference detected on first load
- Applied as `.dark` class on `<html>`
- **Two variants:** full (sidebar style, wide button with label) and compact (small button for Settings page)
- Animated icon transition (Sun ↔ Moon via Framer Motion)

### Typography
- Font: Inter (loaded via BlockNote's CSS, applies globally)
- All text sizes, weights, and leading via Tailwind utilities

### Layout
- Sidebar: fixed 260px (collapsible on mobile via shadcn SidebarProvider)
- Content area: `flex-1`, `overflow-y-auto`
- Notes pages: `h-full` split panel (280px list + flex-1 editor)
- All routes live inside `AppLayout` (`<Outlet />`)

---

## 8. Navigation

### Sidebar Structure
```
┌─────────────────────────────┐
│  [DC] DataCenter  Stage 1   │  ← Header
├─────────────────────────────┤
│  Dashboard                  │  ← Global nav items
│  Activity Log               │
│  Settings                   │
│  Notes                      │
├─────────────────────────────┤
│  PROJECTS                   │  ← Section label
│  ▼ Certificates             │  ← Collapsible project
│      Overview               │
│      Data ▶                 │  ← Nested (Data has sub-items)
│        All Entries          │
│        Import               │
│        History              │
│      Actions                │
│      Notes                  │
│  ▼ Project B                │
│      Overview               │
│      Data                   │
│      Actions                │
│      Notes                  │
├─────────────────────────────┤
│  [avatar] User name         │  ← User profile
│  🌙 Dark Mode              │  ← Theme toggle
└─────────────────────────────┘
```

### Navigation Constants
All nav items in `src/shared/constants/nav.ts` as `NAV_ITEMS[]`. All route paths in `src/shared/constants/routes.ts` as `ROUTES`. No hardcoded strings anywhere in the app.

### Active State
Nav items highlight based on `useResolvedPath` + `useMatch` — deep nested routes correctly highlight their parent.

---

## 9. Routing

```
/                               → redirect to /dashboard
/dashboard                      → DashboardPage (all notes)
/notes                          → NotesPage (global notes only)
/activity                       → ActivityLogPage (stub)
/settings                       → SettingsPage
/certificates                   → redirect to /certificates/overview
/certificates/overview          → CertificatesOverviewPage (stub)
/certificates/data              → redirect to /certificates/data/entries
/certificates/data/entries      → AllEntriesPage (stub)
/certificates/data/import       → ImportPage (stub)
/certificates/data/history      → HistoryPage (stub)
/certificates/actions           → CertActionsPage (stub)
/certificates/notes             → CertNotesPage (full notes)
/project-b                      → redirect to /project-b/overview
/project-b/overview             → PBOverviewPage (stub)
/project-b/data                 → PBDataPage (stub)
/project-b/actions              → PBActionsPage (stub)
/project-b/notes                → PBNotesPage (full notes)
*                               → NotFoundPage
```

Router: `createBrowserRouter` (React Router v7). SPA rewrite in `firebase.json` sends all paths to `/index.html`.

---

## 10. Settings Page

Located at `/settings`. Sections:

- **Profile** — Google avatar (or initial fallback), display name, email, role badge
- **Appearance** — compact ThemeToggle
- **About** — app version (`v1.0.0 — Stage 1`), tagline
- **Account** — Sign out button (hover turns red)

---

## 11. Base System Infrastructure

### Error Boundary (`src/shared/components/ErrorBoundary/ErrorBoundary.tsx`)
- React class component wrapping the entire `<App />`
- Catches any uncaught render error in the tree
- Shows: error icon, error message in code block, "Try again" (reset state) + "Reload page" buttons
- Uses `--color-error` CSS variable

### Loading Skeletons (`src/shared/components/ui/skeleton.tsx`)
Three exported components:
- `<Skeleton className="..." />` — bare animated pulse block, size via className
- `<SkeletonCard />` — three-line card (title + 2 body lines)
- `<SkeletonPage />` — full page skeleton (header + 3-column card grid)
Use these in any data page while Firestore data is loading.

### Page Titles (`src/shared/hooks/usePageTitle.ts`)
- `usePageTitle(title)` — called automatically inside `PageHeader`
- Sets `document.title = "${title} — DataCenter"` on mount
- Resets to `"DataCenter"` on unmount
- Browser tab always reflects the current page

### PageHeader (`src/shared/components/Layout/PageHeader.tsx`)
- Takes `title` and optional `subtitle`
- Automatically calls `usePageTitle(title)`
- Use in every page that has a traditional header layout

---

## 12. Services Infrastructure (`services/`)

The services folder is a **completely independent Node.js CommonJS package** isolated from the Vite/React frontend. It will be imported by Firebase Cloud Functions when automation is built.

### Gmail Service
| File | Purpose |
|---|---|
| `gmail/config.ts` | Loads `GMAIL_*` env vars via dotenv, warns if missing |
| `gmail/transport.ts` | Creates cached OAuth2 Nodemailer transport (token auto-refreshes) |
| `gmail/send.ts` | `sendEmail(EmailOptions): Promise<SendResult>` |
| `gmail/templates/` | Empty — action-specific HTML templates will be added here |

**Usage:**
```ts
import { sendEmail } from './services/gmail/send';
const result = await sendEmail({
  to: 'client@example.com',
  subject: 'Your certificate is ready',
  html: '<p>Please find your certificate attached.</p>',
  attachments: [{ filename: 'cert.pdf', path: '/tmp/cert.pdf' }],
});
// result: { success: true, messageId: '<...@gmail.com>' }
```

### WhatsApp Service (Twilio)
| File | Purpose |
|---|---|
| `whatsapp/config.ts` | Loads `TWILIO_*` env vars via dotenv, warns if missing |
| `whatsapp/client.ts` | Cached Twilio client singleton |
| `whatsapp/send.ts` | `sendWhatsApp(WhatsAppOptions): Promise<SendResult>` |
| `whatsapp/deeplink.ts` | `createWhatsAppLink(phone, message)` — free fallback (no API) |

**Usage — API (automated):**
```ts
import { sendWhatsApp } from './services/whatsapp/send';
const result = await sendWhatsApp({
  to: '972501234567',
  body: 'Your certificate is ready for pickup.',
  // OR for business-initiated: contentSid + contentVariables
});
```

**Usage — deep link (free fallback):**
```ts
import { createWhatsAppLink } from './services/whatsapp/deeplink';
const url = createWhatsAppLink('972501234567', 'Your certificate is ready!');
window.open(url, '_blank'); // opens WhatsApp with pre-filled message
```

### Shared Types
```ts
// services/types.ts
interface SendResult     { success, messageId?, error? }
interface EmailOptions   { to, subject, html, cc?, bcc?, replyTo?, attachments? }
interface WhatsAppOptions { to, body?, contentSid?, contentVariables? }
```

### Credentials
Copy `services/.env.example` → `services/.env` and fill in:
```
GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER_EMAIL
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
```
`services/.env` is in `.gitignore` — never committed. See `services/gmail/README.md` and `services/whatsapp/README.md` for setup walkthroughs.

---

## 13. Deployment

### Web (Firebase Hosting)
- **URL:** `https://data-manage-app-19d66.web.app`
- **Project:** `data-manage-app-19d66` (owned by `asegal1996@gmail.com`)
- **Deploy command:** `npm run build && firebase deploy --account asegal1996@gmail.com`
- **Build output:** `dist/` (Vite)
- **SPA routing:** `firebase.json` rewrites all paths to `/index.html`
- **Firestore rules:** deployed alongside hosting via `firebase.json`

### Android (Capacitor APK)
- **Config:** `capacitor.config.ts` — appId `com.asegal.datacenter`, webDir `dist`
- **Build command:** `npm run build && npx cap sync android && (open in Android Studio → Build APK)`
- **Auth behavior:** skips Google Sign-In, always `isAdmin: true`
- **Same Firestore DB** as web — no separate data

### Environment Variables
| File | Contents | Committed? |
|---|---|---|
| `.env.local` | Firebase config keys | No (gitignored via `*.local`) |
| `.env.example` | Empty Firebase key template | Yes |
| `src/config/auth.config.ts` | `IS_NATIVE` + `HARDCODED_UID` | No (explicitly gitignored) |
| `services/.env` | Gmail + Twilio credentials | No (explicitly gitignored) |
| `services/.env.example` | Empty credential template | Yes |

---

## 14. What Is Stub vs. What Is Complete

### Fully Built ✅
- Authentication system (both web and Android flows)
- Firestore connection (offline-first, real-time)
- Notes system (full CRUD, pin, tag, project reassignment, search, BlockNote editor with custom copy button)
- Dashboard (all-notes master view)
- Settings page (profile, theme, version, sign out)
- Sidebar with user profile footer
- Theme system (light/dark, CSS variables, persistent)
- Layout shell (sidebar, mobile trigger, outlet)
- Error boundary
- Loading skeletons (components ready — not yet wired to data pages)
- Page title updates
- Route constants
- Navigation constants
- Project constants (auto-derived from nav)
- Services infrastructure (Gmail + WhatsApp, no actual actions yet)
- Firebase Hosting deployment
- Firestore security rules
- Capacitor Android configuration
- **Code splitting** — all 13 pages lazy-loaded (React.lazy + Suspense), reduces initial bundle
- **PWA manifest** — `public/manifest.json` + theme-color meta tag + apple-mobile-web-app support
- **Offline indicator** — `OfflineBar` slides in when connection lost (Framer Motion), auto-hides on reconnect
- **N keyboard shortcut** — on any notes page, pressing `N` creates a new note (safe: ignores inputs/editors)
- **Mobile page label** — mobile top bar shows current page name (derived from `NAV_ITEMS` via `useCurrentPageLabel`)
- **Activity Log** — `activityLogs` Firestore collection, `ActivityContext`, `logActivity()` function, full timeline UI
- **Breadcrumbs** — on deep routes (2+ segments), `Breadcrumbs` component renders clickable path trail above page title
- **Cloud Functions scaffold** — `functions/` directory wired to `services/`, two HTTPS callables ready to deploy

### Stub Pages (structure exists, no content) 🔲
- `CertificatesOverviewPage` — header only
- `AllEntriesPage` — header only
- `ImportPage` — header only
- `HistoryPage` — header only
- `CertActionsPage` — header only
- `PBOverviewPage` — header only
- `PBDataPage` — header only
- `PBActionsPage` — header only

### Installed But Not Yet Used 📦
- `recharts` — ready for dashboard charts and project overviews
- `@tanstack/react-table` — ready for data tables in project Data pages
- `emoji-mart` — ready for note/project emoji icons
- `uuid` — ready for client-side ID generation
- `<SkeletonPage />` — ready to wrap stub pages when they load real data

---

## 15. Conventions and Patterns

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `useXxx.ts` (camelCase, `use` prefix)
- Constants/types: `camelCase.ts`
- All routes via `ROUTES.X` constant — never a hardcoded string
- All nav items via `NAV_ITEMS` — never inline

### Import Alias
`@/` maps to `src/`. All internal imports use `@/shared/...`, `@/pages/...`, `@/config/...`.

### State Management
No external state library. Everything via React Context:
- `AuthContext` — user, role, sign-in/out
- `NotesContext` — all notes, CRUD operations, selected note
- `ThemeContext` — theme preference

### Adding a New Project
1. Add nav item to `src/shared/constants/nav.ts` (section: `'projects'`)
2. Add routes to `src/shared/constants/routes.ts`
3. Create page folder under `src/pages/projects/YourProject/`
4. Add routes to `src/App.tsx`
5. The project automatically appears in the Notes editor's project label selector (no extra step — `projects.ts` derives from `nav.ts`)

### Adding a New Service Action
1. Create `services/gmail/actions/yourAction.ts` — import `sendEmail`, use a template
2. Create `services/whatsapp/actions/yourAction.ts` — import `sendWhatsApp`
3. Add HTML templates to `services/gmail/templates/` if needed
4. Call from a Firebase Cloud Function or server endpoint

---

## 16. Known Limitations at Base State

- **Dashboard** shows notes only — stats/overview cards will be added once real project data exists
- **Cloud Functions not yet deployed** — scaffold exists in `functions/`, needs `firebase deploy --only functions` and credentials in `services/.env`
- **Skeletons not yet used** — components exist but stub pages don't show loading states (they have no async data to load yet)
- **Android auth.config.ts** — `HARDCODED_UID` is a placeholder; must be filled with real Firebase UID before building the APK
- **Activity Log is read-only from UI** — writing entries happens via `logActivity()` from `ActivityContext`; no manual entry UI exists (entries come from automated actions)

---

*Base state complete as of: March 2026 — v1.1.0*
