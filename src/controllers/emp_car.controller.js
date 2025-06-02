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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_emp_car = exports.get_emp_car_by_id = exports.upload_car_image = exports.update_emp_car = exports.show_all_emp_cars = exports.create_emp_car = void 0;
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const emp_cars_model_1 = require("../model/emp_cars.model");
/**
 * Create a new emp_car
 */
// export const create_emp_car = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const empCarData = req.body;
//     let carImageUrl: string | null = null;
//     // Handle car image upload if file exists
//     if (req.file && req.file.path) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: 'car_images', // Store the image in this folder on Cloudinary
//       });
//       if (!result.secure_url) {
//         throw new Error('Cloudinary upload failed');
//       }
//       carImageUrl = result.secure_url;
//       // Remove local file after upload
//       if (fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//     }
//     // Create emp_car entry in database with the uploaded image URL
//     const empCarId = await emp_car_model.create_emp_car({
//       emp_id: empCarData.emp_id,
//       car_brand: empCarData.car_brand,
//       model: empCarData.model,
//       license_plate: empCarData.license_plate,
//       car_image: carImageUrl, // Store the Cloudinary URL of the uploaded image
//     });
//     res.status(201).json({
//       message: 'Employee car created successfully',
//       emp_car_id: empCarId,
//       car_image: carImageUrl, // Return the uploaded image URL
//     });
//   } catch (error) {
//     console.error('Error creating emp_car:', error);
//     res.status(500).json({
//       message: 'Failed to create empCar',
//       error,
//     });
//   }
// };
const create_emp_car = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empCarData = req.body;
        let carImageUrl = null;
        // Check if emp_id already exists
        const existingCar = yield emp_cars_model_1.emp_car_model.get_emp_car_by_emp_id(empCarData.emp_id);
        if (existingCar) {
            res.status(400).json({
                message: `An entry for emp_id ${empCarData.emp_id} already exists.`,
            });
            return; // 💥 STOP execution here
        }
        // Handle car image upload if file exists
        if (req.file && req.file.path) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: 'car_images',
            });
            if (!result.secure_url) {
                throw new Error('Cloudinary upload failed');
            }
            carImageUrl = result.secure_url;
            // Remove local file after upload
            if (fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
            }
        }
        // Create emp_car entry
        const empCarId = yield emp_cars_model_1.emp_car_model.create_emp_car({
            emp_id: empCarData.emp_id,
            car_brand: empCarData.car_brand,
            model: empCarData.model,
            license_plate: empCarData.license_plate,
            car_image: carImageUrl,
        });
        res.status(201).json({
            message: 'Employee car created successfully',
            emp_car_id: empCarId,
            car_image: carImageUrl,
        });
    }
    catch (error) {
        console.error('Error creating emp_car:', error);
        res.status(500).json({
            message: 'Failed to create empCar',
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.create_emp_car = create_emp_car;
/**
 * Retrieve all emp_cars
 */
const show_all_emp_cars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empCars = yield emp_cars_model_1.emp_car_model.show_all_emp_cars();
        res.status(200).send(empCars);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_emp_cars = show_all_emp_cars;
/**
 * Update an emp_car
 */
// export const update_emp_car = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const empCarData = req.body;
//     let carImageUrl: string | null = null;
//     // Handle image upload if a file exists
//     if (req.file && req.file.path) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "car_images",
//       });
//       if (!result.secure_url) {
//         throw new Error("Cloudinary upload failed");
//       }
//       carImageUrl = result.secure_url;
//       // Clean up the uploaded file locally
//       if (fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path); // Delete local file after upload
//       }
//     }
//     // Build update data only from allowed fields
//     const updateData: any = {};
//     if (empCarData.car_brand) {
//       updateData.car_brand = empCarData.car_brand;
//     }
//     if (empCarData.model) {
//       updateData.model = empCarData.model;
//     }
//     if (empCarData.license_plate) {
//       updateData.license_plate = empCarData.license_plate;
//     }
//     if (carImageUrl) {
//       updateData.car_image = carImageUrl;
//     }
//     // Ensure there is something to update
//     if (Object.keys(updateData).length === 0) {
//       res.status(400).json({ message: "No valid fields to update" });
//       return;
//     }
//     // Proceed with the update
//     await emp_car_model.update_emp_car(Number(id), updateData);
//     res.status(200).json({
//       message: "EmpCar updated successfully",
//       emp_car_id: id,
//       updated_fields: updateData,
//     });
//   } catch (error) {
//     console.error("Error updating emp_car:", error);
//     res.status(500).json({
//       message: "Failed to update empCar",
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// };
const update_emp_car = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emp_id } = req.params; // Change 'id' to 'emp_id' here
        const empCarData = req.body;
        let carImageUrl = null;
        // Handle image upload if a file exists
        if (req.file && req.file.path) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "car_images",
            });
            if (!result.secure_url) {
                throw new Error("Cloudinary upload failed");
            }
            carImageUrl = result.secure_url;
            // Clean up the uploaded file locally
            if (fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path); // Delete local file after upload
            }
        }
        // Build update data only from allowed fields
        const updateData = {};
        if (empCarData.car_brand) {
            updateData.car_brand = empCarData.car_brand;
        }
        if (empCarData.model) {
            updateData.model = empCarData.model;
        }
        if (empCarData.license_plate) {
            updateData.license_plate = empCarData.license_plate;
        }
        if (carImageUrl) {
            updateData.car_image = carImageUrl;
        }
        // Ensure there is something to update
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "No valid fields to update" });
            return;
        }
        // Proceed with the update, using emp_id instead of id
        yield emp_cars_model_1.emp_car_model.update_emp_car(Number(emp_id), updateData); // Pass emp_id here
        res.status(200).json({
            message: "EmpCar updated successfully",
            emp_car_id: emp_id, // Use emp_id here as well
            updated_fields: updateData,
        });
    }
    catch (error) {
        console.error("Error updating emp_car:", error);
        res.status(500).json({
            message: "Failed to update empCar",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.update_emp_car = update_emp_car;
const upload_car_image = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received upload request:", req.body);
        if (!req.file) {
            console.log("No file uploaded");
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        console.log("File uploaded:", req.file);
        const empCarId = parseInt(req.body.empCarId, 10);
        if (isNaN(empCarId)) {
            console.log("Invalid empCarId");
            res.status(400).json({ message: "Invalid empCarId" });
            return;
        }
        // Upload file to Cloudinary under a "cars" folder
        const result = yield cloudinary_1.v2.uploader.upload(req.file.path, {
            folder: "cars",
        });
        if (!result.secure_url) {
            res.status(500).json({ message: "Cloudinary upload failed" });
            return;
        }
        console.log("Cloudinary URL:", result.secure_url);
        // Use employees_model to save the car image URL in the database
        yield emp_cars_model_1.emp_car_model.update_employee_car_image(empCarId, result.secure_url);
        // Delete the local file after upload to Cloudinary
        fs_1.default.unlinkSync(req.file.path);
        res.status(200).json({
            message: "Car image uploaded and updated successfully",
            fileUrl: result.secure_url,
        });
    }
    catch (error) {
        console.error("Error uploading car image:", error);
        res.status(500).json({ message: "Error uploading car image", error });
    }
});
exports.upload_car_image = upload_car_image;
const get_emp_car_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log("Received empCarId:", id);
        const empCarDetails = yield emp_cars_model_1.emp_car_model.get_emp_car_by_id(Number(id));
        console.log("EmpCar Details:", empCarDetails);
        if (empCarDetails) {
            res.status(200).json(empCarDetails);
        }
        else {
            res.status(404).json({ message: "EmpCar details not found for this ID" });
        }
    }
    catch (error) {
        console.error("Error fetching emp_car details by ID:", error);
        res.status(500).json({ message: "Failed to fetch emp_car details" });
    }
});
exports.get_emp_car_by_id = get_emp_car_by_id;
/**
 * Delete an emp_car
 */
const delete_emp_car = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedEmpCar = yield emp_cars_model_1.emp_car_model.delete_emp_car(Number(id));
        if (deletedEmpCar) {
            res.status(200).send("EmpCar deleted successfully");
        }
        else {
            res.status(404).send("EmpCar not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to delete empCar");
    }
});
exports.delete_emp_car = delete_emp_car;
