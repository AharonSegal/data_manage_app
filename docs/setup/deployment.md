# Deployment

## Web — Firebase Hosting

**Live URL:** `https://data-manage-app-19d66.web.app`
**Firebase project:** `data-manage-app-19d66` (owned by `asegal1996@gmail.com`)

### Deploy

```bash
npm run build
firebase deploy --account asegal1996@gmail.com
```

This deploys:
- `dist/` → Firebase Hosting (SPA, all routes → `/index.html`)
- `firestore.rules` → Firestore security rules

### Deploy rules only (no rebuild needed)

```bash
firebase deploy --only firestore:rules --account asegal1996@gmail.com
```

### Deploy hosting only

```bash
npm run build
firebase deploy --only hosting --account asegal1996@gmail.com
```

### Multiple Firebase accounts

If your CLI is logged in to a different account:

```bash
firebase login:add   # adds asegal1996@gmail.com to the CLI
firebase deploy --account asegal1996@gmail.com
```

---

## Android — Capacitor APK

### One-time setup (already done)

```bash
npm run build
npx cap add android      # generates android/ folder
npx cap sync android     # copies dist/ into android project
```

### Build APK (each release)

```bash
npm run build            # fresh web build
npx cap sync android     # sync web assets into android/
# Then open Android Studio:
npx cap open android
# In Android Studio: Build → Build Bundle(s)/APK(s) → Build APK(s)
# APK output: android/app/build/outputs/apk/debug/app-debug.apk
```

### APK auth behavior

The Android APK bypasses Firebase Auth entirely:
- `IS_NATIVE = Capacitor.isNativePlatform()` → `true`
- `isAdmin` → immediately `true`
- No login screen, no Firestore role check
- Connects to the same Firestore database as the web app

### Capacitor config

```ts
// capacitor.config.ts
{
  appId: 'com.asegal.datacenter',
  appName: 'DataCenter',
  webDir: 'dist',
  android: { buildOptions: { releaseType: 'APK' } },
  server: { androidScheme: 'https' },
}
```

---

## Environment Variables at Deploy Time

| Variable | Where set |
|---|---|
| `VITE_FIREBASE_*` | `.env.local` (never committed) — Vite inlines at build time |
| Firebase functions secrets | `firebase functions:secrets:set KEY value` (when Cloud Functions are added) |
| Services credentials | `services/.env` (never committed) — loaded at runtime by dotenv |

The `.env.local` values are baked into the `dist/` build at compile time by Vite. They are not secret (Firebase web config is public by design — security is in Firestore rules).
