import db from "../config/base.database";

// Categories Interface
export interface Categories {
    id: number;
    cat_name: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export class categories_model {
    // Create Category
    static async create_category(category: Omit<Categories, "id" | "created_at" | "updated_at">) {
        try {
            const query = `INSERT INTO categories (cat_name, status) VALUES (?, ?)`;
            const values = [category.cat_name, category.status];
            const [result] = await db.execute(query, values);
            return result;  // Returning the result of the insertion
        } catch (error) {
            console.error("Error inserting category:", error);
            throw new Error("Failed to create category");
        }
    }

    // Show All Categories
    static async show_all_category() {
        try {
            const query = 'SELECT * FROM categories';
            const [rows] = await db.execute(query);
            return rows;  // Returning the fetched categories
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw new Error("Failed to fetch categories");
        }
    }

    // Update Category
    static async update_category(id: number, category: Omit<Categories, "id" | "created_at" | "updated_at">) {
        try {
            const query = 'UPDATE categories SET cat_name = ?, status = ?, updated_at = NOW() WHERE id = ?';
            const values = [category.cat_name, category.status, id];
            const [result] = await db.execute(query, values);
            return result;  // Return the result to indicate update status
        } catch (error) {
            console.error("Error updating category:", error);
            throw new Error("Failed to update category");
        }
    }

    // Delete Category
    static async delete_category(id: number) {
        try {
            const query = 'DELETE FROM categories WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result;  // Return the result of the deletion
        } catch (error) {
            console.error("Error deleting category:", error);
            throw new Error("Failed to delete category");
        }
    }
}
