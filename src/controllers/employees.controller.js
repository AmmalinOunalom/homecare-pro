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
exports.delete_employees = exports.update_employees = exports.show_all_employees = exports.create_employees = void 0;
const employees_model_1 = require("../model/employees.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Create a new employee
 */
const create_employees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        // Hash the password before saving
        const saltRounds = 10;
        req.body.password = yield bcrypt_1.default.hash(password, saltRounds);
        const employee = yield employees_model_1.employees_model.create_employees(req.body); // Now the password is hashed
        res.status(200).send("Employee created successfully");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.create_employees = create_employees;
/**
 * Retrieve all employees
 */
const show_all_employees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employees_model_1.employees_model.show_all_employees();
        res.status(200).send(employees);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_employees = show_all_employees;
/**
 * Update an employee
 */
const update_employees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedEmployee = yield employees_model_1.employees_model.update_employees(Number(id), req.body);
        res.status(200).send("Employee updated successfully");
    }
    catch (error) {
        res.status(500).send("Failed to update employee");
    }
});
exports.update_employees = update_employees;
/**
 * Delete an employee (Soft Delete)
 */
const delete_employees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield employees_model_1.employees_model.delete_employees(Number(id));
        res.status(200).send("Employee deleted successfully");
    }
    catch (error) {
        res.status(500).send("Failed to delete employee");
    }
});
exports.delete_employees = delete_employees;
