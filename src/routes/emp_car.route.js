"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emp_car_controller_1 = require("../controllers/emp_car.controller");
const images_config_1 = __importDefault(require("../config/images.config"));
const router = express_1.default.Router();
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
router.get("/read_emp_car", emp_car_controller_1.show_all_emp_cars);
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
router.post("/upload_car_image", images_config_1.default.single("car_image"), emp_car_controller_1.upload_car_image);
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
router.post("/create_emp_car", images_config_1.default.single("car_image"), emp_car_controller_1.create_emp_car);
// NOTE - Update EmpCar
/**
 * @swagger
 * /emp_car/update_emp_car/{id}:
 *   put:
 *     summary: Update an emp_car
 *     description: Updates an emp_car's details in the database by ID.
 *     tags:
 *       - EmpCars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the emp_car record to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emp_id:
 *                 type: integer
 *                 example: 3
 *               car_brand:
 *                 type: string
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 example: "Camry"
 *               license_plate:
 *                 type: string
 *                 example: "ABC-1234"
 *     responses:
 *       200:
 *         description: EmpCar updated successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: EmpCar not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/update_emp_car/:id", emp_car_controller_1.update_emp_car);
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
router.delete("/delete_emp_car/:id", emp_car_controller_1.delete_emp_car);
exports.default = router;
