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
exports.delete_employees = exports.update_employees = exports.get_employee_phonenumber = exports.show_image_employee_by_id = exports.show_more_employee_by_id = exports.show_employee_by_id = exports.show_status_employees = exports.show_all_employees = exports.uploadImage = exports.sign_in_employee = exports.create_employees = void 0;
const path_1 = __importDefault(require("path")); // To handle file paths
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const employees_model_1 = require("../model/employees.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Create a new employee
 */
// export const create_employees = async (req: Request, res: Response) => {
//   try {
//     const employeeData = req.body;
//     // Hash the password
//     const saltRounds = 10;
//     employeeData.password = await bcrypt.hash(employeeData.password, saltRounds);
//     // Upload avatar first if available
//     if (req.file && req.file.path) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "avatars",
//       });
//       if (!result.secure_url) {
//         throw new Error("Cloudinary upload failed");
//       }
//       // Add avatar URL to employee data
//       employeeData.avatar = result.secure_url;
//       // Delete local file
//       if (fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//     }
//     // Insert employee with avatar URL (if uploaded)
//     const employee = await employees_model.create_employees(employeeData);
//     res.status(201).json({
//       message: "Employee created successfully",
//       employee_id: employee.insertId,
//       avatar: employeeData.avatar || null,
//     });
//   } catch (error) {
//     console.error("Error creating employee:", error);
//     res.status(500).json({
//       message: "Failed to create employee",
//       error,
//     });
//   }
// };
const create_employees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeData = req.body;
        // Validate phone number format
        const telPattern = /^\+85620\d{8}$/;
        if (!telPattern.test(employeeData.tel)) {
            res.status(400).json({
                message: "Invalid phone number format. Expected format: +85620xxxxxxxx",
            });
            return;
        }
        // Hash the password
        const saltRounds = 10;
        employeeData.password = yield bcrypt_1.default.hash(employeeData.password, saltRounds);
        // Upload avatar if available
        if (req.file && req.file.path) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "avatars",
            });
            if (!result.secure_url) {
                throw new Error("Cloudinary upload failed");
            }
            employeeData.avatar = result.secure_url;
            if (fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
            }
        }
        const employee = yield employees_model_1.employees_model.create_employees(employeeData);
        res.status(201).json({
            message: "Employee created successfully",
            employee_id: employee.insertId,
            avatar: employeeData.avatar || null,
        });
    }
    catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({
            message: "Failed to create employee",
            error,
        });
    }
});
exports.create_employees = create_employees;
// Sign in employee
const sign_in_employee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Call the model's sign_in_employee function
        const employee = yield employees_model_1.employees_model.sign_in_employee(email, password);
        if (employee) {
            // If employee is found and password is correct
            res.status(200).send({
                message: "Sign-in successful",
                employee: {
                    id: employee.id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                },
            });
        }
        else {
            // If credentials are invalid
            res.status(401).send({
                message: "Invalid email or password",
            });
        }
    }
    catch (error) {
        // Log error with more context
        console.error("Error during employee sign in process:", error);
        // Respond with internal server error
        res.status(500).send({
            message: "Internal Server Error, please try again later",
        });
    }
});
exports.sign_in_employee = sign_in_employee;
/**
 *  UPDATE PROFILE EMPLOYEE
 */
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received upload request:", req.body);
        if (!req.file) {
            console.log("No file uploaded");
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        console.log("File uploaded:", req.file);
        const employeeId = parseInt(req.body.employeeId, 10);
        if (isNaN(employeeId)) {
            console.log("Invalid employeeId");
            res.status(400).json({ message: "Invalid employeeId" });
            return;
        }
        // อัปโหลดไฟล์ไปยัง Cloudinary
        const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: "employees",
        });
        if (!result.secure_url) {
            res.status(500).json({ message: "Cloudinary upload failed" });
            return;
        }
        console.log("Cloudinary URL:", result.secure_url);
        // ใช้ employees_model ในการบันทึกข้อมูลลงฐานข้อมูล
        yield employees_model_1.employees_model.update_employee_avatar(employeeId, result.secure_url);
        // ลบไฟล์ที่อัปโหลดในเครื่อง
        fs_1.default.unlinkSync(req.file.path);
        res.status(200).json({
            message: "File uploaded and avatar updated successfully",
            fileUrl: result.secure_url,
        });
    }
    catch (error) {
        console.error("Error uploading file:", error);
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
 * GET employee by status
 */
const show_status_employees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.query.status;
        if (!status || (status !== 'active' && status !== 'inactive')) {
            res.status(400).json({
                message: "Invalid status. Status must be either 'active' or 'inactive'.",
            });
            return;
        }
        const employees = yield employees_model_1.employees_model.show_status_employee(status);
        res.status(200).json({
            message: `Employees with status: ${status}`,
            data: employees,
        });
    }
    catch (error) {
        console.error("Error in showStatusEmployee:", error);
        res.status(500).json({
            message: "Failed to fetch employees by status",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.show_status_employees = show_status_employees;
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
            res.status(404).send("Employee details not found for this userz");
        }
    }
    catch (error) {
        console.error("Error fetching employee details by userId:", error);
        res.status(500).send("Failed to fetch employee details");
    }
});
exports.show_employee_by_id = show_employee_by_id;
//READ EMPLOYEE ID=5
const show_more_employee_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { empId } = req.params;
        console.log("Received userId:", empId); // Log to ensure the request is reaching the controller
        const employeeDetails = yield employees_model_1.employees_model.show_more_employee_by_id(Number(empId));
        console.log("Employee Details:", employeeDetails); // Log the result returned by the model
        if (employeeDetails) {
            res.status(200).send(employeeDetails);
        }
        else {
            res.status(404).send("Employee details not found for this employee");
        }
    }
    catch (error) {
        console.error("Error fetching employee details by userId:", error);
        res.status(500).send("Failed to fetch employee details");
    }
});
exports.show_more_employee_by_id = show_more_employee_by_id;
/**
 * Get image employee by ID
 */
