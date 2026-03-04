# DataCenter

Private client project management platform. Manages multiple projects from a single interface with data, notes, and automated communication (email + WhatsApp) per project.

Runs as a **web app** (Firebase Hosting, Google Auth) and an **Android APK** (Capacitor, no auth).

---

## Documentation

All docs are in [`docs/`](./docs/README.md):

| | |
|---|---|
| **[Base State](./docs/general/basestate.md)** | Full architecture, tech stack, all features, file structure |
| **[Getting Started](./docs/setup/getting-started.md)** | Install, env vars, run dev server |
| **[Deployment](./docs/setup/deployment.md)** | Firebase Hosting + Android APK |
| **[Auth System](./docs/features/auth.md)** | Google Sign-In, roles, granting access |
| **[Gmail Service](./docs/services/gmail.md)** | OAuth2 setup, sendEmail() |
| **[WhatsApp Service](./docs/services/whatsapp.md)** | Twilio setup, sendWhatsApp() |
| **[Changelog](./docs/general/changelog.md)** | What was built at each stage |

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in Firebase config
npm run dev
```

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · Firebase (Auth + Firestore + Hosting) · BlockNote · Capacitor
