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
            try {
                const query = 'INSERT INTO users (username, first_name, last_name, email, tel, password, gender, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                const values = [
                    user.username,
                    user.first_name,
                    user.last_name,
                    user.email,
                    user.tel,
                    user.password, // Assuming password is already hashed
                    user.gender,
                    user.status
                ];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error inserting user:", error);
                throw new Error("Failed to create user");
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
    static rename_users(id, newUsername, newFirstname, newLastname, profileFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // SQL Query with fixed fields
                const updateQuery = `
        UPDATE users 
        SET 
          username = ?, 
          first_name = ?, 
          last_name = ?, 
          profile = ?, 
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`;
                // Provide `null` if profileFilename is not given
                const values = [newUsername, newFirstname, newLastname, profileFilename || null, id];
                // Execute query
                const [result] = yield base_database_1.default.execute(updateQuery, values);
                // Check if update was successful
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
