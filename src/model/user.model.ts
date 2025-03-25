import db from "../config/base.database";
import bcrypt from 'bcrypt';


// Enums for Gender and Status
enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER"
}

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

// User Interface
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  avatar: string;
  password: string;
  address: string;
  gender: string;
  status: string;
  create_at: Date;
  update_at: Date;
}

export class user_model {
  // Create User
  static async create(user: User) {
    try {
      const query = 'INSERT INTO users (username, first_name, last_name, email, tel, password, gender, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

      const values = [
        user.username,
        user.first_name,
        user.last_name,
        user.email,
        user.tel,
        user.password,  // Assuming password is already hashed
        user.gender,
        user.status
      ];

      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error inserting user:", error);
      throw new Error("Failed to create user");
    }
  }

// Sign in user function
static async sign_in(email: string, password: string) {
  try {
    // Query to find the user by email
    const query = 'SELECT id, username, email, password FROM users WHERE email = ?';
    const [rows]: any = await db.execute(query, [email]);

    // If user is not found, return null
    if (rows.length === 0) return null;

    const user = rows[0];

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Return user data if password is valid, else return null
    return isPasswordValid ? {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      tel: user.tel,
      avatar: user.avatar,
      address: user.address,
      gender: user.gender,
      status: user.status
    } : null;
  } catch (error) {
    console.error("Error during sign in:", error);
    return null;
  }
}

  // Show all users
  static async show_all() {
    try {
      const [result]: any = await db.execute("SELECT * FROM users");
      return result;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to retrieve users");
    }
  }

  static async rename_users(
    id: number,
    newUsername: string,
    newFirstname: string,
    newLastname: string,
    profileFilename?: string
  ) {
    try {
      // SQL Query with fixed fields
      const updateQuery = `
        UPDATE users 
        SET 
          username = ?, 
          first_name = ?, 
          last_name = ?, 
          profile = ?, 
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`;
  
      // Provide `null` if profileFilename is not given
      const values = [newUsername, newFirstname, newLastname, profileFilename || null, id];
  
      // Execute query
      const [result]: any = await db.execute(updateQuery, values);
  
      // Check if update was successful
      return result.affectedRows > 0 ? result : null;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Update failed");
    }
  }

  static async forgot_password_users(email: string, newPassword: string) {
    try {
      const [result]: any = await db.execute(
        "UPDATE users SET password = ? WHERE email = ?",
        [newPassword, email]
      );
  
      return result.affectedRows > 0 ? result : null;
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Update failed");
    }
  }
}
