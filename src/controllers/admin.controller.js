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
exports.forgot_password_admin = exports.rename_admin = exports.sign_in_admin = exports.sign_up_admin = exports.show_all_admins = void 0;
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
const admin_model_1 = require("../model/admin.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// show all users
const show_all_admins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield admin_model_1.admin_model.show_all_admins();
        res.status(200).send(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_admins = show_all_admins;
//NOTE - SIGN UP ANDMIN
const sign_up_admin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = req.body;
        // Hash the password
        const saltRounds = 10;
        adminData.password = yield bcrypt_1.default.hash(adminData.password, saltRounds);
        // Insert admin without avatar
        const admin = yield admin_model_1.admin_model.sign_up_admin(adminData);
        res.status(201).json({
            message: "Admin created successfully",
            admin_id: admin.insertId,
        });
    }
    catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({
            message: "Failed to create admin",
            error,
        });
    }
});
exports.sign_up_admin = sign_up_admin;
//NOTE - SIGN IN ADMIN
const sign_in_admin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const admin = yield admin_model_1.admin_model.sign_in_admin(email, password);
        if (!admin) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        // Optionally, you could create a JWT token here for authentication
        res.status(200).json({
            message: "Admin signed in successfully",
            admin: {
                id: admin.id,
                email: admin.email,
                first_name: admin.first_name,
                last_name: admin.last_name,
            },
        });
    }
    catch (error) {
        console.error("Error during admin sign in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.sign_in_admin = sign_in_admin;
//NOTE - RENAME ADMIN
const rename_admin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { newAdminName, newFirstname, newLastname } = req.body;
    if (!id) {
        res.status(400).json({ message: "Invalid admin ID" });
        return;
    }
    try {
        const updates = {};
        if (newAdminName)
            updates.newAdminName = newAdminName;
        if (newFirstname)
            updates.newFirstname = newFirstname;
        if (newLastname)
            updates.newLastname = newLastname;
        if (Object.keys(updates).length === 0) {
            res.status(400).json({ message: "No valid fields provided for update" });
            return;
        }
        const result = yield admin_model_1.admin_model.rename_admin(id, updates);
        if (!result) {
            res.status(404).json({ message: "Admin not found or no changes applied" });
            return;
        }
        res.json({ message: "Admin updated successfully" });
    }
    catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ message: "Failed to update admin" });
    }
});
exports.rename_admin = rename_admin;
// NOTE - FORGOT PASSWORD
const forgot_password_admin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        res.status(400).json({ message: "Email and newPassword are required" });
        return;
    }
    try {
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
        const result = yield admin_model_1.admin_model.forgot_password_admin(email, hashedPassword);
        if (!result) {
            res.status(404).json({ message: "Admin with the provided email not found" });
            return;
        }
        res.json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Failed to update password" });
    }
});
exports.forgot_password_admin = forgot_password_admin;
