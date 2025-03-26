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
exports.emp_car_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
class emp_car_model {
    // Create EmpCar
    static create_emp_car(empCar) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `INSERT INTO emp_cars (emp_id, car_brand, model, license_plate) VALUES (?, ?, ?, ?)`;
                const values = [empCar.emp_id, empCar.car_brand, empCar.model, empCar.license_plate];
                const [result] = yield base_database_1.default.execute(query, values);
                return result; // Returning the result of the insertion
            }
            catch (error) {
                console.error("Error inserting emp_car:", error);
                throw new Error("Failed to create emp_car");
            }
        });
    }
    // Show All EmpCars
    static show_all_emp_cars() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM emp_cars';
                const [rows] = yield base_database_1.default.execute(query);
                return rows; // Returning the fetched emp_cars
            }
            catch (error) {
                console.error("Error fetching emp_cars:", error);
                throw new Error("Failed to fetch emp_cars");
            }
        });
    }
    static update_emp_car(id, empCar) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if emp_id exists
                const empCheckQuery = "SELECT id FROM employees WHERE id = ?";
                const [empResult] = yield base_database_1.default.execute(empCheckQuery, [empCar.emp_id]);
                if (!Array.isArray(empResult) || empResult.length === 0) {
                    throw new Error("Invalid emp_id: Employee does not exist");
                }
                // Proceed with the update if emp_id exists
                const query = `UPDATE emp_cars SET emp_id = ?, car_brand = ?, model = ?, license_plate = ?, updated_at = NOW() WHERE id = ?`;
                const values = [empCar.emp_id, empCar.car_brand, empCar.model, empCar.license_plate, id];
                const [result] = yield base_database_1.default.execute(query, values);
                return result;
            }
            catch (error) {
                console.error("Error updating emp_car:", error);
                throw new Error("Failed to update emp_car");
            }
        });
    }
    static update_emp_car_image(id, cloudinaryUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if employee exists before updating
                const checkQuery = "SELECT id FROM emp_cars WHERE id = ?";
                const [rows] = yield base_database_1.default.execute(checkQuery, [id]);
                if (rows.length === 0) {
                    console.log("emp_cars not found with ID:", id);
                    return { success: false, message: "emp_cars not found" };
                }
                const query = `UPDATE emp_cars SET  car_image = ? WHERE id = ?`;
                const values = [cloudinaryUrl, id];
                const [updateResult] = yield base_database_1.default.execute(query, values);
                const affectedRows = updateResult.affectedRows;
                if (affectedRows === 0) {
                    return { success: false, message: "Failed to update car_image" };
                }
                console.log("car_image updated successfully for ID:", id);
                return { success: true, message: "car_image updated successfully" };
            }
            catch (error) {
                console.error("Error updating car_image:", error);
                throw new Error("Failed to update car_image");
            }
        });
    }
    // Delete EmpCar
    static delete_emp_car(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'DELETE FROM emp_cars WHERE id = ?';
                const [result] = yield base_database_1.default.execute(query, [id]);
                return result; // Return the result of the deletion
            }
            catch (error) {
                console.error("Error deleting emp_car:", error);
                throw new Error("Failed to delete emp_car");
            }
        });
    }
}
exports.emp_car_model = emp_car_model;
