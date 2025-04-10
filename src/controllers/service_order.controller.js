"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_service_order = exports.update_service_order = exports.show_service_order_by_id = exports.show_all_service_orders = exports.create_service_order = void 0;
const service_order_model_1 = require("../model/service_order.model");
const base_database_1 = __importDefault(require("../config/base.database"));
/**
 * Create a new service order
 */
const create_service_order = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, employees_id, cat_id, address_users_detail_id, amount, payment_status } = req.body;
    try {
        // Log the incoming request body
        console.log("Received service order data:", req.body);
        // Check if user_id exists in the users table
        console.log(`Checking if user_id ${user_id} exists in the users table...`);
        const [userExists] = yield base_database_1.default.execute(`SELECT id FROM users WHERE id = ?`, [user_id]);
        if (!userExists.length) {
            console.log(`User ID ${user_id} does not exist.`);
            res.status(400).json({ error: "User ID does not exist" });
            return; // Return early to avoid proceeding
        }
        // Check if employees_id exists in the employees table
        console.log(`Checking if employees_id ${employees_id} exists in the employees table...`);
        const [employeeExists] = yield base_database_1.default.execute(`SELECT id FROM employees WHERE id = ?`, [employees_id]);
        if (!employeeExists.length) {
            console.log(`Employee ID ${employees_id} does not exist.`);
            res.status(400).json({ error: "Employee ID does not exist" });
            return;
        }
        // Check if category ID exists in the categories table
        console.log(`Checking if category_id ${cat_id} exists in the categories table...`);
        const [categoryExists] = yield base_database_1.default.execute(`SELECT id FROM categories WHERE id = ?`, [cat_id]);
        if (!categoryExists.length) {
            console.log(`Category ID ${cat_id} does not exist.`);
            res.status(400).json({ error: "Category ID does not exist" });
            return;
        }
        // Check if address_users_detail_id exists in the address_users_detail table
        console.log(`Checking if address_users_detail_id ${address_users_detail_id} exists...`);
        const [addressExists] = yield base_database_1.default.execute(`SELECT id FROM address_users_detail WHERE id = ?`, [address_users_detail_id]);
        if (!addressExists.length) {
            console.log(`Address ID ${address_users_detail_id} does not exist.`);
            res.status(400).json({ error: "Address ID does not exist" });
            return;
        }
        // If all the validations pass, create the service order
        const orderData = {
            user_id,
            employees_id,
            cat_id,
            address_users_detail_id,
            amount,
            payment_status
        };
        console.log("Creating the service order with data:", orderData);
        // Call the function to create the service order in the database
        yield service_order_model_1.service_order_model.create_service_order(orderData);
        // Log success
        console.log("Service order created successfully.");
        // Return success response with the created service order
        res.status(201).send("Service order created successfully");
    }
    catch (error) {
        // Log the error and handle any unexpected errors
        console.error("Error occurred while creating service order:", error);
        res.status(500).send("Failed to create service order");
    }
});
exports.create_service_order = create_service_order;
/**
 * Retrieve all service orders
 */
const show_all_service_orders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield service_order_model_1.service_order_model.show_all_service_orders();
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_service_orders = show_all_service_orders;
/**
 * Retrieve a service order by ID
 */
const show_service_order_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield service_order_model_1.service_order_model.show_service_order_by_id(Number(id));
        if (order) {
            res.status(200).json(order);
        }
        else {
            res.status(404).send("Service order not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to fetch service order");
    }
});
exports.show_service_order_by_id = show_service_order_by_id;
/**
 * Update a service order
 */
const update_service_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedOrder = yield service_order_model_1.service_order_model.update_service_order(Number(id), req.body);
        if (updatedOrder) {
            res.status(200).send("Service order updated successfully");
        }
        else {
            res.status(404).send("Service order not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to update service order");
    }
});
exports.update_service_order = update_service_order;
/**
 * Delete a service order
 */
const delete_service_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedOrder = yield service_order_model_1.service_order_model.delete_service_order(Number(id));
        if (deletedOrder) {
            res.status(200).send("Service order deleted successfully");
        }
        else {
            res.status(404).send("Service order not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to delete service order");
    }
});
exports.delete_service_order = delete_service_order;
