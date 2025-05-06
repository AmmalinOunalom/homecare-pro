"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware"); // เชื่อมต่อกับ middleware
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
// NOTE - Read All users
/**
 * @swagger
 * /users/read_user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/read_user", auth_middleware_1.authenticateToken, user_controller_1.show_all_users);
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
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/sign_up_user", user_controller_1.create_users);
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
router.post("/sign_in", user_controller_1.sign_in_user);
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
router.get("/get_user_profile", auth_middleware_1.authenticateToken, user_controller_1.get_user_profile);
// Add Rename User route
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
router.put("/rename_user/:id", user_controller_1.rename_user);
// Add Get User Name route
/**
 * @swagger
 * /users/get_user_name:
 *   get:
 *     summary: Retrieve user name by user ID
 *     description: Fetch the name of a user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: userId
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
 *         description: Bad request, missing required fields.
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
router.get("/get_user_name", user_controller_1.get_user_name);
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
router.post("/forgot_password", user_controller_1.forgot_password);
exports.default = router;
