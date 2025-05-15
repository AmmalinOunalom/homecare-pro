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
exports.user_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Enums for Gender and Status
var Gender;
(function (Gender) {
    Gender["Male"] = "MALE";
    Gender["Female"] = "FEMALE";
    Gender["Other"] = "OTHER";
})(Gender || (Gender = {}));
var Status;
(function (Status) {
    Status["Active"] = "ACTIVE";
    Status["Inactive"] = "INACTIVE";
})(Status || (Status = {}));
class user_model {
    // Create User
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const checkQuery = `
      SELECT * FROM users 
      WHERE email = ? OR username = ? OR last_name = ?;
    `;
                const [existingUsers] = yield base_database_1.default.execute(checkQuery, [
                    user.email,
                    user.username,
                    user.last_name,
                ]);
                if (existingUsers.length > 0) {
                    throw new Error("User with the same email, username, or last_name already exists");
                }
                const now = new Date();
                const query = `
      INSERT INTO users 
      (email, username, last_name, first_name, tel, password, gender, status, avatar, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
                const values = [
                    user.email,
                    user.username,
                    user.last_name,
                    user.first_name,
                    user.tel,
                    user.password, // hashed
                    user.gender,
                    user.status,
                    user.avatar, // should be URL or filename
                    (_a = user.created_at) !== null && _a !== void 0 ? _a : now,
                    (_b = user.updated_at) !== null && _b !== void 0 ? _b : now,
                ];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                if (error instanceof Error &&
                    error.message === "User with the same email, username, or last_name already exists") {
                    throw error;
                }
                else {
                    console.error("Error inserting user:", error);
                    throw new Error("Failed to create user");
                }
            }
        });
    }
    // get ussr name by id
    static get_user_name(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT username FROM users WHERE id = ?';
                const [rows] = yield base_database_1.default.execute(query, [userId]);
                if (rows.length === 0) {
                    console.log('User not found with ID:', userId);
                    return null;
                }
                return { name: rows[0].name }; // Return user's name
            }
            catch (error) {
                console.error('Error fetching user name:', error);
                return null;
            }
        });
    }
    // Sign in user function
    static sign_in(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query to find the user by email
                const query = 'SELECT id, username, email, password FROM users WHERE email = ?';
                const [rows] = yield base_database_1.default.execute(query, [email]);
                // If user is not found, return null
                if (rows.length === 0)
                    return null;
                const user = rows[0];
                // Check if password is valid
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                // Return user data if password is valid, else return null
                return isPasswordValid ? {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    tel: user.tel,
                    avatar: user.avatar,
                    address: user.address,
                    gender: user.gender,
                    status: user.status
                } : null;
            }
            catch (error) {
                console.error("Error during sign in:", error);
                return null;
            }
        });
    }
    // Show all users
    static show_all() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield base_database_1.default.execute("SELECT * FROM users");
                return result;
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw new Error("Failed to retrieve users");
            }
        });
    }
    static get_user_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id, username, email, first_name, last_name, tel, avatar FROM users WHERE id = ?';
            const [rows] = yield base_database_1.default.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    static rename_users(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fields = [];
                const values = [];
                if (updates.newUsername) {
                    fields.push("username = ?");
                    values.push(updates.newUsername);
                }
                if (updates.newFirstname) {
                    fields.push("first_name = ?");
                    values.push(updates.newFirstname);
                }
                if (updates.newLastname) {
                    fields.push("last_name = ?");
                    values.push(updates.newLastname);
                }
                if (updates.newAvatar) {
                    fields.push("avatar = ?");
                    values.push(updates.newAvatar);
                }
                if (fields.length === 0) {
                    return null; // Nothing to update
                }
                // Add updated_at timestamp update
                fields.push("updated_at = NOW()");
                const updateQuery = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
                values.push(id);
                const [result] = yield base_database_1.default.execute(updateQuery, values);
                return result.affectedRows > 0 ? result : null;
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw new Error("Update failed");
            }
        });
    }
    static forgot_password_users(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield base_database_1.default.execute("UPDATE users SET password = ? WHERE email = ?", [newPassword, email]);
                return result.affectedRows > 0 ? result : null;
            }
            catch (error) {
                console.error("Error updating password:", error);
                throw new Error("Update failed");
            }
        });
    }
}
exports.user_model = user_model;
