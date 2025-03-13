import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import user_router from "./src/routes/user.route"; // corrected import user
import employee_router from "./src/routes/employees.route"; // Corrected import employees
import categories_router from "./src/routes/categories.route"; // Corrected import categories
import emp_car_router from "./src/routes/emp_car.route"; // Corrected import emp_car


import { setupSwagger } from "./src/config/swagger"; // Import Swagger setup

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // This will allow all origins by default

// Setup Swagger
setupSwagger(app);

app.use("/users", user_router);
app.use("/employees", employee_router);
app.use("/categories", categories_router);
app.use("/emp_car", emp_car_router);

const port = process.env.PORT || 3306;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
