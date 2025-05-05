import express from "express";
import { create_emp_car, show_all_emp_cars, get_emp_car_by_id, update_emp_car, delete_emp_car, upload_car_image  } from "../controllers/emp_car.controller";
import upload from "../config/images.config";

const router = express.Router();

// NOTE - Show All EmpCars
/**
 * @swagger
 * /emp_car/read_emp_car:
 *   get:
 *     summary: Get all emp_cars
 *     description: Retrieve a list of all emp_cars.
 *     tags:
 *       - EmpCars
 *     responses:
 *       200:
 *         description: Successfully retrieved emp_cars.
 *       500:
 *         description: Internal server error.
 */
router.get("/read_emp_car", show_all_emp_cars);


// NOTE - Get EmpCar by ID
/**
 * @swagger
 * /emp_car/get_emp_car_by_id/{id}:
 *   get:
 *     summary: Get EmpCar by ID
 *     description: Retrieve details of a specific EmpCar by its ID.
 *     tags:
 *       - EmpCars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: EmpCar ID.
 *     responses:
 *       200:
 *         description: EmpCar details retrieved successfully.
 *       404:
 *         description: EmpCar not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/get_emp_car_by_id/:id", get_emp_car_by_id);

// NOTE - Upload Car Image
/**
 * @swagger
 * /emp_car/upload_car_image:
 *   post:
 *     summary: Upload an employee's car image
 *     description: Uploads a car image and updates the database with the image URL.
 *     tags:
 *       - EmpCars
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - emp_id
 *               - car_image
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 example: 1
 *               car_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded and car image updated successfully.
 *       400:
 *         description: No file uploaded or invalid data.
 *       500:
 *         description: Internal server error.
 */
router.post("/upload_car_image", upload.single("car_image"), upload_car_image);

// NOTE - Create EmpCar
/**
 * @swagger
 * /emp_car/create_emp_car:
 *   post:
 *     summary: Create a new employee car with an image
 *     description: Adds a new car for the employee along with the uploaded car image.
 *     tags:
 *       - EmpCars
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - emp_id
 *               - car_brand
 *               - model
 *               - license_plate
 *               - car_image
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 example: 1
 *               car_brand:
 *                 type: string
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 example: "Camry"
 *               license_plate:
 *                 type: string
 *                 example: "ABC-1234"
 *               car_image:
 *                 type: string
 *                 format: binary
 *                 description: The car image to be uploaded
 *     responses:
 *       201:
 *         description: Employee car created successfully.
 *       400:
 *         description: Bad request, missing required fields or invalid file format.
 *       500:
 *         description: Internal server error.
 */
router.post("/create_emp_car", upload.single("car_image"), create_emp_car);

// NOTE - Update EmpCar by emp_id
/**
 * @swagger
 * /emp_car/update_emp_car/{emp_id}:
 *   put:
 *     summary: Update an emp_car by emp_id
 *     description: Updates an emp_car's details (car_brand, model, license_plate, car_image) in the database by emp_id.
 *     tags:
 *       - EmpCars
 *     parameters:
 *       - in: path
 *         name: emp_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The emp_id of the emp_car record to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               car_brand:
 *                 type: string
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 example: "Camry"
 *               license_plate:
 *                 type: string
 *                 example: "ABC-1234"
 *               car_image:
 *                 type: string
 *                 format: binary
 *                 description: Optional car image file
 *     responses:
 *       200:
 *         description: EmpCar updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "EmpCar updated successfully"
 *                 emp_car_id:
 *                   type: integer
 *                   example: 1
 *                 updated_fields:
 *                   type: object
 *                   properties:
 *                     car_brand:
 *                       type: string
 *                       example: "Toyota"
 *                     model:
 *                       type: string
 *                       example: "Camry"
 *                     license_plate:
 *                       type: string
 *                       example: "ABC-1234"
 *                     car_image:
 *                       type: string
 *                       example: "https://res.cloudinary.com/.../car_image.jpg"
 *       400:
 *         description: Invalid request data (e.g., no fields to update).
 *       404:
 *         description: EmpCar not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/update_emp_car/:emp_id', upload.single('car_image'), update_emp_car);


// NOTE - Delete EmpCar
/**
 * @swagger
 * /emp_car/delete_emp_car/{id}:
 *   delete:
 *     summary: Delete an emp_car
 *     description: Removes an emp_car from the database by ID.
 *     tags:
 *       - EmpCars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: EmpCar ID.
 *     responses:
 *       200:
 *         description: EmpCar deleted successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: EmpCar not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/delete_emp_car/:id", delete_emp_car);

export default router;
