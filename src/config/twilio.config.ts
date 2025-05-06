import twilio from 'twilio';

// Twilio credentials from your environment variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (to: string, body: string) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio phone number
      to,
    });

    // Return the SID as confirmation of the sent message
    return { sid: message.sid }; 
  } catch (error) {
    // Check if the error is an instance of Error and has a message
    if (error instanceof Error) {
      console.error("Error sending SMS:", error.message);
      return { error: error.message };
    } else {
      // If the error is not an instance of Error, return a general message
      console.error("Error sending SMS:", error);
      return { error: "Unknown error occurred while sending SMS." };
    }
  }
};
