import db from "../config/base.database";


enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

enum Status {
  Active = "active",
  Inactive = "inactive"
}

export interface Employee {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  password: string;
  address: string; // No longer optional
  gender: Gender;
  cv: string; // No longer optional
  avatar?: string;
  cat_id: number; // No longer optional
  price: number; // No longer optional
  status?: Status;
  created_at?: Date;
  updated_at?: Date;
}

export class employees_model {
  // Create employee
  static async create_employees(employee: Employee) {
    try {
      const query = `
        INSERT INTO employees 
        (first_name, last_name, email, tel, password, address, gender, cv, avatar, cat_id, price, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        employee.first_name,
        employee.last_name,
        employee.email,
        employee.tel,
        employee.password,
        employee.address || "",  // Default empty string
        employee.gender,
        employee.cv || "",  // Default empty string
        employee.avatar || "",
        employee.cat_id ?? 0,  // Default to 0
        employee.price ?? 0.00,  // Default to 0.00
        employee.status || Status.Active,
      ];

      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error inserting employee:", error);
      throw new Error("Failed to create employee");
    }
  }

  // Save file path after upload
  static async saveFilePath(id: number, filePath: string) {
    try {
      const query = `
        UPDATE employees
        SET avatar = ?
        WHERE id = ?
      `;
      const values = [filePath, id];
  
      console.log("Executing query:", query, "with values:", values); // Add logging here
  
      const [result] = await db.execute(query, values);
      console.log("Query result:", result); // Log the result of the query
  
      return result;
    } catch (error) {
      console.error("Error saving file path:", error);
      throw new Error("Failed to save file path");
    }
  }

  // Show all employees
  static async show_all_employees() {
    try {
      const query = "SELECT * FROM employees";
      const [result] = await db.execute(query);
      return result;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw new Error("Failed to retrieve employees");
    }
  }

  //show employee by ID

  static async show_employee_by_id(Id: number) {
    try {
        const query = `SELECT * FROM employees WHERE id = ?;`;

        const [rows]: any[] = await db.execute(query, [Id]); // Execute the query

        if (rows.length > 0) {
            return rows[0]; // Return the first row if found
        } else {
            return null; // Return null if no employee is found
        }
    } catch (error) {
        console.error("Error fetching employee details:", error);
        throw new Error("Failed to fetch employee details.");
    }
}

//show image employees by ID
static async show_image_employee_by_id(Id: number) {
  try {
      const query = `SELECT avatar FROM employees WHERE id = ?;`;

      const [rows]: any[] = await db.execute(query, [Id]); // Execute the query

      if (rows.length > 0) {
          return { avatar: rows[0].avatar }; // Ensure we return an object with an avatar property
      } else {
          return { message: "Image not found" }; // Return an object with a message when no image is found
      }
  } catch (error) {
      console.error("Error fetching employee details:", error);
      throw new Error("Failed to fetch employee details.");
  }
}


  // Update employee details
  static async update_employees(id: number, employee: Partial<Employee>) {
    try {
      const fields = Object.keys(employee)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(employee), id];

      const query = `UPDATE employees SET ${fields} WHERE id = ?`;
      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw new Error("Failed to update employee");
    }
  }

  // Soft delete employee (set status to Inactive)
  static async delete_employees(id: number) {
    try {
      const query = `UPDATE employees SET status = ? WHERE id = ?`;
      const [result] = await db.execute(query, [Status.Inactive, id]);
      return result;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw new Error("Failed to delete employee");
    }
  }
}
