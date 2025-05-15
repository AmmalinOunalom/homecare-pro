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
exports.forgot_password = exports.rename_user = exports.get_user_profile = exports.get_user_name = exports.show_all_users = exports.refresh_token = exports.sign_in_user = exports.create_users = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../model/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const JWT_SECRET = 'ZfEYwl7yGor1DAlReLlQVIdRTojJzv4mdwwU6byTYfvc3yhWShT0WioWzgjy3c6Wc3xkoKh4gxrM5PGOS6VTIMuy6c'; // Replace with a real secret key
const JWT_REFRESH_TOKEN_SECRET = 'FHP9iDp5rk8x5GKZQwrSSsOw04cOPSty8sRv3R2eAIQSlUQWtOri0jKc0Zg7yLLC';
let refreshTokens = [];
// create user
const create_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const user = Object.assign(Object.assign({}, req.body), { password: hashedPassword });
        // Cloudinary avatar upload logic (just like in create_employees)
        if (req.file && req.file.path) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "avatars",
            });
            if (!result.secure_url) {
                throw new Error("Cloudinary upload failed");
            }
            user.avatar = result.secure_url;
            if (fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
            }
        }
        const createdUser = yield user_model_1.user_model.create(user);
        res.status(201).send("User created successfully");
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(400).send("User with the same email, username, or last_name already exists");
    }
});
exports.create_users = create_users;
// Sign in user
const sign_in_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.user_model.sign_in(email, password);
        if (user) {
            const payload = { id: user.id, username: user.username, email: user.email };
            const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            refreshTokens.push(refreshToken); // Save refresh token
            res.status(200).send({
                message: "Sign-in successful",
                accessToken,
                refreshToken,
                user
            });
        }
        else {
            res.status(401).send("Invalid email or password");
        }
    }
    catch (error) {
        console.error("Error during sign in:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.sign_in_user = sign_in_user;
// Refresh_Token
const refresh_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        res.sendStatus(401);
        return;
    }
    if (!refreshTokens.includes(token)) {
        res.sendStatus(403);
        return;
    }
    try {
        const user = yield new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err)
                    return reject(err);
                resolve(decoded);
            });
        });
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        res.sendStatus(403);
    }
});
exports.refresh_token = refresh_token;
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
//get user name by ID
const get_user_name = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        // Ensure userId is a string and can be parsed to a number
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
        }
        const user = yield user_model_1.user_model.get_user_by_id(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user); // Return the user name
    }
    catch (error) {
        console.error("Error fetching user name:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.get_user_name = get_user_name;
const get_user_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // 🔍 Log the full req.user object
        console.log("Authenticated user from token:", req.user);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userType = (_b = req.user) === null || _b === void 0 ? void 0 : _b.type;
        // 🔍 Log extracted values
        console.log("User ID:", userId);
        console.log("User Type:", userType);
        // Validate user type
        if (userType !== 'users') {
            console.log("Access denied: User type is not 'users'");
            res.status(403).json({ error: "Access denied: Only users can access this route" });
        }
        // Fetch user data by ID
        const user = yield user_model_1.user_model.get_user_by_id(userId);
        console.log("Fetched user from DB:", user);
        // Check if user exists
        if (!user) {
            console.log("User not found in DB for ID:", userId);
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
// export const rename_user = async (req: Request, res: Response) => {
//   try {
//     // Extract the user ID from the URL parameters and the new user details from the body
//     const { id } = req.params; // ID from the URL path
//     const { newUsername, newFirstname, newLastname, newAvatar } = req.body;
//     // Call the model function with the necessary arguments
//     const result = await user_model.rename_users(Number(id), newUsername, newFirstname, newLastname, newAvatar);
//     // Check if result is returned
//     if (result) {
//       res.status(200).send("User updated successfully");
//     } else {
//       res.status(404).send("User not found or no changes made");
//     }
//   } catch (error) {
//     // Log and send internal server error
//     console.error("Error updating user:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };
const rename_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { newUsername, newFirstname, newLastname } = req.body;
        if (!id || isNaN(Number(id))) {
            res.status(400).send("Invalid user ID");
            return;
        }
        let avatarUrl;
        if (req.file && req.file.path) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "avatars_users",
            });
            if (!result.secure_url) {
                throw new Error("Cloudinary upload failed");
            }
            avatarUrl = result.secure_url;
            if (fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
            }
        }
        const updates = {};
        if (newUsername)
            updates.newUsername = newUsername;
        if (newFirstname)
            updates.newFirstname = newFirstname;
        if (newLastname)
            updates.newLastname = newLastname;
        if (avatarUrl)
            updates.newAvatar = avatarUrl;
        if (Object.keys(updates).length === 0) {
            res.status(400).send("No fields provided for update");
            return;
        }
        const result = yield user_model_1.user_model.rename_users(Number(id), updates);
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
