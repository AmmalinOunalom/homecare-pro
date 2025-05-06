import db from "../config/base.database";

// EmpCar Interface
export interface EmpCar {
  id: number;             // Auto-increment ID
  emp_id: number;         // Foreign key for employee ID
  car_brand: string;      // Brand of the car
  model: string;          // Model of the car
  car_image: string | null;  // Allow null if no image is uploaded
  license_plate: string;  // License plate of the car
  created_at: Date;       // Date when the car was added
  updated_at: Date;       // Date when the car record was updated
}

export class emp_car_model {
  // Create EmpCar
  static async create_emp_car(empCar: Omit<EmpCar, "id" | "created_at" | "updated_at">) {
    try {
      const query = `
            INSERT INTO emp_cars 
              (emp_id, car_brand, model, license_plate, car_image)
            VALUES (?, ?, ?, ?, ?)
          `;
      const values = [
        empCar.emp_id,
        empCar.car_brand,
        empCar.model,
        empCar.license_plate,
        empCar.car_image
      ];

      // Execute the query and get the result
      const [result] = await db.execute(query, values);

      // If the result is of type ResultSetHeader, access the insertId
      if ('insertId' in result) {
        return result.insertId; // Return the insertId for further use (e.g., in the controller)
      }

      // If for some reason insertId doesn't exist, handle the failure
      throw new Error("Failed to retrieve insertId from emp_car insertion");

    } catch (error) {
      console.error("Error inserting emp_car:", error);
      throw new Error("Failed to create emp_car");
    }
  }

  // Show All EmpCars
  static async show_all_emp_cars() {
    try {
      const query = 'SELECT * FROM emp_cars';
      const [rows] = await db.execute(query);
      return rows;  // Returning the fetched emp_cars
    } catch (error) {
      console.error("Error fetching emp_cars:", error);
      throw new Error("Failed to fetch emp_cars");
    }
  }

