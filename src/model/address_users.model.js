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
exports.address_user_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
// Enum for City (Replace with actual city names if needed)
var City;
(function (City) {
    City["City1"] = "CHANTHABOULY";
    City["City2"] = "SIKHOTTABONG";
    City["City3"] = "XAYSETTHA";
    City["City4"] = "SISATTANAK";
    City["City5"] = "NAXAITHONG";
    City["City6"] = "XAYTHANY";
    City["City7"] = "HADXAIFONG";
    City["City8"] = "SANGTHONG";
    City["City9"] = "PAKNGUM"; // Add more cities as needed
})(City || (City = {}));
class address_user_model {
    // Create Address User
    static create_address_user(addressUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `INSERT INTO address_users (address_name, city) VALUES (?, ?)`;
                const values = [addressUser.address_name, addressUser.city];
                const [result] = yield base_database_1.default.execute(query, values);
                return result; // Returning the result of the insertion
            }
            catch (error) {
                console.error("Error inserting address_user:", error);
                throw new Error("Failed to create address_user");
            }
        });
    }
    // Show All Address Users
    static show_all_address_users() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "SELECT * FROM address_users";
                const [rows] = yield base_database_1.default.execute(query);
                return rows; // Returning the fetched address users
            }
            catch (error) {
                console.error("Error fetching address_users:", error);
                throw new Error("Failed to fetch address_users");
            }
        });
    }
    // Update Address User
    static update_address_user(id, addressUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `UPDATE address_users SET address_name = ?, city = ?, updated_at = NOW() WHERE id = ?`;
                const values = [addressUser.address_name, addressUser.city, id];
                const [result] = yield base_database_1.default.execute(query, values);
                return result; // Return the result to indicate update status
            }
            catch (error) {
                console.error("Error updating address_user:", error);
                throw new Error("Failed to update address_user");
            }
        });
    }
    // Delete Address User
    static delete_address_user(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "DELETE FROM address_users WHERE id = ?";
                const [result] = yield base_database_1.default.execute(query, [id]);
                return result; // Return the result of the deletion
            }
            catch (error) {
                console.error("Error deleting address_user:", error);
                throw new Error("Failed to delete address_user");
            }
        });
    }
}
exports.address_user_model = address_user_model;
