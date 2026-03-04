import { getGmailTransport } from './transport';
import { gmailConfig } from './config';
import type { EmailOptions, SendResult } from '../types';

const joinAddresses = (addr: string | string[]): string =>
  Array.isArray(addr) ? addr.join(', ') : addr;

export const sendEmail = async (options: EmailOptions): Promise<SendResult> => {
  try {
    const transport = await getGmailTransport();

    const result = await transport.sendMail({
      from: gmailConfig.userEmail,
      to: joinAddresses(options.to),
      cc: options.cc ? joinAddresses(options.cc) : undefined,
      bcc: options.bcc ? joinAddresses(options.bcc) : undefined,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
};
