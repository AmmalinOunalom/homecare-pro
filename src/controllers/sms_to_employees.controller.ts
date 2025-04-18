import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export const sendSmsToEmployee = async (to: string, message: string) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: to // make sure it includes country code, e.g. +14155552671
    });

    console.log('✅ SMS sent:', result.sid);
    return result;
  } catch (error) {
    console.error('❌ Failed to send SMS:', error);
    throw error;
  }
};
