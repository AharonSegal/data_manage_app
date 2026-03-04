# Gmail Service — Setup

## One-time OAuth2 credential setup

1. Go to https://console.cloud.google.com
2. Create a project (or reuse your Firebase project)
3. Enable the **Gmail API** (APIs & Services → Library → search "Gmail API" → Enable)
4. Go to APIs & Services → Credentials → Create Credentials → OAuth Client ID
5. Application type: **Desktop App** (or Web App if you prefer)
6. Download the JSON — note the `client_id` and `client_secret`
7. Go to https://developers.google.com/oauthplayground
8. Click the gear icon (top right) → check "Use your own OAuth credentials"
9. Paste your `client_id` and `client_secret`
10. In the left panel, find **Gmail API v1** → select `https://mail.google.com/`
11. Click "Authorize APIs" → sign in with your Gmail account → Allow
12. Click "Exchange authorization code for tokens"
13. Copy the **Refresh Token**
14. Put all 4 values in `services/.env`:
    - `GMAIL_CLIENT_ID`
    - `GMAIL_CLIENT_SECRET`
    - `GMAIL_REFRESH_TOKEN`
    - `GMAIL_USER_EMAIL`

## Limits (free personal @gmail.com)

- 100 emails/day via API
- 500 recipients per single email
- 25 MB attachment limit
- Rolling 24-hour window

## Usage

```ts
import { sendEmail } from '../services/gmail/send';

const result = await sendEmail({
  to: 'someone@example.com',
  subject: 'Hello',
  html: '<p>This is a test email</p>',
});

console.log(result); // { success: true, messageId: '...' }
```

## Adding action templates

Drop action-specific files in `gmail/templates/`:
- `services/gmail/templates/certificateNotification.html` — Handlebars/raw HTML template
- `services/gmail/actions/sendCertificateNotification.ts` — calls `sendEmail` with the template

These will be added when the Certificates Actions page is built.
