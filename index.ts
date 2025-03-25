
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import user_router from "./src/routes/user.route";
// import employee_router from "./src/routes/employees.route";
// import categories_router from "./src/routes/categories.route";
// import emp_car_router from "./src/routes/emp_car.route";
// import comments_router from "./src/routes/comments.route";
// import address_users_details_router from "./src/routes/address_users_details.route";
// import service_order_router from "./src/routes/service_order.route";

// import { setupSwagger } from "./src/config/swagger"; // Import Swagger setup

// dotenv.config(); // ✅ โหลดค่าจาก .env

// const app = express();
// app.use(express.json());

// // ✅ ปรับ CORS ให้รองรับเฉพาะ Frontend ของคุณ
// app.use(cors({
//     origin: ['https://homecare-pro.onrender.com'], // อนุญาตเฉพาะ Frontend
//     methods: 'GET, POST, PUT, DELETE, OPTIONS',
//     allowedHeaders: 'Content-Type, Authorization'
// }));

// // ✅ ตั้งค่า Swagger
// setupSwagger(app);

// // ✅ ตั้งค่า Routes
// app.use("/users", user_router);
// app.use("/employees", employee_router);
// app.use("/categories", categories_router);
// app.use("/emp_car", emp_car_router);
// app.use("/comments", comments_router);
// app.use("/address_users_details", address_users_details_router);
// app.use("/service_order", service_order_router);

// // ✅ ใช้ PORT จาก .env หรือค่าเริ่มต้น
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server running at ${process.env.URL || "http://localhost"}:${port}`));

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import user_router from "./src/routes/user.route"; // Adjust path based on your folder structure
// import employee_router from "./src/routes/employees.route";
// import categories_router from "./src/routes/categories.route";
// import emp_car_router from "./src/routes/emp_car.route";
// import comments_router from "./src/routes/comments.route";
// import address_users_details_router from "./src/routes/address_users_details.route";
// import service_order_router from "./src/routes/service_order.route";

// import { setupSwagger } from "./src/config/swagger"; // Swagger setup

// dotenv.config(); // Load environment variables

// const app = express();
// app.use(express.json()); // Middleware to parse JSON request bodies

// // CORS setup (adjust to your frontend origin)
// app.use(cors({
//   origin: ['https://homecare-pro.onrender.com'], // Adjust to your frontend URL
//   methods: 'GET, POST, PUT, DELETE, OPTIONS',
//   allowedHeaders: 'Content-Type, Authorization',
// }));

// // Setup Swagger
// setupSwagger(app);

// // Use routes
// app.use("/users", user_router);
// app.use("/employees", employee_router);
// app.use("/categories", categories_router);
// app.use("/emp_car", emp_car_router);
// app.use("/comments", comments_router);
// app.use("/address_users_details", address_users_details_router);
// app.use("/service_order", service_order_router);

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server running at ${process.env.URL || "http://localhost"}:${port}`);
// });

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

import { setupSwagger } from "./src/config/swagger"; // Swagger setup

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// CORS setup (allowing Swagger UI, frontend, and localhost to access the API)
app.use(cors({
  origin: [
    'https://homecare-pro.onrender.com',  // Your frontend deployed URL
    'http://localhost:5173',  // Allow local frontend (adjust if necessary)
  ],
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true, // Allow cookies and authorization headers
}));

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at ${process.env.URL || "http://localhost"}:${port}`);
});
