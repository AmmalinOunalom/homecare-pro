import db from "../config/base.database";

enum PaymentStatus {
    Arrived = "arrived",
    Finished = "finished"
}

// Service Order Interface
export interface ServiceOrder {
    id?: number;                     // Auto-increment ID (optional for creation)
    user_id: number;                  // Foreign key referencing users
    employees_id: number;             // Foreign key referencing employees
    cat_id: number;                   // Foreign key referencing categories
    address_users_detail_id: number;  // Foreign key referencing address details
    amount: number;                   // Order amount
    payment_status: PaymentStatus;    // Payment status (arrived/finished)
    created_at?: Date;                // Timestamp when created
    updated_at?: Date;                // Timestamp when last updated
}

export class service_order_model {
    // Create a new service order
    static async create_service_order(order: Omit<ServiceOrder, "id" | "created_at" | "updated_at">) {
        try {
            const query = `
                INSERT INTO service_order 
                (user_id, employees_id, cat_id, address_users_detail_id, amount, payment_status) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const values = [
                order.user_id,
                order.employees_id,
                order.cat_id,
                order.address_users_detail_id,
                order.amount,
                order.payment_status
            ];

            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Error creating service order:", error);
            throw new Error("Failed to create service order");
        }
    }

    // Show all service orders
    static async show_all_service_orders() {
        try {
            const query = 'SELECT * FROM service_order';
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            console.error("Error fetching service orders:", error);
            throw new Error("Failed to fetch service orders");
        }
    }

    // Show service order by ID
    static async show_service_order_by_id(id: number) {
        try {
            const query = 'SELECT * FROM service_order WHERE id = ?';
            const [rows]: any = await db.execute(query, [id]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                throw new Error("Service order not found");
            }
        } catch (error) {
            console.error("Error fetching service order:", error);
            throw new Error("Failed to fetch service order");
        }
    }

    // Update service order
    static async update_service_order(id: number, order: Omit<ServiceOrder, "id" | "created_at" | "updated_at">) {
        try {
            const query = `
                UPDATE service_orders 
                SET user_id = ?, employees_id = ?, cat_id = ?, address_users_detail_id = ?, 
                    amount = ?, payment_status = ?, updated_at = NOW() 
                WHERE id = ?
            `;

            const values = [
                order.user_id,
                order.employees_id,
                order.cat_id,
                order.address_users_detail_id,
                order.amount,
                order.payment_status,
                id
            ];

            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Error updating service order:", error);
            throw new Error("Failed to update service order");
        }
    }

    // Delete service order
    static async delete_service_order(id: number) {
        try {
            const query = 'DELETE FROM service_order WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result;
        } catch (error) {
            console.error("Error deleting service order:", error);
            throw new Error("Failed to delete service order");
        }
    }
}
