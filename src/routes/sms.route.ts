import express from 'express';
import { sendSmsToEmployee } from '../controllers/sms.controller';

const router = express.Router();

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
router.post('/send', async (req, res) => {
  const { to, body } = req.body;

  try {
    await sendSmsToEmployee(to, body);
    res.status(200).json({ message: 'SMS sent to employee.' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to send SMS.' });
  }
});

export default router;