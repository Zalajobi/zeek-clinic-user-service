const accountSID = process.env.TWILLIO_ACCOUNT_SID
const authToken = process.env.TWILLIO_AUTH_TOKEN

const twilioClient = require('twilio')(accountSID, authToken);

export const sendSMSMessage = async (to:string, message:string) => {
  const newMsg = await twilioClient.messages.create({
    body: message,
    from: process.env.TWILLIO_PHONE_NUMBER,
    to
  })
  return newMsg
}

export const callNumber = async (to:string, message:string) => {
  const call = await twilioClient.calls.create({
    twiml: `<Response><Say>${message}</Say></Response>`,
    to,
    from: process.env.TWILLIO_PHONE_NUMBER
  })
  return call
}
