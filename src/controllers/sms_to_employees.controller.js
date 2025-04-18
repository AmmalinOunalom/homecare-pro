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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePayment = void 0;
const sms_controller_1 = require("./sms.controller"); // adjust path if needed
const handlePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeePhone, amount } = req.body;
    try {
        // 💳 Your payment logic here (e.g., Stripe, manual payment, etc.)
        // 📲 Send SMS after payment success
        const message = `Payment of $${amount} received. Please proceed with the service.`;
        yield (0, sms_controller_1.sendSmsToEmployee)(employeePhone, message);
        res.status(200).json({ message: 'Payment successful and SMS sent to employee.' });
    }
    catch (error) {
        console.error('Payment or SMS error:', error);
        res.status(500).json({ error: 'Something went wrong with payment or SMS.' });
    }
});
exports.handlePayment = handlePayment;
