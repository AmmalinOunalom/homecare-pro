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
exports.delete_address_user_details = exports.update_address_user_details = exports.show_all_address_users_details = exports.show_address_by_user_id = exports.upload_house_image = exports.create_address_user_details = void 0;
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const address_users_details_model_1 = require("../model/address_users_details.model");
const base_database_1 = __importDefault(require("../config/base.database"));
/**
 * Create a new address user detail
 */
const create_address_user_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressUserData = req.body;
        const usersId = addressUserData.users_id;
        console.log("Received address user details:", addressUserData);
        // Step 1: Insert address_user_details into DB
        const addressUser = yield address_users_details_model_1.address_users_details_model.create_address_user_details(addressUserData);
        const addressUsersDetailId = addressUser.insertId;
        console.log("Address user created with ID:", addressUsersDetailId);
        // Step 2: Upload image to Cloudinary if file exists
        if (req.file) {
            console.log("Uploading image to Cloudinary...");
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "house_image",
            });
            if (!result.secure_url) {
                throw new Error("Cloudinary upload failed");
            }
            console.log("Cloudinary image URL:", result.secure_url);
            // Update DB with image URL
            yield address_users_details_model_1.address_users_details_model.update_house_image(addressUsersDetailId, result.secure_url);
            // Remove local file
            fs_1.default.unlinkSync(req.file.path);
        }
        else {
            console.log("No image file provided, skipping upload.");
        }
        // Step 3: Fetch and decide which address ID to update in users table
        const [existingAddresses] = yield base_database_1.default.execute(`SELECT id FROM address_users_detail WHERE users_id = ?`, [usersId]);
        const validAddressIds = existingAddresses.map((record) => record.id);
        const addressToSave = validAddressIds.includes(addressUsersDetailId)
            ? addressUsersDetailId
            : validAddressIds[0];
        yield base_database_1.default.execute(`UPDATE users SET address_users_detail_id = ? WHERE id = ?`, [addressToSave, usersId]);
        res.status(201).json({
            message: "Address user detail created and image uploaded successfully",
            address_users_detail_id: addressUsersDetailId,
        });
    }
    catch (error) {
        console.error("Error creating address user detail with image upload:", error);
        res.status(500).json({ message: "Failed to create address user detail", error });
    }
});
exports.create_address_user_details = create_address_user_details;
// UPLOAD HOUSE IMAGE
const upload_house_image = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received upload request:", req.body);
        if (!req.file) {
            console.log("No file uploaded");
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        console.log("File uploaded:", req.file);
        // Ensure addressId is a valid number and log it for debugging
        const addressId = parseInt(req.body.addressId, 10);
        if (isNaN(addressId)) {
            console.log("Invalid addressId:", req.body.addressId); // Log the original value
            res.status(400).json({ message: "Invalid addressId" });
            return;
        }
        console.log("Parsed addressId:", addressId); // Log parsed value for debugging
        // Upload file to Cloudinary under a "house" folder
        const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: "house_image",
        });
        if (!result.secure_url) {
            res.status(500).json({ message: "Cloudinary upload failed" });
            return;
        }
        console.log("Cloudinary URL:", result.secure_url);
        // Use employees_model to save the house image URL in the database
        yield address_users_details_model_1.address_users_details_model.update_house_image(addressId, result.secure_url);
        // Delete the local file after upload to Cloudinary
        fs_1.default.unlinkSync(req.file.path);
        res.status(200).json({
            message: "House image uploaded and updated successfully",
            fileUrl: result.secure_url,
        });
    }
    catch (error) {
        console.error("Error uploading house image:", error);
        res.status(500).json({ message: "Error uploading house image", error });
    }
});
exports.upload_house_image = upload_house_image;
//SELECT USER BY ID
const show_address_by_user_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("Received userId:", id); // Log to ensure the request is reaching the controller
        const addressUserDetails = yield address_users_details_model_1.address_users_details_model.show_address_by_user_id(Number(id));
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
exports.show_address_by_user_id = show_address_by_user_id;
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
