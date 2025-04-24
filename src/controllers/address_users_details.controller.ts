import { Request, Response } from "express";
import path from "path"; // To handle file paths
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { address_users_details_model } from "../model/address_users_details.model";
import db from "../config/base.database";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
/**
 * Create a new address user detail
 */
export const create_address_user_detail = async (req: Request, res: Response) => {
  //try {
    const addressUserData = req.body;


    // Call the model function to insert address user details into the database
    const addressUser = await address_users_details_model.create_address_user_details(addressUserData);

    // Handle file upload if a file is present
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "house_images",
      });

      if (!result.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      // Update the house image URL in the database
      await address_users_details_model.update_house_image(addressUser.insertId, result.secure_url);
    }

    res.status(201).json({
      message: "Address user detail created and image uploaded successfully",
      address_users_detail_id: addressUser.insertId,
    });
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
    res.status(500).send("Failed to update address user detailzz");
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
    res.status(500).send("Failed to delete address user detailxx");
  }
};