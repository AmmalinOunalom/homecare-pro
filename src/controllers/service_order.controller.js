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
const employees_model_1 = require("../model/employees.model");
const user_model_1 = require("../model/user.model");
const address_users_details_model_1 = require("../model/address_users_details.model");
const twilio_1 = __importDefault(require("twilio"));
const twilio_account = process.env.TWILIO_ACCOUNT_SID;
const twilio_auth = process.env.TWILIO_AUTH_TOKEN;
const twilio_phone = process.env.TWILIO_PHONE_NUMBER;
const client = (0, twilio_1.default)(twilio_account, twilio_auth);
/**
 * Create a new service order
 */
const create_service_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        yield service_order_model_1.service_order_model.create_service_order(orderData);
        const emp_number = yield employees_model_1.employees_model.get_employee_phone_number(orderData.employees_id);
        if (!emp_number) {
            res.status(404).send("Employee phone number not found");
            return;
        }
        const user_info = yield user_model_1.user_model.get_user_by_id(orderData.user_id);
        if (!user_info) {
            res.status(404).send("User not found");
            return;
        }
        const user_number = user_info.tel;
        if (!user_number) {
            res.status(404).send("User phone number not found");
            return;
        }
        // ✅ Get full address info
        const address = yield address_users_details_model_1.address_users_details_model.get_address_by_user_id(orderData.user_id);
        if (!address) {
            res.status(404).send("Address not found");
            return;
        }
        const { address_description, village, address_name, google_link_map } = address;
        const formattedNumber = emp_number.startsWith("+")
            ? emp_number
            : "+856" + emp_number.slice(1);
        try {
            yield client.messages.create({
                body: `ສະບາຍດີ, ນີ້ແມ່ນການເອີ້ນໃຊ້ບໍລິການຈາກ Homecare ໂດຍມີຂໍ້ມູນດັ່ງນີ້:\n` +
                    ` ເບີໂທຜູ້ໃຊ້ບໍລິການ: ${user_number}\n` +
                    `ຊື່ສະຖານທີ່: ${address_name}\n` +
                    `ບ້ານ: ${village}\n` +
                    `ລາຍລະອຽດ: ${address_description}\n` +
                    `ແຜນທີ່: ${google_link_map}`,
                from: 'whatsapp:' + twilio_phone,
                to: 'whatsapp:' + formattedNumber,
            });
            res.status(201).send("Service order and SMS sent successfully");
        }
        catch (smsError) {
            console.error("Error sending SMS:", smsError);
            res.status(500).send("Service order created, but failed to send SMS");
        }
    }
    catch (error) {
        console.error("Service order creation error:", error);
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
