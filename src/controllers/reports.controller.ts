import { Request, Response } from "express";
import { reports_model } from "../model/reports.model";

/**
 * Get all service orders reports optionally filtered by date
 */

export const show_all_service_orders_report = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    // Validate page and limit
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    // Build filters object with validation for dates, page, and limit
    const filters = {
      startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
      endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
      page: !isNaN(page) && page > 0 ? page : 1,
      limit: !isNaN(limit) && limit > 0 ? limit : 10,
    };

    // Call the model function to fetch the service orders report
    const orders = await reports_model.show_all_service_order_reports(filters);

    // Return the data as JSON response
    res.status(200).json({
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);  // Logs the error to the console for debugging
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Get all employees reports optionally filtered by date
 */

export const show_all_employees_report = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const filters = {
      startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
      endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
      page: !isNaN(page) && page > 0 ? page : 1,
      limit: !isNaN(limit) && limit > 0 ? limit : 10,
    };

    const data = await reports_model.show_all_employees_reports(filters);

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching employee reports:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Get all comments reports optionally filtered by date
 */

export const show_all_comments_report = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const filters = {
      startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
      endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
      page: !isNaN(page) && page > 0 ? page : 1,
      limit: !isNaN(limit) && limit > 0 ? limit : 10,
    };

    const orders = await reports_model.show_all_comments_reports(filters);

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error fetching comment reports:", error);
    res.status(500).send("Internal Server Error");
  }
};

//NOTE - show all emp_cars

export const show_all_emp_cars_report = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const filters = {
      startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
      endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
      page: !isNaN(page) && page > 0 ? page : 1,
      limit: !isNaN(limit) && limit > 0 ? limit : 10,
    };

    const orders = await reports_model.show_all_emp_cars_reports(filters);

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error fetching comment reports:", error);
    res.status(500).send("Internal Server Error");
  }
};

//NOTE - show all history of emp_cars

export const show_all_history_of_emp_cars_report = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const filters = {
      startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
      endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
      page: !isNaN(page) && page > 0 ? page : 1,
      limit: !isNaN(limit) && limit > 0 ? limit : 10,
    };

    const history = await reports_model.show_all_history_of_emp_cars_reports(filters);
    res.status(200).json({ data: history });
  } catch (error) {
    console.error("Error fetching employee car history reports:", error);
    res.status(500).send("Internal Server Error");
  }
};

//NOTE - show all payments

export const show_all_payments_report = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const filters = {
      startDate: typeof startDate === "string" && !isNaN(Date.parse(startDate)) ? startDate : undefined,
      endDate: typeof endDate === "string" && !isNaN(Date.parse(endDate)) ? endDate : undefined,
      page: !isNaN(page) && page > 0 ? page : 1,
      limit: !isNaN(limit) && limit > 0 ? limit : 10,
    };

    const orders = await reports_model.show_all_payments_reports(filters);

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error fetching comment reports:", error);
    res.status(500).send("Internal Server Error");
  }
};

//NOTE - get total payments

export const get_total_payments = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await reports_model.count_toltal_payments_reports(); // note: check spelling
    res.status(200).json({
      message: "Total payments calculated successfully",
      total_amount: total,
    });
  } catch (error) {
    console.error("Error in getTotalPayments:", error);
    res.status(500).json({
      message: "Failed to calculate total payments",
    });
  }
};

//NOTE - READ EMPLOYEE ID=5

export const show_employee_five_report = async (req: Request, res: Response) => {
  try {
    const { empId } = req.params;
    console.log("Received userId:", empId); // Log to ensure the request is reaching the controller

    const employeeDetails = await reports_model.show_employee_5_reports(Number(empId));
    console.log("Employee Details:", employeeDetails); // Log the result returned by the model

    if (employeeDetails) {
      res.status(200).send(employeeDetails);
    } else {
      res.status(404).send("Employee details not found for this employee");
    }
  } catch (error) {
    console.error("Error fetching employee details by userId:", error);
    res.status(500).send("Failed to fetch employee details");
  }
};


