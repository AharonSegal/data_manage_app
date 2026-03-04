import twilio from 'twilio';
import { twilioConfig } from './config';

let cachedClient: ReturnType<typeof twilio> | null = null;

export const getTwilioClient = () => {
  if (cachedClient) return cachedClient;
  cachedClient = twilio(twilioConfig.accountSid, twilioConfig.authToken);
  return cachedClient;
};
