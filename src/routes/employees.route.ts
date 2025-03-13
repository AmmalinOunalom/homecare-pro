import express from "express";
import { create_employees, show_all_employees, update_employees, delete_employees } from "../controllers/employees.controller";

const router = express.Router();

// NOTE - Show All Employees
/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     description: Retrieve a list of all employees.
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: Successfully retrieved employees.
 *       500:
 *         description: Internal server error.
 */
router.get("/", show_all_employees);

// NOTE - Create Employee
/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     description: Registers a new employee in the system.
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - tel
 *               - password
 *               - address
 *               - gender
 *               - cv
 *               - cat_id
 *               - price
 *             properties:
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
 *               address:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               cv:
 *                 type: string
 *                 example: "cv.pdf"
 *               avatar:
 *                 type: string
 *                 example: "avatar.jpg"
 *               cat_id:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 100.00
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       201:
 *         description: Employee created successfully.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/", create_employees);

// NOTE - Update Employee
/**
 * @swagger
 * /employees:
 *   put:
 *     summary: Update an employee
 *     description: Updates an employee's details by ID.
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - first_name
 *               - last_name
 *               - email
 *               - tel
 *               - password
 *               - address
 *               - gender
 *               - cv
 *               - cat_id
 *               - price
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
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
 *               address:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               cv:
 *                 type: string
 *                 example: "cv.pdf"
 *               avatar:
 *                 type: string
 *                 example: "avatar.jpg"
 *               cat_id:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 100.00
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       200:
 *         description: Employee updated successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/", update_employees);

// NOTE - Delete Employee (Soft Delete)
/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Soft delete an employee
 *     description: Marks an employee as inactive instead of permanently deleting them.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID.
 *     responses:
 *       200:
 *         description: Employee deleted successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", delete_employees);

export default router;
