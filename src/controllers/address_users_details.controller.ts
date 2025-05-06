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
export const create_address_user_details = async (req: Request, res: Response) => {
  try {
    const addressUserData = req.body;
    const usersId = addressUserData.users_id;

    console.log("Received address user details:", addressUserData);

    // Step 1: Create address user detail (excluding house_image)
    const addressUser = await address_users_details_model.create_address_user_details(addressUserData);
    const addressUsersDetailId = addressUser.insertId;
    console.log("Address user created with ID:", addressUsersDetailId);

    // Step 2: Upload house image to Cloudinary if file exists
    if (req.file) {
      console.log("Uploading image to Cloudinary...");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "house_image",
      });

      if (!result.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      console.log("Cloudinary image URL:", result.secure_url);

      // Update database with Cloudinary URL
      await address_users_details_model.update_house_image(addressUsersDetailId, result.secure_url);

      // Safely remove local file only if it exists
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log("Local file deleted");
      }
    } else {
      console.log("No image file provided, skipping upload.");
    }

    // Step 3: Update user with address detail ID
    const [existingAddresses]: any = await db.execute(
      `SELECT id FROM address_users_detail WHERE users_id = ?`,
      [usersId]
    );

    const validAddressIds = existingAddresses.map((record: any) => record.id);
    const addressToSave = validAddressIds.includes(addressUsersDetailId)
      ? addressUsersDetailId
      : validAddressIds[0];

    await db.execute(
      `UPDATE users SET address_users_detail_id = ? WHERE id = ?`,
      [addressToSave, usersId]
    );

    res.status(201).json({
      message: "Address user detail created and image uploaded successfully",
      address_users_detail_id: addressUsersDetailId,
    });
  } catch (error) {
    console.error("Error creating address user detail with image upload:", error);
    res.status(500).json({
      message: "Failed to create address user detail",
      error,
    });
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

//SELECT address_user_details BY ID

  export const get_address_by_user_id = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log("Received address ID:", id);  // Confirm the ID received
  
      const googleMapLink = await address_users_details_model.get_address_by_user_id(Number(id));
      console.log("Google Map Link:", googleMapLink);  // Log result from DB
  
      if (googleMapLink) {
        res.status(200).json({ google_link_map: googleMapLink });
      } else {
        res.status(404).send("Google Map link not found for this address IDs");
      }
    } catch (error) {
      console.error("Error fetching Google Map link by address ID:", error);
      res.status(500).send("Failed to fetch Google Map link");
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
    res.status(500).send("Failed to delete address user detail");
  }
};