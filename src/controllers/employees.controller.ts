import { Request, Response } from "express";
import { employees_model } from "../model/employees.model";
import bcrypt from "bcrypt";

/**
 * Create a new employee
 */
export const create_employees = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    // Hash the password before saving
    const saltRounds = 10;
    req.body.password = await bcrypt.hash(password, saltRounds);

    const employee = await employees_model.create_employees(req.body); // Now the password is hashed
    res.status(200).send("Employee created successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Retrieve all employees
 */
export const show_all_employees = async (req: Request, res: Response) => {
  try {
    const employees = await employees_model.show_all_employees();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Update an employee
 */
export const update_employees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await employees_model.update_employees(Number(id), req.body);
    res.status(200).send("Employee updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update employee");
  }
};

/**
 * Delete an employee (Soft Delete)
 */
export const delete_employees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await employees_model.delete_employees(Number(id));
    res.status(200).send("Employee deleted successfully");
  } catch (error) {
    res.status(500).send("Failed to delete employee");
  }
};
