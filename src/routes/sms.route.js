"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sms_controller_1 = require("../controllers/sms.controller"); // adjust path as needed
const router = express_1.default.Router();
/**
 * @swagger
 * /sms/Whatsapp/{id}:
 *   post:
 *     summary: Send WhatsApp message to employee
 *     tags:
 *       - SMS
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The address_users_detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *             properties:
 *               to:
 *                 type: string
 *                 description: Employee phone number
 *                 example: "+8562056570603"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 sid:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.post('/Whatsapp/:id', sms_controller_1.sendSmsToEmployee);
exports.default = router;
