"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_order_controller_1 = require("../controllers/service_order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// NOTE - Create Service Order
/**
 * @swagger
 * /service_order/create:
 *   post:
 *     summary: Create a new service order
 *     description: Adds a new service order including user, employee, category, address, amount, payment status, and service status.
 *     tags:
 *       - Service Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - employees_id
 *               - cat_id
 *               - address_users_detail_id
 *               - amount
 *               - payment_status
 *               - service_status
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user placing the order.
 *                 example: 5
 *               employees_id:
 *                 type: integer
 *                 description: ID of the employee assigned to the service.
 *                 example: 10
 *               cat_id:
 *                 type: integer
 *                 description: Category ID of the service.
 *                 example: 3
 *               address_users_detail_id:
 *                 type: integer
 *                 description: ID referencing user's address detail.
 *                 example: 7
 *               amount:
 *                 type: integer
 *                 description: Cost of the service.
 *                 example: 150
 *               payment_status:
 *                 type: string
 *                 description: Status of the payment.
 *                 enum: [not paid, paid]
 *                 example: "not paid"
 *               service_status:
 *                 type: string
 *                 description: Current status of the service.
 *                 enum: [Not Start, Arrived, In Progress]
 *                 example: "Not Start"
 *     responses:
 *       201:
 *         description: Service order created successfully.
 *       400:
 *         description: Invalid input data.
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
/**
 * @swagger
 * /service_order/my_service_order:
 *   get:
 *     summary: Get service orders of the authenticated user
 *     description: Retrieves all service orders made by the logged-in user.
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's service orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       service_id:
 *                         type: integer
 *                       address_users_details_id:
 *                         type: integer
 *                       order_date:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                       total_price:
 *                         type: number
 *                       payment_method:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get("/my_service_order", auth_middleware_1.authenticateToken, service_order_controller_1.get_my_service_order);
// NOTE - Show Service Order by ID
/**
 * @swagger
 * /service_order/update/{id}:
 *   put:
 *     summary: Update service order payment and status
 *     description: Updates the service status (required) and optionally the payment status of a specific service order by ID.
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
 *             required:
 *               - service_status
 *             properties:
 *               service_status:
 *                 type: string
 *                 description: Service completion status of the order.
 *                 enum: [Not Start, Arrived, In Progress, finished]
 *                 example: "Not Start"
 *     responses:
 *       200:
 *         description: Service order status updated successfully.
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
