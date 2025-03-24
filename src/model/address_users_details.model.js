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
exports.address_users_details_model = void 0;
const base_database_1 = __importDefault(require("../config/base.database"));
// Enum for Gender
var Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Other"] = "Other";
})(Gender || (Gender = {}));
class address_users_details_model {
    // Create Address User Details and return the new ID
    static create_address_user_details(addressUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure that undefined values are converted to null
                const values = [
                    addressUser.users_id || null, // If users_id is undefined, set to null
                    addressUser.gender_owner || null, // If gender_owner is undefined, set to null
                    addressUser.address_name || null, // If address_name is undefined, set to null
                    addressUser.house_image || null, // If house_image is undefined, set to null
                    addressUser.google_link_map || null // If google_link_map is undefined, set to null
                ];
                const query = `
                INSERT INTO address_users_detail 
                (users_id, gender_owner, address_name, house_image, google_link_map)
                VALUES (?, ?, ?, ?, ?)
            `;
                // Execute the query with the sanitized values
                const [result] = yield base_database_1.default.execute(query, values);
                // Return the result of the insertion
                return result;
            }
            catch (error) {
                console.error("Error inserting address_users_detail:", error);
                throw new Error("Failed to create address_users_detail");
            }
        });
    }
    static show_by_user_id(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * 
                FROM users u
                LEFT JOIN address_users_detail a ON u.id = a.users_id
                WHERE u.id = ?;
            `;
                const result = yield base_database_1.default.execute(query, [userId]); // Get query result directly
                if (result && result.length > 0) {
                    return result[0]; // Return the first row of the result if it exists
                }
                else {
                    throw new Error("No user found with the given ID");
                }
            }
            catch (error) {
                console.error("Error fetching address details:", error);
                throw new Error("Failed to fetch address details for the user");
            }
        });
    }
    // Show All Address Users Details
    static show_all_address_users_details() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "SELECT * FROM address_users_detail";
                const [rows] = yield base_database_1.default.execute(query);
                return rows; // Returning the fetched address users details
            }
            catch (error) {
                console.error("Error fetching address_users_details:", error);
                throw new Error("Failed to fetch address_users_details");
            }
        });
    }
    // Update Address User Details
    static update_address_user_details(id, addressUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `UPDATE address_users_detail 
                           SET users_id = ?, gender_owner = ?, address_name = ?, house_image = ?, google_link_map = ?, updated_at = NOW() 
                           WHERE id = ?`;
                const values = [
                    addressUser.users_id,
                    addressUser.gender_owner,
                    addressUser.address_name,
                    addressUser.house_image,
                    addressUser.google_link_map,
                    id
                ];
                const [result] = yield base_database_1.default.execute(query, values);
                return result; // Return the result to indicate update status
            }
            catch (error) {
                console.error("Error updating address_users_details:", error);
                throw new Error("Failed to update address_users_details");
            }
        });
    }
    // Delete Address User Details
    static delete_address_user_details(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = "DELETE FROM address_users_detail WHERE id = ?";
                const [result] = yield base_database_1.default.execute(query, [id]);
                return result; // Return the result of the deletion
            }
            catch (error) {
                console.error("Error deleting address_users_details:", error);
                throw new Error("Failed to delete address_users_details");
            }
        });
    }
}
exports.address_users_details_model = address_users_details_model;
