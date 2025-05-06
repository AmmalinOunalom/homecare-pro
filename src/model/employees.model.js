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
const bcrypt_1 = __importDefault(require("bcrypt"));
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
var City;
(function (City) {
    City["VIENTIANE"] = "VIENTIANE";
    City["XAYTHANY"] = "XAYTHANY";
    City["SAYSETTHA"] = "SAYSETTHA";
    City["SANAKHONE"] = "SANAKHONE";
    City["NAKHAM"] = "NAKHAM";
    City["CHOMCHAO"] = "CHOMCHAO";
    City["KONGLEK"] = "KONGLEK";
    City["THAHEUA"] = "THAHEUA";
    City["BOLIKHAMXAY"] = "BOLIKHAMXAY";
    City["CHANTHABULY"] = "CHANTHABULY";
    City["SIKHOTTABONG"] = "SIKHOTTABONG";
    City["XAYSETHA"] = "XAYSETHA";
    City["SISATTANAK"] = "SISATTANAK";
    City["NAXAITHONG"] = "NAXAITHONG";
    City["XAYTANY"] = "XAYTANY";
    City["HADXAIFONG"] = "HADXAIFONG";
})(City || (City = {}));
class employees_model {
    // Create employee
    static create_employees(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const values = [
                    employee.first_name || null,
                    employee.last_name || null,
                    employee.email || null,
                    employee.tel || null,
                    employee.password || null,
                    employee.address || null,
                    employee.gender || null,
                    employee.cv || null,
                    employee.avatar || null,
                    (_a = employee.cat_id) !== null && _a !== void 0 ? _a : 0,
                    (_b = employee.price) !== null && _b !== void 0 ? _b : 0.0,
                    employee.status || "active",
                    employee.city || null,
                ];
                const query = `
        INSERT INTO employees 
        (first_name, last_name, email, tel, password, address, gender, cv, avatar, cat_id, price, status, city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
                const [result] = yield base_database_1.default.execute(query, values);
                if (!result.insertId) {
                    throw new Error("Failed to retrieve insertId after inserting employee");
                }
                console.log("New Employee ID:", result.insertId);
                return { insertId: result.insertId };
            }
            catch (error) {
                console.error("Error inserting employee:", error);
                throw new Error("Failed to create employee");
            }
        });
    }
    // Sign in employee function
    static sign_in_employee(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT id, first_name, last_name, email, password FROM employees WHERE email = ?';
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
    // Update employee avatar
    static update_employee_avatar(id, cloudinaryUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if employee exists before updating
                const checkQuery = "SELECT id FROM employees WHERE id = ?";
                const [rows] = yield base_database_1.default.execute(checkQuery, [id]);
                if (rows.length === 0) {
                    console.log("Employee not found with ID:", id);
                    return { success: false, message: "Employee not found" };
                }
                const query = `UPDATE employees SET avatar = ? WHERE id = ?`;
                const values = [cloudinaryUrl, id];
                const [updateResult] = yield base_database_1.default.execute(query, values);
                const affectedRows = updateResult.affectedRows;
                if (affectedRows === 0) {
                    return { success: false, message: "Failed to update avatar" };
                }
                console.log("Employee avatar updated successfully for ID:", id);
                return { success: true, message: "Avatar updated successfully" };
            }
            catch (error) {
                console.error("Error updating employee avatar:", error);
                throw new Error("Failed to update employee avatar");
            }
        });
    }
    // Show all employees
    static show_all_employees() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
SELECT e.id, e.first_name, e.last_name, e.email, e.tel, 
       e.address, e.gender, e.cv, e.avatar, 
       e.cat_id, c.cat_name, e.price, e.status, e.city, e.created_at, e.updated_at
FROM employees e
JOIN categories c ON e.cat_id = c.id
      `;
                const [result] = yield base_database_1.default.execute(query);
                return result;
            }
            catch (error) {
                console.error("Error fetching employees:", error);
                throw new Error("Failed to retrieve employees");
            }
        });
    }
    // Show employee by ID
    static show_employee_by_id(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT e.id, e.first_name, e.last_name, e.email, e.tel, 
       e.address, e.city, e.gender, e.cv, e.avatar, 
       e.cat_id, c.cat_name, e.price, e.status, e.created_at, e.updated_at
FROM employees e
JOIN categories c ON e.cat_id = c.id
WHERE e.id =?`;
                const [rows] = yield base_database_1.default.execute(query, [Id]);
                if (rows.length > 0) {
                    return rows[0];
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error("Error fetching employee details:", error);
                throw new Error("Failed to fetch employee details.");
            }
        });
    }
    // Show employee by ID=5 && cat_name = Moving
    static show_more_employee_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        SELECT e.id, e.first_name, car_brand, model, license_plate, car_image, 
               c.id AS cat_id, c.cat_name, ec.emp_id
        FROM employees e
        JOIN categories c ON e.cat_id = c.id  
        LEFT JOIN emp_cars ec ON e.id = ec.emp_id
        WHERE c.id = 5 AND c.cat_name = 'Moving';
      `;
                const [rows] = yield base_database_1.default.execute(query);
                if (rows.length > 0) {
                    return rows; //  Return all employees, not just the first one
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error("Error fetching employee details:", error);
                throw new Error("Failed to fe tch employee details.");
            }
        });
    }
    // Show image of employee by ID
    static show_image_employee_by_id(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT avatar FROM employees WHERE id = ?;`;
                const [rows] = yield base_database_1.default.execute(query, [Id]);
                if (rows.length > 0) {
                    return { avatar: rows[0].avatar };
                }
                else {
                    return { message: "Image not found" };
                }
            }
            catch (error) {
                console.error("Error fetching employee details:", error);
                throw new Error("Failed to fetch employee details.");
            }
        });
    }
    // Update employee details
    //   static async update_employees(id: number, employee: Partial<Employee>) {
    //   try {
    //     // Check if employee exists before updating
    //     const checkQuery = "SELECT id FROM employees WHERE id = ?";
    //     const [rows]: any[] = await db.execute(checkQuery, [id]);
    //     if (rows.length === 0) {
    //       console.log("Employee not found with ID:", id);
    //       return { success: false, message: "Employee not found" };
    //     }
    //     // Prepare the fields for updating
    //     const fields = Object.keys(employee)
    //       .map((key) => `${key} = ?`)
    //       .join(", ");
    //     const values = [...Object.values(employee), id]; // Ensure id is the last value
    //     const query = `UPDATE employees SET ${fields} WHERE id = ?`;
    //     const [result]: any[] = await db.execute(query, values);
    //     // Check if any rows were affected
    //     if (result.affectedRows === 0) {
    //       return { success: false, message: "No changes made to the employee." };
    //     }
    //     return { success: true, message: "Employee updated successfully" };
    //   } catch (error) {
    //     console.error("Error updating employee:", error);
    //     throw new Error("Failed to update employee");
    //   }
    // }
    static update_employees(id, employeeData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Build the dynamic SET clause
                const fields = [];
                const values = [];
                if (employeeData.first_name !== undefined) {
                    fields.push("first_name = ?");
                    values.push(employeeData.first_name);
                }
                if (employeeData.last_name !== undefined) {
                    fields.push("last_name = ?");
                    values.push(employeeData.last_name);
                }
                if (employeeData.email !== undefined) {
                    fields.push("email = ?");
                    values.push(employeeData.email);
                }
                if (employeeData.tel !== undefined) {
                    fields.push("tel = ?");
                    values.push(employeeData.tel);
                }
                if (employeeData.address !== undefined) {
                    fields.push("address = ?");
                    values.push(employeeData.address);
                }
                if (employeeData.gender !== undefined) {
                    fields.push("gender = ?");
                    values.push(employeeData.gender);
                }
                if (employeeData.cv !== undefined) {
                    fields.push("cv = ?");
                    values.push(employeeData.cv);
                }
                if (employeeData.avatar !== undefined) {
                    fields.push("avatar = ?");
                    values.push(employeeData.avatar);
                }
                if (employeeData.cat_id !== undefined) {
                    fields.push("cat_id = ?");
                    values.push(employeeData.cat_id);
                }
                if (employeeData.price !== undefined) {
                    fields.push("price = ?");
                    values.push(employeeData.price);
                }
                if (employeeData.status !== undefined) {
                    fields.push("status = ?");
                    values.push(employeeData.status);
                }
                // Always update updated_at
                fields.push("updated_at = NOW()");
                if (fields.length === 1) {
                    throw new Error("No valid fields provided for update");
                }
                // SQL query to update the employee data
                const query = `
      UPDATE employees 
      SET ${fields.join(", ")} 
      WHERE id = ?
    `;
                values.push(id);
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error updating employee:", error);
                throw new Error("Failed to update employee");
            }
        });
    }
    // Fetch employee by ID and return phone number
    static get_employee_phone_number(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT tel FROM employees WHERE id = ?';
                const [rows] = yield base_database_1.default.execute(query, [employeeId]);
                if (rows.length === 0) {
                    console.log('Employee not found with ID:', employeeId);
                    return null;
                }
                return rows[0].tel; // Return phone number
            }
            catch (error) {
                console.error('Error fetching employee phone number:', error);
                return null;
            }
        });
    }
    // Soft delete employee (set status to Inactive)
    static delete_employees(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if employee exists before deleting
                const checkQuery = "SELECT id FROM employees WHERE id = ?";
                const [rows] = yield base_database_1.default.execute(checkQuery, [id]);
                if (rows.length === 0) {
                    console.log("Employee not found with ID:", id);
                    return { success: false, message: "Employee not found" };
                }
                // Permanently delete employee
                const deleteQuery = `DELETE FROM employees WHERE id = ?`;
                const [result] = yield base_database_1.default.execute(deleteQuery, [id]);
                return { success: true, message: "Employee deleted successfully", result };
            }
            catch (error) {
                console.error("Error deleting employee:", error);
                throw new Error("Failed to delete employee");
            }
        });
    }
}
exports.employees_model = employees_model;
