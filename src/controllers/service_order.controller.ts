import { Request, Response } from "express";
import { service_order_model, ServiceOrder, PaymentStatus, ServiceStatus  } from "../model/service_order.model";
import { employees_model } from "../model/employees.model";
import { user_model } from "../model/user.model";
import { sendSMS } from '../middleware/sms.utils';
import { address_users_details_model } from "../model/address_users_details.model";
import twilio from "twilio";
import db from "../config/base.database";
import { categories_model } from "../model/categories.model";


const twilio_account = process.env.TWILIO_ACCOUNT_SID!;
const twilio_auth = process.env.TWILIO_AUTH_TOKEN!;
const twilio_phone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(twilio_account, twilio_auth);


/**
 * Create a new service order
 */
// export const create_service_order = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const {
//       user_id,
//       employees_id,
//       cat_id,
//       address_users_detail_id,
//       amount,
//       service_status,
//       payment_status
//     } = req.body;

//     // Basic validation
//     if (
//       user_id === undefined ||
//       employees_id === undefined ||
//       cat_id === undefined ||
//       address_users_detail_id === undefined ||
//       amount === undefined ||
//       !service_status ||
//       !payment_status
//     ) {
//       res.status(400).json({ message: "Missing required fields" });
//       return;
//     }

//     const order: Omit<ServiceOrder, "id" | "created_at" | "updated_at"> = {
//       user_id,
//       employees_id,
//       cat_id,
//       address_users_detail_id,
//       amount,
//       service_status,
//       payment_status
//     };

