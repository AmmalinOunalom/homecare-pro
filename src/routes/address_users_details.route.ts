import express from "express";
import { 
    create_address_user_details, 
    show_address_by_user_id, 
    show_all_address_users_details, 
    update_address_user_details, 
    delete_address_user_details, 
    upload_house_image 
} from "../controllers/address_users_details.controller";
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - gender_owner
 *               - address_name
 *               - google_link_map
 *               - address_description
 *               - city
 *               - tel
 *               - village  # New required field
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
 *                 example: "house_image.jpg"
 *               google_link_map:
 *                 type: string
 *                 description: Google Maps link to the address location
 *                 example: "https://maps.google.com/example-link"
 *               address_description:
 *                 type: string
 *                 description: Detailed description of the address
 *                 example: "Near the central park, blue house with a white gate."
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
 *                 description: City where the address is located
 *                 example: "SISATTANAK"
 *               village:  # New field
 *                 type: string
 *                 description: Village or neighborhood where the address is located
 *                 example: "Central Village"
 *               tel:
 *                 type: string
 *                 description: Contact phone number for the address
 *                 example: "+856202345678"
 *     responses:
 *       201:
 *         description: Address user detail created successfully and users table updated.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/create", create_address_user_details);

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
router.get("/:id", show_address_by_user_id);

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
