"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /admins/read_all_admins:
 *   get:
 *     summary: Retrieve a list of all admins
 *     description: Retrieve an array of all user objects from the database.
 *     tags:
 *       - Admins
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                   username:
 *                     type: string
 *                     example: user123
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   tel:
 *                     type: string
 *                     example: "+1234567890"
 *                   gender:
 *                     type: string
 *                     example: Male
 *                   status:
 *                     type: string
 *                     example: active
 *                   avatar:
 *                     type: string
 *                     example: https://example.com/avatar.jpg
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-05-15T08:00:00Z
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-05-15T09:00:00Z
 *       500:
 *         description: Internal server error
 */
router.get("/read_all_admins", admin_controller_1.show_all_admins);
/**
 * @swagger
 * /admins/sign_up:
 *   post:
 *     summary: Create a new admin
 *     description: Create a new admin user. Avatar upload is NOT supported because the admin table has no avatar field.
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admin_name
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               admin_name:
 *                 type: string
 *                 example: adminuser
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               tel:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123!"
 *               gender:
 *                 type: string
 *                 example: Male
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin created successfully
 *                 admin_id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Internal server error
 */
router.post("/sign_up", admin_controller_1.sign_up_admin);
/**
 * @swagger
 * /admins/sign_in:
 *   post:
 *     summary: Admin sign in
 *     description: Allows an admin to sign in using email and password.
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123!
 *     responses:
 *       200:
 *         description: Admin signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin signed in successfully
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/sign_in", admin_controller_1.sign_in_admin);
/**
 * @swagger
 * /admins/forgot-password:
 *   post:
 *     summary: Reset admin password
 *     description: Reset password by providing email and new password.
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewStrongPassword123!
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Email and newPassword are required
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.post("/forgot-password", admin_controller_1.forgot_password_admin);
/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     summary: Update admin details
 *     description: Update admin username, first name, last name.
 *     tags:
 *       - Admins
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Admin ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newUsername:
 *                 type: string
 *                 example: newadminusername
 *               newFirstname:
 *                 type: string
 *                 example: NewJohn
 *               newLastname:
 *                 type: string
 *                 example: NewDoe
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", admin_controller_1.rename_admin);
exports.default = router;
