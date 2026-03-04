import { getTwilioClient } from './client';
import { twilioConfig } from './config';
import type { WhatsAppOptions, SendResult } from '../types';

const formatPhone = (phone: string): string => {
  const digits = phone.replace(/[^0-9]/g, '');
  return `whatsapp:+${digits}`;
};

export const sendWhatsApp = async (options: WhatsAppOptions): Promise<SendResult> => {
  try {
    const client = getTwilioClient();

    if (!options.body && !options.contentSid) {
      return { success: false, error: 'Must provide either body or contentSid' };
    }

    const messageParams: Parameters<typeof client.messages.create>[0] = {
      from: `whatsapp:${twilioConfig.whatsappFrom}`,
      to: formatPhone(options.to),
      ...(options.contentSid
        ? {
            contentSid: options.contentSid,
            ...(options.contentVariables && {
              contentVariables: JSON.stringify(options.contentVariables),
            }),
          }
        : { body: options.body }),
    };

    const message = await client.messages.create(messageParams);

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown WhatsApp error',
    };
  }
};
