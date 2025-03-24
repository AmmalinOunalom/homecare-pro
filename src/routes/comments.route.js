"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_controller_1 = require("../controllers/comments.controller");
const router = express_1.default.Router();
// NOTE - Create Comment
/**
 * @swagger
 * /comments/create:
 *   post:
 *     summary: Create a new comment
 *     description: Adds a new comment with a rating for an employee.
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 5
 *               employees_id:
 *                 type: integer
 *                 example: 10
 *               message:
 *                 type: string
 *                 example: "Great service!"
 *               rating:
 *                 type: integer
 *                 example: 5
 *               status:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post("/create", comments_controller_1.create_comment);
// NOTE - Show All Comments
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Fetches all comments from the database.
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: A list of all comments.
 *       500:
 *         description: Internal server error.
 */
router.get("/", comments_controller_1.show_all_comments);
// NOTE - Update Comment
/**
 * @swagger
 * /comments/update/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Updates an existing comment by ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 5
 *               employees_id:
 *                 type: integer
 *                 example: 10
 *               message:
 *                 type: string
 *                 example: "Updated review message."
 *               rating:
 *                 type: integer
 *                 example: 4
 *               status:
 *                 type: string
 *                 example: "inactive"
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/update/:id", comments_controller_1.update_comment);
// NOTE - Delete Comment
/**
 * @swagger
 * /comments/delete/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Removes a comment from the database by ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/delete/:id", comments_controller_1.delete_comment);
exports.default = router;
