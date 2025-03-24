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
 *     description: Adds a new address user to the database.
 *     tags:
 *       - Address Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_name
 *               - city
 *             properties:
 *               address_name:
 *                 type: string
 *                 example: "123 Main Street"
 *               city:
 *                 type: string
 *                 example: "CHANTHABOULY"
 *     responses:
 *       201:
 *         description: Address user created successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post("/create", address_users_details_controller_1.create_address_user_details);
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
 *               - address_name
 *               - city
 *             properties:
 *               address_name:
 *                 type: string
 *                 example: "456 Elm Street"
 *               city:
 *                 type: string
 *                 example: "SIKHOTTABONG"
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
