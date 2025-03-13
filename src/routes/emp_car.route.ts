import express from "express";
import { create_emp_car, show_all_emp_cars, update_emp_car, delete_emp_car } from "../controllers/emp_car.controller";

const router = express.Router();

// NOTE - Show All EmpCars
/**
 * @swagger
 * /emp_cars:
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
router.get("/", show_all_emp_cars);

// NOTE - Create EmpCar
/**
 * @swagger
 * /emp_cars:
 *   post:
 *     summary: Create a new emp_car
 *     description: Adds a new emp_car to the database.
 *     tags:
 *       - EmpCars
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emp_id
 *               - car_brand
 *               - model
 *               - license_plate
 *               - status
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
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *     responses:
 *       201:
 *         description: EmpCar created successfully.
 *       400:
 *         description: Bad request, missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/", create_emp_car);

// NOTE - Update EmpCar
/**
 * @swagger
 * /emp_cars:
 *   put:
 *     summary: Update an emp_car
 *     description: Updates an emp_car's details by ID.
 *     tags:
 *       - EmpCars
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - emp_id
 *               - car_brand
 *               - model
 *               - license_plate
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               emp_id:
 *                 type: integer
 *                 example: 1
 *               car_brand:
 *                 type: string
 *                 example: "Honda"
 *               model:
 *                 type: string
 *                 example: "Civic"
 *               license_plate:
 *                 type: string
 *                 example: "XYZ-9876"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: INACTIVE
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
router.put("/", update_emp_car);

// NOTE - Delete EmpCar
/**
 * @swagger
 * /emp_cars/{id}:
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
router.delete("/:id", delete_emp_car);

export default router;
