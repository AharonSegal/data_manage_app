export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
}

export interface WhatsAppOptions {
  to: string;                   // Phone number with country code, e.g. '972501234567'
  body?: string;                // Free-form text (only works within 24hr customer window)
  contentSid?: string;          // Twilio template SID (required for business-initiated messages)
  contentVariables?: Record<string, string>; // Template variable values
}
