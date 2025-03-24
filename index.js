"use strict";
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import user_router from "./src/routes/user.route"; // corrected import user
// import employee_router from "./src/routes/employees.route"; // Corrected import employees
// import categories_router from "./src/routes/categories.route"; // Corrected import categories
// import emp_car_router from "./src/routes/emp_car.route"; // Corrected import emp_car
// import comments_router from "./src/routes/comments.route"; // Corrected import emp_car
// import address_users_details_router from "./src/routes/address_users_details.route"; // Corrected import emp_car
// import service_order_router from "./src/routes/service_order.route"; // Corrected import emp_car
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { setupSwagger } from "./src/config/swagger"; // Import Swagger setup
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors()); // This will allow all origins by default
// // Setup Swagger
// setupSwagger(app);
// app.use("/users", user_router);
// app.use("/employees", employee_router);
// app.use("/categories", categories_router);
// app.use("/emp_car", emp_car_router);
// app.use("/comments", comments_router);
// app.use("/address_users_details", address_users_details_router);
// app.use("/service_order", service_order_router);
// const port = process.env.PORT || 3306;
// app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./src/routes/user.route"));
const employees_route_1 = __importDefault(require("./src/routes/employees.route"));
const categories_route_1 = __importDefault(require("./src/routes/categories.route"));
const emp_car_route_1 = __importDefault(require("./src/routes/emp_car.route"));
const comments_route_1 = __importDefault(require("./src/routes/comments.route"));
const address_users_details_route_1 = __importDefault(require("./src/routes/address_users_details.route"));
const service_order_route_1 = __importDefault(require("./src/routes/service_order.route"));
const swagger_1 = require("./src/config/swagger"); // Import Swagger setup
dotenv_1.default.config(); // ✅ โหลดค่าจาก .env
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ✅ ปรับ CORS ให้รองรับเฉพาะ Frontend ของคุณ
app.use((0, cors_1.default)({
    origin: ['https://homecare-pro.onrender.com'], // อนุญาตเฉพาะ Frontend
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
}));
// ✅ ตั้งค่า Swagger
(0, swagger_1.setupSwagger)(app);
// ✅ ตั้งค่า Routes
app.use("/users", user_route_1.default);
app.use("/employees", employees_route_1.default);
app.use("/categories", categories_route_1.default);
app.use("/emp_car", emp_car_route_1.default);
app.use("/comments", comments_route_1.default);
app.use("/address_users_details", address_users_details_route_1.default);
app.use("/service_order", service_order_route_1.default);
// ✅ ใช้ PORT จาก .env หรือค่าเริ่มต้น
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at ${process.env.URL || "http://localhost"}:${port}`));
