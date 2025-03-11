import express from "express";
import {create_user, show_all_user} from "../controllers/user.controller"

const router = express.Router();

//NOTE Read All user

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
router.get("/read_user", show_all_user);

//NOTE - SIGN_UP USER

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
router.post("/sign_up_user", create_user);

export default router;
