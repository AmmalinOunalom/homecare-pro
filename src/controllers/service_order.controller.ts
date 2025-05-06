import { Request, Response } from "express";
import { service_order_model } from "../model/service_order.model";

/**
 * Create a new service order
 */
export const create_service_order = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    await service_order_model.create_service_order(orderData);
    res.status(201).send("Service order created successfully");
  } catch (error) {
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
