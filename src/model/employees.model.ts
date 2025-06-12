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
  static async create_employees(
    employee: Omit<Employee, "id" | "created_at" | "updated_at">
  ) {
    try {
      const values = [
        employee.first_name || null,
        employee.last_name || null,
        employee.email || null,
        employee.tel || null,
        employee.password || null,
        employee.address || null,
        employee.gender || null,
        employee.cv || null,
        employee.avatar || null,
        employee.cat_id ?? 0,
        employee.price ?? 0.0,
        employee.status || "active",
        employee.city || null,
      ];

      const query = `
        INSERT INTO employees 
        (first_name, last_name, email, tel, password, address, gender, cv, avatar, cat_id, price, status, city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result]: any = await db.execute(query, values);

      if (!result.insertId) {
        throw new Error("Failed to retrieve insertId after inserting employee");
      }

      console.log("New Employee ID:", result.insertId);

      return { insertId: result.insertId };
    } catch (error: unknown) {
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
WHERE e.status = 'active'
ORDER BY e.cat_id ASC;
      `;
      const [result] = await db.execute(query);
      return result;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw new Error("Failed to retrieve employees");
    }
  }

  //NOTE - Show status employees

static async show_status_employee(status: string) {
  try {
    const query = `
      SELECT 
        e.id, e.first_name, e.last_name, e.email, 
        e.tel, e.address, e.gender, e.cv, e.avatar, 
        e.cat_id, c.cat_name, e.price, e.status, 
        e.city, e.created_at, e.updated_at
      FROM employees e
      JOIN categories c ON e.cat_id = c.id
      WHERE e.status = ?
    `;
    const [result] = await db.execute(query, [status]);
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
       e.address, e.city, e.gender, e.cv, e.avatar, 
       e.cat_id, c.cat_name, e.price, e.status, e.created_at, e.updated_at
FROM employees e
JOIN categories c ON e.cat_id = c.id
WHERE e.id =?`;

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

  // Show employee by ID=5 && cat_name = Moving
  static async show_more_employee_by_id(id: number) {
    try {
      const query = `
        SELECT e.id, e.first_name, car_brand, model, license_plate, car_image, 
               c.id AS cat_id, c.cat_name, ec.emp_id
        FROM employees e
        JOIN categories c ON e.cat_id = c.id  
        LEFT JOIN emp_cars ec ON e.id = ec.emp_id
        WHERE c.id = 5 AND c.cat_name = 'Moving';
      `;

      const [rows]: any[] = await db.execute(query);

      if (rows.length > 0) {
        return rows; // ✅ Return all employees, not just the first one
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      throw new Error("Failed to fe tch employee details.");
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

  static async update_employees(
    id: number,
    employeeData: Partial<Pick<Employee,
      "first_name" | "last_name" | "email" | "tel" | "address" | "gender" | "cv" | "status" | "cat_id" | "price">>
      & { avatar?: string }
  ) {
    try {
      // First, validate that the employee exists
      const [existingRows]: any = await db.execute('SELECT id FROM employees WHERE id = ?', [id]);
      if (!Array.isArray(existingRows) || existingRows.length === 0) {
        throw new Error(`Employee with ID ${id} does not exist`);
      }

      // Build dynamic SET clause
      const fields: string[] = [];
      const values: any[] = [];

      if (employeeData.first_name !== undefined) fields.push("first_name = ?"), values.push(employeeData.first_name);
      if (employeeData.last_name !== undefined) fields.push("last_name = ?"), values.push(employeeData.last_name);
      if (employeeData.email !== undefined) fields.push("email = ?"), values.push(employeeData.email);
      if (employeeData.tel !== undefined) fields.push("tel = ?"), values.push(employeeData.tel);
      if (employeeData.address !== undefined) fields.push("address = ?"), values.push(employeeData.address);
      if (employeeData.gender !== undefined) fields.push("gender = ?"), values.push(employeeData.gender);
      if (employeeData.cv !== undefined) fields.push("cv = ?"), values.push(employeeData.cv);
      if (employeeData.avatar !== undefined) fields.push("avatar = ?"), values.push(employeeData.avatar);
      if (employeeData.cat_id !== undefined) fields.push("cat_id = ?"), values.push(employeeData.cat_id);
      if (employeeData.price !== undefined) fields.push("price = ?"), values.push(employeeData.price);
      if (employeeData.status !== undefined) fields.push("status = ?"), values.push(employeeData.status);

      // Always update updated_at
      fields.push("updated_at = NOW()");

      if (fields.length === 1) {
        throw new Error("No valid fields provided for update");
      }

      const query = `UPDATE employees SET ${fields.join(", ")} WHERE id = ?`;
      values.push(id);

      const [result]: any = await db.execute(query, values);

      if (result.affectedRows === 0) {
        throw new Error(`No changes made to employee with ID ${id}`);
      }

      return result;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  }


  // Fetch employee by ID and return phone number
  static async get_employee_phone_number(employeeId: number): Promise<string | null> {
    try {
      const query = 'SELECT tel FROM employees WHERE id = ?';
      const [rows]: any[] = await db.execute(query, [employeeId]);

      if (rows.length === 0) {
        console.log('Employee not found with ID:', employeeId);
        return null;
      }

      return rows[0].tel; // Return phone number
    } catch (error) {
      console.error('Error fetching employee phone number:', error);
      return null;
    }
  }

static async get_employee_by_phone(employeePhone: string): Promise<any | null> {
  try {
    const query = 'SELECT id, cat_id, price, tel FROM employees WHERE tel = ?';
    const [rows]: any[] = await db.execute(query, [employeePhone]);

    if (rows.length === 0) {
      console.log('Employee not found with phone:', employeePhone);
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error('Error fetching employee by phone:', error);
    return null;
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

      // Permanently delete employee
      const deleteQuery = `DELETE FROM employees WHERE id = ?`;
      const [result]: any[] = await db.execute(deleteQuery, [id]);

      return { success: true, message: "Employee deleted successfully", result };
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw new Error("Failed to delete employee");
    }
  }
}
