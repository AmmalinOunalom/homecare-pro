import express from "express";
import { authenticateToken } from "../middleware/auth.middleware"; // เชื่อมต่อกับ middleware
import { create_users, show_all_users, forgot_password, rename_user, sign_in_user } from "../controllers/user.controller";

const router = express.Router();

// NOTE - Read All users
/**
 * @swagger
 * /users/read_user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       500:
 *         description: Internal server error
 */
router.get("/read_user",authenticateToken, show_all_users);

// NOTE - SIGN_UP USER
/**
 * @swagger
 * /users/sign_up_user:
 *   post:
 *     summary: Create a new user
 *     description: Registers a new user in the system
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - first_name
 *               - last_name
 *               - email
 *               - tel
 *               - password
 *               - gender
 *               - status
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               tel:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePass123"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 example: MALE
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/sign_up_user", create_users);

// Add Sign-In route
/**
 * @swagger
 * /users/sign_in:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticates a user based on email and password.
 *     tags:
 *       - Users
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
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePass123"
 *     responses:
 *       200:
 *         description: Sign-in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sign-in successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     tel:
 *                       type: string
 *                       example: "1234567890"
 *                     avatar:
 *                       type: string
 *                       example: "avatar.jpg"
 *                     address:
 *                       type: string
 *                       example: "123 Main St"
 *                     gender:
 *                       type: string
 *                       example: "MALE"
 *                     status:
 *                       type: string
 *                       example: "ACTIVE"
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/sign_in", sign_in_user);



/**
 * @swagger
 * /users/rename_user/{id}:
 *   put:
 *     summary: Rename a user
 *     description: Allows an admin to rename a user by updating their first and last name.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to rename
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newUsername
 *               - newFirstname
 *               - newLastname
 *             properties:
 *               newUsername:
 *                 type: string
 *                 example: johndoe123
 *               newFirstname:
 *                 type: string
 *                 example: John
 *               newLastname:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       200:
 *         description: User renamed successfully
 *       400:
 *         description: Bad request, missing required fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/rename_user/:id", rename_user);

/**
 * @swagger
 * /users/forgot_password:
 *   post:
 *     summary: Reset user password
 *     description: Allows a user to reset their password using their email.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Email not found
 */
router.post("/forgot_password", forgot_password);

export default router;
