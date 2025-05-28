import db from "../config/base.database";

enum Status {
    Active = "active",
    Inactive = "inactive"
}

// Comments Interface (Based on your table structure)
export interface Comments {
    id: number;             // Auto-increment ID
    user_id: number;        // Primary key, references the user
    employees_id: number;   // Primary key, references the employee
    message: string;        // Comment message
    rating: number;         // Rating (integer)
    status?: Status;         // Status of the comment (e.g., active/inactive)
    created_at?: Date;       // Timestamp when the comment was created
    updated_at?: Date;       // Timestamp when the comment was last updated
}

export class comments_model {
    // Create Comment
    static async create_comment(comment: Omit<Comments, "id" | "created_at" | "updated_at">) {
        try {
            const query = `INSERT INTO comments (users_id, employees_id, message, rating, status) VALUES (?, ?, ?, ?, ?)`;

            // Ensure status is always valid
            const statusValue = comment.status || Status.Active;

            const values = [comment.user_id, comment.employees_id, comment.message, comment.rating, statusValue];
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            console.error("Error inserting comment:", error);
            throw new Error("Failed to create comment");
        }
    }

    // Show All Comments
    static async show_all_comments() {
        try {
            const query = `SELECT 
            comments.id,
            comments.users_id,
            users.first_name,
            users.last_name,
            comments.employees_id,
            comments.message,
            comments.rating,
            comments.status,
                comments.created_at
            FROM 
            comments
            JOIN 
            users ON comments.users_id = users.id;`;
            const [rows] = await db.execute(query);
            return rows;  // Returning the fetched comments
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw new Error("Failed to fetch comments");
        }
    }

    // Update Comment
    static async update_comment(id: number, comment: Omit<Comments, "id" | "created_at" | "updated_at">) {
        try {
            const query = 'UPDATE comments SET users_id = ?, employees_id = ?, message = ?, rating = ?, status = ?, updated_at = NOW() WHERE id = ?';
            const values = [comment.user_id, comment.employees_id, comment.message, comment.rating, comment.status, id];
            const [result] = await db.execute(query, values);
            return result;  // Return the result to indicate update status
        } catch (error) {
            console.error("Error updating comment:", error);
            throw new Error("Failed to update comment");
        }
    }

    // Delete Comment
    static async delete_comment(id: number) {
        try {
            const query = 'DELETE FROM comments WHERE id = ?';
            const [result] = await db.execute(query, [id]);
            return result;  // Return the result of the deletion
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw new Error("Failed to delete comment");
        }
    }
}
