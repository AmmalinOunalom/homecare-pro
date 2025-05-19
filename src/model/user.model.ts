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
      const checkQuery = `
      SELECT * FROM users 
      WHERE email = ? OR username = ? OR last_name = ?;
    `;
      const [existingUsers]: any = await db.execute(checkQuery, [
        user.email,
        user.username,
        user.last_name,
      ]);

      if (existingUsers.length > 0) {
        throw new Error("User with the same email, username, or last_name already exists");
      }

      const now = new Date();

      const query = `
      INSERT INTO users 
      (email, username, last_name, first_name, tel, password, gender, status, avatar, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
      const values = [
        user.email,
        user.username,
        user.last_name,
        user.first_name,
        user.tel,
        user.password, // hashed
        user.gender,
        user.status,
        user.avatar, // should be URL or filename
        user.created_at ?? now,
        user.updated_at ?? now,
      ];

      const [result] = await db.execute(query, values);
      return result;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "User with the same email, username, or last_name already exists"
      ) {
        throw error;
      } else {
        console.error("Error inserting user:", error);
        throw new Error("Failed to create user");
      }
    }
  }

  // get ussr name by id
  static async get_user_name(userId: number): Promise<{ name: string } | null> {
    try {
      const query = 'SELECT username FROM users WHERE id = ?';
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
    id: number,
    updates: Partial<{ newUsername: string; newFirstname: string; newLastname: string; newAvatar: string }>
  ) {
    try {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.newUsername) {
        fields.push("username = ?");
        values.push(updates.newUsername);
      }

      if (updates.newFirstname) {
        fields.push("first_name = ?");
        values.push(updates.newFirstname);
      }

      if (updates.newLastname) {
        fields.push("last_name = ?");
        values.push(updates.newLastname);
      }

      if (updates.newAvatar) {
        fields.push("avatar = ?");
        values.push(updates.newAvatar);
      }

      if (fields.length === 0) {
        return null; // Nothing to update
      }

      // Add updated_at timestamp update
      fields.push("updated_at = NOW()");

      const updateQuery = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
      values.push(id);

      const [result]: any[] = await db.execute(updateQuery, values);
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

  static async get_user_by_phone(employeePhone: string) {
    const query = `
SELECT 
  u.tel,
  a.address_name AS locationName,
  a.village AS villageName,
  a.address_description AS details,
  a.google_link_map AS mapLink
  FROM users u
  LEFT JOIN address_users_detail a ON u.address_users_detail_id = a.id
  WHERE u.TEL = ?
  LIMIT 1
    `;

    const [rows]: any = await db.execute(query, [employeePhone]);
    return rows.length > 0 ? rows[0] : null;
  }
}
