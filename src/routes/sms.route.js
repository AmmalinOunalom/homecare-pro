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
const express_1 = __importDefault(require("express"));
const sms_controller_1 = require("../controllers/sms.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /sms:
 *   post:
 *     summary: Send an SMS to an employee
 *     description: Sends a notification SMS to an employee's phone after a service order has been created or other action (e.g., payment).
 *     tags:
 *       - SMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 example: "+6281234567890"
 *               body:
 *                 type: string
 *                 example: "Your service order has been received and is being processed."
 *     responses:
 *       200:
 *         description: SMS sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SMS sent to employee."
 *       400:
 *         description: Invalid input data (e.g., invalid phone number or missing fields).
 *       500:
 *         description: Internal server error, error sending SMS.
 */
router.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, body } = req.body;
    try {
        yield (0, sms_controller_1.sendSmsToEmployee)(to, body);
        res.status(200).json({ message: 'SMS sent to employee.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to send SMS.' });
    }
}));
exports.default = router;
