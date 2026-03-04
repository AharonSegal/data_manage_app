# Authentication & Access Control

## Overview

This app uses **Firebase Auth** (Google Sign-In) + **Firestore role checks**.
Only users manually marked as `admin` in the database can access the app.
Everyone else sees a blank **"404 — Nothing Here"** page.

---

## How It Works

### Sign-in flow

```
User visits app
       │
       ▼
  Not signed in?  ──→  LoginPage (Google button)
       │
       ▼ (signs in with Google)
  Firebase Auth creates/confirms the session
       │
       ▼
  App reads Firestore: users/{uid}
       │
       ├── Document does NOT exist?
       │     └── Create it with role: "pending"
       │         → Show "404 Nothing Here"
       │
       └── Document EXISTS?
             ├── role: "admin"  → Show the full app ✓
             ├── role: "pending" → Show "404 Nothing Here"
             └── role: "blocked" → Show "404 Nothing Here"
```

### Session persistence

Firebase Auth persists sessions in `localStorage` by default.
On page reload, the app restores the session silently — no re-login needed.

---

## Firestore User Document

Collection: `users`
Document ID: the user's Firebase UID

```json
{
  "uid": "abc123...",
  "email": "user@gmail.com",
  "displayName": "First Last",
  "photoURL": "https://...",
  "role": "pending",
  "createdAt": "2026-03-04T...",
  "lastLoginAt": "2026-03-04T..."
}
```

### Roles

| Role      | Access               |
|-----------|----------------------|
| `admin`   | Full app access      |
| `pending` | 404 page (default)   |
| `blocked` | 404 page             |

---

## Granting Admin Access (Manual Process)

1. The user signs in with Google once — their document is auto-created with `role: "pending"`
2. Go to **Firebase Console → Firestore Database → users collection**
3. Find the user's document (by email or UID)
4. Change the `role` field from `"pending"` to `"admin"`
5. The user **refreshes the page** → full app access granted

> This is intentionally manual. There is no self-service admin upgrade.

---

## Firestore Security Rules

```
users/{userId}
  - read:   own document only (to check role on login)
  - create: own document only (auto-created on first sign-in)
  - update: own document only, CANNOT change role field

everything else (notes, etc.)
  - read/write: admin role only
```

No client-side code can promote a user to admin — only the Firebase Console (or Firebase Admin SDK) can change roles.

---

## Intended Users

| User    | Google Account          | Role    |
|---------|-------------------------|---------|
| Main    | your-main@gmail.com     | `admin` |
| Dev     | your-dev@gmail.com      | `admin` |

Both accounts must sign in once, then be manually promoted to `admin` in Firestore.

---

## Deploy Firestore Rules

Whenever you update `firestore.rules`, redeploy with:

```bash
firebase deploy --only firestore:rules
```

Or deploy everything at once:

```bash
npm run build && firebase deploy
```
