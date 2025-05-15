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
exports.show_employee_five_report = exports.get_total_payments = exports.show_all_payments_report = exports.show_all_history_of_emp_cars_report = exports.show_all_emp_cars_report = exports.show_all_comments_report = exports.show_all_employees_report = exports.show_all_service_orders_report = void 0;
const reports_model_1 = require("../model/reports.model");
/**
 * Get all service orders reports optionally filtered by date
 */
const show_all_service_orders_report = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        // Validate page and limit
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        // Build filters object with validation for dates, page, and limit
        const filters = {
            startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
            endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
            page: !isNaN(page) && page > 0 ? page : 1,
            limit: !isNaN(limit) && limit > 0 ? limit : 10,
        };
        // Call the model function to fetch the service orders report
        const orders = yield reports_model_1.reports_model.show_all_service_order_reports(filters);
        // Return the data as JSON response
        res.status(200).json({
            data: orders,
        });
    }
    catch (error) {
        console.error("Error fetching reports:", error); // Logs the error to the console for debugging
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_service_orders_report = show_all_service_orders_report;
/**
 * Get all employees reports optionally filtered by date
 */
const show_all_employees_report = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const filters = {
            startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
            endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
            page: !isNaN(page) && page > 0 ? page : 1,
            limit: !isNaN(limit) && limit > 0 ? limit : 10,
        };
        const data = yield reports_model_1.reports_model.show_all_employees_reports(filters);
        res.status(200).json({ data });
    }
    catch (error) {
        console.error("Error fetching employee reports:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_employees_report = show_all_employees_report;
/**
 * Get all comments reports optionally filtered by date
 */
const show_all_comments_report = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const filters = {
            startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
            endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
            page: !isNaN(page) && page > 0 ? page : 1,
            limit: !isNaN(limit) && limit > 0 ? limit : 10,
        };
        const orders = yield reports_model_1.reports_model.show_all_comments_reports(filters);
        res.status(200).json({ data: orders });
    }
    catch (error) {
        console.error("Error fetching comment reports:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_comments_report = show_all_comments_report;
//NOTE - show all emp_cars
const show_all_emp_cars_report = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const filters = {
            startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
            endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
            page: !isNaN(page) && page > 0 ? page : 1,
            limit: !isNaN(limit) && limit > 0 ? limit : 10,
        };
        const orders = yield reports_model_1.reports_model.show_all_emp_cars_reports(filters);
        res.status(200).json({ data: orders });
    }
    catch (error) {
        console.error("Error fetching comment reports:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_emp_cars_report = show_all_emp_cars_report;
//NOTE - show all history of emp_cars
const show_all_history_of_emp_cars_report = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const filters = {
            startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
            endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
            page: !isNaN(page) && page > 0 ? page : 1,
            limit: !isNaN(limit) && limit > 0 ? limit : 10,
        };
        const history = yield reports_model_1.reports_model.show_all_history_of_emp_cars_reports(filters);
        res.status(200).json({ data: history });
    }
    catch (error) {
        console.error("Error fetching employee car history reports:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_history_of_emp_cars_report = show_all_history_of_emp_cars_report;
//NOTE - show all payments
const show_all_payments_report = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const filters = {
            startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
            endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
            page: !isNaN(page) && page > 0 ? page : 1,
            limit: !isNaN(limit) && limit > 0 ? limit : 10,
        };
        const orders = yield reports_model_1.reports_model.show_all_payments_reports(filters);
        res.status(200).json({ data: orders });
    }
    catch (error) {
        console.error("Error fetching comment reports:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_payments_report = show_all_payments_report;
//NOTE - get total payments
const get_total_payments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const total = yield reports_model_1.reports_model.count_toltal_payments_reports(); // note: check spelling
        res.status(200).json({
            message: "Total payments calculated successfully",
            total_amount: total,
        });
    }
    catch (error) {
        console.error("Error in getTotalPayments:", error);
        res.status(500).json({
            message: "Failed to calculate total payments",
        });
    }
});
exports.get_total_payments = get_total_payments;
//NOTE - READ EMPLOYEE ID=5
const show_employee_five_report = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empId } = req.params;
        const { startDate, endDate } = req.query;
        console.log("Received empId:", empId);
        const filters = {
            startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
            endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
        };
        const employeeDetails = yield reports_model_1.reports_model.show_employee_5_reports(Number(empId), filters);
        console.log("Employee Details:", employeeDetails);
        if (employeeDetails) {
            res.status(200).json({ data: employeeDetails });
        }
        else {
            res.status(404).send("Employee details not found for this employee");
        }
    }
    catch (error) {
        console.error("Error fetching employee details by empId:", error);
        res.status(500).send("Failed to fetch employee details");
    }
});
exports.show_employee_five_report = show_employee_five_report;
