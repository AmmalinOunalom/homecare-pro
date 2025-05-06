import express from "express";
import upload from '../config/images.config'; // Import multer configuration
import { create_employees, uploadImage, show_employee_by_id, show_image_employee_by_id, show_more_employee_by_id, show_all_employees, update_employees, delete_employees, sign_in_employee, get_employee_phonenumber } from "../controllers/employees.controller";
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
router.get("/:id", show_employee_by_id);

// NOTE - Get Employee by ID=5 && cat_name = Moving
/**
 * @swagger
 * /employees/read_emp_car_employees/5:
 *   get:
 *     summary: Get Employee Details for empId = 5 and cat_name = 'Moving'
 *     description: Fetches employee details where empId is 5 and category name is 'Moving'.
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: Successfully retrieved employee details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 empId:
 *                   type: integer
 *                   example: 5
 *                 first_name:
 *                   type: string
 *                   example: "John"
 *                 last_name:
 *                   type: string
 *                   example: "Doe"
 *                 car_brand:
 *                   type: string
 *                   example: "Toyota"
 *                 model:
 *                   type: string
 *                   example: "Corolla"
 *                 license_plate:
 *                   type: string
 *                   example: "XYZ-1234"
 *                 car_image:
 *                   type: string
 *                   example: "http://example.com/car_image.jpg"
 *                 cat_id:
 *                   type: integer
 *                   example: 5
 *                 cat_name:
 *                   type: string
 *                   example: "Moving"
 *       404:
 *         description: Employee details not found
 *       500:
 *         description: Server error
 */
router.get("/read_emp_car_employees/5", show_more_employee_by_id);
// NOTE - Create Employee
/**
 * @swagger
 * /employees/create_employees:
 *   post:
 *     summary: Create a new employee
 *     description: Registers a new employee and uploads avatar image to Cloudinary.
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               - cat_id
 *               - price
 *               - city
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
 *                 format: binary
 *                 description: Upload avatar image file
 *               cat_id:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 100.00
 *               city:
 *                 type: string
 *                 enum: ['CHANTHABULY','SIKHOTTABONG','XAYSETHA','SISATTANAK','NAXAITHONG','XAYTANY','HADXAIFONG']
 *                 example: SISATTANAK
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: The status of the employee.
 *                 example: active
 *     responses:
 *       201:
 *         description: Employee created successfully.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/create_employees", upload.single("avatar"), create_employees);

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
router.post('/upload', upload.single('image'), uploadImage);

/**
 * @swagger
 * /employees/image/{id}:
 *   get:
 *     summary: Get employee image by ID
 *     description: |
 *       Retrieves the avatar image for a specific employee by their ID.
 *       - If the image is stored as a URL, it redirects to that URL.
 *       - If the image is a local file, it serves the file directly.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee image retrieved successfully
 *       400:
 *         description: Image not found for this employee
 *       500:
 *         description: Internal server error
 */
router.get("/image/:id", show_image_employee_by_id);


// NOTE - Update Employee
/**
 * @swagger
 * /employees/update_employees/{id}:
 *   put:
 *     summary: Update an employee's details
 *     description: Updates an employee's details by ID, including the option to update the avatar.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the employee to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
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
 *                 format: binary
 *                 description: Avatar image file (optional)
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
router.put('/update_employees/:id', upload.single('avatar'), update_employees);

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


/**
 * @swagger
 * /employees/employee_phone/{id}:
 *   get:
 *     summary: Get employee phone number by ID
 *     description: Retrieve the phone number of a specific employee using their ID.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee
 *     responses:
 *       200:
 *         description: Phone number retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tel:
 *                   type: string
 *                   example: "02012345678"
 *       400:
 *         description: Invalid employee ID
 *       404:
 *         description: Employee not found or no phone number available
 *       500:
 *         description: Failed to get employee phone number
 */
router.get("/employee_phone/:id", get_employee_phonenumber);

export default router;
