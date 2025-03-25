import { Request, Response } from "express";
import path from "path"; // To handle file paths
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
    // Log the incoming request
    console.log('Received upload request:', req.body);

    if (!req.file) {
      console.log('No file uploaded');
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Log the file details
    console.log('File uploaded:', req.file);

    // Extract the file name from the full file path
    const fileName = path.basename(req.file.path); // Only extract the file name, not full path
    
    // Ensure employeeId is provided and is a valid number
    const employeeId = parseInt(req.body.employeeId, 10);
    
    if (isNaN(employeeId)) {
      console.log('Invalid employeeId');
      res.status(400).json({ message: "Invalid employeeId" });
      return;
    }

    // Log the file name and employee ID
    console.log('File name:', fileName);
    console.log('Employee ID:', employeeId);

    // Now update the avatar in the database with the file name (not the full path)
    await employees_model.saveFilePath(employeeId, fileName);

    // Construct the URL to access the uploaded file
    const fileUrl = `http://localhost:5000/uploads/${fileName}`;

    // Send the response with the file URL
    res.status(200).json({
      message: "File uploaded and avatar updated successfully",
      fileUrl, // Returning the URL path only
    });
  } catch (error) {
    console.error('Error uploading file:', error); // Log the error
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
      res.status(404).send("Employee details not found for this user");
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
    const { id } = req.params; // Get employee ID from request parameters
    console.log("Received employeeId:", id); // Log the received ID

    // Get employee image details from the model
    const employeeImage = await employees_model.show_image_employee_by_id(Number(id));

    console.log("Employee Image:", employeeImage); // Log the result returned by the model

    // Check if employee image was found
    if (employeeImage && employeeImage.avatar) {
      const imagePath = path.join(__dirname, "../uploads", employeeImage.avatar); // Construct the full path to the image

      // Check if the image file exists
      if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath); // Send the image if it exists
      } else {
        res.status(404).send("Image not found for this employee");
      }
    } else {
      // If no image found or an error occurred
      res.status(404).send(employeeImage.message || "Employee image not found");
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
