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
exports.delete_address_user_details = exports.update_address_user_details = exports.show_all_address_users_details = exports.show_address_by_user_id = exports.upload_house_image = exports.create_address_user_detail = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const address_users_details_model_1 = require("../model/address_users_details.model");
/**
 * Create a new address user detail
 */
const create_address_user_detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //try {
    const addressUserData = req.body;
    // Call the model function to insert address user details into the database
    const addressUser = yield address_users_details_model_1.address_users_details_model.create_address_user_details(addressUserData);
    // Handle file upload if a file is present
    if (req.file && req.file.path) {
        const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: "house_images",
        });
        if (!result.secure_url) {
            throw new Error("Cloudinary upload failed");
        }
        // Update the house image URL in the database
        yield address_users_details_model_1.address_users_details_model.update_house_image(addressUser.insertId, result.secure_url);
    }
    // // Optionally update the users table to link the new address (if needed)
    // await address_users_details_model.update_user_address(addressUserData.users_id, addressUser.insertId);
    res.status(201).json({
        message: "Address user detail created and image uploaded successfully",
        address_users_detail_id: addressUser.insertId,
    });
    // } catch (error) {
    //   console.error("Error creating address user detail:", error);
    //   res.status(500).json({
    //     message: "Failed to create address user detail",
    //     error,
    //   });
    // }
});
exports.create_address_user_detail = create_address_user_detail;
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
        res.status(500).send("Failed to update address user detailzz");
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
        res.status(500).send("Failed to delete address user detailxx");
    }
});
exports.delete_address_user_details = delete_address_user_details;
