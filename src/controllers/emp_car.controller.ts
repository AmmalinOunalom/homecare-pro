import { Request, Response } from "express";
import path from "path"; // To handle file paths
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { emp_car_model } from "../model/emp_cars.model";

/**
 * Create a new emp_car
 */
export const create_emp_car = async (req: Request, res: Response) => {
  try {
    const empCarData = req.body;
    const empCar = await emp_car_model.create_emp_car(empCarData);
    res.status(201).send("EmpCar created successfully");
  } catch (error) {
    res.status(500).send("Failed to create empCar");
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
export const update_emp_car = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEmpCar = await emp_car_model.update_emp_car(Number(id), req.body);
    if (updatedEmpCar) {
      res.status(200).send("EmpCar updated successfully");
    } else {
      res.status(404).send("EmpCar not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update empCar");
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
