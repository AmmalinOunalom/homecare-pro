import { Request, Response } from 'express';
import { sendSMS } from '../middleware/sms.utils';
import { employees_model } from '../model/employees.model';
import { address_users_details_model } from '../model/address_users_details.model';

export const sendSmsToEmployee = async (req: Request, res: Response): Promise<void> => {
  let { to: employeePhone } = req.body;
  const address_id = req.params.id;

  const parsedAddressId = Number(address_id);
  if (!address_id || isNaN(parsedAddressId) || parsedAddressId <= 0) {
    res.status(400).json({ error: 'Invalid or missing address_id' });
    return;
  }

  if (!employeePhone || typeof employeePhone !== 'string') {
    res.status(400).json({ error: 'Invalid or missing employee phone number (to)' });
    return;
  }

  if (!employeePhone.startsWith('+856')) {
    employeePhone = '+856' + employeePhone;
  }

  const phoneRegex = /^\+85620\d{7,8}$/;
  if (!phoneRegex.test(employeePhone)) {
    res.status(400).json({ error: 'Invalid employee phone number format' });
    return;
  }

  try {
    const employee = await employees_model.get_employee_by_phone(employeePhone);
    if (!employee) {
      res.status(404).json({ error: 'Employee phone number not found' });
      return;
    }

    const serviceDetails = await address_users_details_model.get_address_users_by_id(parsedAddressId);

    if (!serviceDetails) {
      res.status(404).json({ error: 'No address details found for this address_id' });
      return;
    }

    const { contact, locationName, villageName, details, mapLink } = serviceDetails;

    const message = `ສະບາຍດີ, ນີ້ແມ່ນການເອີ້ນໃຊ້ບໍລິການຈາກ Homecare ໂດຍມີຂໍ້ມູນດັ່ງນີ້:
ເບີໂທຜູ້ໃຊ້ບໍລິການ: ${contact}
ຊື່ສະຖານທີ່: ${locationName}
ບ້ານ: ${villageName}
ລາຍລະອຽດ: ${details}
ແຜນທີ່: ${mapLink}`;

    const sid = await sendSMS(employeePhone, message);

    res.status(200).json({
      message: 'WhatsApp message sent successfully',
      sid,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Failed to send WhatsApp message',
    });
  }
};
