"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reports_controller_1 = require("../controllers/reports.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /reports/service_orders:
 *   get:
 *     summary: Get all service orders
 *     description: Fetches all service orders with optional pagination and date filtering.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date to filter by (optional).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date to filter by (optional).
 *     responses:
 *       200:
 *         description: A list of service orders.
 *       500:
 *         description: Internal server error.
 */
router.get("/service_orders", reports_controller_1.show_all_service_orders_report);
/**
 * @swagger
 * /reports/comments:
 *   get:
 *     summary: Get all comments report
 *     description: Fetches all comments with optional pagination and date filtering.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date to filter by (optional).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date to filter by (optional).
 *     responses:
 *       200:
 *         description: A list of comments.
 *       500:
 *         description: Internal server error.
 */
router.get("/comments", reports_controller_1.show_all_comments_report);
/**
 * @swagger
 * /reports/employees:
 *   get:
 *     summary: Get employee reports
 *     description: Fetches employee reports with optional pagination and date filtering.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date to filter by (optional).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date to filter by (optional).
 *     responses:
 *       200:
 *         description: List of employee reports.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/employees", reports_controller_1.show_all_employees_report);
/**
 * @swagger
 * /reports/emp_cars_history:
 *   get:
 *     summary: Get history report of all employee cars
 *     description: Returns a list of employees, their car history, service order status, and prices, filtered optionally by start date, end date, and paginated.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering (e.g., 2024-01-01)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering (e.g., 2024-12-31)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved employee car history
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
 *                       employee_id:
 *                         type: integer
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       cat_id:
 *                         type: integer
 *                       amount:
 *                         type: number
 *                       service_status:
 *                         type: string
 *                         enum: [not start, arrived, in progress, finished]
 *                       order_date:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/emp_cars_history", reports_controller_1.show_all_history_of_emp_cars_report);
/**
 * @swagger
 * /reports/payments:
 *   get:
 *     summary: Get all comments report
 *     description: Fetches all comments with optional pagination and date filtering.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date to filter by (optional).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date to filter by (optional).
 *     responses:
 *       200:
 *         description: A list of comments.
 *       500:
 *         description: Internal server error.
 */
router.get("/payments", reports_controller_1.show_all_payments_report);
/**
 * @swagger
 * /reports/total_payments:
 *   get:
 *     summary: Get total payments
 *     description: Calculates and returns the total amount of all payments from the service_order table.
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: Total payments calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Total payments calculated successfully
 *                 total_amount:
 *                   type: number
 *                   example: 1000000
 *       500:
 *         description: Failed to calculate total payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to calculate total payments
 */
router.get("/total_payments", reports_controller_1.get_total_payments);
exports.default = router;
