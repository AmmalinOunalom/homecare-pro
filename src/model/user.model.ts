import db from "../config/base.database";

enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER"
}

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

export interface User {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  password: string;
  gender: Gender;
  status?: Status; // Optional, defaults to ACTIVE
  created_at?: Date;
  updated_at?: Date;
}

export class user_model {
  static async create(user: User) {
    try {
      const query = `
        INSERT INTO users (username, first_name, last_name, email, tel, password, gender, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        user.username,
        user.first_name,
        user.last_name,
        user.email,
        user.tel,
        user.password,
        user.gender,
        user.status || Status.Active // Default to "ACTIVE" if not provided
      ];

      const [result]: any = await db.execute(query, values);
      return result.insertId;
    } catch (error) {
      console.error("Error inserting user:", error);
      throw new Error("Failed to create user");
    }
  }

  static async show_all() {
    try {
      const [result]: any = await db.execute("SELECT * FROM users");
      return result;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to retrieve users");
    }
  }
}
