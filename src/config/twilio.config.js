"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.client = void 0;
const twilio_1 = __importDefault(require("twilio"));
// Twilio credentials from your environment variables
exports.client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendSMS = (to, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield exports.client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to,
        });
        // Return the SID as confirmation of the sent message
        return { sid: message.sid };
    }
    catch (error) {
        // Check if the error is an instance of Error and has a message
        if (error instanceof Error) {
            console.error("Error sending SMS:", error.message);
            return { error: error.message };
        }
        else {
            // If the error is not an instance of Error, return a general message
            console.error("Error sending SMS:", error);
            return { error: "Unknown error occurred while sending SMS." };
        }
    }
});
exports.sendSMS = sendSMS;
