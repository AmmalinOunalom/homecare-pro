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
exports.delete_emp_car = exports.upload_car_image = exports.update_emp_car = exports.show_all_emp_cars = exports.create_emp_car = void 0;
//import cloudinary from '../config/cloudinary.config';  // นำเข้า Cloudinary
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const emp_cars_model_1 = require("../model/emp_cars.model");
/**
 * Create a new emp_car
 */
const create_emp_car = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empCarData = req.body;
        const empCar = yield emp_cars_model_1.emp_car_model.create_emp_car(empCarData);
        res.status(201).send("EmpCar created successfully");
    }
    catch (error) {
        res.status(500).send("Failed to create empCar");
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
const update_emp_car = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedEmpCar = yield emp_cars_model_1.emp_car_model.update_emp_car(Number(id), req.body);
        if (updatedEmpCar) {
            res.status(200).send("EmpCar updated successfully");
        }
        else {
            res.status(404).send("EmpCar not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to update empCar");
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
