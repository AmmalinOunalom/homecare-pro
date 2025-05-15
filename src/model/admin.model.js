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
exports.admin_model = void 0;
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
class admin_model {
    //NOTE - SHOW ALL ADMIN  
    static show_all_admins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield base_database_1.default.execute("SELECT * FROM admins");
                return result;
            }
            catch (error) {
                console.error("Error fetching admins:", error);
                throw new Error("Failed to retrieve admins");
            }
        });
    }
    //NOTE - SIGN UP ADMIN
    static sign_up_admin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Check if admin with same email or admin_name already exists
                const checkQuery = `
      SELECT * FROM admins 
      WHERE email = ? OR admin_name = ?;
    `;
                const [existingAdmins] = yield base_database_1.default.execute(checkQuery, [
                    admin.email,
                    admin.admin_name,
                ]);
                if (existingAdmins.length > 0) {
                    throw new Error("Admin with the same email or admin_name already exists");
                }
                const now = new Date();
                const query = `
      INSERT INTO admins 
      (admin_name, first_name, last_name, email, tel, password, gender, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
                const values = [
                    admin.admin_name || null,
                    admin.first_name || null,
                    admin.last_name || null,
                    admin.email || null,
                    admin.tel || null,
                    admin.password || null, // assumed hashed
                    admin.gender || null,
                    admin.status || "active",
                    (_a = admin.create_at) !== null && _a !== void 0 ? _a : now,
                    (_b = admin.update_at) !== null && _b !== void 0 ? _b : now,
                ];
                const [result] = yield base_database_1.default.execute(query, values);
                if (!result.insertId) {
                    throw new Error("Failed to retrieve insertId after inserting admin");
                }
                console.log("New Admin ID:", result.insertId);
                return { insertId: result.insertId };
            }
            catch (error) {
                if (error instanceof Error &&
                    error.message === "Admin with the same email or admin_name already exists") {
                    throw error;
                }
                else {
                    console.error("Error inserting admin:", error);
                    throw new Error("Failed to create admin");
                }
            }
        });
    }
    //NOTE - SIGN IN ADMIN
    static sign_in_admin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT id, admin_name, first_name, last_name, email, password FROM admins WHERE email = ?';
                const [rows] = yield base_database_1.default.execute(query, [email]);
                if (rows.length === 0)
                    return null;
                const employee = rows[0];
                const isPasswordValid = yield bcrypt_1.default.compare(password, employee.password);
                return isPasswordValid ? {
                    id: employee.id,
                    email: employee.email,
                    first_name: employee.first_name,
                    last_name: employee.last_name
                } : null;
            }
            catch (error) {
                console.error("Error during employee sign in:", error);
                return null;
            }
        });
    }
    //NOTE - rename admin
    static rename_admin(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fields = [];
                const values = [];
                if (updates.newAdminName) {
                    fields.push("admin_name = ?");
                    values.push(updates.newAdminName);
                }
                if (updates.newFirstname) {
                    fields.push("first_name = ?");
                    values.push(updates.newFirstname);
                }
                if (updates.newLastname) {
                    fields.push("last_name = ?");
                    values.push(updates.newLastname);
                }
                if (fields.length === 0) {
                    return null; // Nothing to update
                }
                // Update updated_at to current timestamp
                fields.push("updated_at = NOW()");
                const updateQuery = `UPDATE admins SET ${fields.join(", ")} WHERE id = ?`;
                values.push(id);
                const [result] = yield base_database_1.default.execute(updateQuery, values);
                return result.affectedRows > 0 ? result : null;
            }
            catch (error) {
                console.error("Error updating admin:", error);
                throw new Error("Update failed");
            }
        });
    }
    static forgot_password_admin(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield base_database_1.default.execute("UPDATE admins SET password = ? WHERE email = ?", [newPassword, email]);
                return result.affectedRows > 0 ? result : null;
            }
            catch (error) {
                console.error("Error updating password:", error);
                throw new Error("Update failed");
            }
        });
    }
}
exports.admin_model = admin_model;
