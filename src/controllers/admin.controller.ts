import { Request, Response } from "express";
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
import { admin_model } from "../model/admin.model";
import bcrypt from "bcrypt";

// show all users
export const show_all_admins = async (req: Request, res: Response) => {
  try {
    const users = await admin_model.show_all_admins();
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
};

//NOTE - SIGN UP ANDMIN
 
export const sign_up_admin = async (req: Request, res: Response) => {
  try {
    const adminData = req.body;

    // Hash the password
    const saltRounds = 10;
    adminData.password = await bcrypt.hash(adminData.password, saltRounds);

    // Insert admin without avatar
    const admin = await admin_model.sign_up_admin(adminData);

    res.status(201).json({
      message: "Admin created successfully",
      admin_id: admin.insertId,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      message: "Failed to create admin",
      error,
    });
  }
};

//NOTE - SIGN IN ADMIN
export const sign_in_admin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const admin = await admin_model.sign_in_admin(email, password);

    if (!admin) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Optionally, you could create a JWT token here for authentication

    res.status(200).json({
      message: "Admin signed in successfully",
      admin: {
        id: admin.id,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
      },
    });
  } catch (error) {
    console.error("Error during admin sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//NOTE - RENAME ADMIN

export const rename_admin = async (req: Request, res: Response ): Promise<void> => {
  const id = Number(req.params.id);
  const { newAdminName, newFirstname, newLastname } = req.body;

  if (!id) {
    res.status(400).json({ message: "Invalid admin ID" });
    return;
  }

  try {
    const updates: Partial<{ newAdminName: string; newFirstname: string; newLastname: string }> = {};

    if (newAdminName) updates.newAdminName = newAdminName;
    if (newFirstname) updates.newFirstname = newFirstname;
    if (newLastname) updates.newLastname = newLastname;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ message: "No valid fields provided for update" });
      return;
    }

    const result = await admin_model.rename_admin(id, updates);

    if (!result) {
      res.status(404).json({ message: "Admin not found or no changes applied" });
      return;
    }

    res.json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Failed to update admin" });
  }
};

// NOTE - FORGOT PASSWORD

export const forgot_password_admin = async (req: Request, res: Response ): Promise<void> => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res.status(400).json({ message: "Email and newPassword are required" });
    return;
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const result = await admin_model.forgot_password_admin(email, hashedPassword);

    if (!result) {
      res.status(404).json({ message: "Admin with the provided email not found" });
      return;
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
};