  static async get_emp_car_by_id(id: number): Promise<any> {
    try {
      // Query to get the emp_car by its ID
      const query = `SELECT * FROM emp_cars WHERE id = ?`;

      // Execute query
      const [rows]: any[] = await db.execute(query, [id]);

      // If the result is not empty, return the first row
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;  // If no record found
      }
    } catch (error) {
      console.error("Error fetching emp_car details:", error);
      throw new Error("Failed to fetch emp_car details.");
    }
  }

  // static async update_emp_car(id: number, empCar: Partial<Pick<EmpCar, "car_brand" | "model" | "license_plate">> & { car_image?: string }
  // ) {
  //   try {
  //     // Build the dynamic SET clause
  //     const fields: string[] = [];
  //     const values: any[] = [];

  //     if (empCar.car_brand !== undefined) {
  //       fields.push("car_brand = ?");
  //       values.push(empCar.car_brand);
  //     }

  //     if (empCar.model !== undefined) {
  //       fields.push("model = ?");
  //       values.push(empCar.model);
  //     }

  //     if (empCar.license_plate !== undefined) {
  //       fields.push("license_plate = ?");
  //       values.push(empCar.license_plate);
  //     }

  //     if (empCar.car_image !== undefined) {
  //       fields.push("car_image = ?");
  //       values.push(empCar.car_image);
  //     }

  //     // Always update updated_at
  //     fields.push("updated_at = NOW()");

  //     if (fields.length === 1) {
  //       throw new Error("No valid fields provided for update");
  //     }

  //     const query = `
  //               UPDATE emp_cars 
  //               SET ${fields.join(", ")} 
  //               WHERE id = ?
  //           `;
  //     values.push(id);

  //     const [result] = await db.execute(query, values);
  //     return result;
  //   } catch (error) {
  //     console.error("Error updating emp_car:", error);
  //     throw new Error("Failed to update emp_car");
  //   }
  // }

  // static async update_emp_car(empId: number, empCar: Partial<Pick<EmpCar, "car_brand" | "model" | "license_plate">> & { car_image?: string }) {
  //   try {
  //     // Build the dynamic SET clause
  //     const fields: string[] = [];
  //     const values: any[] = [];
  
  //     if (empCar.car_brand !== undefined) {
  //       fields.push("car_brand = ?");
  //       values.push(empCar.car_brand);
  //     }
  
  //     if (empCar.model !== undefined) {
  //       fields.push("model = ?");
  //       values.push(empCar.model);
  //     }
  
  //     if (empCar.license_plate !== undefined) {
  //       fields.push("license_plate = ?");
  //       values.push(empCar.license_plate);
  //     }
  
  //     if (empCar.car_image !== undefined) {
  //       fields.push("car_image = ?");
  //       values.push(empCar.car_image);
  //     }
  
  //     // Always update updated_at
  //     fields.push("updated_at = NOW()");
  
  //     if (fields.length === 1) {
  //       throw new Error("No valid fields provided for update");
  //     }
  
  //     const query = `
  //       UPDATE emp_cars 
  //       SET ${fields.join(", ")} 
  //       WHERE emp_id = ?
  //     `;
  //     values.push(empId);
  
  //     const [result] = await db.execute(query, values);
  //     return result;
  //   } catch (error) {
  //     console.error("Error updating emp_car:", error);
  //     throw new Error("Failed to update emp_car");
  //   }
  // }

  static async update_emp_car(
    empId: number,
    empCar: Partial<Pick<EmpCar, "car_brand" | "model" | "license_plate">> & { car_image?: string }
  ) {
    try {
      // First, check if emp_cars record exists for this emp_id
      const [rows]: any[] = await db.execute(
        "SELECT id FROM emp_cars WHERE emp_id = ?",
        [empId]
      );
  
      if (!rows || rows.length === 0) {
        throw new Error(`emp_car with emp_id ${empId} does not exist`);
      }
  
      // Build the dynamic SET clause
      const fields: string[] = [];
      const values: any[] = [];
  
      if (empCar.car_brand !== undefined) {
        fields.push("car_brand = ?");
        values.push(empCar.car_brand);
      }
  
      if (empCar.model !== undefined) {
        fields.push("model = ?");
        values.push(empCar.model);
      }
  
      if (empCar.license_plate !== undefined) {
        fields.push("license_plate = ?");
        values.push(empCar.license_plate);
      }
  
      if (empCar.car_image !== undefined) {
        fields.push("car_image = ?");
        values.push(empCar.car_image);
      }
  
      // Always update updated_at
      fields.push("updated_at = NOW()");
  
      if (fields.length === 1) {
        throw new Error("No valid fields provided for update");
      }
  
      const query = `
        UPDATE emp_cars 
        SET ${fields.join(", ")} 
        WHERE emp_id = ?
      `;
      values.push(empId);
  
      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error updating emp_car:", error);
      throw error; // Let controller handle message and status
    }
  }

  static async update_employee_car_image(id: number, cloudinaryUrl: string) {
    try {
      // Check if the employee's car exists before updating
      const checkQuery = "SELECT id FROM emp_cars WHERE id = ?";
      const [rows]: any[] = await db.execute(checkQuery, [id]);

      if (rows.length === 0) {
        console.log("car_image car not found with ID:", id);
        return { success: false, message: "car_image car not found" };
      }

      const query = `UPDATE emp_cars SET car_image = ? WHERE id = ?`;
      const values = [cloudinaryUrl, id];

      const [updateResult]: any[] = await db.execute(query, values);
      const affectedRows = updateResult.affectedRows;

      if (affectedRows === 0) {
        return { success: false, message: "Failed to update car avatar" };
      }

      console.log("Employee car avatar updated successfully for ID:", id);
      return { success: true, message: "Car avatar updated successfully" };
    } catch (error) {
      console.error("Error updating employee car avatar:", error);
      throw new Error("Failed to update employee car avatar");
    }
  }

  // Delete EmpCar
  static async delete_emp_car(id: number) {
    try {
      const query = 'DELETE FROM emp_cars WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      return result;  // Return the result of the deletion
    } catch (error) {
      console.error("Error deleting emp_car:", error);
      throw new Error("Failed to delete emp_car");
    }
  }
}
