import { Request, Response } from "express";
import path from "path"; // To handle file paths
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { address_users_details_model } from "../model/address_users_details.model";
import db from "../config/base.database";
import { log } from "console";

/**
 * Create a new address user detail
 */

// export const create_address_user_details = async (req: Request, res: Response) => {
//   try {
//     const addressUserData = req.body;
//     const usersId = addressUserData.users_id;

//     console.log("Received address user details:", addressUserData);
//     console.log("User ID:", usersId);

//     // Call model function to create address user details
//     const addressUser = await address_users_details_model.create_address_user_details(addressUserData);
//     const addressUsersDetailId = addressUser.insertId;
//     console.log("New address_users_detail_id:", addressUsersDetailId);

//     // If a file is uploaded, handle the Cloudinary upload
//     if (req.file) {
//       console.log("File uploaded:", req.file);

//       // Upload to Cloudinary under 'house_image' folder
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "house_image",
//       });

//       if (!result.secure_url) {
//         res.status(500).json({ message: "Cloudinary upload failed" });
//         return;
//       }

//       console.log("Cloudinary image URL:", result.secure_url);

//       // Save image URL to the DB
//       await address_users_details_model.update_house_image(addressUsersDetailId, result.secure_url);

//       // Delete local file
//       fs.unlinkSync(req.file.path);
//     } else {
//       console.log("No house image uploaded with the request.");
//     }

//     // Fetch all address_user_details for this user
//     const [existingAddresses]: any = await db.execute(
//       `SELECT id FROM address_users_detail WHERE users_id = ?`,
//       [usersId]
//     );

//     const validAddressIds = existingAddresses.map((record: any) => record.id);
//     const addressToSave = validAddressIds.includes(addressUsersDetailId)
//       ? addressUsersDetailId
//       : validAddressIds[0];

//     console.log("Address ID to save in users table:", addressToSave);

//     await db.execute(`UPDATE users SET address_users_detail_id = ? WHERE id = ?`, [
//       addressToSave,
//       usersId,
//     ]);

//     res.status(201).json({
//       message: "Address user detail created successfully",
//       address_users_detail_id: addressUsersDetailId,
//     });
//   } catch (error) {
//     console.error("Error creating address user detail:", error);
//     res.status(500).json({ message: "Failed to create address user detail", error });
//   }
// };

export const create_address_user_details = async (req: Request, res: Response) => {
  try {
    // Log incoming request body
    const addressUserData = req.body;
    const usersId = addressUserData.users_id;

    console.log("Received address user details:", addressUserData); // Log the received data
    console.log(`User ID: ${usersId}`); // Log the user ID

    // Call model function to create address user details and update users table
    console.log("Calling model to create address user details...");
    const addressUser = await address_users_details_model.create_address_user_details(addressUserData);

    // Log result of model function (address user created)
    console.log("Address user created:", addressUser);

    // Extract the insertId to get the newly created address user's ID
    const addressUsersDetailId = addressUser.insertId;
    console.log("Newly created address_users_detail_id:", addressUsersDetailId); // Log the inserted ID

    // Fetch all address_user_details for this user
    console.log(`Fetching existing address details for user ID ${usersId}...`);
    const [existingAddresses]: any = await db.execute(
      `SELECT id FROM address_users_detail WHERE users_id = ?`,
      [usersId]
    );

    // Log the existing addresses for this user
    console.log("Existing addresses for user:", existingAddresses);

    // Determine which address to save in the users table (choose the latest created one)
    const validAddressIds = existingAddresses.map((record: any) => record.id);
    const addressToSave = validAddressIds.includes(addressUsersDetailId)
      ? addressUsersDetailId
      : validAddressIds[0]; // Pick the first valid address if needed

    // Log which address ID will be saved
    console.log(`Address ID to save in users table: ${addressToSave}`);

    // Update users table with the new address detail ID
    console.log("Updating users table with new address_users_detail_id...");
    const updateQuery = `UPDATE users SET address_users_detail_id = ? WHERE id = ?`;
    await db.execute(updateQuery, [addressToSave, usersId]);

    // Log the successful update
    console.log("Users table updated successfully with address_users_detail_id.");

    // Send a success response
    res.status(201).send("Address user detail created successfully and users table updated.");
  } catch (error) {
    // Log error details
    console.error("Error occurred while creating address user detail:", error);

    // Send an error response
    res.status(500).send("Failed to create address user detail");
  }
};


// UPLOAD HOUSE IMAGE

export const upload_house_image = async (req: Request, res: Response): Promise<void> => {
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
      console.log("Invalid addressId:", req.body.addressId);  // Log the original value
      res.status(400).json({ message: "Invalid addressId" });
      return;
    }

    console.log("Parsed addressId:", addressId); // Log parsed value for debugging

    // Upload file to Cloudinary under a "house" folder
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "house_image",
    });

    if (!result.secure_url) {
      res.status(500).json({ message: "Cloudinary upload failed" });
      return;
    }

    console.log("Cloudinary URL:", result.secure_url);

    // Use employees_model to save the house image URL in the database
    await address_users_details_model.update_house_image(addressId, result.secure_url);

    // Delete the local file after upload to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "House image uploaded and updated successfully",
      fileUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading house image:", error);
    res.status(500).json({ message: "Error uploading house image", error });
  }
};

  //SELECT USER BY ID

export const show_address_by_user_id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Received userId:", id);  // Log to ensure the request is reaching the controller

    const addressUserDetails = await address_users_details_model.show_address_by_user_id(Number(id));
    console.log("Address User Details:", addressUserDetails);  // Log the result returned by the model

    if (addressUserDetails) {
      res.status(200).send(addressUserDetails);
    } else {
      res.status(404).send("Address user details not found for this user");
    }
  } catch (error) {
    console.error("Error fetching address user details by userId:", error);
    res.status(500).send("Failed to fetch address user details");
  }
};


/**
 * Retrieve all address user details
 */
export const show_all_address_users_details = async (req: Request, res: Response) => {
  try {
    const addressUsers = await address_users_details_model.show_all_address_users_details();
    res.status(200).send(addressUsers);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Update an address user detail
 */
export const update_address_user_details = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedAddressUser = await address_users_details_model.update_address_user_details(Number(id), req.body);
    if (updatedAddressUser) {
      res.status(200).send("Address user detail updated successfully");
    } else {
      res.status(404).send("Address user detail not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update address user detail");
  }
};

/**
 * Delete an address user detail
 */
export const delete_address_user_details = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedAddressUser = await address_users_details_model.delete_address_user_details(Number(id));
    if (deletedAddressUser) {
      res.status(200).send("Address user detail deleted successfully");
    } else {
      res.status(404).send("Address user detail not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete address user detail nah jah");
  }
};