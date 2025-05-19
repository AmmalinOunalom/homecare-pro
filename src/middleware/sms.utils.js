"use strict";
// // import twilio from 'twilio';
// // import dotenv from 'dotenv';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const twilio_config_1 = require("../config/twilio.config");
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
const sendSMS = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!to || !message) {
        throw new Error('Phone number and message are required.');
    }
    try {
        const sentMessage = yield twilio_config_1.client.messages.create({
            body: message,
            from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
            to: 'whatsapp:' + to,
        });
        console.log('WhatsApp message sent successfully:', sentMessage.sid);
        return sentMessage.sid;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error sending WhatsApp message:', error.message);
            throw error;
        }
        else {
            console.error('Unknown error sending WhatsApp message:', error);
            throw new Error('Unknown error occurred while sending WhatsApp message.');
        }
    }
});
exports.sendSMS = sendSMS;
