import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (to: string, message: string) => {
  try {
    const sentMessage = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: to, // Recipient's phone number
    });

    console.log('Message sent successfully:', sentMessage.sid);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};
