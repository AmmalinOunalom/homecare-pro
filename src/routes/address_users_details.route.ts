import express from "express";
import { create_address_user_details, show_all_address_users_details, update_address_user_details, delete_address_user_details, upload_house_image, get_address_by_user_id, get_my_address } from "../controllers/address_users_details.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import upload from "../config/images.config";

const router = express.Router();

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - gender_owner
 *               - address_name
 *               - village
 *               - google_link_map
 *               - address_description
 *               - city
 *               - tel
 *             properties:
 *               users_id:
 *                 type: integer
 *               gender_owner:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               address_name:
 *                 type: string
 *               village:
 *                 type: string
 *               house_image:
 *                 type: string
 *                 format: binary
 *               google_link_map:
 *                 type: string
 *               address_description:
 *                 type: string
 *               city:
 *                 type: string
 *                 enum: 
 *                   - CHANTHABULY
 *                   - SIKHOTTABONG
 *                   - XAYSETHA
 *                   - SISATTANAK
 *                   - NAXAITHONG
 *                   - XAYTANY
 *                   - HADXAIFONG
 *               tel:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address user detail created successfully and users table updated.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */

router.post("/create", upload.single("house_image"), create_address_user_details);
/**
 * @swagger
 * /address_users_details/my_address:
 *   get:
 *     summary: Get the address of the authenticated user
 *     description: This endpoint retrieves the address associated with the authenticated user.
 *     tags:
 *       - Address Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address_name:
 *                   type: string
 *                 village:
 *                   type: string
 *                 city:
 *                   type: string
 *                 address_description:
 *                   type: string
 *                 google_link_map:
 *                   type: string
 *       401:
 *         description: Unauthorized, user not logged in
 *       500:
 *         description: Internal server error
 */
router.get("/my_address", authenticateToken, get_my_address);

// NOTE - Upload House Image
/**
 * @swagger
 * /address_users_details/upload:
 *   post:
 *     summary: Upload a house image for an address user
 *     description: Upload an image file and associate it with a user's address.
 *     tags:
 *       - Address Users
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - image
 *             properties:
 *               users_id:
 *                 type: integer
 *                 description: The ID of the user whose house image is being uploaded
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file of the house
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No file uploaded or missing user ID
 *       500:
 *         description: Error uploading file
 */
router.post('/upload_house_image', upload.single('house_image'), upload_house_image);

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
router.get("/:id", get_address_by_user_id);

//NOTE - Get Google Map Link By Address ID

/**
 * @swagger
 * /address_users_details/google-map-link/{id}:
 *   get:
 *     summary: Get address user details (Google Map link) by user ID
 *     tags:
 *       - Address Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved address user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 address_users_detail_id:
 *                   type: string
 *       404:
 *         description: Address user details not found
 *       500:
 *         description: Internal server error
 */
router.get("/google-map-link/:id", get_address_by_user_id);

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
router.get("/", show_all_address_users_details);

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
router.put("/update/:id", update_address_user_details);

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
router.delete("/delete/:id", delete_address_user_details);

export default router;
