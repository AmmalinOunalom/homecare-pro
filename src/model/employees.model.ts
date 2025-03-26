import db from "../config/base.database";
import bcrypt from 'bcrypt';

enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

enum Status {
  Active = "active",
  Inactive = "inactive"
}

enum City {
  VIENTIANE = "VIENTIANE",
  XAYTHANY = "XAYTHANY",
  SAYSETTHA = "SAYSETTHA",
  SANAKHONE = "SANAKHONE",
  NAKHAM = "NAKHAM",
  CHOMCHAO = "CHOMCHAO",
  KONGLEK = "KONGLEK",
  THAHEUA = "THAHEUA",
  BOLIKHAMXAY = "BOLIKHAMXAY",
  CHANTHABULY = "CHANTHABULY",
  SIKHOTTABONG = "SIKHOTTABONG",
  XAYSETHA = "XAYSETHA",
  SISATTANAK = "SISATTANAK",
  NAXAITHONG = "NAXAITHONG",
  XAYTANY = "XAYTANY",
  HADXAIFONG = "HADXAIFONG"
}

export interface Employee {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  password: string;
  address: string;
  gender: Gender;
  cv: string;
  avatar?: string;
  cat_id: number;
  price: number;
  status?: Status;
  city?: City;
  created_at?: Date;
  updated_at?: Date;
}

export class employees_model {
  // Create employee
  static async create_employees(employee: Employee) {
    try {
      // Ensure that city is provided
      if (!employee.city) {
        throw new Error("City is required");
      }

      const query = `
        INSERT INTO employees 
        (first_name, last_name, email, tel, password, address, gender, cv, avatar, cat_id, price, status, city) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        employee.first_name,
        employee.last_name,
        employee.email,
        employee.tel,
        employee.password,
        employee.address || "",
        employee.gender,
        employee.cv || "",
        employee.avatar || "",
        employee.cat_id ?? 0,
        employee.price ?? 0.00,
        employee.status || Status.Active,
        employee.city,
      ];

      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error inserting employee:", error);
      throw new Error("Failed to create employee");
    }
  }

  // Sign in employee function
  static async sign_in_employee(email: string, password: string) {
    try {
      const query = 'SELECT id, first_name, last_name, email, password FROM employees WHERE email = ?';
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

  // Update employee avatar
  static async update_employee_avatar(id: number, cloudinaryUrl: string) {
    try {
      // Check if employee exists before updating
      const checkQuery = "SELECT id FROM employees WHERE id = ?";
      const [rows]: any[] = await db.execute(checkQuery, [id]);

      if (rows.length === 0) {
        console.log("Employee not found with ID:", id);
        return { success: false, message: "Employee not found" };
      }

      const query = `UPDATE employees SET avatar = ? WHERE id = ?`;
      const values = [cloudinaryUrl, id];

      const [updateResult]: any[] = await db.execute(query, values);
      const affectedRows = updateResult.affectedRows;

      if (affectedRows === 0) {
        return { success: false, message: "Failed to update avatar" };
      }

      console.log("Employee avatar updated successfully for ID:", id);
      return { success: true, message: "Avatar updated successfully" };
    } catch (error) {
      console.error("Error updating employee avatar:", error);
      throw new Error("Failed to update employee avatar");
    }
  }

  // Show all employees
  static async show_all_employees() {
    try {
      const query = `
        SELECT e.id, e.first_name, e.last_name, e.email, e.tel, 
               e.address, e.gender, e.cv, e.avatar, 
               e.cat_id, c.cat_name, e.price, e.status, e.city, e.created_at, e.updated_at
        FROM employees e
        JOIN categories c ON e.cat_id = c.id
      `;
      const [result] = await db.execute(query);
      return result;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw new Error("Failed to retrieve employees");
    }
  }

  // Show employee by ID
  static async show_employee_by_id(Id: number) {
    try {
      const query = `SELECT e.id, e.first_name, e.last_name, e.email, e.tel, 
       e.address, e.gender, e.cv, e.avatar, 
       e.cat_id, c.cat_name, e.price, e.status, e.created_at, e.updated_at
FROM employees e
JOIN categories c ON e.cat_id = c.id
WHERE e.id = ?;`;

      const [rows]: any[] = await db.execute(query, [Id]);

      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      throw new Error("Failed to fetch employee details.");
    }
  }

  // Show image of employee by ID
  static async show_image_employee_by_id(Id: number) {
    try {
      const query = `SELECT avatar FROM employees WHERE id = ?;`;

      const [rows]: any[] = await db.execute(query, [Id]);

      if (rows.length > 0) {
        return { avatar: rows[0].avatar };
      } else {
        return { message: "Image not found" };
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      throw new Error("Failed to fetch employee details.");
    }
  }

  // Update employee details
  static async update_employees(id: number, employee: Partial<Employee>) {
    try {
      // Check if employee exists before updating
      const checkQuery = "SELECT id FROM employees WHERE id = ?";
      const [rows]: any[] = await db.execute(checkQuery, [id]);

      if (rows.length === 0) {
        console.log("Employee not found with ID:", id);
        return { success: false, message: "Employee not found" };
      }

      const fields = Object.keys(employee)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(employee), id];

      const query = `UPDATE employees SET ${fields} WHERE id = ?`;
      const [result]: any[] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw new Error("Failed to update employee");
    }
  }

  // Soft delete employee (set status to Inactive)
  static async delete_employees(id: number) {
    try {
      // Check if employee exists before deleting
      const checkQuery = "SELECT id FROM employees WHERE id = ?";
      const [rows]: any[] = await db.execute(checkQuery, [id]);

      if (rows.length === 0) {
        console.log("Employee not found with ID:", id);
        return { success: false, message: "Employee not found" };
      }

      const query = `UPDATE employees SET status = ? WHERE id = ?`;
      const [result]: any[] = await db.execute(query, [Status.Inactive, id]);
      return result;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw new Error("Failed to delete employee");
    }
  }
}
