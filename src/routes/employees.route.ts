import express from "express";
import upload from '../config/images.config'; // Import multer configuration
import { create_employees, uploadImage, show_employee_by_id, show_image_employee_by_id, show_all_employees, update_employees, delete_employees, sign_in_employee } from "../controllers/employees.controller";

const router = express.Router();

// NOTE - Show All Employees
/**
 * @swagger
 * /employees/read_employees:
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
router.get("/read_employees", show_all_employees);

// NOTE - Get Employee by ID
/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     description: Retrieve details of a specific employee by their ID.
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
 *         description: Employee details retrieved successfully.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/employees/:id", show_employee_by_id);

// NOTE - Create Employee
/**
 * @swagger
 * /employees/create_employees:
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
router.post("/create_employees", create_employees);

// NOTE - Employee Sign-In
/**
 * @swagger
 * /employees/sign_in:
 *   post:
 *     summary: Sign in employee
 *     description: Employee sign-in by email and password.
 *     tags:
 *       - Employees
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
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePass123"
 *     responses:
 *       200:
 *         description: Sign-in successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sign-in successful"
 *                 employee:
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
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */
router.post("/sign_in", sign_in_employee); 


//NOTE - update profile employee

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image
 *     description: Endpoint for uploading an image.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The image file to upload
 *         required: true
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filePath:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error uploading file
 */
router.post('/upload', upload.single('image'), uploadImage);


// NOTE - Show Employee Image by ID
/**
 * @swagger
 * /employees/image/{id}:
 *   get:
 *     summary: Get employee image by ID
 *     description: Retrieve the avatar image of a specific employee by their ID.
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
 *         description: Employee image retrieved successfully.
 *       404:
 *         description: Image not found for this employee.
 *       500:
 *         description: Internal server error.
 */
router.get("/employees/image/:id", show_image_employee_by_id); // Route with the new path



// NOTE - Update Employee
/**
 * @swagger
 * /employees/update_employees:
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
router.put("/update_employees", update_employees);

// NOTE - Delete Employee (Soft Delete)
/**
 * @swagger
 * /employees/delete_employees/{id}:
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
router.delete("/delete_employees/:id", delete_employees);

export default router;
