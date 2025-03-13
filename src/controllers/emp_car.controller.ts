import { Request, Response } from "express";
import { emp_car_model } from "../model/emp_cars.model";

/**
 * Create a new emp_car
 */
export const create_emp_car = async (req: Request, res: Response) => {
  try {
    const empCarData = req.body;
    const empCar = await emp_car_model.create_emp_car(empCarData);
    res.status(201).send("EmpCar created successfully");
  } catch (error) {
    res.status(500).send("Failed to create empCar");
  }
};

/**
 * Retrieve all emp_cars
 */
export const show_all_emp_cars = async (req: Request, res: Response) => {
  try {
    const empCars = await emp_car_model.show_all_emp_cars();
    res.status(200).send(empCars);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Update an emp_car
 */
export const update_emp_car = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEmpCar = await emp_car_model.update_emp_car(Number(id), req.body);
    if (updatedEmpCar) {
      res.status(200).send("EmpCar updated successfully");
    } else {
      res.status(404).send("EmpCar not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update empCar");
  }
};

/**
 * Delete an emp_car
 */
export const delete_emp_car = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEmpCar = await emp_car_model.delete_emp_car(Number(id));
    if (deletedEmpCar) {
      res.status(200).send("EmpCar deleted successfully");
    } else {
      res.status(404).send("EmpCar not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete empCar");
  }
};
