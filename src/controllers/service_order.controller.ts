import { NextFunction, Request, Response } from "express";
import { service_order_model } from "../model/service_order.model";
import db from "../config/base.database";

/**
 * Create a new service order
 */
export const create_service_order = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { user_id, employees_id, cat_id, address_users_detail_id, amount, payment_status } = req.body;

  try {
    // Log the incoming request body
    console.log("Received service order data:", req.body);

    // Check if user_id exists in the users table
    console.log(`Checking if user_id ${user_id} exists in the users table...`);
    const [userExists]: any = await db.execute(
      `SELECT id FROM users WHERE id = ?`,
      [user_id]
    );
    if (!userExists.length) {
      console.log(`User ID ${user_id} does not exist.`);
      res.status(400).json({ error: "User ID does not exist" });
      return;  // Return early to avoid proceeding
    }

    // Check if employees_id exists in the employees table
    console.log(`Checking if employees_id ${employees_id} exists in the employees table...`);
    const [employeeExists]: any = await db.execute(
      `SELECT id FROM employees WHERE id = ?`,
      [employees_id]
    );
    if (!employeeExists.length) {
      console.log(`Employee ID ${employees_id} does not exist.`);
      res.status(400).json({ error: "Employee ID does not exist" });
      return;
    }

    // Check if category ID exists in the categories table
    console.log(`Checking if category_id ${cat_id} exists in the categories table...`);
    const [categoryExists]: any = await db.execute(
      `SELECT id FROM categories WHERE id = ?`,
      [cat_id]
    );
    if (!categoryExists.length) {
      console.log(`Category ID ${cat_id} does not exist.`);
      res.status(400).json({ error: "Category ID does not exist" });
      return;
    }

    // Check if address_users_detail_id exists in the address_users_detail table
    console.log(`Checking if address_users_detail_id ${address_users_detail_id} exists...`);
    const [addressExists]: any = await db.execute(
      `SELECT id FROM address_users_detail WHERE id = ?`,
      [address_users_detail_id]
    );
    if (!addressExists.length) {
      console.log(`Address ID ${address_users_detail_id} does not exist.`);
      res.status(400).json({ error: "Address ID does not exist" });
      return;
    }

    // If all the validations pass, create the service order
    const orderData = {
      user_id,
      employees_id,
      cat_id,
      address_users_detail_id,
      amount,
      payment_status
    };

    console.log("Creating the service order with data:", orderData);

    // Call the function to create the service order in the database
    await service_order_model.create_service_order(orderData);

    // Log success
    console.log("Service order created successfully.");

    // Return success response with the created service order
    res.status(201).send("Service order created successfully");
  } catch (error) {
    // Log the error and handle any unexpected errors
    console.error("Error occurred while creating service order:", error);
    res.status(500).send("Failed to create service order");
  }
};


/**
 * Retrieve all service orders
 */
export const show_all_service_orders = async (req: Request, res: Response) => {
  try {
    const orders = await service_order_model.show_all_service_orders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Retrieve a service order by ID
 */
export const show_service_order_by_id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await service_order_model.show_service_order_by_id(Number(id));
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).send("Service order not found");
    }
  } catch (error) {
    res.status(500).send("Failed to fetch service order");
  }
};

/**
 * Update a service order
 */
export const update_service_order = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOrder = await service_order_model.update_service_order(Number(id), req.body);
    if (updatedOrder) {
      res.status(200).send("Service order updated successfully");
    } else {
      res.status(404).send("Service order not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update service order");
  }
};

/**
 * Delete a service order
 */
export const delete_service_order = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedOrder = await service_order_model.delete_service_order(Number(id));
    if (deletedOrder) {
      res.status(200).send("Service order deleted successfully");
    } else {
      res.status(404).send("Service order not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete service order");
  }
};
