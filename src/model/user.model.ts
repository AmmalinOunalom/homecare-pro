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
  static async create(user: any) {
    try {
      // First, check if email, username, or last_name already exist
      const checkQuery = `
        SELECT * FROM users 
        WHERE email = ? OR username = ? OR last_name = ?;
      `;
      const [existingUsers]: any = await db.execute(checkQuery, [
        user.email,
        user.username,
        user.last_name
      ]);

      // If any record is found, throw a custom error
      if (existingUsers.length > 0) {
        throw new Error("User with the same email, username, or last_name already exists");
      }

      // If no duplicates, insert the new user
      const query = `
        INSERT INTO users (email, username, last_name, first_name, tel, password, gender, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        user.email,
        user.username,
        user.last_name,
        user.first_name,
        user.tel,
        user.password,  // Assuming password is already hashed
        user.gender,
        user.status
      ];

      const [result] = await db.execute(query, values);
      return result;
    } catch (error: unknown) { // Specify the type as 'unknown'
      if (error instanceof Error && error.message === "User with the same email, username, or last_name already exists") {
        throw error; // Custom error will be handled in the controller
      } else {
        console.error("Error inserting user:", error);
        throw new Error("Failed to create user");
      }
    }
  }

  // get ussr name by id
 static async get_user_name(userId: number): Promise<{ name: string } | null> {
  try {
    const query = 'SELECT name FROM users WHERE id = ?';
    const [rows]: any[] = await db.execute(query, [userId]);

    if (rows.length === 0) {
      console.log('User not found with ID:', userId);
      return null;
    }

    return { name: rows[0].name }; // Return user's name
  } catch (error) {
    console.error('Error fetching user name:', error);
    return null;
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

  static async get_user_by_id(id: number) {
    const query = 'SELECT id, username, email, first_name, last_name, tel, avatar FROM users WHERE id = ?';
    const [rows]: any = await db.execute(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }


  static async rename_users(
    id: number,  // ID as a number
    newUsername: string,
    newFirstname: string,
    newLastname: string
  ) {
    try {
      // Update query to change the user's username, first name, and last name based on the ID
      const updateQuery = `
        UPDATE users 
        SET username = ?, first_name = ?, last_name = ? 
        WHERE id = ?`;

      const values = [newUsername, newFirstname, newLastname, id];

      // Execute the query using db.execute, result is returned as an array
      const [result]: any[] = await db.execute(updateQuery, values);  // Notice the [result] destructuring

      // Check if the update was successful by checking the affectedRows
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
