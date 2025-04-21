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
exports.service_order_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["NotStart"] = "Not Start";
    ServiceStatus["Arrived"] = "Arrived";
    ServiceStatus["InProgress"] = "In Progress";
})(ServiceStatus || (ServiceStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["NotPaid"] = "Not paid";
    PaymentStatus["Paid"] = "Paid";
})(PaymentStatus || (PaymentStatus = {}));
class service_order_model {
    // Create a new service order
    static create_service_order(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO service_order 
                (user_id, employees_id, cat_id, address_users_detail_id, amount, service_status, payment_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
                const values = [
                    order.user_id,
                    order.employees_id,
                    order.cat_id,
                    order.address_users_detail_id,
                    order.amount,
                    order.service_status,
                    order.payment_status
                ];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error creating service order:", error);
                throw new Error("Failed to create service order");
            }
        });
    }
    // Show all service orders
    static show_all_service_orders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM service_order';
                const [rows] = yield base_database_1.default.execute(query);
                return rows;
            }
            catch (error) {
                console.error("Error fetching service orders:", error);
                throw new Error("Failed to fetch service orders");
            }
        });
    }
    // Show service order by ID
    static show_service_order_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM service_order WHERE id = ?';
                const [rows] = yield base_database_1.default.execute(query, [id]);
                if (rows.length > 0) {
                    return rows[0];
                }
                else {
                    throw new Error("Service order not found");
                }
            }
            catch (error) {
                console.error("Error fetching service order:", error);
                throw new Error("Failed to fetch service order");
            }
        });
    }
    // Update service order
    static update_service_order(id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                UPDATE service_orders 
                SET user_id = ?, employees_id = ?, cat_id = ?, address_users_detail_id = ?, 
                    amount = ?, service_status = ?, payment_status, updated_at = NOW() 
                WHERE id = ?
            `;
                const values = [
                    order.user_id,
                    order.employees_id,
                    order.cat_id,
                    order.address_users_detail_id,
                    order.amount,
                    order.service_status,
                    order.payment_status,
                    id
                ];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error updating service order:", error);
                throw new Error("Failed to update service order");
            }
        });
    }
    // Delete service order
    static delete_service_order(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'DELETE FROM service_order WHERE id = ?';
                const [result] = yield base_database_1.default.execute(query, [id]);
                return result;
            }
            catch (error) {
                console.error("Error deleting service order:", error);
                throw new Error("Failed to delete service order");
            }
        });
    }
}
exports.service_order_model = service_order_model;
