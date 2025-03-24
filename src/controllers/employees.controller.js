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
exports.delete_employees = exports.update_employees = exports.show_image_employee_by_id = exports.show_employee_by_id = exports.show_all_employees = exports.uploadImage = exports.create_employees = void 0;
const path_1 = __importDefault(require("path")); // To handle file paths
const fs_1 = __importDefault(require("fs"));
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
 *  UPDATE PROFILE EMPLOYEE
 */
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log the incoming request
        console.log('Received upload request:', req.body);
        if (!req.file) {
            console.log('No file uploaded');
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        // Log the file details
        console.log('File uploaded:', req.file);
        // Extract the file name from the full file path
        const fileName = path_1.default.basename(req.file.path); // Only extract the file name, not full path
        // Ensure employeeId is provided and is a valid number
        const employeeId = parseInt(req.body.employeeId, 10);
        if (isNaN(employeeId)) {
            console.log('Invalid employeeId');
            res.status(400).json({ message: "Invalid employeeId" });
            return;
        }
        // Log the file name and employee ID
        console.log('File name:', fileName);
        console.log('Employee ID:', employeeId);
        // Now update the avatar in the database with the file name (not the full path)
        yield employees_model_1.employees_model.saveFilePath(employeeId, fileName);
        // Construct the URL to access the uploaded file
        const fileUrl = `http://localhost:5000/uploads/${fileName}`;
        // Send the response with the file URL
        res.status(200).json({
            message: "File uploaded and avatar updated successfully",
            fileUrl, // Returning the URL path only
        });
    }
    catch (error) {
        console.error('Error uploading file:', error); // Log the error
        res.status(500).json({ message: "Error uploading file", error });
    }
});
exports.uploadImage = uploadImage;
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
 * Get employee by ID
 */
const show_employee_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("Received userId:", id); // Log to ensure the request is reaching the controller
        const employeeDetails = yield employees_model_1.employees_model.show_employee_by_id(Number(id));
        console.log("Employee Details:", employeeDetails); // Log the result returned by the model
        if (employeeDetails) {
            res.status(200).send(employeeDetails);
        }
        else {
            res.status(404).send("Employee details not found for this user");
        }
    }
    catch (error) {
        console.error("Error fetching employee details by userId:", error);
        res.status(500).send("Failed to fetch employee details");
    }
});
exports.show_employee_by_id = show_employee_by_id;
/**
 * Get image employee by ID
 */
const show_image_employee_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get employee ID from request parameters
        console.log("Received employeeId:", id); // Log the received ID
        // Get employee image details from the model
        const employeeImage = yield employees_model_1.employees_model.show_image_employee_by_id(Number(id));
        console.log("Employee Image:", employeeImage); // Log the result returned by the model
        // Check if employee image was found
        if (employeeImage && employeeImage.avatar) {
            const imagePath = path_1.default.join(__dirname, "../uploads", employeeImage.avatar); // Construct the full path to the image
            // Check if the image file exists
            if (fs_1.default.existsSync(imagePath)) {
                res.sendFile(imagePath); // Send the image if it exists
            }
            else {
                res.status(404).send("Image not found for this employee");
            }
        }
        else {
            // If no image found or an error occurred
            res.status(404).send(employeeImage.message || "Employee image not found");
        }
    }
    catch (error) {
        console.error("Error fetching employee image by employeeId:", error);
        res.status(500).send("Failed to fetch employee image");
    }
});
exports.show_image_employee_by_id = show_image_employee_by_id;
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
