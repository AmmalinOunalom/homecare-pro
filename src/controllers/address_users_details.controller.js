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
exports.delete_address_user_details = exports.update_address_user_details = exports.show_all_address_users_details = exports.show_by_user_id = exports.create_address_user_details = void 0;
const address_users_details_model_1 = require("../model/address_users_details.model");
const base_database_1 = __importDefault(require("../config/base.database"));
/**
 * Create a new address user detail
 */
// export const create_address_user_details = async (req: Request, res: Response) => {
//   try {
//     const addressUserData = req.body;
//     console.log("Inserting address user details", addressUserData);
//     const addressUser = await address_users_details_model.create_address_user_details(addressUserData);
//     console.log("Address user created", addressUser);
//     const addressUsersDetailId = addressUser.insertId;
//     const usersId = addressUserData.users_id;
//     const updateQuery = `
//       UPDATE users 
//       SET address_users_detail_id = ? 
//       WHERE id = ?
//     `;
//     console.log("Executing update query", updateQuery, [addressUsersDetailId, usersId]);
//     await db.execute(updateQuery, [addressUsersDetailId, usersId]);
//     res.status(201).send("Address user detail created successfully and users table updated.");
//   } catch (error) {
//     console.error("Error occurred:", error);
//     res.status(500).send("Failed to create address user detail");
//   }
// };
const create_address_user_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressUserData = req.body;
        const usersId = addressUserData.users_id;
        console.log("Inserting address user details", addressUserData);
        const addressUser = yield address_users_details_model_1.address_users_details_model.create_address_user_details(addressUserData);
        console.log("Address user created", addressUser);
        const addressUsersDetailId = addressUser.insertId;
        // Fetch all address_user_details for this user
        const [existingAddresses] = yield base_database_1.default.execute(`SELECT id FROM address_users_details WHERE users_id = ?`, [usersId]);
        console.log("Existing addresses for user:", existingAddresses);
        // Determine which address to save in the users table (choose the latest created one)
        const validAddressIds = existingAddresses.map((record) => record.id);
        const addressToSave = validAddressIds.includes(addressUsersDetailId)
            ? addressUsersDetailId
            : validAddressIds[0]; // Pick the first valid address if needed
        console.log(`Saving address_users_detail_id ${addressToSave} for user ${usersId}`);
        const updateQuery = `UPDATE users SET address_users_detail_id = ? WHERE id = ?`;
        yield base_database_1.default.execute(updateQuery, [addressToSave, usersId]);
        res.status(201).send("Address user detail created successfully and users table updated.");
    }
    catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Failed to create address user detail");
    }
});
exports.create_address_user_details = create_address_user_details;
const show_by_user_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("Received userId:", id); // Log to ensure the request is reaching the controller
        const addressUserDetails = yield address_users_details_model_1.address_users_details_model.show_by_user_id(Number(id));
        console.log("Address User Details:", addressUserDetails); // Log the result returned by the model
        if (addressUserDetails) {
            res.status(200).send(addressUserDetails);
        }
        else {
            res.status(404).send("Address user details not found for this user");
        }
    }
    catch (error) {
        console.error("Error fetching address user details by userId:", error);
        res.status(500).send("Failed to fetch address user details");
    }
});
exports.show_by_user_id = show_by_user_id;
/**
 * Retrieve all address user details
 */
const show_all_address_users_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressUsers = yield address_users_details_model_1.address_users_details_model.show_all_address_users_details();
        res.status(200).send(addressUsers);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_address_users_details = show_all_address_users_details;
/**
 * Update an address user detail
 */
const update_address_user_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedAddressUser = yield address_users_details_model_1.address_users_details_model.update_address_user_details(Number(id), req.body);
        if (updatedAddressUser) {
            res.status(200).send("Address user detail updated successfully");
        }
        else {
            res.status(404).send("Address user detail not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to update address user detail");
    }
});
exports.update_address_user_details = update_address_user_details;
/**
 * Delete an address user detail
 */
const delete_address_user_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedAddressUser = yield address_users_details_model_1.address_users_details_model.delete_address_user_details(Number(id));
        if (deletedAddressUser) {
            res.status(200).send("Address user detail deleted successfully");
        }
        else {
            res.status(404).send("Address user detail not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to delete address user detail");
    }
});
exports.delete_address_user_details = delete_address_user_details;
