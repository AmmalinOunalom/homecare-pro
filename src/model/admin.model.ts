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
export interface Admin {
    id: number;
    admin_name: string;
    first_name: string;
    last_name: string;
    email: string;
    tel: string;
    avatar: string;
    password: string;
    gender: string;
    status: string;
    create_at: Date;
    update_at: Date;
}

export class admin_model {

    //NOTE - SHOW ALL ADMIN  
      static async show_all_admins() {
        try {
          const [result]: any = await db.execute("SELECT * FROM admins");
          return result;
        } catch (error) {
          console.error("Error fetching admins:", error);
          throw new Error("Failed to retrieve admins");
        }
      }

    //NOTE - SIGN UP ADMIN
    static async sign_up_admin(admin: Omit<Admin, "id" | "created_at" | "updated_at">) {
  try {
    // Check if admin with same email or admin_name already exists
    const checkQuery = `
      SELECT * FROM admins 
      WHERE email = ? OR admin_name = ?;
    `;
    const [existingAdmins]: any = await db.execute(checkQuery, [
      admin.email,
      admin.admin_name,
    ]);

    if (existingAdmins.length > 0) {
      throw new Error("Admin with the same email or admin_name already exists");
    }

    const now = new Date();

    const query = `
      INSERT INTO admins 
      (admin_name, first_name, last_name, email, tel, password, gender, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      admin.admin_name || null,
      admin.first_name || null,
      admin.last_name || null,
      admin.email || null,
      admin.tel || null,
      admin.password || null, // assumed hashed
      admin.gender || null,
      admin.status || "active",
      admin.create_at ?? now,
      admin.update_at ?? now,
    ];

    const [result]: any = await db.execute(query, values);

    if (!result.insertId) {
      throw new Error("Failed to retrieve insertId after inserting admin");
    }

    console.log("New Admin ID:", result.insertId);

    return { insertId: result.insertId };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "Admin with the same email or admin_name already exists"
    ) {
      throw error;
    } else {
      console.error("Error inserting admin:", error);
      throw new Error("Failed to create admin");
    }
  }
}

    //NOTE - SIGN IN ADMIN
    static async sign_in_admin(email: string, password: string) {
        try {
            const query = 'SELECT id, admin_name, first_name, last_name, email, password FROM admins WHERE email = ?';
            const [rows]: any[] = await db.execute(query, [email]);

            if (rows.length === 0) return null;

            const employee = rows[0];

            const isPasswordValid = await bcrypt.compare(password, employee.password);

            return isPasswordValid ? {
                id: employee.id,
                email: employee.email,
                first_name: employee.first_name,
                last_name: employee.last_name
            } : null;
        } catch (error) {
            console.error("Error during employee sign in:", error);
            return null;
        }
    }

    //NOTE - rename admin
    static async rename_admin(
  id: number,
  updates: Partial<{ newAdminName: string; newFirstname: string; newLastname: string; newAvatar: string }>
) {
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.newAdminName) {
      fields.push("admin_name = ?");
      values.push(updates.newAdminName);
    }

    if (updates.newFirstname) {
      fields.push("first_name = ?");
      values.push(updates.newFirstname);
    }

    if (updates.newLastname) {
      fields.push("last_name = ?");
      values.push(updates.newLastname);
    }

    if (fields.length === 0) {
      return null; // Nothing to update
    }

    // Update updated_at to current timestamp
    fields.push("updated_at = NOW()");

    const updateQuery = `UPDATE admins SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result]: any[] = await db.execute(updateQuery, values);
    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error("Error updating admin:", error);
    throw new Error("Update failed");
  }
}

static async forgot_password_admin(email: string, newPassword: string) {
  try {
    const [result]: any = await db.execute(
      "UPDATE admins SET password = ? WHERE email = ?",
      [newPassword, email]
    );

    return result.affectedRows > 0 ? result : null;
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Update failed");
  }
}
}