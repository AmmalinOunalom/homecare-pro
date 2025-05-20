// // import twilio from 'twilio';
// // import dotenv from 'dotenv';

// import { client } from "../config/twilio.config";

// // dotenv.config(); // Load environment variables

// // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // export const sendSMS = async (to: string, message: string) => {
// //   try {
// //     const sentMessage = await client.messages.create({
// //       body: message,
// //       from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
// //       to: to, // Recipient's phone number
// //     });

// //     console.log('Message sent successfully:', sentMessage.sid);
// //   } catch (error) {
// //     console.error('Error sending SMS:', error);
// //   }
// // };


// import twilio from 'twilio';
// import dotenv from 'dotenv';

// dotenv.config();

// if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
//   throw new Error('Twilio environment variables are not set properly.');
// }

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// export const sendSMS = async (to: string, message: string): Promise<void> => {
//   if (!to || !message) {
//     throw new Error('Phone number and message are required.');
//   }

//   try {
//     const sentMessage = await client.messages.create({
//       body: message,
//       from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
//       to: 'whatsapp:' + to,
//     });

//     console.log('WhatsApp message sent successfully:', sentMessage.sid);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('Error sending WhatsApp message:', error.message);
//       throw error;
//     } else {
//       console.error('Unknown error sending WhatsApp message:', error);
//       throw new Error('Unknown error occurred while sending WhatsApp message.');
//     }
//   }
// };


// export const sendSMS = async (to: string, message: string): Promise<string> => {
//   if (!to || !message) {
//     throw new Error('Phone number and message are required.');
//   }

//   try {
//     const sentMessage = await client.messages.create({
//       body: message,
//       from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
//       to: 'whatsapp:' + to,
//     });

//     console.log('WhatsApp message sent successfully:', sentMessage.sid);
//     return sentMessage.sid;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('Error sending WhatsApp message:', error.message);
//       throw error;
//     } else {
//       console.error('Unknown error sending WhatsApp message:', error);
//       throw new Error('Unknown error occurred while sending WhatsApp message.');
//     }
//   }
// };


// sms.util.ts
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config(); // Make sure environment variables are loaded

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error('Twilio credentials or phone number missing in environment variables');
}

const client = twilio(accountSid, authToken);

/**
 * Send WhatsApp message using Twilio
 * @param to Recipient phone number (with country code, e.g., +85620xxxxxxx)
 * @param message Text message to send
 * @returns Message SID string
 */
export const sendSMS = async (to: string, message: string): Promise<string> => {
  if (!to || !message) {
    throw new Error('Phone number and message are required.');
  }

  try {
    const sentMessage = await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,  // WhatsApp sender (your Twilio WhatsApp-enabled number)
      to: `whatsapp:${to}`,            // WhatsApp recipient
    });

    console.log('WhatsApp message sent successfully:', sentMessage.sid);
    return sentMessage.sid;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error sending WhatsApp message:', error.message);
      throw error;
    } else {
      console.error('Unknown error sending WhatsApp message:', error);
      throw new Error('Unknown error occurred while sending WhatsApp message.');
    }
  }
};

