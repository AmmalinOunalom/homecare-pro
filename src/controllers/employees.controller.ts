import { Request, Response } from "express";
import path from "path"; // To handle file paths
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { employees_model } from "../model/employees.model";
import bcrypt from "bcrypt";

/**
 * Create a new employee
 */
export const create_employees = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    // Hash the password before saving
    const saltRounds = 10;
    req.body.password = await bcrypt.hash(password, saltRounds);

    const employee = await employees_model.create_employees(req.body); // Now the password is hashed
    res.status(200).send("Employee created successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};
// Sign in employee
export const sign_in_employee = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Call the model's sign_in_employee function
    const employee = await employees_model.sign_in_employee(email, password);

    if (employee) {
      // If employee is found and password is correct
      res.status(200).send({
        message: "Sign-in successful",
        employee: {
          id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
        },
      });
    } else {
      // If credentials are invalid
      res.status(401).send({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    // Log error with more context
    console.error("Error during employee sign in process:", error);

    // Respond with internal server error
    res.status(500).send({
      message: "Internal Server Error, please try again later",
    });
  }
};

/**
 *  UPDATE PROFILE EMPLOYEE
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Received upload request:", req.body);

    if (!req.file) {
      console.log("No file uploaded");
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    console.log("File uploaded:", req.file);

    const employeeId = parseInt(req.body.employeeId, 10);
    if (isNaN(employeeId)) {
      console.log("Invalid employeeId");
      res.status(400).json({ message: "Invalid employeeId" });
      return;
    }

    // อัปโหลดไฟล์ไปยัง Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "employees",
    });

    if (!result.secure_url) {
      res.status(500).json({ message: "Cloudinary upload failed" });
      return;
    }

    console.log("Cloudinary URL:", result.secure_url);

    // ใช้ employees_model ในการบันทึกข้อมูลลงฐานข้อมูล
    await employees_model.update_employee_avatar(employeeId, result.secure_url);

    // ลบไฟล์ที่อัปโหลดในเครื่อง
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "File uploaded and avatar updated successfully",
      fileUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file", error });
  }
};


/**
 * Retrieve all employees
 */
export const show_all_employees = async (req: Request, res: Response) => {
  try {
    const employees = await employees_model.show_all_employees();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Get employee by ID
 */

export const show_employee_by_id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Received userId:", id); // Log to ensure the request is reaching the controller

    const employeeDetails = await employees_model.show_employee_by_id(Number(id));
    console.log("Employee Details:", employeeDetails); // Log the result returned by the model

    if (employeeDetails) {
      res.status(200).send(employeeDetails);
    } else {
      res.status(404).send("Employee details not found for this userz");
    }
  } catch (error) {
    console.error("Error fetching employee details by userId:", error);
    res.status(500).send("Failed to fetch employee details");
  }
};

//READ EMPLOYEE ID=5

export const show_more_employee_by_id = async (req: Request, res: Response) => {
  try {
    const { empId } = req.params;
    console.log("Received userId:", empId); // Log to ensure the request is reaching the controller

    const employeeDetails = await employees_model.show_more_employee_by_id(Number(empId));
    console.log("Employee Details:", employeeDetails); // Log the result returned by the model

    if (employeeDetails) {
      res.status(200).send(employeeDetails);
    } else {
      res.status(404).send("Employee details not found for this employee");
    }
  } catch (error) {
    console.error("Error fetching employee details by userId:", error);
    res.status(500).send("Failed to fetch employee details");
  }
};

/**
 * Get image employee by ID
 */

export const show_image_employee_by_id = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log("Received employeeId:", id);  

    const employeeImage = await employees_model.show_image_employee_by_id(Number(id));
    console.log("Employee Image:", employeeImage);

    if (employeeImage && employeeImage.avatar) {
      // If the avatar is a URL, just redirect or send the URL
      if (employeeImage.avatar.startsWith("http")) {
        return res.redirect(employeeImage.avatar); // Option 1: redirect
        // OR: res.status(200).json({ imageUrl: employeeImage.avatar }); // Option 2: return as JSON
      }

      // Fallback: try to serve as local file if it's not a URL
      const imagePath = path.join(__dirname, "../uploads", employeeImage.avatar);
      if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
      } else {
        res.status(400).send("Image not found for this employee");
      }
    } else {
      res.status(400).send("Employee image not found");
    }
  } catch (error) {
    console.error("Error fetching employee image by employeeId:", error);
    res.status(500).send("Failed to fetch employee image");
  }
};



/**
 * Update an employee
 */
export const update_employees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await employees_model.update_employees(Number(id), req.body);
    res.status(200).send("Employee updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update employee");
  }
};

/**
 * Delete an employee (Soft Delete)
 */
export const delete_employees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await employees_model.delete_employees(Number(id));
    res.status(200).send("Employee deleted successfully");
  } catch (error) {
    res.status(500).send("Failed to delete employee");
  }
};
