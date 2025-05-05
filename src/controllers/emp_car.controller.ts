import { Request, Response } from "express";
import path from "path"; // To handle file paths
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { emp_car_model } from "../model/emp_cars.model";

/**
 * Create a new emp_car
 */

export const create_emp_car = async (req: Request, res: Response): Promise<void> => {
  try {
    const empCarData = req.body;
    let carImageUrl: string | null = null;

    // Handle car image upload if file exists
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'car_images', // Store the image in this folder on Cloudinary
      });

      if (!result.secure_url) {
        throw new Error('Cloudinary upload failed');
      }

      carImageUrl = result.secure_url;

      // Remove local file after upload
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Create emp_car entry in database with the uploaded image URL
    const empCarId = await emp_car_model.create_emp_car({
      emp_id: empCarData.emp_id,
      car_brand: empCarData.car_brand,
      model: empCarData.model,
      license_plate: empCarData.license_plate,
      car_image: carImageUrl, // Store the Cloudinary URL of the uploaded image
    });

    res.status(201).json({
      message: 'Employee car created successfully',
      emp_car_id: empCarId,
      car_image: carImageUrl, // Return the uploaded image URL
    });
  } catch (error) {
    console.error('Error creating emp_car:', error);
    res.status(500).json({
      message: 'Failed to create empCar',
      error,
    });
  }
};


/**
 * Retrieve all emp_cars
 */
export const show_all_emp_cars = async (req: Request, res: Response) => {
  try {
    const empCars = await emp_car_model.show_all_emp_cars();
    res.status(200).send(empCars);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Update an emp_car
 */


export const update_emp_car = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const empCarData = req.body;

    let carImageUrl: string | null = null;

    // Handle image upload if a file exists
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "car_images",
      });

      if (!result.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      carImageUrl = result.secure_url;

      // Clean up the uploaded file locally
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path); // Delete local file after upload
      }
    }

    // Build update data only from allowed fields
    const updateData: any = {};

    if (empCarData.car_brand) {
      updateData.car_brand = empCarData.car_brand;
    }
    if (empCarData.model) {
      updateData.model = empCarData.model;
    }
    if (empCarData.license_plate) {
      updateData.license_plate = empCarData.license_plate;
    }
    if (carImageUrl) {
      updateData.car_image = carImageUrl;
    }

    // Ensure there is something to update
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No valid fields to update" });
      return;
    }

    // Proceed with the update
    await emp_car_model.update_emp_car(Number(id), updateData);

    res.status(200).json({
      message: "EmpCar updated successfully",
      emp_car_id: id,
      updated_fields: updateData,
    });
  } catch (error) {
    console.error("Error updating emp_car:", error);
    res.status(500).json({
      message: "Failed to update empCar",
      error: error instanceof Error ? error.message : error,
    });
  }
};


export const upload_car_image = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Received upload request:", req.body);

    if (!req.file) {
      console.log("No file uploaded");
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    console.log("File uploaded:", req.file);

    const empCarId = parseInt(req.body.empCarId, 10);
    if (isNaN(empCarId)) {
      console.log("Invalid empCarId");
      res.status(400).json({ message: "Invalid empCarId" });
      return;
    }

    // Upload file to Cloudinary under a "cars" folder
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "cars",
    });

    if (!result.secure_url) {
      res.status(500).json({ message: "Cloudinary upload failed" });
      return;
    }

    console.log("Cloudinary URL:", result.secure_url);

    // Use employees_model to save the car image URL in the database
    await emp_car_model.update_employee_car_image(empCarId, result.secure_url);

    // Delete the local file after upload to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Car image uploaded and updated successfully",
      fileUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading car image:", error);
    res.status(500).json({ message: "Error uploading car image", error });
  }
};

export const get_emp_car_by_id = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log("Received empCarId:", id);

    const empCarDetails = await emp_car_model.get_emp_car_by_id(Number(id));
    console.log("EmpCar Details:", empCarDetails);

    if (empCarDetails) {
      res.status(200).json(empCarDetails);
    } else {
      res.status(404).json({ message: "EmpCar details not found for this ID" });
    }
  } catch (error) {
    console.error("Error fetching emp_car details by ID:", error);
    res.status(500).json({ message: "Failed to fetch emp_car details" });
  }
};

/**
 * Delete an emp_car
 */
export const delete_emp_car = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEmpCar = await emp_car_model.delete_emp_car(Number(id));
    if (deletedEmpCar) {
      res.status(200).send("EmpCar deleted successfully");
    } else {
      res.status(404).send("EmpCar not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete empCar");
  }
};
