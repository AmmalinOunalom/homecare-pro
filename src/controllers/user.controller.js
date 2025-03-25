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
exports.forgot_password = exports.rename_user = exports.show_all_users = exports.sign_in_user = exports.create_users = void 0;
const user_model_1 = require("../model/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// create user
const create_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const user = Object.assign(Object.assign({}, req.body), { password: hashedPassword });
        const createdUser = yield user_model_1.user_model.create(user);
        res.status(201).send("User created successfully");
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.create_users = create_users;
// Sign in user
const sign_in_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Call the model's sign_in function
        const user = yield user_model_1.user_model.sign_in(email, password);
        if (user) {
            // If user is found and password is correct
            res.status(200).send({
                message: "Sign-in successful",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
            });
        }
        else {
            // If credentials are invalid
            res.status(401).send("Invalid email or password");
        }
    }
    catch (error) {
        console.error("Error during sign in:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.sign_in_user = sign_in_user;
// show all users
const show_all_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.user_model.show_all();
        res.status(200).send(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_users = show_all_users;
// function (Rename User)
const rename_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, newUsername, newFirstname, newLastname } = req.body;
        const result = yield user_model_1.user_model.rename_users(id, newUsername, newFirstname, newLastname);
        if (result) {
            res.status(200).send("User updated successfully");
        }
        else {
            res.status(404).send("User not found or no changes made");
        }
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.rename_user = rename_user;
//NOTE - forgotpassword
// function set password (Forgot Password)
const forgot_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        console.log("Received request to reset password for:", email);
        // Hash the new password before saving
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
        console.log("Hashed password:", hashedPassword);
        // Call the model function to update the password
        const result = yield user_model_1.user_model.forgot_password_users(email, hashedPassword);
        if (result) {
            console.log("Password reset successful for:", email);
            res.status(200).send("Password reset successful");
        }
        else {
            console.log("Email not found:", email);
            res.status(404).send("Email not found");
        }
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(400).send("Error resetting password");
    }
});
exports.forgot_password = forgot_password;
