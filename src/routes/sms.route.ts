import express from 'express';
import { sendSmsToEmployee } from '../controllers/sms.controller'; // adjust path as needed

const router = express.Router();

/**
 * @swagger
 * /sms/whatsapp:
 *   post:
 *     summary: Send WhatsApp message to employee with user service info
 *     tags:
 *       - SMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *             properties:
 *               from:
 *                 type: string
 *                 description: User's phone number (customer)
 *                 example: "+8562098765432"
 *               to:
 *                 type: string
 *                 description: Employee's phone number (recipient)
 *                 example: "+8562056570603"
 *     responses:
 *       200:
 *         description: WhatsApp message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: WhatsApp message sent successfully
 *       400:
 *         description: Invalid or missing phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or missing employee phone number
 *       404:
 *         description: No service details found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No service details found
 *       500:
 *         description: Failed to send WhatsApp message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to send WhatsApp message
 */

router.post('/Whatsapp', sendSmsToEmployee);

export default router;
