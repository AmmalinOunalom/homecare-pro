"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_users_details_controller_1 = require("../controllers/address_users_details.controller");
const router = express_1.default.Router();
// NOTE - Create Address User
/**
 * @swagger
 * /address_users_details/create:
 *   post:
 *     summary: Create a new address user
 *     description: Adds a new address user to the database and updates the user's address ID.
 *     tags:
 *       - Address Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - gender_owner
 *               - address_name
 *               - house_image
 *               - google_link_map
 *             properties:
 *               users_id:
 *                 type: integer
 *                 description: ID of the user who owns the address
 *                 example: 1
 *               gender_owner:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 description: Gender of the address owner
 *                 example: "MALE"
 *               address_name:
 *                 type: string
 *                 description: The name or label of the address
 *                 example: "123 Main Street"
 *               house_image:
 *                 type: string
 *                 description: Image file name of the house
 *                 format: binary
 *                 example: "house_image.jpg"
 *               google_link_map:
 *                 type: string
 *                 description: Google Maps link to the address location
 *                 example: "https://maps.google.com/example-link"
 *     responses:
 *       201:
 *         description: Address user detail created successfully and users table updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address user detail created successfully and users table updated."
 *                 address_users_detail_id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/create", address_users_details_controller_1.create_address_user_details);
// NOTE - Show Address User By ID
/**
 * @swagger
 * /address_users_details/{id}:
 *   get:
 *     summary: Get address details by user ID
 *     description: Fetches address details of a user by their user ID.
 *     tags:
 *       - Address Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose address details are to be fetched.
 *     responses:
 *       200:
 *         description: Address user details found.
 *       404:
 *         description: Address user details not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", address_users_details_controller_1.show_by_user_id);
// NOTE - Show All Address Users
/**
 * @swagger
 * /address_users_details:
 *   get:
 *     summary: Get all address users
 *     description: Fetches all address users from the database.
 *     tags:
 *       - Address Users
 *     responses:
 *       200:
 *         description: A list of all address users.
 *       500:
 *         description: Internal server error.
 */
router.get("/", address_users_details_controller_1.show_all_address_users_details);
// NOTE - Update Address User
/**
 * @swagger
 * /address_users_details/update/{id}:
 *   put:
 *     summary: Update an address user
 *     description: Updates an existing address user by ID.
 *     tags:
 *       - Address Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - gender_owner
 *               - address_name
 *               - house_image
 *               - google_link_map
 *             properties:
 *               users_id:
 *                 type: integer
 *                 example: 1
 *               gender_owner:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *                 example: "FEMALE"
 *               address_name:
 *                 type: string
 *                 example: "456 Elm Street"
 *               house_image:
 *                 type: string
 *                 format: binary
 *                 example: "new_house_image.jpg"
 *               google_link_map:
 *                 type: string
 *                 example: "https://maps.google.com/new-location"
 *     responses:
 *       200:
 *         description: Address user updated successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Address user not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/update/:id", address_users_details_controller_1.update_address_user_details);
// NOTE - Delete Address User
/**
 * @swagger
 * /address_users_details/delete/{id}:
 *   delete:
 *     summary: Delete an address user
 *     description: Removes an address user from the database by ID.
 *     tags:
 *       - Address Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address user to delete.
 *     responses:
 *       200:
 *         description: Address user deleted successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Address user not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/delete/:id", address_users_details_controller_1.delete_address_user_details);
exports.default = router;
