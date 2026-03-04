// Firebase Cloud Functions entry point
// Each module re-exports its callable function

export { sendEmailHttp } from './gmail';
export { sendWhatsAppHttp } from './whatsapp';
