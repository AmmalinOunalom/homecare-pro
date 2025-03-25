"use strict";
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./src/routes/user.route")); // Adjust path based on your folder structure
const employees_route_1 = __importDefault(require("./src/routes/employees.route"));
const categories_route_1 = __importDefault(require("./src/routes/categories.route"));
const emp_car_route_1 = __importDefault(require("./src/routes/emp_car.route"));
const comments_route_1 = __importDefault(require("./src/routes/comments.route"));
const address_users_details_route_1 = __importDefault(require("./src/routes/address_users_details.route"));
const service_order_route_1 = __importDefault(require("./src/routes/service_order.route"));
const swagger_1 = require("./src/config/swagger"); // Swagger setup
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON request bodies
// CORS setup (allowing Swagger UI and frontend to access the API)
app.use((0, cors_1.default)({
    origin: ['https://homecare-pro.onrender.com', 'http://localhost:3000'], // Add localhost if you're testing locally
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow credentials like cookies or authorization headers
}));
// Setup Swagger
(0, swagger_1.setupSwagger)(app);
// Use routes
app.use("/users", user_route_1.default);
app.use("/employees", employees_route_1.default);
app.use("/categories", categories_route_1.default);
app.use("/emp_car", emp_car_route_1.default);
app.use("/comments", comments_route_1.default);
app.use("/address_users_details", address_users_details_route_1.default);
app.use("/service_order", service_order_route_1.default);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at ${process.env.URL || "http://localhost"}:${port}`);
});
