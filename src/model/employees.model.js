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
exports.employees_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
    Gender["Other"] = "other";
})(Gender || (Gender = {}));
var Status;
(function (Status) {
    Status["Active"] = "active";
    Status["Inactive"] = "inactive";
})(Status || (Status = {}));
class employees_model {
    static create_employees(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const query = `
        INSERT INTO employees 
        (first_name, last_name, email, tel, password, address, gender, cv, avatar, cat_id, price, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
                const values = [
                    employee.first_name,
                    employee.last_name,
                    employee.email,
                    employee.tel,
                    employee.password,
                    employee.address || "", // Default empty string
                    employee.gender,
                    employee.cv || "", // Default empty string
                    employee.avatar || "",
                    (_a = employee.cat_id) !== null && _a !== void 0 ? _a : 0, // Default to 0
                    (_b = employee.price) !== null && _b !== void 0 ? _b : 0.00, // Default to 0.00
                    employee.status || Status.Active,
                ];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error inserting employee:", error);
                throw new Error("Failed to create employee");
            }
        });
    }
    static show_all_employees() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield base_database_1.default.execute("SELECT * FROM employees");
                return result;
            }
            catch (error) {
                console.error("Error fetching employees:", error);
                throw new Error("Failed to retrieve employees");
            }
        });
    }
    static update_employees(id, employee) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fields = Object.keys(employee).map((key) => `${key} = ?`).join(", ");
                const values = [...Object.values(employee), id];
                const query = `UPDATE employees SET ${fields} WHERE id = ?`;
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error updating employee:", error);
                throw new Error("Failed to update employee");
            }
        });
    }
    static delete_employees(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `UPDATE employees SET status = ? WHERE id = ?`;
                const [result] = yield base_database_1.default.execute(query, [Status.Inactive, id]);
                return result;
            }
            catch (error) {
                console.error("Error deleting employee:", error);
                throw new Error("Failed to delete employee");
            }
        });
    }
}
exports.employees_model = employees_model;
