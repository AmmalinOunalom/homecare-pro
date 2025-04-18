import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const sendSmsToEmployee = async (to: string, body: string) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    });

    console.log('SMS sent:', message.sid);
    // Optionally, return this or save to DB
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};
