# Getting Started

## Prerequisites

- Node.js 18+
- npm 9+
- Git
- A Firebase project (see below)

---

## 1. Clone and Install

```bash
git clone <repo-url>
cd data_manage_app
npm install
```

Install services dependencies separately:

```bash
cd services
npm install
cd ..
```

---

## 2. Configure Environment Variables

Copy the template and fill in your Firebase values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Find these values in: **Firebase Console → Project Settings → Your apps → Web app → SDK setup**.

---

## 3. Configure Auth (Android only)

`src/config/auth.config.ts` is gitignored. Create it:

```ts
import { Capacitor } from '@capacitor/core';
export const IS_NATIVE = Capacitor.isNativePlatform();
export const HARDCODED_UID = 'your-firebase-uid-here';
```

For web development, you can leave `HARDCODED_UID` as a placeholder — it's only used by the Android APK.

To find your Firebase UID: Firebase Console → Firestore → `users` collection → your document ID.

---

## 4. Run the Dev Server

```bash
npm run dev
```

App runs at `http://localhost:5173`.

First time you visit:
1. Click "Continue with Google"
2. Sign in with your Google account
3. Go to Firebase Console → Firestore → `users` collection → find your document → change `role` from `"pending"` to `"admin"`
4. Refresh the page — full app access

---

## 5. Type Check

```bash
# Frontend
npx tsc --noEmit

# Services
cd services && npx tsc --noEmit
```

Both should produce zero errors.

---

## 6. Configure Services (optional — for email/WhatsApp automation)

```bash
cd services
cp .env.example .env
```

Fill in Gmail OAuth2 and Twilio credentials. See:
- [`docs/services/gmail.md`](../services/gmail.md) — Gmail OAuth2 setup walkthrough
- [`docs/services/whatsapp.md`](../services/whatsapp.md) — Twilio sandbox setup

If credentials are missing, the services log a warning on import but the app still starts normally.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check without building |
