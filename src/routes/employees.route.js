"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const images_config_1 = __importDefault(require("../config/images.config")); // Import multer configuration
const employees_controller_1 = require("../controllers/employees.controller");
const router = express_1.default.Router();
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
router.get("/read_employees", employees_controller_1.show_all_employees);
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
router.get("/:id", employees_controller_1.show_employee_by_id);
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
 *                 enum: [male, female, other]  # Enum for gender field
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
 *                 enum: [active, inactive]  # Enum for status field
 *                 example: active
 *     responses:
 *       201:
 *         description: Employee created successfully.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/create_employees", employees_controller_1.create_employees);
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
router.post("/sign_in", employees_controller_1.sign_in_employee);
//NOTE - update profile employee
/**
 * @swagger
 * /employees/upload:
 *   post:
 *     summary: Upload an image for an employee
 *     description: Endpoint for uploading an image and associating it with an employee.
 *     consumes:
 *       - multipart/form-data  # Specifies the request uses form data for file upload
 *     parameters:
 *       - in: formData
 *         name: employeeId
 *         type: integer
 *         description: The ID of the employee to associate with the uploaded image
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The image file to upload for the employee. You can select an image file from your device.
 *         required: true
 *         format: binary
 *     responses:
 *       200:
 *         description: Image uploaded and associated with the employee successfully
 *         content:
 *           application/json:  # The response is still JSON
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       400:
 *         description: No file uploaded or missing employeeId
 *       500:
 *         description: Error uploading file or associating image with employee
 */
router.post('/upload', images_config_1.default.single('image'), employees_controller_1.uploadImage);
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
router.get("/employees/image/:id", employees_controller_1.show_image_employee_by_id); // Route with the new path
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
router.put("/update_employees", employees_controller_1.update_employees);
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
router.delete("/delete_employees/:id", employees_controller_1.delete_employees);
exports.default = router;
