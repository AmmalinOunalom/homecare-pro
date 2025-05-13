import { Request, Response } from "express";
import { service_order_model } from "../model/service_order.model";
import { employees_model } from "../model/employees.model";
import { user_model } from "../model/user.model";
import { address_users_details_model } from "../model/address_users_details.model"
import twilio from "twilio";

const twilio_account = process.env.TWILIO_ACCOUNT_SID
const twilio_auth = process.env.TWILIO_AUTH_TOKEN
const twilio_phone = process.env.TWILIO_PHONE_NUMBER

const client = twilio(twilio_account, twilio_auth);

/**
 * Create a new service order
 */
export const create_service_order = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderData = req.body;

    await service_order_model.create_service_order(orderData);

    const emp_number = await employees_model.get_employee_phone_number(orderData.employees_id);
    if (!emp_number) {
      res.status(404).send("Employee phone number not found");
      return;
    }

    const user_info = await user_model.get_user_by_id(orderData.user_id);
    if (!user_info) {
      res.status(404).send("User not found");
      return;
    }

    const user_number = user_info.tel;
    if (!user_number) {
      res.status(404).send("User phone number not found");
      return;
    }

    // ✅ Get full address info
    const address = await address_users_details_model.get_address_by_user_id(orderData.user_id);
    if (!address) {
      res.status(404).send("Address not found");
      return;
    }

    const { address_description, village, address_name, google_link_map } = address;

    const formattedNumber = emp_number.startsWith("+")
      ? emp_number
      : "+856" + emp_number.slice(1);

    try {
      await client.messages.create({
        body:
          `ສະບາຍດີ, ນີ້ແມ່ນການເອີ້ນໃຊ້ບໍລິການຈາກ Homecare ໂດຍມີຂໍ້ມູນດັ່ງນີ້:\n` +
          ` ເບີໂທຜູ້ໃຊ້ບໍລິການ: ${user_number}\n` +
          `ຊື່ສະຖານທີ່: ${address_name}\n` +
          `ບ້ານ: ${village}\n` +
          `ລາຍລະອຽດ: ${address_description}\n` +
          `ແຜນທີ່: ${google_link_map}`,
        from: 'whatsapp:' + twilio_phone,
        to: 'whatsapp:' + formattedNumber,
      });

      res.status(201).send("Service order and SMS sent successfully");
    } catch (smsError) {
      console.error("Error sending SMS:", smsError);
      res.status(500).send("Service order created, but failed to send SMS");
    }
  } catch (error) {
    console.error("Service order creation error:", error);
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

/*
* Show service Order with token
*/
export const get_my_service_order = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;  // Use req.user.id instead of user_id

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Call the model function to get address details by user ID
    const address = await service_order_model.show_service_order_by_user_id(userId);
    res.json(address);
  } catch (error) {
    console.error("Error fetching user address:", error);
    res.status(500).json({ message: "Failed to fetch address" });
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



