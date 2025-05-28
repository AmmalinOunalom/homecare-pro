import express from "express";
import upload from '../config/images.config';
import { authenticateToken } from "../middleware/auth.middleware"; 
import { create_users, show_all_users, get_user_profile, forgot_password, rename_user, sign_in_user, get_user_name, refresh_token  } from "../controllers/user.controller";

const router = express.Router();

// NOTE - SIGN_UP USER
/**
 * @swagger
 * /users/sign_up_user:
 *   post:
 *     summary: Create a new user with optional avatar upload
 *     description: Registers a new user and optionally uploads an avatar image
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *                 example: bie@gmail.com
 *               tel:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 example: MALE
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Optional avatar image
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request, duplicate or invalid data
 *       500:
 *         description: Internal server error
 */
router.post("/sign_up_user", upload.single("avatar"), create_users);


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
 *                 example: bie@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
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

// Add Get User Profile route
/**
 * @swagger
 * /users/get_user_profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile of the logged-in user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: Successfully retrieved the user profile
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/get_user_profile", authenticateToken, get_user_profile);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Generate a new access token using a valid refresh token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Refresh token used to obtain a new access token
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: Successfully generated a new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: your_new_access_token_here
 *       401:
 *         description: Refresh token not provided
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh-token', refresh_token);

/**
 * @swagger
 * /users/rename_user/{id}:
 *   put:
 *     summary: Rename a user
 *     description: Allows an admin to rename a user by updating their username, first name, last name, and avatar.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
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
 *               Avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
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
router.put("/rename_user/:id", upload.single("file"),rename_user);

//Get User Name BY ID
/**
 * @swagger
 * /users/get_user_name/{id}:
 *   get:
 *     summary: Retrieve user name by user ID
 *     description: Fetch the name of a user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to fetch the name for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the user.
 *       400:
 *         description: Bad request, invalid ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating what was wrong.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating user not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating internal error.
 */
router.get("/get_user_name/:id", get_user_name);

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
