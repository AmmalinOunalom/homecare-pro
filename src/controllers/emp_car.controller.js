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
exports.delete_emp_car = exports.update_emp_car = exports.show_all_emp_cars = exports.create_emp_car = void 0;
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
