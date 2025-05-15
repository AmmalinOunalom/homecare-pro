import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import user_router from "./src/routes/user.route"; // Adjust path based on your folder structure
import employee_router from "./src/routes/employees.route";
import categories_router from "./src/routes/categories.route";
import emp_car_router from "./src/routes/emp_car.route";
import comments_router from "./src/routes/comments.route";
import address_users_details_router from "./src/routes/address_users_details.route";
import service_order_router from "./src/routes/service_order.route";
import reports_router from "./src/routes/reports.route";

import { setupSwagger } from "./src/config/swagger"; // Swagger setup

dotenv.config(); // Load environment variables


const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies



app.use(cors());
app.use(express.json());


// Setup Swagger
setupSwagger(app);

// Use routes
app.use("/users", user_router);
app.use("/employees", employee_router);
app.use("/categories", categories_router);
app.use("/emp_car", emp_car_router);
app.use("/comments", comments_router);
app.use("/address_users_details", address_users_details_router);
app.use("/service_order", service_order_router);
app.use("/reports", reports_router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at ${process.env.URL || "http://localhost"}:${port}`);
});


