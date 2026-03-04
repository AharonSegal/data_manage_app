# WhatsApp Service — Setup

## Twilio account setup

1. Go to https://www.twilio.com/try-twilio — create a free account (~$15 trial credit)
2. In Twilio Console → Messaging → Try it out → Send a WhatsApp message
3. Follow sandbox instructions: send `join <your-keyword>` from your phone to the sandbox number
4. Note your **Account SID** and **Auth Token** from the Twilio Console dashboard
5. Put all 3 values in `services/.env`:
    - `TWILIO_ACCOUNT_SID`
    - `TWILIO_AUTH_TOKEN`
    - `TWILIO_WHATSAPP_FROM` (sandbox number: `+14155238886`)

## For production (after sandbox testing)

1. Register a WhatsApp Business number via Twilio Self Sign-Up
2. Create message templates in Twilio Console (required for outbound business messages)
3. Update `TWILIO_WHATSAPP_FROM` to your registered number

## Costs

- Twilio free trial: ~$15.50 credit (enough for ~200-300 messages)
- Per message (Israel, utility): ~$0.02-0.04
- Customer-initiated replies: free within 24hr window
- At ~50 messages/month: ~$1-3/month after trial

## Usage

### Automated (via Twilio API)
```ts
import { sendWhatsApp } from '../services/whatsapp/send';

// Free-form (within 24hr customer window)
const result = await sendWhatsApp({
  to: '972501234567',
  body: 'Your certificate is ready!',
});

// Template (business-initiated, anytime)
const result = await sendWhatsApp({
  to: '972501234567',
  contentSid: 'HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  contentVariables: { '1': 'David', '2': '2024-01-15' },
});

console.log(result); // { success: true, messageId: 'SMxxxxxxx' }
```

### Manual fallback (free, no API)
```ts
import { createWhatsAppLink } from '../services/whatsapp/deeplink';

const link = createWhatsAppLink('972501234567', 'Your certificate is ready!');
// Opens WhatsApp with pre-filled message — user taps send
window.open(link, '_blank');
```

## Adding action files

Drop action-specific files in `whatsapp/actions/`:
- `services/whatsapp/actions/sendApprovalRequest.ts` — uses `sendWhatsApp` with template SID
- These will be added when the Certificates Actions page is built.
