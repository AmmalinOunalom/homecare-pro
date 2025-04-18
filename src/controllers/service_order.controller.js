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
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_service_order = exports.update_service_order = exports.show_service_order_by_id = exports.show_all_service_orders = exports.create_service_order = void 0;
const service_order_model_1 = require("../model/service_order.model");
/**
 * Create a new service order
 */
const create_service_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        yield service_order_model_1.service_order_model.create_service_order(orderData);
        res.status(201).send("Service order created successfully");
    }
    catch (error) {
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
