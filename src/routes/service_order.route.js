"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_order_controller_1 = require("../controllers/service_order.controller");
const router = express_1.default.Router();
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
router.post("/create", service_order_controller_1.create_service_order);
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
router.get("/", service_order_controller_1.show_all_service_orders);
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
router.get("/:id", service_order_controller_1.show_service_order_by_id);
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
router.put("/update/:id", service_order_controller_1.update_service_order);
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
router.delete("/delete/:id", service_order_controller_1.delete_service_order);
exports.default = router;
