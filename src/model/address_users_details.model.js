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
class address_users_details_model {
    static create_address_user_details(addressUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const values = [
                    addressUser.users_id || null,
                    addressUser.address_name || null,
                    addressUser.village || null,
                    addressUser.google_link_map || null,
                    addressUser.address_description || null,
                    addressUser.city || null,
                    addressUser.tel || null
                ];
                const query = `
            INSERT INTO address_users_detail 
            (users_id, address_name, village, google_link_map, address_description, city, tel)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
                const [result] = yield base_database_1.default.execute(query, values);
                if (!result.insertId) {
                    throw new Error("Failed to retrieve insertId after inserting address");
                }
                const addressUsersDetailId = result.insertId;
                console.log("New Address ID:", addressUsersDetailId);
                // Update users table with the new address ID
                const updateQuery = `UPDATE users SET address_users_detail_id = ? WHERE id = ?`;
                const [updateResult] = yield base_database_1.default.execute(updateQuery, [addressUsersDetailId, addressUser.users_id]);
                console.log("Update Query Result:", updateResult);
                if (updateResult.affectedRows === 0) {
                    throw new Error(`User ID ${addressUser.users_id} not found or update failed.`);
                }
                return { insertId: addressUsersDetailId };
            }
            catch (error) {
                console.error("Error inserting address_users_detail:", error);
                throw new Error("Failed to create address_users_detail and update users table");
            }
        });
    }
    static show_address_users_by_id(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM address_users_detail WHERE users_id = ?';
                const [rows] = yield base_database_1.default.execute(query, [userId]);
                if (rows.length === 0) {
                    console.log('No address found for user ID:', userId);
                    return null;
                }
                return rows; // Return all matching address records
            }
            catch (error) {
                console.error('Error fetching address details:', error);
                return null;
            }
        });
    }
    //UPLOAD HOUSE IMAGE
    static update_house_image(addressId, cloudinaryUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update the house image for the specific addressId
                const query = `
            UPDATE address_users_detail 
            SET house_image = ? 
            WHERE id = ?;
          `;
                const [result] = yield base_database_1.default.execute(query, [cloudinaryUrl, addressId]);
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return { success: false, message: "House image not found or update failed" };
                }
                return { success: true, message: "House image updated successfully" };
            }
            catch (error) {
                console.error("Error updating house image:", error);
                return { success: false, message: "Failed to update house image" };
            }
        });
    }
    //SELECT USER BY ID
    static show_address_by_user_id(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT 
                    u.id, 
                    u.username, 
                    COALESCE(GROUP_CONCAT(a.id), '') AS address_users_detail_id
                FROM users u
                LEFT JOIN address_users_detail a ON u.id = a.users_id
                WHERE u.id = ?
                GROUP BY u.id, u.username;

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
    //Show Address Users Details by ID
    static get_address_by_user_id(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
            SELECT address_name, village, address_description, google_link_map
            FROM address_users_detail
            WHERE users_id = ?
            ORDER BY id DESC
            LIMIT 1
          `;
                const [rows] = yield base_database_1.default.execute(query, [userId]);
                return rows[0];
            }
            catch (error) {
                console.error("Error fetching address by user ID:", error);
                return null;
            }
        });
    }
    static get_address_users_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    SELECT 
      id AS address_users_detail_id,
      tel AS contact,
      address_name AS locationName,
      village AS villageName,
      address_description AS details,
      google_link_map AS mapLink
    FROM address_users_detail
    WHERE id = ?;
  `;
            const [rows] = yield base_database_1.default.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    // Update Address User Details
    static update_address_user_details(id, addressUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                UPDATE address_users_detail 
                SET 
                    users_id = ?, 
                    address_name = ?, 
                    house_image = ?, 
                    google_link_map = ?, 
                    address_description = ?, 
                    city = ?, 
                    tel = ?, 
                    updated_at = NOW() 
                WHERE id = ?
            `;
                const values = [
                    addressUser.users_id,
                    addressUser.address_name,
                    addressUser.house_image,
                    addressUser.google_link_map,
                    addressUser.address_description,
                    addressUser.city,
                    addressUser.tel,
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
