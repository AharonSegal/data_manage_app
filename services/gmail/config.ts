import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const gmailConfig = {
  clientId: process.env.GMAIL_CLIENT_ID!,
  clientSecret: process.env.GMAIL_CLIENT_SECRET!,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
  userEmail: process.env.GMAIL_USER_EMAIL!,
} as const;

// Validate on import — warn but don't crash if credentials are missing
const missing = (Object.entries(gmailConfig) as [string, string][])
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.warn(`[Gmail] Missing env vars: ${missing.join(', ')}. Email sending will not work.`);
}