//     const result = await service_order_model.create_service_order(order);
//     res.status(201).json({ message: "Service order created successfully", result });
//   } catch (error) {
//     console.error("Error creating service order:", error);
//     res.status(500).json({ message: "Failed to create service order" });
//   }
// };
export const create_service_order = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      user_id,
      employees_id,
      address_users_detail_id,
      amount,
      service_status,
      payment_status
    } = req.body;

    // Basic validation
    if (
      user_id === undefined ||
      employees_id === undefined ||
      address_users_detail_id === undefined ||
      amount === undefined ||
      !service_status ||
      !payment_status
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // 🔍 Fetch cat_id for the employee
    const [rows]: any = await db.execute(
      `SELECT cat_id FROM employees WHERE id = ?`,
      [employees_id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    const cat_id = rows[0].cat_id;

    const order: Omit<ServiceOrder, "id" | "created_at" | "updated_at"> = {
      user_id,
      employees_id,
      cat_id,
      address_users_detail_id,
      amount,
      service_status,
      payment_status
    };

    const result = await service_order_model.create_service_order(order);
    res.status(201).json({ message: "Service order created successfully", result });
  } catch (error) {
    console.error("Error creating service order:", error);
    res.status(500).json({ message: "Failed to create service order" });
  }
};

// export const send_sms_to_employee = async (req: Request, res: Response): Promise<void> => {
//   let { to: employeePhone } = req.body;
//   const address_id = req.params.id;

//   const parsedAddressId = Number(address_id);
//   if (!address_id || isNaN(parsedAddressId) || parsedAddressId <= 0) {
//     res.status(400).json({ error: 'Invalid or missing address_id' });
//     return;
//   }

//   if (!employeePhone || typeof employeePhone !== 'string') {
//     res.status(400).json({ error: 'Invalid or missing employee phone number (to)' });
//     return;
//   }

//   if (!employeePhone.startsWith('+856')) {
//     employeePhone = '+856' + employeePhone;
//   }

//   const phoneRegex = /^\+85620\d{7,8}$/;
//   if (!phoneRegex.test(employeePhone)) {
//     res.status(400).json({ error: 'Invalid employee phone number format' });
//     return;
//   }

//   try {
//     const employee = await employees_model.get_employee_by_phone(employeePhone);
//     if (!employee) {
//       res.status(404).json({ error: 'Employee phone number not found' });
//       return;
//     }

//     const serviceDetails = await address_users_details_model.get_address_users_by_id(parsedAddressId);
//     if (!serviceDetails) {
//       res.status(404).json({ error: 'No address details found for this address_id' });
//       return;
//     }

//     const { contact, locationName, villageName, details, mapLink, user_id } = serviceDetails;

//     const message = `ສະບາຍດີ, ນີ້ແມ່ນການເອີ້ນໃຊ້ບໍລິການຈາກ Homecare ໂດຍມີຂໍ້ມູນດັ່ງນີ້:
// ເບີໂທຜູ້ໃຊ້ບໍລິການ: ${contact}
// ຊື່ສະຖານທີ່: ${locationName}
// ບ້ານ: ${villageName}
// ລາຍລະອຽດ: ${details}
// ແຜນທີ່: ${mapLink}`;

//     // Send WhatsApp message
//     const sid = await sendSMS(employeePhone, message);

//     // Use employee's category and price for order
//     const cat_id = employee.cat_id ?? null;
//     const amount = employee.price ?? 0;

//     const orderData = {
//       user_id,
//       employees_id: employee.id,
//       cat_id,
//       address_users_detail_id: parsedAddressId,
//       amount,
//       service_status: ServiceStatus.NotStart,
//       payment_status: PaymentStatus.Paid,
//     };

//     const createdOrder = await service_order_model.create_service_order(orderData);

//     res.status(200).json({
//       message: 'WhatsApp message sent and service order created successfully',
//       sid,
//       service_order: createdOrder,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       error: error.message || 'Failed to send WhatsApp message or create service order',
//     });
//   }
// };

export const send_sms_to_employee = async (req: Request, res: Response): Promise<void> => {
  let { employee_phone, service_status, payment_status } = req.body;
  const address_id = req.params.id;

  const parsedAddressId = Number(address_id);
  if (!address_id || isNaN(parsedAddressId) || parsedAddressId <= 0) {
    res.status(400).json({ error: 'Invalid or missing address_id' });
    return;
  }

  if (!employee_phone || typeof employee_phone !== 'string') {
    res.status(400).json({ error: 'Invalid or missing employee_phone' });
    return;
  }

  // Normalize phone format
  if (!employee_phone.startsWith('+856')) {
    employee_phone = '+856' + employee_phone;
  }

  const phoneRegex = /^\+85620\d{7,8}$/;
  if (!phoneRegex.test(employee_phone)) {
    res.status(400).json({ error: 'Invalid employee_phone format' });
    return;
  }

  // Validate statuses
  const validServiceStatuses = ['Not Start','Arrived','In Progress','Finished'];
  const validPaymentStatuses = ['not paid','paid'];

  if (!validServiceStatuses.includes(service_status)) {
    res.status(400).json({ error: 'Invalid service_status value' });
    return;
  }

  if (!validPaymentStatuses.includes(payment_status)) {
    res.status(400).json({ error: 'Invalid payment_status value' });
    return;
  }

  try {
    const employee = await employees_model.get_employee_by_phone(employee_phone);
    if (!employee) {
      res.status(404).json({ error: 'Employee phone number not found' });
      return;
    }

    const serviceDetails = await address_users_details_model.get_address_users_by_id(parsedAddressId);
    if (!serviceDetails) {
      res.status(404).json({ error: 'No address details found for this address_id' });
      return;
    }

    const { contact, locationName, villageName, details, city, mapLink, user_id } = serviceDetails;

    const message = `ສະບາຍດີ, ນີ້ແມ່ນການເອີ້ນໃຊ້ບໍລິການຈາກ Homecare ໂດຍມີຂໍ້ມູນດັ່ງນີ້:
ເບີໂທຜູ້ໃຊ້ບໍລິການ: ${contact}
ຊື່ສະຖານທີ່: ${locationName}
ບ້ານ: ${villageName}
ເມືອງ : ${city}
ລາຍລະອຽດ: ${details}
ແຜນທີ່: ${mapLink}`;

    const sid = await sendSMS(employee_phone, message);

    const cat_id = employee.cat_id ?? null;
    const amount = employee.price ?? 0;

    const orderData = {
      user_id,
      employees_id: employee.id,
      cat_id,
      address_users_detail_id: parsedAddressId,
      amount,
      service_status,
      payment_status,
    };

    const createdOrder = await service_order_model.create_service_order(orderData);

    res.status(201).json({
      message: 'WhatsApp message sent and service order created successfully',
      sid,
      service_order: createdOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Failed to send WhatsApp message or create service order',
    });
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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const orders = await service_order_model.show_service_order_by_user_id(userId);

    res.status(200).json({ data: orders }); // ✅ Wrap in `data` to return an array
  } catch (error) {
    console.error("Error fetching user service orders:", error);
    res.status(500).json({ message: "Failed to fetch service orders" });
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



