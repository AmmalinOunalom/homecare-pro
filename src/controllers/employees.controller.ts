import { Request, Response } from "express";
import path from "path"; // To handle file paths
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { employees_model } from "../model/employees.model";
import bcrypt from "bcrypt";
import { sendSMS } from '../middleware/sms.utils'; // Import the sendSMS function

/**
 * Create a new employee
 */

// export const create_employees = async (req: Request, res: Response) => {
//   try {
//     const employeeData = req.body;

//     // Hash the password
//     const saltRounds = 10;
//     employeeData.password = await bcrypt.hash(employeeData.password, saltRounds);

//     // Upload avatar first if available
//     if (req.file && req.file.path) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "avatars",
//       });

//       if (!result.secure_url) {
//         throw new Error("Cloudinary upload failed");
//       }

//       // Add avatar URL to employee data
//       employeeData.avatar = result.secure_url;

//       // Delete local file
//       if (fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//     }

//     // Insert employee with avatar URL (if uploaded)
//     const employee = await employees_model.create_employees(employeeData);

//     res.status(201).json({
//       message: "Employee created successfully",
//       employee_id: employee.insertId,
//       avatar: employeeData.avatar || null,
//     });
//   } catch (error) {
//     console.error("Error creating employee:", error);
//     res.status(500).json({
//       message: "Failed to create employee",
//       error,
//     });
//   }
// };

export const create_employees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeData = req.body;

    // Validate phone number format
    const telPattern = /^\+85620\d{8}$/;
    if (!telPattern.test(employeeData.tel)) {
      res.status(400).json({
        message: "Invalid phone number format. Expected format: +85620xxxxxxxx",
      });
      return;
    }

    // Hash the password
    const saltRounds = 10;
    employeeData.password = await bcrypt.hash(employeeData.password, saltRounds);

    // Upload avatar if available
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });

      if (!result.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      employeeData.avatar = result.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const employee = await employees_model.create_employees(employeeData);

    res.status(201).json({
      message: "Employee created successfully",
      employee_id: employee.insertId,
      avatar: employeeData.avatar || null,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({
      message: "Failed to create employee",
      error,
    });
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
 * GET employee by status
 */
export const show_status_employees = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;

    if (!status || (status !== 'active' && status !== 'inactive')) {
      res.status(400).json({
        message: "Invalid status. Status must be either 'active' or 'inactive'.",
      });
      return;
    }

    const employees = await employees_model.show_status_employee(status);

    res.status(200).json({
      message: `Employees with status: ${status}`,
      data: employees,
    });
  } catch (error) {
    console.error("Error in showStatusEmployee:", error);
    res.status(500).json({
      message: "Failed to fetch employees by status",
      error: error instanceof Error ? error.message : String(error),
    });
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

// send SMS to employees

export const get_employee_phonenumber = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid employee ID" });
    return;
  }

  try {
    const phoneNumber = await employees_model.get_employee_phone_number(id);

    if (!phoneNumber) {
      res.status(404).json({ message: "Employee not found or no phone number available" });
      return;
    }

    res.status(200).json({ tel: phoneNumber });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Failed to get employee phone number" });
  }
};

/**
 * Update an employee
 */


export const update_employees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employeeId = Number(id);

    if (isNaN(employeeId)) {
      res.status(400).json({ success: false, message: "Invalid employee ID" });
      return;
    }

    // Check if the employee exists
    const employeeExists = await employees_model.show_more_employee_by_id(employeeId);
    if (!employeeExists) {
      res.status(404).json({ success: false, message: `Employee with ID ${employeeId} not found` });
      return;
    }

    const employeeData = req.body;

    let avatarUrl: string | null = null;

    // Handle avatar image upload if a file exists
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars", // Optionally, specify a folder in Cloudinary
      });

      if (!result.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      avatarUrl = result.secure_url;

      // Clean up the uploaded file locally after Cloudinary upload
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path); // Delete local file
      }
    }

    // Build update data only from allowed fields
    const updateData: any = {};

    if (employeeData.first_name) {
      updateData.first_name = employeeData.first_name;
    }
    if (employeeData.last_name) {
      updateData.last_name = employeeData.last_name;
    }
    if (employeeData.email) {
      updateData.email = employeeData.email;
    }
    if (employeeData.tel) {
      updateData.tel = employeeData.tel;
    }
    if (employeeData.address) {
      updateData.address = employeeData.address;
    }
    if (employeeData.gender) {
      updateData.gender = employeeData.gender;
    }
    if (employeeData.cv) {
      updateData.cv = employeeData.cv;
    }
    if (avatarUrl) {
      updateData.avatar = avatarUrl;
    }
    if (employeeData.cat_id) {
      updateData.cat_id = employeeData.cat_id;
    }
    if (employeeData.price) {
      updateData.price = employeeData.price;
    }
    if (employeeData.status) {
      updateData.status = employeeData.status;
    }

    // Ensure there is something to update
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No valid fields to update" });
      return;
    }

    // Proceed with the update using the model
    await employees_model.update_employees(employeeId, updateData);

    res.status(200).json({
      message: "Employee updated successfully",
      employee_id: employeeId,
      updated_fields: updateData,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      message: "Failed to update employee",
      error: error instanceof Error ? error.message : error,
    });
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
function uploadAvatar(file: Express.Multer.File): string | PromiseLike<string | undefined> | undefined {
  throw new Error("Function not implemented.");
}