const show_image_employee_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("Received employeeId:", id);
        const employeeImage = yield employees_model_1.employees_model.show_image_employee_by_id(Number(id));
        console.log("Employee Image:", employeeImage);
        if (employeeImage && employeeImage.avatar) {
            // If the avatar is a URL, just redirect or send the URL
            if (employeeImage.avatar.startsWith("http")) {
                return res.redirect(employeeImage.avatar); // Option 1: redirect
                // OR: res.status(200).json({ imageUrl: employeeImage.avatar }); // Option 2: return as JSON
            }
            // Fallback: try to serve as local file if it's not a URL
            const imagePath = path_1.default.join(__dirname, "../uploads", employeeImage.avatar);
            if (fs_1.default.existsSync(imagePath)) {
                return res.sendFile(imagePath);
            }
            else {
                res.status(400).send("Image not found for this employee");
            }
        }
        else {
            res.status(400).send("Employee image not found");
        }
    }
    catch (error) {
        console.error("Error fetching employee image by employeeId:", error);
        res.status(500).send("Failed to fetch employee image");
    }
});
exports.show_image_employee_by_id = show_image_employee_by_id;
// send SMS to employees
const get_employee_phonenumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "Invalid employee ID" });
        return;
    }
    try {
        const phoneNumber = yield employees_model_1.employees_model.get_employee_phone_number(id);
        if (!phoneNumber) {
            res.status(404).json({ message: "Employee not found or no phone number available" });
            return;
        }
        res.status(200).json({ tel: phoneNumber });
    }
    catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ message: "Failed to get employee phone number" });
    }
});
exports.get_employee_phonenumber = get_employee_phonenumber;
/**
 * Update an employee
 */
const update_employees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const employeeId = Number(id);
        if (isNaN(employeeId)) {
            res.status(400).json({ success: false, message: "Invalid employee ID" });
            return;
        }
        // Check if the employee exists
        const employeeExists = yield employees_model_1.employees_model.show_more_employee_by_id(employeeId);
        if (!employeeExists) {
            res.status(404).json({ success: false, message: `Employee with ID ${employeeId} not found` });
            return;
        }
        const employeeData = req.body;
        let avatarUrl = null;
        // Handle avatar image upload if a file exists
        if (req.file && req.file.path) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "avatars", // Optionally, specify a folder in Cloudinary
            });
            if (!result.secure_url) {
                throw new Error("Cloudinary upload failed");
            }
            avatarUrl = result.secure_url;
            // Clean up the uploaded file locally after Cloudinary upload
            if (fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path); // Delete local file
            }
        }
        // Build update data only from allowed fields
        const updateData = {};
        if (employeeData.first_name) {
            updateData.first_name = employeeData.first_name;
        }
        if (employeeData.last_name) {
            updateData.last_name = employeeData.last_name;
        }
        if (employeeData.email) {
            updateData.email = employeeData.email;
        }
        if (employeeData.tel) {
            updateData.tel = employeeData.tel;
        }
        if (employeeData.address) {
            updateData.address = employeeData.address;
        }
        if (employeeData.gender) {
            updateData.gender = employeeData.gender;
        }
        if (employeeData.cv) {
            updateData.cv = employeeData.cv;
        }
        if (avatarUrl) {
            updateData.avatar = avatarUrl;
        }
        if (employeeData.cat_id) {
            updateData.cat_id = employeeData.cat_id;
        }
        if (employeeData.price) {
            updateData.price = employeeData.price;
        }
        if (employeeData.status) {
            updateData.status = employeeData.status;
        }
        // Ensure there is something to update
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "No valid fields to update" });
            return;
        }
        // Proceed with the update using the model
        yield employees_model_1.employees_model.update_employees(employeeId, updateData);
        res.status(200).json({
            message: "Employee updated successfully",
            employee_id: employeeId,
            updated_fields: updateData,
        });
    }
    catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({
            message: "Failed to update employee",
            error: error instanceof Error ? error.message : error,
        });
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
function uploadAvatar(file) {
    throw new Error("Function not implemented.");
}
