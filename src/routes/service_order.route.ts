import express from "express";
import { create_service_order, show_all_service_orders, show_service_order_by_id, update_service_order, delete_service_order } from "../controllers/service_order.controller";

const router = express.Router();

/**
 * @swagger
 * /service_order/create:  # This should match the route path
 *   post:
 *     summary: Create a new service order
 *     description: Adds a new service order with payment status and amount, after validating user_id, employees_id, cat_id, and address_users_detail_id.
 *     tags:
 *       - Service Orders
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
 *               cat_id:
 *                 type: integer
 *                 example: 3
 *               address_users_detail_id:
 *                 type: integer
 *                 example: 7
 *               amount:
 *                 type: integer
 *                 example: 150
 *               payment_status:
 *                 type: string
 *                 enum: ["arrived", "finished"]
 *                 example: "arrived"
 *     responses:
 *       201:
 *         description: Service order created successfully.
 *       400:
 *         description: Invalid input data (e.g., non-existent user_id, employees_id, category, or address).
 *       500:
 *         description: Internal server error.
 */
router.post("/create", create_service_order);

// NOTE - Show All Service Orders
/**
 * @swagger
 * /service_order:
 *   get:
 *     summary: Get all service orders
 *     description: Fetches all service orders from the database.
 *     tags:
 *       - Service Orders
 *     responses:
 *       200:
 *         description: A list of all service orders.
 *       500:
 *         description: Internal server error.
 */
router.get("/", show_all_service_orders);

// NOTE - Show Service Order by ID
/**
 * @swagger
 * /service_order/{id}:
 *   get:
 *     summary: Get service order by ID
 *     description: Fetches a specific service order by its ID.
 *     tags:
 *       - Service Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service order to retrieve.
 *     responses:
 *       200:
 *         description: Service order found.
 *       404:
 *         description: Service order not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", show_service_order_by_id);

// NOTE - Update Service Order
/**
 * @swagger
 * /service_order/update/{id}:
 *   put:
 *     summary: Update a service order
 *     description: Updates an existing service order by ID.
 *     tags:
 *       - Service Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service order to update.
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
 *               cat_id:
 *                 type: integer
 *                 example: 3
 *               address_users_detail_id:
 *                 type: integer
 *                 example: 7
 *               amount:
 *                 type: integer
 *                 example: 200
 *               payment_status:
 *                 type: string
 *                 enum: ["arrived", "finished"]
 *                 example: "finished"
 *     responses:
 *       200:
 *         description: Service order updated successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Service order not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/update/:id", update_service_order);

// NOTE - Delete Service Order
/**
 * @swagger
 * /service_order/delete/{id}:
 *   delete:
 *     summary: Delete a service order
 *     description: Removes a service order from the database by ID.
 *     tags:
 *       - Service Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service order to delete.
 *     responses:
 *       200:
 *         description: Service order deleted successfully.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Service order not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/delete/:id", delete_service_order);

export default router;
