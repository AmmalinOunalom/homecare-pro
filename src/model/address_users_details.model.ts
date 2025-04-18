import db from "../config/base.database";

// Enum for Gender
enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}

// AddressUserDetails Interface
export interface AddressUserDetails {
    id: number;               // Auto-increment ID
    users_id: number;         // Foreign key to users table
    gender_owner: Gender;     // Gender of the owner
    address_name: string;     // User's address
    address_description: string;
    city: "CHANTHABULY" | "SIKHOTTABONG" | "XAYSETHA" | "SISATTANAK" | "NAXAITHONG" | "XAYTANY" | "HADXAIFONG"; // ENUM
    tel: string;
    house_image: string;      // URL or path to house image
    google_link_map: string;  // Google Maps link
    created_at: Date;         // Timestamp when the address was created
    updated_at: Date;         // Timestamp when the address was last updated
    address_users_detail_id?: number;
}

export class address_users_details_model {
    // Create Address User Details and return the new ID
    // static async create_address_user_details(
    //     addressUser: Omit<AddressUserDetails, "id" | "created_at" | "updated_at">
    // ) {
    //     try {
    //         // Ensure that undefined values are converted to null
    //         const values = [
    //             addressUser.users_id || null,
    //             addressUser.gender_owner || null,
    //             addressUser.address_name || null,
    //             addressUser.house_image || null,
    //             addressUser.google_link_map || null,
    //             addressUser.address_description || null, // New field
    //             addressUser.city || null, // New field
    //             addressUser.tel || null // New field
    //         ];

    //         const query = `
    //             INSERT INTO address_users_detail 
    //             (users_id, gender_owner, address_name, house_image, google_link_map, address_description, city, tel)
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    //         `;

    //         // Execute the query with the sanitized values
    //         const [result]: any = await db.execute(query, values);

    //         // Return the result of the insertion
    //         return result;
    //     } catch (error: unknown) {
    //         console.error("Error inserting address_users_detail:", error);
    //         throw new Error("Failed to create address_users_detail");
    //     }
    // }

    static async create_address_user_details(
        addressUser: Omit<AddressUserDetails, "id" | "created_at" | "updated_at">
    ) {
        try {
            // Ensure that undefined values are converted to null
            const values = [
                addressUser.users_id || null,
                addressUser.gender_owner || null,
                addressUser.address_name || null,
                addressUser.house_image || null,
                addressUser.google_link_map || null,
                addressUser.address_description || null, // New field
                addressUser.city || null, // New field
                addressUser.tel || null // New field
            ];
    
            const query = `
                INSERT INTO address_users_detail 
                (users_id, gender_owner, address_name, house_image, google_link_map, address_description, city, tel)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
    
            // Insert into address_users_detail table
            const [result]: any = await db.execute(query, values);
    
            // Check if insertion was successful
            if (!result.insertId) {
                throw new Error("Failed to retrieve insertId after inserting address");
            }
    
            const addressUsersDetailId = result.insertId;
            console.log("New Address ID:", addressUsersDetailId);
    
            // Update users table with the new address ID
            const updateQuery = `UPDATE users SET address_users_detail_id = ? WHERE id = ?`;
            const [updateResult]: any = await db.execute(updateQuery, [addressUsersDetailId, addressUser.users_id]);
    
            console.log("Update Query Result:", updateResult);
    
            if (updateResult.affectedRows === 0) {
                throw new Error(`User ID ${addressUser.users_id} not found or update failed.`);
            }
    
            return { insertId: addressUsersDetailId };
        } catch (error: unknown) {
            console.error("Error inserting address_users_detail:", error);
            throw new Error("Failed to create address_users_detail and update users table");
        }
    }


    //UPLOAD HOUSE IMAGE

    static async update_house_image(addressId: number, cloudinaryUrl: string) {
        try {
            // Update the house image for the specific addressId
            const query = `
            UPDATE address_users_detail 
            SET house_image = ? 
            WHERE id = ?;
          `;

            const [result]: any[] = await db.execute(query, [cloudinaryUrl, addressId]);

            // Check if any rows were affected
            if (result.affectedRows === 0) {
                return { success: false, message: "House image not found or update failed" };
            }

            return { success: true, message: "House image updated successfully" };
        } catch (error) {
            console.error("Error updating house image:", error);
            return { success: false, message: "Failed to update house image" };
        }
    }

    //SELECT USER BY ID

    static async show_address_by_user_id(userId: number) {
        try {
            const query = `
                SELECT 
                    u.id, 
                    u.username, 
                    COALESCE(GROUP_CONCAT(a.id), '') AS address_users_detail_id
                FROM users u
                LEFT JOIN address_users_detail a ON u.id = a.users_id
                WHERE u.id = ?
                GROUP BY u.id, u.username;

            `;

            const result = await db.execute(query, [userId]); // Get query result directly

            if (result && result.length > 0) {
                return result[0]; // Return the first row of the result if it exists
            } else {
                throw new Error("No user found with the given ID");
            }
        } catch (error) {
            console.error("Error fetching address details:", error);
            throw new Error("Failed to fetch address details for the user");
        }
    }


    // Show All Address Users Details
    static async show_all_address_users_details() {
        try {
            const query = "SELECT * FROM address_users_detail";
            const [rows] = await db.execute(query);
            return rows;  // Returning the fetched address users details
        } catch (error) {
            console.error("Error fetching address_users_details:", error);
            throw new Error("Failed to fetch address_users_details");
        }
    }

    // Update Address User Details
    static async update_address_user_details(
        id: number,
        addressUser: Omit<AddressUserDetails, "id" | "created_at" | "updated_at">
    ) {
        try {
            const query = `
                UPDATE address_users_detail 
                SET 
                    users_id = ?, 
                    gender_owner = ?, 
                    address_name = ?, 
                    house_image = ?, 
                    google_link_map = ?, 
                    address_description = ?, 
                    city = ?, 
                    tel = ?, 
                    updated_at = NOW() 
                WHERE id = ?
            `;
    
            const values = [
                addressUser.users_id,
                addressUser.gender_owner,
                addressUser.address_name,
                addressUser.house_image,
                addressUser.google_link_map,
                addressUser.address_description,
                addressUser.city,
                addressUser.tel,
                id
            ];
    
            const [result] = await db.execute(query, values);
            return result; // Return the result to indicate update status
        } catch (error) {
            console.error("Error updating address_users_details:", error);
            throw new Error("Failed to update address_users_details");
        }
    }

    // Delete Address User Details
    static async delete_address_user_details(id: number) {
        try {
            const query = "DELETE FROM address_users_detail WHERE id = ?";
            const [result] = await db.execute(query, [id]);
            return result;  // Return the result of the deletion
        } catch (error) {
            console.error("Error deleting address_users_details:", error);
            throw new Error("Failed to delete address_users_details");
        }
    }
}
