import express from "express";
import { create_categories, show_all_categories, update_categories, delete_categories } from "../controllers/categories.controller";

const router = express.Router();

// NOTE - Show All Categories
/**
 * @swagger
 * /categories/read_categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Successfully retrieved categories.
 *       500:
 *         description: Internal server error.
 */
router.get("/read_categories", show_all_categories);

// NOTE - Create Category
/**
 * @swagger
 * /categories/create_categories:
 *   post:
 *     summary: Create a new category
 *     description: Adds a new category to the database.
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cat_name
 *               - status
 *             properties:
 *               cat_name:
 *                 type: string
 *                 example: "Electronics"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/create_categories", create_categories);

// NOTE - Update Category
/**
 * @swagger
 * /categories/update_categories:
 *   put:
 *     summary: Update a category
 *     description: Updates a category's name and status by ID.
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - cat_name
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               cat_name:
 *                 type: string
 *                 example: "Home Appliances"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/update_categories", update_categories);

// NOTE - Delete Category
/**
 * @swagger
 * /categories/delete_categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Removes a category from the database by ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID.
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/delete_categories/:id", delete_categories);

export default router;
