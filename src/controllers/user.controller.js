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
exports.forgot_password = exports.rename_user = exports.get_user_profile = exports.show_all_users = exports.sign_in_user = exports.create_users = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../model/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT_SECRET = 'ZfEYwl7yGor1DAlReLlQVIdRTojJzv4mdwwU6byTYfvc3yhWShT0WioWzgjy3c6Wc3xkoKh4gxrM5PGOS6VTIMuy6c'; // Replace with a real secret key
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
        res.status(400).send("User with the same email, username, or last_name already exists");
    }
});
exports.create_users = create_users;
// Sign in user
const sign_in_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // เรียกใช้ฟังก์ชัน sign_in ของ model เพื่อยืนยันข้อมูลผู้ใช้
        const user = yield user_model_1.user_model.sign_in(email, password);
        if (user) {
            // ถ้าผู้ใช้พบและรหัสผ่านถูกต้อง
            // สร้าง JWT token
            const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: '1h' } // ระยะเวลาหมดอายุของ token
            );
            // ส่งข้อมูลกลับไปยัง client
            res.status(200).send({
                message: "Sign-in successful",
                token, // ส่ง token ที่ถูกสร้าง
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
            });
        }
        else {
            // หากข้อมูลไม่ถูกต้อง
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
const get_user_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Retrieve user ID and type from req.user directly (using optional chaining)
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userType = (_b = req.user) === null || _b === void 0 ? void 0 : _b.type;
        // Validate user type
        if (userType !== 'users') {
            res.status(403).json({ error: "Access denied: Only users can access this route" });
        }
        // Fetch user data by ID
        const user = yield user_model_1.user_model.get_user_by_id(userId);
        // Check if user exists
        if (!user) {
            res.status(404).json({ error: "User not found" });
        }
        // Return user profile data
        res.json({ user });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.get_user_profile = get_user_profile;
const rename_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the user ID from the URL parameters and the new user details from the body
        const { id } = req.params; // ID from the URL path
        const { newUsername, newFirstname, newLastname } = req.body;
        // Call the model function with the necessary arguments
        const result = yield user_model_1.user_model.rename_users(Number(id), newUsername, newFirstname, newLastname);
        // Check if result is returned
        if (result) {
            res.status(200).send("User updated successfully");
        }
        else {
            res.status(404).send("User not found or no changes made");
        }
    }
    catch (error) {
        // Log and send internal server error
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
