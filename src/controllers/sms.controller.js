"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsToEmployee = void 0;
const sms_utils_1 = require("../middleware/sms.utils");
const employees_model_1 = require("../model/employees.model");
const address_users_details_model_1 = require("../model/address_users_details.model");
const sendSmsToEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const employee = yield employees_model_1.employees_model.get_employee_by_phone(employeePhone);
        if (!employee) {
            res.status(404).json({ error: 'Employee phone number not found' });
            return;
        }
        const serviceDetails = yield address_users_details_model_1.address_users_details_model.get_address_users_by_id(parsedAddressId);
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
        const sid = yield (0, sms_utils_1.sendSMS)(employeePhone, message);
        res.status(200).json({
            message: 'WhatsApp message sent successfully',
            sid,
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message || 'Failed to send WhatsApp message',
        });
    }
});
exports.sendSmsToEmployee = sendSmsToEmployee;
