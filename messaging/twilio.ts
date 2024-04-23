import {
  TWILLIO_ACCOUNT_SID,
  TWILLIO_AUTH_TOKEN,
  TWILLIO_PHONE_NUMBER,
} from '@util/config';

const twilioClient = require('twilio')(TWILLIO_ACCOUNT_SID, TWILLIO_AUTH_TOKEN);

export const twilioSendSMSMessage = async (to: string, message: string) => {
  const newMsg = await twilioClient.messages.create({
    body: message,
    from: TWILLIO_PHONE_NUMBER,
    to,
  });
  return newMsg;
};

export const twilioSendAudioMessage = async (to: string, message: string) => {
  const call = await twilioClient.calls.create({
    twiml: `<Response><Say>${message}</Say></Response>`,
    to,
    from: TWILLIO_PHONE_NUMBER,
  });
  return call;
};

export const twilioSendWhatsAppMessage = async (
  to: string,
  message: string
) => {
  const whatsApp = await twilioClient.messages.create({
    from: `whatsapp:${TWILLIO_PHONE_NUMBER}`,
    body: message,
    to: `whatsapp:${to}`,
  });

  console.log(whatsApp.sid);

  return whatsApp;
};
