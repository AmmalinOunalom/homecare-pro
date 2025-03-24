import { Request, Response } from "express";
import { address_users_details_model } from "../model/address_users_details.model";
import db from "../config/base.database";

/**
 * Create a new address user detail
 */
// export const create_address_user_details = async (req: Request, res: Response) => {
//   try {
//     const addressUserData = req.body;

//     console.log("Inserting address user details", addressUserData);
//     const addressUser = await address_users_details_model.create_address_user_details(addressUserData);
//     console.log("Address user created", addressUser);
    
//     const addressUsersDetailId = addressUser.insertId;
//     const usersId = addressUserData.users_id;
    
//     const updateQuery = `
//       UPDATE users 
//       SET address_users_detail_id = ? 
//       WHERE id = ?
//     `;
    
//     console.log("Executing update query", updateQuery, [addressUsersDetailId, usersId]);
//     await db.execute(updateQuery, [addressUsersDetailId, usersId]);
  
//     res.status(201).send("Address user detail created successfully and users table updated.");
//   } catch (error) {
//     console.error("Error occurred:", error);
//     res.status(500).send("Failed to create address user detail");
//   }
// };

export const create_address_user_details = async (req: Request, res: Response) => {
  try {
    const addressUserData = req.body;
    const usersId = addressUserData.users_id;

    console.log("Inserting address user details", addressUserData);
    const addressUser = await address_users_details_model.create_address_user_details(addressUserData);
    console.log("Address user created", addressUser);
    
    const addressUsersDetailId = addressUser.insertId;

    // Fetch all address_user_details for this user
    const [existingAddresses]: any = await db.execute(
      `SELECT id FROM address_users_details WHERE users_id = ?`, 
      [usersId]
    );

    console.log("Existing addresses for user:", existingAddresses);

    // Determine which address to save in the users table (choose the latest created one)
    const validAddressIds = existingAddresses.map((record: any) => record.id);
    const addressToSave = validAddressIds.includes(addressUsersDetailId) 
      ? addressUsersDetailId 
      : validAddressIds[0]; // Pick the first valid address if needed

    console.log(`Saving address_users_detail_id ${addressToSave} for user ${usersId}`);

    const updateQuery = `UPDATE users SET address_users_detail_id = ? WHERE id = ?`;
    await db.execute(updateQuery, [addressToSave, usersId]);

    res.status(201).send("Address user detail created successfully and users table updated.");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Failed to create address user detail");
  }
};

export const show_by_user_id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Received userId:", id);  // Log to ensure the request is reaching the controller

    const addressUserDetails = await address_users_details_model.show_by_user_id(Number(id));
    console.log("Address User Details:", addressUserDetails);  // Log the result returned by the model

    if (addressUserDetails) {
      res.status(200).send(addressUserDetails);
    } else {
      res.status(404).send("Address user details not found for this user");
    }
  } catch (error) {
    console.error("Error fetching address user details by userId:", error);
    res.status(500).send("Failed to fetch address user details");
  }
  
};


/**
 * Retrieve all address user details
 */
export const show_all_address_users_details = async (req: Request, res: Response) => {
  try {
    const addressUsers = await address_users_details_model.show_all_address_users_details();
    res.status(200).send(addressUsers);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Update an address user detail
 */
export const update_address_user_details = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedAddressUser = await address_users_details_model.update_address_user_details(Number(id), req.body);
    if (updatedAddressUser) {
      res.status(200).send("Address user detail updated successfully");
    } else {
      res.status(404).send("Address user detail not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update address user detail");
  }
};

/**
 * Delete an address user detail
 */
export const delete_address_user_details = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedAddressUser = await address_users_details_model.delete_address_user_details(Number(id));
    if (deletedAddressUser) {
      res.status(200).send("Address user detail deleted successfully");
    } else {
      res.status(404).send("Address user detail not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete address user detail");
  }
};