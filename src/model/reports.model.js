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
exports.reports_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
class reports_model {
    static show_all_service_order_reports(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, page, limit } = filters;
                let query = "SELECT * FROM service_order";
                const queryParams = [];
                // Add date filters if available
                if (startDate && endDate) {
                    query += " WHERE created_at BETWEEN ? AND ?";
                    queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
                }
                else if (startDate) {
                    query += " WHERE created_at >= ?";
                    queryParams.push(`${startDate} 00:00:00`);
                }
                else if (endDate) {
                    query += " WHERE created_at <= ?";
                    queryParams.push(`${endDate} 23:59:59`);
                }
                // Validate and set the limit and offset
                const validLimit = limit && !isNaN(Number(limit)) ? Number(limit) : 10; // Default limit to 10
                const validPage = page && !isNaN(Number(page)) ? Number(page) : 1; // Default page to 1
                const offset = (validPage - 1) * validLimit; // Calculate the offset
                // Add ordering and pagination to the query
                query += ` ORDER BY created_at DESC LIMIT ${validLimit} OFFSET ${offset}`;
                // Log the query and query params to check them
                console.log("Query:", query);
                console.log("Query Params:", queryParams);
                // Execute the query with the parameters
                const [rows] = yield base_database_1.default.execute(query, queryParams);
                return rows;
            }
            catch (error) {
                console.error("Error fetching reports:", error); // More detailed error message
                throw new Error(`Failed to fetch reports`);
            }
        });
    }
    //NOTE - show all employees reports
    static show_all_employees_reports(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, page, limit } = filters;
                let query = "SELECT employees_id, amount, service_status, created_at, updated_at FROM service_order";
                const queryParams = [];
                if (startDate && endDate) {
                    query += " WHERE created_at BETWEEN ? AND ?";
                    queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
                }
                else if (startDate) {
                    query += " WHERE created_at >= ?";
                    queryParams.push(`${startDate} 00:00:00`);
                }
                else if (endDate) {
                    query += " WHERE created_at <= ?";
                    queryParams.push(`${endDate} 23:59:59`);
                }
                const validLimit = limit && !isNaN(Number(limit)) ? Number(limit) : 10;
                const validPage = page && !isNaN(Number(page)) ? Number(page) : 1;
                const offset = (validPage - 1) * validLimit;
                query += ` ORDER BY created_at DESC LIMIT ${validLimit} OFFSET ${offset}`;
                console.log("Query:", query);
                console.log("Query Params:", queryParams);
                const [rows] = yield base_database_1.default.execute(query, queryParams);
                return rows;
            }
            catch (error) {
                console.error("Error fetching employee reports:", error);
                throw new Error("Failed to fetch employee reports");
            }
        });
    }
    //NOTE - show all comments reports
    static show_all_comments_reports(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, page, limit } = filters;
                let query = "SELECT * FROM comments";
                const queryParams = [];
                if (startDate && endDate) {
                    query += " WHERE created_at BETWEEN ? AND ?";
                    queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
                }
                else if (startDate) {
                    query += " WHERE created_at >= ?";
                    queryParams.push(`${startDate} 00:00:00`);
                }
                else if (endDate) {
                    query += " WHERE created_at <= ?";
                    queryParams.push(`${endDate} 23:59:59`);
                }
                const validLimit = limit && !isNaN(Number(limit)) ? Number(limit) : 10;
                const validPage = page && !isNaN(Number(page)) ? Number(page) : 1;
                const offset = (validPage - 1) * validLimit;
                query += ` ORDER BY created_at DESC LIMIT ${validLimit} OFFSET ${offset}`;
                console.log("Query:", query);
                console.log("Query Params:", queryParams);
                const [rows] = yield base_database_1.default.execute(query, queryParams);
                return rows;
            }
            catch (error) {
                console.error("Error fetching comment reports:", error);
                throw new Error("Failed to fetch comment reports");
            }
        });
    }
    //NOTE - show all emp cars reports
    static show_all_emp_cars_reports(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, page, limit } = filters;
                let query = "SELECT * FROM emp_cars";
                const queryParams = [];
                if (startDate && endDate) {
                    query += " WHERE created_at BETWEEN ? AND ?";
                    queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
                }
                else if (startDate) {
                    query += " WHERE created_at >= ?";
                    queryParams.push(`${startDate} 00:00:00`);
                }
                else if (endDate) {
                    query += " WHERE created_at <= ?";
                    queryParams.push(`${endDate} 23:59:59`);
                }
                const validLimit = limit && !isNaN(Number(limit)) ? Number(limit) : 10;
                const validPage = page && !isNaN(Number(page)) ? Number(page) : 1;
                const offset = (validPage - 1) * validLimit;
                query += ` ORDER BY created_at DESC LIMIT ${validLimit} OFFSET ${offset}`;
                console.log("Query:", query);
                console.log("Query Params:", queryParams);
                const [rows] = yield base_database_1.default.execute(query, queryParams);
                return rows;
            }
            catch (error) {
                console.error("Error fetching comment reports:", error);
                throw new Error("Failed to fetch comment reports");
            }
        });
    }
    //NOTE - Show all history of employee cars
    static show_all_history_of_emp_cars_reports(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, page, limit } = filters;
                const queryParams = [];
                let query = `
      SELECT 
        employees.id AS employee_id,
        employees.first_name,
        employees.last_name,
        employees.cat_id,
        service_order.amount,
        service_order.service_status,
        service_order.created_at AS order_date
      FROM employees
      LEFT JOIN emp_cars ON emp_cars.emp_id = employees.id
      LEFT JOIN service_order ON service_order.employees_id = employees.id
    `;
                if (startDate && endDate) {
                    query += " WHERE service_order.created_at BETWEEN ? AND ?";
                    queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
                }
                else if (startDate) {
                    query += " WHERE service_order.created_at >= ?";
                    queryParams.push(`${startDate} 00:00:00`);
                }
                else if (endDate) {
                    query += " WHERE service_order.created_at <= ?";
                    queryParams.push(`${endDate} 23:59:59`);
                }
                const validLimit = limit && !isNaN(Number(limit)) ? Number(limit) : 10;
                const validPage = page && !isNaN(Number(page)) ? Number(page) : 1;
                const offset = (validPage - 1) * validLimit;
                query += ` ORDER BY service_order.created_at DESC LIMIT ${validLimit} OFFSET ${offset}`;
                console.log("Query:", query);
                console.log("Query Params:", queryParams);
                const [rows] = yield base_database_1.default.execute(query, queryParams);
                return rows;
            }
            catch (error) {
                console.error("Error fetching emp car history reports:", error);
                throw new Error("Failed to fetch employee car history reports");
            }
        });
    }
    //NOTE - show all payments reports
    static show_all_payments_reports(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, page, limit } = filters;
                let query = "SELECT id, amount, cat_id, payment_status, created_at FROM service_order";
                const queryParams = [];
                if (startDate && endDate) {
                    query += " WHERE created_at BETWEEN ? AND ?";
                    queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
                }
                else if (startDate) {
                    query += " WHERE created_at >= ?";
                    queryParams.push(`${startDate} 00:00:00`);
                }
                else if (endDate) {
                    query += " WHERE created_at <= ?";
                    queryParams.push(`${endDate} 23:59:59`);
                }
                const validLimit = limit && !isNaN(Number(limit)) ? Number(limit) : 10;
                const validPage = page && !isNaN(Number(page)) ? Number(page) : 1;
                const offset = (validPage - 1) * validLimit;
                query += ` ORDER BY created_at ASC LIMIT ${validLimit} OFFSET ${offset}`;
                console.log("Query:", query);
                console.log("Query Params:", queryParams);
                const [rows] = yield base_database_1.default.execute(query, queryParams);
                return rows;
            }
            catch (error) {
                console.error("Error fetching comment reports:", error);
                throw new Error("Failed to fetch comment reports");
            }
        });
    }
    //NOTE - show all payments reports
    static count_toltal_payments_reports() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const query = "SELECT SUM(amount) AS total FROM service_order";
                const [rows] = yield base_database_1.default.execute(query);
                return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; // if null, return 0
            }
            catch (error) {
                console.error("Error counting payments:", error);
                throw new Error("Failed to count total payments");
            }
        });
    }
}
exports.reports_model = reports_model;
