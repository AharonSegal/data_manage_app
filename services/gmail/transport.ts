import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { gmailConfig } from './config';

const OAuth2 = google.auth.OAuth2;

let cachedTransport: nodemailer.Transporter | null = null;

export const getGmailTransport = async (): Promise<nodemailer.Transporter> => {
  // Reuse transport if already created (access token auto-refreshes)
  if (cachedTransport) return cachedTransport;

  const oauth2Client = new OAuth2(
    gmailConfig.clientId,
    gmailConfig.clientSecret,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: gmailConfig.refreshToken,
  });

  const tokenResponse = await oauth2Client.getAccessToken();

  cachedTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: gmailConfig.userEmail,
      clientId: gmailConfig.clientId,
      clientSecret: gmailConfig.clientSecret,
      refreshToken: gmailConfig.refreshToken,
      accessToken: tokenResponse.token ?? undefined,
    },
  });

  return cachedTransport;
};
