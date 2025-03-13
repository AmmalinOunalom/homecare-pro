import db from "../config/base.database";

// EmpCar Interface
export interface EmpCar {
    id: number;             // Auto-increment ID
    emp_id: number;         // Foreign key for employee ID
    car_brand: string;      // Brand of the car
    model: string;          // Model of the car
    license_plate: string;  // License plate of the car
    created_at: Date;       // Date when the car was added
    updated_at: Date;       // Date when the car record was updated
}

export class emp_car_model {
    // Create EmpCar
    static async create_emp_car(empCar: Omit<EmpCar, "id" | "created_at" | "updated_at">) {
        try {
            const query = `INSERT INTO emp_car (emp_id, car_brand, model, license_plate) VALUES (?, ?, ?, ?)`;
            const values = [empCar.emp_id, empCar.car_brand, empCar.model, empCar.license_plate];
            const [result] = await db.execute(query, values);
            return result;  // Returning the result of the insertion
        } catch (error) {
            console.error("Error inserting emp_car:", error);
            throw new Error("Failed to create emp_car");
        }
    }

    // Show All EmpCars
    static async show_all_emp_cars() {
        try {
            const query = 'SELECT * FROM emp_car';
            const [rows] = await db.execute(query);
            return rows;  // Returning the fetched emp_cars
        } catch (error) {
            console.error("Error fetching emp_cars:", error);
            throw new Error("Failed to fetch emp_cars");
        }
    }

    // Update EmpCar
    static async update_emp_car(id: number, empCar: Omit<EmpCar, "id" | "created_at" | "updated_at">) {
        try {
            const query = 'UPDATE emp_car SET emp_id = ?, car_brand = ?, model = ?, license_plate = ?, updated_at = NOW() WHERE id = ?';
            const values = [empCar.emp_id, empCar.car_brand, empCar.model, empCar.license_plate, id];
            const [result] = await db.execute(query, values);
            return result;  // Return the result to indicate update status
        } catch (error) {
            console.error("Error updating emp_car:", error);
            throw new Error("Failed to update emp_car");
        }
    }

    // Delete EmpCar
    static async delete_emp_car(id: number) {
        try {
            const query = 'DELETE FROM emp_car WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result;  // Return the result of the deletion
        } catch (error) {
            console.error("Error deleting emp_car:", error);
            throw new Error("Failed to delete emp_car");
        }
    }
}
