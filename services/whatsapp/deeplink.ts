/**
 * Generate a WhatsApp deep link (free, no API needed).
 * Opens WhatsApp with a pre-filled message — user taps send manually.
 * Works on both desktop and mobile.
 */
export const createWhatsAppLink = (phone: string, message: string): string => {
  const digits = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
};
